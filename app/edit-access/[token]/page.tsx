'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ImageCanvas from '@/components/ImageCanvas';
import TopActionBar from '@/components/TopActionBar';
import ToolSidebar, { ToolCategory } from '@/components/ToolSidebar';
import FurnitureSidebar from '@/components/FurnitureSidebar';
import MaskingTool from '@/components/MaskingTool';
import PhotoStrip from '@/components/PhotoStrip';
import EditHistory from '@/components/EditHistory';
import LoadingOverlay from '@/components/LoadingOverlay';
import EditOptionsModal from '@/components/EditOptionsModal';
import ChatEditor from '@/components/ChatEditor';
import { useEditQueue } from '@/hooks/useEditQueue';
import { downloadImageWithWatermark } from '@/lib/watermark';
import { validateShareToken, ShareLinkPayload } from '@/lib/sharing';

interface Edit {
  id: string;
  type: string;
  timestamp: Date;
  description: string;
}

function BuyerEditorContent() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  // Token validation state
  const [isValidating, setIsValidating] = useState(true);
  const [tokenData, setTokenData] = useState<ShareLinkPayload | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Image and listing state
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200'
  );
  const [listingId, setListingId] = useState<string>('');

  // Edit history state
  const [history, setHistory] = useState<Edit[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [credits, setCredits] = useState(0);

  // Tool state
  const [activeTool, setActiveTool] = useState<ToolCategory | null>(null);

  // Masking tool state
  const [maskingTool, setMaskingTool] = useState<'brush' | 'eraser'>('brush');
  const [brushSize, setBrushSize] = useState(20);
  const [currentMask, setCurrentMask] = useState<string>('');

  // UI state
  const [showEditHistory, setShowEditHistory] = useState(false);
  const [showChatEditor, setShowChatEditor] = useState(true);
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
    brokerageId: tokenData?.brokerageId || 'demo-brokerage',
    onEditComplete: (resultUrl: string, creditsUsed: number) => {
      setCurrentImageUrl(resultUrl);
      setCredits(prev => Math.max(0, prev - creditsUsed));
    },
    onError: (error: string) => {
      alert(`Edit failed: ${error}`);
    },
  });

  // Validate token on mount
  useEffect(() => {
    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const validateToken = async () => {
    setIsValidating(true);
    try {
      const response = await fetch(`/api/share?action=validate&token=${token}`);
      const data = await response.json();

      if (!data.success) {
        setTokenError(data.error || 'Invalid share link');
        return;
      }

      setTokenData(data.data);
      setListingId(data.data.listingId);
      setCredits(data.data.credits || 0);
    } catch (error) {
      console.error('Token validation error:', error);
      setTokenError('Failed to validate share link');
    } finally {
      setIsValidating(false);
    }
  };

  const addEdit = (type: string, description: string) => {
    const newEdit: Edit = {
      id: `edit-${Date.now()}`,
      type,
      timestamp: new Date(),
      description,
    };
    const newHistory = [...history.slice(0, historyIndex + 1), newEdit];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all edits? This cannot be undone.')) {
      setHistory([]);
      setHistoryIndex(-1);
      setCurrentImageUrl('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200');
    }
  };

  const handleDownload = async () => {
    await downloadImageWithWatermark(currentImageUrl, 'edited-image.jpg', watermarkEnabled);
  };

  const handleToolSelect = (tool: ToolCategory) => {
    setActiveTool(tool);
    
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

    addToQueue(editType, parameters, maskData);
    addEdit(
      editType,
      `Applied ${editType} edit: ${JSON.stringify(parameters).substring(0, 50)}...`
    );

    setPendingToolType(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingToolType, currentMask, addToQueue]);

  const handleChatEdit = useCallback((editType: string, parameters: Record<string, any>, maskData?: string) => {
    addToQueue(editType as any, parameters, maskData);
    const description = `Chat: ${editType} - ${JSON.stringify(parameters).substring(0, 40)}...`;
    addEdit(editType, description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToQueue]);

  const handleFurnitureSelect = (item: any) => {
    addToQueue('furniture', {
      item: item.name,
      style: item.style || 'modern',
    });
    addEdit('furniture', `Added ${item.name}`);
  };

  const handlePhotoSelect = (photoUrl: string) => {
    setCurrentImageUrl(photoUrl);
  };

  const handleClearMask = () => {
    setCurrentMask('');
  };

  const handleApplyMask = (maskData: string) => {
    setCurrentMask(maskData);
    alert('Mask applied! Now select an action (Remove Objects or Masking).');
  };

  // Show loading state during validation
  if (isValidating) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Validating access...</p>
        </div>
      </div>
    );
  }

  // Show error state if token is invalid
  if (tokenError) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{tokenError}</p>
          <p className="text-sm text-gray-500">Please contact the agent who shared this link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Top Action Bar */}
      <TopActionBar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
        onDownload={handleDownload}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        credits={credits}
        watermarkEnabled={watermarkEnabled}
        onWatermarkToggle={setWatermarkEnabled}
        listingAddress="Buyer Preview"
        imageName={currentImageUrl.split('/').pop() || 'image'}
        isBuyerMode={true}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <ToolSidebar
          activeTool={activeTool}
          onSelectTool={handleToolSelect}
        />

        {/* Center - Canvas and Bottom Strip */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Canvas Area */}
          <div className="flex-1 relative overflow-hidden">
            <ImageCanvas
              imageUrl={currentImageUrl}
            />

            {/* Masking Tool Overlay */}
            {activeTool === 'masking' && (
              <div className="absolute top-4 left-4 z-10">
                <MaskingTool
                  activeTool={maskingTool}
                  onToolChange={setMaskingTool}
                  brushSize={brushSize}
                  onBrushSizeChange={setBrushSize}
                  onClearMask={handleClearMask}
                />
              </div>
            )}

            {/* Buyer Access Banner */}
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm font-medium">Buyer Preview Mode</span>
              </div>
            </div>
          </div>

          {/* Photo Strip */}
          <div className="bg-white border-t">
            <PhotoStrip />
          </div>
        </div>

        {/* Right Sidebar - Conditional */}
        {activeTool === 'furniture' && !showChatEditor && (
          <FurnitureSidebar
            onSelectItem={handleFurnitureSelect}
            isVisible={true}
          />
        )}

        {/* Chat Editor Sidebar */}
        {showChatEditor && (
          <div className="w-96 lg:w-[28rem] bg-white border-l flex flex-col">
            <ChatEditor
              imageUrl={currentImageUrl}
              onApplyEdit={handleChatEdit}
              isProcessing={isProcessing}
            />
          </div>
        )}

        {/* Edit History Sidebar */}
        {showEditHistory && !showChatEditor && (
          <div className="w-80 bg-white border-l">
            <EditHistory />
          </div>
        )}
      </div>

      {/* Floating Sidebar Toggles */}
      <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 flex flex-col gap-3 z-50">
        {/* Chat Toggle */}
        <button
          onClick={() => {
            setShowChatEditor(!showChatEditor);
            if (!showChatEditor) {
              setShowEditHistory(false);
            }
          }}
          className={`p-4 rounded-full shadow-lg transition-all ${
            showChatEditor 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-blue-500'
          }`}
          title="AI Chat Editor"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>

        {/* History Toggle */}
        <button
          onClick={() => {
            setShowEditHistory(!showEditHistory);
            if (!showEditHistory) {
              setShowChatEditor(false);
            }
          }}
          className={`p-4 rounded-full shadow-lg transition-all ${
            showEditHistory 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-gray-400'
          }`}
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
      </div>

      {/* Loading Overlay */}
      {isProcessing && (
        <LoadingOverlay
          message={currentEdit ? `Processing ${currentEdit.editType}...` : 'Processing edit...'}
        />
      )}

      {/* Edit Options Modal */}
      {showOptionsModal && pendingToolType && (
        <EditOptionsModal
          isOpen={showOptionsModal}
          onClose={() => {
            setShowOptionsModal(false);
            setPendingToolType(null);
          }}
          onSubmit={handleApplyEdit}
          toolType={pendingToolType}
        />
      )}
    </div>
  );
}

export default function BuyerEditorPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    }>
      <BuyerEditorContent />
    </Suspense>
  );
}
