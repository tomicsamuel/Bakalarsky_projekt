import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth) {
    return NextResponse.json({ error: 'Neautorizovaný' }, { status: 401 });
  }
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
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

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth) {
    return NextResponse.json({ error: 'Neautorizovaný' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { title, content, summary, section, publishedAt } = body;
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'title a content sú povinné' },
        { status: 400 }
      );
    }
    const sectionVal = section === 'studijne' ? 'studijne' : 'aktivity';
    const post = await prisma.blogPost.create({
      data: {
        title: String(title).trim(),
        content: String(content).trim(),
        summary: summary != null ? String(summary).trim() || null : null,
        section: sectionVal,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Chyba pri vytváraní článku:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri vytváraní článku' },
      { status: 500 }
    );
  }
}
