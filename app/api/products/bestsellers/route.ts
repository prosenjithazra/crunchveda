/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  process.env.BACKEND_API_URL ||
  "http://192.168.6.128:5000/api";

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
      message: "Bestsellers server returned a non-JSON response.",
      preview: text.slice(0, 180).replace(/\s+/g, " ").trim(),
    };
  }
};

export async function GET() {
  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/products/bestsellers`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await readBackendJson(backendResponse);
    if (backendResponse.ok && data.status !== "error") {
      return NextResponse.json(data, { status: backendResponse.status });
    }
    console.warn("Backend /products/bestsellers returned error, attempting proxy fallback...");
  } catch (error) {
    console.error("Backend /products/bestsellers connection error, attempting proxy fallback...", error);
  }

  // Fallback: fetch all active products from backend and filter by badge
  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/products?limit=200`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await readBackendJson(backendResponse);
    if (!backendResponse.ok || data.status === "error") {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    const products = Array.isArray(data.data) ? data.data : (data.data?.products || []);
    const filtered = products.filter((p: any) => p.isBestseller === true || (p.badge && /best\s*seller/i.test(p.badge)));

    return NextResponse.json(
      {
        status: "success",
        results: filtered.length,
        data: {
          products: filtered,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to connect to products server.";
    return NextResponse.json({ status: "error", message }, { status: 502 });
  }
}
