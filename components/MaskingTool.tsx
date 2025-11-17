'use client';

export default function MaskingTool() {
  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="font-semibold mb-2">Masking Tool</h3>
      <p className="text-sm text-gray-500">TODO: Implement brush-based masking</p>
      <div className="mt-4 space-y-2">
        <button className="w-full px-4 py-2 bg-gray-200 rounded text-sm">
          Brush
        </button>
        <button className="w-full px-4 py-2 bg-gray-200 rounded text-sm">
          Eraser
        </button>
        <button className="w-full px-4 py-2 bg-gray-200 rounded text-sm">
          Clear Mask
        </button>
      </div>
    </div>
  );
}
