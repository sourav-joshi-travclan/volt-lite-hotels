"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/magicui/blur-fade";
import { TextHoverEffect } from "@/components/aceternityui/text-hover-effect";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { MovingBorder } from "@/components/aceternityui/moving-border";
import { formatPriceInINR } from "@/lib/format-price";
import type { BookingRecord } from "@/types";

interface BookingsResponse {
  data?: { bookings?: BookingRecord[]; total?: number };
  bookings?: BookingRecord[];
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ page: 1, pageSize: 10 }),
        });
        const data: BookingsResponse = await res.json();
        const list = data.data?.bookings ?? data.bookings ?? [];
        setBookings(Array.isArray(list) ? list : []);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getStatusVariant = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("confirm")) return "success";
    if (s.includes("pending")) return "warning";
    if (s.includes("cancel")) return "destructive";
    if (s.includes("fail")) return "destructive";
    return "secondary";
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[var(--background)] relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30">
        <BackgroundLines className="!h-full !min-h-[calc(100vh-3.5rem)] !bg-transparent dark:!bg-transparent">
          {null}
        </BackgroundLines>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <BlurFade>
          <div className="mb-6">
            <TextHoverEffect text="Your Bookings" className="text-3xl font-semibold tracking-tight" />
          </div>
        </BlurFade>

        {loading ? (
          <div className="rounded-lg border border-[var(--border)] divide-y divide-[var(--border)]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 flex items-center px-4">
                <div className="h-4 w-32 bg-[var(--surface-elevated)] rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <BlurFade>
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-xl text-muted-foreground">No bookings yet</p>
              <Link href="/search">
                <MovingBorder>
                  <Button variant="default" className="mt-4 rounded-button">
                    Search hotels
                  </Button>
                </MovingBorder>
              </Link>
            </div>
          </BlurFade>
        ) : (
          <BlurFade>
            <div className="rounded-lg border border-[var(--border)] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-[var(--border)] bg-[var(--surface)]">
                    <TableHead className="text-muted-foreground">Booking ID</TableHead>
                    <TableHead className="text-muted-foreground">Hotel</TableHead>
                    <TableHead className="text-muted-foreground">Dates</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b, i) => (
                    <TableRow key={(b as { bookingId?: string }).bookingId ?? i} className="border-[var(--border)]">
                      <TableCell className="font-mono text-sm">
                        {(b as { bookingId?: string }).bookingId ?? "-"}
                      </TableCell>
                      <TableCell>{(b as { hotelName?: string }).hotelName ?? "-"}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {(b as { checkIn?: string }).checkIn && (b as { checkOut?: string }).checkOut
                          ? `${(b as { checkIn: string }).checkIn} – ${(b as { checkOut: string }).checkOut}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant((b as { status?: string }).status ?? "")}>
                          {(b as { status?: string }).status ?? "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {(b as { totalAmount?: number }).totalAmount != null ? (
                          <>
                            ₹{formatPriceInINR((b as { totalAmount: number }).totalAmount)}
                            <span className="ml-1 text-muted-foreground text-sm">
                              {(b as { currency?: string }).currency ?? "INR"}
                            </span>
                          </>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </BlurFade>
        )}
      </div>
    </div>
  );
}
