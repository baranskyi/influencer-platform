export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl">Deal Details</h1>
      <p className="text-muted-foreground">Deal ID: {id}</p>
    </div>
  );
}
