import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SearchParams, Hotel, SelectedRoom } from "@/types";

interface BookingState {
  searchParams: SearchParams | null;
  searchResults: Hotel[];
  traceId: string | null;
  selectedRoom: SelectedRoom | null;
  setSearchParams: (params: SearchParams | null) => void;
  setSearchResults: (results: Hotel[], traceId: string | null) => void;
  setSelectedRoom: (room: SelectedRoom | null) => void;
  reset: () => void;
}

const defaultSearchParams: SearchParams = {
  checkIn: "",
  checkOut: "",
  nationality: "IN",
  occupancies: [{ numOfAdults: 2, childAges: [] }],
  locationId: "",
  hotelIds: [],
  page: 1,
  pageSize: 20,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      searchParams: null,
      searchResults: [],
      traceId: null,
      selectedRoom: null,
      setSearchParams: (searchParams) => set({ searchParams }),
      setSearchResults: (searchResults, traceId) => set({ searchResults, traceId }),
      setSelectedRoom: (selectedRoom) => set({ selectedRoom }),
      reset: () =>
        set({
          searchParams: null,
          searchResults: [],
          traceId: null,
          selectedRoom: null,
        }),
    }),
    { name: "volt-booking", partialize: (s) => ({ traceId: s.traceId, searchResults: s.searchResults, searchParams: s.searchParams }) }
  )
);

export { defaultSearchParams };
