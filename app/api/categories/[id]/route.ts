/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const LOCAL_API = "https://crunch-veda-backend.onrender.com/api";

const REMOTE_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  process.env.BACKEND_API_URL ||
  "https://crunch-veda-backend.onrender.com/api";

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authorization = request.headers.get("authorization");
  const contentType = request.headers.get("content-type") || "";

  let bodyBlob: Blob;
  try {
    bodyBlob = await request.blob();
  } catch {
    return NextResponse.json({ status: "error", message: "Failed to read request body." }, { status: 400 });
  }

  const options: RequestInit = {
    method: "PUT",
    headers: {
      ...(contentType ? { "Content-Type": contentType } : {}),
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: bodyBlob,
  };

  // 1. Try local backend first (home banner pattern)
  const local = await tryFetch(`${LOCAL_API}/categories/${id}`, options);
  if (local?.ok) {
    const normalized = normalizeCategory(local.data);
    return NextResponse.json({ success: true, data: normalized.data }, { status: 200 });
  }

  // 2. Fallback to remote backend
  const remote = await tryFetch(`${REMOTE_API_URL}/categories/${id}`, options);
  if (remote?.ok) {
    const normalized = normalizeCategory(remote.data);
    return NextResponse.json({ success: true, data: normalized.data }, { status: 200 });
  }

  const errorData = local?.data || remote?.data || {};
  return NextResponse.json(
    { status: "error", message: errorData.message || "Failed to update category." },
    { status: 400 }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authorization = request.headers.get("authorization");

  const options: RequestInit = {
    method: "DELETE",
    headers: {
      ...(authorization ? { Authorization: authorization } : {}),
    },
  };

  // 1. Try local backend first
  const local = await tryFetch(`${LOCAL_API}/categories/${id}`, options);
  if (local?.ok) {
    return NextResponse.json({ success: true, data: local.data?.data || { id } }, { status: 200 });
  }

  // 2. Fallback to remote backend
  const remote = await tryFetch(`${REMOTE_API_URL}/categories/${id}`, options);
  if (remote?.ok) {
    return NextResponse.json({ success: true, data: remote.data?.data || { id } }, { status: 200 });
  }

  const errorData = local?.data || remote?.data || {};
  return NextResponse.json(
    { status: "error", message: errorData.message || "Failed to delete category." },
    { status: 400 }
  );
}
