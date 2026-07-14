import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Server Component / Server Action থেকে call করলে browser cookie auto যায় না,
// তাই manually cookie forward করে দেওয়া হচ্ছে।
const getAuthHeaders = async (): Promise<Record<string, string>> => {
  if (typeof window !== "undefined") return {};
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    return cookieString ? { Cookie: cookieString } : {};
  } catch (err) {
    // Client components-এ কল হলে cookies() এরর থ্রো করতে পারে, সেটা হ্যান্ডেল করা হলো
    console.error("Failed to get cookies in server context:", err);
    return {};
  }
};

// API রেসপন্সের কমন ইন্টারফেস
interface MutationResponse<T = any> {
  success?: boolean;
  error?: string;
  [key: string]: any;
}

// ---------- GET ----------
export const getMutation = async <T = any>(url: string): Promise<MutationResponse<T>> => {
  try {
    const authHeadersObj = await getAuthHeaders();

    const res = await fetch(`${baseUrl}${url}`, {
      method: "GET",
      cache: "no-store",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeadersObj,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`GET ${url} failed:`, errorMessage);
    return { success: false, error: errorMessage };
  }
};

// ---------- POST ----------
export const postMutation = async <T = any>(url: string, body: any): Promise<MutationResponse<T>> => {
  try {
    const authHeadersObj = await getAuthHeaders();

    const res = await fetch(`${baseUrl}${url}`, {
      method: "POST",
      cache: "no-store",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeadersObj,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`POST ${url} failed:`, errorMessage);
    return { success: false, error: errorMessage };
  }
};

// ---------- PATCH ----------
export const patchMutation = async <T = any>(url: string, body: any): Promise<MutationResponse<T>> => {
  try {
    const authHeadersObj = await getAuthHeaders();

    const res = await fetch(`${baseUrl}${url}`, {
      method: "PATCH",
      cache: "no-store",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeadersObj,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`PATCH ${url} failed:`, errorMessage);
    return { success: false, error: errorMessage };
  }
};

// ---------- DELETE ----------
export const deleteMutation = async <T = any>(url: string): Promise<MutationResponse<T>> => {
  try {
    const authHeadersObj = await getAuthHeaders();

    const res = await fetch(`${baseUrl}${url}`, {
      method: "DELETE",
      cache: "no-store",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeadersObj,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`DELETE ${url} failed:`, errorMessage);
    return { success: false, error: errorMessage };
  }
};