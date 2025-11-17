import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Real Estate Image Editor
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered image editing for real estate professionals
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/editor"
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Open Editor
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold mb-2">Interior Editing</h3>
            <p className="text-gray-600 text-sm">
              Change floors, walls, add furniture staging, and remove unwanted objects
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🏡</div>
            <h3 className="text-lg font-semibold mb-2">Exterior Enhancement</h3>
            <p className="text-gray-600 text-sm">
              Improve landscaping, change siding, enhance sky, and remove snow
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-lg font-semibold mb-2">Chat-to-Edit</h3>
            <p className="text-gray-600 text-sm">
              Natural language commands powered by AI vision analysis
            </p>
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Project structure created. Components are placeholders ready for implementation.</p>
        </div>
      </div>
    </div>
  );
}
