'use client';

import { useState } from 'react';

export default function ChatEditor() {
  const [message, setMessage] = useState('');

  return (
    <div className="flex flex-col h-full bg-white border rounded">
      <div className="border-b p-4">
        <h3 className="font-semibold">Chat Editor</h3>
        <p className="text-xs text-gray-500">AI-powered editing assistant</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-blue-50 p-3 rounded mb-2">
          <p className="text-sm">AI: How can I help you edit this image?</p>
        </div>
        <p className="text-xs text-gray-400 mt-4">TODO: Implement chat history and AI responses</p>
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2 mb-3">
          <button className="px-3 py-1 bg-gray-100 rounded text-xs">Change floors</button>
          <button className="px-3 py-1 bg-gray-100 rounded text-xs">Add furniture</button>
          <button className="px-3 py-1 bg-gray-100 rounded text-xs">Remove object</button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your edit request..."
            className="flex-1 px-3 py-2 border rounded"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
