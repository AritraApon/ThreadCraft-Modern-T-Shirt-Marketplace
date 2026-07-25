import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { requireSeller } from "@/lib/getSessionUser";

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await requireSeller();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const db = await getDb();
    const ordersCollection = db.collection("orders");
    const productsCollection = db.collection("products");

    // Order Stats Aggregations
    const [orderStats] = await ordersCollection.aggregate([
      {
        $facet: {
          totalOrders: [{ $count: "count" }],
          paidOrders: [{ $match: { "paymentInfo.status": "paid" } }, { $count: "count" }],
          pendingOrders: [{ $match: { orderStatus: "Pending" } }, { $count: "count" }],
          deliveredOrders: [{ $match: { orderStatus: "Delivered" } }, { $count: "count" }],
          totalRevenue: [
            { $match: { "paymentInfo.status": "paid" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
          ],
          monthlyRevenue: [
            { $match: { "paymentInfo.status": "paid" } },
            {
              $group: {
                _id: { $dateToString: { format: "%b %Y", date: { $toDate: "$createdAt" } } },
                revenue: { $sum: "$totalAmount" },
                orders: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]).toArray();

    // Product Stats Aggregations
    const [productStats] = await productsCollection.aggregate([
      {
        $facet: {
          totalProducts: [{ $count: "count" }],
          outOfStock: [{ $match: { $or: [{ stock: { $lte: 0 } }, { stock: { $exists: false } }] } }, { $count: "count" }]
        }
      }
    ]).toArray();

    const totalOrders = orderStats?.totalOrders?.[0]?.count || 0;
    const pendingOrders = orderStats?.pendingOrders?.[0]?.count || 0;
    const deliveredOrders = orderStats?.deliveredOrders?.[0]?.count || 0;
    const totalRevenue = orderStats?.totalRevenue?.[0]?.total || 0;
    const monthlyRevenue = (orderStats?.monthlyRevenue || []).map((item: any) => ({
      month: item._id,
      revenue: item.revenue,
      orders: item.orders
    }));

    const totalProducts = productStats?.totalProducts?.[0]?.count || 0;
    const outOfStockProducts = productStats?.outOfStock?.[0]?.count || 0;

    return successResponse({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue,
      totalProducts,
      outOfStockProducts,
      monthlyRevenue
    });
  } catch (err) {
    console.error("❌ DASHBOARD OVERVIEW API ERROR:", err);
    return errorResponse("Server error", 500);
  }
}
