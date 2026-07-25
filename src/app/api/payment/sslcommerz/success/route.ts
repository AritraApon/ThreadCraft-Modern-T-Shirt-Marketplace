import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { Order } from "@/types/order";
import { ObjectId } from "mongodb";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// POST /api/payment/sslcommerz/success
// SSLCommerz redirects here after successful payment; verify & mark order paid
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const val_id = formData.get("val_id") as string;
    const tran_id = formData.get("tran_id") as string; // Order ID
    const status = formData.get("status") as string;

    if (status !== "VALID" && status !== "VALIDATED") {
      return NextResponse.redirect(`${BASE_URL}/checkout?error=payment_invalid`);
    }

    const storeId = process.env.SSLCZ_STORE_ID || process.env.SSLCOMMERZ_STORE_ID;
    const storePassword = process.env.SSLCZ_STORE_PASSWORD || process.env.SSLCOMMERZ_STORE_PASSWORD;
    const isSandbox = process.env.SSLCZ_IS_SANDBOX !== undefined
      ? (process.env.SSLCZ_IS_SANDBOX === "true" || process.env.SSLCZ_IS_SANDBOX === "1")
      : process.env.SSLCOMMERZ_IS_LIVE !== "true";

    const validationApi = `${isSandbox ? "https://sandbox.sslcommerz.com" : "https://securepay.sslcommerz.com"}/validator/api/validationserverAPI.php`;

    // Validate with SSLCommerz server
    const validationUrl = `${validationApi}?val_id=${val_id}&store_id=${storeId}&store_passwd=${storePassword}&format=json`;
    const validationRes = await fetch(validationUrl);
    const validationData = await validationRes.json();

    if (
      validationData.status !== "VALID" &&
      validationData.status !== "VALIDATED"
    ) {
      console.error("❌ SSLCommerz validation failed:", validationData);
      return NextResponse.redirect(`${BASE_URL}/checkout?error=payment_validation_failed`);
    }

    if (!tran_id || !ObjectId.isValid(tran_id)) {
      return NextResponse.redirect(`${BASE_URL}/checkout?error=invalid_order`);
    }

    const db = await getDb();
    const ordersCollection = db.collection<Order>("orders");

    const order = await ordersCollection.findOne({ _id: new ObjectId(tran_id) });

    if (!order) {
      return NextResponse.redirect(`${BASE_URL}/checkout?error=invalid_order`);
    }

    // Only process payment confirmation & stock reduction ONCE
    if (order.paymentInfo.status !== "paid") {
      const now = new Date().toISOString();
      await ordersCollection.updateOne(
        { _id: new ObjectId(tran_id) },
        {
          $set: {
            "paymentInfo.status": "paid",
            "paymentInfo.transactionId": val_id,
            updatedAt: now,
          },
        }
      );

      // Decrement stock atomically per item
      const productsCollection = db.collection("products");
      for (const item of order.orderItems) {
        let productQuery: any = { _id: item.productId };
        if (typeof item.productId === "string" && ObjectId.isValid(item.productId)) {
          productQuery = { $or: [{ _id: new ObjectId(item.productId) }, { _id: item.productId }] };
        }
        await productsCollection.updateOne(
          productQuery,
          { $inc: { stock: -Math.abs(item.quantity) } }
        );
      }

      // Clear cart
      const userId = validationData.value_a || order.userId.toString();
      if (userId) {
        const cartsCollection = db.collection("carts");
        await cartsCollection.updateOne(
          { userId },
          { $set: { items: [], updatedAt: now } }
        );
      }
    }

    return NextResponse.redirect(`${BASE_URL}/order-success?orderId=${tran_id}`);
  } catch (err) {
    console.error("❌ SSLCOMMERZ SUCCESS ERROR:", err);
    return NextResponse.redirect(`${BASE_URL}/checkout?error=server_error`);
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
