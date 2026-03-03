"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateInvoiceStatus } from "@/app/(dashboard)/invoices/_actions/invoices";
import { CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import type { InvoiceStatus } from "@/types/database";

function firePaidConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const emojis = ["💰", "⭐", "🎉", "💵", "🌟", "💸", "✨", "🤑"];

  // Star-shaped confetti burst from both sides
  function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ["#FFD700", "#FFA500", "#7ECFB3", "#F5A623", "#E8788A"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ["#FFD700", "#FFA500", "#7ECFB3", "#F5A623", "#E8788A"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }
  frame();

  // Big center burst with shapes
  confetti({
    particleCount: 100,
    spread: 100,
    origin: { x: 0.5, y: 0.4 },
    colors: ["#FFD700", "#FFA500", "#7ECFB3", "#F5A623", "#B8A9E8"],
    shapes: ["star", "circle"],
    scalar: 1.2,
  });

  // Emoji rain using confetti shapeFromText
  setTimeout(() => {
    for (const emoji of emojis) {
      const shape = confetti.shapeFromText({ text: emoji, scalar: 2 });
      confetti({
        shapes: [shape],
        scalar: 2,
        particleCount: 4,
        spread: 160,
        origin: { x: Math.random(), y: -0.1 },
        gravity: 0.8,
        ticks: 250,
        flat: true,
      });
    }
  }, 300);
}

export function MarkPaidButton({
  invoiceId,
  currentStatus,
}: {
  invoiceId: string;
  currentStatus: InvoiceStatus;
}) {
  const [isPending, startTransition] = useTransition();

  if (currentStatus === "paid" || currentStatus === "cancelled") {
    return null;
  }

  function handleMarkPaid() {
    startTransition(async () => {
      const result = await updateInvoiceStatus(invoiceId, "paid");
      if (!result?.error) {
        firePaidConfetti();
      }
    });
  }

  return (
    <Button
      size="sm"
      onClick={handleMarkPaid}
      disabled={isPending}
      className="bg-mint/20 text-mint border border-mint/30 hover:bg-mint/30 hover:text-mint font-semibold"
    >
      <CheckCircle className="h-4 w-4" />
      {isPending ? "Marking..." : "Mark as Paid"}
    </Button>
  );
}
