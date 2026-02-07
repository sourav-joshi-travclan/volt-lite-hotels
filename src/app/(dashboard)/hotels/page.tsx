"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/store/booking-store";
import { HotelCard } from "@/components/hotels/hotel-card";
import { HotelCardSkeleton } from "@/components/hotels/hotel-card-skeleton";
import { BlurFade } from "@/components/magicui/blur-fade";
import { NumberTicker } from "@/components/magicui/number-ticker";
import type { Hotel } from "@/types";

export default function HotelsPage() {
  const { searchResults, traceId, searchParams } = useBookingStore();

  useEffect(() => {
    if (traceId) sessionStorage.setItem("volt-traceId", traceId);
  }, [traceId]);

  const count = searchResults.length;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[var(--background)]">
      <div className="border-b border-[var(--border)] bg-[var(--surface)]/50 sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <NumberTicker value={count} /> hotel{count !== 1 ? "s" : ""} found
          </p>
          {searchParams?.locationId && (
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
              Location: {searchParams.locationId}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {count === 0 ? (
          <BlurFade>
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-xl font-medium text-muted-foreground">No hotels found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search</p>
            </div>
          </BlurFade>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            {searchResults.map((hotel, i) => (
              <BlurFade key={(hotel as Hotel).hotelId ?? (hotel as { id?: string }).id ?? i} delay={i * 0.08} inView viewTriggerOffset={50} className="h-full min-h-0">
                <HotelCard hotel={hotel as Hotel} traceId={traceId} />
              </BlurFade>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
