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
  createEvent,
  updateEvent,
} from "@/app/(dashboard)/calendar/_actions/events";
import type { ContentEvent } from "@/types/database";
import { trackEvent } from "@/lib/analytics";

type DealOption = { id: string; title: string };

const EVENT_TYPES = [
  { value: "post", label: "Post" },
  { value: "story", label: "Story" },
  { value: "reel", label: "Reel" },
  { value: "video", label: "Video" },
  { value: "review", label: "Review" },
  { value: "deadline", label: "Content Deadline" },
  { value: "payment_due", label: "Payment Due Date" },
  { value: "campaign_start", label: "Start Date" },
  { value: "campaign_end", label: "End Date" },
];

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "multi", label: "Multi-platform" },
];

type EventFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: ContentEvent | null;
  defaultDate?: string;
  deals?: DealOption[];
};

export function EventForm({
  open,
  onOpenChange,
  event,
  defaultDate,
  deals = [],
}: EventFormProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!event;

  function handleSubmit(formData: FormData) {
    const input = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      event_type: formData.get("event_type") as string,
      platform: formData.get("platform") as string,
      scheduled_at: new Date(
        formData.get("scheduled_at") as string
      ).toISOString(),
      deal_id: ((formData.get("deal_id") as string) === "__none__" ? null : (formData.get("deal_id") as string)) || null,
    };

    trackEvent({ action: "calendar_event_submit" });
    startTransition(async () => {
      let result;
      if (isEditing && event) {
        result = await updateEvent({ ...input, id: event.id });
      } else {
        result = await createEvent(input);
      }

      if (result.success) {
        onOpenChange(false);
      }
    });
  }

  const scheduledDate = event?.scheduled_at
    ? new Date(event.scheduled_at).toISOString().slice(0, 16)
    : defaultDate
      ? `${defaultDate}T10:00`
      : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Event" : "New Content Event"}
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Summer Collection Reel"
              defaultValue={event?.title ?? ""}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="event_type">Type</Label>
              <Select
                name="event_type"
                defaultValue={event?.event_type ?? "post"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                name="platform"
                defaultValue={event?.platform ?? "instagram"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled_at">Scheduled Date & Time</Label>
            <Input
              id="scheduled_at"
              name="scheduled_at"
              type="datetime-local"
              defaultValue={scheduledDate}
              required
            />
          </div>

          {deals.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="deal_id">Link to Deal (optional)</Label>
              <Select
                name="deal_id"
                defaultValue={event?.deal_id ?? "__none__"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No deal linked" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {deals.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Notes (optional)</Label>
            <Input
              id="description"
              name="description"
              placeholder="Brief, hashtags, links..."
              defaultValue={event?.description ?? ""}
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
                  : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
