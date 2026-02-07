import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const VOLT_API_BASE_URL =
  process.env.VOLT_API_BASE_URL || "https://hotel-volt-api-v1-qa.travclan.com";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { hotelId } = await params;
  try {
    const body = await request.json();
    const res = await fetch(`https://hotel-volt-api-sandbox.travclan.com/api/v1/roomsandrates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        source: "website",
      },
      body: JSON.stringify({
        traceId: body.traceId,
        hotelId: hotelId || body.hotelId,
      }),
    });

    const data = await res.json().catch(() => ({}));
    console.log(data, '======================')
    if (!res.ok) {
      return NextResponse.json(
        { message: (data as { message?: string }).message || "Failed to fetch rooms" },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
