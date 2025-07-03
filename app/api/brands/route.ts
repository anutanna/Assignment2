import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/brands → list all brands
export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      select: { id: true, name: true }
    });
    return NextResponse.json(brands, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}
