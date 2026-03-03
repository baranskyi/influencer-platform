import { isBefore, isAfter, isSameDay, startOfDay, format } from "date-fns";

export type DealSpanSegment = {
  dealId: string;
  dealTitle: string;
  platform: string;
  weekIndex: number;
  startCol: number; // 0-6
  spanCols: number;
  isStart: boolean;
  isEnd: boolean;
  lane: number;
};

type DealInput = {
  id: string;
  title: string;
  platform: string;
  start_date: string | null;
  end_date: string | null;
};

/**
 * Compute multi-day deal span segments across calendar weeks.
 * Each deal with both start_date and end_date produces 1+ segments (one per week it touches).
 * Lane assignment uses greedy bottom-up packing.
 */
export function computeDealSpans(
  deals: DealInput[],
  weeks: Date[][],
): DealSpanSegment[] {
  const segments: DealSpanSegment[] = [];

  const spannableDeals = deals.filter((d) => d.start_date && d.end_date);

  for (const deal of spannableDeals) {
    const dealStart = startOfDay(new Date(deal.start_date!));
    const dealEnd = startOfDay(new Date(deal.end_date!));

    if (isAfter(dealStart, dealEnd)) continue;

    for (let wi = 0; wi < weeks.length; wi++) {
      const weekStart = startOfDay(weeks[wi][0]);
      const weekEnd = startOfDay(weeks[wi][6]);

      // Does this deal overlap with this week?
      if (isAfter(dealStart, weekEnd) || isBefore(dealEnd, weekStart)) continue;

      // Clamp to week boundaries
      const segStart = isAfter(dealStart, weekStart) ? dealStart : weekStart;
      const segEnd = isBefore(dealEnd, weekEnd) ? dealEnd : weekEnd;

      const startCol = dayIndex(segStart, weekStart);
      const endCol = dayIndex(segEnd, weekStart);
      const spanCols = endCol - startCol + 1;

      segments.push({
        dealId: deal.id,
        dealTitle: deal.title,
        platform: deal.platform,
        weekIndex: wi,
        startCol,
        spanCols,
        isStart: isSameDay(segStart, dealStart) || isSameDay(dealStart, segStart),
        isEnd: isSameDay(segEnd, dealEnd) || isSameDay(dealEnd, segEnd),
        lane: 0, // assigned below
      });
    }
  }

  // Greedy lane assignment per week
  const maxWeeks = weeks.length;
  for (let wi = 0; wi < maxWeeks; wi++) {
    const weekSegs = segments.filter((s) => s.weekIndex === wi);
    // Sort by startCol, then wider spans first
    weekSegs.sort((a, b) => a.startCol - b.startCol || b.spanCols - a.spanCols);

    // lanes[lane] = rightmost occupied column + 1
    const lanes: number[] = [];

    for (const seg of weekSegs) {
      let assigned = -1;
      for (let l = 0; l < lanes.length; l++) {
        if (lanes[l] <= seg.startCol) {
          assigned = l;
          break;
        }
      }
      if (assigned === -1) {
        assigned = lanes.length;
        lanes.push(0);
      }
      seg.lane = assigned;
      lanes[assigned] = seg.startCol + seg.spanCols;
    }
  }

  return segments;
}

/**
 * How many lanes are used in a given week.
 */
export function getLaneCount(segments: DealSpanSegment[], weekIndex: number): number {
  let max = 0;
  for (const s of segments) {
    if (s.weekIndex === weekIndex && s.lane + 1 > max) {
      max = s.lane + 1;
    }
  }
  return max;
}

/**
 * Set of deal IDs that are rendered as spans (have both start_date and end_date).
 */
export function getSpannedDealIds(
  deals: DealInput[],
): Set<string> {
  const ids = new Set<string>();
  for (const d of deals) {
    if (d.start_date && d.end_date) ids.add(d.id);
  }
  return ids;
}

function dayIndex(date: Date, weekStart: Date): number {
  const diff = Math.round(
    (startOfDay(date).getTime() - startOfDay(weekStart).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  return Math.max(0, Math.min(6, diff));
}
