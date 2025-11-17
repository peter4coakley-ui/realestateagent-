'use client';

export default function PhotoStrip() {
  const photos = [1, 2, 3, 4, 5]; // Placeholder photo IDs

  return (
    <div className="bg-white border-b p-3">
      <div className="flex gap-2 overflow-x-auto">
        {photos.map((id) => (
          <div
            key={id}
            className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded cursor-pointer hover:ring-2 ring-blue-500"
          >
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
              Photo {id}
            </div>
          </div>
        ))}
        <div className="flex-shrink-0 w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400">
          <span className="text-2xl text-gray-400">+</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">TODO: Load listing images and allow navigation</p>
    </div>
  );
}
