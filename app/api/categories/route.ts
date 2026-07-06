/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

// Local backend (primary) — same machine, same process
const LOCAL_API = "http://localhost:5000/api";

// Remote backend (fallback) — same logic as home banner
const REMOTE_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  process.env.BACKEND_API_URL ||
  "http://192.168.6.128:5000/api";

const readBackendJson = async (response: Response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {
      status: "error",
      message: "Categories server returned a non-JSON response.",
      preview: text.slice(0, 180).replace(/\s+/g, " ").trim(),
    };
  }
};

/** Normalize any backend response to a flat { success, data: ICategory[] } shape */
const normalizeCategories = (raw: any): { success: boolean; data: any[] } => {
  const isSuccess = raw.status === "success" || raw.success === true;
  const arr = Array.isArray(raw.data)
    ? raw.data
    : (raw.data?.categories || []);
  return { success: isSuccess, data: arr };
};

/** Normalize a single category from any backend shape */
const normalizeCategory = (raw: any): { success: boolean; data: any } => {
  const isSuccess = raw.status === "success" || raw.success === true;
  const cat = raw.data?.category || raw.data;
  return { success: isSuccess, data: cat };
};

/** Try to fetch from an endpoint; return null on network failure */
const tryFetch = async (url: string, options?: RequestInit): Promise<{ data: any; ok: boolean } | null> => {
  try {
    const res = await fetch(url, { ...options, cache: "no-store" });
    const data = await readBackendJson(res);
    return { data, ok: res.ok };
  } catch {
    return null;
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryStr = searchParams.toString();
  const path = `/categories${queryStr ? `?${queryStr}` : ""}`;

  // 1. Try local backend first (home banner pattern)
  const local = await tryFetch(`${LOCAL_API}${path}`);
  if (local?.ok) {
    const normalized = normalizeCategories(local.data);
    return NextResponse.json({ success: true, data: normalized.data }, { status: 200 });
  }

  // 2. Fallback to remote backend
  const remote = await tryFetch(`${REMOTE_API_URL}${path}`);
  if (remote?.ok) {
    const normalized = normalizeCategories(remote.data);
    return NextResponse.json({ success: true, data: normalized.data }, { status: 200 });
  }

  return NextResponse.json(
    { status: "error", message: "Unable to connect to the categories server." },
    { status: 502 }
  );
}

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");
  const contentType = request.headers.get("content-type") || "";

  let bodyBlob: Blob;
  try {
    bodyBlob = await request.blob();
  } catch {
    return NextResponse.json({ status: "error", message: "Failed to read request body." }, { status: 400 });
  }

  const options: RequestInit = {
    method: "POST",
    headers: {
      ...(contentType ? { "Content-Type": contentType } : {}),
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: bodyBlob,
  };

  // 1. Try local backend first
  const local = await tryFetch(`${LOCAL_API}/categories`, options);
  if (local?.ok) {
    const normalized = normalizeCategory(local.data);
    return NextResponse.json({ success: true, data: normalized.data }, { status: 201 });
  }

  // 2. Fallback to remote backend
  const remote = await tryFetch(`${REMOTE_API_URL}/categories`, options);
  if (remote?.ok) {
    const normalized = normalizeCategory(remote.data);
    return NextResponse.json({ success: true, data: normalized.data }, { status: 201 });
  }

  // Surface the actual error from whichever backend responded
  const errorData = local?.data || remote?.data || {};
  return NextResponse.json(
    { status: "error", message: errorData.message || "Failed to create category." },
    { status: 400 }
  );
}
