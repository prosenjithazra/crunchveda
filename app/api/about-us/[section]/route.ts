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

const cleanUrl = (url: string): string => {
  if (typeof url !== "string") return "";
  return url.replace(/%22$/, "").replace(/"$/, "").trim();
};

const sectionRecordIds: Record<string, string> = {
  banner: "about-banner",
  stewardship: "about-stewardship",
  journey: "about-journey",
  quote: "about-quote",
  charter: "about-charter"
};

const mapRecordToSectionData = (section: string, record: any) => {
  const fields = record?.fields || [];
  const get = (id: string) => fields.find((f: any) => f.id === id)?.value;

  if (section === "banner") {
    return {
      bannerImage: cleanUrl(get("image") || ""),
      bannerLabel: get("eyebrow") || get("bannerLabel") || "",
      bannerTitle: get("headline") || get("bannerTitle") || "",
      bannerDescription: get("description") || get("bannerDescription") || "",
      showSection: get("showSection") !== false
    };
  }

  if (section === "stewardship") {
    return {
      eyebrow: get("eyebrow") || "",
      heading: get("heading") || "",
      description: get("description") || "",
      quote: get("quote") || "",
      badgeNumber: get("badgeNumber") || "",
      badgeText: get("badgeText") || "",
      image: cleanUrl(get("image") || ""),
      showSection: get("showSection") !== false
    };
  }

  if (section === "journey") {
    return {
      eyebrow: get("eyebrow") || "",
      heading: get("heading") || "",
      steps: get("steps") || "",
      imageSet: get("imageSet") || "",
      showSection: get("showSection") !== false
    };
  }

  if (section === "quote") {
    return {
      quote: get("quote") || "",
      author: get("author") || "",
      showSection: get("showSection") !== false
    };
  }

  if (section === "charter") {
    return {
      heading: get("heading") || "",
      description: get("description") || "",
      reportLabel: get("reportLabel") || "",
      reportHref: get("reportHref") || "",
      charters: get("charters") || "",
      showSection: get("showSection") !== false
    };
  }

  return {};
};

const normalizeSectionResponse = (section: string, response: any) => {
  const data = response?.data ?? response;
  const sectionData = data?.[section] ?? data;
  const recordId = sectionRecordIds[section];
  const record = sectionData?.fields
    ? sectionData
    : data?.records?.find((item: any) => item.id === recordId);

  if (record?.fields) {
    return mapRecordToSectionData(section, record);
  }

  if (sectionData && typeof sectionData === "object" && !Array.isArray(sectionData)) {
    return sectionData;
  }

  return null;
};

const isSuccessResponse = (response: any) => {
  return (response?.status === "success" || response?.success === true) && response?.data;
};

const mergeLocalSectionFallback = (section: string, sectionData: any) => {
  const localJson = readLocalData();
  const recordId = sectionRecordIds[section];
  if (!localJson || !localJson.records || !recordId) return sectionData;

  const localRecord = localJson.records.find((r: any) => r.id === recordId);
  if (!localRecord) return sectionData;

  const localSectionData = mapRecordToSectionData(section, localRecord) as any;
  const merged = { ...sectionData } as any;

  Object.keys(merged).forEach((key) => {
    if (merged[key] === "" || merged[key] === null || merged[key] === undefined) {
      if (localSectionData[key] !== "" && localSectionData[key] !== null && localSectionData[key] !== undefined) {
        merged[key] = localSectionData[key];
      }
    }
  });

  return merged;
};

const parseRequestBody = async (
  request: Request
): Promise<{ payload: Record<string, any>; backendOptions: { body: BodyInit; headers: Record<string, string> } }> => {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const payload: Record<string, any> = {};
    formData.forEach((value, key) => {
      payload[key] = value;
    });

    return {
      payload,
      backendOptions: {
        body: formData,
        headers: {}
      }
    };
  }

  const payload = await request.json();
  return {
    payload,
    backendOptions: {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    }
  };
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;

  // 1. Try local Express backend
  const localRes = await tryFetch(`${LOCAL_BACKEND}/about-us/${section}`);
  if (isSuccessResponse(localRes)) {
    const sectionData = normalizeSectionResponse(section, localRes);
    if (sectionData) {
      const mergedData = mergeLocalSectionFallback(section, sectionData);
      return NextResponse.json({
        success: true,
        status: "success",
        data: { [section]: mergedData }
      });
    }
  }

  // 2. Try remote Express backend
  const remoteRes = await tryFetch(`${REMOTE_BACKEND}/about-us/${section}`);
  if (isSuccessResponse(remoteRes)) {
    const sectionData = normalizeSectionResponse(section, remoteRes);
    if (sectionData) {
      const mergedData = mergeLocalSectionFallback(section, sectionData);
      return NextResponse.json({
        success: true,
        status: "success",
        data: { [section]: mergedData }
      });
    }
  }

  // 3. Fallback to local JSON file
  const localJson = readLocalData();
  if (localJson) {
    const recordId = sectionRecordIds[section] || "";

    if (recordId) {
      const record = (localJson.records || []).find((r: any) => r.id === recordId);
      if (record) {
        const sectionData = mapRecordToSectionData(section, record);

        return NextResponse.json({
          success: true,
          status: "success",
          data: { [section]: sectionData }
        });
      }
    }
  }

  // 4. Default Fallbacks if all else fails
  let defaultData: any = {};
  if (section === "banner") {
    defaultData = {
      bannerImage: "",
      bannerLabel: "EST. 1914",
      bannerTitle: "Cultivating Legacy Through the Seasons",
      bannerDescription: "A century of dedication to the soil, the seed, and the harvest. The story of our organic stewardship.",
      showSection: true
    };
  } else if (section === "stewardship") {
    defaultData = {
      eyebrow: "Our Roots",
      heading: "A Century of Stewardship",
      description: "For over three generations, the Nur Harvest estate has stood as a beacon of organic excellence. Our journey began with a simple promise: to honor the land and craft purity. We believe that true luxury lies in the purity of the source and the patience of the process.",
      quote: "This is not merely land; it is a trust we hold for those who will follow. Every seed we sow and every harvest we press carries the warmth of the story we write here.",
      badgeNumber: "100+",
      badgeText: "Years of Tradition",
      image: "",
      showSection: true
    };
  } else if (section === "journey") {
    defaultData = {
      eyebrow: "Our Process",
      heading: "The Artisanal Journey",
      steps: "Seed Heritage | The finest seed, hand-selected to reflect archaeological history and botanical purity.\nMineral Enrichment | Curating balanced ecosystem compounds, enriching soil nutrients to capture the natural essence.\nMaster Curation | Only the pinnacle of the harvest is selected, ensuring each jar represents a masterpiece.",
      imageSet: "",
      showSection: true
    };
  } else if (section === "quote") {
    defaultData = {
      quote: "Nature doesn't rush, yet everything is accomplished. We've learned that by respecting the clock of the seasons, we achieve a quality that technology simply cannot replicate.",
      author: "— ALBERT CHEN, CHIEF FIELD WARDEN",
      showSection: true
    };
  } else if (section === "charter") {
    defaultData = {
      heading: "The Sustainability Charter",
      description: "Our commitment to the future is deeply etched in our soil. We operate on principles of regenerative abundance.",
      reportLabel: "Read Our Full Report",
      reportHref: "#report",
      charters: "Water Safety | Closed-loop irrigation systems that reduce water by 45 percent.\nCO2 Reduction | Solar-driven greenhouses and active low-emission transportation.\nSoil Security | No synthetic chemicals, preserving natural biodiversity.\nOrganic Grades | Rigorous testing protocols for all farm operations.",
      showSection: true
    };
  }

  return NextResponse.json({
    success: true,
    status: "success",
    data: { [section]: defaultData }
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  const authorization = request.headers.get("authorization");

  let payload: any;
  let backendOptions: { body: BodyInit; headers: Record<string, string> };
  try {
    const parsed = await parseRequestBody(request);
    payload = parsed.payload;
    backendOptions = parsed.backendOptions;
  } catch {
    return NextResponse.json({ success: false, status: "error", message: "Invalid request payload" }, { status: 400 });
  }

  // 1. Try local Express backend
  const options: RequestInit = {
    method: "PUT",
    headers: {
      ...backendOptions.headers,
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: backendOptions.body
  };

  let savedToBackend = false;

  try {
    const localRes = await fetch(`${LOCAL_BACKEND}/about-us/${section}`, { ...options, cache: "no-store" });
    if (localRes.ok) {
      const data = await localRes.json();
      if (data.status === "success" || data.success) savedToBackend = true;
    }
  } catch {}

  if (!savedToBackend) {
    try {
      const remoteRes = await fetch(`${REMOTE_BACKEND}/about-us/${section}`, { ...options, cache: "no-store" });
      if (remoteRes.ok) {
        const data = await remoteRes.json();
        if (data.status === "success" || data.success) savedToBackend = true;
      }
    } catch {}
  }

  // Save locally in Next.js workspace to persist edits
  const localJson = readLocalData();
  const recordId = sectionRecordIds[section];
  if (localJson && localJson.records && recordId) {
    const recordIndex = localJson.records.findIndex((r: any) => r.id === recordId);
    if (recordIndex !== -1) {
      const record = localJson.records[recordIndex];
      record.updatedAt = new Date().toISOString().slice(0, 10);
      record.fields = record.fields.map((field: any) => {
        let val = payload[field.id];
        // Handle field id aliases
        if (field.id === "image" && payload.bannerImage !== undefined && section === "banner") {
          val = payload.bannerImage;
        } else if (field.id === "eyebrow" && payload.bannerLabel !== undefined && section === "banner") {
          val = payload.bannerLabel;
        } else if (field.id === "headline" && payload.bannerTitle !== undefined && section === "banner") {
          val = payload.bannerTitle;
        } else if (field.id === "description" && payload.bannerDescription !== undefined && section === "banner") {
          val = payload.bannerDescription;
        }
        
        if (val !== undefined) {
          return { ...field, value: val };
        }
        return field;
      });
      localJson.records[recordIndex] = record;
      writeLocalData(localJson);
    }
  }

  return NextResponse.json({
    success: true,
    status: "success",
    message: `${section} updated successfully.`,
    data: payload,
    savedToBackend
  });
}
