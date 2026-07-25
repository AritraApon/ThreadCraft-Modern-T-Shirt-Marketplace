import { getDb } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { requireAuth } from "@/lib/getSessionUser";
import { Order } from "@/types/order";

// GET /api/orders/my — buyer's own orders
export async function GET() {
  try {
    const { user, error } = await requireAuth();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const db = await getDb();
    const ordersCollection = db.collection<Order>("orders");

    const orders = await ordersCollection
      .find({ userId: (user as any).id })
      .sort({ createdAt: -1 })
      .toArray();

    return successResponse({ orders });
  } catch (err) {
    console.error("❌ GET MY ORDERS ERROR:", err);
    return errorResponse("Server error", 500);
  }
}
