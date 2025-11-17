'use client';

import { useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ImageCanvas from '@/components/ImageCanvas';
import TopActionBar from '@/components/TopActionBar';
import ToolSidebar, { ToolCategory } from '@/components/ToolSidebar';
import FurnitureSidebar from '@/components/FurnitureSidebar';
import MaskingTool from '@/components/MaskingTool';
import PhotoStrip from '@/components/PhotoStrip';
import EditHistory from '@/components/EditHistory';

interface Edit {
  id: string;
  type: string;
  timestamp: Date;
  description: string;
}

interface Photo {
  id: string;
  url: string;
}

function EditorContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listingId');
  const imageId = searchParams.get('imageId');

  // Sample photos for the listing
  const [photos] = useState<Photo[]>([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
    },
  ]);

  const [currentImageUrl, setCurrentImageUrl] = useState(photos[0]?.url);
  const [activeTool, setActiveTool] = useState<ToolCategory | null>(null);
  const [history, setHistory] = useState<Edit[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [credits, setCredits] = useState(245);
  
  // Masking tool state
  const [maskingTool, setMaskingTool] = useState<'brush' | 'eraser'>('brush');
  const [brushSize, setBrushSize] = useState(20);

  // UI state
  const [showEditHistory, setShowEditHistory] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  // Edit history management
  const addEdit = useCallback((type: string, description: string) => {
    const newEdit: Edit = {
      id: `edit-${Date.now()}`,
      type,
      timestamp: new Date(),
      description,
    };
    
    // Remove any edits after current index (if user went back and made new edit)
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newEdit);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Simulate credit deduction
    setCredits(prev => prev - 1);
  }, [history, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > -1) {
      setHistoryIndex(prev => prev - 1);
      // TODO: Revert to previous state
    }
  }, [historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      // TODO: Apply next state
    }
  }, [historyIndex, history.length]);

  const handleReset = useCallback(() => {
    if (confirm('Are you sure you want to reset all changes? This cannot be undone.')) {
      setHistory([]);
      setHistoryIndex(-1);
      // TODO: Reset image to original
    }
  }, []);

  const handleDownload = useCallback(() => {
    // TODO: Implement download with watermark option
    alert('Download will be implemented with backend integration');
  }, []);

  const handleToolSelect = (tool: ToolCategory) => {
    setActiveTool(tool);
    
    // Auto-add placeholder edit for demo
    if (tool === 'flooring') {
      setTimeout(() => addEdit('flooring', 'Changed floor to hardwood'), 1000);
    }
  };

  const handleFurnitureSelect = (item: any) => {
    addEdit('furniture', `Added ${item.name}`);
  };

  const handlePhotoSelect = (photoId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (photo) {
      setCurrentImageUrl(photo.url);
      // Reset history when changing photos
      setHistory([]);
      setHistoryIndex(-1);
    }
  };

  const handleClearMask = () => {
    // TODO: Clear mask canvas
    console.log('Clear mask');
  };

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Action Bar */}
      <TopActionBar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
        onDownload={handleDownload}
        canUndo={canUndo}
        canRedo={canRedo}
        credits={credits}
        listingAddress="123 Main Street"
        imageName="Living Room"
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tool Categories */}
        <ToolSidebar 
          onSelectTool={handleToolSelect}
          activeTool={activeTool}
        />

        {/* Center - Canvas Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Canvas */}
          <div className="flex-1 relative">
            <ImageCanvas 
              imageUrl={currentImageUrl}
              onImageLoad={setImageDimensions}
            />
            
            {/* Tool-specific overlays */}
            {activeTool === 'masking' && (
              <div className="absolute top-4 left-4 w-80">
                <MaskingTool
                  onToolChange={setMaskingTool}
                  onBrushSizeChange={setBrushSize}
                  onClearMask={handleClearMask}
                  activeTool={maskingTool}
                  brushSize={brushSize}
                />
              </div>
            )}
          </div>

          {/* Bottom - Photo Strip */}
          <div className="bg-white border-t">
            <PhotoStrip />
          </div>
        </div>

        {/* Right Sidebar - Conditional */}
        {activeTool === 'furniture' && (
          <FurnitureSidebar
            onSelectItem={handleFurnitureSelect}
            isVisible={true}
          />
        )}

        {/* Edit History Sidebar - Toggle */}
        {showEditHistory && (
          <div className="w-80 bg-white border-l">
            <EditHistory />
          </div>
        )}
      </div>

      {/* Floating Edit History Toggle (Mobile & Desktop) */}
      <button
        onClick={() => setShowEditHistory(!showEditHistory)}
        className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 group"
        title="Edit History"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {history.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {history.length}
          </span>
        )}
      </button>

      {/* Status Bar (optional info) */}
      {imageDimensions && (
        <div className="hidden lg:block fixed bottom-4 left-4 bg-black bg-opacity-70 text-white text-xs px-3 py-2 rounded">
          {imageDimensions.width} × {imageDimensions.height}px
          {activeTool && ` • ${activeTool.charAt(0).toUpperCase() + activeTool.slice(1)} Tool`}
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
