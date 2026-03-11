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
    const programId = parseInt(id, 10);
    if (Number.isNaN(programId) || programId < 1) {
      return NextResponse.json({ success: false, error: 'Neplatné ID' }, { status: 400 });
    }
    const body = await request.json();
    const updateData: { name?: string; field?: string; description?: string | null; occupations?: string | null } = {};
    if (body.name !== undefined) updateData.name = String(body.name).trim();
    if (body.field !== undefined) updateData.field = String(body.field).trim();
    if (body.description !== undefined) updateData.description = body.description === '' || body.description == null ? null : String(body.description).trim();
    if (body.occupations !== undefined) updateData.occupations = body.occupations === '' || body.occupations == null ? null : String(body.occupations).trim();
    const program = await prisma.program.update({
      where: { id: programId },
      data: updateData,
    });
    return NextResponse.json({ success: true, data: program });
  } catch (error) {
    console.error('Chyba pri úprave programu:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri úprave programu' },
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
    const programId = parseInt(id, 10);
    if (Number.isNaN(programId) || programId < 1) {
      return NextResponse.json({ success: false, error: 'Neplatné ID' }, { status: 400 });
    }
    await prisma.program.delete({ where: { id: programId } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error && typeof error === 'object' && 'code' in error && error.code === 'P2003';
    if (msg) {
      return NextResponse.json(
        { success: false, error: 'Odbor sa nedá zmazať (existujú závislosti)' },
        { status: 400 }
      );
    }
    console.error('Chyba pri mazaní programu:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri mazaní programu' },
      { status: 500 }
    );
  }
}
