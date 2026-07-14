import { NextRequest } from "next/server";
import { getDb } from "@/lib/db"; // 💡 প্রক্সি db এর বদলে আসল getDb হেল্পার ইম্পোর্ট করলাম
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { Product } from "@/models/Product";
import { requireSeller } from "@/lib/getSessionUser";

// GET /api/products?search=&category=&color=&size=&minPrice=&maxPrice=&sort=&page=&limit=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const color = searchParams.get("color");
    const size = searchParams.get("size");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // 🎯 মঙ্গোডিবির লাইভ ডাটাবেস ইনস্ট্যান্স এবং নেটিভ কালেকশন রিলিজ করা
    const database = await getDb();
    const productsCollection = database.collection<Product>("products");

    const query: any = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (color) query.colors = color;
    if (size) query.sizes = size;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortQuery: any = { createdAt: -1 };
    if (sort === "price_low") sortQuery = { price: 1 };
    if (sort === "price_high") sortQuery = { price: -1 };
    if (sort === "rating") sortQuery = { rating: -1 };

    const skip = (page - 1) * limit;

    // ⚡ প্রমিজ চেইনিং টাইপ লিক ছাড়া একদম নেটিভ স্পীডে ডাটা ফেচ হবে
    const [products, total] = await Promise.all([
      productsCollection.find(query).sort(sortQuery).skip(skip).limit(limit).toArray(),
      productsCollection.countDocuments(query),
    ]);

    return successResponse({
      products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("❌ GET PRODUCTS API ERROR:", error);
    return errorResponse("Server error", 500);
  }
}

// POST /api/products (seller only)
export async function POST(req: NextRequest) {
  try {
    const { user, error } = await requireSeller();
    if (!user) return errorResponse(error || "Unauthorized", 401);

    const body = await req.json();
    const { title, brand, category, price, stock, sizes, colors, material, images, shortDescription, description } = body;

    if (!title || !brand || !category || !price) {
      return errorResponse("Title, brand, category, price আবশ্যক", 400);
    }

    // 🎯 ডাটাবেস কালেকশন হ্যান্ডলার
    const database = await getDb();
    const productsCollection = database.collection<Product>("products");

    const newProduct: Product = {
      title,
      brand,
      category,
      price: Number(price),
      stock: Number(stock) || 0,
      sizes: sizes || [],
      colors: colors || [],
      material: material || "",
      images: images || [],
      shortDescription: shortDescription || "",
      description: description || "",
      rating: 0,
      createdBy: (user as any).id,
      createdAt: new Date().toISOString(),
    };

    const result = await productsCollection.insertOne(newProduct);

    return successResponse({ ...newProduct, _id: result.insertedId }, "Product created", 201);
  } catch (error) {
    console.error("❌ POST PRODUCT API ERROR:", error);
    return errorResponse("Server error", 500);
  }
}