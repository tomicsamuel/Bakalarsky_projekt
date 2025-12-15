import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const field = searchParams.get('field');

    if (!name || !field) {
      return NextResponse.json(
        { success: false, error: 'Názov a odbor sú povinné' },
        { status: 400 }
      );
    }

    const program = await prisma.program.findFirst({
      where: {
        name: name,
        field: field,
      },
    });

    if (!program) {
      return NextResponse.json(
        { success: false, error: 'Program nebol nájdený' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      program,
    });

  } catch (error) {
    console.error('Chyba pri načítaní programu:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri načítaní programu' },
      { status: 500 }
    );
  }
}



