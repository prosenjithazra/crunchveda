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

const mergeLocalCustomChestFallback = (backendData: any) => {
  const localJson = readLocalData();
  const record = localJson?.records?.find((r: any) => r.id === "gifts-custom-chest");
  if (!record || !record.fields) return backendData;

  const getVal = (id: string) => record.fields.find((f: any) => f.id === id)?.value;
  const merged = { ...backendData };

  if (!merged.sectionLabel) merged.sectionLabel = getVal("eyebrow") || "MADE FOR YOU";
  if (!merged.sectionTitle) merged.sectionTitle = getVal("heading") || "Build your own Custom Chest";
  if (!merged.sectionDescription) merged.sectionDescription = getVal("description") || "Select what fits, select the size, choose from our premium chest selections.";
  if (!merged.buttonText) merged.buttonText = getVal("ctaLabel") || "Start building";
  if (!merged.buttonLink) merged.buttonLink = getVal("ctaHref") || "/build-chest";
  if (!merged.backgroundImage) merged.backgroundImage = getVal("image") || "";

  return merged;
};

export async function GET() {
  // 1. Try local Express backend
  const localRes = await tryFetch(`${LOCAL_BACKEND}/gifts/custom-chest`);
  if (isSuccessResponse(localRes)) {
    const customChest = localRes.data?.customChest || {};
    const merged = mergeLocalCustomChestFallback(customChest);
    return NextResponse.json({
      success: true,
      status: "success",
      data: { customChest: merged }
    });
  }

  // 2. Try remote Express backend
  const remoteRes = await tryFetch(`${REMOTE_BACKEND}/gifts/custom-chest`);
  if (isSuccessResponse(remoteRes)) {
    const customChest = remoteRes.data?.customChest || {};
    const merged = mergeLocalCustomChestFallback(customChest);
    return NextResponse.json({
      success: true,
      status: "success",
      data: { customChest: merged }
    });
  }

  // 3. Fallback to local JSON file
  const localJson = readLocalData();
  const record = localJson?.records?.find((r: any) => r.id === "gifts-custom-chest");
  if (record && record.fields) {
    const getVal = (id: string) => record.fields.find((f: any) => f.id === id)?.value;
    return NextResponse.json({
      success: true,
      status: "success",
      data: {
        customChest: {
          sectionLabel: getVal("eyebrow") || "MADE FOR YOU",
          sectionTitle: getVal("heading") || "Build your own Custom Chest",
          sectionDescription: getVal("description") || "Select what fits, select the size, choose from our premium chest selections.",
          buttonText: getVal("ctaLabel") || "Start building",
          buttonLink: getVal("ctaHref") || "/build-chest",
          backgroundImage: getVal("image") || ""
        }
      }
    });
  }

  // 4. Default fallback
  return NextResponse.json({
    success: true,
    status: "success",
    data: {
      customChest: {
        sectionLabel: "MADE FOR YOU",
        sectionTitle: "Build your own Custom Chest",
        sectionDescription: "Select what fits, select the size, choose from our premium chest selections.",
        buttonText: "Start building",
        buttonLink: "/build-chest",
        backgroundImage: ""
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

  const customChest = body.customChest;
  if (!customChest) {
    return NextResponse.json({ success: false, status: "error", message: "Custom chest data is required" }, { status: 400 });
  }

  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify({ customChest })
  };

  let savedToBackend = false;

  try {
    const localRes = await fetch(`${LOCAL_BACKEND}/gifts/custom-chest`, { ...options, cache: "no-store" });
    if (localRes.ok) {
      const data = await localRes.json();
      if (data.status === "success" || data.success) savedToBackend = true;
    }
  } catch {}

  if (!savedToBackend) {
    try {
      const remoteRes = await fetch(`${REMOTE_BACKEND}/gifts/custom-chest`, { ...options, cache: "no-store" });
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
    records: []
  };

  if (!localJson.records) localJson.records = [];

  let recordIndex = localJson.records.findIndex((r: any) => r.id === "gifts-custom-chest");
  if (recordIndex === -1) {
    localJson.records.push({
      id: "gifts-custom-chest",
      title: "Custom chest banner",
      type: "Banner CTA",
      status: "Published",
      fields: []
    });
    recordIndex = localJson.records.length - 1;
  }

  const record = localJson.records[recordIndex];
  record.updatedAt = new Date().toISOString().slice(0, 10);
  record.fields = [
    { id: "eyebrow", label: "Banner subtitle", type: "text", value: customChest.sectionLabel || "" },
    { id: "heading", label: "Banner heading", type: "text", value: customChest.sectionTitle || "" },
    { id: "description", label: "Banner description", type: "textarea", value: customChest.sectionDescription || "" },
    { id: "ctaLabel", label: "CTA label", type: "text", value: customChest.buttonText || "" },
    { id: "ctaHref", label: "CTA link", type: "text", value: customChest.buttonLink || "" },
    { id: "image", label: "Banner image", type: "image", value: customChest.backgroundImage || "" },
    { id: "showSection", label: "Show section", type: "toggle", value: customChest.showSection !== false }
  ];
  localJson.records[recordIndex] = record;
  writeLocalData(localJson);

  return NextResponse.json({
    success: true,
    status: "success",
    message: "Custom chest section updated successfully.",
    data: { customChest },
    savedToBackend
  });
}
