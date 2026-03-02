"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClientForm } from "./client-form";
import { Plus, Building2 } from "lucide-react";

type ClientRow = {
  id: string;
  name: string;
  category: string | null;
  contact_email: string | null;
  total_deals: number;
  total_revenue: number;
};

type ClientsPageClientProps = {
  clients: ClientRow[];
};

export function ClientsPageClient({ clients }: ClientsPageClientProps) {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button variant="accent" size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      <Card variant="glass">
        <CardContent className="p-0">
          {clients.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Building2 className="mx-auto mb-3 h-10 w-10 opacity-50" />
              <p>No clients yet.</p>
              <p className="text-sm">
                Add your first client or create one when adding a deal.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Deals</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Link
                        href={`/clients/${client.id}`}
                        className="font-medium text-orange hover:underline"
                      >
                        {client.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {client.category ? (
                        <span className="rounded-full bg-lavender/20 px-2 py-0.5 text-[10px] font-medium text-lavender">
                          {client.category}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {client.contact_email ?? "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {client.total_deals}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      ${client.total_revenue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ClientForm open={formOpen} onOpenChange={setFormOpen} />
    </>
  );
}
