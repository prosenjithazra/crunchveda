import { NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  process.env.BACKEND_API_URL ||
  "https://crunch-veda-backend.onrender.com/api";

// Public GET — no auth required
export async function GET() {
  try {
    const res = await fetch(`${BACKEND_API_URL}/store-config`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Failed to fetch store config:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch store config" },
      { status: 500 }
    );
  }
}

// Admin PUT — update store config
export async function PUT(request: Request) {
  try {
    const token = request.headers.get("authorization");
    const body = await request.json();

    const res = await fetch(`${BACKEND_API_URL}/store-config`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Failed to update store config:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update store config" },
      { status: 500 }
    );
  }
}
