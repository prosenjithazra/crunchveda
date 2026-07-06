/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminModules, type AdminContentRecord, type AdminModule, type AdminProductRecord, type AdminSectionField } from "@/json/mock/admin";
import { adminAuthService } from "./authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.6.128:5000/api";
const CMS_HOME_BANNER_API = "/api/cms/home-banner";
const CMS_HOME_PAGE_API = "/api/cms/home-page";

type HomeBannerApiRecord = {
  bannerImage?: string;
  bannerVideo?: string;
  bannerSubTitle?: string;
  bannerTitle?: string;
  bannerDescription?: string;
};

type HomeBannerPayload = Required<HomeBannerApiRecord>;

const normalizeImageUrl = (url = "") => url.trim().replace(/%22$/, "").replace(/"$/, "");
const normalizeKey = (value = "") => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const fieldValue = (section: AdminContentRecord, fieldId: string) => {
  const field = section.fields.find(item => item.id === fieldId);
  return typeof field?.value === "string" ? field.value : "";
};

const firstFieldValue = (section: AdminContentRecord, fieldIds: string[]) => {
  for (const fieldId of fieldIds) {
    const value = fieldValue(section, fieldId);
    if (value) return value;
  }
  return "";
};

const mapHomeBannerToSection = (homeBanner: HomeBannerApiRecord): AdminContentRecord => ({
  id: "home-hero",
  title: "Home hero banner",
  type: "Hero section",
  status: "Published",
  updatedAt: new Date().toISOString().slice(0, 10),
  fields: [
    { id: "bannerImage", label: "Banner image", type: "image", value: normalizeImageUrl(homeBanner.bannerImage) },
    { id: "bannerVideo", label: "Banner video", type: "video", value: homeBanner.bannerVideo || "" },
    { id: "bannerSubTitle", label: "Banner subtitle", type: "text", value: homeBanner.bannerSubTitle || "" },
    { id: "bannerTitle", label: "Banner title", type: "text", value: homeBanner.bannerTitle || "" },
    { id: "bannerDescription", label: "Banner description", type: "textarea", value: homeBanner.bannerDescription || "" },
    { id: "showSection", label: "Show hero section", type: "toggle", value: true },
  ],
});

const mapSectionToHomeBannerPayload = (section: AdminContentRecord): HomeBannerPayload => ({
  bannerImage: normalizeImageUrl(firstFieldValue(section, ["bannerImage", "image"])),
  bannerVideo: fieldValue(section, "bannerVideo"),
  bannerSubTitle: firstFieldValue(section, ["bannerSubTitle", "eyebrow"]),
  bannerTitle: firstFieldValue(section, ["bannerTitle", "headline"]),
  bannerDescription: firstFieldValue(section, ["bannerDescription", "description"]),
});

const mapHomeBannerToHomeSection = (homeBanner: HomeBannerApiRecord): AdminContentRecord & { content: Record<string, any> } => ({
  ...mapHomeBannerToSection(homeBanner),
  content: {
    bannerImage: normalizeImageUrl(homeBanner.bannerImage),
    bannerVideo: homeBanner.bannerVideo || "",
    bannerSubTitle: homeBanner.bannerSubTitle || "",
    bannerTitle: homeBanner.bannerTitle || "",
    bannerDescription: homeBanner.bannerDescription || "",
    eyebrow: homeBanner.bannerSubTitle || "",
    headline: homeBanner.bannerTitle || "",
    description: homeBanner.bannerDescription || "",
    image: normalizeImageUrl(homeBanner.bannerImage),
    showSection: true,
  },
});

const readHomeBannerFromResponse = (data: any): HomeBannerApiRecord => data?.data?.homeBanner || data?.homeBanner || data?.data || {};

const readApiJson = async (response: Response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    const preview = text.slice(0, 80).replace(/\s+/g, " ").trim();
    throw new Error(`Expected JSON from API but received: ${preview || "empty response"}`);
  }
};

const resolveModuleId = (moduleData: AdminModule) => moduleData.moduleId || moduleData.id;

const mergeContentRecord = (record: AdminContentRecord, fallbackRecord?: AdminContentRecord): AdminContentRecord => {
  if (!fallbackRecord) return record;

  const mergedFields = fallbackRecord.fields.map(fallbackField => {
    const existingField = record.fields.find(f => f.id === fallbackField.id);
    if (existingField) {
      return {
        ...fallbackField,
        value: existingField.value,
      } as AdminSectionField;
    }
    return fallbackField;
  });

  return {
    ...record,
    fields: mergedFields,
  };
};

const mergeContentModule = (moduleData?: AdminModule, requestedId?: string): AdminModule | undefined => {
  const moduleId = requestedId || (moduleData ? resolveModuleId(moduleData) : "");
  const fallbackModule = adminModules.find(item => item.id === moduleId || item.moduleId === moduleId);

  if (!moduleData) return fallbackModule;

  const records = (moduleData.records?.length ? moduleData.records : fallbackModule?.records || []).map(record => {
    const fallbackRecord = fallbackModule?.records.find(r => r.id === record.id);
    return mergeContentRecord(record, fallbackRecord);
  });

  if (fallbackModule?.records) {
    fallbackModule.records.forEach(fallbackRecord => {
      const exists = records.some(r => r.id === fallbackRecord.id);
      if (!exists) {
        records.push(fallbackRecord);
      }
    });
  }

  return {
    ...fallbackModule,
    ...moduleData,
    id: moduleData.id || fallbackModule?.id || moduleId,
    moduleId,
    title: moduleData.title || fallbackModule?.title || moduleId,
    records,
  };
};

const mergeContentModules = (modules: AdminModule[] = []) => {
  if (!modules.length) return adminModules;

  const mergedModules: AdminModule[] = modules
    .map(moduleData => mergeContentModule(moduleData))
    .filter((moduleData): moduleData is AdminModule => Boolean(moduleData));

  adminModules.forEach(fallbackModule => {
    const exists = mergedModules.some(moduleData => resolveModuleId(moduleData) === fallbackModule.id);
    if (!exists) {
      mergedModules.push(fallbackModule);
    }
  });

  return mergedModules;
};

const cmsRequestUrl = (path: string) => {
  if (typeof window !== "undefined") {
    return path;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${appUrl.replace(/\/$/, "")}${path}`;
};
const homeBannerRequestUrl = () => cmsRequestUrl(CMS_HOME_BANNER_API);
const homePageRequestUrl = () => cmsRequestUrl(CMS_HOME_PAGE_API);

const readHomePageFromResponse = (data: any) =>
  data?.data?.homePage ||
  data?.data?.home ||
  data?.data?.homeData ||
  data?.homePage ||
  data?.home ||
  data?.homeData ||
  data?.data ||
  data ||
  {};

const sectionAliases: Record<string, string[]> = {
  hero: ["hero", "homehero", "homebanner", "banner", "mainbanner", "home-hero"],
  categories: ["categories", "homecategories", "curatedcategories", "categorysection", "home-categories"],
  "best-selling": ["bestselling", "bestseller", "bestsellers", "bestSellingProducts", "bestproducts", "home-best-selling", "bestSellerSection", "bestsellersection"],
  features: ["features", "homefeatures", "featurepromise", "featureband", "home-features", "featuresection", "featureSection"],
  "gift-banner": ["giftbanner", "homegiftbanner", "gift", "gifting", "home-gift-banner", "giftboxsection", "giftBoxSection"],
  "product-details": ["productdetails", "productdetail", "details", "homeproductdetails", "home-product-details", "nutritionhighlightssection", "nutritionHighlightsSection"],
  timeline: ["timeline", "heritagetimeline", "journey", "hometimeline", "home-timeline", "heritagejourneysection", "heritageJourneySection"],
  faq: ["faq", "faqs", "frequentlyaskedquestions", "homefaq", "home-faq", "faqsection", "faqSection"],
  instagram: ["instagram", "homeinstagram", "instagramsection", "instagramSection", "home-instagram", "reels", "reelssection", "reelsSection"],
};

const sectionRecordIds: Record<string, string> = {
  hero: "home-hero",
  categories: "home-categories",
  "best-selling": "home-best-selling",
  features: "home-features",
  "gift-banner": "home-gift-banner",
  "product-details": "home-product-details",
  timeline: "home-timeline",
  faq: "home-faq",
  instagram: "home-instagram",
};

const fieldsToContent = (fields: AdminContentRecord["fields"] = []) =>
  fields.reduce<Record<string, any>>((content, field) => {
    content[field.id] = field.value;
    return content;
  }, {});

const unwrapSectionContent = (section: any) => {
  if (!section) return {};
  if (section.content && typeof section.content === "object") return section.content;
  if (Array.isArray(section.fields)) return fieldsToContent(section.fields);
  return section;
};

const findHomePageSection = (homePage: any, sectionName: string) => {
  const aliases = [sectionName, sectionRecordIds[sectionName], ...(sectionAliases[sectionName] || [])].map(normalizeKey);

  if (Array.isArray(homePage)) {
    return homePage.find(item => {
      const keys = [item?.id, item?.sectionId, item?.key, item?.name, item?.slug, item?.type, item?.title].map(value => normalizeKey(String(value || "")));
      return keys.some(key => aliases.includes(key));
    });
  }

  if (homePage?.records && Array.isArray(homePage.records)) {
    return findHomePageSection(homePage.records, sectionName);
  }

  if (homePage?.sections && Array.isArray(homePage.sections)) {
    return findHomePageSection(homePage.sections, sectionName);
  }

  if (homePage && typeof homePage === "object") {
    if (sectionName === "hero" && homePage.homeBanner) return homePage.homeBanner;

    const matchingKey = Object.keys(homePage).find(key => aliases.includes(normalizeKey(key)));
    if (matchingKey) return homePage[matchingKey];
  }

  return null;
};

const withHomeBannerAliases = (content: Record<string, any>) => {
  const bannerImage = normalizeImageUrl(content.bannerImage || content.image || "");
  const bannerSubTitle = content.bannerSubTitle || content.eyebrow || content.subTitle || content.subtitle || "";
  const bannerTitle = content.bannerTitle || content.headline || content.title || "";
  const bannerDescription = content.bannerDescription || content.description || "";

  return {
    ...content,
    bannerImage,
    bannerSubTitle,
    bannerTitle,
    bannerDescription,
    image: bannerImage,
    eyebrow: bannerSubTitle,
    headline: bannerTitle,
    description: bannerDescription,
    showSection: content.showSection ?? true,
  };
};

const normalizeHomeSection = (sectionName: string, rawSection: any): AdminContentRecord & { content: Record<string, any> } => {
  const fallbackRecord = adminModules
    .find(module => module.id === "home")
    ?.records.find(record => record.id === sectionRecordIds[sectionName]);
  const rawContent = unwrapSectionContent(rawSection);
  const content = { ...rawContent };

  if (sectionName === "hero") {
    Object.assign(content, withHomeBannerAliases(content));
  } else if (sectionName === "features") {
    if (Array.isArray(content.features)) {
      // Keep features array as-is so FeatureItemsEditor can seed from it
      // (icon, title, description fields preserved)
      content.features = content.features.map((f: any) => ({
        icon: f.icon || "",
        title: f.title || "",
        description: f.description || f.desc || "",
      }));
    }
  } else if (sectionName === "gift-banner") {
    // API returns: sectionLabel, sectionTitle, sectionDescription, buttonText, buttonLink, backgroundImage
    // Admin field IDs now match the API names directly — just ensure aliases are populated too
    content.sectionLabel       = content.sectionLabel       || content.eyebrow   || "";
    content.sectionTitle       = content.sectionTitle       || content.heading    || "";
    content.sectionDescription = content.sectionDescription || content.description|| "";
    content.buttonText         = content.buttonText         || content.ctaLabel   || "";
    content.buttonLink         = content.buttonLink         || content.ctaHref    || "";
    content.backgroundImage    = content.backgroundImage    || content.image      || "";
    // Keep legacy aliases so GiftBanner.tsx still works unchanged
    content.eyebrow     = content.sectionLabel;
    content.heading     = content.sectionTitle;
    content.description = content.sectionDescription;
    content.ctaLabel    = content.buttonText;
    content.ctaHref     = content.buttonLink;
    content.image       = content.backgroundImage;
  } else if (sectionName === "product-details") {
    if (Array.isArray(content.items)) {
      const w = content.items[0];
      const a = content.items[1];
      if (w) {
        content.walnutEyebrow = w.sectionLabel || w.eyebrow || "";
        content.walnutHeading = w.sectionTitle || w.title || "";
        content.walnutDescription = w.sectionDescription || w.description || "";
        content.walnutBullets = Array.isArray(w.highlights) 
          ? w.highlights.join("\n") 
          : (Array.isArray(w.bullets) 
             ? w.bullets.join("\n") 
             : (w.highlights || w.bullets || ""));
        content.walnutImage = w.image || "";
      }
      if (a) {
        content.almondEyebrow = a.sectionLabel || a.eyebrow || "";
        content.almondHeading = a.sectionTitle || a.title || "";
        content.almondDescription = a.sectionDescription || a.description || "";
        content.almondBullets = Array.isArray(a.highlights) 
          ? a.highlights.join("\n") 
          : (Array.isArray(a.bullets) 
             ? a.bullets.join("\n") 
             : (a.highlights || a.bullets || ""));
        content.almondImage = a.image || "";
      }
    }
  } else if (sectionName === "timeline") {
    // API returns milestones array. Admin expects value of milestones to be that array.
    // If it's a string, we can parse it from Year | Title | Description | Align.
    if (Array.isArray(content.milestones)) {
      content.milestones = content.milestones.map((m: any) => ({
        year: m.year || "",
        title: m.title || "",
        description: m.description || m.desc || ""
      }));
    } else {
      const eventsRaw = String(content.milestones || content.events || "");
      if (eventsRaw.trim()) {
        content.milestones = eventsRaw.split("\n").filter(Boolean).map(line => {
          const parts = line.split("|");
          return {
            year: parts[0]?.trim() || "",
            title: parts[1]?.trim() || "",
            description: parts[2]?.trim() || ""
          };
        });
      } else {
        content.milestones = [];
      }
    }
    content.heading = content.sectionTitle || content.heading || "";
    content.description = content.sectionDescription || content.description || "";
  } else if (sectionName === "faq") {
    if (Array.isArray(content.faqs)) {
      content.faqs = content.faqs.map((f: any) => ({
        question: f.question || "",
        answer: f.answer || ""
      }));
    } else {
      const faqItemsRaw = String(content.faqs || content.faqItems || "");
      if (faqItemsRaw.trim()) {
        content.faqs = faqItemsRaw.split("\n").filter(Boolean).map(line => {
          const parts = line.split("|");
          return {
            question: parts[0]?.trim() || "",
            answer: parts[1]?.trim() || ""
          };
        }).filter(f => f.question && f.answer);
      } else {
        content.faqs = [];
      }
    }
    content.heading = content.sectionTitle || content.heading || "";
  } else if (sectionName === "instagram") {
    if (Array.isArray(content.reels)) {
      content.reels = content.reels.map((r: any) => ({
        image: r.image || "",
        link: r.link || "",
        alt: r.alt || ""
      }));
    } else {
      const reelsRaw = String(content.reels || "");
      if (reelsRaw.trim()) {
        try {
          const parsed = JSON.parse(reelsRaw);
          if (Array.isArray(parsed)) {
            content.reels = parsed.map((r: any) => ({
              image: r.image || "",
              link: r.link || "",
              alt: r.alt || ""
            }));
          } else {
            throw new Error();
          }
        } catch {
          content.reels = reelsRaw.split("\n").filter(Boolean).map(line => {
            const parts = line.split("|");
            return {
              image: parts[0]?.trim() || "",
              link: parts[1]?.trim() || "",
              alt: parts[2]?.trim() || ""
            };
          });
        }
      } else {
        content.reels = [];
      }
    }
    content.heading = content.sectionTitle || content.heading || "";
    content.description = content.sectionSubtitle || content.description || "";
  }

  const fallbackFields = fallbackRecord?.fields || [];
  const fields = fallbackFields.map(field => {
    let val = content[field.id];
    if (val === undefined && sectionName === "hero") {
      if (field.id === "bannerImage") val = content.image || content.bannerImage;
      if (field.id === "bannerSubTitle") val = content.eyebrow || content.bannerSubTitle;
      if (field.id === "bannerTitle") val = content.headline || content.bannerTitle;
      if (field.id === "bannerDescription") val = content.description || content.bannerDescription;
    }
    if (val !== undefined) {
      return {
        ...field,
        value: typeof val === "string" ? normalizeImageUrl(val) : val,
      };
    }
    return field;
  });

  return {
    id: rawSection?.id || rawSection?.sectionId || fallbackRecord?.id || sectionRecordIds[sectionName] || `home-${sectionName}`,
    title: rawSection?.title || fallbackRecord?.title || sectionName,
    type: rawSection?.type || fallbackRecord?.type || "Homepage section",
    status: rawSection?.status || fallbackRecord?.status || "Published",
    updatedAt: rawSection?.updatedAt || new Date().toISOString().slice(0, 10),
    fields,
    content: {
      ...content,
      ...fieldsToContent(fields),
    },
  };
};

export const adminContentService = {
  getHomePage: async (): Promise<any> => {
    try {
      const res = await fetch(homePageRequestUrl(), { cache: "no-store" });
      const data = await readApiJson(res);
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch home page CMS data");
      }
      return readHomePageFromResponse(data);
    } catch (error) {
      // Re-throw as a clean Error so callers can swallow it without crashing
      throw error instanceof Error ? error : new Error("CMS home page unavailable");
    }
  },

  getHomeBanner: async (): Promise<AdminContentRecord & { content: Record<string, any> }> => {
    try {
      const homePage = await adminContentService.getHomePage();
      const homeBanner = findHomePageSection(homePage, "hero") || homePage?.homeBanner;
      if (homeBanner) {
        return normalizeHomeSection("hero", homeBanner);
      }
    } catch {
      // The banner endpoint is PUT-only; admin editing can still open from the local field shape.
    }
    const fallbackRecord = adminModules.find(module => module.id === "home")?.records.find(record => record.id === "home-hero");
    return normalizeHomeSection("hero", fallbackRecord || {});
  },

  saveHomeBanner: async (section: AdminContentRecord): Promise<AdminContentRecord> => {
    const session = adminAuthService.getSession();
    const token = session?.token || "";

    const formData = new FormData();

    // Map section fields into the FormData
    const bannerTitle = section.fields.find(f => f.id === "bannerTitle")?.value || "";
    const bannerSubTitle = section.fields.find(f => f.id === "bannerSubTitle")?.value || "";
    const bannerDescription = section.fields.find(f => f.id === "bannerDescription")?.value || "";

    formData.append("bannerTitle", String(bannerTitle));
    formData.append("bannerSubTitle", String(bannerSubTitle));
    formData.append("bannerDescription", String(bannerDescription));

    const imageField = section.fields.find(f => f.id === "bannerImage") as any;
    if (imageField?.file) {
      formData.append("image", imageField.file);
    } else {
      formData.append("bannerImage", String(imageField?.value || ""));
    }

    const videoField = section.fields.find(f => f.id === "bannerVideo") as any;
    if (videoField?.file) {
      formData.append("video", videoField.file);
    } else {
      formData.append("bannerVideo", String(videoField?.value || ""));
    }
    const res = await fetch(homeBannerRequestUrl(), {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    const data = await readApiJson(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to update home banner");
    }
    return mapHomeBannerToSection(readHomeBannerFromResponse(data));
  },

  getOurStoryBanner: async (): Promise<AdminContentRecord & { content: Record<string, any> }> => {
    try {
      const res = await fetch(cmsRequestUrl("/api/our-story/banner"), { cache: 'no-store' });
      const data = await readApiJson(res);
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch our-story banner");
      }
      const banner = data.data?.banner || {};
      return {
        id: "story-hero",
        title: "Story hero",
        type: "Hero section",
        status: "Published",
        updatedAt: banner.updatedAt || new Date().toISOString().slice(0, 10),
        fields: [
          { id: "eyebrow", label: "Hero subtitle", type: "text", value: banner.bannerLabel || "" },
          { id: "headline", label: "H1 headline", type: "text", value: banner.bannerTitle || "" },
          { id: "description", label: "Hero paragraph", type: "textarea", value: banner.bannerDescription || "" },
          { id: "ctaLabel", label: "CTA label", type: "text", value: banner.buttonText || "" },
          { id: "image", label: "Hero image", type: "image", value: banner.bannerImage || "" },
          { id: "showSection", label: "Show section", type: "toggle", value: banner.showSection !== false }
        ],
        content: {
          eyebrow: banner.bannerLabel || "",
          headline: banner.bannerTitle || "",
          description: banner.bannerDescription || "",
          ctaLabel: banner.buttonText || "",
          image: banner.bannerImage || "",
          showSection: banner.showSection !== false
        }
      };
    } catch (err) {
      const fallbackRecord = adminModules.find(m => m.id === "our-story")?.records.find(r => r.id === "story-hero");
      const content: Record<string, any> = {};
      fallbackRecord?.fields.forEach(f => {
        content[f.id] = f.value;
      });
      return {
        id: "story-hero",
        title: "Story hero",
        type: "Hero section",
        status: "Published",
        updatedAt: fallbackRecord?.updatedAt || new Date().toISOString().slice(0, 10),
        fields: fallbackRecord?.fields || [],
        content
      };
    }
  },

  saveOurStoryBanner: async (section: AdminContentRecord): Promise<AdminContentRecord> => {
    const eyebrow = section.fields.find(f => f.id === "eyebrow")?.value || "";
    const headline = section.fields.find(f => f.id === "headline")?.value || "";
    const description = section.fields.find(f => f.id === "description")?.value || "";
    const ctaLabel = section.fields.find(f => f.id === "ctaLabel")?.value || "";
    const image = section.fields.find(f => f.id === "image")?.value || "";
    const showSection = section.fields.find(f => f.id === "showSection")?.value !== false;

    const payload = {
      banner: {
        bannerImage: image,
        bannerLabel: eyebrow,
        bannerTitle: headline,
        bannerDescription: description,
        buttonText: ctaLabel,
        buttonLink: "/our-story",
        showSection
      }
    };

    const session = adminAuthService.getSession();
    const token = session?.token || "";

    const res = await fetch(`/api/our-story/banner`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    const data = await readApiJson(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to save our-story banner");
    }
    return section;
  },

  getOurStoryBeginning: async (): Promise<AdminContentRecord & { content: Record<string, any> }> => {
    try {
      const res = await fetch(cmsRequestUrl("/api/our-story/the-beginning"), { cache: 'no-store' });
      const data = await readApiJson(res);
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch our-story beginning");
      }
      const theBeginning = data.data?.theBeginning || {};
      return {
        id: "story-legacy",
        title: "Legacy split section",
        type: "Split content",
        status: "Published",
        updatedAt: theBeginning.updatedAt || new Date().toISOString().slice(0, 10),
        fields: [
          { id: "eyebrow", label: "Small title", type: "text", value: theBeginning.sectionLabel || "" },
          { id: "heading", label: "Section heading", type: "text", value: theBeginning.sectionTitle || "" },
          { id: "body", label: "Body copy", type: "textarea", value: theBeginning.sectionDescription || "" },
          { id: "image", label: "Section image", type: "image", value: theBeginning.image || "" },
          { id: "showSection", label: "Show section", type: "toggle", value: theBeginning.showSection !== false }
        ],
        content: {
          eyebrow: theBeginning.sectionLabel || "",
          heading: theBeginning.sectionTitle || "",
          body: theBeginning.sectionDescription || "",
          image: theBeginning.image || "",
          showSection: theBeginning.showSection !== false
        }
      };
    } catch (err) {
      const fallbackRecord = adminModules.find(m => m.id === "our-story")?.records.find(r => r.id === "story-legacy");
      const content: Record<string, any> = {};
      fallbackRecord?.fields.forEach(f => {
        content[f.id] = f.value;
      });
      return {
        id: "story-legacy",
        title: "Legacy split section",
        type: "Split content",
        status: "Published",
        updatedAt: fallbackRecord?.updatedAt || new Date().toISOString().slice(0, 10),
        fields: fallbackRecord?.fields || [],
        content
      };
    }
  },

  getOurStoryPhilosophy: async (): Promise<AdminContentRecord & { content: Record<string, any> }> => {
    try {
      const res = await fetch(cmsRequestUrl("/api/our-story/philosophy"), { cache: "no-store" });
      const data = await readApiJson(res);
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch our-story philosophy");
      }
      const philosophy = data.data?.philosophy || {};
      const philosophies = Array.isArray(philosophy.philosophies) ? philosophy.philosophies : [];
      const cards = philosophies.map((p: any) => ({
        icon: p.icon || "",
        title: p.title || "",
        description: p.description || "",
        _id: p._id || undefined
      }));
      return {
        id: "story-philosophy",
        title: "Minimal intervention philosophy",
        type: "Card grid",
        status: "Published" as const,
        updatedAt: philosophy.updatedAt || new Date().toISOString().slice(0, 10),
        fields: [
          { id: "heading", label: "Section heading", type: "text", value: philosophy.sectionTitle || "" },
          { id: "description", label: "Section description", type: "textarea", value: philosophy.sectionDescription || "" },
          { id: "cards", label: "Philosophy cards", type: "textarea", value: cards },
          { id: "showSection", label: "Show section", type: "toggle", value: true }
        ],
        content: {
          heading: philosophy.sectionTitle || "",
          description: philosophy.sectionDescription || "",
          cards,
          showSection: true
        }
      };
    } catch {
      const fallbackRecord = adminModules.find(m => m.id === "our-story")?.records.find(r => r.id === "story-philosophy");
      const content: Record<string, any> = {};
      fallbackRecord?.fields.forEach(f => {
        content[f.id] = f.value;
      });
      return {
        id: "story-philosophy",
        title: "Minimal intervention philosophy",
        type: "Card grid",
        status: "Published" as const,
        updatedAt: fallbackRecord?.updatedAt || new Date().toISOString().slice(0, 10),
        fields: fallbackRecord?.fields || [],
        content
      };
    }
  },

  saveOurStoryBeginning: async (section: AdminContentRecord): Promise<AdminContentRecord> => {
    const eyebrow = section.fields.find(f => f.id === "eyebrow")?.value || "";
    const heading = section.fields.find(f => f.id === "heading")?.value || "";
    const body = section.fields.find(f => f.id === "body")?.value || "";
    const image = section.fields.find(f => f.id === "image")?.value || "";
    const showSection = section.fields.find(f => f.id === "showSection")?.value !== false;

    const payload = {
      theBeginning: {
        sectionLabel: eyebrow,
        sectionTitle: heading,
        sectionDescription: body,
        image,
        showSection
      }
    };

    const session = adminAuthService.getSession();
    const token = session?.token || "";

    const res = await fetch(`/api/our-story/the-beginning`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    const data = await readApiJson(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to save our-story beginning");
    }
    return section;
  },

  getReelsSection: async (): Promise<AdminContentRecord & { content: Record<string, any> }> => {
    try {
      const res = await fetch(cmsRequestUrl("/api/reels-section"), { cache: 'no-store' });
      const data = await readApiJson(res);
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch reels section");
      }
      return data.data;
    } catch {
      const fallbackRecord = adminModules.find(m => m.id === "home")?.records.find(r => r.id === "home-instagram");
      const content: Record<string, any> = {};
      fallbackRecord?.fields.forEach(f => {
        content[f.id] = f.value;
      });
      return {
        id: "home-instagram",
        title: "Instagram Reels section",
        type: "Instagram Reels",
        status: "Published",
        updatedAt: fallbackRecord?.updatedAt || new Date().toISOString().slice(0, 10),
        fields: fallbackRecord?.fields || [],
        content
      };
    }
  },

  saveReelsSection: async (section: AdminContentRecord): Promise<AdminContentRecord> => {
    const session = adminAuthService.getSession();
    const token = session?.token || "";

    const res = await fetch(`/api/reels-section`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(section)
    });
    const data = await readApiJson(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to save reels section");
    }
    return section;
  },

  saveOurStoryPhilosophy: async (section: AdminContentRecord): Promise<AdminContentRecord> => {
    const session = adminAuthService.getSession();
    const token = session?.token || "";

    // Extract fields from AdminContentRecord to philosophy payload
    const fields = section.fields || [];
    const get = (id: string) => fields.find((f: any) => f.id === id)?.value;

    const cardsRaw = get("cards");
    let philosophies: any[] = [];
    if (Array.isArray(cardsRaw)) {
      philosophies = cardsRaw.map((c: any) => ({
        icon: c.icon || "",
        title: c.title || "",
        description: c.description || c.desc || "",
        ...(c._id ? { _id: c._id } : {})
      }));
    }

    const philosophy = {
      sectionTitle: get("heading") || "",
      sectionDescription: get("description") || "",
      philosophies
    };

    const res = await fetch(`/api/our-story/philosophy`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ philosophy })
    });
    const data = await readApiJson(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to save philosophy section");
    }
    return section;
  },

  getOurStoryStewardship: async (): Promise<AdminContentRecord & { content: Record<string, any> }> => {
    try {
      const res = await fetch(cmsRequestUrl("/api/our-story/stewardship"), { cache: "no-store" });
      const data = await readApiJson(res);
      if (!res.ok) throw new Error(data.message || "Failed to fetch stewardship section");
      const stewardship = data.data?.stewardship || {};
      const milestones = Array.isArray(stewardship.milestones) ? stewardship.milestones : [];
      const cleanUrl = (u: string) => (typeof u === "string" ? u.replace(/%22$/, "").replace(/"$/, "").trim() : "");
      const items = milestones.map((m: any) => ({
        year: m.year || "",
        title: m.title || "",
        description: m.description || "",
        image: cleanUrl(m.image || ""),
        _id: m._id || undefined
      }));
      return {
        id: "story-timeline",
        title: "A century of stewardship",
        type: "Timeline",
        status: "Published" as const,
        updatedAt: stewardship.updatedAt || new Date().toISOString().slice(0, 10),
        fields: [
          { id: "heading", label: "Section heading", type: "text", value: stewardship.sectionTitle || "" },
          { id: "milestones", label: "Milestones", type: "textarea", value: items },
          { id: "showSection", label: "Show section", type: "toggle", value: true }
        ],
        content: { heading: stewardship.sectionTitle || "", milestones: items, showSection: true }
      };
    } catch {
      const fallbackRecord = adminModules.find(m => m.id === "our-story")?.records.find(r => r.id === "story-timeline");
      const content: Record<string, any> = {};
      fallbackRecord?.fields.forEach(f => { content[f.id] = f.value; });
      return {
        id: "story-timeline",
        title: "A century of stewardship",
        type: "Timeline",
        status: "Published" as const,
        updatedAt: fallbackRecord?.updatedAt || new Date().toISOString().slice(0, 10),
        fields: fallbackRecord?.fields || [],
        content
      };
    }
  },

  saveOurStoryStewardship: async (section: AdminContentRecord): Promise<AdminContentRecord> => {
    const session = adminAuthService.getSession();
    const token = session?.token || "";
    const fields = section.fields || [];
    const get = (id: string) => fields.find((f: any) => f.id === id)?.value;
    const milestonesRaw = get("milestones") || [];
    const milestones = Array.isArray(milestonesRaw)
      ? milestonesRaw.map((m: any) => ({
          year: m.year || "",
          title: m.title || "",
          description: m.description || "",
          image: m.image || "",
          ...(m._id ? { _id: m._id } : {})
        }))
      : [];
    const stewardship = { sectionTitle: get("heading") || "", milestones };
    const res = await fetch(`/api/our-story/stewardship`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ stewardship })
    });
    const data = await readApiJson(res);
    if (!res.ok) throw new Error(data.message || "Failed to save stewardship section");
    return section;
  },

  getModules: async (): Promise<AdminModule[]> => {
    try {
      const res = await fetch(`${API_URL}/content/modules`, { cache: 'no-store' });
      const data = await readApiJson(res);
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch content modules");
      }
      return mergeContentModules(data.data);
    } catch {
      return adminModules;
    }
  },

  getModuleById: async (id: string): Promise<AdminModule | undefined> => {
    if (id === "our-story") {
      try {
        const res = await fetch(cmsRequestUrl("/api/our-story"), { cache: 'no-store' });
        const data = await readApiJson(res);
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch our-story module");
        }
        return mergeContentModule(data.data, id);
      } catch {
        return mergeContentModule(undefined, id);
      }
    }

    if (id === "about-us") {
      try {
        const res = await fetch(cmsRequestUrl("/api/about-us"), { cache: 'no-store' });
        const data = await readApiJson(res);
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch about-us module");
        }
        return mergeContentModule(data.data, id);
      } catch {
        return mergeContentModule(undefined, id);
      }
    }

    try {
      const res = await fetch(`${API_URL}/content/modules/${id}`, { cache: 'no-store' });
      const data = await readApiJson(res);
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch content module");
      }
      const moduleData = mergeContentModule(data.data, id);

      if (id === "home" && moduleData) {
        try {
          const homeBanner = await adminContentService.getHomeBanner();
          return {
            ...moduleData,
            records: moduleData.records.map(record => (record.id === "home-hero" ? homeBanner : record)),
          };
        } catch {
          return moduleData;
        }
      }

      return moduleData;
    } catch {
      return mergeContentModule(undefined, id);
    }
  },

  getSectionById: async (moduleId: string, sectionId: string): Promise<AdminContentRecord> => {
    const res = await fetch(`${API_URL}/content/modules/${moduleId}/sections/${sectionId}`, { cache: 'no-store' });
    const data = await readApiJson(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch content section");
    }
    return data.data;
  },

  getHomeSection: async (sectionName: string): Promise<AdminContentRecord & { content: Record<string, any> }> => {
    // Always route through the Next.js proxy — never use API_URL directly from the browser
    try {
      const homePage = await adminContentService.getHomePage();
      const section = findHomePageSection(homePage, sectionName);
      if (section) {
        return normalizeHomeSection(sectionName, section);
      }
    } catch (error) {
      if (sectionName === "hero") {
        throw error;
      }
      // For non-hero sections swallow the network error and fall through to mock
    }

    if (sectionName === "hero") {
      return adminContentService.getHomeBanner();
    }

    // Section not found in API response (or API unreachable) — return normalised mock so
    // the admin editor always opens with sensible default values instead of crashing.
    return normalizeHomeSection(sectionName, {});
  },

  saveSection: async (section: AdminContentRecord, moduleId?: string): Promise<AdminContentRecord> => {
    const resolvedModuleId = moduleId || (section.id.includes("-") ? section.id.split("-")[0] : "home");

    if (resolvedModuleId === "home") {
      if (section.id === "home-hero") {
        return adminContentService.saveHomeBanner(section);
      }
      if (section.id === "home-instagram") {
        return adminContentService.saveReelsSection(section);
      }
    }

    const session = adminAuthService.getSession();
    const token = session?.token || "";

    if (resolvedModuleId === "our-story") {
      if (section.id === "story-hero") {
        return adminContentService.saveOurStoryBanner(section);
      }
      if (section.id === "story-legacy") {
        return adminContentService.saveOurStoryBeginning(section);
      }
      if (section.id === "story-philosophy") {
        return adminContentService.saveOurStoryPhilosophy(section);
      }
      if (section.id === "story-timeline") {
        return adminContentService.saveOurStoryStewardship(section);
      }

      const res = await fetch(`/api/our-story`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ section }),
      });
      const data = await readApiJson(res);
      if (!res.ok) {
        throw new Error(data.message || `Failed to save ${section.title} section`);
      }
      return data.data || section;
    }

    if (resolvedModuleId === "about-us") {
      const res = await fetch(`/api/about-us`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ section }),
      });
      const data = await readApiJson(res);
      if (!res.ok) {
        throw new Error(data.message || `Failed to save ${section.title} section`);
      }
      return data.data || section;
    }

    if (resolvedModuleId === "home") {
      // ─── Helper: POST FormData through the Next.js CMS proxy (never direct backend) ───
      const cmsPut = async (path: string, fd: FormData) => {
        const res = await fetch(`/api/cms/${path}`, {
          method: "PUT",
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          // Do NOT set Content-Type — browser auto-sets multipart boundary for FormData
          body: fd,
        });
        const data = await readApiJson(res);
        if (!res.ok) throw new Error(data.message || `Failed to save ${section.title} section`);
        return section;
      };

      // ── Feature Section ──────────────────────────────────────────────────────
      if (section.id === "home-features") {
        const featuresField = section.fields.find(f => f.id === "features");
        let featuresList: Array<{ icon: string; title: string; description: string }>;

        if (Array.isArray(featuresField?.value)) {
          featuresList = (featuresField.value as any[]).map(item => ({
            icon: String(item.icon || "leaf"),
            title: String(item.title || ""),
            description: String(item.description || item.desc || ""),
          }));
        } else {
          const lines = String(featuresField?.value || "").split("\n").filter(Boolean);
          featuresList = lines.map(line => {
            const parts = line.split("|");
            return { icon: "leaf", title: parts[0]?.trim() || "", description: parts[1]?.trim() || "" };
          });
        }

        const fd = new FormData();
        fd.append("features", JSON.stringify(featuresList));
        return cmsPut("feature-section", fd);
      }

      // ── Gift Box Section ─────────────────────────────────────────────────────
      if (section.id === "home-gift-banner") {
        const fd = new FormData();
        fd.append("sectionLabel",       fieldValue(section, "sectionLabel"));
        fd.append("sectionTitle",       fieldValue(section, "sectionTitle"));
        fd.append("sectionDescription", fieldValue(section, "sectionDescription"));
        fd.append("buttonText",         fieldValue(section, "buttonText"));
        fd.append("buttonLink",         fieldValue(section, "buttonLink"));
        // Image is now uploaded on pick and stored as a URL — always send as text field
        fd.append("backgroundImage",    fieldValue(section, "backgroundImage"));
        return cmsPut("gift-box-section", fd);
      }

      // ── Nutrition Highlights Section ─────────────────────────────────────────
      if (section.id === "home-product-details") {
        const fd = new FormData();
        const items = [
          {
            sectionLabel: fieldValue(section, "walnutEyebrow"),
            sectionTitle:   fieldValue(section, "walnutHeading"),
            sectionDescription: fieldValue(section, "walnutDescription"),
            highlights: String(fieldValue(section, "walnutBullets")).split("\n").filter(Boolean),
            image:   fieldValue(section, "walnutImage"),
            imagePosition: "right"
          },
          {
            sectionLabel: fieldValue(section, "almondEyebrow"),
            sectionTitle:   fieldValue(section, "almondHeading"),
            sectionDescription: fieldValue(section, "almondDescription"),
            highlights: String(fieldValue(section, "almondBullets")).split("\n").filter(Boolean),
            image:   fieldValue(section, "almondImage"),
            imagePosition: "left"
          },
        ];
        fd.append("items", JSON.stringify(items));
        return cmsPut("nutrition-highlights-section", fd);
      }

      // ── Heritage Journey / Timeline Section ──────────────────────────────────
      if (section.id === "home-timeline") {
        const fd = new FormData();
        const milestonesField = section.fields.find(f => f.id === "milestones");
        let milestonesList: Array<{ year: string; title: string; description: string; align?: string }>;

        if (Array.isArray(milestonesField?.value)) {
          milestonesList = (milestonesField.value as any[]).map((m, idx) => ({
            year: String(m.year || ""),
            title: String(m.title || ""),
            description: String(m.description || m.desc || ""),
            align: m.align || (idx % 2 === 0 ? "left" : "right")
          }));
        } else {
          const eventsRaw = String(milestonesField?.value || "");
          milestonesList = eventsRaw.split("\n").filter(Boolean).map((line, idx) => {
            const parts = line.split("|");
            const desc = parts[2]?.trim() || "";
            return {
              year:        parts[0]?.trim() || "",
              title:       parts[1]?.trim() || "",
              description: desc,
              align:       parts[3]?.trim() || (idx % 2 === 0 ? "left" : "right")
            };
          });
        }

        fd.append("sectionTitle",       fieldValue(section, "heading"));
        fd.append("sectionDescription", fieldValue(section, "description"));
        fd.append("milestones",         JSON.stringify(milestonesList));
        return cmsPut("heritage-journey-section", fd);
      }

      // ── FAQ Section ──────────────────────────────────────────────────────────
      if (section.id === "home-faq") {
        const fd = new FormData();
        const faqsField = section.fields.find(f => f.id === "faqs");
        let faqsList: Array<{ question: string; answer: string }>;

        if (Array.isArray(faqsField?.value)) {
          faqsList = (faqsField.value as any[]).map(f => ({
            question: String(f.question || ""),
            answer: String(f.answer || "")
          }));
        } else {
          const faqItemsRaw = String(faqsField?.value || "");
          faqsList = faqItemsRaw.split("\n").filter(Boolean)
            .map(line => {
              const parts = line.split("|");
              return { question: parts[0]?.trim() || "", answer: parts[1]?.trim() || "" };
            })
            .filter(f => f.question && f.answer);
        }

        fd.append("sectionTitle", fieldValue(section, "heading"));
        fd.append("faqs",         JSON.stringify(faqsList));
        return cmsPut("faq-section", fd);
      }

      // ── Instagram Section ───────────────────────────────────────────────────
      if (section.id === "home-instagram") {
        const fd = new FormData();
        const reelsField = section.fields.find(f => f.id === "reels");
        let reelsList: Array<{ image: string; link: string; alt: string }>;

        if (Array.isArray(reelsField?.value)) {
          reelsList = (reelsField.value as any[]).map(r => ({
            image: String(r.image || ""),
            link: String(r.link || ""),
            alt: String(r.alt || "")
          }));
        } else {
          const reelsRaw = String(reelsField?.value || "");
          reelsList = reelsRaw.split("\n").filter(Boolean)
            .map(line => {
              const parts = line.split("|");
              return { image: parts[0]?.trim() || "", link: parts[1]?.trim() || "", alt: parts[2]?.trim() || "" };
            });
        }

        fd.append("sectionTitle",    fieldValue(section, "heading"));
        fd.append("sectionSubtitle", fieldValue(section, "description"));
        fd.append("reels",           JSON.stringify(reelsList));
        return cmsPut("instagram-section", fd);
      }
    }

    const res = await fetch(`${API_URL}/content/sections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ moduleId: resolvedModuleId, section }),
    });
    const data = await readApiJson(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to save section");
    }
    return data.data;
  },

  deleteSection: async (sectionId: string, moduleId?: string): Promise<{ id: string }> => {
    const resolvedModuleId = moduleId || (sectionId.includes("-") ? sectionId.split("-")[0] : "home");
    const res = await fetch(`${API_URL}/content/modules/${resolvedModuleId}/sections/${sectionId}`, {
      method: "DELETE",
    });
    const data = await readApiJson(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete section");
    }
    return data.data;
  },

  getProducts: async (): Promise<AdminProductRecord[]> => {
    const res = await fetch(`${API_URL}/products?limit=100&all=true`, { cache: 'no-store' });
    const data = await readApiJson(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }
    const products = data.data || [];
    return products.map((p: any) => {
      const categoryName = typeof p.category === "object" && p.category !== null
        ? (p.category as any).name || ""
        : p.category || "";

      return {
        id: p._id,
        name: p.name,
        category: categoryName,
        status: p.isActive ? "Published" : "Draft",
        price: p.price !== undefined ? `$${p.price.toFixed(2)}` : "",
        defaultSize: p.defaultSize || "",
        rating: p.rating?.number !== undefined ? String(p.rating.number) : (p.ratings?.average !== undefined ? String(p.ratings.average) : ""),
        image: p.images?.[0] || "",
        description: p.description || "",
        badge: p.badge || "",
      };
    });
  },

  saveProduct: async (product: AdminProductRecord): Promise<AdminProductRecord> => {
    const session = adminAuthService.getSession();
    const token = session?.token || "";

    // 1. Fetch categories to find or create the category ID matching product.category name
    const catRes = await fetch("/api/categories", { cache: 'no-store' });
    const catData = await readApiJson(catRes);
    const categoriesList = Array.isArray(catData.data)
      ? catData.data
      : (catData.data?.categories || []);

    let categoryId = "";
    const matchedCat = categoriesList.find(
      (c: any) => c.name.toLowerCase() === product.category.trim().toLowerCase()
    );

    if (matchedCat) {
      categoryId = matchedCat._id;
    } else {
      // Create new category if it doesn't exist yet in backend database
      const newCatSlug = product.category.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const createCatRes = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: product.category.trim(),
          slug: newCatSlug,
          description: `All products related to ${product.category.trim()}`,
        }),
      });
      const createCatData = await readApiJson(createCatRes);
      if (!createCatRes.ok) {
        throw new Error(createCatData.message || "Failed to auto-create category on backend");
      }
      categoryId = createCatData.data._id;
    }

    // Parse values safely
    const priceNum = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0;
    const ratingNum = parseFloat(product.rating) || 5;

    // Prepare Product payload
    const payload = {
      name: product.name,
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: product.description,
      price: priceNum,
      stock: 100,
      images: [product.image].filter(Boolean),
      category: categoryId,
      ratings: {
        average: ratingNum,
        count: 10,
      },
      rating: {
        number: ratingNum,
        total: 10,
      },
      badge: product.badge || "",
      defaultSize: product.defaultSize || "500g",
      sizePrices: {
        [product.defaultSize || "500g"]: priceNum,
      },
      isActive: product.status === "Published",
    };

    const isNew = product.id.startsWith("product-");
    const url = isNew ? `${API_URL}/products` : `${API_URL}/products/${product.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await readApiJson(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to save product on backend");
    }

    const savedProduct = data.data;
    return {
      id: savedProduct._id,
      name: savedProduct.name,
      category: product.category,
      status: savedProduct.isActive ? "Published" : "Draft",
      price: `$${savedProduct.price.toFixed(2)}`,
      defaultSize: savedProduct.defaultSize || "",
      rating: String(savedProduct.rating?.number ?? savedProduct.ratings?.average ?? 5.0),
      image: savedProduct.images?.[0] || "",
      description: savedProduct.description || "",
      badge: savedProduct.badge || "",
    };
  },

  deleteProduct: async (productId: string): Promise<{ id: string }> => {
    const session = adminAuthService.getSession();
    const token = session?.token || "";

    const res = await fetch(`${API_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await readApiJson(res);
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete product on backend");
    }

    return { id: productId };
  },
};
