'use client';

import { useState, useRef, useEffect } from 'react';
import SuggestedEdits from './SuggestedEdits';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  editAction?: {
    type: string;
    parameters: Record<string, any>;
  };
}

interface ImageInsights {
  roomType: string;
  objects: string[];
  dominantColors: string[];
  lighting: string;
  suggestedEdits: string[];
}

interface ChatEditorProps {
  imageUrl: string;
  onApplyEdit: (editType: string, parameters: Record<string, any>, maskData?: string) => void;
  isProcessing?: boolean;
}

export default function ChatEditor({ imageUrl, onApplyEdit, isProcessing = false }: ChatEditorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [insights, setInsights] = useState<ImageInsights | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Analyze image when it changes
  useEffect(() => {
    if (imageUrl) {
      analyzeImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();
      
      if (data.success) {
        setInsights(data.insights);
        
        // Add initial assistant message with insights
        const insightMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `I've analyzed this image. ${generateInsightText(data.insights)}`,
          timestamp: new Date(),
        };
        setMessages([insightMessage]);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateInsightText = (insights: ImageInsights): string => {
    const parts = [];
    
    if (insights.roomType) {
      parts.push(`This is a ${insights.roomType.replace('_', ' ')}`);
    }
    
    if (insights.objects.length > 0) {
      const objectList = insights.objects.slice(0, 3).join(', ');
      parts.push(`I can see ${objectList}`);
    }
    
    if (insights.dominantColors.length > 0) {
      parts.push(`The dominant colors are ${insights.dominantColors.slice(0, 2).join(' and ')}`);
    }
    
    if (insights.lighting) {
      parts.push(`with ${insights.lighting} lighting`);
    }

    return parts.join('. ') + '. What would you like to change?';
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowSuggestions(false);

    // Parse the instruction
    const editAction = parseInstruction(input);

    if (editAction) {
      // Add processing message
      const processingMessage: ChatMessage = {
        id: `msg-${Date.now()}-proc`,
        role: 'assistant',
        content: `I'll ${editAction.description}. Processing now...`,
        timestamp: new Date(),
        editAction,
      };
      setMessages(prev => [...prev, processingMessage]);

      // Apply the edit
      onApplyEdit(editAction.type, editAction.parameters, editAction.maskData);

      // Add completion message after a delay
      setTimeout(() => {
        const completionMessage: ChatMessage = {
          id: `msg-${Date.now()}-complete`,
          role: 'assistant',
          content: `Done! I've ${editAction.description}. What else would you like to change?`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, completionMessage]);
      }, 2000);
    } else {
      // Couldn't parse instruction
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: `I'm not sure how to do that. Try something like &quot;change the walls to blue&quot; or &quot;add a sofa&quot;.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const parseInstruction = (instruction: string): any => {
    const lower = instruction.toLowerCase();

    // Wall color changes
    if (lower.includes('wall') && (lower.includes('paint') || lower.includes('color') || lower.includes('change'))) {
      const colors = ['blue', 'green', 'white', 'beige', 'gray', 'yellow', 'red'];
      const detectedColor = colors.find(c => lower.includes(c)) || 'white';
      
      return {
        type: 'walls',
        parameters: {
          color: detectedColor === 'blue' && lower.includes('ice') ? '#B0E0E6' : getColorHex(detectedColor),
          texture: 'smooth',
        },
        description: `change the walls to ${detectedColor}`,
      };
    }

    // Flooring changes
    if (lower.includes('floor') || lower.includes('flooring')) {
      const materials = ['hardwood', 'tile', 'carpet', 'laminate', 'vinyl'];
      const detectedMaterial = materials.find(m => lower.includes(m)) || 'hardwood';
      
      return {
        type: 'flooring',
        parameters: {
          material: detectedMaterial,
        },
        description: `change the flooring to ${detectedMaterial}`,
      };
    }

    // Add furniture
    if (lower.includes('add') && (lower.includes('sofa') || lower.includes('couch') || lower.includes('chair') || lower.includes('table'))) {
      const furniture = lower.includes('sofa') || lower.includes('couch') ? 'Modern Sofa' :
                        lower.includes('chair') ? 'Armchair' :
                        lower.includes('table') ? 'Coffee Table' : 'Modern Sofa';
      
      return {
        type: 'furniture',
        parameters: {
          item: furniture,
          style: 'modern',
        },
        description: `add a ${furniture.toLowerCase()}`,
      };
    }

    // Remove objects
    if (lower.includes('remove') || lower.includes('delete')) {
      const objects = ['chair', 'table', 'sofa', 'couch', 'lamp', 'plant'];
      const detectedObject = objects.find(o => lower.includes(o)) || 'object';
      
      return {
        type: 'remove',
        parameters: {
          objectType: detectedObject,
          preserveBackground: true,
        },
        description: `remove the ${detectedObject}`,
        maskData: '', // Note: This would need actual mask data
      };
    }

    // Exterior enhancements
    if (lower.includes('grass') || lower.includes('lawn') || lower.includes('yard')) {
      return {
        type: 'exterior',
        parameters: {
          operation: 'grass_enhance',
          intensity: 0.8,
        },
        description: 'enhance the grass',
      };
    }

    if (lower.includes('sky')) {
      return {
        type: 'exterior',
        parameters: {
          operation: 'sky_improve',
          intensity: 0.8,
        },
        description: 'improve the sky',
      };
    }

    if (lower.includes('snow')) {
      return {
        type: 'exterior',
        parameters: {
          operation: 'snow_remove',
        },
        description: 'remove the snow',
      };
    }

    if (lower.includes('curb') || lower.includes('siding')) {
      return {
        type: 'exterior',
        parameters: {
          operation: 'siding_change',
        },
        description: 'improve the curb appeal',
      };
    }

    return null;
  };

  const getColorHex = (colorName: string): string => {
    const colors: Record<string, string> = {
      blue: '#4A90E2',
      green: '#7ED321',
      white: '#FFFFFF',
      beige: '#F5F5DC',
      gray: '#808080',
      yellow: '#F8E71C',
      red: '#D0021B',
    };
    return colors[colorName] || '#FFFFFF';
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="font-semibold text-gray-900">AI Chat Editor</h3>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Tell me what you&apos;d like to change, and I&apos;ll make it happen
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isAnalyzing && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-3 inline-block">
                <p className="text-sm text-gray-600">Analyzing image...</p>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'user' ? 'bg-blue-600' : 'bg-gray-200'
            }`}>
              {message.role === 'user' ? (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className={`rounded-lg p-3 inline-block max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {/* Image Insights Card */}
        {insights && messages.length > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-purple-900 mb-2">📊 Image Insights</h4>
            <div className="space-y-2 text-xs text-purple-800">
              <p>• Room Type: <span className="font-medium">{insights.roomType.replace('_', ' ')}</span></p>
              <p>• Objects: <span className="font-medium">{insights.objects.join(', ')}</span></p>
              <p>• Lighting: <span className="font-medium">{insights.lighting}</span></p>
              {insights.dominantColors.length > 0 && (
                <div className="flex items-center gap-2">
                  <span>• Colors:</span>
                  <div className="flex gap-1">
                    {insights.dominantColors.slice(0, 3).map((color, idx) => (
                      <div
                        key={idx}
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Actions */}
      {showSuggestions && insights && (
        <div className="border-t bg-gray-50 p-4">
          <SuggestedEdits
            suggestions={insights.suggestedEdits}
            onSelect={handleSuggestionClick}
          />
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your instruction... (e.g., 'make the walls ice blue')"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            disabled={isProcessing}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isProcessing ? (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Try: &quot;Change walls to ice blue&quot;, &quot;Add a modern sofa&quot;, &quot;Remove the chair&quot;, &quot;Enhance the grass&quot;
        </p>
      </div>
    </div>
  );
}
