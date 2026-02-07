"use client";

import * as React from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBookingStore, defaultSearchParams } from "@/store/booking-store";
import type { Occupancy } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function GuestSelector({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const searchParams = useBookingStore((s) => s.searchParams);
  const setSearchParams = useBookingStore((s) => s.setSearchParams);

  const occupancies: Occupancy[] = searchParams?.occupancies ?? defaultSearchParams.occupancies;

  const updateOccupancies = (next: Occupancy[]) => {
    setSearchParams({
      ...(searchParams ?? defaultSearchParams),
      occupancies: next,
    });
  };

  const addRoom = () => {
    updateOccupancies([...occupancies, { numOfAdults: 1, childAges: [] }]);
  };

  const removeRoom = (i: number) => {
    if (occupancies.length <= 1) return;
    updateOccupancies(occupancies.filter((_, idx) => idx !== i));
  };

  const setAdults = (roomIndex: number, value: number) => {
    const next = [...occupancies];
    next[roomIndex] = { ...next[roomIndex], numOfAdults: Math.max(1, Math.min(6, value)) };
    updateOccupancies(next);
  };

  const setChildren = (roomIndex: number, ages: number[]) => {
    const next = [...occupancies];
    next[roomIndex] = { ...next[roomIndex], childAges: ages };
    updateOccupancies(next);
  };

  const totalGuests = occupancies.reduce(
    (acc, o) => acc + o.numOfAdults + o.childAges.length,
    0
  );
  const label =
    occupancies.length === 1
      ? `${occupancies[0].numOfAdults} Adult(s)${occupancies[0].childAges.length ? `, ${occupancies[0].childAges.length} Child(ren)` : ""}`
      : `${occupancies.length} Rooms, ${totalGuests} Guests`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal border-[var(--border)] bg-[var(--surface)]",
            className
          )}
        >
          <Users className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-[var(--surface)] border-[var(--border)]" align="start">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {occupancies.map((occ, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", damping: 20 }}
                className="space-y-2 rounded-lg border border-[var(--border)] p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Room {i + 1}</span>
                  {occupancies.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeRoom(i)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Adults</span>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setAdults(i, occ.numOfAdults - 1)}
                      disabled={occ.numOfAdults <= 1}
                    >
                      −
                    </Button>
                    <span className="w-6 text-center text-sm tabular-nums">
                      {occ.numOfAdults}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setAdults(i, occ.numOfAdults + 1)}
                      disabled={occ.numOfAdults >= 6}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">Children</span>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setChildren(
                          i,
                          occ.childAges.length > 0
                            ? occ.childAges.slice(0, -1)
                            : []
                        )
                      }
                      disabled={occ.childAges.length === 0}
                    >
                      −
                    </Button>
                    <span className="w-6 text-center text-sm tabular-nums">
                      {occ.childAges.length}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setChildren(i, [...occ.childAges, 6])
                      }
                      disabled={occ.childAges.length >= 4}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed"
            onClick={addRoom}
          >
            Add Room
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
