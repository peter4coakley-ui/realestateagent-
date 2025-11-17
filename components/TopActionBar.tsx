'use client';

export default function TopActionBar() {
  return (
    <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="font-semibold">Image Editor</h2>
        <div className="text-sm text-gray-500">123 Main St, Living Room</div>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
          Save Draft
        </button>
        <button className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
          Download
        </button>
        <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
          Apply Edits
        </button>
        
        <div className="ml-4 px-3 py-1.5 bg-green-50 border border-green-200 rounded text-sm">
          Credits: <span className="font-semibold">245</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 absolute bottom-1 right-4">
        TODO: Implement save, download, and credit tracking
      </p>
    </div>
  );
}
