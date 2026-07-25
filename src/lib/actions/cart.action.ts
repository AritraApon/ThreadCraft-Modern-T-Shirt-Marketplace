'use server';
import { getMutation, postMutation, patchMutation, deleteMutation } from "../core/server";

// Get the current user's cart
export const getCart = async () => {
  return await getMutation(`/api/cart`);
};

// Add item to cart (or merge with existing)
export const addToCart = async (item: {
  productId: string;
  title: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}) => {
  return await postMutation(`/api/cart`, item);
};

// Update quantity of a specific cart item
export const updateCartItem = async (itemId: string, quantity: number) => {
  if (!itemId) return { success: false, error: "Item ID is required" };
  return await patchMutation(`/api/cart/${itemId}`, { quantity });
};

// Remove a specific item from cart
export const removeFromCart = async (itemId: string) => {
  if (!itemId) return { success: false, error: "Item ID is required" };
  return await deleteMutation(`/api/cart/${itemId}`);
};

// Clear the entire cart
export const clearCart = async () => {
  return await deleteMutation(`/api/cart`);
};
