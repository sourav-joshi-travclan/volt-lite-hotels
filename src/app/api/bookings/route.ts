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
    const body = await request.json().catch(() => ({}));
    const res = await fetch(`${VOLT_API_BASE_URL}/api/v1/getbookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        source: "website",
      },
      body: JSON.stringify({
        page: body.page ?? 1,
        pageSize: body.pageSize ?? 10,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { message: (data as { message?: string }).message || "Failed to fetch bookings" },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
