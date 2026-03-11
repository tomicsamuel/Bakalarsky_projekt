import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id, 10);
    if (Number.isNaN(postId) || postId < 1) {
      return NextResponse.json({ success: false, error: 'Neplatné ID' }, { status: 400 });
    }
    const now = new Date();
    const post = await prisma.blogPost.findFirst({
      where: {
        id: postId,
        publishedAt: { not: null, lte: now },
      },
    });
    if (!post) {
      return NextResponse.json({ success: false, error: 'Článok nenájdený' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Chyba pri načítaní článku:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri načítaní článku' },
      { status: 500 }
    );
  }
}
