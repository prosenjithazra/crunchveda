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

const tryFetch = async (url: string, options?: RequestInit) => {
  try {
    const res = await fetch(url, { ...options, cache: "no-store" });
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
      theBeginning: {
        sectionLabel: content.eyebrow || "THE BEGINNING",
        sectionTitle: content.heading || "The Legacy of Soil and Spirit",
        sectionDescription: content.body || "Our story began in 1924...",
        image: cleanUrl(content.image || "/assets/story_legacy_soil.png")
      }
    };
  };

  // 1. Try direct local Express backend /our-story/the-beginning
  const localBeginningRes = await tryFetch(`${LOCAL_BACKEND}/our-story/the-beginning`);
  if (localBeginningRes?.status === "success" && localBeginningRes?.data?.theBeginning) {
    return NextResponse.json(localBeginningRes);
  }

  // 2. Try direct remote Express backend /our-story/the-beginning
  const remoteBeginningRes = await tryFetch(`${REMOTE_BACKEND}/our-story/the-beginning`);
  if (remoteBeginningRes?.status === "success" && remoteBeginningRes?.data?.theBeginning) {
    return NextResponse.json(remoteBeginningRes);
  }

  // 3. Try fallback local Express backend section
  const localRes = await tryFetch(`${LOCAL_BACKEND}/content/modules/our-story/sections/story-legacy`);
  if (localRes?.success && localRes?.data) {
    const formatted = formatSection(localRes.data.fields || []);
    return NextResponse.json({
      status: "success",
      message: "The Beginning section retrieved successfully.",
      data: formatted
    });
  }

  // 4. Try fallback remote Express backend section
  const remoteRes = await tryFetch(`${REMOTE_BACKEND}/content/modules/our-story/sections/story-legacy`);
  if (remoteRes?.success && remoteRes?.data) {
    const formatted = formatSection(remoteRes.data.fields || []);
    return NextResponse.json({
      status: "success",
      message: "The Beginning section retrieved successfully.",
      data: formatted
    });
  }

  // 5. Fallback to local JSON file
  const localJson = readLocalData();
  if (localJson && localJson.records) {
    const section = localJson.records.find((r: any) => r.id === "story-legacy");
    if (section) {
      const formatted = formatSection(section.fields || []);
      return NextResponse.json({
        status: "success",
        message: "The Beginning section retrieved successfully.",
        data: formatted
      });
    }
  }

  return NextResponse.json(
    { status: "error", message: "Unable to retrieve The Beginning section data." },
    { status: 502 }
  );
}

export async function PUT(request: Request) {
  const authorization = request.headers.get("authorization");
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "error", message: "Invalid JSON payload" }, { status: 400 });
  }

  const { theBeginning } = body;
  if (!theBeginning) {
    return NextResponse.json({ status: "error", message: "theBeginning data is required" }, { status: 400 });
  }

  const cleanUrl = (url: string) => {
    if (typeof url !== "string") return url;
    return url.replace(/%22$/, "").replace(/"$/, "").trim();
  };

  theBeginning.image = cleanUrl(theBeginning.image || "");

  // 1. Try local Express backend
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: JSON.stringify({ theBeginning })
  };

  let savedToBackend = false;

  // Try local first
  try {
    const localRes = await fetch(`${LOCAL_BACKEND}/our-story/the-beginning`, { ...options, cache: "no-store" });
    if (localRes.ok) {
      const data = await localRes.json();
      if (data.status === "success") savedToBackend = true;
    }
  } catch (error) {
    // Silently continue to remote or local file save
  }

  // Try remote if local failed
  if (!savedToBackend) {
    try {
      const remoteRes = await fetch(`${REMOTE_BACKEND}/our-story/the-beginning`, { ...options, cache: "no-store" });
      if (remoteRes.ok) {
        const data = await remoteRes.json();
        if (data.status === "success") savedToBackend = true;
      }
    } catch (error) {
      // Silently continue to local file save
    }
  }

  // 3. Save locally in local our-story-data.json
  const localJson = readLocalData();
  if (localJson && localJson.records) {
    const recordIndex = localJson.records.findIndex((r: any) => r.id === "story-legacy");
    if (recordIndex !== -1) {
      const legacyRecord = localJson.records[recordIndex];
      legacyRecord.updatedAt = new Date().toISOString().slice(0, 10);
      legacyRecord.fields = [
        { id: "eyebrow", label: "Small title", type: "text", value: theBeginning.sectionLabel || "" },
        { id: "heading", label: "Section heading", type: "text", value: theBeginning.sectionTitle || "" },
        { id: "body", label: "Body copy", type: "textarea", value: theBeginning.sectionDescription || "" },
        { id: "image", label: "Section image", type: "image", value: theBeginning.image || "" },
        { id: "showSection", label: "Show section", type: "toggle", value: theBeginning.showSection !== false }
      ];
      // Save it back to local json file
      try {
        const dirPath = path.dirname(jsonFilePath);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(jsonFilePath, JSON.stringify(localJson, null, 2), "utf8");
      } catch (err) {
        console.error("Failed to write updated legacy section to local JSON:", err);
      }
    }
  }

  return NextResponse.json({
    status: "success",
    message: "The Beginning section updated successfully.",
    data: {
      theBeginning
    },
    savedToBackend
  });
}
