export interface Product {
  _id?: string;
  title: string;
  brand?: string;
  category?: string;
  price: number;
  stock?: number;
  sizes?: string[];
  colors?: string[];
  material?: string;
  images?: string[];
  shortDescription: string;
  description: string;
  rating?: number;
  createdBy: string;
  createdAt: string;
}