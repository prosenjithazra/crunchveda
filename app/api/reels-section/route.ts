/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOCAL_BACKEND = "http://localhost:5000/api";
const REMOTE_BACKEND =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  process.env.BACKEND_API_URL ||
  "http://192.168.6.128:5000/api";

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

  const formatToAdminRecord = (data: any) => {
    const rawReels = Array.isArray(data.reels) ? data.reels : [];
    const formattedReels = rawReels.map((r: any) => ({
      image: cleanUrl(r.reelsImage || r.image || ""),
      link: cleanUrl(r.reelsVideo || r.link || ""),
      alt: r.alt || "Trending Reel"
    }));

    return {
      id: "home-instagram",
      title: "Instagram Reels section",
      type: "Instagram Reels",
      status: "Published",
      updatedAt: new Date().toISOString().slice(0, 10),
      fields: [
        { id: "heading", label: "Section heading", type: "text", value: data.sectionTitle || "Trending Reels" },
        { id: "description", label: "Intro copy", type: "textarea", value: data.sectionDescription || "Discover our products in action through these short videos" },
        { id: "reels", label: "Instagram Reels", type: "textarea", value: formattedReels },
        { id: "showSection", label: "Show section", type: "toggle", value: true }
      ]
    };
  };

  // 1. Try local Express backend /reels-section
  const localRes = await tryFetch(`${LOCAL_BACKEND}/reels-section`);
  if (localRes && localRes.reels) {
    return NextResponse.json({ success: true, data: formatToAdminRecord(localRes) });
  }

  // 2. Try remote Express backend /reels-section
  const remoteRes = await tryFetch(`${REMOTE_BACKEND}/reels-section`);
  if (remoteRes && remoteRes.reels) {
    return NextResponse.json({ success: true, data: formatToAdminRecord(remoteRes) });
  }

  // 3. Fallback to local JSON file
  const localJson = readLocalData();
  if (localJson) {
    return NextResponse.json({ success: true, data: formatToAdminRecord(localJson) });
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

  // Map the Admin record fields back to the flat endpoint keys
  const fields = body.fields || [];
  const sectionTitle = fields.find((f: any) => f.id === "heading")?.value || "";
  const sectionDescription = fields.find((f: any) => f.id === "description")?.value || "";
  const reelsField = fields.find((f: any) => f.id === "reels")?.value || [];

  const reels = Array.isArray(reelsField)
    ? reelsField.map((r: any) => ({
        reelsVideo: r.link || "",
        reelsImage: r.image || ""
      }))
    : [];

  const payload = {
    sectionTitle,
    sectionDescription,
    reels
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
    const localRes = await fetch(`${LOCAL_BACKEND}/reels-section`, { ...options, cache: "no-store" });
    if (localRes.ok) {
      savedToBackend = true;
    }
  } catch (error) {
    // Silently continue
  }

  // Try remote next
  if (!savedToBackend) {
    try {
      const remoteRes = await fetch(`${REMOTE_BACKEND}/reels-section`, { ...options, cache: "no-store" });
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
    data: body,
    savedToBackend
  });
}
