import { assets } from "@/json/assest";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  weight: string;
  image: string;
  badge?: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "honey-001",
    slug: "raw-forest-honey",
    name: "Raw Forest Honey",
    category: "Honey",
    price: 24,
    weight: "500g",
    image: assets.honey,
    badge: "Best Seller",
    description: "Golden raw honey collected from forest-edge apiaries."
  },
  {
    id: "herb-001",
    slug: "aroma-herbbox",
    name: "Aroma Herbbox",
    category: "Herbs",
    price: 18,
    weight: "250g",
    image: assets.herbs,
    description: "Fresh-cut herb bunches packed for bright everyday cooking."
  },
  {
    id: "berry-001",
    slug: "wildberry-mix",
    name: "Wildberry Mix",
    category: "Fruit",
    price: 19,
    weight: "300g",
    image: assets.berries,
    description: "A seasonal mix of tart and sweet berries from partner farms."
  },
  {
    id: "grain-001",
    slug: "heritage-grains",
    name: "Heritage Grains",
    category: "Grains",
    price: 16,
    weight: "1kg",
    image: assets.grains,
    description: "Slow-grown grains selected for texture, aroma, and nutrition."
  }
];

export const categories = [
  {
    name: "Vegetables",
    image: assets.vegetables,
    href: "/products?category=vegetables"
  },
  {
    name: "Fruit",
    image: assets.berries,
    href: "/products?category=fruit"
  },
  {
    name: "Herbs",
    image: assets.herbs,
    href: "/products?category=herbs"
  },
  {
    name: "Grains",
    image: assets.grains,
    href: "/products?category=grains"
  }
];

export const promises = [
  {
    title: "100% Organic",
    copy: "Certified sustainable produce from trusted growing partners."
  },
  {
    title: "Farm to Door",
    copy: "Harvested clean, checked carefully, and packed fresh."
  },
  {
    title: "Low Waste",
    copy: "Compostable wraps and smart batch-based dispatch."
  }
];
