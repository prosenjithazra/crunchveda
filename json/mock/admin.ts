import { assets } from "@/json/assest";
import { dryFruits } from "@/json/mock/dryFruits";

export type AdminStatus = "Published" | "Draft" | "Archived";

export type AdminSectionField =
  | {
      id: string;
      label: string;
      type: "text" | "textarea" | "image" | "number";
      value: string;
    }
  | {
      id: string;
      label: string;
      type: "select";
      value: string;
      options: string[];
    }
  | {
      id: string;
      label: string;
      type: "toggle";
      value: boolean;
    };

export type AdminContentRecord = {
  id: string;
  title: string;
  type: string;
  status: AdminStatus;
  updatedAt: string;
  fields: AdminSectionField[];
};

export type AdminModule = {
  id: string;
  moduleId?: string;
  title: string;
  route: string;
  description: string;
  pageType: "Content" | "Commerce" | "Utility" | "Policy";
  records: AdminContentRecord[];
};

export type AdminProductRecord = {
  id: string;
  name: string;
  category: string;
  status: AdminStatus;
  price: string;
  defaultSize: string;
  rating: string;
  image: string;
  description: string;
  badge?: string;
};

const today = "2026-06-11";

const field = (
  id: string,
  label: string,
  type: "text" | "textarea" | "image" | "number",
  value: string
): AdminSectionField => ({ id, label, type, value });

const toggleField = (id: string, label: string, value: boolean): AdminSectionField => ({
  id,
  label,
  type: "toggle",
  value,
});

const createContentRecord = (
  id: string,
  title: string,
  type: string,
  fields: AdminSectionField[],
  status: AdminStatus = "Published"
): AdminContentRecord => ({
  id,
  title,
  type,
  status,
  updatedAt: today,
  fields,
});

export const adminModules: AdminModule[] = [
  {
    id: "home",
    title: "Homepage",
    route: "/",
    description: "Manage the complete homepage: hero, category carousel, product cards, feature band, gift banner, product story, timeline, social grid, and FAQ.",
    pageType: "Content",
    records: [
      createContentRecord("home-hero", "Home hero banner", "Hero section", [
        field("eyebrow", "Small title", "text", "CRAFTING AGRICULTURAL EXCELLENCE"),
        field("headline", "H1 headline", "text", "Premium Dry Fruits Delivered Fresh"),
        field("description", "Hero paragraph", "textarea", "Experience the pinnacle of nutrition with our hand-picked selection of gourmet dry fruits, sourced directly from the finest organic orchards across the globe."),
        field("primaryCtaLabel", "Primary CTA label", "text", "Explore Collection"),
        field("primaryCtaHref", "Primary CTA link", "text", "/product"),
        field("image", "Hero background image", "image", assets.homeBannerImg),
        toggleField("showSection", "Show hero section", true),
      ]),
      createContentRecord("home-categories", "Curated categories carousel", "Category cards", [
        field("heading", "Section heading", "text", "Curated Categories"),
        field("cards", "Category cards", "textarea", "Almonds | 12 ITEMS | /product?category=almonds\nCashews | 8 ITEMS | /product?category=cashews\nPistachios | 10 ITEMS | /product?category=pistachios\nWalnuts | 6 ITEMS | /product?category=walnuts\nDates | 15 ITEMS | /product?category=dates\nSeeds | 9 ITEMS | /product?category=seeds"),
        field("imageSet", "Image paths", "textarea", `${assets.almonds}\n${assets.cashews}\n${assets.pistachios}\n${assets.walnuts}\n${assets.dates}\n${assets.seeds}`),
      ]),
      createContentRecord("home-best-selling", "Best selling products", "Product card section", [
        field("eyebrow", "Small title", "text", "CROWD FAVORITES"),
        field("heading", "Section heading", "text", "Best Selling Products"),
        field("viewAllLabel", "View all label", "text", "View All Products"),
        field("viewAllHref", "View all link", "text", "/product"),
        field("products", "Featured product cards", "textarea", "Jumbo Cashews | $18.50 | Organic | 250g, 500g, 1kg | WhatsApp enabled\nRaw California Almonds | $18.50 | Best Seller | 100g, 250g, 500g, 1kg | WhatsApp enabled\nArtisanal Chilean Walnuts | $21.99 | No badge | 500g | WhatsApp disabled\nTurkish Salted Pistachios | $27.50 | No badge | 100g, 500g | WhatsApp disabled"),
      ]),
      createContentRecord("home-features", "Feature promise band", "Feature cards", [
        field("features", "Feature cards", "textarea", "100% Organic | Sourced from certified organic farms committed to sustainable heritage agriculture.\nPremium Quality | Every batch undergoes rigorous quality checks for size, freshness, and nutrient density.\nEco-Fast Delivery | Sustainable carbon-neutral shipping ensures your health arrives at your doorstep swiftly.\nArtisanal Packing | Breathable, eco-friendly packaging designed to maintain crunch and essential oils."),
      ]),
      createContentRecord("home-gift-banner", "Gift banner", "Banner CTA", [
        field("eyebrow", "Small title", "text", "GIFT OF HEALTH"),
        field("heading", "Banner heading", "text", "Premium Curated Gift Boxes"),
        field("description", "Banner paragraph", "textarea", "Celebrate special moments with our elegant gift hampers. Perfect for corporate gifting or cherished family traditions."),
        field("ctaLabel", "CTA label", "text", "Customize Your Box"),
        field("ctaHref", "CTA link", "text", "/gifts"),
        field("image", "Background image", "image", assets.giftBannerBg),
      ]),
      createContentRecord("home-faq", "Frequently asked questions", "FAQ accordion", [
        field("heading", "Section heading", "text", "Frequently Asked Questions"),
        field("faqItems", "FAQ items", "textarea", "How do you ensure the freshness of your dry fruits? | We source directly from selected farms during peak harvest season.\nAre your products completely organic? | Yes, our entire curated selection is 100% organic and pesticide-free.\nWhat is your shipping policy? | Orders are processed within 24 hours and delivery typically takes 2-4 business days."),
      ]),
    ],
  },
  {
    id: "categories",
    title: "Categories Page",
    route: "/categories",
    description: "Manage the categories landing page title block, collection cards, gifting banner, and assurance feature row.",
    pageType: "Commerce",
    records: [
      createContentRecord("categories-header", "Title section", "Page header", [
        field("eyebrow", "Subtitle", "text", "The Essence of Earth"),
        field("headline", "H1 headline", "text", "Curated Collections"),
        field("description", "Intro paragraph", "textarea", "Explore our meticulously sourced selection of nature's most exquisite offerings. From the golden dunes of heritage date palms to the ancient groves of artisanal oils, every harvest tells a story of provenance and passion."),
      ]),
      createContentRecord("categories-grid", "Collection cards", "Category grid", [
        field("cards", "Collection cards", "textarea", "Premium Dates | Signature Selection | Heritage varieties hand-plucked from the sun-drenched oases of the Middle East. | /product?category=dates\nExotic Nuts |  | Sustainably sourced, slow-roasted perfection. | /product?category=nuts\nAncient Grains |  | Heirloom grains from untouched soils. | /product?category=grains\nArtisanal Oils |  | Cold-pressed liquid gold for the discerning palate. | /product?category=oils"),
        field("imageSet", "Image paths", "textarea", `${assets.dates}\n${assets.exoticNuts}\n${assets.ancientGrains}\n${assets.oliveOil}`),
      ]),
      createContentRecord("categories-gifting", "Artisanal gifting banner", "Banner CTA", [
        field("eyebrow", "Eyebrow", "text", "NEW IN EARTH"),
        field("badge", "Badge text", "text", "Perfect for Gifting"),
        field("heading", "Heading", "text", "Artisanal Gifting"),
        field("description", "Description", "textarea", "Thoughtfully curated hampers that celebrate the art of giving and the bounty of nature."),
        field("ctaLabel", "CTA label", "text", "Explore Gift Sets"),
        field("ctaHref", "CTA link", "text", "/product?category=gifting"),
        field("image", "Banner image", "image", assets.artisanalGifting),
      ]),
      createContentRecord("categories-features", "Assurance feature row", "Feature cards", [
        field("features", "Feature cards", "textarea", "Ethically Sourced | Working directly with small-scale farmers to ensure fair practices and superior quality.\nCertified Organic | Every product is tested for purity and maintains the highest organic certifications.\nGlobal Excellence | Premium logistics ensuring freshness from our soil to your doorstep."),
      ]),
    ],
  },
  {
    id: "products",
    title: "Product Listing Page",
    route: "/product",
    description: "Manage product listing page copy, filter options, sort options, card rules, WhatsApp CTA text, and pagination settings.",
    pageType: "Commerce",
    records: [
      createContentRecord("product-list-header", "Collections header", "Page header", [
        field("breadcrumbLabel", "Breadcrumb label", "text", "Collections"),
        field("headline", "H1 headline", "text", "Dry Fruit Collections"),
        field("description", "Intro paragraph", "textarea", "Artisanal selections sourced from the finest orchards globally. Each harvest is hand-picked, ensuring peak nutritional density and superior flavor profiles."),
      ]),
      createContentRecord("product-filters", "Filter sidebar", "Filter settings", [
        field("categories", "Category filter options", "textarea", "Premium Almonds\nExotic Cashews\nWalnut Kernels\nCalifornia Pistachios\nDates & Figs"),
        field("dietary", "Dietary filter options", "textarea", "Organic\nGluten-Free\nRaw"),
        field("priceMin", "Minimum price", "number", "5"),
        field("priceMax", "Maximum price", "number", "100"),
        field("sortOptions", "Sort options", "textarea", "Premium First\nPrice: Low to High\nPrice: High to Low\nName: A-Z"),
        field("itemsPerPage", "Items per page", "number", "6"),
      ]),
      createContentRecord("product-card-rules", "Product card display rules", "Card settings", [
        toggleField("showRating", "Show rating", true),
        toggleField("showWishlist", "Show wishlist button", true),
        toggleField("showWhatsApp", "Show WhatsApp action", true),
        toggleField("showSizePills", "Show size pills", true),
      ]),
    ],
  },
  {
    id: "product-detail",
    title: "Product Details Page",
    route: "/product/[slug]",
    description: "Manage the reusable detail page fields: gallery, badges, pricing blocks, package options, trust badges, WhatsApp CTA, and detail panels.",
    pageType: "Commerce",
    records: [
      createContentRecord("detail-gallery", "Product gallery", "Gallery", [
        field("breadcrumbLabel", "Breadcrumb label", "text", "Collections"),
        field("galleryImages", "Gallery images", "textarea", "Use product.gallery image paths from the product record. Add one path per line for future API integration."),
        toggleField("showThumbnails", "Show thumbnails", true),
      ]),
      createContentRecord("detail-main-info", "Product information panel", "Product detail content", [
        field("badgeRules", "Badge rules", "textarea", "Organic badge when product.badge is ORGANIC\nBest Seller badge when product.badge is BEST SELLER\nAlways show Premium Grade badge"),
        field("savingsLabel", "Savings label", "text", "20% Savings"),
        field("quantityMin", "Minimum quantity", "number", "1"),
        field("cartCta", "Cart CTA label", "text", "Add to Cart"),
        field("whatsAppCta", "WhatsApp CTA label", "text", "Order on WhatsApp"),
        field("responseNote", "Response note", "text", "Typical response time · 1–3 mins"),
      ]),
      createContentRecord("detail-trust-bottom", "Trust and bottom sections", "Trust panels", [
        field("trustItems", "Trust items", "textarea", "100% Organic | Farm-to-table cultivation\nDirect Trade | Sourced with heritage"),
        field("bottomSections", "Bottom sections", "textarea", "Origin story\nStorage instructions\nNutrition facts\nRelated products"),
      ]),
    ],
  },
  {
    id: "best-seller",
    title: "Best Seller Page",
    route: "/best-seller",
    description: "Manage the best-seller editorial hero, featured date product, collection cards, quote, and highlight areas.",
    pageType: "Commerce",
    records: [
      createContentRecord("best-header", "Editorial page header", "Hero header", [
        field("eyebrow", "Section tag", "text", "Curated Excellence"),
        field("headline", "H1 headline", "text", "The Season's Finest"),
        field("description", "Hero paragraph", "textarea", "A limited-batch selection of the Earth's most exceptional yields. From sun-drenched estates to remote forest canopies, we bring you the pinnacle of artisanal cultivation, meticulously verified for provenance, purity, and peak flavor profile."),
      ]),
      createContentRecord("best-featured", "Featured product row", "Featured product", [
        field("image", "Featured image", "image", assets.bestSellerDates),
        field("badgeTag", "Overlay badge", "text", "Editor's Choice #01"),
        field("productName", "Product name", "text", "Jumbo Medjool Dates"),
        field("productMeta", "Product meta", "text", "Premium Grade • 1kg • $32.00"),
        field("sectionTag", "Right column tag", "text", "The Provenance"),
        field("description", "Product story", "textarea", "Harvested from the Jericho Valley, these King of Dates are hand-picked at peak ripeness."),
        field("checklist", "Checklist items", "textarea", "Single-Estate Origin\n100% Pure Organic"),
        field("ctaLabel", "CTA label", "text", "Add To Harvest"),
      ]),
      createContentRecord("best-collection", "The Collection grid", "Product cards", [
        field("heading", "Section heading", "text", "The Collection"),
        field("viewAllLabel", "View all label", "text", "View All Shop"),
        field("cards", "Collection cards", "textarea", "Raw Forest Honey | $45.00 | Acacia & Tupelo | 500g | Limited Batch\nArtisanal Walnuts | $28.00 | Shelled | 750g\nExotic Fruit Mix | $34.00 | Dehydrated | 400g"),
      ]),
    ],
  },
  {
    id: "gifts",
    title: "Gifts Page",
    route: "/gifts",
    description: "Manage gifting header content, executive gift cards, custom chest CTA, collection columns, and concierge form copy.",
    pageType: "Commerce",
    records: [
      createContentRecord("gifts-header", "Gifting intro", "Page header", [
        field("eyebrow", "Subtitle", "text", "Artisanal Gifting"),
        field("headline", "H1 headline", "text", "Curated with\nIntention."),
        field("description", "Intro paragraph", "textarea", "Discover our message of special celebrations, unique business appreciation, and hand-selected gestures for every occasion."),
      ]),
      createContentRecord("gifts-executive", "Executive gift set", "Gift cards", [
        field("heading", "Section heading", "text", "The Executive"),
        field("exploreLabel", "Explore link label", "text", "Explore The Set"),
        field("largeCard", "Large gift card", "textarea", "The Signature | The Founder's Reserve | Handmade wood chest with gourmet dried fruits, chocolate, wildflower honey & olive oil. | Read details"),
        field("smallCards", "Small gift cards", "textarea", "Royal Harvest | A sampling box of raw honey, medjool dates & handpicked nuts.\nThe Tea Botanical | Loose leaf organic herbal tea selection with handmade tea infuser."),
      ]),
      createContentRecord("gifts-custom-chest", "Custom chest banner", "Banner CTA", [
        field("eyebrow", "Banner subtitle", "text", "Made For You"),
        field("heading", "Banner heading", "text", "Build your own Custom Chest."),
        field("description", "Banner description", "textarea", "Select what fits, select the size, choose from our premium chest selections."),
        field("ctaLabel", "CTA label", "text", "Start building"),
        field("ctaHref", "CTA link", "text", "/categories"),
        field("image", "Banner image", "image", assets.customChestBg),
      ]),
      createContentRecord("gifts-collections", "Heritage and seasonal collections", "Product columns", [
        field("heritageHeading", "Left column heading", "text", "The Heritage"),
        field("heritageItems", "Heritage items", "textarea", "Old Orchard Classic | Heritage cider, heirloom apples & seasonal fruit. | $110.00\nThe Orchard Spa | Botanical body mist, lavender oil & organic tea. | $75.00"),
        field("seasonalHeading", "Right column heading", "text", "The Seasonal"),
        field("seasonalItems", "Seasonal items", "textarea", "Winter Solstice | Spiced honey, dark chocolate & hand-poured candle. | $120.00\nThe Morning Harvest | Blueberry jam, wildflower honey & signature blend. | $95.00"),
      ]),
      createContentRecord("gifts-concierge", "Gift concierge", "Lead form", [
        field("heading", "Form heading", "text", "Gift Concierge"),
        field("description", "Form description", "textarea", "Need help sending gifts for your team or event? Our concierge service provides personalized guidance."),
        field("emailPlaceholder", "Email placeholder", "text", "Your Email Address"),
        field("submitLabel", "Submit button label", "text", "Inquire"),
      ]),
    ],
  },
  {
    id: "about-us",
    title: "About Us Page",
    route: "/about-us",
    description: "Manage about hero, stewardship narrative, process cards, quote, and sustainability charter sections.",
    pageType: "Content",
    records: [
      createContentRecord("about-banner", "About hero", "Hero section", [
        field("eyebrow", "Small title", "text", "EST. 1914"),
        field("headline", "H1 headline", "text", "Cultivating Legacy Through the Seasons"),
        field("description", "Hero paragraph", "textarea", "A century of dedication to the soil, the seed, and the harvest. The story of our organic stewardship."),
        field("image", "Hero image", "image", assets.aboutBanner),
      ]),
      createContentRecord("about-stewardship", "Stewardship narrative", "Split section", [
        field("eyebrow", "Small title", "text", "Our Roots"),
        field("heading", "Section heading", "text", "A Century of Stewardship"),
        field("description", "Narrative paragraph", "textarea", "For over three generations, the Nur Harvest estate has stood as a beacon of organic excellence. Our journey began with a simple promise: to honor the land and craft purity."),
        field("quote", "Quote block", "textarea", "This is not merely land; it is a trust we hold for those who will follow."),
        field("image", "Section image", "image", assets.stewardshipFarmer),
        field("badgeNumber", "Floating badge number", "text", "100+"),
        field("badgeText", "Floating badge text", "text", "Years of Tradition"),
      ]),
      createContentRecord("about-journey", "Artisanal journey", "Process cards", [
        field("eyebrow", "Small title", "text", "Our Process"),
        field("heading", "Section heading", "text", "The Artisanal Journey"),
        field("steps", "Process cards", "textarea", "Seed Heritage | The finest seed, hand-selected to reflect archaeological history and botanical purity.\nMineral Enrichment | Curating balanced ecosystem compounds, enriching soil nutrients.\nMaster Curation | Only the pinnacle of the harvest is selected."),
      ]),
    ],
  },
  {
    id: "our-story",
    title: "Our Story Page",
    route: "/our-story",
    description: "Manage story hero, legacy split section, philosophy cards, stewardship timeline, and final CTA banner.",
    pageType: "Content",
    records: [
      createContentRecord("story-hero", "Story hero", "Hero section", [
        field("eyebrow", "Hero subtitle", "text", "Our Heritage"),
        field("headline", "H1 headline", "text", "Cultivating the Legacy\nof Artisanal Earth"),
        field("description", "Hero paragraph", "textarea", "Beyond standard agriculture, we are a family-held steward of the land, preserving the patient wisdom of nature."),
        field("ctaLabel", "CTA label", "text", "Discover The Promise"),
        field("image", "Hero image", "image", assets.storyHeroBg),
      ]),
      createContentRecord("story-legacy", "Legacy split section", "Split content", [
        field("eyebrow", "Small title", "text", "The Beginning"),
        field("heading", "Section heading", "text", "The Legacy of Soil and Spirit"),
        field("body", "Body copy", "textarea", "Our story began in 1924, on a small patch of untouched soil that whispered of potential.\nToday, NutriHarvest stands as a beacon of high-end agricultural craft."),
        field("image", "Section image", "image", assets.storyLegacySoil),
      ]),
      createContentRecord("story-philosophy", "Minimal intervention philosophy", "Card grid", [
        field("heading", "Section heading", "text", "Minimal Intervention Philosophy"),
        field("description", "Intro copy", "textarea", "We believe the finest produce is born from where the human hand is lightest, guiding nature without forcing it."),
        field("cards", "Philosophy cards", "textarea", "Biodynamic Balance | Aligning harvests close with celestial cycles.\nPure Sourcing | Only 2% of global harvests meet our criteria.\nArtisanal Curation | Every batch is hand-inspected and packed with care."),
      ]),
      createContentRecord("story-timeline", "Stewardship timeline", "Timeline", [
        field("heading", "Section heading", "text", "A Century of Stewardship"),
        field("items", "Timeline items", "textarea", "1924 | The Founding Soil | The first 40 acres are purchased in Oregon.\n1968 | Organic Pioneer | One of the first certified organic estates in the region.\n2024 | The Global Standard | Combining artisanal precision with ecological stewardship."),
      ]),
      createContentRecord("story-cta", "Taste the Provenance CTA", "CTA banner", [
        field("heading", "CTA heading", "text", "Taste the Provenance"),
        field("description", "CTA description", "textarea", "Experience the culmination of our century-long journey through our curated seasonal collections."),
        field("primaryCta", "Primary CTA", "text", "Explore Collections | /categories"),
        field("secondaryCta", "Secondary CTA", "text", "Our Sustainability Promise | /about-us"),
      ]),
    ],
  },
  {
    id: "sustainability",
    title: "Sustainability Page",
    route: "/sustainability",
    description: "Manage green pledge hero, quote, regenerative practices, zero-plastic cards, delivery stats, and impact report CTA.",
    pageType: "Content",
    records: [
      createContentRecord("sustainability-hero", "Sustainability hero", "Hero section", [
        field("eyebrow", "Section tag", "text", "Our Green Pledge"),
        field("headline", "H1 headline", "text", "A Charter for the Future of Food"),
        field("description", "Hero description", "textarea", "We believe luxury is keeping the integrity of the soil, the purity of the food, and the transparency of the journey."),
        field("image", "Hero image", "image", assets.sustainabilityHeroBg),
        field("quote", "Quote text", "textarea", "We do not inherit the earth from our ancestors, we borrow it from our children."),
      ]),
      createContentRecord("regenerative", "Regenerative practices", "Split section", [
        field("eyebrow", "Section tag", "text", "Regenerative Practices"),
        field("heading", "Section heading", "text", "Healing the Planet Through Agriculture"),
        field("features", "Feature rows", "textarea", "Living Soils | Our No-Till philosophy protects complex fungal networks.\nHeritage Seeds | We use heirloom, non-GMO, open-pollinated seeds."),
        field("image", "Crop image", "image", assets.storyLegacySoil),
      ]),
      createContentRecord("zero-plastic", "Zero Plastic Mandate", "Card grid", [
        field("heading", "Section heading", "text", "Zero Plastic Mandate"),
        field("description", "Intro paragraph", "textarea", "Every NutriHarvest vessel is designed to respect the environment, using glass, biodegradable mycelium, and vegetable-inked paper."),
        field("cards", "Packaging cards", "textarea", "Infinitely Recyclable | Flint Glass Vases\n100% Compostable | Mycelium Buffers\nSoy-Based Ink | Vegetable Dyes"),
      ]),
      createContentRecord("climate-delivery", "Climate neutral delivery", "Stats and CTA", [
        field("stats", "Stats cards", "textarea", "12k+ | Trees Planted\n100% | Offset\nNet Zero | Carbon Footprint"),
        field("eyebrow", "Section tag", "text", "Logistics"),
        field("heading", "Section heading", "text", "Climate Neutral Delivery"),
        field("description", "Delivery description", "textarea", "Our carbon footprint is tracked from farm to gate. All shipments are offset through verified carbon-offset projects."),
        field("ctaLabel", "CTA label", "text", "View Impact Report"),
        field("ctaHref", "CTA link", "text", "#"),
      ]),
    ],
  },
  {
    id: "contact-us",
    title: "Contact Us Page",
    route: "/contact-us",
    description: "Manage contact hero, presence details, enquiry form labels, contact links, WhatsApp live concierge, and support center cards.",
    pageType: "Utility",
    records: [
      createContentRecord("contact-hero", "Contact hero", "Hero section", [
        field("eyebrow", "Section tag", "text", "Concierge Service"),
        field("headline", "H1 headline", "text", "How may we assist your journey?"),
        field("description", "Hero paragraph", "textarea", "Whether you are seeking a rare harvest or require personalized nutritional guidance, our concierge team is at your disposal."),
        field("image", "Hero image", "image", assets.contactHeroShirt),
      ]),
      createContentRecord("contact-presence", "Global presence details", "Contact info", [
        field("heading", "Section heading", "text", "Global Presence"),
        field("storeLabel", "Store label", "text", "Flagship Store"),
        field("address", "Address", "textarea", "42 Savile Row,\nMayfair, London\nW1S 3QR, UK"),
        field("mapLabel", "Map link label", "text", "View on map ↗"),
        field("email", "Enquiry email", "text", "concierge@nutriharvest.com"),
        field("phone", "Phone number", "text", "+44 (0) 20 7946 0123"),
        field("socialLinks", "Social links", "textarea", "INSTAGRAM | https://instagram.com\nLINKEDIN | https://linkedin.com"),
      ]),
      createContentRecord("contact-form", "Send a message form", "Form fields", [
        field("heading", "Form heading", "text", "Send a Message"),
        field("nameLabel", "Name label", "text", "Full Name"),
        field("namePlaceholder", "Name placeholder", "text", "E.g. Julian Thorne"),
        field("emailLabel", "Email label", "text", "Email Address"),
        field("emailPlaceholder", "Email placeholder", "text", "julian@example.com"),
        field("enquiryOptions", "Enquiry type options", "textarea", "General Concierge\nProduct Inquiry\nBulk & Custom Gifting\nFeedback"),
        field("messageLabel", "Message label", "text", "Your Message"),
        field("messagePlaceholder", "Message placeholder", "text", "How can we help cultivate your experience?"),
        field("submitLabel", "Submit label", "text", "Submit Request"),
      ]),
      createContentRecord("contact-support", "Support center cards", "Support cards", [
        field("eyebrow", "Section tag", "text", "Knowledge Base"),
        field("heading", "Section heading", "text", "Support Center"),
        field("browseLabel", "Browse link label", "text", "Browse All Topics"),
        field("cards", "Support cards", "textarea", "Logistics | Global carbon-neutral shipping routes and delivery timelines.\nAuthenticity | Trace your harvest back to its original organic soil.\nReturns | Our uncompromising policy on quality and artisanal satisfaction."),
      ]),
    ],
  },
  {
    id: "cart",
    title: "Cart Page",
    route: "/cart",
    description: "Manage basket title copy, default cart items, summary labels, empty state, upsell items, trust messaging, and WhatsApp checkout text.",
    pageType: "Utility",
    records: [
      createContentRecord("cart-title", "Cart title block", "Page header", [
        field("headline", "H1 headline", "text", "Harvest Basket"),
        field("description", "Subtitle", "textarea", "Review your selected artisanal produce before checkout."),
      ]),
      createContentRecord("cart-items", "Default cart items", "Cart products", [
        field("items", "Default items", "textarea", "Artisanal Forest Strawberries | SEASONAL SELECTION | $18.00 | Qty 2\nCold-Pressed Heritage Olive Oil | ESTATE BOTTLED | $45.00 | Qty 1"),
        field("emptyTitle", "Empty state text", "text", "Your basket is currently empty."),
        field("emptyCtaLabel", "Empty CTA label", "text", "Browse Products"),
        field("emptyCtaHref", "Empty CTA link", "text", "/product"),
      ]),
      createContentRecord("cart-summary", "Summary and checkout", "Summary panel", [
        field("summaryTitle", "Summary title", "text", "Summary"),
        field("shippingLabel", "Shipping label", "text", "Estimated Shipping"),
        field("taxLabel", "Tax label", "text", "Tax"),
        field("checkoutLabel", "Checkout CTA label", "text", "Checkout via WhatsApp"),
        field("secureLabel", "Secure note", "text", "Secure manual checkout via WhatsApp concierge."),
        field("taxRate", "Mock tax rate percent", "number", "5.55"),
      ]),
      createContentRecord("cart-upsell", "Upsell products", "Upsell cards", [
        field("items", "Upsell items", "textarea", "Infused Fleur de Sel | $12.00\nRaw Wildflower Honey | $22.00\nStone-Baked Sourdough | $9.00"),
      ]),
    ],
  },
  {
    id: "saved",
    title: "Saved Items Page",
    route: "/saved",
    description: "Manage saved selection items, action labels, empty states, and recommendation list content.",
    pageType: "Utility",
    records: [
      createContentRecord("saved-list", "Curated selection list", "Saved products", [
        field("items", "Saved items", "textarea", "DESERT HARVEST | Premium Medjool Dates | Hand-selected for honey-like sweetness. | $32.00\nDESERT HARVEST | Premium Medjool Dates | Hand-selected for honey-like sweetness. | $32.00\nDESERT HARVEST | Premium Medjool Dates | Hand-selected for honey-like sweetness. | $32.00"),
        field("clearAllLabel", "Clear all label", "text", "Clear All"),
        field("moveAllLabel", "Move all label", "text", "Move All to Basket"),
      ]),
      createContentRecord("saved-recommendations", "Recommendation list", "Recommendations", [
        field("heading", "Recommendation heading", "text", "You May Also Like"),
        field("items", "Recommendation items", "textarea", "Jumbo Cashews\nMamra Almonds\nKashmiri Walnuts\nForest Berry Mix"),
      ]),
    ],
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy Page",
    route: "/privacy-policy",
    description: "Manage privacy policy header, quick navigation, legal sections, sidebar cards, related documents, and service contact block.",
    pageType: "Policy",
    records: [
      createContentRecord("privacy-header", "Policy header", "Policy hero", [
        field("tag", "Governance tag", "text", "Information Governance"),
        field("headline", "H1 headline", "text", "Privacy Policy"),
        field("description", "Header description", "textarea", "Your trust is the foundation of our heritage. This policy outlines how NutriHarvest gathers, processes, and protects your information."),
        field("effectiveLabel", "Effective label", "text", "Effective Date"),
        field("effectiveDate", "Effective date", "text", "Oct 2024"),
      ]),
      createContentRecord("privacy-sections", "Policy sections", "Legal content", [
        field("quickNav", "Quick nav items", "textarea", "01 | Data Collection | data-collection\n02 | Cookie Usage | cookie-usage\n03 | Data Sharing | data-sharing\n04 | Data Security & Rights | data-rights"),
        field("sections", "Policy body sections", "textarea", "01 | Data Collection | We collect personal coordinates such as name, email, and phone descriptors.\n02 | Cookie Usage | NutriHarvest utilizes cookies and local browser storage to streamline user selections.\n03 | Data Sharing | We do not rent, sell, or disclose your data to third-party advertising companies.\n04 | Data Security & Rights | You can request access, corrections, or deletion of your profile data."),
      ]),
      createContentRecord("privacy-sidebar", "Policy sidebar and service block", "Sidebar content", [
        field("conciergeTitle", "Concierge card title", "text", "Questions regarding our terms?"),
        field("conciergeCopy", "Concierge card copy", "textarea", "Our legal concierge is available to clarify any aspect of our documentation."),
        field("relatedDocs", "Related documents", "textarea", "Terms & Conditions | /terms-condition\nCookie Statement | #cookie-statement\nAccessibility | #accessibility"),
        field("serviceHeading", "Service heading", "text", "Unrivaled Service"),
        field("email", "Contact email", "text", "concierge@nutriharvest.com"),
        field("phone", "Contact phone", "text", "1.800.HERITAGE"),
      ]),
    ],
  },
  {
    id: "terms-condition",
    title: "Terms & Conditions Page",
    route: "/terms-condition",
    description: "Manage terms header, quick navigation, legal sections, sidebar cards, related documents, and service contact block.",
    pageType: "Policy",
    records: [
      createContentRecord("terms-header", "Terms header", "Policy hero", [
        field("tag", "Governance tag", "text", "Information Governance"),
        field("headline", "H1 headline", "text", "Legal Documentation"),
        field("description", "Header description", "textarea", "Welcome to NutriHarvest. These terms outline the rules and regulations for the use of our high-end artisanal estate and provisions platform."),
        field("effectiveLabel", "Effective label", "text", "Effective Date"),
        field("effectiveDate", "Effective date", "text", "Oct 2024"),
      ]),
      createContentRecord("terms-sections", "Terms sections", "Legal content", [
        field("quickNav", "Quick nav items", "textarea", "01 | Use of Site | use-of-site\n02 | Product Authenticity | product-authenticity\n03 | Intellectual Property | intellectual-property\n04 | Liability | liability"),
        field("sections", "Terms body sections", "textarea", "01 | Use of Site | You warrant that you are at least 18 years of age or supervised by a guardian.\n02 | Product Authenticity | All product descriptions and images are subject to change without notice.\n03 | Intellectual Property | All site content is the property of NutriHarvest or its suppliers.\n04 | Liability | NutriHarvest provides the site on an as-is and as-available basis."),
      ]),
      createContentRecord("terms-sidebar", "Terms sidebar and service block", "Sidebar content", [
        field("conciergeTitle", "Concierge card title", "text", "Questions regarding our terms?"),
        field("conciergeCopy", "Concierge card copy", "textarea", "Our legal concierge is available to clarify any aspect of our documentation."),
        field("relatedDocs", "Related documents", "textarea", "Privacy Policy | /privacy-policy\nCookie Statement | #cookie-statement\nAccessibility | #accessibility"),
        field("serviceHeading", "Service heading", "text", "Unrivaled Service"),
        field("email", "Contact email", "text", "concierge@nutriharvest.com"),
        field("phone", "Contact phone", "text", "1.800.HERITAGE"),
      ]),
    ],
  },
];

export const adminProducts: AdminProductRecord[] = dryFruits.map(product => ({
  id: product.id,
  name: product.name,
  category: product.category,
  status: "Published",
  price: `$${product.sizePrices[product.defaultSize].toFixed(2)}`,
  defaultSize: product.defaultSize,
  rating: product.rating.toString(),
  image: product.image,
  description: product.description,
}));

export const adminCredentials = {
  email: "admin@crunchveda.com",
  password: "adminpassword123",
};
