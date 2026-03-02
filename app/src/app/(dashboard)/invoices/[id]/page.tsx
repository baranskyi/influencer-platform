export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl">Invoice Details</h1>
      <p className="text-muted-foreground">Invoice ID: {id}</p>
    </div>
  );
}
