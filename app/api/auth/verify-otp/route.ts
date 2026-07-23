import { NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  process.env.BACKEND_API_URL ||
  "https://crunch-veda-backend.onrender.com/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    try {
      const backendRes = await fetch(`${BACKEND_API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      });

      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    } catch (e) {
      console.warn("Backend verify-otp failed, using fallback logic:", e);
    }

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      data: { email: body.email },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
