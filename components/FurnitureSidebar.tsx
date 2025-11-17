'use client';

import { useState } from 'react';

interface FurnitureItem {
  id: string;
  name: string;
  category: 'seating' | 'tables' | 'lighting' | 'decor' | 'electronics';
  icon: string;
}

interface FurnitureSidebarProps {
  onSelectItem: (item: FurnitureItem) => void;
  isVisible: boolean;
}

export default function FurnitureSidebar({ onSelectItem, isVisible }: FurnitureSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const furnitureItems: FurnitureItem[] = [
    // Seating
    { id: 'sofa-1', name: 'Modern Sofa', category: 'seating', icon: '🛋️' },
    { id: 'sofa-2', name: 'L-Shape Sofa', category: 'seating', icon: '🛋️' },
    { id: 'chair-1', name: 'Armchair', category: 'seating', icon: '🪑' },
    { id: 'chair-2', name: 'Office Chair', category: 'seating', icon: '🪑' },
    
    // Tables
    { id: 'table-1', name: 'Coffee Table', category: 'tables', icon: '🪑' },
    { id: 'table-2', name: 'Dining Table', category: 'tables', icon: '🪑' },
    { id: 'table-3', name: 'Side Table', category: 'tables', icon: '🪑' },
    
    // Lighting
    { id: 'lamp-1', name: 'Floor Lamp', category: 'lighting', icon: '💡' },
    { id: 'lamp-2', name: 'Table Lamp', category: 'lighting', icon: '💡' },
    { id: 'lamp-3', name: 'Chandelier', category: 'lighting', icon: '💡' },
    
    // Decor
    { id: 'plant-1', name: 'Potted Plant', category: 'decor', icon: '🪴' },
    { id: 'plant-2', name: 'Large Plant', category: 'decor', icon: '🪴' },
    { id: 'rug-1', name: 'Area Rug', category: 'decor', icon: '🧩' },
    { id: 'art-1', name: 'Wall Art', category: 'decor', icon: '🖼️' },
    
    // Electronics
    { id: 'tv-1', name: 'Flat Screen TV', category: 'electronics', icon: '📺' },
    { id: 'tv-2', name: 'Large TV', category: 'electronics', icon: '📺' },
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '📦' },
    { id: 'seating', name: 'Seating', icon: '🛋️' },
    { id: 'tables', name: 'Tables', icon: '🪑' },
    { id: 'lighting', name: 'Lighting', icon: '💡' },
    { id: 'decor', name: 'Decor', icon: '🪴' },
    { id: 'electronics', name: 'Electronics', icon: '📺' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? furnitureItems 
    : furnitureItems.filter(item => item.category === selectedCategory);

  if (!isVisible) return null;

  return (
    <div className="w-64 lg:w-80 bg-white border-l flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>🪑</span>
          Furniture Staging
        </h3>
        <p className="text-xs text-gray-500 mt-1">Click to add to image</p>
      </div>

      {/* Categories */}
      <div className="px-4 py-3 border-b bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group border-2 border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <p className="text-xs font-medium text-gray-900 group-hover:text-blue-900">
                {item.name}
              </p>
              <p className="text-xs text-gray-500 capitalize mt-1">
                {item.category}
              </p>
            </button>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No items in this category</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t bg-gray-50 text-xs text-gray-600">
        <p className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Click an item to place it on your image
        </p>
      </div>
    </div>
  );
}

