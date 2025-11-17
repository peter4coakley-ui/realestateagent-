'use client';

interface LoadingOverlayProps {
  message?: string;
  progress?: number;
}

export default function LoadingOverlay({ message = 'Processing...', progress }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>

          {/* Message */}
          <p className="text-lg font-medium text-gray-900 mb-2">{message}</p>
          
          {/* Progress bar if provided */}
          {progress !== undefined && (
            <div className="w-full mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Processing</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* AI Badge */}
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>AI is working its magic...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
