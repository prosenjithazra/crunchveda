import { absoluteUrl, siteSeo } from "./siteSeo";

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteSeo.name,
  url: siteSeo.url,
  description: siteSeo.description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteSeo.url}/products?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteSeo.name,
  url: siteSeo.url,
  logo: absoluteUrl("/assets/mainLogo.png"),
  sameAs: ["https://instagram.com", "https://linkedin.com"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "concierge@nutriharvest.com",
      telephone: "+44-20-7946-0123",
      availableLanguage: ["English"],
    },
  ],
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: siteSeo.name,
  image: absoluteUrl("/assets/contact_hero_shirt.png"),
  url: siteSeo.url,
  telephone: "+44-20-7946-0123",
  email: "concierge@nutriharvest.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "42 Savile Row",
    addressLocality: "Mayfair, London",
    postalCode: "W1S 3QR",
    addressCountry: "GB",
  },
};

export const createBreadcrumbSchema = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do you ensure the freshness of your dry fruits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NutriHarvest sources products directly from selected farms during peak harvest season and packs them in airtight, eco-friendly bags before dispatch.",
      },
    },
    {
      "@type": "Question",
      name: "Are your products completely organic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NutriHarvest's curated selection is organic, pesticide-free, and grown using natural farming practices.",
      },
    },
    {
      "@type": "Question",
      name: "What is your shipping policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Orders are processed within 24 hours, with typical delivery in two to four business days.",
      },
    },
  ],
};

export const createProductSchema = (product: {
  id: string;
  name: string;
  description: string;
  image: string;
  gallery?: string[];
  rating: number;
  category: string;
  defaultSize: string;
  sizePrices: Record<string, number>;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.gallery?.map(image => absoluteUrl(image)) ?? [absoluteUrl(product.image)],
  sku: product.id,
  category: product.category,
  brand: {
    "@type": "Brand",
    name: siteSeo.name,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: product.rating,
    reviewCount: 24,
  },
  offers: {
    "@type": "Offer",
    url: absoluteUrl(`/products/${product.id}`),
    priceCurrency: "USD",
    price: product.sizePrices[product.defaultSize],
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  },
});
