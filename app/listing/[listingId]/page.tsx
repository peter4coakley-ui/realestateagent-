export default function ListingPage({ params }: { params: { listingId: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Listing Details</h1>
      <p className="text-gray-600">Listing ID: {params.listingId}</p>
      <p className="text-gray-500 mt-2">TODO: Display listing images and details</p>
    </div>
  );
}
