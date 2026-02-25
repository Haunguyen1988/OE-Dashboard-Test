export default window.fetch;
export const fetch = window.fetch;
export const Headers = window.Headers;
export const Request = window.Request;
export const Response = window.Response;

export class FormDataShim {
  append() {}
  delete() {}
  get() { return null; }
  getAll() { return []; }
  has() { return false; }
  set() {}
  forEach() {}
  *keys() {}
  *values() {}
  *entries() {}
  [Symbol.iterator]() { return this.entries(); }
}

export const FormData = window.FormData || FormDataShim;
