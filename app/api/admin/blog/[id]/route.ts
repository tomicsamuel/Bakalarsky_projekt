import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth) {
    return NextResponse.json({ error: 'Neautorizovaný' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const postId = parseInt(id, 10);
    if (Number.isNaN(postId) || postId < 1) {
      return NextResponse.json({ success: false, error: 'Neplatné ID' }, { status: 400 });
    }
    const body = await request.json();
    const updateData: { title?: string; content?: string; summary?: string | null; section?: string; publishedAt?: Date | null } = {};
    if (body.title !== undefined) updateData.title = String(body.title).trim();
    if (body.content !== undefined) updateData.content = String(body.content).trim();
    if (body.summary !== undefined) updateData.summary = body.summary === '' || body.summary == null ? null : String(body.summary).trim();
    if (body.section !== undefined) updateData.section = body.section === 'studijne' ? 'studijne' : 'aktivity';
    if (body.publishedAt !== undefined) updateData.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
    const post = await prisma.blogPost.update({
      where: { id: postId },
      data: updateData,
    });
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Chyba pri úprave článku:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri úprave článku' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth) {
    return NextResponse.json({ error: 'Neautorizovaný' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const postId = parseInt(id, 10);
    if (Number.isNaN(postId) || postId < 1) {
      return NextResponse.json({ success: false, error: 'Neplatné ID' }, { status: 400 });
    }
    await prisma.blogPost.delete({ where: { id: postId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Chyba pri mazaní článku:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri mazaní článku' },
      { status: 500 }
    );
  }
}
