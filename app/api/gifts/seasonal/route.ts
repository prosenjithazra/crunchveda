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

const mergeLocalSeasonalFallback = (backendData: any) => {
  const localJson = readLocalData();
  const record = localJson?.records?.find((r: any) => r.id === "gifts-collections");
  if (!record || !record.fields) return backendData;

  const getVal = (id: string) => record.fields.find((f: any) => f.id === id)?.value;
  const merged = { ...backendData };

  if (!merged.categoryTitle) {
    merged.categoryTitle = getVal("seasonalHeading") || "The Seasonal";
  }

  if (!merged.products || merged.products.length === 0) {
    const localCategories = getVal("categories");
    let cats: any[] = [];
    if (Array.isArray(localCategories)) {
      cats = localCategories;
    } else if (typeof localCategories === "string") {
      try {
        cats = JSON.parse(localCategories);
      } catch {
        cats = [];
      }
    }

    const seasonalCat = cats.find(c => c.categoryTitle?.toLowerCase()?.includes("seasonal"));
    if (seasonalCat && seasonalCat.products) {
      merged.products = seasonalCat.products;
    } else {
      const parseItems = (text: string, baseId: string) => {
        if (!text) return [];
        return String(text).split("\n").filter(Boolean).map((line, idx) => {
          const parts = line.split("|").map(p => p.trim());
          return {
            image: "",
            title: parts[0] || "",
            description: parts[1] || "",
            price: parts[2] || "",
            _id: `${baseId}${idx}`
          };
        });
      };
      merged.products = parseItems(getVal("seasonalItems"), "6a4bac669970b0ba46cf9cd");
    }
  }

  return merged;
};

export async function GET() {
  // 1. Try local Express backend
  const localRes = await tryFetch(`${LOCAL_BACKEND}/gifts/seasonal`);
  if (isSuccessResponse(localRes)) {
    const category = localRes.data?.category || {};
    const merged = mergeLocalSeasonalFallback(category);
    return NextResponse.json({
      success: true,
      status: "success",
      data: { category: merged }
    });
  }

  // 2. Try remote Express backend
  const remoteRes = await tryFetch(`${REMOTE_BACKEND}/gifts/seasonal`);
  if (isSuccessResponse(remoteRes)) {
    const category = remoteRes.data?.category || {};
    const merged = mergeLocalSeasonalFallback(category);
    return NextResponse.json({
      success: true,
      status: "success",
      data: { category: merged }
    });
  }

  // 3. Fallback to local JSON file
  const category = mergeLocalSeasonalFallback({});
  return NextResponse.json({
    success: true,
    status: "success",
    data: { category }
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

  const category = body.category;
  if (!category) {
    return NextResponse.json({ success: false, status: "error", message: "Category data is required" }, { status: 400 });
  }

  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify({ category })
  };

  let savedToBackend = false;

  try {
    const localRes = await fetch(`${LOCAL_BACKEND}/gifts/seasonal`, { ...options, cache: "no-store" });
    if (localRes.ok) {
      const data = await localRes.json();
      if (data.status === "success" || data.success) savedToBackend = true;
    }
  } catch {}

  if (!savedToBackend) {
    try {
      const remoteRes = await fetch(`${REMOTE_BACKEND}/gifts/seasonal`, { ...options, cache: "no-store" });
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

  let recordIndex = localJson.records.findIndex((r: any) => r.id === "gifts-collections");
  if (recordIndex === -1) {
    localJson.records.push({
      id: "gifts-collections",
      title: "Heritage and seasonal collections",
      type: "Product columns",
      status: "Published",
      fields: []
    });
    recordIndex = localJson.records.length - 1;
  }

  const record = localJson.records[recordIndex];
  record.updatedAt = new Date().toISOString().slice(0, 10);

  // Sync back to categories field
  let localCategories: any[] = [];
  const rawCategories = record.fields?.find((f: any) => f.id === "categories")?.value;
  if (Array.isArray(rawCategories)) {
    localCategories = rawCategories;
  } else if (typeof rawCategories === "string") {
    try {
      localCategories = JSON.parse(rawCategories);
    } catch {
      localCategories = [];
    }
  }

  if (localCategories.length === 0) {
    localCategories = [
      { categoryTitle: "The Heritage", products: [] },
      { categoryTitle: "The Seasonal", products: [] }
    ];
  }

  const seasonalIdx = localCategories.findIndex(c => c.categoryTitle?.toLowerCase()?.includes("seasonal"));
  if (seasonalIdx !== -1) {
    localCategories[seasonalIdx] = category;
  } else {
    localCategories[1] = category;
  }

  const serializeItems = (products: any[]) => {
    return (products || []).map(p => `${p.title} | ${p.description} | ${p.price}`).join("\n");
  };

  const currentHeritageCat = localCategories.find(c => c.categoryTitle?.toLowerCase()?.includes("heritage")) || { categoryTitle: "The Heritage", products: [] };

  record.fields = [
    { id: "heritageHeading", label: "Left column heading", type: "text", value: currentHeritageCat.categoryTitle || "" },
    { id: "heritageItems", label: "Heritage items", type: "textarea", value: serializeItems(currentHeritageCat.products || []) },
    { id: "seasonalHeading", label: "Right column heading", type: "text", value: category.categoryTitle || "" },
    { id: "seasonalItems", label: "Seasonal items", type: "textarea", value: serializeItems(category.products || []) },
    { id: "categories", label: "Categories data", type: "textarea", value: localCategories },
    { id: "showSection", label: "Show section", type: "toggle", value: true }
  ];
  localJson.records[recordIndex] = record;
  writeLocalData(localJson);

  return NextResponse.json({
    success: true,
    status: "success",
    message: "Seasonal category updated successfully.",
    data: { category },
    savedToBackend
  });
}
