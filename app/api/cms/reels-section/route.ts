/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOCAL_BACKEND = "https://crunch-veda-backend.onrender.com/api";
const REMOTE_BACKEND =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  process.env.BACKEND_API_URL ||
  "https://crunch-veda-backend.onrender.com/api";

const jsonFilePath = path.join(process.cwd(), "json/mock/reels-data.json");

const readLocalData = () => {
  try {
    if (fs.existsSync(jsonFilePath)) {
      const content = fs.readFileSync(jsonFilePath, "utf8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Failed to read local reels JSON:", error);
  }
  return null;
};

const tryFetch = async (url: string, options?: RequestInit) => {
  try {
    const res = await fetch(url, { ...options, cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

export async function GET() {
  const cleanUrl = (url: string) => {
    if (typeof url !== "string") return url;
    return url.replace(/%22$/, "").replace(/"$/, "").trim();
  };

  const formatReelsResponse = (data: any) => {
    const rawReels = Array.isArray(data.reels) ? data.reels : [];
    const formattedReels = rawReels.map((r: any) => ({
      reelsVideo: cleanUrl(r.reelsVideo || r.link || ""),
      reelsImage: cleanUrl(r.reelsImage || r.image || "")
    }));

    return {
      sectionTitle: data.sectionTitle || "Trending Reels",
      sectionDescription: data.sectionDescription || "Discover our products in action through these short videos",
      reels: formattedReels
    };
  };

  // 1. Try local Express backend /cms/reels-section
  const localRes = await tryFetch(`${LOCAL_BACKEND}/cms/reels-section`);
  if (localRes && localRes.reels) {
    return NextResponse.json(formatReelsResponse(localRes));
  }

  // 2. Try remote Express backend /cms/reels-section
  const remoteRes = await tryFetch(`${REMOTE_BACKEND}/cms/reels-section`);
  if (remoteRes && remoteRes.reels) {
    return NextResponse.json(formatReelsResponse(remoteRes));
  }

  // 3. Fallback to local JSON file
  const localJson = readLocalData();
  if (localJson) {
    return NextResponse.json(formatReelsResponse(localJson));
  }

  return NextResponse.json(
    { success: false, message: "Unable to retrieve reels section data." },
    { status: 502 }
  );
}

export async function PUT(request: Request) {
  const authorization = request.headers.get("authorization");
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON payload" }, { status: 400 });
  }

  const { sectionTitle, sectionDescription, reels } = body;

  const cleanUrl = (url: string) => {
    if (typeof url !== "string") return url;
    return url.replace(/%22$/, "").replace(/"$/, "").trim();
  };

  const formattedReels = Array.isArray(reels)
    ? reels.map((r: any) => ({
        reelsVideo: cleanUrl(r.reelsVideo || ""),
        reelsImage: cleanUrl(r.reelsImage || "")
      }))
    : [];

  const payload = {
    sectionTitle,
    sectionDescription,
    reels: formattedReels
  };

  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: JSON.stringify(payload)
  };

  let savedToBackend = false;

  // Try local first
  try {
    const localRes = await fetch(`${LOCAL_BACKEND}/cms/reels-section`, { ...options, cache: "no-store" });
    if (localRes.ok) {
      savedToBackend = true;
    }
  } catch (error) {
    // Silently continue
  }

  // Try remote next
  if (!savedToBackend) {
    try {
      const remoteRes = await fetch(`${REMOTE_BACKEND}/cms/reels-section`, { ...options, cache: "no-store" });
      if (remoteRes.ok) {
        savedToBackend = true;
      }
    } catch (error) {
      // Silently continue
    }
  }

  // Save locally to fallback
  try {
    const dirPath = path.dirname(jsonFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(jsonFilePath, JSON.stringify(payload, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write to reels-data.json:", err);
  }

  return NextResponse.json({
    success: true,
    data: payload,
    savedToBackend
  });
}
