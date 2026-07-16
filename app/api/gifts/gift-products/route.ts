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

const mergeLocalProductsFallback = (backendData: any) => {
  const localJson = readLocalData();
  const record = localJson?.records?.find((r: any) => r.id === "gifts-collections");
  if (!record || !record.fields) return backendData;

  const getVal = (id: string) => record.fields.find((f: any) => f.id === id)?.value;
  const merged = { ...backendData };

  if (!merged.categories || merged.categories.length === 0) {
    const localCategories = getVal("categories");
    if (Array.isArray(localCategories)) {
      merged.categories = localCategories;
    } else if (typeof localCategories === "string") {
      try {
        merged.categories = JSON.parse(localCategories);
      } catch {
        merged.categories = [];
      }
    }
  }

  // Parse legacy fields if categories are still empty
  if (!merged.categories || merged.categories.length === 0) {
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

    merged.categories = [
      {
        categoryTitle: getVal("heritageHeading") || "The Heritage",
        products: parseItems(getVal("heritageItems"), "6a4bac669970b0ba46cf9ce"),
        _id: "6a4bac669970b0ba46cf9ce3"
      },
      {
        categoryTitle: getVal("seasonalHeading") || "The Seasonal",
        products: parseItems(getVal("seasonalItems"), "6a4bac669970b0ba46cf9cd"),
        _id: "6a4bac669970b0ba46cf9ce6"
      }
    ];
  }

  return merged;
};

export async function GET() {
  // 1. Try local Express backend
  const localRes = await tryFetch(`${LOCAL_BACKEND}/gifts/gift-products`);
  if (isSuccessResponse(localRes)) {
    const giftProducts = localRes.data?.giftProducts || {};
    const merged = mergeLocalProductsFallback(giftProducts);
    return NextResponse.json({
      success: true,
      status: "success",
      data: { giftProducts: merged }
    });
  }

  // 2. Try remote Express backend
  const remoteRes = await tryFetch(`${REMOTE_BACKEND}/gifts/gift-products`);
  if (isSuccessResponse(remoteRes)) {
    const giftProducts = remoteRes.data?.giftProducts || {};
    const merged = mergeLocalProductsFallback(giftProducts);
    return NextResponse.json({
      success: true,
      status: "success",
      data: { giftProducts: merged }
    });
  }

  // 3. Fallback to local JSON file
  const localJson = readLocalData();
  const record = localJson?.records?.find((r: any) => r.id === "gifts-collections");
  if (record && record.fields) {
    const getVal = (id: string) => record.fields.find((f: any) => f.id === id)?.value;
    let categories: any[] = [];
    const localCategories = getVal("categories");
    if (Array.isArray(localCategories)) {
      categories = localCategories;
    } else if (typeof localCategories === "string") {
      try {
        categories = JSON.parse(localCategories);
      } catch {
        categories = [];
      }
    }

    if (categories.length === 0) {
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

      categories = [
        {
          categoryTitle: getVal("heritageHeading") || "The Heritage",
          products: parseItems(getVal("heritageItems"), "6a4bac669970b0ba46cf9ce"),
          _id: "6a4bac669970b0ba46cf9ce3"
        },
        {
          categoryTitle: getVal("seasonalHeading") || "The Seasonal",
          products: parseItems(getVal("seasonalItems"), "6a4bac669970b0ba46cf9cd"),
          _id: "6a4bac669970b0ba46cf9ce6"
        }
      ];
    }

    return NextResponse.json({
      success: true,
      status: "success",
      data: { giftProducts: { categories } }
    });
  }

  // 4. Default fallback
  return NextResponse.json({
    success: true,
    status: "success",
    data: {
      giftProducts: {
        categories: []
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

  const giftProducts = body.giftProducts;
  if (!giftProducts) {
    return NextResponse.json({ success: false, status: "error", message: "Gift products data is required" }, { status: 400 });
  }

  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify({ giftProducts })
  };

  let savedToBackend = false;

  try {
    const localRes = await fetch(`${LOCAL_BACKEND}/gifts/gift-products`, { ...options, cache: "no-store" });
    if (localRes.ok) {
      const data = await localRes.json();
      if (data.status === "success" || data.success) savedToBackend = true;
    }
  } catch {}

  if (!savedToBackend) {
    try {
      const remoteRes = await fetch(`${REMOTE_BACKEND}/gifts/gift-products`, { ...options, cache: "no-store" });
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

  const heritageCat = giftProducts.categories?.[0];
  const seasonalCat = giftProducts.categories?.[1];

  const serializeItems = (products: any[]) => {
    return (products || []).map(p => `${p.title} | ${p.description} | ${p.price}`).join("\n");
  };

  const record = localJson.records[recordIndex];
  record.updatedAt = new Date().toISOString().slice(0, 10);
  record.fields = [
    { id: "heritageHeading", label: "Left column heading", type: "text", value: heritageCat?.categoryTitle || "" },
    { id: "heritageItems", label: "Heritage items", type: "textarea", value: serializeItems(heritageCat?.products || []) },
    { id: "seasonalHeading", label: "Right column heading", type: "text", value: seasonalCat?.categoryTitle || "" },
    { id: "seasonalItems", label: "Seasonal items", type: "textarea", value: serializeItems(seasonalCat?.products || []) },
    { id: "categories", label: "Categories data", type: "textarea", value: giftProducts.categories || [] }
  ];
  localJson.records[recordIndex] = record;
  writeLocalData(localJson);

  return NextResponse.json({
    success: true,
    status: "success",
    message: "Gift products updated successfully.",
    data: { giftProducts },
    savedToBackend
  });
}
