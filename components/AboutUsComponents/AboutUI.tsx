"use client";

import React from "react";
import { AboutWrapper } from "@/styles/StyledComponents/AboutWrapper";
import AboutBanner from "./AboutBanner";
import StewardshipSection from "./StewardshipSection";
import ArtisanalJourney from "./ArtisanalJourney";
import QuoteSection from "./QuoteSection";
import SustainabilityCharter from "./SustainabilityCharter";

import { useQuery } from "@tanstack/react-query";
import {
  AboutBannerSkeleton,
  StewardshipSectionSkeleton,
  ArtisanalJourneySkeleton,
  QuoteSectionSkeleton,
  SustainabilityCharterSkeleton,
} from "../Loader/SectionSkeletons";

type CmsField = {
  id: string;
  value: unknown;
};

type CmsRecord = {
  id: string;
  fields?: CmsField[];
};

const getFieldValue = (record: CmsRecord | undefined, fieldId: string) => {
  const value = record?.fields?.find((field) => field.id === fieldId)?.value;
  return typeof value === "string" || typeof value === "boolean" ? value : "";
};

const getSectionValue = (
  record: CmsRecord | undefined,
  sectionData: Record<string, unknown> | undefined,
  fieldId: string,
  directKeys: string[] = [fieldId],
) => {
  const fieldValue = getFieldValue(record, fieldId);
  if (fieldValue !== "") return fieldValue;

  for (const key of directKeys) {
    const value = sectionData?.[key];
    if (typeof value === "string" || typeof value === "boolean") return value;
  }

  return "";
};

const isSectionVisible = (
  record: CmsRecord | undefined,
  sectionData: Record<string, unknown> | undefined,
) => {
  return getSectionValue(record, sectionData, "showSection") !== false;
};

export default function AboutUI() {
  const { data: aboutRes, isLoading } = useQuery({
    queryKey: ["about-us"],
    queryFn: async () => {
      const res = await fetch("/api/about-us", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch about-us page");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <AboutWrapper>
        <AboutBannerSkeleton />
        <StewardshipSectionSkeleton />
        <ArtisanalJourneySkeleton />
        <QuoteSectionSkeleton />
        <SustainabilityCharterSkeleton />
      </AboutWrapper>
    );
  }

  const payload = aboutRes?.data?.aboutUs || aboutRes?.data?.about_us || aboutRes?.data?.aboutUsPage || aboutRes?.data || {};
  const records: CmsRecord[] = Array.isArray(payload?.records) ? payload.records : [];
  const bannerRecord = records.find((record) => record.id === "about-banner");
  const stewardshipRecord = records.find(
    (record) =>
      record.id === "about-stewardship" || record.id === "about-roots",
  );
  const journeyRecord = records.find((record) => record.id === "about-journey");
  const quoteRecord = records.find((record) => record.id === "about-quote");
  const charterRecord = records.find((record) => record.id === "about-charter");
  const bannerData = payload?.banner;
  const stewardshipData = payload?.stewardship || payload?.roots;
  const journeyData = payload?.journey;
  const quoteData = payload?.quote;
  const charterData = payload?.charter;

  return (
    <AboutWrapper>
      <AboutBanner
        data={{
          bannerImage: String(getSectionValue(bannerRecord, bannerData, "image", ["bannerImage", "image"]) || ""),
          bannerLabel: String(getSectionValue(bannerRecord, bannerData, "eyebrow", ["bannerLabel", "eyebrow"]) || ""),
          bannerTitle: String(getSectionValue(bannerRecord, bannerData, "headline", ["bannerTitle", "headline"]) || ""),
          bannerDescription: String(
            getSectionValue(bannerRecord, bannerData, "description", ["bannerDescription", "description"]) || "",
          ),
          showSection: isSectionVisible(bannerRecord, bannerData),
        }}
      />
      <StewardshipSection
        data={{
          eyebrow: String(getSectionValue(stewardshipRecord, stewardshipData, "eyebrow") || ""),
          heading: String(getSectionValue(stewardshipRecord, stewardshipData, "heading") || ""),
          description: String(
            getSectionValue(stewardshipRecord, stewardshipData, "description") || "",
          ),
          quote: String(getSectionValue(stewardshipRecord, stewardshipData, "quote") || ""),
          badgeNumber: String(
            getSectionValue(stewardshipRecord, stewardshipData, "badgeNumber") || "",
          ),
          badgeText: String(
            getSectionValue(stewardshipRecord, stewardshipData, "badgeText") || "",
          ),
          image: String(getSectionValue(stewardshipRecord, stewardshipData, "image") || ""),
          showSection: isSectionVisible(stewardshipRecord, stewardshipData),
        }}
      />
      <ArtisanalJourney
        data={{
          eyebrow: String(getSectionValue(journeyRecord, journeyData, "eyebrow") || ""),
          heading: String(getSectionValue(journeyRecord, journeyData, "heading") || ""),
          steps: String(getSectionValue(journeyRecord, journeyData, "steps") || ""),
          imageSet: String(getSectionValue(journeyRecord, journeyData, "imageSet") || ""),
          showSection: isSectionVisible(journeyRecord, journeyData),
        }}
      />
      <QuoteSection
        data={{
          quote: String(getSectionValue(quoteRecord, quoteData, "quote") || ""),
          author: String(getSectionValue(quoteRecord, quoteData, "author") || ""),
          showSection: isSectionVisible(quoteRecord, quoteData),
        }}
      />
      <SustainabilityCharter
        data={{
          heading: String(getSectionValue(charterRecord, charterData, "heading") || ""),
          description: String(
            getSectionValue(charterRecord, charterData, "description") || "",
          ),
          reportLabel: String(
            getSectionValue(charterRecord, charterData, "reportLabel") || "",
          ),
          reportHref: String(getSectionValue(charterRecord, charterData, "reportHref") || ""),
          charters: String(getSectionValue(charterRecord, charterData, "charters") || ""),
          showSection: isSectionVisible(charterRecord, charterData),
        }}
      />
    </AboutWrapper>
  );
}
