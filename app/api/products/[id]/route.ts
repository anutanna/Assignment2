import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ObjectId } from "mongodb";

// DELETE /api/products/:id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, context: any) {
  const { params } = context as { params: { id: string } };
  try {
    const objectId = new ObjectId(params.id);

    await prisma.productImage.deleteMany({ where: { productId: objectId.toString() } });
    await prisma.productToCategory.deleteMany({ where: { productId: objectId.toString() } });
    await prisma.orderItem.deleteMany({ where: { productId: objectId.toString() } });
    await prisma.product.delete({ where: { id: objectId.toString() } });

    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete failed:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

// PUT /api/products/:id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, context: any) {
  const { params } = context as { params: { id: string } };
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
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
