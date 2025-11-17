'use client';

interface Edit {
  id: string;
  type: string;
  timestamp: Date;
  description: string;
}

interface EditHistoryProps {
  edits?: Edit[];
  currentIndex?: number;
  onJumpToEdit?: (index: number) => void;
}

export default function EditHistory({ 
  edits = [], 
  currentIndex = -1,
  onJumpToEdit 
}: EditHistoryProps) {
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const getEditIcon = (type: string) => {
    switch (type) {
      case 'flooring':
        return '🔲';
      case 'walls':
        return '🎨';
      case 'furniture':
        return '🛋️';
      case 'remove':
        return '🗑️';
      case 'masking':
        return '✏️';
      case 'exterior':
        return '🌳';
      default:
        return '✨';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Edit History
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {edits.length} {edits.length === 1 ? 'edit' : 'edits'} total
        </p>
      </div>

      {/* Edit List */}
      <div className="flex-1 overflow-y-auto p-4">
        {edits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-sm text-gray-500">No edits yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Your edit history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {edits.map((edit, index) => (
              <button
                key={edit.id}
                onClick={() => onJumpToEdit?.(index)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  index === currentIndex
                    ? 'border-blue-500 bg-blue-50'
                    : index < currentIndex
                    ? 'border-gray-200 bg-white hover:bg-gray-50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl">{getEditIcon(edit.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {edit.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {getTimeAgo(edit.timestamp)}
                      </span>
                      {index === currentIndex && (
                        <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">
                          Current
                        </span>
                      )}
                      {index > currentIndex && (
                        <span className="text-xs text-gray-400">
                          (undone)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {edits.length > 0 && (
        <div className="p-4 border-t bg-gray-50">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white rounded-lg p-3 border">
              <p className="text-2xl font-bold text-gray-900">{edits.length}</p>
              <p className="text-xs text-gray-500 mt-1">Total Edits</p>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <p className="text-2xl font-bold text-blue-600">{edits.length}</p>
              <p className="text-xs text-gray-500 mt-1">Credits Used</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
