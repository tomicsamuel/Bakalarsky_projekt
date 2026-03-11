// API endpoint na ukladanie výsledkov do databázy
// Volá sa z frontendu po kliknutí na "Zobraziť výsledky"

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Typ pre dáta, ktoré prídu z frontendu
type SaveResultsRequest = {
  name: string;
  email: string;
  school: string;
  howDidYouHear?: string[];
  howDidYouHearOther?: string | null;
  whyThisSchool?: string[];
  expectations?: string[];
  interests: string[];
  experience: string[];
  accountId?: number | null;
  results: Array<{
    programName: string;
    programField: string;
    score: number;
  }>;
};

// POST endpoint – uloží používateľa a jeho výsledky
export async function POST(request: NextRequest) {
  try {
    // 1) Načítame dáta z requestu
    const data: SaveResultsRequest = await request.json();

    const email = (data.email || '').trim().toLowerCase();
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email je povinný.' },
        { status: 400 }
      );
    }

    // 2) Kontrola: s týmto emailom už nebol dotazník odoslaný
    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'S týmto emailom ste už dotazník vyplnili. Prihláste sa pre zobrazenie výsledkov.',
          code: 'EMAIL_ALREADY_USED',
        },
        { status: 400 }
      );
    }

    // 3) Vytvoríme používateľa v databáze (súhlas so spracovaním evidujeme pri odoslaní)
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: email,
        school: data.school,
        howDidYouHear: data.howDidYouHear || [],
        howDidYouHearOther: data.howDidYouHearOther || null,
        whyThisSchool: data.whyThisSchool || [],
        expectations: data.expectations || [],
        interests: data.interests,
        experience: data.experience,
        accountId: data.accountId || null,
        consentGivenAt: new Date(),
      },
    });

    // 3) Pre každý výsledok:
    //    - Nájdeme alebo vytvoríme program
    //    - Uložíme výsledok
    const savedResults = await Promise.all(
      data.results.map(async (result) => {
        // Skúsime nájsť program v databáze
        let program = await prisma.program.findFirst({
          where: {
            name: result.programName,
            field: result.programField,
          },
        });

        // Ak program neexistuje, vytvoríme ho
        if (!program) {
          program = await prisma.program.create({
            data: {
              name: result.programName,
              field: result.programField,
            },
          });
        }

        // Uložíme výsledok (prepojenie user + program + skóre)
        return await prisma.result.create({
          data: {
            score: result.score,
            userId: user.id,
            programId: program.id,
          },
          include: {
            program: true, // Vrátime aj informácie o programe
          },
        });
      })
    );

    // 4) Vrátime úspešnú odpoveď
    return NextResponse.json({
      success: true,
      user,
      results: savedResults,
    });

  } catch (error) {
    // Ak sa niečo pokazí, vrátime chybu
    console.error('Chyba pri ukladaní výsledkov:', error);
    return NextResponse.json(
      { success: false, error: 'Nepodarilo sa uložiť výsledky' },
      { status: 500 }
    );
  }
}

// GET endpoint – získa všetky uložené výsledky (pre štatistiky)
export async function GET() {
  try {
    // Načítame všetkých používateľov s ich výsledkami
    const users = await prisma.user.findMany({
      include: {
        results: {
          include: {
            program: true, // Zahrnie aj info o programe
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Najnovšie hore
      },
      take: 50, // Max 50 najnovších
    });

    return NextResponse.json({ success: true, users });

  } catch (error) {
    console.error('Chyba pri načítaní výsledkov:', error);
    return NextResponse.json(
      { success: false, error: 'Nepodarilo sa načítať výsledky' },
      { status: 500 }
    );
  }
}

