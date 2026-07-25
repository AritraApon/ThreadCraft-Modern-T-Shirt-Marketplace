'use server';
import { getMutation, postMutation, patchMutation } from "../core/server";
import { ShippingInfo, OrderItem } from "@/types/order";

// Create a new order (called from checkout page)
export const createOrder = async (
  shippingInfo: ShippingInfo,
  orderItems: OrderItem[],
  totalAmount: number
) => {
  return await postMutation(`/api/orders`, { shippingInfo, orderItems, totalAmount });
};

// Get all orders for the current logged-in buyer
export const getMyOrders = async () => {
  return await getMutation(`/api/orders/my`);
};

// Get a single order by ID (buyer: own order; seller: any order)
export const getOrderById = async (orderId: string) => {
  if (!orderId || orderId === 'undefined') {
    return { success: false, error: "Order ID is required" };
  }
  return await getMutation(`/api/orders/${orderId}`);
};

// Seller: get all paid orders for the dashboard
export const getAllOrders = async () => {
  return await getMutation(`/api/orders`);
};

// Seller: update order status
export const updateOrderStatus = async (orderId: string, orderStatus: string) => {
  if (!orderId) return { success: false, error: "Order ID is required" };
  return await patchMutation(`/api/orders/${orderId}`, { orderStatus });
};

// Initiate SSLCommerz payment for an order
export const initiatePayment = async (orderId: string) => {
  if (!orderId) return { success: false, error: "Order ID is required" };
  return await postMutation(`/api/payment/sslcommerz/init`, { orderId });
};
