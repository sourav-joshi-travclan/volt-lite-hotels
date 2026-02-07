import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  // Logged-in users visiting login should go to search
  if (token && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/search", request.url));
  }

  return NextResponse.next();
}
