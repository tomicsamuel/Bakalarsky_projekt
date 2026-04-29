// API endpoint na ukladanie výsledkov do databázy
// Volá sa z frontendu po kliknutí na "Zobraziť výsledky"

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Typ pre dáta, ktoré prídu z frontendu
type SaveResultsRequest = {
  name: string;
  email: string;
  school: string;
  location?: string | null;
  age?: number | null;
  wantsToStudyAtTUKE?: boolean | null;
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

    const userDataPayload = {
      name: data.name,
      email,
      school: data.school,
      location: data.location?.trim() || null,
      age: data.age ?? null,
      wantsToStudyAtTUKE: data.wantsToStudyAtTUKE ?? null,
      howDidYouHear: data.howDidYouHear || [],
      howDidYouHearOther: data.howDidYouHearOther || null,
      whyThisSchool: data.whyThisSchool || [],
      expectations: data.expectations || [],
      interests: data.interests,
      experience: data.experience,
      consentGivenAt: new Date(),
    };

    let user: { id: number };

    if (data.accountId) {
      const account = await prisma.account.findUnique({
        where: { id: data.accountId },
      });
      if (!account || account.email.trim().toLowerCase() !== email) {
        return NextResponse.json(
          { success: false, error: 'Neplatný účet pre uloženie výsledkov.' },
          { status: 403 }
        );
      }

      const guestSameEmail = await prisma.user.findFirst({
        where: {
          email: { equals: email, mode: 'insensitive' },
          accountId: null,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (guestSameEmail) {
        await prisma.result.deleteMany({ where: { userId: guestSameEmail.id } });
        user = await prisma.user.update({
          where: { id: guestSameEmail.id },
          data: {
            ...userDataPayload,
            accountId: data.accountId,
          },
        });
      } else {
        // Prihlásený používateľ bez starého host záznamu alebo nový priebeh – nový riadok User (história testov)
        user = await prisma.user.create({
          data: {
            ...userDataPayload,
            accountId: data.accountId,
          } as Parameters<typeof prisma.user.create>[0]['data'],
        });
      }
    } else {
      // Host bez účtu: duplicitný email blokujeme (okrem merge vyššie po registrácii)
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

      user = await prisma.user.create({
        data: {
          ...userDataPayload,
          accountId: null,
        } as Parameters<typeof prisma.user.create>[0]['data'],
      });
    }

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

