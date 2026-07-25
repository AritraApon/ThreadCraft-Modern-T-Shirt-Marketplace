import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { requireAuth } from "@/lib/getSessionUser";
import { Cart, CartItem } from "@/types/cart";
import { ObjectId } from "mongodb";

// GET /api/cart — get the current user's cart
export async function GET() {
  try {
    const { user, error } = await requireAuth();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const db = await getDb();
    const cartsCollection = db.collection<Cart>("carts");

    const cart = await cartsCollection.findOne({ userId: (user as any).id });
    return successResponse(cart || { userId: (user as any).id, items: [] });
  } catch (err) {
    console.error("❌ GET CART ERROR:", err);
    return errorResponse("Server error", 500);
  }
}

// POST /api/cart — add or update item in cart (upsert by productId+size+color)
export async function POST(req: NextRequest) {
  try {
    const { user, error } = await requireAuth();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const body = await req.json();
    const { productId, title, image, price, size, color, quantity } = body;

    if (!productId || !title || price == null || !quantity) {
      return errorResponse("productId, title, price, quantity are required", 400);
    }

    const db = await getDb();
    const productsCollection = db.collection("products");

    let productQuery: any = { _id: productId };
    if (typeof productId === "string" && ObjectId.isValid(productId)) {
      productQuery = { $or: [{ _id: new ObjectId(productId) }, { _id: productId }] };
    }
    const dbProduct = await productsCollection.findOne(productQuery);
    if (!dbProduct) {
      return errorResponse("Product not found", 404);
    }

    const availableStock = dbProduct.stock ?? 0;
    if (availableStock <= 0) {
      return errorResponse("Product is out of stock", 400);
    }

    const cartsCollection = db.collection<Cart>("carts");

    const userId = (user as any).id;
    const cart = await cartsCollection.findOne({ userId });

    const currentQtyInCart = cart?.items?.find(
      (item) =>
        item.productId.toString() === productId.toString() &&
        item.size === size &&
        item.color === color
    )?.quantity || 0;

    if (currentQtyInCart + Number(quantity) > availableStock) {
      return errorResponse(`Only ${availableStock} units available in stock`, 400);
    }

    if (!cart) {
      // Create new cart
      const newCart: Cart = {
        userId,
        items: [
          {
            _id: new ObjectId().toString(),
            productId,
            title,
            image: image || "",
            price: Number(price),
            size: size || "",
            color: color || "",
            quantity: Number(quantity),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = await cartsCollection.insertOne(newCart);
      return successResponse({ ...newCart, _id: result.insertedId }, "Item added to cart", 201);
    }

    // Cart exists — check if same product+size+color already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId.toString() &&
        item.size === size &&
        item.color === color
    );

    let updatedItems: CartItem[];
    if (existingItemIndex >= 0) {
      // Increment quantity
      updatedItems = cart.items.map((item, idx) =>
        idx === existingItemIndex
          ? { ...item, quantity: item.quantity + Number(quantity) }
          : item
      );
    } else {
      // Add new item
      const newItem: CartItem = {
        _id: new ObjectId().toString(),
        productId,
        title,
        image: image || "",
        price: Number(price),
        size: size || "",
        color: color || "",
        quantity: Number(quantity),
      };
      updatedItems = [...cart.items, newItem];
    }

    await cartsCollection.updateOne(
      { userId },
      { $set: { items: updatedItems, updatedAt: new Date().toISOString() } }
    );

    return successResponse({ items: updatedItems }, "Cart updated");
  } catch (err) {
    console.error("❌ POST CART ERROR:", err);
    return errorResponse("Server error", 500);
  }
}

// DELETE /api/cart — clear entire cart
export async function DELETE() {
  try {
    const { user, error } = await requireAuth();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const db = await getDb();
    const cartsCollection = db.collection<Cart>("carts");

    await cartsCollection.updateOne(
      { userId: (user as any).id },
      { $set: { items: [], updatedAt: new Date().toISOString() } }
    );

    return successResponse(null, "Cart cleared");
  } catch (err) {
    console.error("❌ DELETE CART ERROR:", err);
    return errorResponse("Server error", 500);
  }
}
