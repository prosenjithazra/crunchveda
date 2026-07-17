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

const tryFetch = async (url: string, options?: RequestInit) => {
  try {
    const res = await fetch(url, { ...options, cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const cleanUrl = (url: string): string => {
  if (typeof url !== "string") return "";
  return url.replace(/%22$/, "").replace(/"$/, "").trim();
};

const defaultStewardship = {
  sectionTitle: "A Century of Stewardship",
  milestones: [
    {
      year: "1924",
      title: "The Founding Soil",
      description: "The first 40 acres are purchased in the fertile valleys of Oregon, marking the inception of a dedicated agricultural lineage.",
      image: ""
    },
    {
      year: "1968",
      title: "Organic Pioneer",
      description: "Crunchveda becomes one of the first certified organic estates in the region, introducing natural balance and compost enrichment techniques.",
      image: ""
    },
    {
      year: "2024",
      title: "The Global Standard",
      description: "Actively today, we continue to redefine the standards of agricultural efficacy, combining artisanal precision with ecological stewardship.",
      image: ""
    }
  ]
};

export async function GET() {
  // 1. Try local Express backend
  const localRes = await tryFetch(`${LOCAL_BACKEND}/our-story/stewardship`);
  if (localRes?.status === "success" && localRes?.data?.stewardship) {
    const s = localRes.data.stewardship;
    if (Array.isArray(s.milestones)) {
      s.milestones = s.milestones.map((m: any) => ({
        ...m,
        image: cleanUrl(m.image || "")
      }));
    }
    return NextResponse.json(localRes);
  }

  // 2. Try remote Express backend
  const remoteRes = await tryFetch(`${REMOTE_BACKEND}/our-story/stewardship`);
  if (remoteRes?.status === "success" && remoteRes?.data?.stewardship) {
    const s = remoteRes.data.stewardship;
    if (Array.isArray(s.milestones)) {
      s.milestones = s.milestones.map((m: any) => ({
        ...m,
        image: cleanUrl(m.image || "")
      }));
    }
    return NextResponse.json(remoteRes);
  }

  // 3. Fallback: local JSON file
  const localJson = readLocalData();
  if (localJson) {
    // Direct stewardship object saved by PUT
    if (localJson.stewardship) {
      const s = localJson.stewardship;
      if (Array.isArray(s.milestones)) {
        s.milestones = s.milestones.map((m: any) => ({
          ...m,
          image: cleanUrl(m.image || "")
        }));
      }
      return NextResponse.json({
        status: "success",
        message: "Stewardship section retrieved successfully.",
        data: { stewardship: s }
      });
    }

    // Legacy records format (story-timeline)
    const section = (localJson.records || []).find(
      (r: any) => r.id === "story-timeline"
    );
    if (section) {
      const fields: any[] = section.fields || [];
      const get = (id: string) => fields.find((f: any) => f.id === id)?.value;
      const itemsRaw = get("milestones") || get("items") || [];

      let milestones: any[] = [];
      if (Array.isArray(itemsRaw)) {
        milestones = itemsRaw.map((m: any) => ({
          year: m.year || "",
          title: m.title || "",
          description: m.description || "",
          image: cleanUrl(m.image || "")
        }));
      }

      return NextResponse.json({
        status: "success",
        message: "Stewardship section retrieved successfully.",
        data: {
          stewardship: {
            sectionTitle: get("heading") || defaultStewardship.sectionTitle,
            milestones: milestones.length > 0 ? milestones : defaultStewardship.milestones
          }
        }
      });
    }
  }

  // 4. Hard default
  return NextResponse.json({
    status: "success",
    message: "Stewardship section retrieved (default).",
    data: { stewardship: defaultStewardship }
  });
}

export async function PUT(request: Request) {
  const authorization = request.headers.get("authorization");
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const stewardship = body?.stewardship ?? body;
  if (!stewardship) {
    return NextResponse.json(
      { status: "error", message: "stewardship data is required" },
      { status: 400 }
    );
  }

  // Clean image URLs
  if (Array.isArray(stewardship.milestones)) {
    stewardship.milestones = stewardship.milestones.map((m: any) => ({
      ...m,
      image: cleanUrl(m.image || "")
    }));
  }

  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify({ stewardship })
  };

  let savedToBackend = false;

  try {
    const localRes = await fetch(`${LOCAL_BACKEND}/our-story/stewardship`, {
      ...options,
      cache: "no-store"
    });
    if (localRes.ok) {
      const data = await localRes.json();
      if (data.status === "success") savedToBackend = true;
    }
  } catch {}

  if (!savedToBackend) {
    try {
      const remoteRes = await fetch(
        `${REMOTE_BACKEND}/our-story/stewardship`,
        { ...options, cache: "no-store" }
      );
      if (remoteRes.ok) {
        const data = await remoteRes.json();
        if (data.status === "success") savedToBackend = true;
      }
    } catch {}
  }

  // Save to local JSON
  try {
    const localJson = readLocalData() || {};
    localJson.stewardship = stewardship;

    // Also update story-timeline record if it exists
    if (Array.isArray(localJson.records)) {
      const idx = localJson.records.findIndex(
        (r: any) => r.id === "story-timeline"
      );
      if (idx !== -1) {
        localJson.records[idx].updatedAt = new Date().toISOString().slice(0, 10);
        localJson.records[idx].fields = [
          {
            id: "heading",
            label: "Section heading",
            type: "text",
            value: stewardship.sectionTitle || ""
          },
          {
            id: "milestones",
            label: "Milestones",
            type: "textarea",
            value: stewardship.milestones || []
          },
          {
            id: "showSection",
            label: "Show section",
            type: "toggle",
            value: true
          }
        ];
      }
    }

    const dirPath = path.dirname(jsonFilePath);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(jsonFilePath, JSON.stringify(localJson, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write stewardship section to local JSON:", err);
  }

  return NextResponse.json({
    status: "success",
    message: "Stewardship section updated successfully.",
    data: { stewardship },
    savedToBackend
  });
}
