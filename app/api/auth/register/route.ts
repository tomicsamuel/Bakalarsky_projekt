import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    const existingAccount = await prisma.account.findUnique({
      where: { email },
    });

    if (existingAccount) {
      return NextResponse.json(
        { success: false, error: 'Tento email je už zaregistrovaný. Prihláste sa.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const account = await prisma.account.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
      },
    });

  } catch (error) {
    console.error('Chyba pri registrácii:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri registrácii' },
      { status: 500 }
    );
  }
}



