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

const jsonFilePath = path.join(process.cwd(), "json/mock/our-story-data.json");

const readLocalData = () => {
  try {
    if (fs.existsSync(jsonFilePath)) {
      const content = fs.readFileSync(jsonFilePath, "utf8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Failed to read local our-story JSON:", error);
  }
  return null;
};

const tryFetch = async (url: string) => {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const parseFields = (fields: any[]): Record<string, any> => {
  const content: Record<string, any> = {};
  if (Array.isArray(fields)) {
    for (const field of fields) {
      content[field.id] = field.value;
    }
  }
  return content;
};

export async function GET() {
  const cleanUrl = (url: string) => {
    if (typeof url !== "string") return url;
    return url.replace(/%22$/, "").replace(/"$/, "").trim();
  };

  // Helper to format generic section to user's desired shape
  const formatSection = (fields: any[]) => {
    const content = parseFields(fields);
    return {
      banner: {
        bannerImage: cleanUrl(content.image || "/assets/story_hero_bg.png"),
        bannerLabel: content.eyebrow || "OUR HERITAGE",
        bannerTitle: content.headline || "Cultivating the Legacy of Artisanal Earth",
        bannerDescription: content.description || "Beyond standard agriculture...",
        buttonText: content.ctaLabel || "Discover The Promise",
        buttonLink: "/our-story"
      }
    };
  };

  // 1. Try direct local Express backend /our-story/banner
  const localBannerRes = await tryFetch(`${LOCAL_BACKEND}/our-story/banner`);
  if (localBannerRes?.success && localBannerRes?.data?.banner) {
    return NextResponse.json({ success: true, data: localBannerRes.data });
  }

  // 2. Try direct remote Express backend /our-story/banner
  const remoteBannerRes = await tryFetch(`${REMOTE_BACKEND}/our-story/banner`);
  if (remoteBannerRes?.success && remoteBannerRes?.data?.banner) {
    return NextResponse.json({ success: true, data: remoteBannerRes.data });
  }

  // 3. Try fallback local Express backend section
  const localRes = await tryFetch(`${LOCAL_BACKEND}/content/modules/our-story/sections/story-hero`);
  if (localRes?.success && localRes?.data) {
    const formatted = formatSection(localRes.data.fields || []);
    return NextResponse.json({ success: true, data: formatted });
  }

  // 4. Try fallback remote Express backend section
  const remoteRes = await tryFetch(`${REMOTE_BACKEND}/content/modules/our-story/sections/story-hero`);
  if (remoteRes?.success && remoteRes?.data) {
    const formatted = formatSection(remoteRes.data.fields || []);
    return NextResponse.json({ success: true, data: formatted });
  }

  // 5. Fallback to local JSON file
  const localJson = readLocalData();
  if (localJson && localJson.records) {
    const section = localJson.records.find((r: any) => r.id === "story-hero");
    if (section) {
      const formatted = formatSection(section.fields || []);
      return NextResponse.json({ success: true, data: formatted });
    }
  }

  return NextResponse.json(
    { success: false, message: "Unable to retrieve our-story banner data." },
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

  const { banner } = body;
  if (!banner) {
    return NextResponse.json({ success: false, message: "Banner data is required" }, { status: 400 });
  }

  const cleanUrl = (url: string) => {
    if (typeof url !== "string") return url;
    return url.replace(/%22$/, "").replace(/"$/, "").trim();
  };

  banner.bannerImage = cleanUrl(banner.bannerImage || "");

  // 1. Try local Express backend
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: JSON.stringify({ banner })
  };

  let savedToBackend = false;

  // Try local first
  try {
    const localRes = await fetch(`${LOCAL_BACKEND}/our-story/banner`, { ...options, cache: "no-store" });
    if (localRes.ok) {
      const data = await localRes.json();
      if (data.success) savedToBackend = true;
    }
  } catch (error) {
    // Silently continue to remote or local file save
  }

  // Try remote if local failed
  if (!savedToBackend) {
    try {
      const remoteRes = await fetch(`${REMOTE_BACKEND}/our-story/banner`, { ...options, cache: "no-store" });
      if (remoteRes.ok) {
        const data = await remoteRes.json();
        if (data.success) savedToBackend = true;
      }
    } catch (error) {
      // Silently continue to local file save
    }
  }

  // 3. Save locally in local our-story-data.json
  const localJson = readLocalData();
  if (localJson && localJson.records) {
    const recordIndex = localJson.records.findIndex((r: any) => r.id === "story-hero");
    if (recordIndex !== -1) {
      const storyHeroRecord = localJson.records[recordIndex];
      storyHeroRecord.updatedAt = new Date().toISOString().slice(0, 10);
      storyHeroRecord.fields = [
        { id: "eyebrow", label: "Hero subtitle", type: "text", value: banner.bannerLabel || "" },
        { id: "headline", label: "H1 headline", type: "text", value: banner.bannerTitle || "" },
        { id: "description", label: "Hero paragraph", type: "textarea", value: banner.bannerDescription || "" },
        { id: "ctaLabel", label: "CTA label", type: "text", value: banner.buttonText || "" },
        { id: "image", label: "Hero image", type: "image", value: banner.bannerImage || "" },
        { id: "showSection", label: "Show section", type: "toggle", value: banner.showSection !== false }
      ];
      // Save it back to local json file
      try {
        const dirPath = path.dirname(jsonFilePath);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(jsonFilePath, JSON.stringify(localJson, null, 2), "utf8");
      } catch (err) {
        console.error("Failed to write updated banner to local JSON:", err);
      }
    }
  }

  return NextResponse.json({
    success: true,
    data: banner,
    savedToBackend
  });
}
