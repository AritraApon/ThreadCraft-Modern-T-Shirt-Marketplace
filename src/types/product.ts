export interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  rating?: number;
  location?: string;
  destination?: string;
  badge?: string;
  image: string;
  colors?: string[];
  sizes?: string[];
  createdAt: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}