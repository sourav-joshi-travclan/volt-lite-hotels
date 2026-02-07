"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

interface DatePickerProps {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  onDatesChange: (checkIn: Date, checkOut: Date) => void;
  className?: string;
}

export function DatePicker({
  checkIn,
  checkOut,
  onDatesChange,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const range: DateRange = React.useMemo(
    () => ({
      from: checkIn,
      to: checkOut,
    }),
    [checkIn, checkOut]
  );

  const handleSelect = (range: DateRange | undefined) => {
    if (!range?.from) return;
    if (range.to) {
      onDatesChange(range.from, range.to);
      setOpen(false);
    } else {
      onDatesChange(range.from, range.from);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal border-[var(--border)] bg-[var(--surface)]",
              !range.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, "dd MMM yyyy")} –{" "}
                  {format(range.to, "dd MMM yyyy")}
                </>
              ) : (
                format(range.from, "dd MMM yyyy")
              )
            ) : (
              "Check-in – Check-out"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-[var(--surface)] border-[var(--border)]" align="start">
          <Calendar
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
