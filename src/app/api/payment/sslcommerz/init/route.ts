import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { requireAuth } from "@/lib/getSessionUser";
import { Order } from "@/types/order";
import { ObjectId } from "mongodb";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// POST /api/payment/sslcommerz/init
// Creates an SSLCommerz payment session and returns the GatewayPageURL
export async function POST(req: NextRequest) {
  try {
    const { user, error } = await requireAuth();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const body = await req.json();
    const { orderId } = body;

    if (!orderId || !ObjectId.isValid(orderId)) {
      return errorResponse("Valid orderId is required", 400);
    }

    const db = await getDb();
    const ordersCollection = db.collection<Order>("orders");
    const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });

    if (!order) return errorResponse("Order not found", 404);
    if (order.userId.toString() !== (user as any).id.toString()) {
      return errorResponse("Forbidden", 403);
    }

    const storeId = process.env.SSLCZ_STORE_ID || process.env.SSLCOMMERZ_STORE_ID;
    const storePassword = process.env.SSLCZ_STORE_PASSWORD || process.env.SSLCOMMERZ_STORE_PASSWORD;
    const isSandbox = process.env.SSLCZ_IS_SANDBOX !== undefined
      ? (process.env.SSLCZ_IS_SANDBOX === "true" || process.env.SSLCZ_IS_SANDBOX === "1")
      : process.env.SSLCOMMERZ_IS_LIVE !== "true";

    const sslcommerzApi = `${isSandbox ? "https://sandbox.sslcommerz.com" : "https://securepay.sslcommerz.com"}/gwprocess/v4/api.php`;

    if (!storeId || !storePassword) {
      console.error("❌ SSLCommerz credentials missing: SSLCZ_STORE_ID or SSLCZ_STORE_PASSWORD not set");
      return errorResponse("SSLCommerz credentials not configured in environment", 500);
    }

    // Build SSLCommerz payload
    const params = new URLSearchParams({
      store_id: storeId,
      store_passwd: storePassword,
      total_amount: order.totalAmount.toString(),
      currency: "BDT",
      tran_id: orderId,
      success_url: `${BASE_URL}/api/payment/sslcommerz/success`,
      fail_url: `${BASE_URL}/api/payment/sslcommerz/fail`,
      cancel_url: `${BASE_URL}/api/payment/sslcommerz/cancel`,
      ipn_url: `${BASE_URL}/api/payment/sslcommerz/ipn`,
      cus_name: order.shippingInfo.fullName,
      cus_email: order.shippingInfo.email,
      cus_phone: order.shippingInfo.phone,
      cus_add1: order.shippingInfo.address,
      cus_city: order.shippingInfo.city,
      cus_postcode: order.shippingInfo.postalCode || "0000",
      cus_country: "Bangladesh",
      ship_name: order.shippingInfo.fullName,
      ship_add1: order.shippingInfo.address,
      ship_city: order.shippingInfo.city,
      ship_postcode: order.shippingInfo.postalCode || "0000",
      ship_country: "Bangladesh",
      shipping_method: "Courier",
      product_name: order.orderItems.map((i) => i.title).join(", "),
      product_category: "T-Shirt",
      product_profile: "general",
      num_of_item: order.orderItems.reduce((sum, i) => sum + i.quantity, 0).toString(),
      // Pass userId so success/IPN routes can clear the cart
      value_a: order.userId.toString(),
    });

    const response = await fetch(sslcommerzApi, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.status !== "SUCCESS") {
      console.error("❌ SSLCommerz init failed:", data);
      return errorResponse(data.failedreason || "Payment gateway error", 502);
    }

    return successResponse(
      { gatewayUrl: data.GatewayPageURL, sessionkey: data.sessionkey },
      "Payment session created"
    );
  } catch (err) {
    console.error("❌ SSLCOMMERZ INIT ERROR:", err);
    return errorResponse("Server error", 500);
  }
}
