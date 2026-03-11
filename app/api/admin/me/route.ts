import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const userId = await requireAdmin(request);
  if (!userId) {
    return NextResponse.json({ error: 'Neautorizovaný' }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
