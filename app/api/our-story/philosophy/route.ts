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

const defaultPhilosophy = {
  sectionTitle: "Minimal Intervention Philosophy",
  sectionDescription:
    "We believe the finest produce is born from where the human hand is lightest, guiding nature without forcing it.",
  philosophies: [
    {
      icon: "",
      title: "Biodynamic Balance",
      description:
        "Aligning harvests close with celestial cycles to ensure the highest potential energy and energetic purity."
    },
    {
      icon: "",
      title: "Pure Sourcing",
      description:
        "Only 2% of global harvests meet our criteria for soil cleanliness, mineral depth, and certified pure origin."
    },
    {
      icon: "",
      title: "Artisanal Curation",
      description:
        "Every batch is hand-inspected, air-cured slowly, and packed in protective glass to preserve the sensory richness."
    }
  ]
};

export async function GET() {
  // 1. Try local Express backend
  const localRes = await tryFetch(`${LOCAL_BACKEND}/our-story/philosophy`);
  if (localRes?.status === "success" && localRes?.data?.philosophy) {
    return NextResponse.json(localRes);
  }

  // 2. Try remote Express backend
  const remoteRes = await tryFetch(`${REMOTE_BACKEND}/our-story/philosophy`);
  if (remoteRes?.status === "success" && remoteRes?.data?.philosophy) {
    return NextResponse.json(remoteRes);
  }

  // 3. Fallback: read from local our-story-data.json
  const localJson = readLocalData();
  if (localJson) {
    // Check if philosophy was saved directly
    if (localJson.philosophy) {
      return NextResponse.json({
        status: "success",
        message: "Philosophy section retrieved successfully.",
        data: { philosophy: localJson.philosophy }
      });
    }

    // Parse from records (legacy CMS format)
    const section = (localJson.records || []).find(
      (r: any) => r.id === "story-philosophy"
    );
    if (section) {
      const fields: any[] = section.fields || [];
      const get = (id: string) =>
        fields.find((f: any) => f.id === id)?.value ?? undefined;

      const cardsRaw = get("cards");
      let philosophies: any[] = [];
      if (Array.isArray(cardsRaw)) {
        philosophies = cardsRaw.map((c: any) => ({
          icon: "",
          title: c.title || "",
          description: c.description || c.desc || ""
        }));
      }

      return NextResponse.json({
        status: "success",
        message: "Philosophy section retrieved successfully.",
        data: {
          philosophy: {
            sectionTitle: get("heading") || defaultPhilosophy.sectionTitle,
            sectionDescription:
              get("description") || defaultPhilosophy.sectionDescription,
            philosophies:
              philosophies.length > 0
                ? philosophies
                : defaultPhilosophy.philosophies
          }
        }
      });
    }
  }

  // 4. Hard default
  return NextResponse.json({
    status: "success",
    message: "Philosophy section retrieved successfully (default).",
    data: { philosophy: defaultPhilosophy }
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

  const philosophy = body?.philosophy ?? body;
  if (!philosophy) {
    return NextResponse.json(
      { status: "error", message: "philosophy data is required" },
      { status: 400 }
    );
  }

  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify({ philosophy })
  };

  let savedToBackend = false;

  // Try local first
  try {
    const localRes = await fetch(`${LOCAL_BACKEND}/our-story/philosophy`, {
      ...options,
      cache: "no-store"
    });
    if (localRes.ok) {
      const data = await localRes.json();
      if (data.status === "success") savedToBackend = true;
    }
  } catch {}

  // Try remote if local failed
  if (!savedToBackend) {
    try {
      const remoteRes = await fetch(
        `${REMOTE_BACKEND}/our-story/philosophy`,
        { ...options, cache: "no-store" }
      );
      if (remoteRes.ok) {
        const data = await remoteRes.json();
        if (data.status === "success") savedToBackend = true;
      }
    } catch {}
  }

  // Save to local JSON file (fallback persistence)
  try {
    const localJson = readLocalData() || {};
    localJson.philosophy = philosophy;

    // Also update story-philosophy record if it exists
    if (Array.isArray(localJson.records)) {
      const idx = localJson.records.findIndex(
        (r: any) => r.id === "story-philosophy"
      );
      if (idx !== -1) {
        const philosophies = Array.isArray(philosophy.philosophies)
          ? philosophy.philosophies
          : [];
        localJson.records[idx].updatedAt = new Date().toISOString().slice(0, 10);
        localJson.records[idx].fields = [
          {
            id: "heading",
            label: "Section heading",
            type: "text",
            value: philosophy.sectionTitle || ""
          },
          {
            id: "description",
            label: "Section description",
            type: "textarea",
            value: philosophy.sectionDescription || ""
          },
          {
            id: "cards",
            label: "Philosophy cards",
            type: "textarea",
            value: philosophies.map((p: any) => ({
              title: p.title || "",
              description: p.description || ""
            }))
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
    console.error("Failed to write philosophy section to local JSON:", err);
  }

  return NextResponse.json({
    status: "success",
    message: "Philosophy section updated successfully.",
    data: { philosophy },
    savedToBackend
  });
}
