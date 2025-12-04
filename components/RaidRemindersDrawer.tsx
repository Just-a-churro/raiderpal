"use client";

import { useMemo } from "react";
import { RarityBadge } from "./ItemCard";
import {
  ReminderItem,
  ReminderSort,
  useRaidReminders,
} from "@/hooks/useRaidReminders";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function RaidRemindersDrawer({ open, onClose }: Props) {
  const {
    items,
    sort,
    remove,
    clear,
    updateNote,
    setSort,
  } = useRaidReminders();

  const sorted = items; // already sorted in hook

  const empty = sorted.length === 0;

  function handleClear() {
    if (empty) return;
    if (window.confirm("Clear all reminders?")) {
      clear();
    }
  }

  return (
    <div
      className={`fixed inset-0 z-40 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`absolute left-0 right-0 bottom-0 max-h-[85vh] rounded-t-2xl border border-slate-800 bg-slate-950/95 shadow-2xl transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-900">
          <div>
            <div className="text-xs uppercase tracking-[0.08em] text-slate-400">
              Raid Reminders
            </div>
            <div className="text-sm text-slate-200">
              {empty ? "Nothing added yet" : `${sorted.length} item(s) saved`}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Close reminders"
          >
            X
          </button>
        </div>

        <div className="px-4 py-3 flex items-center gap-3 border-b border-slate-900 text-sm">
          <button
            type="button"
            onClick={handleClear}
            disabled={empty}
            className={`rounded-md px-3 py-2 text-sm font-medium border ${
              empty
                ? "cursor-not-allowed border-slate-800 bg-slate-900 text-slate-600"
                : "border-red-500/40 bg-red-500/10 text-red-200 hover:bg-red-500/15"
            }`}
          >
            Clear all
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <label className="text-xs text-slate-400">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as ReminderSort)}
              className="rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="added">Order added</option>
              <option value="location">Loot location</option>
              <option value="az">Name A-Z</option>
              <option value="za">Name Z-A</option>
            </select>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[65vh] p-4 space-y-3">
          {empty ? (
            <div className="rounded-lg border border-dashed border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              Add items to Raid Reminders to populate this dashboard.
            </div>
          ) : (
            sorted.map((item) => (
              <ReminderRow
                key={item.id}
                item={item}
                onRemove={() => remove(item.id)}
                onNoteChange={(note) => updateNote(item.id, note)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ReminderRow({
  item,
  onRemove,
  onNoteChange,
}: {
  item: ReminderItem;
  onRemove: () => void;
  onNoteChange: (note: string) => void;
}) {
  const noteValue = item.note ?? "";
  const charLeft = 200 - noteValue.length;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 shadow-sm">
      <div className="flex items-start gap-3">
        {item.icon && (
          <img
            src={item.icon}
            alt={item.name}
            className="h-12 w-12 rounded border border-slate-800 bg-slate-950 object-contain"
          />
        )}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-100 truncate">
                {item.name}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                <RarityBadge rarity={item.rarity} />
                {item.lootLocation && (
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-sky-500" />
                    {item.lootLocation}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="shrink-0 rounded-md px-2 py-1 text-xs text-slate-400 hover:text-red-200 hover:bg-red-500/10 focus:outline-none focus:ring-1 focus:ring-red-500"
              aria-label={`Remove ${item.name}`}
            >
              Remove
            </button>
          </div>

          <div className="mt-2 space-y-1">
            <label className="text-[11px] text-slate-400">
              Notes (200 chars)
            </label>
            <textarea
              value={noteValue}
              onChange={(e) => onNoteChange(e.target.value.slice(0, 200))}
              rows={2}
              className="w-full rounded-md border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Add a reminder or comment"
            />
            <div className="text-[10px] text-slate-500 text-right">
              {charLeft} left
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
