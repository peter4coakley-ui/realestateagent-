'use client';

export default function FurnitureSidebar() {
  const furnitureItems = ['Sofa', 'Chair', 'Table', 'Lamp', 'Plant', 'TV', 'Rug', 'Shelf'];

  return (
    <div className="w-64 bg-white border-l p-4 overflow-y-auto">
      <h3 className="font-semibold mb-4">Furniture Staging</h3>
      <p className="text-xs text-gray-500 mb-4">TODO: Add drag-and-drop furniture items</p>
      <div className="grid grid-cols-2 gap-2">
        {furnitureItems.map((item) => (
          <div 
            key={item}
            className="border rounded p-3 text-center hover:bg-gray-50 cursor-pointer"
          >
            <div className="w-12 h-12 bg-gray-200 rounded mx-auto mb-2"></div>
            <p className="text-xs">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
