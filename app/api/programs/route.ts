import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const field = searchParams.get('field');

    const where = field ? { field } : {};

    const programs = await prisma.program.findMany({
      where,
      orderBy: [{ field: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json({ success: true, data: programs });
  } catch (error) {
    console.error('Chyba pri načítaní programov:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri načítaní programov' },
      { status: 500 }
    );
  }
}
