export type IProductPrice = {
  _id?: string;
  size: string;
  price: number;
};

export type IProduct = {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  price?: number;       // legacy base price (may be absent in new format)
  stock: number;
  images?: string[];
  image?: string;       // legacy singular image field
  category?: {
    _id: string;
    name: string;
    slug?: string;
    image?: string;
    isActive?: boolean;
  } | string | null;
  ratings?: {
    average: number;
    count: number;
  };
  rating?: {
    number: number;
    total: number;
    _id?: string;
  };
  badge?: string;
  dietary?: string[];
  // New format: array of {size, price}
  prices?: IProductPrice[];
  // Old format: flat map
  sizePrices?: Record<string, number>;
  defaultSize?: string;
  isActive?: boolean;
  isBestseller?: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type IProductCategory = {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  isActive?: boolean;
  productCount?: number;
};

