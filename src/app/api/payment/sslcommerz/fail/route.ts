import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { Order } from "@/types/order";
import { ObjectId } from "mongodb";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// POST /api/payment/sslcommerz/fail
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const tran_id = formData.get("tran_id") as string;

    if (tran_id && ObjectId.isValid(tran_id)) {
      const db = await getDb();
      const ordersCollection = db.collection<Order>("orders");

      await ordersCollection.updateOne(
        { _id: new ObjectId(tran_id) },
        {
          $set: {
            "paymentInfo.status": "failed",
            updatedAt: new Date().toISOString(),
          },
        }
      );
    }

    return NextResponse.redirect(`${BASE_URL}/checkout?error=payment_failed`);
  } catch (err) {
    console.error("❌ SSLCOMMERZ FAIL ERROR:", err);
    return NextResponse.redirect(`${BASE_URL}/checkout?error=payment_failed`);
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.redirect(`${BASE_URL}/checkout?error=payment_failed`);
}
