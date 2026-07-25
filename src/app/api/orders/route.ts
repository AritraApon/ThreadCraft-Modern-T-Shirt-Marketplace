import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { requireAuth, requireSeller } from "@/lib/getSessionUser";
import { Order } from "@/types/order";
import { ObjectId } from "mongodb";

// GET /api/orders — seller sees all paid orders; buyer not allowed here
export async function GET() {
  try {
    const { user, error } = await requireSeller();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const db = await getDb();
    const ordersCollection = db.collection<Order>("orders");

    const orders = await ordersCollection
      .find({ "paymentInfo.status": "paid" })
      .sort({ createdAt: -1 })
      .toArray();

    return successResponse({ orders });
  } catch (err) {
    console.error("❌ GET ORDERS ERROR:", err);
    return errorResponse("Server error", 500);
  }
}

// POST /api/orders — create a new order (called from checkout flow)
export async function POST(req: NextRequest) {
  try {
    const { user, error } = await requireAuth();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const body = await req.json();
    const { shippingInfo, orderItems, totalAmount } = body;

    if (!shippingInfo || !orderItems || !totalAmount) {
      return errorResponse("shippingInfo, orderItems, totalAmount are required", 400);
    }

    const db = await getDb();
    const productsCollection = db.collection("products");

    // Validate stock for each item
    for (const item of orderItems) {
      let productQuery: any = { _id: item.productId };
      if (typeof item.productId === "string" && ObjectId.isValid(item.productId)) {
        productQuery = { $or: [{ _id: new ObjectId(item.productId) }, { _id: item.productId }] };
      }
      const product = await productsCollection.findOne(productQuery);
      if (!product) {
        return errorResponse(`Product "${item.title}" not found`, 404);
      }
      const stock = product.stock ?? 0;
      if (stock < item.quantity) {
        return errorResponse(
          stock <= 0
            ? `"${item.title}" is out of stock`
            : `Only ${stock} unit(s) of "${item.title}" available`,
          400
        );
      }
    }

    const ordersCollection = db.collection<Order>("orders");

    const now = new Date().toISOString();
    const newOrder: Order = {
      userId: (user as any).id,
      orderItems,
      shippingInfo,
      totalAmount: Number(totalAmount),
      paymentInfo: {
        method: "SSLCommerz",
        transactionId: "",
        status: "pending",
      },
      orderStatus: "Pending",
      statusHistory: [{ status: "Pending", updatedAt: now }],
      createdAt: now,
      updatedAt: now,
    };

    const result = await ordersCollection.insertOne(newOrder);
    const orderId = result.insertedId.toString();

    return successResponse(
      { ...newOrder, _id: orderId },
      "Order created",
      201
    );
  } catch (err) {
    console.error("❌ POST ORDER ERROR:", err);
    return errorResponse("Server error", 500);
  }
}
