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
      message: "Products server returned a non-JSON response.",
      preview: text.slice(0, 180).replace(/\s+/g, " ").trim(),
    };
  }
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/products/${id}`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await readBackendJson(backendResponse);
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to connect to the products server.";
    return NextResponse.json({ status: "error", message }, { status: 502 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authorization = request.headers.get("authorization");
  const contentType = request.headers.get("content-type") || "";

  try {
    const bodyBlob = await request.blob();
    const backendResponse = await fetch(`${BACKEND_API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        ...(contentType ? { "Content-Type": contentType } : {}),
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: bodyBlob,
      cache: "no-store",
    });
    const data = await readBackendJson(backendResponse);
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to connect to the products server.";
    return NextResponse.json({ status: "error", message }, { status: 502 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authorization = request.headers.get("authorization");

  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
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
