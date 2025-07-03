import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// POST /api/orders
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const body = await req.json();

    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // 🟢 Fetch product prices
    const products = await prisma.product.findMany({
      where: {
        id: { in: body.items.map((item: any) => item.productId) },
      },
      select: { id: true, price: true },
    });

    // 🟢 Calculate total
    let total = 0;
    for (const item of body.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }
      total += product.price * item.quantity;
    }

    // 🟢 Create order with total
    const createdOrder = await prisma.order.create({
      data: {
        user: { connect: { id: decoded.userId } },
        business: { connect: { id: body.businessId } }, 
        shippingAddress: body.shippingAddress || "",
        status: "PENDING",
        total,
        orderItems: {
          create: body.items.map((item: any) => {
            const product = products.find((p) => p.id === item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product?.price || 0, 
            };
          }),
        },        
      },
      include: { orderItems: true },
    });
    
    

    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}


// GET /api/orders?userId=xyz
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId in query" }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: true,
        user: { select: { name: true, avatar: true } }, 
      },
    });
    

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// PUT /api/orders?id=xyz
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");
    const body = await req.json();

    if (!orderId || !body.status) {
      return NextResponse.json({ error: "Missing orderId or status" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: body.status },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Failed to update order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
