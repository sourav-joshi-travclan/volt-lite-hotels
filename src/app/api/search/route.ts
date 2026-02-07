import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const VOLT_API_BASE_URL =
  process.env.VOLT_API_BASE_URL || "https://hotel-volt-api-v1-qa.travclan.com";

export async function POST(request: NextRequest) {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const res = await fetch('https://hotel-volt-api-sandbox.travclan.com/api/v1/search', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        source: "website",
        "Authorization-Type": "external-service",
      },
      body: JSON.stringify({
        checkIn: body.checkIn,
        checkOut: body.checkOut,
        nationality: body.nationality || "IN",
        occupancies: body.occupancies || [{ numOfAdults: 2, childAges: [] }],
        locationId: body.locationId,
        hotelIds: body.hotelIds || undefined,
        page: body.page ?? 1,
        pageSize: body.pageSize ?? 20,
        traceId: body.traceId ?? null,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { message: (data as { message?: string }).message || "Search failed" },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Search failed" },
      { status: 500 }
    );
  }
}
