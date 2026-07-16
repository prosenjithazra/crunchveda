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

const mergeLocalCollectionsFallback = (backendData: any) => {
  const localJson = readLocalData();
  const record = localJson?.records?.find((r: any) => r.id === "gifts-executive");
  if (!record || !record.fields) return backendData;

  const getVal = (id: string) => record.fields.find((f: any) => f.id === id)?.value;
  const merged = { ...backendData };

  if (!merged.sectionTitle) merged.sectionTitle = getVal("heading") || "The Executive";
  if (!merged.sectionButtonText) merged.sectionButtonText = getVal("exploreLabel") || "Explore The Set";
  if (!merged.sectionButtonLink) merged.sectionButtonLink = getVal("exploreLink") || "/gifts/executive";

  if (!merged.collections || merged.collections.length === 0) {
    const localCol = getVal("collections");
    if (Array.isArray(localCol)) {
      merged.collections = localCol;
    } else if (typeof localCol === "string") {
      try {
        merged.collections = JSON.parse(localCol);
      } catch {
        merged.collections = [];
      }
    }
  }

  return merged;
};

export async function GET() {
  // 1. Try local Express backend
  const localRes = await tryFetch(`${LOCAL_BACKEND}/gifts/gift-collections`);
  if (isSuccessResponse(localRes)) {
    const giftCollections = localRes.data?.giftCollections || {};
    const merged = mergeLocalCollectionsFallback(giftCollections);
    return NextResponse.json({
      success: true,
      status: "success",
      data: { giftCollections: merged }
    });
  }

  // 2. Try remote Express backend
  const remoteRes = await tryFetch(`${REMOTE_BACKEND}/gifts/gift-collections`);
  if (isSuccessResponse(remoteRes)) {
    const giftCollections = remoteRes.data?.giftCollections || {};
    const merged = mergeLocalCollectionsFallback(giftCollections);
    return NextResponse.json({
      success: true,
      status: "success",
      data: { giftCollections: merged }
    });
  }

  // 3. Fallback to local JSON file
  const localJson = readLocalData();
  const record = localJson?.records?.find((r: any) => r.id === "gifts-executive");
  if (record && record.fields) {
    const getVal = (id: string) => record.fields.find((f: any) => f.id === id)?.value;
    let collectionsList: any[] = [];
    const localCol = getVal("collections");
    if (Array.isArray(localCol)) {
      collectionsList = localCol;
    } else if (typeof localCol === "string") {
      try {
        collectionsList = JSON.parse(localCol);
      } catch {
        collectionsList = [];
      }
    } else {
      // Legacy parsing fallback from largeCard and smallCards
      const parseCard = (line: string, defaultId: string) => {
        const parts = line.split("|").map(p => p.trim());
        return {
          image: "",
          label: parts[0] || "",
          title: parts[1] || "",
          description: parts[2] || "",
          buttonText: parts[3] || "Read details",
          buttonLink: "/gifts",
          _id: defaultId
        };
      };
      
      const largeCard = getVal("largeCard");
      const smallCards = getVal("smallCards");
      if (largeCard) {
        collectionsList.push(parseCard(largeCard, "6a4ba83368a084edc873a777"));
      }
      if (smallCards) {
        const lines = smallCards.split("\n").filter(Boolean);
        lines.forEach((line: string, idx: number) => {
          collectionsList.push(parseCard(line, `6a4ba83368a084edc873a77${8 + idx}`));
        });
      }
    }

    return NextResponse.json({
      success: true,
      status: "success",
      data: {
        giftCollections: {
          sectionTitle: getVal("heading") || "The Executive",
          sectionButtonText: getVal("exploreLabel") || "Explore The Set",
          sectionButtonLink: getVal("exploreLink") || "/gifts/executive",
          collections: collectionsList
        }
      }
    });
  }

  // 4. Default fallback
  return NextResponse.json({
    success: true,
    status: "success",
    data: {
      giftCollections: {
        sectionTitle: "The Executive",
        sectionButtonText: "Explore The Set",
        sectionButtonLink: "/gifts/executive",
        collections: []
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

  const giftCollections = body.giftCollections;
  if (!giftCollections) {
    return NextResponse.json({ success: false, status: "error", message: "Gift collections data is required" }, { status: 400 });
  }

  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify({ giftCollections })
  };

  let savedToBackend = false;

  try {
    const localRes = await fetch(`${LOCAL_BACKEND}/gifts/gift-collections`, { ...options, cache: "no-store" });
    if (localRes.ok) {
      const data = await localRes.json();
      if (data.status === "success" || data.success) savedToBackend = true;
    }
  } catch {}

  if (!savedToBackend) {
    try {
      const remoteRes = await fetch(`${REMOTE_BACKEND}/gifts/gift-collections`, { ...options, cache: "no-store" });
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
        id: "gifts-executive",
        title: "Executive gift set",
        type: "Gift cards",
        status: "Published",
        fields: [
          { id: "heading", label: "Section heading", type: "text", value: "The Executive" },
          { id: "exploreLabel", label: "Explore link label", type: "text", value: "Explore The Set" },
          { id: "exploreLink", label: "Explore link URL", type: "text", value: "/gifts/executive" },
          { id: "collections", label: "Collections data", type: "textarea", value: [] }
        ]
      }
    ]
  };

  const recordIndex = localJson?.records?.findIndex((r: any) => r.id === "gifts-executive") ?? -1;
  if (localJson && localJson.records && recordIndex !== -1) {
    const record = localJson.records[recordIndex];
    record.updatedAt = new Date().toISOString().slice(0, 10);
    record.fields = [
      { id: "heading", label: "Section heading", type: "text", value: giftCollections.sectionTitle || "" },
      { id: "exploreLabel", label: "Explore link label", type: "text", value: giftCollections.sectionButtonText || "" },
      { id: "exploreLink", label: "Explore link URL", type: "text", value: giftCollections.sectionButtonLink || "" },
      { id: "collections", label: "Collections data", type: "textarea", value: giftCollections.collections || [] }
    ];
    localJson.records[recordIndex] = record;
    writeLocalData(localJson);
  }

  return NextResponse.json({
    success: true,
    status: "success",
    message: "Gift collections updated successfully.",
    data: { giftCollections },
    savedToBackend
  });
}
