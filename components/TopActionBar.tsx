'use client';

interface TopActionBarProps {
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onDownload: () => void;
  canUndo: boolean;
  canRedo: boolean;
  credits?: number;
  listingAddress?: string;
  imageName?: string;
}

export default function TopActionBar({
  onUndo,
  onRedo,
  onReset,
  onDownload,
  canUndo,
  canRedo,
  credits = 245,
  listingAddress = '123 Main Street',
  imageName = 'Living Room',
}: TopActionBarProps) {
  return (
    <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
      {/* Left: Title & Info */}
      <div className="flex items-center gap-4">
        <h2 className="font-semibold text-gray-900">Image Editor</h2>
        <div className="hidden md:block text-sm text-gray-500">
          {listingAddress} • {imageName}
        </div>
      </div>

      {/* Center: Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 mr-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
              />
            </svg>
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Reset */}
        <button
          onClick={onReset}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          title="Reset all changes"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Download */}
        <button
          onClick={onDownload}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          title="Download image"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span className="hidden sm:inline">Download</span>
        </button>

        {/* Watermark Option */}
        <label className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
          <input type="checkbox" className="rounded" defaultChecked />
          <span className="text-xs">Watermark</span>
        </label>
      </div>

      {/* Right: Credits */}
      <div className="flex items-center gap-3">
        <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="font-semibold text-blue-900">{credits}</span>
          <span className="hidden sm:inline text-blue-700">credits</span>
        </div>
      </div>
    </div>
  );
}
