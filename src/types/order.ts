import { ObjectId } from "mongodb";

export interface OrderItem {
  productId: string | ObjectId;
  title: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode?: string;
}

export interface PaymentInfo {
  method: "SSLCommerz";
  transactionId: string;
  status: "pending" | "paid" | "failed" | "cancelled";
}

export interface StatusHistoryEntry {
  status: string;
  updatedAt: Date | string;
}

export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Order {
  _id?: string | ObjectId;
  userId: string | ObjectId;
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  totalAmount: number;
  paymentInfo: PaymentInfo;
  orderStatus: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  createdAt?: string;
  updatedAt?: string;
}
