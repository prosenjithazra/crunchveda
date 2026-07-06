import { NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  process.env.BACKEND_API_URL ||
  "http://localhost:5000/api";

const readBackendJson = async (response: Response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      status: "error",
      message: "Products server returned a non-JSON response.",
      preview: text.slice(0, 180).replace(/\s+/g, " ").trim(),
    };
  }
};

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  const guestId = request.headers.get("x-session-id") || request.headers.get("x-guest-id") || "";

  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/products/cart`, {
      method: "GET",
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
        ...(guestId ? { "x-session-id": guestId } : {}),
      },
      cache: "no-store",
    });
    const data = await readBackendJson(backendResponse);
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to connect to the products server.";
    return NextResponse.json({ status: "error", message }, { status: 502 });
  }
}
