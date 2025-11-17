'use client';

interface SuggestedEditsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const suggestionTemplates: Record<string, { icon: string; text: string; color: string }> = {
  change_floor: {
    icon: '🔲',
    text: 'Change flooring to hardwood',
    color: 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100',
  },
  change_wall: {
    icon: '🎨',
    text: 'Paint walls white',
    color: 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100',
  },
  add_staging: {
    icon: '🛋️',
    text: 'Add a modern sofa',
    color: 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100',
  },
  remove_object: {
    icon: '🗑️',
    text: 'Remove the table',
    color: 'bg-red-50 border-red-200 text-red-900 hover:bg-red-100',
  },
  enhance_lighting: {
    icon: '💡',
    text: 'Enhance lighting',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-900 hover:bg-yellow-100',
  },
  enhance_grass: {
    icon: '🌳',
    text: 'Enhance grass and trees',
    color: 'bg-green-50 border-green-200 text-green-900 hover:bg-green-100',
  },
  improve_curb: {
    icon: '🏡',
    text: 'Improve curb appeal',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-900 hover:bg-indigo-100',
  },
  change_sky: {
    icon: '☁️',
    text: 'Improve the sky',
    color: 'bg-cyan-50 border-cyan-200 text-cyan-900 hover:bg-cyan-100',
  },
  remove_snow: {
    icon: '❄️',
    text: 'Remove snow',
    color: 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100',
  },
};

export default function SuggestedEdits({ suggestions, onSelect }: SuggestedEditsProps) {
  const mappedSuggestions = suggestions
    .map(key => suggestionTemplates[key])
    .filter(Boolean);

  if (mappedSuggestions.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        Quick Actions
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {mappedSuggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion.text)}
            className={`px-3 py-2 rounded-lg border-2 transition-all text-left text-sm flex items-center gap-2 ${suggestion.color}`}
          >
            <span className="text-lg">{suggestion.icon}</span>
            <span className="font-medium">{suggestion.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
