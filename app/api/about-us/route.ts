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

const isSuccessResponse = (response: any) => {
  return (response?.success === true || response?.status === "success") && response?.data;
};

const mergeLocalFallbackFields = (backendData: any) => {
  if (!backendData || !backendData.records) return backendData;
  const localJson = readLocalData();
  if (!localJson || !localJson.records) return backendData;

  const updatedRecords = backendData.records.map((record: any) => {
    const localRecord = localJson.records.find((r: any) => r.id === record.id);
    if (!localRecord || !localRecord.fields) return record;

    const updatedFields = record.fields.map((field: any) => {
      if (field.value === "" || field.value === null || field.value === undefined) {
        const localField = localRecord.fields.find((f: any) => f.id === field.id);
        if (localField && localField.value !== "" && localField.value !== null && localField.value !== undefined) {
          return { ...field, value: localField.value };
        }
      }
      return field;
    });

    return { ...record, fields: updatedFields };
  });

  return { ...backendData, records: updatedRecords };
};

export async function GET() {
  // 1. Try direct local Express backend /about-us
  const localDirectRes = await tryFetch(`${LOCAL_BACKEND}/about-us`);
  if (isSuccessResponse(localDirectRes)) {
    const merged = mergeLocalFallbackFields(localDirectRes.data);
    return NextResponse.json({ ...localDirectRes, data: merged });
  }

  // 2. Try direct remote Express backend /about-us
  const remoteDirectRes = await tryFetch(`${REMOTE_BACKEND}/about-us`);
  if (isSuccessResponse(remoteDirectRes)) {
    const merged = mergeLocalFallbackFields(remoteDirectRes.data);
    return NextResponse.json({ ...remoteDirectRes, data: merged });
  }

  // 3. Fallback to local JSON file
  const localJson = readLocalData();
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

  // Try saving to backend `/api/about-us` section endpoints if matching
  // Let's resolve the specific endpoint slug
  let backendSlug = "";
  if (section.id === "about-banner") backendSlug = "banner";
  else if (section.id === "about-stewardship" || section.id === "about-roots") backendSlug = "stewardship";
  else if (section.id === "about-journey") backendSlug = "journey";
  else if (section.id === "about-quote") backendSlug = "quote";
  else if (section.id === "about-charter") backendSlug = "charter";

  if (!backendSlug) {
    return NextResponse.json(
      { success: false, message: `Unsupported about-us section: ${section.id}` },
      { status: 400 }
    );
  }

  // Map CMS record fields to the documented section update payloads.
  const payload: Record<string, any> = {};
  section.fields.forEach((f: any) => {
    payload[f.id] = f.value;
  });

  if (backendSlug === "banner") {
    payload.bannerLabel = payload.eyebrow || "";
    payload.bannerTitle = payload.headline || "";
    payload.bannerDescription = payload.description || "";
    payload.bannerImage = payload.image || "";
    delete payload.eyebrow;
    delete payload.headline;
    delete payload.description;
    delete payload.image;
  }

  const putOptions: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: JSON.stringify(payload),
  };

  const localPutRes = await tryFetch(`${LOCAL_BACKEND}/about-us/${backendSlug}`, putOptions);
  const remotePutRes = localPutRes ? null : await tryFetch(`${REMOTE_BACKEND}/about-us/${backendSlug}`, putOptions);
  const backendRes = localPutRes || remotePutRes;
  const savedToBackend = !!(backendRes?.status === "success" || backendRes?.success === true);

  section.updatedAt = new Date().toISOString().slice(0, 10);

  // Save locally in Next.js workspace to persist edits
  const localJson = readLocalData();
  if (localJson && localJson.records) {
    const recordIndex = localJson.records.findIndex((r: any) => r.id === section.id);
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
