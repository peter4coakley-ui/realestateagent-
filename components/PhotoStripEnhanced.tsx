'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

interface PhotoStripEnhancedProps {
  photos: Photo[];
  listingId: string;
  onDelete?: (photoId: string) => void;
  showActions?: boolean;
}

export default function PhotoStripEnhanced({
  photos,
  listingId,
  onDelete,
  showActions = true,
}: PhotoStripEnhancedProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleDelete = (photoId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this photo?')) {
      onDelete?.(photoId);
    }
  };

  if (photos.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-8 text-center">
        <svg
          className="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-500">No photos uploaded yet</p>
        <p className="text-sm text-gray-400 mt-1">Upload photos above to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">
          Listing Photos ({photos.length})
        </h3>
        {selectedPhoto && (
          <button
            onClick={() => setSelectedPhoto(null)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Deselect
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              selectedPhoto === photo.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Photo */}
            <img
              src={photo.thumbnailUrl || photo.url}
              alt={`Photo ${photo.id}`}
              className="w-full h-full object-cover"
              onClick={() => setSelectedPhoto(photo.id)}
            />

            {/* Overlay Actions */}
            {showActions && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Link
                  href={`/editor?listingId=${listingId}&imageId=${photo.id}`}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open Editor
                </Link>
                {onDelete && (
                  <button
                    onClick={(e) => handleDelete(photo.id, e)}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}

            {/* Dimensions Badge */}
            {photo.width && photo.height && (
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black bg-opacity-60 text-white text-xs rounded">
                {photo.width} × {photo.height}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
