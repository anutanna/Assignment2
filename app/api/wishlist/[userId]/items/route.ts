import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: Add to wishlist
export async function POST(req: NextRequest, context: any) {
  const { params } = context as { params: { userId: string } };
  try {
    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const item = await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId: params.userId,
          productId,
        },
      },
      update: {},
      create: {
        userId: params.userId,
        productId,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
  }
}

// GET: View wishlist
export async function GET(req: NextRequest, context: any) {
  const { params } = context as { params: { userId: string } };
  try {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: params.userId },
    });
    return NextResponse.json(wishlist, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

// DELETE: Remove from wishlist
export async function DELETE(req: NextRequest, context: any) {
  const { params } = context as { params: { userId: string; productId: string } };
  try {
    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: params.userId,
          productId: params.productId,
        },
      },
    });
    return NextResponse.json({ message: "Removed from wishlist" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 });
  }
}
