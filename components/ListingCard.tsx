'use client';

import Link from 'next/link';

interface ListingCardProps {
  id: string;
  address: string;
  mlsNumber?: string;
  status: 'active' | 'pending' | 'sold' | 'draft';
  imageCount: number;
  thumbnailUrl?: string;
  createdAt: Date;
}

export default function ListingCard({
  id,
  address,
  mlsNumber,
  status,
  imageCount,
  thumbnailUrl,
  createdAt,
}: ListingCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-blue-100 text-blue-800',
    draft: 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    active: 'Active',
    pending: 'Pending',
    sold: 'Sold',
    draft: 'Draft',
  };

  return (
    <Link href={`/listing/${id}`}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Thumbnail */}
        <div className="aspect-video bg-gray-100 relative">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={address}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
            {address}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            {mlsNumber && <span>MLS: {mlsNumber}</span>}
            <span>{imageCount} {imageCount === 1 ? 'photo' : 'photos'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {createdAt.toLocaleDateString()}
            </span>
            <span className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
