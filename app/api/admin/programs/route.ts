import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { validateProgramSubjectsInput } from '@/lib/programSubjectsValidate';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth) {
    return NextResponse.json({ error: 'Neautorizovaný' }, { status: 401 });
  }
  try {
    const programs = await prisma.program.findMany({
      orderBy: [{ field: 'asc' }, { name: 'asc' }],
    });
    return NextResponse.json({ success: true, data: programs });
  } catch (error) {
    console.error('Chyba pri načítaní programov:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri načítaní programov' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth) {
    return NextResponse.json({ error: 'Neautorizovaný' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, field, description, occupations, subjects } = body;
    if (!name || !field) {
      return NextResponse.json(
        { success: false, error: 'name a field sú povinné' },
        { status: 400 }
      );
    }
    let subjectsData: unknown = undefined;
    if (subjects !== undefined) {
      const v = validateProgramSubjectsInput(subjects);
      if (!v.ok) {
        return NextResponse.json({ success: false, error: v.error }, { status: 400 });
      }
      subjectsData = v.subjects;
    }
    const program = await prisma.program.create({
      data: {
        name: String(name).trim(),
        field: String(field).trim(),
        description: description != null ? String(description).trim() || null : null,
        occupations: occupations != null ? String(occupations).trim() || null : null,
        ...(subjectsData !== undefined
          ? {
              subjects:
                subjectsData === null ? Prisma.DbNull : (subjectsData as Prisma.InputJsonValue),
            }
          : {}),
      },
    });
    return NextResponse.json({ success: true, data: program });
  } catch (error) {
    console.error('Chyba pri vytváraní programu:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba pri vytváraní programu' },
      { status: 500 }
    );
  }
}
