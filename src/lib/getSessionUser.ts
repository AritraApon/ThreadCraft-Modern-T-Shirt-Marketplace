import { headers } from "next/headers";
import { auth } from "./auth";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user ?? null;
}

export async function requireSeller() {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: "You are not logged in" };
  if ((user as any).role !== "seller") {
    return { user: null, error: "Only seller can access" };
  }
  return { user, error: null };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: "You are not logged in" };
  return { user, error: null };
}