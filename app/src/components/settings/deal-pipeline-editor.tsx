"use client";

import { useState, useTransition, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  GripVertical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Loader2,
  Workflow,
} from "lucide-react";
import { toast } from "sonner";
import { saveDealStatusConfig } from "@/app/(dashboard)/settings/_actions/settings";
import type { StatusConfig } from "@/lib/deal-status-config";
import { STATUS_COLOR_MAP } from "@/lib/deal-status-config";
import { trackEvent } from "@/lib/analytics";

const COLOR_OPTIONS = Object.keys(STATUS_COLOR_MAP);

export function DealPipelineEditor({
  initialConfig,
}: {
  initialConfig: StatusConfig[];
}) {
  const [statuses, setStatuses] = useState<StatusConfig[]>(initialConfig);
  const [isPending, startTransition] = useTransition();
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  // ── Drag & Drop ──────────────────────────────────────────
  const handleDragStart = useCallback((idx: number) => {
    dragItem.current = idx;
  }, []);

  const handleDragEnter = useCallback((idx: number) => {
    dragOver.current = idx;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragItem.current === null || dragOver.current === null) return;
    const from = dragItem.current;
    const to = dragOver.current;
    if (from === to) {
      dragItem.current = null;
      dragOver.current = null;
      return;
    }
    setStatuses((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(from, 1);
      copy.splice(to, 0, removed);
      return copy.map((s, i) => ({ ...s, position: i }));
    });
    trackEvent({ action: "settings_pipeline_reorder" });
    dragItem.current = null;
    dragOver.current = null;
  }, []);

  // ── Toggle enabled ───────────────────────────────────────
  const toggleEnabled = useCallback((idx: number) => {
    trackEvent({ action: "settings_pipeline_toggle_status" });
    setStatuses((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, enabled: !s.enabled } : s)),
    );
  }, []);

  // ── Flag toggles ─────────────────────────────────────────
  const setFlag = useCallback(
    (idx: number, flag: keyof StatusConfig, value: boolean) => {
      setStatuses((prev) =>
        prev.map((s, i) => {
          if (i !== idx) {
            // For isInitial (radio), unset others
            if (flag === "isInitial" && value) return { ...s, isInitial: false };
            return s;
          }
          return { ...s, [flag]: value };
        }),
      );
    },
    [],
  );

  // ── Add custom status ────────────────────────────────────
  const addStatus = useCallback(() => {
    trackEvent({ action: "settings_pipeline_add_status" });
    const slug = `custom_${Date.now()}`;
    setStatuses((prev) => [
      ...prev,
      {
        value: slug,
        label: "New Status",
        color: "cyan",
        position: prev.length,
        enabled: true,
        isInitial: false,
        isPaid: false,
        isEarned: false,
        isTerminal: false,
        hideFromCalendar: false,
        isSystem: false,
      },
    ]);
    setExpandedIdx(statuses.length);
  }, [statuses.length]);

  // ── Remove non-system status ─────────────────────────────
  const removeStatus = useCallback((idx: number) => {
    trackEvent({ action: "settings_pipeline_delete_status" });
    setStatuses((prev) =>
      prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, position: i })),
    );
    setExpandedIdx(null);
  }, []);

  // ── Validation ───────────────────────────────────────────
  function validate(): string | null {
    const enabled = statuses.filter((s) => s.enabled);
    if (enabled.length < 2) return "At least 2 statuses must be enabled.";
    if (!enabled.some((s) => s.isInitial))
      return "Exactly one enabled status must be marked as Initial.";
    if (enabled.filter((s) => s.isInitial).length > 1)
      return "Only one status can be Initial.";
    if (!statuses.some((s) => s.isPaid))
      return "At least one status must be marked as Paid.";
    if (!statuses.some((s) => s.isEarned))
      return "At least one status must be marked as Earned.";
    // Check unique slugs
    const slugs = new Set<string>();
    for (const s of statuses) {
      if (slugs.has(s.value)) return `Duplicate slug: "${s.value}"`;
      slugs.add(s.value);
    }
    return null;
  }

  // ── Save ─────────────────────────────────────────────────
  function handleSave() {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    startTransition(async () => {
      const result = await saveDealStatusConfig(statuses);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Deal pipeline saved");
      }
    });
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Workflow className="h-5 w-5 text-lavender" />
          Deal Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Drag to reorder. Toggle to enable/disable. Expand for flags.
        </p>

        {statuses.map((s, idx) => {
          const isExpanded = expandedIdx === idx;
          const colorInfo = STATUS_COLOR_MAP[s.color] ?? STATUS_COLOR_MAP.gray;
          return (
            <div
              key={s.value}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragEnter={() => handleDragEnter(idx)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="rounded-lg border border-border/50 bg-card/50"
            >
              {/* Main row */}
              <div className="flex items-center gap-2 px-3 py-2">
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                <span className={`h-3 w-3 shrink-0 rounded-full ${colorInfo.dot}`} />
                <span className="flex-1 text-sm font-medium">
                  {s.label}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {s.value}
                </span>

                {/* Enabled toggle */}
                <button
                  type="button"
                  onClick={() => toggleEnabled(idx)}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                    s.enabled
                      ? "bg-mint/20 text-mint"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {s.enabled ? "on" : "off"}
                </button>

                {/* Expand */}
                <button
                  type="button"
                  onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Expanded: flags + edit */}
              {isExpanded && (
                <div className="border-t border-border/30 px-3 py-3 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={s.label}
                        onChange={(e) =>
                          setStatuses((prev) =>
                            prev.map((x, i) =>
                              i === idx ? { ...x, label: e.target.value } : x,
                            ),
                          )
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                    {!s.isSystem && (
                      <div className="space-y-1">
                        <Label className="text-xs">Slug</Label>
                        <Input
                          value={s.value}
                          onChange={(e) => {
                            const slug = e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9_]/g, "_");
                            setStatuses((prev) =>
                              prev.map((x, i) =>
                                i === idx ? { ...x, value: slug } : x,
                              ),
                            );
                          }}
                          className="h-8 text-sm font-mono"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <Label className="text-xs">Color</Label>
                      <Select
                        value={s.color}
                        onValueChange={(val) =>
                          setStatuses((prev) =>
                            prev.map((x, i) =>
                              i === idx ? { ...x, color: val } : x,
                            ),
                          )
                        }
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COLOR_OPTIONS.map((c) => (
                            <SelectItem key={c} value={c}>
                              <span className="flex items-center gap-2">
                                <span
                                  className={`h-2.5 w-2.5 rounded-full ${STATUS_COLOR_MAP[c].dot}`}
                                />
                                {c}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Semantic flags */}
                  <div className="flex flex-wrap gap-3 text-xs">
                    <label
                      className="flex items-center gap-1.5 cursor-pointer"
                      title="Default status for newly created deals. Only one status can be Initial."
                    >
                      <input
                        type="radio"
                        name="isInitial"
                        checked={s.isInitial}
                        onChange={() => setFlag(idx, "isInitial", true)}
                      />
                      Initial
                    </label>
                    <label
                      className="flex items-center gap-1.5 cursor-pointer"
                      title="Automatically sets the payment date when a deal reaches this status. Used for invoice-to-deal sync."
                    >
                      <input
                        type="checkbox"
                        checked={s.isPaid}
                        onChange={(e) =>
                          setFlag(idx, "isPaid", e.target.checked)
                        }
                      />
                      Paid
                    </label>
                    <label
                      className="flex items-center gap-1.5 cursor-pointer"
                      title="Counts as revenue in Dashboard, Analytics, and Client statistics."
                    >
                      <input
                        type="checkbox"
                        checked={s.isEarned}
                        onChange={(e) =>
                          setFlag(idx, "isEarned", e.target.checked)
                        }
                      />
                      Earned
                    </label>
                    <label
                      className="flex items-center gap-1.5 cursor-pointer"
                      title="Deal is closed. Excluded from active deals count, deadline queries, and main kanban columns."
                    >
                      <input
                        type="checkbox"
                        checked={s.isTerminal}
                        onChange={(e) =>
                          setFlag(idx, "isTerminal", e.target.checked)
                        }
                      />
                      Terminal
                    </label>
                    <label
                      className="flex items-center gap-1.5 cursor-pointer"
                      title="Deals with this status will not appear on the calendar."
                    >
                      <input
                        type="checkbox"
                        checked={s.hideFromCalendar}
                        onChange={(e) =>
                          setFlag(idx, "hideFromCalendar", e.target.checked)
                        }
                      />
                      Hide Calendar
                    </label>
                  </div>

                  {/* Delete custom status */}
                  {!s.isSystem && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeStatus(idx)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete Status
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={addStatus}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add Custom Status
          </Button>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
            Save Pipeline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
