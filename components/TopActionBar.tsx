'use client';

import Link from 'next/link';

interface TopActionBarProps {
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onDownload: () => void;
  canUndo: boolean;
  canRedo: boolean;
  credits?: number;
  watermarkEnabled?: boolean;
  onWatermarkToggle?: (enabled: boolean) => void;
  listingAddress?: string;
  imageName?: string;
  isBuyerMode?: boolean;
}

export default function TopActionBar({
  onUndo,
  onRedo,
  onReset,
  onDownload,
  canUndo,
  canRedo,
  credits = 245,
  watermarkEnabled = true,
  onWatermarkToggle,
  listingAddress = '123 Main Street',
  imageName = 'Living Room',
  isBuyerMode = false,
}: TopActionBarProps) {
  return (
    <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
      {/* Left: Listing Info */}
      <div className="flex items-center gap-3">
        {!isBuyerMode && (
          <Link
            href="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Dashboard"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        )}
        
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{listingAddress}</h2>
          <p className="text-xs text-gray-500">{imageName}</p>
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
                d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
              />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        {/* Download */}
        <button
          onClick={onDownload}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
          title="Download Image"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span className="hidden md:inline">Download</span>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium"
          title="Reset All Edits"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="hidden md:inline">Reset</span>
        </button>
      </div>

      {/* Right: Credits & Watermark */}
      <div className="flex items-center gap-3">
        {/* Watermark Toggle */}
        {onWatermarkToggle && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={watermarkEnabled}
              onChange={(e) => onWatermarkToggle(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-600">Watermark</span>
          </label>
        )}

        {/* Credits Display */}
        {!isBuyerMode && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm">
              <span className="font-bold text-blue-900">{credits}</span>
              <span className="text-blue-700 ml-1">credits</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
