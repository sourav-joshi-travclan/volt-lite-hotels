"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBookingStore } from "@/store/booking-store";
import { GuestForm, type GuestFormValues } from "@/components/booking/guest-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MovingBorder } from "@/components/aceternityui/moving-border";
import { BlurFade } from "@/components/magicui/blur-fade";
import { formatPriceInINR } from "@/lib/format-price";
import { toast } from "sonner";
import { StatusDialog } from "@/components/status-dialog";
import type { RoomGuestDetails } from "@/types";

export default function BookingPage() {
  const router = useRouter();
  const selectedRoom = useBookingStore((s) => s.selectedRoom);
  const traceId = useBookingStore((s) => s.traceId);
  const [roomGuests, setRoomGuests] = useState<RoomGuestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  if (!selectedRoom || !traceId) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <p className="text-muted-foreground">No room selected. Start from search.</p>
        <MovingBorder>
          <button
            type="button"
            className="ml-2 rounded-button bg-[var(--accent-primary)] py-2 px-4 text-white hover:opacity-90 transition-opacity"
            onClick={() => router.push("/search")}
          >
            Search
          </button>
        </MovingBorder>
      </div>
    );
  }

  const addRoomGuest = (roomId: string, guestIndex: number, values: GuestFormValues) => {
    setRoomGuests((prev) => {
      const existing = prev.find((r) => r.roomId === roomId);
      const guests = existing ? [...existing.guests] : [];
      while (guests.length <= guestIndex) guests.push({ title: "", firstName: "", lastName: "", email: "", isdCode: "+91", contactNumber: "", isLeadGuest: false });
      guests[guestIndex] = {
        title: values.title,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email ?? "",
        isdCode: values.isdCode ?? "+91",
        contactNumber: values.contactNumber ?? "",
        panNumber: values.panNumber,
        isLeadGuest: values.isLeadGuest,
      };
      const without = prev.filter((r) => r.roomId !== roomId);
      return [...without, { roomId, guests }];
    });
  };

  const totalGuestsRequired = selectedRoom.occupancies.reduce(
    (sum, occ) => sum + Math.max(1, parseInt(occ.numOfAdults || "1", 10)),
    0
  );
  const totalGuestsSaved = roomGuests.reduce(
    (sum, r) => sum + r.guests.filter((g) => g.firstName && g.lastName).length,
    0
  );

  const handleBook = async () => {
    const requiredRooms = selectedRoom.occupancies.length;
    const hasAllRooms = roomGuests.length >= requiredRooms;
    const hasAllGuests = totalGuestsSaved >= totalGuestsRequired;
    if (!hasAllRooms || !hasAllGuests) {
      toast.error(`Please save guest details for all ${totalGuestsRequired} passenger(s) across ${requiredRooms} room(s).`);
      return;
    }
    const roomDetails = roomGuests.map((r) => ({
      roomId: r.roomId,
      guests: r.guests
        .filter((g) => g.firstName && g.lastName)
        .map((g) => ({
          title: g.title,
          firstName: g.firstName,
          lastName: g.lastName,
          isLeadGuest: g.isLeadGuest,
          type: "Adult",
          email: g.email || "",
          contactNumber: g.contactNumber || "",
          isdCode: (g.isdCode || "+91").replace(/^\+/, ""),
          age: 30,
          passportNumber: "",
          passportExpiry: "",
          passportIssue: "",
        })),
    }));

    const payload = {
      traceId,
      hotelId: selectedRoom.hotelId,
      roomDetails,
      specialRequests: [] as string[],
      recommendationId: selectedRoom.optionId,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorDialogOpen(true);
        return;
      }
      setSubmitted(true);
      setSuccessDialogOpen(true);
    } catch {
      setErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFreshSearch = () => router.push("/search");

  const handleGuestSubmit = (roomId: string, guestIndex: number) => (values: GuestFormValues) => {
    addRoomGuest(roomId, guestIndex, values);
  };

  const isGuestSaved = (roomId: string, guestIndex: number) => {
    const room = roomGuests.find((r) => r.roomId === roomId);
    const guest = room?.guests[guestIndex];
    return !!(guest && guest.firstName && guest.lastName);
  };

  return (
    <>
      <StatusDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        type="error"
        title="Something went wrong"
        description="Please try again or start a fresh search."
        onFreshSearch={handleFreshSearch}
      />
      <StatusDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        type="success"
        title="Booking made successfully!"
        description="Your reservation has been confirmed."
        onFreshSearch={handleFreshSearch}
      />
    <div className="min-h-[calc(100vh-3.5rem)] bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            <BlurFade>
              <h1 className="text-2xl font-semibold">Guest details</h1>
            </BlurFade>
            {selectedRoom.occupancies.map((occ, roomIndex) => {
              const numAdults = Math.max(1, parseInt(occ.numOfAdults || "1", 10));
              return Array.from({ length: numAdults }, (_, guestIndex) => (
                <BlurFade key={`${occ.roomId}-${guestIndex}`} delay={(roomIndex * 2 + guestIndex) * 0.1}>
                  <Card className="border-[var(--border)] bg-[var(--surface)] border-l-4 border-l-[var(--accent-primary)]">
                    <CardContent className="pt-6">
                      <GuestForm
                        roomIndex={roomIndex}
                        guestIndex={guestIndex}
                        occupancy={occ}
                        isLeadGuest={roomIndex === 0 && guestIndex === 0}
                        onSubmit={handleGuestSubmit(occ.roomId, guestIndex)}
                        onSaved={isGuestSaved(occ.roomId, guestIndex)}
                      />
                    </CardContent>
                  </Card>
                </BlurFade>
              ));
            }).flat()}
            <div className="pt-4">
                <MovingBorder>
                  <button
                    type="button"
                    onClick={handleBook}
                    disabled={loading || submitted}
                    className="w-full rounded-button bg-[var(--accent-primary)] py-4 px-6 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submitted ? "Booked ✓" : loading ? "Booking..." : "Book Now"}
                  </button>
                </MovingBorder>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <BlurFade delay={0.2}>
              <Card className="border-[var(--border)] bg-[var(--surface)] overflow-hidden border-[var(--accent-primary)]/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Booking summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="font-medium">{selectedRoom.hotelName}</p>
                  <p className="text-muted-foreground">{selectedRoom.roomName}</p>
                  <p className="text-muted-foreground">{selectedRoom.boardBasis}</p>
                  <div className="pt-4 border-t border-[var(--border)]">
                    <span className="text-2xl font-semibold text-[var(--accent-primary)]">
                      ₹{formatPriceInINR(selectedRoom.price)}
                    </span>
                    <span className="ml-1 text-muted-foreground">{selectedRoom.currency}</span>
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
