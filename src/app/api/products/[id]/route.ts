import { getDb } from "@/lib/db";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { Product } from "@/models/Product";
import { requireSeller } from "@/lib/getSessionUser";
import { ObjectId } from "mongodb";

type RouteParams = {
  params: Promise<{ id: string }>; // ⚡ Next.js 16 এ params একটি Promise
};

// ==========================================
// 1. GET /api/products/[id] (Product Details)
// ==========================================
// 1. GET /api/products/[id]
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return errorResponse("সঠিক প্রোডাক্ট আইডি প্রদান করুন", 400);
    }

    const database = await getDb();
    const productsCollection = database.collection<Product>("products");

    const product = await productsCollection.findOne({ _id: new ObjectId(id) as any });

    if (!product) {
      return errorResponse("প্রোডাক্টটি পাওয়া যায়নি", 404);
    }

    // 💡 ফ্রন্টএন্ডের সুবিধার জন্য মঙ্গোডিবির _id-কে স্ট্রিং বানিয়ে একদম প্লেইন অবজেক্ট করে পাঠাচ্ছি
    const formattedProduct = {
      ...product,
      _id: product._id.toString(),
      createdBy: product.createdBy ? product.createdBy.toString() : null
    };

    return successResponse(formattedProduct);
  } catch (error) {
    console.error("❌ GET PRODUCT DETAILS API ERROR:", error);
    return errorResponse("Server error", 500);
  }
}


// ==========================================
// 2. PATCH /api/products/[id] (Update Product)
// ==========================================
export async function PATCH(req: NextRequest, { params }: RouteParams) { // 🎯 টাইপ ঠিক করা হলো Params থেকে RouteParams এ
  try {
    // সেলার ভেরিফিকেশন (শুধু প্রোডাক্টের মালিক বা সেলার আপডেট করতে পারবে)
    const { user, error: authError } = await requireSeller();
    if (!user) return errorResponse(authError || "Unauthorized", 401);

    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return errorResponse("সঠিক প্রোডাক্ট আইডি প্রদান করুন", 400);
    }

    // 🎯 ডেটাবেস কানেকশন নিয়ে আসা (আগে db.collection লিখে ক্র্যাশ করছিল)
    const database = await getDb();
    const productsCollection = database.collection<Product>("products");

    // প্রথমে চেক করে নিচ্ছি প্রোডাক্টটি আসলেই এই সেলারের কিনা
    const product = await productsCollection.findOne({ _id: new ObjectId(id) as any });
    if (!product) return errorResponse("প্রোডাক্টটি পাওয়া যায়নি", 404);

    // 🎯 ObjectId ও String ম্যাচ করানোর জন্য দুটাকেই toString() এ কনভার্ট করা হলো
    if (product.createdBy.toString() !== (user as any).id.toString()) {
      return errorResponse("তুমি শুধু নিজের product update করতে পারবে", 403);
    }

    const body = await req.json();

    // মঙ্গোডিবির আইডি এবং মেটাডেটা যাতে ওভাররাইট না হয় তাই বডি থেকে বাদ দিচ্ছি
    delete body._id;
    delete body.createdBy;

    // যদি প্রাইস ও স্টক আপডেট করা হয়, সেগুলোকে নাম্বার ফরমেটে রাখা নিশ্চিত করছি
    if (body.price) body.price = Number(body.price);
    if (body.stock) body.stock = Number(body.stock);

    body.updatedAt = new Date().toISOString();

    // ডাটাবেজে আপডেট পাঠানো
    await productsCollection.updateOne(
      { _id: new ObjectId(id) as any },
      { $set: body }
    );

    return successResponse(null, "Product update করা হয়েছে");
  } catch (error) {
    console.error("❌ PATCH PRODUCT API ERROR:", error);
    return errorResponse("Server error", 500);
  }
}



// ==========================================
// 3. DELETE /api/products/[id] (Delete Product)
// ==========================================
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    // সেলার ভেরিফিকেশন
    const { user, error: authError } = await requireSeller();
    if (!user) return errorResponse(authError || "Unauthorized", 401);

    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return errorResponse("সঠিক প্রোডাক্ট আইডি প্রদান করুন", 400);
    }

    const database = await getDb();
    const productsCollection = database.collection<Product>("products");

    // প্রোডাক্ট চেক করা
    const existingProduct = await productsCollection.findOne({ _id: new ObjectId(id) as any});
    if (!existingProduct) {
      return errorResponse("প্রোডাক্টটি পাওয়া যায়নি", 404);
    }

    // প্রোডাক্টের তৈরি করা ইউজার আর রিকোয়েস্ট করা ইউজার এক কিনা ভেরিফাই করা
    if (existingProduct.createdBy.toString() !== (user as any).id.toString()) {
      return errorResponse("আপনি এই প্রোডাক্টটি ডিলিট করার অধিকারী নন", 403);
    }

    await productsCollection.deleteOne({ _id: new ObjectId(id) as any });

    return successResponse(null, "Product deleted successfully");
  } catch (error) {
    console.error("❌ DELETE PRODUCT API ERROR:", error);
    return errorResponse("Server error", 500);
  }
}