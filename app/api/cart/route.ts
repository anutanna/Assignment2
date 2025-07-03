import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/cart?userId=xyz
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const body = await req.json();

    if (!userId || !body.productId || !body.quantity) {
      return NextResponse.json({ error: "Missing userId, productId, or quantity" }, { status: 400 });
    }

    // Upsert: update quantity if product already exists in cart, else add
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId: body.productId,
        },
      },
      update: { quantity: body.quantity },
      create: {
        userId,
        productId: body.productId,
        quantity: body.quantity,
      },
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}

// GET /api/cart?userId=xyz
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId in query" }, { status: 400 });
    }

    const items = await prisma.cartItem.findMany({
      where: { userId },
    });

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// DELETE /api/cart?userId=xyz&productId=abc
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const productId = searchParams.get("productId");

    if (!userId || !productId) {
      return NextResponse.json({ error: "Missing userId or productId" }, { status: 400 });
    }

    await prisma.cartItem.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });

    return NextResponse.json({ message: "Item removed from cart" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
