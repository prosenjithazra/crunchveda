import type { Metadata } from "next";

export const siteSeo = {
  name: "Crunchveda",
  title: "Crunchveda | Premium Dry Fruits, Nuts & Organic Gifts",
  description:
    "Shop premium dry fruits, nuts, organic pantry essentials, and curated gift hampers sourced from trusted farms and delivered fresh.",
  url: (() => {
    let rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crunchveda.com";
    rawUrl = rawUrl.trim();
    if (rawUrl && !rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
      rawUrl = `https://${rawUrl}`;
    }
    try {
      new URL(rawUrl);
      return rawUrl;
    } catch {
      return "https://crunchveda.com";
    }
  })(),
  author: "Crunchveda",
  locale: "en_US",
  twitterHandle: "@crunchveda",
  defaultImage: "/assets/homeBannerImg.png",
  keywords: [
    "premium dry fruits",
    "organic nuts",
    "dry fruit gifts",
    "organic pantry",
    "healthy snacks",
    "curated gift hampers",
    "sustainable food delivery",
    "Crunchveda",
  ],
};

export type PageSeoConfig = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
};

export const absoluteUrl = (path = "/") => {
  try {
    const cleanPath = path ? path.trim() : "/";
    if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
      return cleanPath;
    }
    return new URL(cleanPath, siteSeo.url).toString();
  } catch {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${siteSeo.url}${normalizedPath}`;
  }
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image = siteSeo.defaultImage,
  noIndex = false,
}: PageSeoConfig): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    keywords: [...siteSeo.keywords, ...keywords],
    authors: [{ name: siteSeo.author }],
    creator: siteSeo.author,
    publisher: siteSeo.author,
    alternates: {
      canonical,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      locale: siteSeo.locale,
      url: canonical,
      siteName: siteSeo.name,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteSeo.twitterHandle,
      creator: siteSeo.twitterHandle,
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const publicPagesSeo: PageSeoConfig[] = [
  {
    path: "/",
    title: "Crunchveda | Premium Dry Fruits Delivered Fresh",
    description:
      "Discover premium dry fruits, nuts, curated categories, organic pantry essentials, and elegant gift boxes from Crunchveda.",
    keywords: ["dry fruits online", "premium nuts", "organic dry fruits"],
    image: "/assets/homeBannerImg.png",
  },
  {
    path: "/categories",
    title: "Curated Organic Collections | Crunchveda Categories",
    description:
      "Explore Crunchveda categories including premium dates, exotic nuts, ancient grains, artisanal oils, and gifting collections.",
    keywords: ["dry fruit categories", "premium dates", "exotic nuts", "artisanal oils"],
    image: "/assets/artisanal_gifting.png",
  },
  {
    path: "/products",
    title: "Dry Fruit Collections | Organic Nuts & Premium Snacks",
    description:
      "Shop premium almonds, cashews, walnuts, pistachios, dates, figs, and organic dry fruit blends from Crunchveda.",
    keywords: ["buy dry fruits", "organic almonds", "cashews", "walnuts", "pistachios"],
    image: "/assets/almonds_product.png",
  },
  {
    path: "/best-seller",
    title: "Best Selling Organic Dry Fruits | Crunchveda",
    description:
      "Browse Crunchveda best sellers, limited-batch harvests, premium dates, organic honey, walnuts, and exotic fruit selections.",
    keywords: ["best selling dry fruits", "premium dates", "organic honey"],
    image: "/assets/best_seller_dates.png",
  },
  {
    path: "/gifts",
    title: "Premium Dry Fruit Gift Hampers | Crunchveda Gifts",
    description:
      "Order curated dry fruit gift hampers, corporate gift boxes, custom chests, and artisanal wellness gifts from Crunchveda.",
    keywords: ["dry fruit gifts", "corporate gift hampers", "premium gift boxes"],
    image: "/assets/founders_reserve.png",
  },
  {
    path: "/about-us",
    title: "About Crunchveda | Organic Stewardship & Heritage",
    description:
      "Learn about Crunchveda's heritage, organic stewardship, artisanal process, and commitment to premium farm-sourced products.",
    keywords: ["about Crunchveda", "organic stewardship", "sustainable agriculture"],
    image: "/assets/about_banner.png",
  },
  {
    path: "/our-story",
    title: "Our Story | Crunchveda Heritage & Artisanal Earth",
    description:
      "Explore Crunchveda's story, century of stewardship, minimal intervention philosophy, and sustainable harvest legacy.",
    keywords: ["Crunchveda story", "organic farm heritage", "artisanal agriculture"],
    image: "/assets/story_hero_bg.png",
  },
  {
    path: "/sustainability",
    title: "Sustainability | Regenerative Agriculture & Zero Plastic",
    description:
      "See Crunchveda's sustainability pledge across regenerative agriculture, zero-plastic packaging, and climate-neutral delivery.",
    keywords: ["regenerative agriculture", "zero plastic packaging", "climate neutral delivery"],
    image: "/assets/sustainability_hero_bg.png",
  },
  {
    path: "/contact-us",
    title: "Contact Crunchveda | Concierge Support",
    description:
      "Contact Crunchveda for product inquiries, bulk gifting, concierge support, store details, and WhatsApp assistance.",
    keywords: ["Crunchveda contact", "bulk gifting inquiry", "dry fruit support"],
    image: "/assets/contact_hero_shirt.png",
  },
  {
    path: "/cart",
    title: "Harvest Basket | Crunchveda Cart",
    description:
      "Review your Crunchveda harvest basket, order summary, recommended add-ons, and WhatsApp checkout details.",
    keywords: ["Crunchveda cart", "harvest basket", "WhatsApp checkout"],
    image: "/assets/strawberries.png",
  },
  {
    path: "/checkout",
    title: "Checkout | Crunchveda",
    description:
      "Provide your delivery information and confirm your organic harvest orders for manual WhatsApp checkout.",
    keywords: ["checkout", "confirm order", "shipping details"],
    image: "/assets/strawberries.png",
  },
  {
    path: "/saved",
    title: "Saved Products | Crunchveda Wishlist",
    description:
      "View saved Crunchveda products, curated selections, recommendations, and move favourites into your harvest basket.",
    keywords: ["saved dry fruits", "wishlist", "Crunchveda favourites"],
    image: "/assets/dates_category.png",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy | Crunchveda",
    description:
      "Read Crunchveda's privacy policy covering data collection, cookies, data sharing, security, and customer rights.",
    keywords: ["Crunchveda privacy policy", "data security", "cookie policy"],
    image: "/assets/best_seller_orchard.png",
  },
  {
    path: "/terms-condition",
    title: "Terms & Conditions | Crunchveda",
    description:
      "Review Crunchveda terms and conditions for website use, product authenticity, intellectual property, and liability.",
    keywords: ["Crunchveda terms", "terms and conditions", "product authenticity"],
    image: "/assets/best_seller_orchard.png",
  },
  {
    path: "/login",
    title: "Sign In / Join Crunchveda | Premium Dry Fruits & Nuts",
    description:
      "Log in or register for a Crunchveda account to track orders, save items to your wishlist, and manage your delivery details.",
    keywords: ["login crunchveda", "create account", "user register"],
    image: "/assets/homeBannerImg.png",
  },
  {
    path: "/profile",
    title: "My Account | Crunchveda Dashboard",
    description:
      "Manage your personal details, order history, address details, and settings on your Crunchveda profile dashboard.",
    keywords: ["user profile", "crunchveda account", "my orders"],
    image: "/assets/dates_category.png",
  },
];

export const getPageSeo = (path: string) => {
  const page = publicPagesSeo.find(item => item.path === path);

  if (!page) {
    throw new Error(`Missing SEO config for ${path}`);
  }

  return page;
};
