import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verify, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

// Helper to extract the cart item ID from the URL
function getIdFromRequest(req: NextRequest): string | null {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  return id ?? null;
}

export async function PATCH(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = getIdFromRequest(req);
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  try {
    const decoded = verify(token, JWT_SECRET!) as CustomJwtPayload;
    const userId = decoded.userId;
    const { quantity }: { quantity: number } = await req.json();

    const updated = await prisma.cartItem.updateMany({
      where: { id, userId },
      data: { quantity },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: 'Item not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid token or request' }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = getIdFromRequest(req);
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  try {
    const decoded = verify(token, JWT_SECRET!) as CustomJwtPayload;
    const userId = decoded.userId;

    const deleted = await prisma.cartItem.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Item not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid token or request' }, { status: 401 });
  }
}
