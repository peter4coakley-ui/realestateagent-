'use client';

import { useState } from 'react';
import Link from 'next/link';
import ListingCard from '@/components/ListingCard';

export default function DashboardPage() {
  // Placeholder data - will be replaced with real data from API
  const [credits] = useState(245);
  const [listings] = useState([
    {
      id: '1',
      address: '123 Main Street, San Francisco, CA 94102',
      mlsNumber: 'MLS-2024-001',
      status: 'active' as const,
      imageCount: 12,
      thumbnailUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      address: '456 Oak Avenue, Los Angeles, CA 90210',
      mlsNumber: 'MLS-2024-002',
      status: 'pending' as const,
      imageCount: 8,
      thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
      createdAt: new Date('2024-01-20'),
    },
    {
      id: '3',
      address: '789 Pine Road, San Diego, CA 92101',
      mlsNumber: 'MLS-2024-003',
      status: 'draft' as const,
      imageCount: 5,
      createdAt: new Date('2024-02-01'),
    },
    {
      id: '4',
      address: '321 Elm Street, Sacramento, CA 95814',
      mlsNumber: 'MLS-2024-004',
      status: 'sold' as const,
      imageCount: 15,
      thumbnailUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
      createdAt: new Date('2024-01-10'),
    },
    {
      id: '5',
      address: '555 Maple Drive, San Jose, CA 95113',
      status: 'active' as const,
      imageCount: 0,
      createdAt: new Date('2024-02-05'),
    },
  ]);

  const activeListings = listings.filter((l) => l.status === 'active').length;
  const totalPhotos = listings.reduce((sum, l) => sum + l.imageCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your listings and photos</p>
            </div>
            <Link
              href="/listing/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Listing
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Credits Widget */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">AI Credits</h3>
              <svg
                className="w-5 h-5 opacity-75"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold mb-1">{credits}</p>
            <p className="text-xs opacity-75 mb-3">Available for edits</p>
            <Link
              href="/credits"
              className="text-xs font-medium underline hover:no-underline"
            >
              Purchase More →
            </Link>
          </div>

          {/* Total Listings */}
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Listings</h3>
              <svg
                className="w-5 h-5 text-gray-400"
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
            <p className="text-3xl font-bold text-gray-900">{listings.length}</p>
            <p className="text-xs text-gray-500 mt-1">{activeListings} active</p>
          </div>

          {/* Total Photos */}
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Photos</h3>
              <svg
                className="w-5 h-5 text-gray-400"
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
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalPhotos}</p>
            <p className="text-xs text-gray-500 mt-1">Across all listings</p>
          </div>

          {/* This Month */}
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Edits This Month</h3>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">127</p>
            <p className="text-xs text-gray-500 mt-1">23 credits used</p>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Listings</h2>
            <div className="flex items-center gap-2">
              <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="draft">Draft</option>
              </select>
              <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="photos">Most Photos</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {listings.length === 0 && (
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first listing</p>
            <Link
              href="/listing/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create New Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
