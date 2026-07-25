import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { requireAuth } from "@/lib/getSessionUser";
import { Cart } from "@/types/cart";

// PATCH /api/cart/[itemId] — update quantity of a specific cart item
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { user, error } = await requireAuth();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const { itemId } = await params;
    const body = await req.json();
    const { quantity } = body;

    if (!quantity || Number(quantity) < 1) {
      return errorResponse("Quantity must be at least 1", 400);
    }

    const db = await getDb();
    const cartsCollection = db.collection<Cart>("carts");

    const userId = (user as any).id;
    const cart = await cartsCollection.findOne({ userId });

    if (!cart) return errorResponse("Cart not found", 404);

    const updatedItems = cart.items.map((item) =>
      item._id?.toString() === itemId
        ? { ...item, quantity: Number(quantity) }
        : item
    );

    await cartsCollection.updateOne(
      { userId },
      { $set: { items: updatedItems, updatedAt: new Date().toISOString() } }
    );

    return successResponse({ items: updatedItems }, "Cart item updated");
  } catch (err) {
    console.error("❌ PATCH CART ITEM ERROR:", err);
    return errorResponse("Server error", 500);
  }
}

// DELETE /api/cart/[itemId] — remove a specific item from cart
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { user, error } = await requireAuth();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const { itemId } = await params;

    const db = await getDb();
    const cartsCollection = db.collection<Cart>("carts");

    const userId = (user as any).id;
    const cart = await cartsCollection.findOne({ userId });

    if (!cart) return errorResponse("Cart not found", 404);

    const updatedItems = cart.items.filter(
      (item) => item._id?.toString() !== itemId
    );

    await cartsCollection.updateOne(
      { userId },
      { $set: { items: updatedItems, updatedAt: new Date().toISOString() } }
    );

    return successResponse({ items: updatedItems }, "Item removed from cart");
  } catch (err) {
    console.error("❌ DELETE CART ITEM ERROR:", err);
    return errorResponse("Server error", 500);
  }
}
