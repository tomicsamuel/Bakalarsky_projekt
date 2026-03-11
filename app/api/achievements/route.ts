import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const yearParam = searchParams.get('year');
    const year = yearParam ? parseInt(yearParam, 10) : undefined;

    const where: { category?: string; year?: number } = {};
    if (category) where.category = category;
    if (year !== undefined && !Number.isNaN(year)) where.year = year;

    const achievements = await prisma.studentAchievement.findMany({
      where,
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, data: achievements });
  } catch (error) {
    console.error('Chyba pri načítaní úspechov:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri načítaní úspechov' },
      { status: 500 }
    );
  }
}
