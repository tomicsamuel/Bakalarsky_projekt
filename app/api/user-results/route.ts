import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { success: false, error: 'AccountId je povinný' },
        { status: 400 }
      );
    }

    const lastTest = await prisma.user.findFirst({
      where: {
        accountId: parseInt(accountId),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        results: {
          include: {
            program: true,
          },
          orderBy: {
            score: 'desc',
          },
        },
      },
    });

    if (!lastTest) {
      return NextResponse.json({
        success: true,
        hasHistory: false,
      });
    }

    return NextResponse.json({
      success: true,
      hasHistory: true,
      data: {
        name: lastTest.name,
        email: lastTest.email,
        school: lastTest.school,
        howDidYouHear: lastTest.howDidYouHear || [],
        howDidYouHearOther: lastTest.howDidYouHearOther || '',
        whyThisSchool: lastTest.whyThisSchool || [],
        expectations: lastTest.expectations || [],
        interests: lastTest.interests,
        experience: lastTest.experience,
        results: lastTest.results.map(r => ({
          name: r.program.name,
          field: r.program.field,
          score: r.score,
          programId: r.programId,
        })),
      },
    });

  } catch (error) {
    console.error('Chyba pri načítaní histórie:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri načítaní histórie' },
      { status: 500 }
    );
  }
}

