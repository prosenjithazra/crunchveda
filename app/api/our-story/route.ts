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

const writeLocalData = (data: any) => {
  try {
    const dirPath = path.dirname(jsonFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Failed to write local our-story JSON:", error);
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
        // Merge fields to make sure we keep any properties from backend but prioritize local edits
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

  // 1. Try direct local Express backend /our-story
  const localDirectRes = await tryFetch(`${LOCAL_BACKEND}/our-story`);
  if (localDirectRes?.success && localDirectRes?.data) {
    const merged = mergeLocalRecords(localDirectRes.data, localJson);
    return NextResponse.json({ success: true, data: merged });
  }

  // 2. Try direct remote Express backend /our-story
  const remoteDirectRes = await tryFetch(`${REMOTE_BACKEND}/our-story`);
  if (remoteDirectRes?.success && remoteDirectRes?.data) {
    const merged = mergeLocalRecords(remoteDirectRes.data, localJson);
    return NextResponse.json({ success: true, data: merged });
  }

  // 3. Try fallback local Express backend
  const localRes = await tryFetch(`${LOCAL_BACKEND}/content/modules/our-story`);
  if (localRes?.success && localRes?.data) {
    const merged = mergeLocalRecords(localRes.data, localJson);
    return NextResponse.json({ success: true, data: merged });
  }

  // 4. Try fallback remote Express backend
  const remoteRes = await tryFetch(`${REMOTE_BACKEND}/content/modules/our-story`);
  if (remoteRes?.success && remoteRes?.data) {
    const merged = mergeLocalRecords(remoteRes.data, localJson);
    return NextResponse.json({ success: true, data: merged });
  }

  // 5. Fallback to local JSON file
  if (localJson) {
    return NextResponse.json({ success: true, data: localJson });
  }

  return NextResponse.json(
    { success: false, message: "Unable to retrieve our-story module data." },
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
    body: JSON.stringify({ moduleId: "our-story", section }),
  };

  // Keep track if saved to DB
  let savedToBackend = false;

  // 1. Try saving to local Express backend
  const localRes = await tryFetch(`${LOCAL_BACKEND}/content/sections`, options);
  if (localRes?.success) {
    savedToBackend = true;
  } else {
    // 2. Try saving to remote Express backend
    const remoteRes = await tryFetch(`${REMOTE_BACKEND}/content/sections`, options);
    if (remoteRes?.success) {
      savedToBackend = true;
    }
  }

  // 3. Save locally in Next.js workspace to persist edits
  const localJson = readLocalData();
  if (localJson && localJson.records) {
    const recordIndex = localJson.records.findIndex((r: any) => r.id === section.id);
    section.updatedAt = new Date().toISOString().slice(0, 10);
    if (recordIndex !== -1) {
      localJson.records[recordIndex] = { ...localJson.records[recordIndex], ...section };
    } else {
      localJson.records.push(section);
    }
    writeLocalData(localJson);
  }

  return NextResponse.json({
    success: true,
    data: section,
    savedToBackend
  });
}
