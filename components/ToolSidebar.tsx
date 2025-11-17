'use client';

import { useState } from 'react';

export type ToolCategory = 
  | 'flooring' 
  | 'walls' 
  | 'furniture' 
  | 'remove' 
  | 'masking' 
  | 'exterior';

interface ToolSidebarProps {
  onSelectTool: (tool: ToolCategory) => void;
  activeTool: ToolCategory | null;
}

export default function ToolSidebar({ onSelectTool, activeTool }: ToolSidebarProps) {
  const tools = [
    {
      id: 'flooring' as ToolCategory,
      name: 'Flooring',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      description: 'Change floor materials',
    },
    {
      id: 'walls' as ToolCategory,
      name: 'Walls',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      description: 'Change wall colors & textures',
    },
    {
      id: 'furniture' as ToolCategory,
      name: 'Furniture',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      description: 'Add staging furniture',
    },
    {
      id: 'remove' as ToolCategory,
      name: 'Remove Objects',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      description: 'Remove unwanted objects',
    },
    {
      id: 'masking' as ToolCategory,
      name: 'Masking',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      ),
      description: 'Draw precise masks',
    },
    {
      id: 'exterior' as ToolCategory,
      name: 'Exterior Tools',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
      ),
      description: 'Grass, sky, siding, snow',
    },
  ];

  return (
    <div className="w-20 lg:w-64 bg-white border-r flex flex-col overflow-y-auto">
      <div className="p-4 border-b hidden lg:block">
        <h3 className="font-semibold text-gray-900">Editing Tools</h3>
        <p className="text-xs text-gray-500 mt-1">Select a tool to begin</p>
      </div>

      <div className="flex-1 p-2 space-y-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className={`w-full p-3 rounded-lg transition-all flex flex-col lg:flex-row items-center lg:items-start gap-2 lg:gap-3 text-left ${
              activeTool === tool.id
                ? 'bg-blue-50 border-2 border-blue-500 text-blue-900'
                : 'hover:bg-gray-50 border-2 border-transparent text-gray-700'
            }`}
          >
            <div className={`flex-shrink-0 ${activeTool === tool.id ? 'text-blue-600' : 'text-gray-400'}`}>
              {tool.icon}
            </div>
            <div className="hidden lg:block">
              <div className="font-medium text-sm">{tool.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{tool.description}</div>
            </div>
            <div className="lg:hidden text-xs text-center mt-1">{tool.name}</div>
          </button>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="hidden lg:block p-4 border-t bg-gray-50">
        <div className="text-xs text-gray-600">
          <p className="font-medium mb-2">💡 Quick Tip</p>
          <p>
            {activeTool === 'flooring' && 'Select the floor area, then choose a material from the options.'}
            {activeTool === 'walls' && 'Click on wall areas to change colors or add textures.'}
            {activeTool === 'furniture' && 'Drag items from the right sidebar onto your image.'}
            {activeTool === 'remove' && 'Draw around objects you want to remove with AI inpainting.'}
            {activeTool === 'masking' && 'Use the brush tool to paint precise selection masks.'}
            {activeTool === 'exterior' && 'Enhance landscaping, remove snow, or improve the sky.'}
            {!activeTool && 'Select a tool from the list above to start editing your image.'}
          </p>
        </div>
      </div>
    </div>
  );
}
