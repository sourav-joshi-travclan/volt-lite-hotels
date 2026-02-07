"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore, defaultSearchParams } from "@/store/booking-store";
import { DatePicker } from "@/components/search/date-picker";
import { GuestSelector } from "@/components/search/guest-selector";
import { LocationSearch } from "@/components/search/location-search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlurFade } from "@/components/magicui/blur-fade";
import { TextHoverEffect } from "@/components/aceternityui/text-hover-effect";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { MovingBorder } from "@/components/aceternityui/moving-border";
import type { LocationResult } from "@/types";
import { format } from "date-fns";
import { toast } from "sonner";

const NATIONALITIES = [
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "AE", label: "UAE" },
  { value: "SG", label: "Singapore" },
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useBookingStore((s) => s.searchParams);
  const setSearchParams = useBookingStore((s) => s.setSearchParams);
  const setSearchResults = useBookingStore((s) => s.setSearchResults);

  const [location, setLocation] = useState<LocationResult | null>(null);
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [nationality, setNationality] = useState("IN");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams) {
      setLocation(searchParams.locationId ? { id: searchParams.locationId, name: "", type: "City" } : null);
      setCheckIn(searchParams.checkIn ? new Date(searchParams.checkIn) : undefined);
      setCheckOut(searchParams.checkOut ? new Date(searchParams.checkOut) : undefined);
      setNationality(searchParams.nationality || "IN");
    }
  }, []);

  const handleDatesChange = (from: Date, to: Date) => {
    setCheckIn(from);
    setCheckOut(to);
  };

  const handleSearch = async () => {
    if (!location?.id) {
      toast.error("Please select a location");
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    if (checkOut <= checkIn) {
      toast.error("Check-out must be after check-in");
      return;
    }

    const params = {
      ...defaultSearchParams,
      ...searchParams,
      locationId: location.id,
      checkIn: format(checkIn, "yyyy-MM-dd"),
      checkOut: format(checkOut, "yyyy-MM-dd"),
      nationality,
      occupancies: searchParams?.occupancies ?? defaultSearchParams.occupancies,
    };
    setSearchParams(params);
    setLoading(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          checkIn: params.checkIn,
          checkOut: params.checkOut,
          nationality: params.nationality,
          occupancies: params.occupancies,
          locationId: params.locationId,
          page: 1,
          pageSize: 20,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as { message?: string }).message || "Search failed");

      const resultsPayload = (data as { results?: { data?: unknown[]; traceId?: string } }).results;
      const results = resultsPayload?.data ?? (data as { data?: unknown[] }).data ?? [];
      const traceId = resultsPayload?.traceId ?? (data as { traceId?: string }).traceId ?? null;
      setSearchResults(Array.isArray(results) ? (results as { id?: string; hotelId?: string; hotelName?: string; name?: string; heroImage?: string; images?: string[]; starRating?: number; availability?: { rate?: { finalRate?: number; currency?: string } }; currency?: string }[]) : [], traceId);
      if (traceId && typeof window !== "undefined") {
        sessionStorage.setItem("volt-traceId", traceId);
      }
      router.push("/hotels");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BackgroundBeamsWithCollision className="!h-full !min-h-[calc(100vh-3.5rem)] from-[var(--background)] to-[var(--surface)] dark:from-[var(--background)] dark:to-[var(--surface)]" />
      </div>
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center lg:gap-16">
        {/* Hero / tagline - left side on large screens */}
        <BlurFade delay={0} className="flex-1 text-center lg:text-left mb-8 lg:mb-0">
          <div className="mb-4">
            <TextHoverEffect text="Where to next?" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight" />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto lg:mx-0">
            Find your perfect stay across India and beyond. Search, compare, and book in seconds.
          </p>
          <div className="hidden lg:flex gap-6 mt-12 text-sm text-muted-foreground">
            <span>✓ Best price guarantee</span>
            <span>✓ Free cancellation</span>
            <span>✓ 24/7 support</span>
          </div>
        </BlurFade>

        {/* Form - larger and more prominent */}
        <BlurFade delay={0.2} className="flex-1 w-full min-w-0">
          <div className="w-full max-w-xl lg:max-w-none rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl p-8 md:p-10 lg:p-12 shadow-2xl shadow-black/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h2 className="text-lg font-semibold text-white mb-6">Search hotels</h2>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Location</label>
                <LocationSearch value={location} onSelect={setLocation} />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Dates</label>
                <DatePicker
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onDatesChange={handleDatesChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Rooms & Guests</label>
                  <GuestSelector />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Nationality</label>
                  <Select value={nationality} onValueChange={setNationality}>
                    <SelectTrigger className="border-[var(--border)] bg-[var(--surface)] h-11">
                      <SelectValue placeholder="Nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {NATIONALITIES.map((n) => (
                        <SelectItem key={n.value} value={n.value}>
                          {n.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <MovingBorder>
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full rounded-button bg-[var(--accent-primary)] py-4 px-6 text-base font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-[var(--accent-primary)]/25"
                >
                  {loading ? "Searching..." : "Search Hotels"}
                </button>
              </MovingBorder>
            </div>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}
