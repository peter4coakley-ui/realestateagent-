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
import LoadingOverlay from '@/components/LoadingOverlay';
import EditOptionsModal from '@/components/EditOptionsModal';
import { useEditQueue } from '@/hooks/useEditQueue';
import { downloadImageWithWatermark } from '@/lib/watermark';

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
  const [currentMask, setCurrentMask] = useState<string>('');

  // UI state
  const [showEditHistory, setShowEditHistory] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [pendingToolType, setPendingToolType] = useState<ToolCategory | null>(null);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);

  // Edit queue hook
  const {
    isProcessing,
    currentEdit,
    queueLength,
    addToQueue,
  } = useEditQueue({
    imageUrl: currentImageUrl,
    brokerageId: 'demo-brokerage-123', // TODO: Get from auth
    imageId: imageId || undefined,
    listingId: listingId || undefined,
    onEditComplete: (resultUrl, creditsUsed) => {
      setCurrentImageUrl(resultUrl);
      setCredits(prev => prev - creditsUsed);
    },
    onError: (error) => {
      alert(`Edit failed: ${error}`);
    },
  });

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

  const handleDownload = useCallback(async () => {
    try {
      await downloadImageWithWatermark(
        currentImageUrl,
        `edited-${Date.now()}.png`,
        watermarkEnabled
      );
    } catch (error) {
      alert('Download failed. Please try again.');
      console.error('Download error:', error);
    }
  }, [currentImageUrl, watermarkEnabled]);

  const handleToolSelect = (tool: ToolCategory) => {
    setActiveTool(tool);
    
    // For tools that need options, show modal
    if (tool === 'flooring' || tool === 'walls' || tool === 'exterior') {
      setPendingToolType(tool);
      setShowOptionsModal(true);
    } else if (tool === 'remove' && !currentMask) {
      alert('Please draw a mask first using the masking tool, then select remove objects.');
    }
  };

  const handleApplyEdit = useCallback((parameters: Record<string, any>) => {
    if (!pendingToolType) return;

    const editType = pendingToolType;
    const maskData = (editType === 'remove' || editType === 'masking') ? currentMask : undefined;

    // Add to queue
    addToQueue(editType, parameters, maskData);

    // Add to history
    addEdit(
      editType,
      `Applied ${editType} edit: ${JSON.stringify(parameters).substring(0, 50)}...`
    );

    // Clear pending
    setPendingToolType(null);
  }, [pendingToolType, currentMask, addToQueue]);

  const handleFurnitureSelect = (item: any) => {
    // Add furniture to queue
    addToQueue('furniture', {
      item: item.name,
      style: 'modern',
    });

    // Add to history
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
    setCurrentMask('');
  };

  const handleApplyMask = () => {
    if (!currentMask) {
      alert('Please draw a mask first');
      return;
    }

    // When user finishes masking, they can apply removal
    if (confirm('Apply object removal with this mask?')) {
      addToQueue('remove', { preserveBackground: true }, currentMask);
      addEdit('remove', 'Removed object with mask');
      setCurrentMask('');
    }
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
                <button
                  onClick={handleApplyMask}
                  className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply Mask & Remove Object
                </button>
              </div>
            )}

            {/* Loading overlay */}
            {isProcessing && (
              <LoadingOverlay
                message={
                  currentEdit
                    ? `Applying ${currentEdit.editType} edit...`
                    : 'Processing edit...'
                }
              />
            )}

            {/* Queue indicator */}
            {queueLength > 0 && (
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm font-medium">
                  {queueLength} {queueLength === 1 ? 'edit' : 'edits'} queued
                </p>
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

      {/* Edit Options Modal */}
      {showOptionsModal && pendingToolType && (
        <EditOptionsModal
          isOpen={showOptionsModal}
          onClose={() => {
            setShowOptionsModal(false);
            setPendingToolType(null);
          }}
          toolType={pendingToolType}
          onSubmit={handleApplyEdit}
        />
      )}

      {/* Watermark Toggle (moved to editor) */}
      <div className="fixed bottom-4 right-24 lg:right-32 bg-white border rounded-lg shadow-lg px-3 py-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={watermarkEnabled}
            onChange={(e) => setWatermarkEnabled(e.target.checked)}
            className="rounded"
          />
          <span>Add watermark</span>
        </label>
      </div>
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
