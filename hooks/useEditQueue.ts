import { useState, useCallback, useRef } from 'react';
import { EditType } from '@/lib/nanoBanana';

interface EditOperation {
  id: string;
  editType: EditType;
  parameters: Record<string, any>;
  maskData?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  resultUrl?: string;
}

interface UseEditQueueOptions {
  imageUrl: string;
  brokerageId: string;
  imageId?: string;
  listingId?: string;
  onEditComplete?: (resultUrl: string, creditsUsed: number) => void;
  onError?: (error: string) => void;
}

export function useEditQueue({
  imageUrl,
  brokerageId,
  imageId,
  listingId,
  onEditComplete,
  onError,
}: UseEditQueueOptions) {
  const [queue, setQueue] = useState<EditOperation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<EditOperation | null>(null);
  const processingRef = useRef(false);

  const processQueue = useCallback(async () => {
    // Prevent concurrent processing
    if (processingRef.current) {
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);

    while (queue.length > 0) {
      const nextEdit = queue[0];
      
      if (nextEdit.status !== 'pending') {
        // Remove already processed edits
        setQueue(prev => prev.slice(1));
        continue;
      }

      // Mark as processing
      setCurrentEdit(nextEdit);
      setQueue(prev => 
        prev.map((edit, idx) => 
          idx === 0 ? { ...edit, status: 'processing' as const } : edit
        )
      );

      try {
        // Call the edit API
        const response = await fetch('/api/edit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl,
            editType: nextEdit.editType,
            parameters: nextEdit.parameters,
            maskData: nextEdit.maskData,
            brokerageId,
            imageId,
            listingId,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Edit failed');
        }

        // Update queue with completed status
        setQueue(prev => 
          prev.map((edit, idx) => 
            idx === 0 
              ? { 
                  ...edit, 
                  status: 'completed' as const, 
                  resultUrl: data.resultUrl 
                } 
              : edit
          )
        );

        // Update the image URL for next edit
        imageUrl = data.resultUrl;

        // Callback on success
        onEditComplete?.(data.resultUrl, data.creditsUsed);

        // Remove completed edit
        setQueue(prev => prev.slice(1));

      } catch (error: any) {
        const errorMessage = error.message || 'Unknown error occurred';
        
        // Update queue with error status
        setQueue(prev => 
          prev.map((edit, idx) => 
            idx === 0 
              ? { 
                  ...edit, 
                  status: 'error' as const, 
                  error: errorMessage 
                } 
              : edit
          )
        );

        // Callback on error
        onError?.(errorMessage);

        // Remove failed edit
        setQueue(prev => prev.slice(1));
      }
    }

    setCurrentEdit(null);
    setIsProcessing(false);
    processingRef.current = false;
  }, [queue, imageUrl, brokerageId, imageId, listingId, onEditComplete, onError]);

  const addToQueue = useCallback((
    editType: EditType,
    parameters: Record<string, any>,
    maskData?: string
  ) => {
    const operation: EditOperation = {
      id: `edit-${Date.now()}-${Math.random()}`,
      editType,
      parameters,
      maskData,
      status: 'pending',
    };

    setQueue(prev => [...prev, operation]);

    // Start processing if not already running
    if (!processingRef.current) {
      setTimeout(() => processQueue(), 0);
    }

    return operation.id;
  }, [processQueue]);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentEdit(null);
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(edit => edit.id !== id));
  }, []);

  return {
    queue,
    currentEdit,
    isProcessing,
    queueLength: queue.length,
    addToQueue,
    clearQueue,
    removeFromQueue,
  };
}
