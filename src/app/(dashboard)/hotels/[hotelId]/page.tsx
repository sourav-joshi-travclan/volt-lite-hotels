"use client";

import { useCallback, useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ExpandableRoomCardGrid, type RoomCardData } from "@/components/hotels/expandable-room-card";
import { useBookingStore } from "@/store/booking-store";
import type { RoomOptionOccupancy, SelectedRoom } from "@/types";
import { getHotelFallbackImage } from "@/lib/hotel-images";
import { StatusDialog } from "@/components/status-dialog";

interface RoomOptionData {
  rate?: {
    finalRate?: number;
    currency?: string;
    boardBasis?: { description?: string };
    occupancies?: RoomOptionOccupancy[];
    cancellationPolicies?: { estimatedValue?: number; start?: string; end?: string }[];
    refundability?: string;
    policies?: { type?: string; text?: string }[];
    additionalCharges?: { charge?: { description?: string; amount?: number; currency?: string }; text?: string }[];
  };
  roomName?: string;
}

interface RoomsResponse {
  options?: Record<string, RoomOptionData>;
  rooms?: { [key: string]: { name?: string } };
  standardizedRooms?: { [key: string]: { name?: string } };
  traceId?: string;
}

export default function HotelDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hotelId = params.hotelId as string;
  const traceIdFromUrl = searchParams.get("traceId");
  const traceIdFromStore = useBookingStore((s) => s.traceId);
  const [traceIdFromSession, setTraceIdFromSession] = useState<string | null>(null);
  useEffect(() => {
    setTraceIdFromSession(sessionStorage.getItem("volt-traceId"));
  }, []);
  const traceId = traceIdFromUrl || traceIdFromStore || traceIdFromSession;
  const searchResults = useBookingStore((s) => s.searchResults);

  // Sync traceId to URL when we have it from store/session but not in URL
  useEffect(() => {
    const fromStoreOrSession = traceIdFromStore || traceIdFromSession;
    if (fromStoreOrSession && !traceIdFromUrl) {
      router.replace(`/hotels/${hotelId}?traceId=${encodeURIComponent(fromStoreOrSession)}`, { scroll: false });
    }
  }, [traceIdFromStore, traceIdFromSession, traceIdFromUrl, hotelId, router]);
  const setSelectedRoom = useBookingStore((s) => s.setSelectedRoom);

  const hotel = searchResults.find(
    (h) => (h as { hotelId?: string }).hotelId === hotelId || (h as { id?: string }).id === hotelId
  );
  const hotelName = hotel ? ((hotel as { hotelName?: string }).hotelName ?? (hotel as { name?: string }).name ?? "Hotel") : "Hotel";
  const heroImageRaw = hotel ? ((hotel as { heroImage?: string }).heroImage ?? ((hotel as { images?: string[] }).images && (hotel as { images: string[] }).images[0])) : "";
  const heroImage = heroImageRaw || getHotelFallbackImage(hotelId);

  const [roomsData, setRoomsData] = useState<RoomsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [priceCheckLoading, setPriceCheckLoading] = useState<string | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const loadRooms = useCallback(async () => {
    // if (!traceId) {
    //   toast.error("Search session expired. Please search again.");
    //   router.push("/search");
    //   return;
    // }
    setLoading(true);
    try {
      const res = await fetch(`/api/hotels/${hotelId}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ traceId, hotelId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorDialogOpen(true);
        return;
      }
      setRoomsData((data as { results?: RoomsResponse }).results ?? data);
    } catch {
      setErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  }, [hotelId, traceId]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  if (!hotel) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <p className="text-muted-foreground">Hotel not found. Go back to search.</p>
      </div>
    );
  }

  const options = roomsData?.options ?? {};
  const optionEntries = Object.entries(options);

  const handleSelectRoom = async (optionId: string, opt: RoomOptionData, roomName: string) => {
    const rate = opt.rate ?? {};
    setPriceCheckLoading(optionId);
    try {
      const priceRes = await fetch("/api/price-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ traceId, optionId, hotelId }),
      });
      const priceData = await priceRes.json();
      if (!priceRes.ok) {
        setErrorDialogOpen(true);
        return;
      }
      const finalRate = (priceData as { rate?: { finalRate?: number }; priceChangeData?: unknown }).rate?.finalRate ?? rate.finalRate ?? 0;
      const currency = (priceData as { rate?: { currency?: string } }).rate?.currency ?? rate.currency ?? "INR";
      const boardBasis = rate.boardBasis?.description ?? "Room only";
      const occupancies = rate.occupancies ?? [];
      const selected: SelectedRoom = {
        optionId,
        hotelId,
        hotelName,
        roomName,
        price: finalRate,
        currency,
        boardBasis,
        occupancies,
        cancellationPolicies: rate.cancellationPolicies?.map((c) => ({
          estimatedValue: c.estimatedValue ?? 0,
          start: "",
          end: "",
        })),
      };
      setSelectedRoom(selected);
      router.push("/booking");
    } catch {
      setErrorDialogOpen(true);
    } finally {
      setPriceCheckLoading(null);
    }
  };


  return (
    <>
      <StatusDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        type="error"
        title="Something went wrong"
        description="Please try again or start a fresh search."
        onFreshSearch={() => router.push("/search")}
      />
    <div className="pt-4 min-h-[calc(100vh-3.5rem)] bg-[var(--background)]">
      <div className="relative h-[50vh] min-h-[300px] w-full overflow-hidden bg-[var(--surface-elevated)]">
        <Image
          src={heroImage}
          alt={hotelName}
          fill
          className="object-cover"
          priority
          unoptimized={!heroImage.includes("images.unsplash.com") && heroImage.startsWith("http")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold">{hotelName}</h1>
          {hotel.starRating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < hotel.starRating ? "fill-amber-400 text-amber-400" : "text-white/30"}`} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className=" mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-[var(--border)]">
                <CardContent className="p-6">
                  <div className="h-6 w-48 bg-[var(--surface-elevated)] rounded animate-pulse mb-4" />
                  <div className="h-10 w-full bg-[var(--surface-elevated)] rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : optionEntries.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No room options available.</p>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Available Rooms</h2>
            <p className="text-sm text-muted-foreground">Click a room to expand and view details, then select it</p>
            <ExpandableRoomCardGrid
              rooms={optionEntries.map(([optionId, opt]) => {
                const roomName = opt.roomName ?? (roomsData?.rooms?.[optionId] as { name?: string } | undefined)?.name ?? "Room";
                return {
                  optionId,
                  roomName,
                  rate: opt.rate ?? {},
                  imageUrl: heroImage,
                } satisfies RoomCardData;
              })}
              onSelectRoom={(optionId, room) => handleSelectRoom(optionId, { rate: room.rate, roomName: room.roomName }, room.roomName)}
              isChecking={priceCheckLoading}
            />
          </div>
        )}
      </div>
    </div>
    </>
  );
}
