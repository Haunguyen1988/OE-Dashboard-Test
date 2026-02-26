import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading data...' }) => (
    <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="size-10 border-4 border-red-500/20 border-t-[#db1f25] rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-white/60">{message}</p>
    </div>
);

export const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="size-12 rounded-full bg-red-500/20 flex items-center justify-center text-[#db1f25]">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.27 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
        </div>
        <p className="text-sm font-medium text-[#db1f25]">{message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="px-4 py-2 bg-[#db1f25] text-white rounded-lg text-xs font-bold hover:bg-[#db1f25]/80 transition-colors"
            >
                Retry
            </button>
        )}
    </div>
);
