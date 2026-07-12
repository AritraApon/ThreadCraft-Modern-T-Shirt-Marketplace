'use server';
import { getMutation, postMutation, patchMutation, deleteMutation } from "../core/server";

// shop page - search/filter/sort/pagination সহ (queryString যেমন: "?category=hoodie&page=1")
export const getProducts = async (queryString = "") => {
  return await getMutation(`/api/products${queryString}`);
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