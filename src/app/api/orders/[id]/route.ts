import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { requireAuth, requireSeller } from "@/lib/getSessionUser";
import { Order, OrderStatus } from "@/types/order";
import { ObjectId } from "mongodb";

const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// GET /api/orders/[id] — buyer gets their own order, seller gets any order
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) return errorResponse("Invalid order ID", 400);

    const db = await getDb();
    const ordersCollection = db.collection<Order>("orders");

    const order = await ordersCollection.findOne({ _id: new ObjectId(id) });
    if (!order) return errorResponse("Order not found", 404);

    // Buyers can only see their own orders
    const role = (user as any).role;
    if (role !== "seller" && order.userId.toString() !== (user as any).id.toString()) {
      return errorResponse("Forbidden", 403);
    }

    return successResponse({ order });
  } catch (err) {
    console.error("❌ GET ORDER BY ID ERROR:", err);
    return errorResponse("Server error", 500);
  }
}

// PATCH /api/orders/[id] — seller updates orderStatus
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireSeller();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) return errorResponse("Invalid order ID", 400);

    const body = await req.json();
    const { orderStatus } = body;

    if (!orderStatus || !ORDER_STATUSES.includes(orderStatus)) {
      return errorResponse(`orderStatus must be one of: ${ORDER_STATUSES.join(", ")}`, 400);
    }

    const db = await getDb();
    const ordersCollection = db.collection<Order>("orders");

    const now = new Date().toISOString();
    console.log(`📦 PATCH order ${id}: status → ${orderStatus}`);

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          orderStatus,
          updatedAt: now,
        },
        $push: {
          statusHistory: { status: orderStatus, updatedAt: now },
        } as any,
      }
    );

    console.log(`📦 updateOne result: matched=${result.matchedCount} modified=${result.modifiedCount}`);

    if (result.matchedCount === 0) return errorResponse("Order not found", 404);

    // Return the full updated order so callers always have fresh data
    const updatedOrder = await ordersCollection.findOne({ _id: new ObjectId(id) });

    return successResponse({ order: updatedOrder, orderStatus }, "Order status updated");
  } catch (err) {
    console.error("❌ PATCH ORDER STATUS ERROR:", err);
    return errorResponse("Server error", 500);
  }
}
