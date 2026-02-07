"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CardContainer } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";
import { MovingBorder } from "@/components/aceternityui/moving-border";
import type { Hotel } from "@/types";
import { cn } from "@/lib/utils";
import { formatPriceInINR } from "@/lib/format-price";
import { getHotelFallbackImage } from "@/lib/hotel-images";

interface HotelCardProps {
  hotel: Hotel;
  traceId: string | null;
}

function getHotelId(h: Hotel): string {
  return h.hotelId ?? (h as { id?: string }).id ?? "";
}

function getHotelName(h: Hotel): string {
  return h.hotelName ?? h.name ?? "";
}

function getMinPrice(h: Hotel): number {
  if (typeof h.minPrice === "number") return h.minPrice;
  const rate = (h as { availability?: { rate?: { finalRate?: number } } }).availability?.rate?.finalRate;
  return typeof rate === "number" ? rate : 0;
}

function getImage(h: Hotel, fallbackSeed?: string): string {
  const img = h.heroImage ?? (h.images && h.images[0]) ?? "";
  return img || getHotelFallbackImage(fallbackSeed ?? h.hotelId ?? (h as { id?: string }).id);
}

export function HotelCard({ hotel, traceId }: HotelCardProps) {
  const router = useRouter();
  const id = getHotelId(hotel);
  const name = getHotelName(hotel);
  const minPrice = getMinPrice(hotel);
  const currency = (hotel as { currency?: string }).currency ?? hotel.availability?.rate?.currency ?? "INR";
  const imageUrl = getImage(hotel);
  const stars = hotel.starRating ?? 0;

  const handleClick = () => {
    const searchParams = new URLSearchParams();
    if (traceId) searchParams.set("traceId", traceId);
    const query = searchParams.toString();
    const url = query ? `/hotels/${id}?${query}` : `/hotels/${id}`;
    router.push(url);
  };

  return (
    <CardContainer containerClassName="py-0 !items-stretch w-full h-full" className="w-full h-full">
      <Card
        className="group w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[var(--accent-primary)]/30 hover:shadow-lg hover:shadow-[var(--accent-primary)]/5 cursor-pointer h-full flex flex-col"
        onClick={handleClick}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface-elevated)] flex-shrink-0">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={!imageUrl.includes("images.unsplash.com") && imageUrl.startsWith("http")}
          />
        </div>
        <CardContent className="p-4 space-y-2 flex-1 flex flex-col min-h-0">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">{name}</h3>
          <div className="min-h-[20px] flex items-center">
            {stars > 0 && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < stars
                        ? "fill-amber-400 text-amber-400"
                        : "text-[var(--border)]"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-3 p-4 pt-0 flex-shrink-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold text-[var(--accent-primary)]">
              ₹{formatPriceInINR(minPrice)}
            </span>
            <span className="text-sm text-muted-foreground flex-shrink-0">{currency}</span>
          </div>
          <MovingBorder>
            <Button variant="default" size="sm" className="rounded-button w-full sm:w-auto">
              View Rooms →
            </Button>
          </MovingBorder>
        </CardFooter>
    </Card>
    </CardContainer>
  );
}
