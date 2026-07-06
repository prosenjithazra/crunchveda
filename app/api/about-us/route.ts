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

const jsonFilePath = path.join(process.cwd(), "json/mock/about-us-data.json");

const readLocalData = () => {
  try {
    if (fs.existsSync(jsonFilePath)) {
      const content = fs.readFileSync(jsonFilePath, "utf8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Failed to read local about-us JSON:", error);
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
    console.error("Failed to write local about-us JSON:", error);
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

const mergeLocalRecords = (backendData: any, localData: any) => {
  if (!backendData || !localData) return backendData;
  const mergedRecords = [...(backendData.records || [])];
  
  if (localData.records) {
    for (const localRec of localData.records) {
      const idx = mergedRecords.findIndex((r: any) => r.id === localRec.id);
      if (idx !== -1) {
        mergedRecords[idx] = { ...mergedRecords[idx], ...localRec };
      } else {
        mergedRecords.push(localRec);
      }
    }
  }
  return { ...backendData, records: mergedRecords };
};

export async function GET() {
  const localJson = readLocalData();

  // 1. Try direct local Express backend /about-us
  const localDirectRes = await tryFetch(`${LOCAL_BACKEND}/about-us`);
  if (localDirectRes?.success && localDirectRes?.data) {
    const merged = mergeLocalRecords(localDirectRes.data, localJson);
    return NextResponse.json({ success: true, data: merged });
  }

  // 2. Try direct remote Express backend /about-us
  const remoteDirectRes = await tryFetch(`${REMOTE_BACKEND}/about-us`);
  if (remoteDirectRes?.success && remoteDirectRes?.data) {
    const merged = mergeLocalRecords(remoteDirectRes.data, localJson);
    return NextResponse.json({ success: true, data: merged });
  }

  // 3. Fallback to local JSON file
  if (localJson) {
    return NextResponse.json({ success: true, data: localJson });
  }

  return NextResponse.json(
    { success: false, message: "Unable to retrieve about-us module data." },
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

  const { section } = body;
  if (!section || !section.id) {
    return NextResponse.json({ success: false, message: "Section data with ID is required" }, { status: 400 });
  }

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: JSON.stringify({ moduleId: "about-us", section }),
  };

  let savedToBackend = false;

  // Try saving to backend `/api/about-us` section endpoints if matching
  // Let's resolve the specific endpoint slug
  let backendSlug = "";
  if (section.id === "about-banner") backendSlug = "banner";
  else if (section.id === "about-stewardship" || section.id === "about-roots") backendSlug = "stewardship";
  else if (section.id === "about-journey") backendSlug = "journey";
  else if (section.id === "about-quote") backendSlug = "quote";
  else if (section.id === "about-charter") backendSlug = "charter";

  if (backendSlug) {
    // Map section fields to body format
    const payload: Record<string, any> = {};
    section.fields.forEach((f: any) => {
      payload[f.id] = f.value;
    });

    const putOptions: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: JSON.stringify(payload),
    };

    const localPutRes = await tryFetch(`${LOCAL_BACKEND}/about-us/${backendSlug}`, putOptions);
    if (localPutRes?.status === "success") {
      savedToBackend = true;
    } else {
      const remotePutRes = await tryFetch(`${REMOTE_BACKEND}/about-us/${backendSlug}`, putOptions);
      if (remotePutRes?.status === "success") {
        savedToBackend = true;
      }
    }
  }

  // Save locally in Next.js workspace to persist edits
  const localJson = readLocalData() || { id: "about-us", title: "About Us Page", records: [] };
  if (!localJson.records) localJson.records = [];
  const recordIndex = localJson.records.findIndex((r: any) => r.id === section.id);
  section.updatedAt = new Date().toISOString().slice(0, 10);
  if (recordIndex !== -1) {
    localJson.records[recordIndex] = { ...localJson.records[recordIndex], ...section };
  } else {
    localJson.records.push(section);
  }
  writeLocalData(localJson);

  return NextResponse.json({
    success: true,
    data: section,
    savedToBackend
  });
}
