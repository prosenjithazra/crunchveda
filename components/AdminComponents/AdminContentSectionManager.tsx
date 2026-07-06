/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { AdminContentRecord, AdminModule, AdminSectionField, AdminStatus } from "@/json/mock/admin";
import { adminContentService } from "@/services/admin/contentService";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Alert, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography, Paper, Divider } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AdminBreadcrumb from "./AdminBreadcrumb";
import AdminPageHeader from "./AdminPageHeader";
import { SectionFieldEditor, FeatureItemsEditor, TimelineItemsEditor, FaqItemsEditor, InstagramReelsEditor, PhilosophyItemsEditor, type PhilosophyItem } from "./AdminFormFields";
import { adminModules } from "@/json/mock/admin";

type AdminContentSectionManagerProps = {
  moduleId: string;
  sectionId: string;
};

type JourneyCardItem = {
  title: string;
  description: string;
  image: string;
};

type CharterItem = {
  title: string;
  description: string;
};

const parseJourneyCards = (stepsValue: unknown, imageSetValue: unknown): JourneyCardItem[] => {
  const stepLines = String(stepsValue || "")
    .split("\n")
    .filter(line => line.trim() || line.includes("|"));
  const imageLines = String(imageSetValue || "").split("\n");
  const cardCount = Math.max(stepLines.length, imageLines.filter(Boolean).length, 1);

  return Array.from({ length: cardCount }, (_, index) => {
    const [title = "", description = ""] = (stepLines[index] || "").split("|");
    return {
      title: title.trim(),
      description: description.trim(),
      image: (imageLines[index] || "").trim(),
    };
  });
};

const serializeJourneySteps = (items: JourneyCardItem[]) => {
  return items.map(item => `${item.title.trim()} | ${item.description.trim()}`).join("\n");
};

const serializeJourneyImages = (items: JourneyCardItem[]) => {
  return items.map(item => item.image.trim()).join("\n");
};

const parseCharterItems = (chartersValue: unknown): CharterItem[] => {
  const lines = String(chartersValue || "")
    .split("\n")
    .filter(line => line.trim() || line.includes("|"));

  const items = lines.map(line => {
    const [title = "", description = ""] = line.split("|");
    return {
      title: title.trim(),
      description: description.trim(),
    };
  });

  return items.length > 0 ? items : [{ title: "", description: "" }];
};

const serializeCharterItems = (items: CharterItem[]) => {
  return items.map(item => `${item.title.trim()} | ${item.description.trim()}`).join("\n");
};

export default function AdminContentSectionManager({ moduleId, sectionId }: AdminContentSectionManagerProps) {
  const router = useRouter();
  const [module, setModule] = React.useState<AdminModule | null>(null);
  const [record, setRecord] = React.useState<AdminContentRecord | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [featureItems, setFeatureItems] = React.useState<Array<{ icon: string; title: string; description: string }>>([]);
  const [timelineItems, setTimelineItems] = React.useState<Array<{ year: string; title: string; description: string; image?: string; _id?: string }>>([])
  const [faqItems, setFaqItems] = React.useState<Array<{ question: string; answer: string }>>([]);
  const [reelsItems, setReelsItems] = React.useState<Array<{ image: string; link: string; alt: string }>>([]);
  const [philosophyItems, setPhilosophyItems] = React.useState<PhilosophyItem[]>([]);
  const [journeyCards, setJourneyCards] = React.useState<JourneyCardItem[]>([{ title: "", description: "", image: "" }]);
  const [charterItems, setCharterItems] = React.useState<CharterItem[]>([{ title: "", description: "" }]);

  const [prevParams, setPrevParams] = React.useState({ moduleId, sectionId });
    if (moduleId !== prevParams.moduleId || sectionId !== prevParams.sectionId) {
    setPrevParams({ moduleId, sectionId });
    setLoading(true);
    setLoadError(null);
  }

  React.useEffect(() => {
    let active = true;

    if (moduleId === "our-story" && sectionId === "story-hero") {
      adminContentService
        .getOurStoryBanner()
        .then(ourStoryBanner => {
          if (!active) return;
          setModule({
            id: "our-story",
            title: "Our Story Page",
            route: "/our-story",
            description: "Manage story hero, legacy split section, philosophy cards, stewardship timeline, and final CTA banner.",
            pageType: "Content",
            records: [ourStoryBanner],
          });
          setRecord(ourStoryBanner);
          setLoadError(null);
        })
        .catch(error => {
          if (!active) return;
          const message = error instanceof Error ? error.message : "Failed to load our story banner.";
          toast.error(message);
          setLoadError(message);
          const fallbackRecord = adminModules.find(item => item.id === "our-story")?.records.find(item => item.id === "story-hero") || null;
          setModule({
            id: "our-story",
            title: "Our Story Page",
            route: "/our-story",
            description: "Manage story hero, legacy split section, philosophy cards, stewardship timeline, and final CTA banner.",
            pageType: "Content",
            records: fallbackRecord ? [fallbackRecord] : [],
          });
          setRecord(fallbackRecord);
        })
        .finally(() => {
          if (active) {
            setLoading(false);
          }
        });

      return () => {
        active = false;
      };
    }

    if (moduleId === "our-story" && sectionId === "story-legacy") {
      adminContentService
        .getOurStoryBeginning()
        .then(ourStoryBeginning => {
          if (!active) return;
          setModule({
            id: "our-story",
            title: "Our Story Page",
            route: "/our-story",
            description: "Manage story hero, legacy split section, philosophy cards, stewardship timeline, and final CTA banner.",
            pageType: "Content",
            records: [ourStoryBeginning],
          });
          setRecord(ourStoryBeginning);
          setLoadError(null);
        })
        .catch(error => {
          if (!active) return;
          const message = error instanceof Error ? error.message : "Failed to load our story beginning section.";
          toast.error(message);
          setLoadError(message);
          const fallbackRecord = adminModules.find(item => item.id === "our-story")?.records.find(item => item.id === "story-legacy") || null;
          setModule({
            id: "our-story",
            title: "Our Story Page",
            route: "/our-story",
            description: "Manage story hero, legacy split section, philosophy cards, stewardship timeline, and final CTA banner.",
            pageType: "Content",
            records: fallbackRecord ? [fallbackRecord] : [],
          });
          setRecord(fallbackRecord);
        })
        .finally(() => {
          if (active) {
            setLoading(false);
          }
        });

      return () => {
        active = false;
      };
    }

    if (moduleId === "our-story" && sectionId === "story-philosophy") {
      adminContentService
        .getOurStoryPhilosophy()
        .then(philosophySection => {
          if (!active) return;
          setModule({
            id: "our-story",
            title: "Our Story Page",
            route: "/our-story",
            description: "Manage story hero, legacy split section, philosophy cards, stewardship timeline, and final CTA banner.",
            pageType: "Content",
            records: [philosophySection],
          });
          setRecord(philosophySection);
          setLoadError(null);

          const cardsField = philosophySection.fields?.find(f => f.id === "cards");
          if (cardsField && Array.isArray(cardsField.value) && (cardsField.value as any[]).length > 0) {
            setPhilosophyItems(
              (cardsField.value as any[]).map((item: any) => ({
                icon: item.icon || "🌿",
                title: item.title || "",
                description: item.description || "",
                _id: item._id,
              }))
            );
          } else {
            setPhilosophyItems([
              { icon: "🌿", title: "Biodynamic Balance", description: "Aligning harvests close with celestial cycles to ensure the highest potential energy and energetic purity." },
              { icon: "🌿", title: "Pure Sourcing", description: "Only 2% of global harvests meet our criteria for soil cleanliness, mineral depth, and certified pure origin." },
              { icon: "🌿", title: "Artisanal Curation", description: "Every batch is hand-inspected, air-cured slowly, and packed in protective glass to preserve the sensory richness." }
            ]);
          }
        })
        .catch(error => {
          if (!active) return;
          const message = error instanceof Error ? error.message : "Failed to load philosophy section.";
          toast.error(message);
          setLoadError(message);
          const fallbackRecord = adminModules.find(item => item.id === "our-story")?.records.find(item => item.id === "story-philosophy") || null;
          setModule({
            id: "our-story",
            title: "Our Story Page",
            route: "/our-story",
            description: "Manage story hero, legacy split section, philosophy cards, stewardship timeline, and final CTA banner.",
            pageType: "Content",
            records: fallbackRecord ? [fallbackRecord] : [],
          });
          setRecord(fallbackRecord);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }

    if (moduleId === "our-story" && sectionId === "story-timeline") {
      adminContentService
        .getOurStoryStewardship()
        .then(stewardshipSection => {
          if (!active) return;
          setModule({
            id: "our-story",
            title: "Our Story Page",
            route: "/our-story",
            description: "Manage story hero, legacy split section, philosophy cards, stewardship timeline, and final CTA banner.",
            pageType: "Content",
            records: [stewardshipSection],
          });
          setRecord(stewardshipSection);
          setLoadError(null);

          const milestonesField = stewardshipSection.fields?.find(f => f.id === "milestones");
          if (milestonesField && Array.isArray(milestonesField.value) && (milestonesField.value as any[]).length > 0) {
            setTimelineItems(milestonesField.value as Array<{ year: string; title: string; description: string; image?: string; _id?: string }>);
          } else {
            setTimelineItems([
              { year: "1924", title: "The Founding Soil", description: "The first 40 acres are purchased.", image: "" },
              { year: "1968", title: "Organic Pioneer", description: "Become certified organic.", image: "" },
              { year: "2024", title: "The Global Standard", description: "Actively today, we continue to redefine the standards.", image: "" }
            ]);
          }
        })
        .catch(error => {
          if (!active) return;
          const message = error instanceof Error ? error.message : "Failed to load stewardship section.";
          toast.error(message);
          setLoadError(message);
          const fallbackRecord = adminModules.find(item => item.id === "our-story")?.records.find(item => item.id === "story-timeline") || null;
          setModule({
            id: "our-story",
            title: "Our Story Page",
            route: "/our-story",
            description: "Manage story hero, legacy split section, philosophy cards, stewardship timeline, and final CTA banner.",
            pageType: "Content",
            records: fallbackRecord ? [fallbackRecord] : [],
          });
          setRecord(fallbackRecord);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }

    if (moduleId === "home" && sectionId === "home-hero") {
      adminContentService
        .getHomeBanner()
        .then(homeBanner => {
          if (!active) return;
          setModule({
            id: "home",
            title: "Homepage",
            route: "/",
            description: "Manage the homepage banner from the CMS home banner API.",
            pageType: "Content",
            records: [homeBanner],
          });
          setRecord(homeBanner);
          setLoadError(null);
        })
        .catch(error => {
          if (!active) return;
          const message = error instanceof Error ? error.message : "Failed to load home banner.";
          toast.error(message);
          setLoadError(message);
          const fallbackRecord = adminModules.find(item => item.id === "home")?.records.find(item => item.id === "home-hero") || null;
          setModule({
            id: "home",
            title: "Homepage",
            route: "/",
            description: "Manage the homepage banner from the CMS home banner API.",
            pageType: "Content",
            records: fallbackRecord ? [fallbackRecord] : [],
          });
          setRecord(fallbackRecord);
        })
        .finally(() => {
          if (active) {
            setLoading(false);
          }
        });

      return () => {
        active = false;
      };
    }

    // Load the Features section directly from the CMS API so the editor is seeded with live data
    if (moduleId === "home" && sectionId === "home-features") {
      const fallbackModule = adminModules.find(m => m.id === "home") || { id: "home", title: "Homepage", description: "Homepage CMS", route: "/", pageType: "Content" as const, records: [] };

      adminContentService
        .getHomeSection("features")
        .then(featSection => {
          if (!active) return;
          setModule({ ...fallbackModule, records: [featSection] });
          setRecord(featSection);
          setLoadError(null);

          const featField = featSection.fields?.find(f => f.id === "features");
          if (featField && Array.isArray(featField.value) && (featField.value as any[]).length > 0) {
            setFeatureItems(featField.value as Array<{ icon: string; title: string; description: string }>);
          } else {
            setFeatureItems([
              { icon: "leaf",        title: "100% Organic",     description: "Sourced from certified organic farms committed to sustainable heritage agriculture." },
              { icon: "badge-check", title: "Premium Quality",  description: "Every batch undergoes rigorous quality checks for size, freshness, and nutrient density." },
              { icon: "truck",       title: "Eco-Fast Delivery",description: "Sustainable carbon-neutral shipping ensures your health arrives at your doorstep swiftly." },
              { icon: "package",     title: "Artisanal Packing",description: "Breathable, eco-friendly packaging designed to maintain crunch and essential oils." },
            ]);
          }
        })
        .catch(error => {
          if (!active) return;
          const message = error instanceof Error ? error.message : "Failed to load features section.";
          toast.error(message);
          setLoadError(message);
          const fallbackRecord = fallbackModule.records.find(r => r.id === "home-features") || null;
          setModule({ ...fallbackModule, records: fallbackRecord ? [fallbackRecord] : [] });
          setRecord(fallbackRecord);
          setFeatureItems([
            { icon: "leaf",        title: "100% Organic",     description: "Sourced from certified organic farms committed to sustainable heritage agriculture." },
            { icon: "badge-check", title: "Premium Quality",  description: "Every batch undergoes rigorous quality checks for size, freshness, and nutrient density." },
            { icon: "truck",       title: "Eco-Fast Delivery",description: "Sustainable carbon-neutral shipping ensures your health arrives at your doorstep swiftly." },
            { icon: "package",     title: "Artisanal Packing",description: "Breathable, eco-friendly packaging designed to maintain crunch and essential oils." },
          ]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => { active = false; };
    }

    // Load the Gift Banner section directly from the CMS API
    if (moduleId === "home" && sectionId === "home-gift-banner") {
      const fallbackModule = adminModules.find(m => m.id === "home") || { id: "home", title: "Homepage", description: "Homepage CMS", route: "/", pageType: "Content" as const, records: [] };

      adminContentService
        .getHomeSection("gift-banner")
        .then(giftSection => {
          if (!active) return;
          setModule({ ...fallbackModule, records: [giftSection] });
          setRecord(giftSection);
          setLoadError(null);
        })
        .catch(error => {
          if (!active) return;
          const message = error instanceof Error ? error.message : "Failed to load gift banner section.";
          toast.error(message);
          setLoadError(message);
          const fallbackRecord = fallbackModule.records.find(r => r.id === "home-gift-banner") || null;
          setModule({ ...fallbackModule, records: fallbackRecord ? [fallbackRecord] : [] });
          setRecord(fallbackRecord);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => { active = false; };
    }

    // Load the Product Details section directly from the CMS API
    if (moduleId === "home" && sectionId === "home-product-details") {
      const fallbackModule = adminModules.find(m => m.id === "home") || { id: "home", title: "Homepage", description: "Homepage CMS", route: "/", pageType: "Content" as const, records: [] };

      adminContentService
        .getHomeSection("product-details")
        .then(prodSection => {
          if (!active) return;
          setModule({ ...fallbackModule, records: [prodSection] });
          setRecord(prodSection);
          setLoadError(null);
        })
        .catch(error => {
          if (!active) return;
          const message = error instanceof Error ? error.message : "Failed to load product details section.";
          toast.error(message);
          setLoadError(message);
          const fallbackRecord = fallbackModule.records.find(r => r.id === "home-product-details") || null;
          setModule({ ...fallbackModule, records: fallbackRecord ? [fallbackRecord] : [] });
          setRecord(fallbackRecord);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => { active = false; };
    }

    // Load the Timeline section directly from the CMS API
    if (moduleId === "home" && sectionId === "home-timeline") {
      const fallbackModule = adminModules.find(m => m.id === "home") || { id: "home", title: "Homepage", description: "Homepage CMS", route: "/", pageType: "Content" as const, records: [] };

      adminContentService
        .getHomeSection("timeline")
        .then(timelineSection => {
          if (!active) return;
          setModule({ ...fallbackModule, records: [timelineSection] });
          setRecord(timelineSection);
          setLoadError(null);

          const milestonesField = timelineSection.fields?.find(f => f.id === "milestones");
          if (milestonesField && Array.isArray(milestonesField.value) && (milestonesField.value as any[]).length > 0) {
            setTimelineItems(milestonesField.value as Array<{ year: string; title: string; description: string }>);
          } else {
            setTimelineItems([
              { year: "1994", title: "The Seed is Sown", description: "Founded as a small family orchard in the foothills, focused on traditional farming methods." },
              { year: "2008", title: "Organic Certification", description: "One of the first in the region to achieve global 100% organic certification for all our produce." },
              { year: "2024", title: "NutriHarvest Global", description: "Launching our digital experience to deliver premium health directly to your doorstep worldwide." },
            ]);
          }
        })
        .catch(error => {
          if (!active) return;
          const message = error instanceof Error ? error.message : "Failed to load timeline section.";
          toast.error(message);
          setLoadError(message);
          const fallbackRecord = fallbackModule.records.find(r => r.id === "home-timeline") || null;
          setModule({ ...fallbackModule, records: fallbackRecord ? [fallbackRecord] : [] });
          setRecord(fallbackRecord);
          setTimelineItems([
            { year: "1994", title: "The Seed is Sown", description: "Founded as a small family orchard in the foothills, focused on traditional farming methods." },
            { year: "2008", title: "Organic Certification", description: "One of the first in the region to achieve global 100% organic certification for all our produce." },
            { year: "2024", title: "NutriHarvest Global", description: "Launching our digital experience to deliver premium health directly to your doorstep worldwide." },
          ]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => { active = false; };
    }

    // Load the FAQ section directly from the CMS API
    if (moduleId === "home" && sectionId === "home-faq") {
      const fallbackModule = adminModules.find(m => m.id === "home") || { id: "home", title: "Homepage", description: "Homepage CMS", route: "/", pageType: "Content" as const, records: [] };

      adminContentService
        .getHomeSection("faq")
        .then(faqSection => {
          if (!active) return;
          setModule({ ...fallbackModule, records: [faqSection] });
          setRecord(faqSection);
          setLoadError(null);

          const faqsField = faqSection.fields?.find(f => f.id === "faqs");
          if (faqsField && Array.isArray(faqsField.value) && (faqsField.value as any[]).length > 0) {
            setFaqItems(faqsField.value as Array<{ question: string; answer: string }>);
          } else {
            setFaqItems([
              { question: "How do you ensure the freshness of your dry fruits?", answer: "We source directly from selected farms during peak harvest season." },
              { question: "Are your products completely organic?", answer: "Yes, our entire curated selection is 100% organic and pesticide-free." },
              { question: "What is your shipping policy?", answer: "Orders are processed within 24 hours and delivery typically takes 2-4 business days." }
            ]);
          }
        })
        .catch(error => {
          if (!active) return;
          const message = error instanceof Error ? error.message : "Failed to load FAQ section.";
          toast.error(message);
          setLoadError(message);
          const fallbackRecord = fallbackModule.records.find(r => r.id === "home-faq") || null;
          setModule({ ...fallbackModule, records: fallbackRecord ? [fallbackRecord] : [] });
          setRecord(fallbackRecord);
          setFaqItems([
            { question: "How do you ensure the freshness of your dry fruits?", answer: "We source directly from selected farms during peak harvest season." },
            { question: "Are your products completely organic?", answer: "Yes, our entire curated selection is 100% organic and pesticide-free." },
            { question: "What is your shipping policy?", answer: "Orders are processed within 24 hours and delivery typically takes 2-4 business days." }
          ]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => { active = false; };
    }

    // Load the Instagram section directly from the CMS API
    if (moduleId === "home" && sectionId === "home-instagram") {
      const fallbackModule = adminModules.find(m => m.id === "home") || { id: "home", title: "Homepage", description: "Homepage CMS", route: "/", pageType: "Content" as const, records: [] };

      adminContentService
        .getReelsSection()
        .then(instagramSection => {
          if (!active) return;
          setModule({ ...fallbackModule, records: [instagramSection] });
          setRecord(instagramSection);
          setLoadError(null);

          const reelsField = instagramSection.fields?.find(f => f.id === "reels");
          let loadedReels: any[] = [];
          if (reelsField?.value) {
            if (Array.isArray(reelsField.value)) {
              loadedReels = reelsField.value;
            } else {
              try {
                loadedReels = JSON.parse(String(reelsField.value));
              } catch {
                loadedReels = String(reelsField.value).split("\n").filter(Boolean).map(line => {
                  const parts = line.split("|");
                  return { image: parts[0]?.trim() || "", link: parts[1]?.trim() || "", alt: parts[2]?.trim() || "" };
                });
              }
            }
          }
          if (Array.isArray(loadedReels) && loadedReels.length > 0) {
            setReelsItems(loadedReels);
          } else {
            setReelsItems([
              { image: "/assets/instagram_1.png", link: "https://instagram.com", alt: "Smoothie bowl breakfast" },
              { image: "/assets/instagram_2.png", link: "https://instagram.com", alt: "Pouring walnuts into jar" },
              { image: "/assets/instagram_3.png", link: "https://instagram.com", alt: "Citrus fruits flat lay" },
              { image: "/assets/instagram_4.png", link: "https://instagram.com", alt: "Stacked roasted cashews" }
            ]);
          }
        })
        .catch(error => {
          if (!active) return;
          const message = error instanceof Error ? error.message : "Failed to load Instagram section.";
          toast.error(message);
          setLoadError(message);
          const fallbackRecord = fallbackModule.records.find(r => r.id === "home-instagram") || null;
          setModule({ ...fallbackModule, records: fallbackRecord ? [fallbackRecord] : [] });
          setRecord(fallbackRecord);

          const reelsField = fallbackRecord?.fields?.find(f => f.id === "reels");
          let loadedReels: any[] = [];
          if (reelsField?.value) {
            if (Array.isArray(reelsField.value)) {
              loadedReels = reelsField.value;
            } else {
              try {
                loadedReels = JSON.parse(String(reelsField.value));
              } catch {
                loadedReels = String(reelsField.value).split("\n").filter(Boolean).map(line => {
                  const parts = line.split("|");
                  return { image: parts[0]?.trim() || "", link: parts[1]?.trim() || "", alt: parts[2]?.trim() || "" };
                });
              }
            }
          }
          setReelsItems(loadedReels.length > 0 ? loadedReels : [
            { image: "/assets/instagram_1.png", link: "https://instagram.com", alt: "Smoothie bowl breakfast" },
            { image: "/assets/instagram_2.png", link: "https://instagram.com", alt: "Pouring walnuts into jar" },
            { image: "/assets/instagram_3.png", link: "https://instagram.com", alt: "Citrus fruits flat lay" },
            { image: "/assets/instagram_4.png", link: "https://instagram.com", alt: "Stacked roasted cashews" }
          ]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => { active = false; };
    }

    adminContentService.getModuleById(moduleId).then(data => {
      if (active) {
        if (data) {
          setModule(data);
          const rec = data.records.find(r => r.id === sectionId);
          if (rec) {
            setRecord(rec);
            setLoadError(null);
            // Seed featureItems from the features field if it is an array
            if (rec.id === "home-features") {
              const featField = rec.fields.find(f => f.id === "features");
              if (featField && Array.isArray(featField.value)) {
                setFeatureItems(featField.value as Array<{ icon: string; title: string; description: string }>);
              } else {
                setFeatureItems([
                  { icon: "leaf", title: "100% Organic", description: "Sourced from certified organic farms committed to sustainable heritage agriculture." },
                  { icon: "badge-check", title: "Premium Quality", description: "Every batch undergoes rigorous quality checks for size, freshness, and nutrient density." },
                  { icon: "truck", title: "Eco-Fast Delivery", description: "Sustainable carbon-neutral shipping ensures your health arrives at your doorstep swiftly." },
                  { icon: "package", title: "Artisanal Packing", description: "Breathable, eco-friendly packaging designed to maintain crunch and essential oils." },
                ]);
              }
            }
            if (rec.id === "about-journey") {
              const stepsField = rec.fields.find(f => f.id === "steps");
              const imageSetField = rec.fields.find(f => f.id === "imageSet");
              setJourneyCards(parseJourneyCards(stepsField?.value, imageSetField?.value));
            }
            if (rec.id === "about-charter") {
              const chartersField = rec.fields.find(f => f.id === "charters");
              setCharterItems(parseCharterItems(chartersField?.value));
            }
          }
        }
        setLoading(false);
      }
    }).catch(error => {
      if (!active) return;
      const message = error instanceof Error ? error.message : "Failed to load section editor.";
      toast.error(message);
      setLoadError(message);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [moduleId, sectionId]);

  const handleFieldChange = (field: AdminSectionField) => {
    setRecord(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        fields: prev.fields.map(item => (item.id === field.id ? field : item)),
      };
    });
  };

  const handleMetaChange = (key: "title" | "type" | "status", value: string) => {
    setRecord(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!record) return;

    if (!record.title.trim()) {
      toast.error("Section title is required.");
      return;
    }

    try {
      // Merge featureItems back into the record fields before saving
      let recordToSave = record;
      if (record.id === "home-features") {
        recordToSave = {
          ...record,
          fields: record.fields.map(f =>
            f.id === "features" ? { ...f, value: featureItems as any } : f
          ),
        };
      } else if (record.id === "home-timeline") {
        recordToSave = {
          ...record,
          fields: record.fields.map(f =>
            f.id === "milestones" ? { ...f, value: timelineItems as any } : f
          ),
        };
      } else if (record.id === "home-faq") {
        recordToSave = {
          ...record,
          fields: record.fields.map(f =>
            f.id === "faqs" ? { ...f, value: faqItems as any } : f
          ),
        };
      } else if (record.id === "home-instagram") {
        recordToSave = {
          ...record,
          fields: record.fields.map(f =>
            f.id === "reels" ? { ...f, value: reelsItems as any } : f
          ),
        };
      } else if (record.id === "story-philosophy") {
        recordToSave = {
          ...record,
          fields: record.fields.map(f =>
            f.id === "cards" ? { ...f, value: philosophyItems as any } : f
          ),
        };
      } else if (record.id === "story-timeline") {
        recordToSave = {
          ...record,
          fields: record.fields.map(f =>
            f.id === "milestones" ? { ...f, value: timelineItems as any } : f
          ),
        };
      } else if (record.id === "about-journey") {
        recordToSave = {
          ...record,
          fields: record.fields.map(f => {
            if (f.id === "steps") {
              return { ...f, value: serializeJourneySteps(journeyCards) } as AdminSectionField;
            }
            if (f.id === "imageSet") {
              return { ...f, value: serializeJourneyImages(journeyCards) } as AdminSectionField;
            }
            return f;
          }),
        };
      } else if (record.id === "about-charter") {
        recordToSave = {
          ...record,
          fields: record.fields.map(f =>
            f.id === "charters" ? { ...f, value: serializeCharterItems(charterItems) } as AdminSectionField : f
          ),
        };
      }
      const saved = await adminContentService.saveSection(recordToSave, moduleId);
      setRecord(saved);
      toast.success(`"${record.title}" saved successfully.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save section.";
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <Typography variant="body1">Loading section editor...</Typography>
      </Box>
    );
  }

  if (!module || !record) {
    return (
      <>
        <AdminBreadcrumb items={[{ label: "Content" }, { label: "Not found" }]} />
        <AdminPageHeader title="Section not found" description="This section does not exist in this module." />
      </>
    );
  }

  return (
    <Box component="form" onSubmit={handleSave}>
      <AdminBreadcrumb
        items={[
          { label: "Content" },
          { label: module.title },
          { label: record.title }
        ]}
      />
      <AdminPageHeader
        title={record.title}
        description={`Edit configuration and fields for the ${record.title} section.`}
      >
        <Box sx={{ px: 1.5, py: 1, borderRadius: 2, bgcolor: "customColors.lightCream" }}>
          <Typography variant="caption" color="text.secondary">
            Module: {module.title} | Route: {module.route}
          </Typography>
        </Box>
      </AdminPageHeader>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          mt: 3,
          border: 1,
          borderColor: "divider",
          borderRadius: 2.5,
          bgcolor: "background.paper",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        {loadError && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {loadError}
          </Alert>
        )}

        <Stack spacing={3} sx={{ mb: 4 }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                required
                label="Section title"
                value={record.title}
                onChange={event => handleMetaChange("title", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Content type"
                value={record.type}
                onChange={event => handleMetaChange("type", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={record.status}
                  onChange={event => handleMetaChange("status", event.target.value as AdminStatus)}
                >
                  <MenuItem value="Published">Published</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={3}>
          {(record.id === "home-categories" || record.id === "categories-grid") && (
            <Box sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 2, bgcolor: "customColors.lightCream", textAlign: "center" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Database-Driven Categories
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The category cards displayed on this section are pulled dynamically from the database categories collection. You can manage them directly under the main Categories CRUD page.
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push("/admin/categories")}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Go to Categories Manager
              </Button>
            </Box>
          )}

          {record.id === "home-best-selling" && (
            <Box sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 2, bgcolor: "customColors.lightCream", textAlign: "center" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Database-Driven Bestsellers
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The bestseller products are managed dynamically. You can promote products to bestseller status or demote them directly on the bestseller management page.
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push("/admin/bestsellers")}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Go to Bestseller Manager
              </Button>
            </Box>
          )}

          {record.id === "home-features" && (
            <FeatureItemsEditor
              value={featureItems}
              onChange={setFeatureItems}
            />
          )}

          {record.id === "home-timeline" && (
            <TimelineItemsEditor
              value={timelineItems}
              onChange={setTimelineItems}
            />
          )}

          {record.id === "home-faq" && (
            <FaqItemsEditor
              value={faqItems}
              onChange={setFaqItems}
            />
          )}

          {record.id === "home-instagram" && (
            <InstagramReelsEditor
              value={reelsItems}
              onChange={setReelsItems}
            />
          )}

          {record.id === "story-philosophy" && (
            <>
              {record.fields
                .filter(f => f.id === "heading" || f.id === "description" || f.id === "showSection")
                .map(field => (
                  <Box key={field.id}>
                    <SectionFieldEditor field={field} onChange={handleFieldChange} />
                  </Box>
                ))
              }
              <PhilosophyItemsEditor
                value={philosophyItems}
                onChange={setPhilosophyItems}
              />
            </>
          )}

          {record.id === "story-timeline" && (
            <>
              {record.fields
                .filter(f => f.id === "heading" || f.id === "showSection")
                .map(field => (
                  <Box key={field.id}>
                    <SectionFieldEditor field={field} onChange={handleFieldChange} />
                  </Box>
                ))
              }
              <TimelineItemsEditor
                value={timelineItems}
                onChange={setTimelineItems}
              />
            </>
          )}

          {record.id === "about-journey" && (
            <>
              {record.fields
                .filter(f => f.id === "eyebrow" || f.id === "heading" || f.id === "showSection")
                .map(field => (
                  <Box key={field.id}>
                    <SectionFieldEditor field={field} onChange={handleFieldChange} />
                  </Box>
                ))
              }
              <Stack spacing={2}>
                <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Journey Cards
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {journeyCards.length} card{journeyCards.length !== 1 ? "s" : ""}
                  </Typography>
                </Stack>

                {journeyCards.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      border: "1.5px solid",
                      borderColor: "divider",
                      borderRadius: 2.5,
                      overflow: "hidden",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{
                        alignItems: "center",
                        px: 2,
                        py: 1.2,
                        bgcolor: "action.hover",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          mr: 1.5,
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                        {item.title || `Journey Card ${index + 1}`}
                      </Typography>
                      {journeyCards.length > 1 && (
                        <Button
                          type="button"
                          color="error"
                          variant="outlined"
                          size="small"
                          onClick={() => setJourneyCards(prev => prev.filter((_, itemIndex) => itemIndex !== index))}
                          sx={{ textTransform: "none", borderRadius: 2 }}
                        >
                          Remove
                        </Button>
                      )}
                    </Stack>

                    <Stack spacing={2} sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Card title"
                            value={item.title}
                            onChange={event => setJourneyCards(prev => prev.map((card, itemIndex) => (
                              itemIndex === index ? { ...card, title: event.target.value } : card
                            )))}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Image URL"
                            value={item.image}
                            onChange={event => setJourneyCards(prev => prev.map((card, itemIndex) => (
                              itemIndex === index ? { ...card, image: event.target.value } : card
                            )))}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Card description"
                            value={item.description}
                            onChange={event => setJourneyCards(prev => prev.map((card, itemIndex) => (
                              itemIndex === index ? { ...card, description: event.target.value } : card
                            )))}
                            multiline
                            minRows={2}
                          />
                        </Grid>
                      </Grid>
                    </Stack>
                  </Box>
                ))}

                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => setJourneyCards(prev => [...prev, { title: "", description: "", image: "" }])}
                  sx={{ textTransform: "none", borderRadius: 2, alignSelf: "flex-start" }}
                >
                  Add Journey Card
                </Button>
              </Stack>
            </>
          )}

          {record.id === "about-charter" && (
            <>
              {record.fields
                .filter(f => f.id === "heading" || f.id === "description" || f.id === "reportLabel" || f.id === "reportHref" || f.id === "showSection")
                .map(field => (
                  <Box key={field.id}>
                    <SectionFieldEditor field={field} onChange={handleFieldChange} />
                  </Box>
                ))
              }
              <Stack spacing={2}>
                <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Charter Items
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {charterItems.length} item{charterItems.length !== 1 ? "s" : ""}
                  </Typography>
                </Stack>

                {charterItems.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      border: "1.5px solid",
                      borderColor: "divider",
                      borderRadius: 2.5,
                      overflow: "hidden",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{
                        alignItems: "center",
                        px: 2,
                        py: 1.2,
                        bgcolor: "action.hover",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          mr: 1.5,
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                        {item.title || `Charter Item ${index + 1}`}
                      </Typography>
                      {charterItems.length > 1 && (
                        <Button
                          type="button"
                          color="error"
                          variant="outlined"
                          size="small"
                          onClick={() => setCharterItems(prev => prev.filter((_, itemIndex) => itemIndex !== index))}
                          sx={{ textTransform: "none", borderRadius: 2 }}
                        >
                          Remove
                        </Button>
                      )}
                    </Stack>

                    <Stack spacing={2} sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 5 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Item title"
                            value={item.title}
                            onChange={event => setCharterItems(prev => prev.map((charter, itemIndex) => (
                              itemIndex === index ? { ...charter, title: event.target.value } : charter
                            )))}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 7 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Item description"
                            value={item.description}
                            onChange={event => setCharterItems(prev => prev.map((charter, itemIndex) => (
                              itemIndex === index ? { ...charter, description: event.target.value } : charter
                            )))}
                            multiline
                            minRows={2}
                          />
                        </Grid>
                      </Grid>
                    </Stack>
                  </Box>
                ))}

                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => setCharterItems(prev => [...prev, { title: "", description: "" }])}
                  sx={{ textTransform: "none", borderRadius: 2, alignSelf: "flex-start" }}
                >
                  Add Charter Item
                </Button>
              </Stack>
            </>
          )}

          {record.id !== "home-features" && record.id !== "home-timeline" && record.id !== "home-faq" && record.id !== "home-instagram" && record.id !== "story-philosophy" && record.id !== "story-timeline" && record.id !== "about-journey" && record.id !== "about-charter" && record.fields
            .filter(field => {
              if (record.id === "home-categories" || record.id === "categories-grid") {
                return field.id !== "cards" && field.id !== "imageSet";
              }
              if (record.id === "home-best-selling") {
                return field.id !== "products" && field.id !== "viewAllLabel" && field.id !== "viewAllHref";
              }
              if (record.id === "home-instagram") {
                return field.id !== "reels";
              }
              return true;
            })
            .map(field => (
              <Box key={field.id}>
                <SectionFieldEditor
                  field={field}
                  onChange={handleFieldChange}
                />
              </Box>
            ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<SaveRoundedIcon />}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Save changes
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
