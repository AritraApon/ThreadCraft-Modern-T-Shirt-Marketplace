import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { requireSeller } from "@/lib/getSessionUser";
import { Product } from "@/models/Product";

interface Params {
  params: Promise<{ id: string }>;
}

// ------------------------- GET PRODUCT ----------------------------
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id || !ObjectId.isValid(id)) {
      return errorResponse("Invalid product id", 400);
    }

    const productsCollection = db.collection<Product>("products");
    const product = await productsCollection.findOne({ _id: new ObjectId(id) as any });

    if (!product) return errorResponse("Product not found", 404);

    const relatedProducts = await productsCollection
      .find({ category: product.category, _id: { $ne: product._id } })
      .limit(4)
      .toArray();

    return successResponse({ product, relatedProducts });
  } catch (error) {
    console.error("GET Product Error:", error);
    return errorResponse("Server error", 500);
  }
}

// ------------------------- DELETE PRODUCT ----------------------------
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { user, error } = await requireSeller();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id || !ObjectId.isValid(id)) {
      return errorResponse("Invalid product id", 400);
    }

    const productsCollection = db.collection<Product>("products");
    const product = await productsCollection.findOne({ _id: new ObjectId(id) as any });

    if (!product) return errorResponse("Product not found", 404);

    // 🔥 সেফ চেক: createdBy ফিল্ডটি আছে কিনা নিশ্চিত করা হচ্ছে যেন ক্র্যাশ না করে
    const createdById = product.createdBy ? product.createdBy.toString() : null;
    const currentUserId = (user as any).id ? (user as any).id.toString() : null;

    if (!createdById || createdById !== currentUserId) {
      return errorResponse("Failed to delete product. Ownership mismatch.", 403);
    }

    await productsCollection.deleteOne({ _id: new ObjectId(id) as any });
    return successResponse(null, "Product deleted successfully");
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return errorResponse("Server error", 500);
  }
}

// ------------------------- UPDATE PRODUCT ----------------------------
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { user, error } = await requireSeller();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id || !ObjectId.isValid(id)) {
      return errorResponse("Invalid product id", 400);
    }

    const productsCollection = db.collection<Product>("products");
    const product = await productsCollection.findOne({ _id: new ObjectId(id) as any });

    if (!product) return errorResponse("Product not found", 404);

    // 🔥 সেফ চেক: আপডেটের ক্ষেত্রেও ক্র্যাশ প্রুফ ভ্যালিডেশন
    const createdById = product.createdBy ? product.createdBy.toString() : null;
    const currentUserId = (user as any).id ? (user as any).id.toString() : null;

    if (!createdById || createdById !== currentUserId) {
      return errorResponse("Failed to update product. Ownership mismatch.", 403);
    }

    const body = await req.json();
    delete body._id;
    delete body.createdBy;

    await productsCollection.updateOne({ _id: new ObjectId(id) as any }, { $set: body });
    return successResponse(null, "Product update successfully");
  } catch (error) {
    console.error("PATCH Product Error:", error);
    return errorResponse("Server error", 500);
  }
}