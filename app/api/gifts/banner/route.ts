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

const jsonFilePath = path.join(process.cwd(), "json/mock/gifts-data.json");

const readLocalData = () => {
  try {
    if (fs.existsSync(jsonFilePath)) {
      const content = fs.readFileSync(jsonFilePath, "utf8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Failed to read local gifts JSON:", error);
  }
  return null;
};

const writeLocalData = (data: any) => {
  try {
    const dirPath = path.dirname(jsonFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Failed to write local gifts JSON:", error);
    return false;
  }
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

const isSuccessResponse = (response: any) => {
  return (response?.success === true || response?.status === "success") && response?.data;
};

const mergeLocalBannerFallback = (backendBanner: any) => {
  const localJson = readLocalData();
  const record = localJson?.records?.find((r: any) => r.id === "gifts-header");
  if (!record || !record.fields) return backendBanner;

  const getVal = (id: string) => record.fields.find((f: any) => f.id === id)?.value;
  const merged = { ...backendBanner };

  if (!merged.bannerLabel) merged.bannerLabel = getVal("eyebrow");
  if (!merged.bannerTitle) merged.bannerTitle = getVal("headline");
  if (!merged.bannerDescription) merged.bannerDescription = getVal("description");

  return merged;
};

export async function GET() {
  // 1. Try local Express backend
  const localRes = await tryFetch(`${LOCAL_BACKEND}/gifts/banner`);
  if (isSuccessResponse(localRes)) {
    const banner = localRes.data?.banner || {};
    const merged = mergeLocalBannerFallback(banner);
    return NextResponse.json({
      success: true,
      status: "success",
      data: { banner: merged }
    });
  }

  // 2. Try remote Express backend
  const remoteRes = await tryFetch(`${REMOTE_BACKEND}/gifts/banner`);
  if (isSuccessResponse(remoteRes)) {
    const banner = remoteRes.data?.banner || {};
    const merged = mergeLocalBannerFallback(banner);
    return NextResponse.json({
      success: true,
      status: "success",
      data: { banner: merged }
    });
  }

  // 3. Fallback to local JSON file
  const localJson = readLocalData();
  const record = localJson?.records?.find((r: any) => r.id === "gifts-header");
  if (record && record.fields) {
    const getVal = (id: string) => record.fields.find((f: any) => f.id === id)?.value;
    return NextResponse.json({
      success: true,
      status: "success",
      data: {
        banner: {
          bannerLabel: getVal("eyebrow") || "ARTISANAL GIFTING",
          bannerTitle: getVal("headline") || "Curated with Intention.",
          bannerDescription: getVal("description") || "Discover our message of special celebrations, unique business appreciation, and hand-selected gestures for every occasion. Offering custom options for individual and corporate client projects."
        }
      }
    });
  }

  // 4. Hardcoded default fallback
  return NextResponse.json({
    success: true,
    status: "success",
    data: {
      banner: {
        bannerLabel: "ARTISANAL GIFTING",
        bannerTitle: "Curated with Intention.",
        bannerDescription: "Discover our message of special celebrations, unique business appreciation, and hand-selected gestures for every occasion. Offering custom options for individual and corporate client projects."
      }
    }
  });
}

export async function PUT(request: Request) {
  const authorization = request.headers.get("authorization");
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, status: "error", message: "Invalid JSON payload" }, { status: 400 });
  }

  const banner = body.banner;
  if (!banner) {
    return NextResponse.json({ success: false, status: "error", message: "Banner data is required" }, { status: 400 });
  }

  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify({ banner })
  };

  let savedToBackend = false;

  try {
    const localRes = await fetch(`${LOCAL_BACKEND}/gifts/banner`, { ...options, cache: "no-store" });
    if (localRes.ok) {
      const data = await localRes.json();
      if (data.status === "success" || data.success) savedToBackend = true;
    }
  } catch {}

  if (!savedToBackend) {
    try {
      const remoteRes = await fetch(`${REMOTE_BACKEND}/gifts/banner`, { ...options, cache: "no-store" });
      if (remoteRes.ok) {
        const data = await remoteRes.json();
        if (data.status === "success" || data.success) savedToBackend = true;
      }
    } catch {}
  }

  // Update local JSON mockup file to keep it in sync
  const localJson = readLocalData() || {
    id: "gifts",
    title: "Gifts Page",
    route: "/gifts",
    description: "Manage Gifting",
    pageType: "Commerce",
    records: [
      {
        id: "gifts-header",
        title: "Gifting intro",
        type: "Page header",
        status: "Published",
        fields: [
          { id: "eyebrow", label: "Subtitle", type: "text", value: "Artisanal Gifting" },
          { id: "headline", label: "H1 headline", type: "text", value: "Curated with\nIntention." },
          { id: "description", label: "Intro paragraph", type: "textarea", value: "Discover our message of special celebrations, unique business appreciation, and hand-selected gestures for every occasion." },
          { id: "showSection", label: "Show section", type: "toggle", value: true }
        ]
      }
    ]
  };

  const bannerRecordIndex = localJson?.records?.findIndex((r: any) => r.id === "gifts-header") ?? -1;
  if (localJson && localJson.records && bannerRecordIndex !== -1) {
    const record = localJson.records[bannerRecordIndex];
    record.updatedAt = new Date().toISOString().slice(0, 10);
    record.fields = record.fields.map((field: any) => {
      if (field.id === "eyebrow") return { ...field, value: banner.bannerLabel };
      if (field.id === "headline") return { ...field, value: banner.bannerTitle };
      if (field.id === "description") return { ...field, value: banner.bannerDescription };
      return field;
    });
    localJson.records[bannerRecordIndex] = record;
    writeLocalData(localJson);
  }

  return NextResponse.json({
    success: true,
    status: "success",
    message: "Gifts banner updated successfully.",
    data: {
      banner: {
        bannerLabel: banner.bannerLabel,
        bannerTitle: banner.bannerTitle,
        bannerDescription: banner.bannerDescription
      }
    },
    savedToBackend
  });
}
