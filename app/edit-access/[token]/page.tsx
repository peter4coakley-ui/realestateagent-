export default function EditAccessPage({ params }: { params: { token: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Buyer Edit Access</h1>
      <p className="text-gray-600">Access Token: {params.token}</p>
      <p className="text-gray-500 mt-2">TODO: Validate token and load editor for buyer</p>
    </div>
  );
}
