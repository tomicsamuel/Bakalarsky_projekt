import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth) {
    return NextResponse.json({ error: 'Neautorizovaný' }, { status: 401 });
  }
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        results: {
          include: {
            program: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Chyba pri načítaní používateľov:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri načítaní používateľov' },
      { status: 500 }
    );
  }
}
