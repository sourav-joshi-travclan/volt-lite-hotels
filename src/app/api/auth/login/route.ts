import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const AUTH_API_URL = process.env.AUTH_API_URL || "https://trav-auth-qa.travclan.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body)
    const {username, password} = body;
    if(username !== "test" || password !== "test") {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    const res = await fetch(`https://trav-auth-sandbox.travclan.com/authentication/internal/service/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: "merewjraxf4",
        user_id: "ac11bfce9",
        api_key: "b27c726d-558e-4b9b-a76b-3d1337deabcf"
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { message: (data as { message?: string }).message || "Login failed" },
        { status: res.status }
      );
    }

    const accessToken = (data as { accessToken?: string }).AccessToken;
    const refreshToken = (data as { refreshToken?: string }).RefreshToken;

    if (accessToken) {
      const cookieStore = await cookies();
      cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      if (refreshToken) {
        cookieStore.set("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
      }
    }

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Login failed" },
      { status: 500 }
    );
  }
}
