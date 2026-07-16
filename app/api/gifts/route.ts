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
  return {
    id: "gifts",
    title: "Gifts Page",
    route: "/gifts",
    description: "Manage gifting header content, executive gift cards, custom chest CTA, collection columns, and concierge form copy.",
    pageType: "Commerce",
    records: [
      {
        id: "gifts-header",
        title: "Gifting intro",
        type: "Page header",
        status: "Published",
        fields: [
          { id: "eyebrow", label: "Subtitle", type: "text", value: "Artisanal Gifting" },
          { id: "headline", label: "H1 headline", type: "text", value: "Curated with\nIntention." },
          { id: "description", label: "Intro paragraph", type: "textarea", value: "Discover our message of special celebrations, unique business appreciation, and hand-selected gestures for every occasion." },
          { id: "showSection", label: "Show section", type: "toggle", value: true }
        ]
      },
      {
        id: "gifts-executive",
        title: "Executive gift set",
        type: "Gift cards",
        status: "Published",
        fields: [
          { id: "heading", label: "Section heading", type: "text", value: "The Executive" },
          { id: "exploreLabel", label: "Explore link label", type: "text", value: "Explore The Set" },
          { id: "largeCard", label: "Large gift card", type: "textarea", value: "The Signature | The Founder's Reserve | Handmade wood chest with gourmet dried fruits, chocolate, wildflower honey & olive oil. | Read details" },
          { id: "smallCards", label: "Small gift cards", type: "textarea", value: "Royal Harvest | A sampling box of raw honey, medjool dates & handpicked nuts.\nThe Tea Botanical | Loose leaf organic herbal tea selection with handmade tea infuser." },
          { id: "showSection", label: "Show section", type: "toggle", value: true }
        ]
      },
      {
        id: "gifts-custom-chest",
        title: "Custom chest banner",
        type: "Banner CTA",
        status: "Published",
        fields: [
          { id: "eyebrow", label: "Banner subtitle", type: "text", value: "Made For You" },
          { id: "heading", label: "Banner heading", type: "text", value: "Build your own Custom Chest." },
          { id: "description", label: "Banner description", type: "textarea", value: "Select what fits, select the size, choose from our premium chest selections." },
          { id: "ctaLabel", label: "CTA label", type: "text", value: "Start building" },
          { id: "ctaHref", label: "CTA link", type: "text", value: "/categories" },
          { id: "image", label: "Banner image", type: "image", value: "/assets/custom_chest_bg.png" },
          { id: "showSection", label: "Show section", type: "toggle", value: true }
        ]
      },
      {
        id: "gifts-collections",
        title: "Heritage and seasonal collections",
        type: "Product columns",
        status: "Published",
        fields: [
          { id: "heritageHeading", label: "Left column heading", type: "text", value: "The Heritage" },
          { id: "heritageItems", label: "Heritage items", type: "textarea", value: "Old Orchard Classic | Heritage cider, heirloom apples & seasonal fruit. | $110.00\nThe Orchard Spa | Botanical body mist, lavender oil & organic tea. | $75.00" },
          { id: "seasonalHeading", label: "Right column heading", type: "text", value: "The Seasonal" },
          { id: "seasonalItems", label: "Seasonal items", type: "textarea", value: "Winter Solstice | Spiced honey, dark chocolate & hand-poured candle. | $120.00\nThe Morning Harvest | Blueberry jam, wildflower honey & signature blend. | $95.00" },
          { id: "showSection", label: "Show section", type: "toggle", value: true }
        ]
      },
      {
        id: "gifts-concierge",
        title: "Gift concierge",
        type: "Lead form",
        status: "Published",
        fields: [
          { id: "heading", label: "Form heading", type: "text", value: "Gift Concierge" },
          { id: "description", label: "Form description", type: "textarea", value: "Need help sending gifts for your team or event? Our concierge service provides personalized guidance." },
          { id: "emailPlaceholder", label: "Email placeholder", type: "text", value: "Your Email Address" },
          { id: "submitLabel", label: "Submit button label", type: "text", value: "Inquire" },
          { id: "showSection", label: "Show section", type: "toggle", value: true }
        ]
      }
    ]
  };
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
  // 1. Try local Express backend
  const localRes = await tryFetch(`${LOCAL_BACKEND}/content/modules/gifts`);
  if (isSuccessResponse(localRes)) {
    const merged = mergeLocalFallbackFields(localRes.data);
    return NextResponse.json({ ...localRes, data: merged });
  }

  // 2. Try remote Express backend
  const remoteRes = await tryFetch(`${REMOTE_BACKEND}/content/modules/gifts`);
  if (isSuccessResponse(remoteRes)) {
    const merged = mergeLocalFallbackFields(remoteRes.data);
    return NextResponse.json({ ...remoteRes, data: merged });
  }

  // 3. Fallback to local JSON file
  const localJson = readLocalData();
  if (localJson) {
    return NextResponse.json({ success: true, data: localJson });
  }

  return NextResponse.json(
    { success: false, message: "Unable to retrieve gifts module data." },
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

  // Map fields into banner payload if updating banner (gifts-header)
  let savedToBackend = false;
  if (section.id === "gifts-header") {
    const eyebrow = section.fields.find((f: any) => f.id === "eyebrow")?.value || "";
    const headline = section.fields.find((f: any) => f.id === "headline")?.value || "";
    const description = section.fields.find((f: any) => f.id === "description")?.value || "";

    const options: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authorization ? { Authorization: authorization } : {})
      },
      body: JSON.stringify({
        banner: {
          bannerLabel: eyebrow,
          bannerTitle: headline,
          bannerDescription: description
        }
      })
    };

    try {
      const localRes = await fetch(`${LOCAL_BACKEND}/gifts/banner`, { ...options, cache: "no-store" });
      if (localRes.ok) {
        const data = await localRes.json();
        if (data.status === "success" || data.success) savedToBackend = true;
      }
    } catch {}

    if (!savedToBackend) {
      try {
        const remoteRes = await fetch(`${REMOTE_BACKEND}/gifts/banner`, { ...options, cache: "no-store" });
        if (remoteRes.ok) {
          const data = await remoteRes.json();
          if (data.status === "success" || data.success) savedToBackend = true;
        }
      } catch {}
    }
  } else {
    // Other sections are saved via the generic POST endpoint on the Express backend
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authorization ? { Authorization: authorization } : {})
      },
      body: JSON.stringify({ moduleId: "gifts", section })
    };

    try {
      const localRes = await fetch(`${LOCAL_BACKEND}/content/sections`, { ...options, cache: "no-store" });
      if (localRes.ok) {
        const data = await localRes.json();
        if (data.status === "success" || data.success) savedToBackend = true;
      }
    } catch {}

    if (!savedToBackend) {
      try {
        const remoteRes = await fetch(`${REMOTE_BACKEND}/content/sections`, { ...options, cache: "no-store" });
        if (remoteRes.ok) {
          const data = await remoteRes.json();
          if (data.status === "success" || data.success) savedToBackend = true;
        }
      } catch {}
    }
  }

  // Update local JSON mockup file to keep it in sync
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
