'use client';

import { useState } from 'react';
import Link from 'next/link';
import UploadBox from '@/components/UploadBox';
import PhotoStripEnhanced from '@/components/PhotoStripEnhanced';

interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

export default function ListingPage({ params }: { params: { listingId: string } }) {
  const { listingId } = params;

  // Placeholder data - will be replaced with real data from API
  const [listing] = useState({
    id: listingId,
    address: '123 Main Street, San Francisco, CA 94102',
    mlsNumber: 'MLS-2024-001',
    status: 'active' as const,
    description: 'Beautiful 3-bedroom home with modern updates throughout.',
  });

  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300',
      width: 1920,
      height: 1280,
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300',
      width: 1920,
      height: 1280,
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300',
      width: 1920,
      height: 1280,
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Add to photos array
      const newPhoto: Photo = {
        id: `temp-${Date.now()}-${i}`,
        url: previewUrl,
        thumbnailUrl: previewUrl,
        width: 1920,
        height: 1280,
      };
      
      setPhotos((prev) => [...prev, newPhoto]);
      setUploadProgress(((i + 1) / files.length) * 100);
    }

    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  const handleGenerateShareLink = async () => {
    setIsGeneratingLink(true);
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          brokerageId: 'demo-brokerage',
          agentId: 'demo-agent',
          expiresInDays: 7,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShareLink(data.data.url);
        navigator.clipboard.writeText(data.data.url);
        alert(`Share link created and copied to clipboard!\n\nExpires: ${data.data.expiresIn}\n\nLink: ${data.data.url}`);
      } else {
        alert(`Failed to create share link: ${data.error}`);
      }
    } catch (error) {
      console.error('Share link error:', error);
      alert('Failed to create share link. Please try again.');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{listing.address}</h1>
                <p className="text-sm text-gray-500">
                  {listing.mlsNumber && `MLS: ${listing.mlsNumber} • `}
                  {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateShareLink}
                disabled={isGeneratingLink}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingLink ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    Share with Buyer
                  </>
                )}
              </button>
              <select className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Listing Info Card */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Listing Details</h2>
              <p className="text-gray-600 text-sm">{listing.description}</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              Active
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-medium text-gray-900">{listing.address}</p>
            </div>
            <div>
              <p className="text-gray-500">MLS Number</p>
              <p className="font-medium text-gray-900">{listing.mlsNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Total Photos</p>
              <p className="font-medium text-gray-900">{photos.length}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Updated</p>
              <p className="font-medium text-gray-900">Today</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Photos</h2>
          <UploadBox onFilesSelected={handleFilesSelected} />
          
          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Uploading...</span>
                <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Photos Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Listing Photos</h2>
            {photos.length > 0 && (
              <p className="text-sm text-gray-500">
                Hover over a photo to edit or delete
              </p>
            )}
          </div>
          
          <PhotoStripEnhanced
            photos={photos}
            listingId={listingId}
            onDelete={handleDeletePhoto}
            showActions={true}
          />
        </div>

        {/* Quick Actions */}
        {photos.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-900 mb-1">Ready to edit?</h3>
                <p className="text-sm text-blue-700">
                  Click &quot;Open Editor&quot; on any photo to start enhancing your listing images with AI-powered tools.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
