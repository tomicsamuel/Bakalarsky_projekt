import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    const where = category ? { category } : {};

    const activities = await prisma.departmentActivity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    console.error('Chyba pri načítaní aktivít:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri načítaní aktivít' },
      { status: 500 }
    );
  }
}
