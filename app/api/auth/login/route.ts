import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { setAdminCookie, canSetAdminCookie } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const account = await prisma.account.findUnique({
      where: { email },
    });

    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Nesprávny email alebo heslo' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Nesprávny email alebo heslo' },
        { status: 401 }
      );
    }

    const isAdmin = Boolean((account as { isAdmin?: boolean }).isAdmin);
    const cookieCanBeSet = canSetAdminCookie();
    const response = NextResponse.json({
      success: true,
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        isAdmin,
      },
      cookieSet: isAdmin ? cookieCanBeSet : undefined,
    });
    if (isAdmin && cookieCanBeSet) {
      setAdminCookie(response, account.id);
    }
    return response;

  } catch (error) {
    console.error('Chyba pri prihlasovaní:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri prihlasovaní' },
      { status: 500 }
    );
  }
}



