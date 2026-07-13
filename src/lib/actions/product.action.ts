'use server';
import { getMutation, postMutation, patchMutation, deleteMutation } from "../core/server";

// shop page - search/filter/sort/pagination সহ (queryString যেমন: "?category=hoodie&page=1")
export const getProducts = async (params: any) => {
  // ১. যদি params একটি Promise হয় (নেক্সটের নতুন ভার্সনে searchParams অনেক সময় প্রমিজ হয়)
  // অথবা যদি সরাসরি অবজেক্ট আসে, সেটাকে সেফলি হ্যান্ডেল করার জন্য:
  const resolvedParams = await params;

  const searchParams = new URLSearchParams();

  // ২. অবজেক্টের প্রতিটি কী (key) চেক করে স্ট্রিং প্যারামিটারে কনভার্ট করা
  if (resolvedParams?.search) searchParams.set('search', resolvedParams.search);
  if (resolvedParams?.category) searchParams.set('category', resolvedParams.category);
  if (resolvedParams?.sort) searchParams.set('sort', resolvedParams.sort);
  if (resolvedParams?.minPrice) searchParams.set('minPrice', resolvedParams.minPrice);
  if (resolvedParams?.maxPrice) searchParams.set('maxPrice', resolvedParams.maxPrice);
  if (resolvedParams?.page) searchParams.set('page', resolvedParams.page);
  if (resolvedParams?.limit) searchParams.set('limit', resolvedParams.limit);

  // ৩. কুয়েরি স্ট্রিং তৈরি করা
  const queryString = searchParams.toString();

  // যদি কোনো ফিল্টার না থাকে তবে শুধু `/api/products` যাবে, আর থাকলে কুয়েরি সহ যাবে
  const url = queryString ? `/api/products?${queryString}` : '/api/products';

  // ৪. এবার প্রোপার ইউআরএল স্ট্রিং পাস করো, কোনো অবজেক্ট সরাসরি যাবে না
  return await getMutation(url);
};

export const getProductDetails = async (id: string) => {
  return await getMutation(`/api/products/${id}`);
};

export const addProduct = async (data: any) => {
  return await postMutation(`/api/products`, data);
};

export const updateProduct = async (id: string, data: any) => {
  return await patchMutation(`/api/products/${id}`, data);
};

export const deleteProduct = async (id: string) => {
  return await deleteMutation(`/api/products/${id}`);
};