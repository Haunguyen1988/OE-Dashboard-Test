# 💡 BRIEF: Live Flight Tracking — OpenSky Network API Integration

**Ngày tạo:** 2026-02-26
**Brainstorm cùng:** haunguyen

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT

OE Dashboard hiện có **Network Map View** nhưng đang dùng **placeholder dots random** — không phản ánh vị trí thực tế của máy bay. Thông tin airborne/status chỉ dựa vào AIMS sync, không có vị trí real-time.

**Hệ quả:**
- Không thấy được máy bay VJ đang ở đâu trên bản đồ
- Không phân biệt được trực quan chuyến bay nào đang delay route
- Network View thiếu giá trị thực tế cho OCC/OMC team

## 2. GIẢI PHÁP ĐỀ XUẤT

Tích hợp **OpenSky Network REST API** để lấy **vị trí real-time** (lat, lon, altitude, velocity, heading) của fleet VJ → hiển thị trên **bản đồ thật** trong Network View.

**Cách hoạt động:**
1. Gọi `/states/all` với bounding box khu vực VN + SEA (hoặc filter theo VJ callsigns)
2. **Match callsign** (VJxxx) với flight data trong Supabase → enriched live data
3. Hiển thị trên **interactive map** (Leaflet + OpenStreetMap) thay vì placeholder hiện tại
4. Auto-refresh mỗi 15-30 giây

## 3. ĐỐI TƯỢNG SỬ DỤNG

- **Primary:** OCC/OMC controllers — cần biết máy bay đang ở đâu real-time
- **Secondary:** Management — tổng quan fleet operations

## 4. NGHIÊN CỨU THỊ TRƯỜNG

### Đối thủ:

| App | Điểm mạnh | Điểm yếu |
|-----|-----------|----------|
| FlightRadar24 | UI đẹp, 3D view, ảnh máy bay, coverage rộng | Trả phí cho advanced, không tích hợp nội bộ |
| FlightAware | Dữ liệu chuyên sâu, weather overlay, GA tracking | Delay 30s-2min, API trả phí cao |
| OpenSky Network | **Miễn phí**, API mở, raw ADS-B data, nghiên cứu | Coverage tập trung EU/US, ít feature UI |

### Điểm khác biệt của mình:
- **Tích hợp trực tiếp** vào OE Dashboard — không cần mở app khác
- **Cross-reference** với AIMS data (delay, status, crew, aircraft) — FlightRadar không có
- **Tập trung VJ fleet** — chỉ hiện máy bay của mình, không có noise
- **Zero cost** — dùng OpenSky free tier

## 5. TÍNH NĂNG

### 🚀 MVP (Bắt buộc có):
- [ ] **Interactive Map** — Leaflet + OpenStreetMap tiles thay thế placeholder
- [ ] **Live Aircraft Positions** — Vị trí real-time fleet VJ từ OpenSky `/states/all`
- [ ] **Callsign Matching** — Map VJxxx callsign → flight data trong Supabase
- [ ] **Aircraft Popup** — Click vào máy bay → thấy flight number, route, altitude, speed
- [ ] **Auto-refresh** — Cập nhật vị trí mỗi 30s (tiết kiệm credits)
- [ ] **Airport Markers** — Hiện các sân bay chính của VJ từ `airports` table

### 🎁 Phase 2 (Làm sau):
- [ ] **Flight Trail** — Đường bay đã đi (trajectory từ `/tracks/aircraft`)
- [ ] **Status Color Coding** — Đổi màu theo status: on-time (xanh), delayed (cam), critical (đỏ)
- [ ] **Weather Overlay** — Kết hợp weather data hiện có lên map
- [ ] **Click-to-Detail** — Click máy bay → mở FlightDetailView
- [ ] **Bounding Box filter** — Chỉ track trong khu vực VN/SEA để tiết kiệm API credits

### 💭 Backlog (Cân nhắc):
- [ ] Cross-validate: so sánh OpenSky position vs AIMS status để phát hiện bất thường
- [ ] Replay mode: xem lại flights trong ngày
- [ ] Heatmap: density map các route bận nhất

## 6. ƯỚC TÍNH SƠ BỘ

### Độ phức tạp: **Trung bình**

| Thành phần | Độ khó | Lưu ý |
|-----------|--------|-------|
| Cài Leaflet + map tiles | 🟢 Dễ | npm install, tạo base map |
| OpenSky API hook | 🟢 Dễ | REST call đơn giản, filter callsign |
| Callsign matching logic | 🟡 TB | Cần match VJ callsign format với Supabase data |
| Interactive aircraft markers | 🟡 TB | Leaflet markers + popup + rotation theo heading |
| Auto-refresh + credit management | 🟡 TB | Polling interval + error handling cho rate limit |

### Rủi ro:

| Rủi ro | Mức độ | Giải pháp |
|--------|--------|-----------|
| OpenSky rate limit (4000 credits/ngày) | 🟡 Trung bình | Refresh 30-60s, cache response, chỉ query khu vực cần thiết |
| Coverage khu vực VN/SEA có thể ít | 🟡 Trung bình | Fallback: hiện vị trí cuối cùng known, dùng AIMS status |
| OpenSky API downtime | 🟢 Thấp | Graceful fallback về AIMS-only mode (như hiện tại) |
| ICAO24 hex mapping | 🟡 Trung bình | Cần bảng mapping registration → ICAO24, hoặc dùng callsign filter |
| Non-commercial use restriction | 🔴 Quan trọng | Dashboard nội bộ có thể cần xin phép OpenSky nếu dùng chính thức |

### Credit Budget Estimate:
- 1 request `/states/all` with bounding box ≈ **1 credit** (nhỏ hơn toàn cầu)
- Refresh mỗi 30s = **2,880 requests/ngày**
- Free tier: **4,000 credits/ngày** → ✅ Đủ (còn dư buffer)

## 7. TECHNICAL NOTES

### Data Flow:
```
OpenSky API (/states/all?lamin=...&lomax=...)
    ↓ fetch every 30s
useOpenSky() hook (frontend)
    ↓ match callsign "VJxxx" 
Supabase flights (carrier_code + flight_number)
    ↓ merge
NetworkView.tsx (Leaflet Map)
    → Aircraft markers with enriched data
    → Airport markers from airports table
```

### OpenSky State Vector → Dashboard Mapping:
| OpenSky Field | Dùng cho | Hiển thị |
|--------------|----------|----------|
| `callsign` | Match "VJxxx" → flight table | Flight number |
| `latitude/longitude` | Vị trí trên map | Aircraft marker position |
| `baro_altitude` | Thông tin bay | Popup: "FL350" |
| `velocity` | Tốc độ | Popup: "450 kts" |
| `true_track` | Hướng bay | Rotate aircraft icon |
| `on_ground` | Trạng thái | Ground vs Airborne indicator |
| `vertical_rate` | Climbing/descending | Arrow indicator |

### Mapping Library Recommendation: **Leaflet + React-Leaflet**
- Miễn phí, open-source
- Tile source: OpenStreetMap (free) hoặc CartoDB dark theme (match dashboard)
- Nhẹ, không cần API key (khác Mapbox/Google Maps)
- Phù hợp dark theme của dashboard hiện tại

## 8. BƯỚC TIẾP THEO

→ Chạy `/plan` để lên thiết kế chi tiết implementation
