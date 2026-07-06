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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;

  // 1. Try local Express backend
  const localRes = await tryFetch(`${LOCAL_BACKEND}/about-us/${section}`);
  if (localRes?.status === "success" && localRes?.data) {
    return NextResponse.json(localRes);
  }

  // 2. Try remote Express backend
  const remoteRes = await tryFetch(`${REMOTE_BACKEND}/about-us/${section}`);
  if (remoteRes?.status === "success" && remoteRes?.data) {
    return NextResponse.json(remoteRes);
  }

  // 3. Fallback to local JSON file
  const localJson = readLocalData();
  if (localJson) {
    let recordId = "";
    if (section === "banner") recordId = "about-banner";
    else if (section === "stewardship") recordId = "about-stewardship";
    else if (section === "journey") recordId = "about-journey";
    else if (section === "quote") recordId = "about-quote";
    else if (section === "charter") recordId = "about-charter";

    if (recordId) {
      const record = (localJson.records || []).find((r: any) => r.id === recordId);
      if (record) {
        const fields = record.fields || [];
        const get = (id: string) => fields.find((f: any) => f.id === id)?.value;

        let sectionData: any = {};
        if (section === "banner") {
          sectionData = {
            bannerImage: cleanUrl(get("image") || ""),
            bannerLabel: get("eyebrow") || "",
            bannerTitle: get("headline") || "",
            bannerDescription: get("description") || "",
            showSection: get("showSection") !== false
          };
        } else if (section === "stewardship") {
          sectionData = {
            eyebrow: get("eyebrow") || "",
            heading: get("heading") || "",
            description: get("description") || "",
            quote: get("quote") || "",
            badgeNumber: get("badgeNumber") || "",
            badgeText: get("badgeText") || "",
            image: cleanUrl(get("image") || ""),
            showSection: get("showSection") !== false
          };
        } else if (section === "journey") {
          sectionData = {
            eyebrow: get("eyebrow") || "",
            heading: get("heading") || "",
            steps: get("steps") || "",
            imageSet: get("imageSet") || "",
            showSection: get("showSection") !== false
          };
        } else if (section === "quote") {
          sectionData = {
            quote: get("quote") || "",
            author: get("author") || "",
            showSection: get("showSection") !== false
          };
        } else if (section === "charter") {
          sectionData = {
            heading: get("heading") || "",
            description: get("description") || "",
            reportLabel: get("reportLabel") || "",
            reportHref: get("reportHref") || "",
            charters: get("charters") || "",
            showSection: get("showSection") !== false
          };
        }

        return NextResponse.json({
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
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ status: "error", message: "Invalid JSON payload" }, { status: 400 });
  }

  // 1. Try local Express backend
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify(payload)
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

  // 2. Save locally in local about-us-data.json
  const localJson = readLocalData() || { id: "about-us", title: "About Us CMS Page", records: [] };
  if (!localJson.records) localJson.records = [];

  let recordId = "";
  if (section === "banner") recordId = "about-banner";
  else if (section === "stewardship") recordId = "about-stewardship";
  else if (section === "journey") recordId = "about-journey";
  else if (section === "quote") recordId = "about-quote";
  else if (section === "charter") recordId = "about-charter";

  if (recordId) {
    const idx = localJson.records.findIndex((r: any) => r.id === recordId);

    const fields: any[] = [];
    if (section === "banner") {
      fields.push({ id: "eyebrow", label: "Hero subtitle", type: "text", value: payload.bannerLabel || "" });
      fields.push({ id: "headline", label: "H1 headline", type: "text", value: payload.bannerTitle || "" });
      fields.push({ id: "description", label: "Hero paragraph", type: "textarea", value: payload.bannerDescription || "" });
      fields.push({ id: "image", label: "Hero image", type: "image", value: payload.bannerImage || "" });
      fields.push({ id: "showSection", label: "Show section", type: "toggle", value: payload.showSection !== false });
    } else if (section === "stewardship") {
      fields.push({ id: "eyebrow", label: "Eyebrow", type: "text", value: payload.eyebrow || "" });
      fields.push({ id: "heading", label: "Heading", type: "text", value: payload.heading || "" });
      fields.push({ id: "description", label: "Description", type: "textarea", value: payload.description || "" });
      fields.push({ id: "quote", label: "Quote", type: "textarea", value: payload.quote || "" });
      fields.push({ id: "badgeNumber", label: "Badge Number", type: "text", value: payload.badgeNumber || "" });
      fields.push({ id: "badgeText", label: "Badge Text", type: "text", value: payload.badgeText || "" });
      fields.push({ id: "image", label: "Image", type: "image", value: payload.image || "" });
      fields.push({ id: "showSection", label: "Show section", type: "toggle", value: payload.showSection !== false });
    } else if (section === "journey") {
      fields.push({ id: "eyebrow", label: "Eyebrow", type: "text", value: payload.eyebrow || "" });
      fields.push({ id: "heading", label: "Heading", type: "text", value: payload.heading || "" });
      fields.push({ id: "steps", label: "Steps (Title|Desc)", type: "textarea", value: payload.steps || "" });
      fields.push({ id: "imageSet", label: "Images (Newline separated)", type: "textarea", value: payload.imageSet || "" });
      fields.push({ id: "showSection", label: "Show section", type: "toggle", value: payload.showSection !== false });
    } else if (section === "quote") {
      fields.push({ id: "quote", label: "Quote", type: "textarea", value: payload.quote || "" });
      fields.push({ id: "author", label: "Author", type: "text", value: payload.author || "" });
      fields.push({ id: "showSection", label: "Show section", type: "toggle", value: payload.showSection !== false });
    } else if (section === "charter") {
      fields.push({ id: "heading", label: "Heading", type: "text", value: payload.heading || "" });
      fields.push({ id: "description", label: "Description", type: "textarea", value: payload.description || "" });
      fields.push({ id: "reportLabel", label: "Report CTA Label", type: "text", value: payload.reportLabel || "" });
      fields.push({ id: "reportHref", label: "Report Link", type: "text", value: payload.reportHref || "" });
      fields.push({ id: "charters", label: "Charters (Title|Desc)", type: "textarea", value: payload.charters || "" });
      fields.push({ id: "showSection", label: "Show section", type: "toggle", value: payload.showSection !== false });
    }

    const updatedRecord = {
      id: recordId,
      title: section.charAt(0).toUpperCase() + section.slice(1) + " Section",
      type: "Content Section",
      status: "Published",
      updatedAt: new Date().toISOString().slice(0, 10),
      fields
    };

    if (idx !== -1) {
      localJson.records[idx] = updatedRecord;
    } else {
      localJson.records.push(updatedRecord);
    }

    try {
      const dirPath = path.dirname(jsonFilePath);
      if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
      fs.writeFileSync(jsonFilePath, JSON.stringify(localJson, null, 2), "utf8");
    } catch (err) {
      console.error("Failed to write to local JSON:", err);
    }
  }

  return NextResponse.json({
    status: "success",
    message: `${section} updated successfully.`,
    data: payload,
    savedToBackend
  });
}
