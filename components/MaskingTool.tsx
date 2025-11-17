'use client';

import { useState } from 'react';

interface MaskingToolProps {
  onToolChange: (tool: 'brush' | 'eraser') => void;
  onBrushSizeChange: (size: number) => void;
  onClearMask: () => void;
  activeTool: 'brush' | 'eraser';
  brushSize: number;
}

export default function MaskingTool({
  onToolChange,
  onBrushSizeChange,
  onClearMask,
  activeTool,
  brushSize,
}: MaskingToolProps) {
  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Masking Tools
        </h3>
        <p className="text-xs text-gray-500">Draw to select areas</p>
      </div>

      {/* Tool Selection */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Active Tool</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onToolChange('brush')}
            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
              activeTool === 'brush'
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <span className="text-xs font-medium">Brush</span>
          </button>
          
          <button
            onClick={() => onToolChange('eraser')}
            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
              activeTool === 'eraser'
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="text-xs font-medium">Eraser</span>
          </button>
        </div>
      </div>

      {/* Brush Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-700">Brush Size</label>
          <span className="text-xs text-gray-500">{brushSize}px</span>
        </div>
        <input
          type="range"
          min="5"
          max="100"
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Small</span>
          <span>Large</span>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Brush Preview</label>
        <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
          <div
            className="rounded-full bg-blue-500 opacity-50"
            style={{
              width: `${Math.min(brushSize, 60)}px`,
              height: `${Math.min(brushSize, 60)}px`,
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2 border-t">
        <button
          onClick={onClearMask}
          className="w-full px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Clear Mask
        </button>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
        <p className="font-medium mb-1">💡 Quick Tips</p>
        <ul className="space-y-1 text-blue-800">
          <li>• Paint over areas to select</li>
          <li>• Use eraser to refine edges</li>
          <li>• Larger brush for quick coverage</li>
        </ul>
      </div>
    </div>
  );
}

