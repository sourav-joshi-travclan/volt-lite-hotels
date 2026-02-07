"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Button } from "@/components/ui/button";
import { MovingBorder } from "@/components/aceternityui/moving-border";
import { Badge } from "@/components/ui/badge";
import { formatPriceInINR } from "@/lib/format-price";
import type { RoomOptionOccupancy } from "@/types";
import { Users, Info, AlertCircle, X } from "lucide-react";

interface Policy {
  type?: string;
  text?: string;
}

interface AdditionalCharge {
  charge?: { description?: string; amount?: number; currency?: string };
  text?: string;
}

interface CancellationPolicy {
  estimatedValue?: number;
  start?: string;
  end?: string;
}

export interface RoomCardData {
  optionId: string;
  roomName: string;
  rate: {
    finalRate?: number;
    currency?: string;
    boardBasis?: { description?: string };
    occupancies?: RoomOptionOccupancy[];
    policies?: Policy[];
    cancellationPolicies?: CancellationPolicy[];
    additionalCharges?: AdditionalCharge[];
    refundability?: string;
  };
  imageUrl?: string;
}

interface ExpandableRoomCardGridProps {
  rooms: RoomCardData[];
  onSelectRoom: (optionId: string, room: RoomCardData) => void;
  isChecking: string | null;
}

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function RoomDetailsContent({ room }: { room: RoomCardData }) {
  const rate = room.rate ?? {};
  return (
    <div className="flex flex-col gap-4 text-sm">
      {rate.occupancies && rate.occupancies.length > 0 && (
        <div>
          <div className="flex items-center gap-2 font-medium text-muted-foreground mb-1">
            <Users className="h-4 w-4" />
            Occupancy
          </div>
          <ul className="space-y-1 text-muted-foreground">
            {rate.occupancies.map((occ, i) => (
              <li key={i}>
                {occ.numOfAdults} adult{Number(occ.numOfAdults) !== 1 ? "s" : ""}
                {Number(occ.numOfChildren) > 0 && `, ${occ.numOfChildren} child${Number(occ.numOfChildren) !== 1 ? "ren" : ""}`}
              </li>
            ))}
          </ul>
        </div>
      )}
      {rate.policies && rate.policies.length > 0 && (
        <div>
          <div className="flex items-center gap-2 font-medium text-muted-foreground mb-1">
            <Info className="h-4 w-4" />
            Policies
          </div>
          <ul className="space-y-2 text-muted-foreground">
            {rate.policies.map((p, i) => (
              <li key={i}>{p.text}</li>
            ))}
          </ul>
        </div>
      )}
      {rate.cancellationPolicies && rate.cancellationPolicies.length > 0 && (
        <div>
          <div className="flex items-center gap-2 font-medium text-muted-foreground mb-1">
            <AlertCircle className="h-4 w-4" />
            Cancellation
          </div>
          <ul className="space-y-2 text-muted-foreground">
            {rate.cancellationPolicies.map((c, i) => (
              <li key={i}>
                Until {formatDate(c.start)}: ₹{formatPriceInINR(c.estimatedValue ?? 0)} penalty
              </li>
            ))}
          </ul>
        </div>
      )}
      {rate.additionalCharges && rate.additionalCharges.length > 0 && (
        <div>
          <div className="font-medium text-muted-foreground mb-1">Additional charges</div>
          <ul className="space-y-1 text-muted-foreground">
            {rate.additionalCharges.map((a, i) => (
              <li key={i}>{a.text ?? `${a.charge?.description ?? ""}: ${a.charge?.amount ?? ""} ${a.charge?.currency ?? ""}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ExpandableRoomCardGrid({
  rooms,
  onSelectRoom,
  isChecking,
}: ExpandableRoomCardGridProps) {
  const [active, setActive] = useState<RoomCardData | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    if (active) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 h-full w-full z-50"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4">
            <motion.button
              key={`close-${active.optionId}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.05 }}
              className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center justify-center bg-[var(--surface)] hover:bg-[var(--surface-elevated)] rounded-full h-10 w-10 z-[101] border border-[var(--border)]"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </motion.button>
            <motion.div
              layoutId={`card-${active.optionId}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] max-h-[90vh] flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl"
            >
              <motion.div layoutId={`image-${active.optionId}-${id}`} className="relative h-48 bg-[var(--surface-elevated)]">
                {active.imageUrl ? (
                  <img
                    src={active.imageUrl}
                    alt={active.roomName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--surface-elevated)]" />
                )}
              </motion.div>
              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex justify-between items-start p-4 gap-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.optionId}-${id}`}
                      className="font-semibold text-lg text-white"
                    >
                      {active.roomName}
                    </motion.h3>
                    <Badge variant="secondary" className="mt-2">
                      {active.rate?.boardBasis?.description ?? "Room only"}
                    </Badge>
                    {active.rate?.refundability && (
                      <p className="text-sm text-muted-foreground mt-1">{active.rate.refundability}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xl font-semibold text-[var(--accent-primary)]">
                      ₹{formatPriceInINR(active.rate?.finalRate ?? 0)}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">{active.rate?.currency ?? "INR"}</span>
                  </div>
                </div>
                <div className="px-4 pb-4 flex-1 overflow-auto">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-muted-foreground max-h-48 overflow-auto pr-2"
                  >
                    <RoomDetailsContent room={active} />
                  </motion.div>
                  <div className="pt-4">
                    <MovingBorder>
                      <Button
                        onClick={() => onSelectRoom(active.optionId, active)}
                        disabled={isChecking === active.optionId}
                        className="w-full rounded-button"
                      >
                        {isChecking === active.optionId ? "Checking price..." : "Select Room"}
                      </Button>
                    </MovingBorder>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <motion.div
            layoutId={`card-${room.optionId}-${id}`}
            key={room.optionId}
            onClick={() => setActive(room)}
            className="p-4 flex flex-col hover:bg-[var(--surface-elevated)] rounded-xl cursor-pointer border border-[var(--border)] bg-[var(--surface)] transition-colors"
          >
            <div className="flex flex-col w-full gap-4">
              <motion.div layoutId={`image-${room.optionId}-${id}`} className="relative h-40 w-full rounded-lg overflow-hidden bg-[var(--surface-elevated)]">
                {room.imageUrl ? (
                  <img
                    src={room.imageUrl}
                    alt={room.roomName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--surface-elevated)]" />
                )}
              </motion.div>
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <motion.h3
                    layoutId={`title-${room.optionId}-${id}`}
                    className="font-medium text-white text-base"
                  >
                    {room.roomName}
                  </motion.h3>
                  <Badge variant="secondary" className="mt-1.5 text-xs">
                    {room.rate?.boardBasis?.description ?? "Room only"}
                  </Badge>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-lg font-semibold text-[var(--accent-primary)]">
                    ₹{formatPriceInINR(room.rate?.finalRate ?? 0)}
                  </span>
                  <span className="ml-0.5 text-xs text-muted-foreground">{room.rate?.currency ?? "INR"}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
