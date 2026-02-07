"use client";

import * as React from "react";
import { Search, Building2, Plane, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { LocationResult } from "@/types";

interface LocationSearchProps {
  value: LocationResult | null;
  onSelect: (location: LocationResult) => void;
  placeholder?: string;
  className?: string;
}

export function LocationSearch({
  value,
  onSelect,
  placeholder = "City, hotel, or airport",
  className,
}: LocationSearchProps) {
  const [query, setQuery] = React.useState(value?.name ?? "");
  const [results, setResults] = React.useState<LocationResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    if (value) setQuery(value.name);
  }, [value]);

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/locations?query=${encodeURIComponent(query)}`,
          { credentials: "include" }
        );
        const data = await res.json();
        console.log(data, 'JKDASHJKHDASJKHDJK')
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case "Hotel":
        return <Building2 className="h-4 w-4 text-muted-foreground" />;
      case "Airport":
        return <Plane className="h-4 w-4 text-muted-foreground" />;
      default:
        return <MapPin className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder={placeholder}
        className="pl-9 border-[var(--border)] bg-[var(--surface)]"
      />
      {open && (query.trim() || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-input border border-[var(--border)] bg-[var(--surface)] shadow-lg">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No locations found
            </div>
          ) : (
            results.map((loc) => (
              <button
                key={loc.id}
                type="button"
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-[var(--surface-elevated)] transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(loc);
                  setQuery(loc.name);
                  setOpen(false);
                }}
              >
                {getIcon(loc.type)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{loc.name}</div>
                  <div className="text-xs text-muted-foreground">{loc.type}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
