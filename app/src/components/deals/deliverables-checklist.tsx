"use client";

import { useTransition, useState } from "react";
import { toggleDeliverable } from "@/app/(dashboard)/deals/_actions/deals";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type Deliverable = {
  type: string;
  count: number;
  specs?: string;
  completed?: boolean;
};

export function DeliverablesChecklist({
  dealId,
  deliverables,
}: {
  dealId: string;
  deliverables: Deliverable[];
}) {
  const [isPending, startTransition] = useTransition();
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  // Optimistic local state so the checkbox feels instant
  const [items, setItems] = useState<Deliverable[]>(deliverables);

  function handleToggle(index: number, currentCompleted: boolean) {
    const newCompleted = !currentCompleted;

    // Optimistic update
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, completed: newCompleted } : item
      )
    );
    setPendingIndex(index);

    startTransition(async () => {
      const result = await toggleDeliverable(dealId, index, newCompleted);
      if (result?.error) {
        // Revert on error
        setItems((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, completed: currentCompleted } : item
          )
        );
      }
      setPendingIndex(null);
    });
  }

  const completedCount = items.filter((d) => d.completed).length;
  const total = items.length;

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-lavender" />
            Deliverables
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {completedCount}/{total} done
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, index) => {
            const isThisPending = isPending && pendingIndex === index;

            return (
              <label
                key={index}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl p-3 transition-colors",
                  "hover:bg-white/5",
                  item.completed && "opacity-60"
                )}
              >
                {/* Custom checkbox area */}
                <div className="relative mt-0.5 flex-shrink-0">
                  {isThisPending ? (
                    <Loader2 className="h-5 w-5 animate-spin text-coral" />
                  ) : (
                    <>
                      <input
                        type="checkbox"
                        checked={!!item.completed}
                        onChange={() => handleToggle(index, !!item.completed)}
                        disabled={isPending}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "h-5 w-5 rounded-md border-2 transition-all",
                          item.completed
                            ? "border-mint bg-mint/20"
                            : "border-white/30 bg-white/5"
                        )}
                        onClick={() => handleToggle(index, !!item.completed)}
                      >
                        {item.completed && (
                          <svg
                            viewBox="0 0 12 12"
                            className="h-full w-full p-0.5 text-mint"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="2,6 5,9 10,3" />
                          </svg>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Label content */}
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      "text-sm font-medium leading-tight",
                      item.completed && "line-through"
                    )}
                  >
                    {item.count}x {item.type}
                  </div>
                  {item.specs && (
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {item.specs}
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-mint to-lavender transition-all duration-500"
                style={{ width: `${(completedCount / total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
