# Volt Lite Hotel Booking App

Agent-first hotel booking application for travel agents. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion.

## Requirements

- **Node.js 18+** (required for Next.js and modern syntax)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.local.example` to `.env.local` and adjust if needed:

   ```env
   VOLT_API_BASE_URL=https://hotel-volt-api-v1-qa.travclan.com
   LOCATION_API_BASE_URL=https://hotel-api-v3-qa.travclan.com
   AUTH_API_URL=https://trav-auth-qa.travclan.com
   NEXT_PUBLIC_APP_NAME=Volt Hotel
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). You will be redirected to `/login` if not authenticated.

## Project structure

- `src/app` – App Router pages and API routes
  - `(dashboard)/` – Protected routes: search, hotels, hotel detail, booking, bookings
  - `api/` – Proxy API routes for auth, search, locations, rooms, price-check, guest-rules, book, bookings
  - `login/` – Login page
- `src/components` – UI and feature components
  - `ui/` – shadcn-style components (Button, Card, Input, Select, Calendar, Form, etc.)
  - `magicui/` – BlurFade, ShimmerButton, NumberTicker
  - `aceternityui/` – BackgroundBeams, TextGenerateEffect, TypewriterEffect, MovingBorder
  - `search/` – DatePicker, GuestSelector, LocationSearch
  - `hotels/` – HotelCard, HotelCardSkeleton
  - `booking/` – GuestForm
  - `layout/` – Header
- `src/store` – Zustand stores (auth, booking)
- `src/lib` – utils, api-client
- `src/types` – TypeScript interfaces

## Features

- **Login** – POST to auth API; tokens stored in HTTP-only cookies
- **Search** – Location autocomplete, date range, rooms/guests, nationality; results and `traceId` stored
- **Hotels list** – Grid of hotel cards with image, name, stars, price; link to hotel detail with `traceId`
- **Hotel detail** – Rooms and rates from `roomsandrates` API; price check and “Select Room” → booking
- **Booking** – Guest form(s) per room; lead guest email/phone; POST to book API
- **Bookings** – List of past bookings from getbookings API

## API usage

All client requests go through Next.js API routes under `/api/*`, which add the `Authorization: Bearer {accessToken}` and `source: website` headers and forward to the configured backend URLs. This avoids CORS and keeps tokens server-side (cookies).

## Build

```bash
npm run build
npm run start
```

## Notes

- Use **Node 18+** to run and build. Older Node may hit syntax or dependency errors.
- The app uses **Zustand** for client state (auth and booking/search). Auth is persisted in localStorage via `persist`; re-login is required if cookies are cleared.
- **traceId** from the search response is kept in the booking store and passed through rooms, price-check, and book flows.
