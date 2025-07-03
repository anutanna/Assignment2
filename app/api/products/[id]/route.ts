import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ObjectId } from "mongodb";

// DELETE /api/products/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const objectId = new ObjectId(params.id);
  
      // 1. Delete related images
      await prisma.productImage.deleteMany({
        where: { productId: objectId.toString() },
      });
  
      // 2. Delete related product-category links
      await prisma.productToCategory.deleteMany({
        where: { productId: objectId.toString() },
      });
  
      await prisma.orderItem.deleteMany({
        where: { productId: objectId.toString() },
      });
      
      // 4. Delete the product itself
      await prisma.product.delete({
        where: { id: objectId.toString() },
      });
  
      return NextResponse.json({ message: "Product deleted" }, { status: 200 });
    } catch (error) {
      console.error("Delete failed:", error);
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
  }

// PUT /api/products/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
      },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
