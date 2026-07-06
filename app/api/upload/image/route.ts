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
      message: "Upload server returned a non-JSON response.",
      preview: text.slice(0, 180).replace(/\s+/g, " ").trim(),
    };
  }
};

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Failed to parse form data." }, { status: 400 });
  }

  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/upload`, {
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
    const message = error instanceof Error ? error.message : "Backend connection failed during upload.";
    return NextResponse.json({ status: "error", message }, { status: 502 });
  }
}
