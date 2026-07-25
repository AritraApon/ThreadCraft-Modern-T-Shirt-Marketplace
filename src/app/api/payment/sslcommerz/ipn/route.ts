import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { Order } from "@/types/order";
import { ObjectId } from "mongodb";

// POST /api/payment/sslcommerz/ipn
// SSLCommerz server-to-server IPN (Instant Payment Notification) callback
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const val_id = formData.get("val_id") as string;
    const tran_id = formData.get("tran_id") as string;
    const status = formData.get("status") as string;

    if (status !== "VALID" && status !== "VALIDATED") {
      return NextResponse.json({ received: true, processed: false });
    }

    if (!tran_id || !ObjectId.isValid(tran_id)) {
      return NextResponse.json({ received: true, processed: false, reason: "invalid tran_id" });
    }

    const storeId = process.env.SSLCZ_STORE_ID || process.env.SSLCOMMERZ_STORE_ID;
    const storePassword = process.env.SSLCZ_STORE_PASSWORD || process.env.SSLCOMMERZ_STORE_PASSWORD;
    const isSandbox = process.env.SSLCZ_IS_SANDBOX !== undefined
      ? (process.env.SSLCZ_IS_SANDBOX === "true" || process.env.SSLCZ_IS_SANDBOX === "1")
      : process.env.SSLCOMMERZ_IS_LIVE !== "true";

    const validationApi = `${isSandbox ? "https://sandbox.sslcommerz.com" : "https://securepay.sslcommerz.com"}/validator/api/validationserverAPI.php`;

    const validationUrl = `${validationApi}?val_id=${val_id}&store_id=${storeId}&store_passwd=${storePassword}&format=json`;
    const validationRes = await fetch(validationUrl);
    const validationData = await validationRes.json();

    if (validationData.status !== "VALID" && validationData.status !== "VALIDATED") {
      return NextResponse.json({ received: true, processed: false, reason: "validation_failed" });
    }

    const db = await getDb();
    const ordersCollection = db.collection<Order>("orders");

    const order = await ordersCollection.findOne({ _id: new ObjectId(tran_id) });
    if (!order) {
      return NextResponse.json({ received: true, processed: false, reason: "order_not_found" });
    }

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
      try {
        const cartsCollection = db.collection("carts");
        await cartsCollection.updateOne(
          { userId: order.userId.toString() },
          { $set: { items: [], updatedAt: now } }
        );
      } catch (_) {}
    }

    return NextResponse.json({ received: true, processed: true });
  } catch (err) {
    console.error("❌ SSLCOMMERZ IPN ERROR:", err);
    return NextResponse.json({ received: true, processed: false, error: "server_error" });
  }
}
