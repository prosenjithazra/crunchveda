import { NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  process.env.BACKEND_API_URL ||
  "https://crunch-veda-backend.onrender.com/api";

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
      message: "Upload server returned a non-JSON response.",
      preview: text.slice(0, 180).replace(/\s+/g, " ").trim(),
    };
  }
};

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");

  try {
    const formData = await request.formData();
    
    // Check if the backend expects "video" or "image" resource type. 
    // We forward the formData exactly as received to the backend's video upload endpoint.
    const backendResponse = await fetch(`${BACKEND_API_URL}/upload/video`, {
      method: "POST",
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: formData,
      cache: "no-store",
    });
    const data = await readBackendJson(backendResponse);

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to connect to the upload server.";
    return NextResponse.json({ status: "error", message }, { status: 502 });
  }
}
