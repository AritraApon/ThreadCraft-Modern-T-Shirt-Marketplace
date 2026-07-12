import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { requireSeller } from "@/lib/getSessionUser";
import { Product } from "@/models/Product";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) return errorResponse("Invalid product id", 400);

    const productsCollection = db.collection<Product>("products");
    const product = await productsCollection.findOne({ _id: new ObjectId(id) as any });

    if (!product) return errorResponse("Product not found", 404);

    const relatedProducts = await productsCollection
      .find({ category: product.category, _id: { $ne: product._id } })
      .limit(4)
      .toArray();

    return successResponse({ product, relatedProducts });
  } catch (error) {
    console.error(error);
    return errorResponse("Server error", 500);
  }
}

//-----------------------------------------------------------------------
// -------------------------delete  product----------------------------
//-----------------------------------------------------------------------

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { user, error } = await requireSeller();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const { id } = await params;
    if (!ObjectId.isValid(id)) return errorResponse("Invalid product id", 400);

    const productsCollection = db.collection<Product>("products");
    const product = await productsCollection.findOne({ _id: new ObjectId(id) as any });

    if (!product) return errorResponse("Product not found", 404);
   if (product.createdBy.toString() !== (user as any).id.toString()) {
  return errorResponse("Failed to delete product", 403);
}

    await productsCollection.deleteOne({ _id: new ObjectId(id) as any });
    return successResponse(null, "Product deleted successfully");
  } catch (error) {
    console.error(error);
    return errorResponse("Server error", 500);
  }
}


//-----------------------------------------------------------------------
// ----------------------------------Update product-------------------
//-----------------------------------------------------------------------
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { user, error } = await requireSeller();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const { id } = await params;
    if (!ObjectId.isValid(id)) return errorResponse("Invalid product id", 400);

    const productsCollection = db.collection<Product>("products");
    const product = await productsCollection.findOne({ _id: new ObjectId(id) as any });

    if (!product) return errorResponse("Product not found", 404);
   if (product.createdBy.toString() !== (user as any).id.toString()) {
  return errorResponse("Failed to update product", 403);
}

    const body = await req.json();
    delete body._id;
    delete body.createdBy;

    await productsCollection.updateOne({ _id: new ObjectId(id) as any }, { $set: body });
    return successResponse(null, "Product update successfully");
  } catch (error) {
    console.error(error);
    return errorResponse("Server error", 500);
  }
}