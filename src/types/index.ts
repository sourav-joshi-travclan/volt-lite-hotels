export interface Occupancy {
  numOfAdults: number;
  childAges: number[];
}

export type LocationType = "City" | "Hotel" | "Airport" | "Area";

export interface LocationResult {
  id: string;
  name: string;
  type: LocationType;
  referenceId?: string;
}

export interface Hotel {
  hotelId: string;
  name: string;
  starRating: number;
  address: string;
  images: string[];
  minPrice: number;
  currency: string;
  heroImage?: string;
  hotelName?: string;
  id?: string;
  availability?: {
    rate?: {
      finalRate?: number;
      currency?: string;
    };
  };
}

export interface RoomOptionOccupancy {
  roomId: string;
  numOfAdults: string;
  numOfChildren: string;
  childAges?: string[];
}

export interface CancellationPolicy {
  estimatedValue: number;
  start: string;
  end: string;
}

export interface RoomOption {
  optionId: string;
  rate: {
    finalRate: number;
    currency: string;
    boardBasis?: { description: string; type: string };
    refundability?: string;
    occupancies: RoomOptionOccupancy[];
    cancellationPolicies?: CancellationPolicy[];
  };
  roomName?: string;
  boardBasis?: string;
}

export interface SelectedRoom {
  optionId: string;
  hotelId: string;
  hotelName: string;
  roomName: string;
  price: number;
  currency: string;
  boardBasis: string;
  occupancies: RoomOptionOccupancy[];
  cancellationPolicies?: CancellationPolicy[];
}

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  nationality: string;
  occupancies: Occupancy[];
  locationId: string;
  hotelIds?: string[];
  page?: number;
  pageSize?: number;
}

export interface GuestFormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  isdCode: string;
  contactNumber: string;
  panNumber?: string;
  isLeadGuest: boolean;
}

export interface RoomGuestDetails {
  roomId: string;
  guests: Array<{
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    isdCode: string;
    contactNumber: string;
    panNumber?: string;
    isLeadGuest: boolean;
  }>;
}

export interface BookingRecord {
  bookingId: string;
  status: string;
  checkIn?: string;
  checkOut?: string;
  hotelName?: string;
  totalAmount?: number;
  currency?: string;
  [key: string]: unknown;
}
