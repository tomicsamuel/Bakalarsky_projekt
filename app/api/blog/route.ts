import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section'); // "aktivity" | "studijne"
    const now = new Date();
    const where: { publishedAt: { not: null; lte: Date }; section?: string } = {
      publishedAt: { not: null, lte: now },
    };
    if (section === 'studijne' || section === 'aktivity') {
      where.section = section;
    }
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Chyba pri načítaní blogu:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri načítaní blogu' },
      { status: 500 }
    );
  }
}
