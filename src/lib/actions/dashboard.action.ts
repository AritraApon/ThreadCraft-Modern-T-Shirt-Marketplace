import { getMutation } from "../core/server";

export const getDashboardStats = async () => {
  return await getMutation(`/api/dashboard`);
};

export const getDashboardOverview = async () => {
  return await getMutation(`/api/dashboard/overview`);
};