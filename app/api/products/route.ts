// src/app/api/products/route.ts 
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let where: any = {};

    if (category) {
      where.categories = {
        some: { categoryId: category },
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { categories: true },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.businessId || !body.brandId) {
      return NextResponse.json(
        { error: "businessId and brandId are required" },
        { status: 400 }
      );
    }

    if (typeof body.stock !== "number" || isNaN(body.stock)) {
      return NextResponse.json(
        { error: "stock must be a valid number" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
        stock: body.stock,             // 🟢 Send stock here!
        businessId: body.businessId,
        brandId: body.brandId,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}




