export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl">Client Details</h1>
      <p className="text-muted-foreground">Client ID: {id}</p>
    </div>
  );
}
