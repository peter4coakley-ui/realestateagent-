'use client';

export default function EditHistory() {
  const edits = [
    { id: 1, action: 'Changed floor to hardwood', time: '2 min ago' },
    { id: 2, action: 'Added sofa', time: '5 min ago' },
    { id: 3, action: 'Removed clutter', time: '8 min ago' },
  ];

  return (
    <div className="w-64 bg-white border-l p-4">
      <h3 className="font-semibold mb-4">Edit History</h3>
      <p className="text-xs text-gray-500 mb-4">TODO: Implement undo/redo functionality</p>
      
      <div className="space-y-2">
        {edits.map((edit) => (
          <div key={edit.id} className="p-2 border rounded hover:bg-gray-50">
            <p className="text-sm">{edit.action}</p>
            <p className="text-xs text-gray-400">{edit.time}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 px-3 py-2 bg-gray-200 rounded text-sm">
          Undo
        </button>
        <button className="flex-1 px-3 py-2 bg-gray-200 rounded text-sm">
          Redo
        </button>
      </div>
    </div>
  );
}
