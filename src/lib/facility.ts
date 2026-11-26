// Facility slot rules shared by the startup booking form and the admin facility control.
import type { DB } from "./types";

const overlaps = (a: string, b: string) => a === b || a === "Full day" || b === "Full day";

/** Why a slot cannot be booked, or null if it is free. Pending requests also hold the slot. */
export function slotConflict(db: DB, facility: string, date: string, slot: string, ignoreBookingId?: string): string | null {
  const block = db.blocks.find((b) => b.facility === facility && b.date === date && overlaps(b.slot, slot));
  if (block) return `${block.kind}: ${block.reason}`;
  for (const s of db.startups) {
    const b = s.bookings.find((x) => x.id !== ignoreBookingId && x.facility === facility && x.date === date && overlaps(x.slot, slot) && (x.status === "Approved" || x.status === "Pending"));
    if (b) return `Already ${b.status === "Approved" ? "booked" : "requested"} (${b.slot})`;
  }
  return null;
}
