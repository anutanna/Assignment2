// app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma"; 

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
