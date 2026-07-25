import { ObjectId } from "mongodb";

export interface CartItem {
  _id?: string | ObjectId;
  productId: string | ObjectId;
  title: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface Cart {
  _id?: string | ObjectId;
  userId: string | ObjectId;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}
