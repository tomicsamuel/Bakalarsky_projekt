import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

const COOKIE_NAME = 'admin';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string | null {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 16) return null;
  return secret;
}

function sign(value: string): string {
  const secret = getSecret();
  if (!secret) return '';
  return createHmac('sha256', secret).update(value).digest('hex').slice(0, 32);
}

export function setAdminCookie(response: NextResponse, userId: number): void {
  if (!getSecret()) return;
  const value = `${userId}.${sign(String(userId))}`;
  response.cookies.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });
}

export function getAdminFromCookie(request: NextRequest): number | null {
  try {
    if (!getSecret()) return null;
    const cookie = request.cookies.get(COOKIE_NAME)?.value;
    if (!cookie) return null;
    const [idStr, sig] = cookie.split('.');
    if (!idStr || !sig) return null;
    const userId = parseInt(idStr, 10);
    if (Number.isNaN(userId) || userId < 1) return null;
    const expected = sign(String(userId));
    if (sig !== expected) return null;
    return userId;
  } catch {
    return null;
  }
}

export function canSetAdminCookie(): boolean {
  return getSecret() !== null;
}

export async function requireAdmin(
  request: NextRequest
): Promise<number | null> {
  return getAdminFromCookie(request);
}
