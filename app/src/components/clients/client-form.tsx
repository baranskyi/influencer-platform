"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  createClientAction,
  updateClientAction,
} from "@/app/(dashboard)/clients/_actions/clients";
import type { Client } from "@/types/database";

const CATEGORIES = [
  "Fashion",
  "Beauty",
  "Tech",
  "Food & Beverage",
  "Travel",
  "Fitness",
  "Gaming",
  "Finance",
  "Entertainment",
  "Other",
];

type ClientFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
};

export function ClientForm({ open, onOpenChange, client }: ClientFormProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!client;

  function handleSubmit(formData: FormData) {
    const input = {
      name: formData.get("name") as string,
      contact_name: formData.get("contact_name") as string,
      contact_email: formData.get("contact_email") as string,
      contact_phone: formData.get("contact_phone") as string,
      website: formData.get("website") as string,
      category: formData.get("category") as string,
      notes: formData.get("notes") as string,
    };

    startTransition(async () => {
      if (isEditing && client) {
        const result = await updateClientAction({ ...input, id: client.id });
        if (result.success) onOpenChange(false);
      } else {
        await createClientAction(input);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Client" : "Add New Client"}
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company / Brand Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Nike, Sephora"
              defaultValue={client?.name ?? ""}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={client?.category ?? ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="contact_name">Contact Person</Label>
              <Input
                id="contact_name"
                name="contact_name"
                placeholder="John Smith"
                defaultValue={client?.contact_name ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                placeholder="john@brand.com"
                defaultValue={client?.contact_email ?? ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                placeholder="+34 600 000 000"
                defaultValue={client?.contact_phone ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                placeholder="https://brand.com"
                defaultValue={client?.website ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              placeholder="Payment terms, preferences..."
              defaultValue={client?.notes ?? ""}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
