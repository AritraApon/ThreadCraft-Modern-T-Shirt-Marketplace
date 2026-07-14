'use server';
import { getMutation, postMutation, patchMutation, deleteMutation } from "../core/server";

// shop page - search/filter/sort/pagination সহ
export const getProducts = async (params: any) => {
  const resolvedParams = await params;
  const searchParams = new URLSearchParams();

  if (resolvedParams?.search) searchParams.set('search', resolvedParams.search);
  if (resolvedParams?.category) searchParams.set('category', resolvedParams.category);
  if (resolvedParams?.sort) searchParams.set('sort', resolvedParams.sort);
  if (resolvedParams?.minPrice) searchParams.set('minPrice', resolvedParams.minPrice);
  if (resolvedParams?.maxPrice) searchParams.set('maxPrice', resolvedParams.maxPrice);
  if (resolvedParams?.page) searchParams.set('page', resolvedParams.page);
  if (resolvedParams?.limit) searchParams.set('limit', resolvedParams.limit);

  const queryString = searchParams.toString();
  const url = queryString ? `/api/products?${queryString}` : '/api/products';

  return await getMutation(url);
};

// 💡 প্রোডাক্টের ডিটেইলস আনার সেফগার্ড ফাংশন
export const getProductDetails = async (id: string) => {
  // যদি আইডি না থাকে, অথবা আইডি 'undefined' স্ট্রিং হিসেবে আসে
  if (!id || id === 'undefined') {
    console.error("⚠️ getProductDetails error: ID is missing or undefined");
    return { success: false, error: "Product ID is required" };
  }
  return await getMutation(`/api/products/${id}`);
};

export const addProduct = async (data: any) => {
  return await postMutation(`/api/products`, data);
};

// 💡 আপডেট করার সেফগার্ড ফাংশন
export const updateProduct = async (id: string, data: any) => {
  if (!id || id === 'undefined') {
    return { success: false, error: "Product ID is required for update" };
  }
  return await patchMutation(`/api/products/${id}`, data);
};

// 💡 ডিলিট করার সেফগার্ড ফাংশন
export const deleteProduct = async (id: string) => {
  if (!id || id === 'undefined') {
    return { success: false, error: "Product ID is required for deletion" };
  }
  return await deleteMutation(`/api/products/${id}`);
};