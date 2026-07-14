import { NextRequest } from "next/server";
import { getDb } from "@/lib/db"; // 💡 নতুন হেল্পার ফাংশনটি ইম্পোর্ট করলাম
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { requireSeller } from "@/lib/getSessionUser";
import { Product } from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await requireSeller();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    // 🎯 মঙ্গোডিবির নেটিভ ডাটাবেস কানেকশন নিয়ে সরাসরি কালেকশন কল করলাম
    const database = await getDb();
    const productsCollection = database.collection<Product>("products");

    // এখন এই নেটিভ কার্সার চেইনিং নিয়ে টার্বোপ্যাক আর কোনোদিন এরর ধরবে না
    const myProducts = await productsCollection.find({ createdBy: (user as any).id }).toArray();

    const totalProducts = myProducts.length;
    const totalStock = myProducts.reduce((sum, p) => sum + (p.stock || 0), 0);

    const categoryMap: Record<string, number> = {};
    myProducts.forEach((p) => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    });
    const productsByCategory = Object.entries(categoryMap).map(([category, count]) => ({ category, count }));

    const monthlyMap: Record<string, number> = {};
    myProducts.forEach((p) => {
      const month = new Date(p.createdAt).toLocaleString("en-US", { month: "short", year: "numeric" });
      monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    });
    const monthlyAdded = Object.entries(monthlyMap).map(([month, count]) => ({ month, count }));

    return successResponse({
      totalProducts,
      totalStock,
      totalCategories: Object.keys(categoryMap).length,
      productsByCategory,
      monthlyAdded,
    });
  } catch (err) {
    console.error("❌ DASHBOARD ROUTE ERROR:", err);
    return errorResponse("Server error", 500);
  }
}