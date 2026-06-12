export type ICategory = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
};
