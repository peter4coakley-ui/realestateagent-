'use client';

import { useState } from 'react';
import { ToolCategory } from './ToolSidebar';

interface EditOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolType: ToolCategory;
  onSubmit: (parameters: Record<string, any>) => void;
}

export default function EditOptionsModal({
  isOpen,
  onClose,
  toolType,
  onSubmit,
}: EditOptionsModalProps) {
  const [options, setOptions] = useState<Record<string, any>>({});

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(options);
    setOptions({});
    onClose();
  };

  const renderOptions = () => {
    switch (toolType) {
      case 'flooring':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material
              </label>
              <select
                value={options.material || 'hardwood'}
                onChange={(e) => setOptions({ ...options, material: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="hardwood">Hardwood</option>
                <option value="tile">Tile</option>
                <option value="carpet">Carpet</option>
                <option value="laminate">Laminate</option>
                <option value="vinyl">Vinyl</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color (optional)
              </label>
              <input
                type="text"
                value={options.color || ''}
                onChange={(e) => setOptions({ ...options, color: e.target.value })}
                placeholder="e.g., oak, cherry"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );

      case 'walls':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="color"
                value={options.color || '#FFFFFF'}
                onChange={(e) => setOptions({ ...options, color: e.target.value })}
                className="w-full h-12 px-2 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texture
              </label>
              <select
                value={options.texture || 'smooth'}
                onChange={(e) => setOptions({ ...options, texture: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="smooth">Smooth</option>
                <option value="textured">Textured</option>
                <option value="wallpaper">Wallpaper</option>
              </select>
            </div>
          </>
        );

      case 'exterior':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enhancement Type
            </label>
            <select
              value={options.operation || 'grass_enhance'}
              onChange={(e) => setOptions({ ...options, operation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="grass_enhance">Enhance Grass</option>
              <option value="sky_improve">Improve Sky</option>
              <option value="snow_remove">Remove Snow</option>
              <option value="siding_change">Change Siding</option>
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {toolType.charAt(0).toUpperCase() + toolType.slice(1)} Options
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {renderOptions()}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply Edit
          </button>
        </div>
      </div>
    </div>
  );
}
