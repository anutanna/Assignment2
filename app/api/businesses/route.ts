import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// GET /api/businesses → list all businesses
export async function GET() {
  try {
    const businesses = await prisma.business.findMany({
      select: { id: true, name: true }
    });
    return NextResponse.json(businesses, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch businesses" }, { status: 500 });
  }
}
