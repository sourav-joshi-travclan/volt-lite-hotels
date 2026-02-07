"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MovingBorder } from "@/components/aceternityui/moving-border";
import type { RoomOptionOccupancy } from "@/types";

const guestSchema = z.object({
  title: z.enum(["Mr", "Mrs", "Ms", "Miss"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().optional(),
  isdCode: z.string().optional(),
  contactNumber: z.string().optional(),
  panNumber: z.string().optional(),
  isLeadGuest: z.boolean(),
}).refine((data) => {
  if (!data.isLeadGuest) return true;
  return !!data.email && !!data.contactNumber && (data.contactNumber?.length ?? 0) >= 10 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? "");
}, { message: "Lead guest must have valid email and phone", path: ["email"] });

export type GuestFormValues = z.infer<typeof guestSchema>;

interface GuestFormProps {
  roomIndex: number;
  guestIndex: number;
  occupancy: RoomOptionOccupancy;
  defaultValues?: Partial<GuestFormValues>;
  isLeadGuest: boolean;
  onSubmit: (values: GuestFormValues) => void;
  onSaved?: boolean;
  children?: React.ReactNode;
}

const TITLES = ["Mr", "Mrs", "Ms", "Miss"];
const ISD_CODES = ["+91", "+1", "+44", "+971", "+65"];

export function GuestForm({
  roomIndex,
  guestIndex,
  occupancy,
  defaultValues,
  isLeadGuest,
  onSubmit,
  onSaved,
  children,
}: GuestFormProps) {
  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      title: "Mr",
      firstName: "",
      lastName: "",
      email: "",
      isdCode: "+91",
      contactNumber: "",
      panNumber: "",
      isLeadGuest,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="font-semibold text-lg">
          Room {roomIndex + 1}, Guest {guestIndex + 1} — {occupancy.numOfAdults} Adult(s)
          {Number(occupancy.numOfChildren) > 0 && `, ${occupancy.numOfChildren} Child(ren)`}
        </h3>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="border-[var(--border)] bg-[var(--surface)]">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TITLES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input className="border-[var(--border)] bg-[var(--surface)]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input className="border-[var(--border)] bg-[var(--surface)]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {isLeadGuest && (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" className="border-[var(--border)] bg-[var(--surface)]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isdCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <div className="flex gap-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-24 border-[var(--border)] bg-[var(--surface)]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ISD_CODES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field: f }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="9876543210" className="border-[var(--border)] bg-[var(--surface)]" {...f} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="panNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="ABCDE1234F" className="border-[var(--border)] bg-[var(--surface)]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <MovingBorder>
          <Button type="submit" variant="secondary" className="rounded-button">
            {onSaved ? "Update" : "Save guest"}
          </Button>
        </MovingBorder>
        {children}
      </form>
    </Form>
  );
}
