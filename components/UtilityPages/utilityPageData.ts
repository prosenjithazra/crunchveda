import { assets } from "@/json/assest";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

export type UtilityPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  countdownTo?: string;
  highlights: {
    label: string;
    value: string;
    icon: SvgIconComponent;
  }[];
  notes: string[];
  variant?: "coming-soon" | "maintenance";
};

export const comingSoonPageData: UtilityPageProps = {
  eyebrow: "NEW HARVEST IN PREPARATION",
  title: "Something fresh is coming soon",
  description:
    "Our team is preparing a refined NutriHarvest experience with curated drops, seasonal gifting, and smoother shopping flows.",
  image: assets.royalHarvest,
  imageAlt: "Premium NutriHarvest dry fruit gift box",
  countdownTo: "2026-08-01T00:00:00+05:30",
  highlights: [
    { label: "Curated launch", value: "Soon", icon: CalendarMonthOutlinedIcon },
    { label: "Harvest quality", value: "Premium", icon: VerifiedOutlinedIcon },
    { label: "Launch window", value: "August", icon: CalendarMonthOutlinedIcon },
  ],
  notes: ["Limited-batch collections", "Gift-ready packaging", "Organic sourcing updates"],
  variant: "coming-soon",
};

export const maintenancePageData: UtilityPageProps = {
  eyebrow: "STOREFRONT CARE IN PROGRESS",
  title: "We are tuning the harvest room",
  description:
    "NutriHarvest is briefly under maintenance while we refresh product details, checkout support, and content modules.",
  image: assets.morningHarvest,
  imageAlt: "Morning harvest basket with fresh organic produce",
  highlights: [
    { label: "Catalog", value: "Refreshing", icon: Inventory2OutlinedIcon },
    { label: "Systems", value: "Tuning", icon: SettingsSuggestOutlinedIcon },
    { label: "Support", value: "Online", icon: SupportAgentOutlinedIcon },
  ],
  notes: ["Orders remain carefully handled", "Support channels are available", "We will be back shortly"],
  variant: "maintenance",
};
