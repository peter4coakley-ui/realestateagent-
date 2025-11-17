/**
 * Image Editor Page
 * 
 * Main editing interface for AI-powered real estate image editing.
 * Features:
 * - Multi-tool sidebar (flooring, walls, furniture, etc.)
 * - Interactive canvas with pan/zoom
 * - AI Chat Editor for natural language commands
 * - Sequential edit queue to prevent race conditions
 * - Real-time credit tracking
 * - Undo/redo with full history
 * - Mobile-responsive with collapsible sidebars
 * 
 * @route /editor
 */

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
import ChatEditor from '@/components/ChatEditor';
import { useEditQueue } from '@/hooks/useEditQueue';
import { downloadImageWithWatermark } from '@/lib/watermark';

/**
 * Edit item for history tracking
 */
interface Edit {
  id: string;
  type: string;
  timestamp: Date;
  description: string;
}

/**
 * Editor content component (wrapped in Suspense)
 */
function EditorContent() {
  const searchParams = useSearchParams();
  
  // Initialize with demo image or from URL params
  const initialImage = searchParams.get('imageUrl') || 
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200';

  // === STATE MANAGEMENT ===
  
  // Image and listing state
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(initialImage);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);

  // Edit history state
  const [history, setHistory] = useState<Edit[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [credits, setCredits] = useState(880); // Updated from credit API

  // Active tool state
  const [activeTool, setActiveTool] = useState<ToolCategory | null>(null);

  // Masking tool state
  const [maskingTool, setMaskingTool] = useState<'brush' | 'eraser'>('brush');
  const [brushSize, setBrushSize] = useState(20);
  const [currentMask, setCurrentMask] = useState<string>('');

  // UI visibility state
  const [showEditHistory, setShowEditHistory] = useState(false);
  const [showChatEditor, setShowChatEditor] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [pendingToolType, setPendingToolType] = useState<ToolCategory | null>(null);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);

  // === EDIT QUEUE HOOK ===
  
  /**
   * Sequential edit queue to prevent race conditions
   * Processes edits one at a time, chaining results
   */
  const {
    isProcessing,
    currentEdit,
    queueLength,
    addToQueue,
  } = useEditQueue({
    imageUrl: currentImageUrl,
    brokerageId: 'demo-brokerage',
    onEditComplete: (resultUrl: string, creditsUsed: number) => {
      // Smooth transition to new image
      setIsImageTransitioning(true);
      setTimeout(() => {
        setCurrentImageUrl(resultUrl);
        setCredits(prev => Math.max(0, prev - creditsUsed));
        setTimeout(() => setIsImageTransitioning(false), 300);
      }, 150);
    },
    onError: (error: string) => {
      alert(`Edit failed: ${error}`);
    },
  });

  // === HISTORY MANAGEMENT ===

  /**
   * Add an edit to the history
   */
  const addEdit = useCallback((type: string, description: string) => {
    const newEdit: Edit = {
      id: `edit-${Date.now()}`,
      type,
      timestamp: new Date(),
      description,
    };
    const newHistory = [...history.slice(0, historyIndex + 1), newEdit];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  /**
   * Undo last edit
   */
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex]);

  /**
   * Redo next edit
   */
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  }, [historyIndex, history.length]);

  /**
   * Reset all edits
   */
  const handleReset = useCallback(() => {
    if (confirm('Reset all edits? This cannot be undone.')) {
      setHistory([]);
      setHistoryIndex(-1);
      setCurrentImageUrl(initialImage);
    }
  }, [initialImage]);

  /**
   * Download image with optional watermark
   */
  const handleDownload = useCallback(async () => {
    try {
      await downloadImageWithWatermark(
        currentImageUrl,
        'edited-image.jpg',
        watermarkEnabled
      );
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  }, [currentImageUrl, watermarkEnabled]);

  // === TOOL HANDLERS ===

  /**
   * Handle tool selection from sidebar
   */
  const handleToolSelect = useCallback((tool: ToolCategory) => {
    setActiveTool(tool);
    
    // Tools that need additional parameters
    if (tool === 'flooring' || tool === 'walls' || tool === 'exterior') {
      setPendingToolType(tool);
      setShowOptionsModal(true);
      setShowMobileMenu(false); // Close mobile menu
    } 
    // Removal requires mask first
    else if (tool === 'remove' && !currentMask) {
      alert('Please draw a mask first using the masking tool, then select remove objects.');
    }
  }, [currentMask]);

  /**
   * Apply edit with parameters from modal
   */
  const handleApplyEdit = useCallback((parameters: Record<string, any>) => {
    if (!pendingToolType) return;

    const editType = pendingToolType;
    const maskData = (editType === 'remove' || editType === 'masking') ? currentMask : undefined;

    // Add to queue for sequential processing
    addToQueue(editType, parameters, maskData);
    
    // Track in history
    addEdit(
      editType,
      `Applied ${editType} edit: ${JSON.stringify(parameters).substring(0, 50)}...`
    );

    // Clear modal state
    setPendingToolType(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingToolType, currentMask, addToQueue]);

  /**
   * Handle edits from chat interface
   */
  const handleChatEdit = useCallback((editType: string, parameters: Record<string, any>, maskData?: string) => {
    addToQueue(editType as any, parameters, maskData);
    const description = `Chat: ${editType} - ${JSON.stringify(parameters).substring(0, 40)}...`;
    addEdit(editType, description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToQueue]);

  /**
   * Handle furniture item selection
   */
  const handleFurnitureSelect = useCallback((item: any) => {
    addToQueue('furniture', {
      item: item.name,
      style: item.style || 'modern',
    });
    addEdit('furniture', `Added ${item.name}`);
  }, [addToQueue, addEdit]);

  /**
   * Handle photo selection from strip
   */
  const handlePhotoSelect = useCallback((photoUrl: string) => {
    setIsImageTransitioning(true);
    setTimeout(() => {
      setCurrentImageUrl(photoUrl);
      setTimeout(() => setIsImageTransitioning(false), 300);
    }, 150);
  }, []);

  // === MASKING HANDLERS ===

  const handleClearMask = useCallback(() => {
    setCurrentMask('');
  }, []);

  const handleApplyMask = useCallback((maskData: string) => {
    setCurrentMask(maskData);
    alert('Mask applied! Now select an action (Remove Objects or Masking).');
  }, []);

  // === MOBILE MENU TOGGLE ===

  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setShowMobileMenu(false);
  }, []);

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
        listingAddress="123 Main Street"
        imageName="Living Room"
      />

      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={toggleMobileMenu}
        className="fixed bottom-24 left-4 z-50 lg:hidden p-4 bg-white border-2 border-gray-300 rounded-full shadow-lg active:scale-95 transition-transform"
        aria-label="Open tools menu"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Tools (Desktop: always visible, Mobile: slide-in) */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-72 lg:w-20
          bg-white border-r shadow-lg lg:shadow-none
        `}>
          {/* Mobile close button */}
          <button
            onClick={closeMobileMenu}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <ToolSidebar
            activeTool={activeTool}
            onSelectTool={handleToolSelect}
          />
        </div>

        {/* Mobile overlay */}
        {showMobileMenu && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Center - Canvas and Bottom Strip */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 relative overflow-hidden">
            <div className={`
              h-full w-full transition-opacity duration-300
              ${isImageTransitioning ? 'opacity-0' : 'opacity-100'}
            `}>
              <ImageCanvas
                imageUrl={currentImageUrl}
              />
            </div>

            {/* Masking Tool Overlay */}
            {activeTool === 'masking' && (
              <div className="absolute top-4 left-4 z-10 max-w-xs">
                <MaskingTool
                  activeTool={maskingTool}
                  onToolChange={setMaskingTool}
                  brushSize={brushSize}
                  onBrushSizeChange={setBrushSize}
                  onClearMask={handleClearMask}
                />
              </div>
            )}

            {/* Processing indicator */}
            {isProcessing && (
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  <span className="text-sm font-medium">
                    {currentEdit ? `Processing ${currentEdit.editType}...` : 'Processing...'}
                  </span>
                  {queueLength > 0 && (
                    <span className="text-xs opacity-75">
                      ({queueLength} in queue)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Photo Strip - Hidden on small mobile, visible on tablet+ */}
          <div className="hidden sm:block bg-white border-t">
            <PhotoStrip />
          </div>
        </div>

        {/* Right Sidebar - Conditional (Desktop: side panel, Mobile: full screen) */}
        
        {/* Furniture Sidebar */}
        {activeTool === 'furniture' && !showChatEditor && (
          <div className="hidden lg:block w-80 bg-white border-l overflow-y-auto">
            <FurnitureSidebar
              onSelectItem={handleFurnitureSelect}
              isVisible={true}
            />
          </div>
        )}

        {/* Chat Editor Sidebar */}
        {showChatEditor && (
          <div className={`
            fixed lg:relative inset-0 lg:inset-auto
            w-full lg:w-96 xl:w-[28rem]
            bg-white lg:border-l
            z-50 lg:z-auto
            flex flex-col
            transition-transform duration-300 ease-in-out
            ${showChatEditor ? 'translate-x-0' : 'translate-x-full'}
          `}>
            {/* Mobile close button for chat */}
            <button
              onClick={() => setShowChatEditor(false)}
              className="lg:hidden absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg"
              aria-label="Close chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <ChatEditor
              imageUrl={currentImageUrl}
              onApplyEdit={handleChatEdit}
              isProcessing={isProcessing}
            />
          </div>
        )}

        {/* Edit History Sidebar */}
        {showEditHistory && !showChatEditor && (
          <div className="hidden lg:block w-80 bg-white border-l overflow-y-auto">
            <EditHistory />
          </div>
        )}
      </div>

      {/* Floating Sidebar Toggles */}
      <div className="fixed bottom-6 right-4 lg:bottom-8 lg:right-8 flex flex-col gap-3 z-40">
        {/* Chat Toggle */}
        <button
          onClick={() => {
            setShowChatEditor(!showChatEditor);
            if (!showChatEditor) {
              setShowEditHistory(false);
            }
          }}
          className={`
            p-3 lg:p-4 rounded-full shadow-lg transition-all active:scale-95
            ${showChatEditor 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-blue-500'
            }
          `}
          title="AI Chat Editor"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className={`
            hidden lg:flex p-4 rounded-full shadow-lg transition-all relative
            ${showEditHistory 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-gray-400'
            }
          `}
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
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
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

/**
 * Main Editor Page Component
 * Wraps content in Suspense for Next.js 14 compatibility
 */
export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading editor...</p>
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
