import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LOCATION_API_BASE_URL =
  process.env.LOCATION_API_BASE_URL || "https://hotel-api-sandbox.travclan.com";

export async function GET(request: NextRequest) {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  const url = `https://hotel-api-sandbox.travclan.com/api/v1/locations/search?searchString=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Authorization-Type": "external-service",
          "source": 'website'
        },
      }
    );


    const data = await res.json().catch(() => []);
    if (!res. ok) {
      return NextResponse.json(
        { message: (data as { message?: string }).message || "Search failed" },
        { status: res.status }
      );
    }
    return NextResponse.json(data.results);
  } catch (e) {
    return NextResponse.json( 
      { message: e instanceof Error ? e.message : "Search failed" },
      { status: 500 }
    );
  }
}
