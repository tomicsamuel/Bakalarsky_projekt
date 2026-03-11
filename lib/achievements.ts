export type StudentAchievement = {
  id: string;
  title: string;
  description: string;
  studentName: string;
  category: string;
  year: number;
  link?: string;
};

export const ACHIEVEMENTS: StudentAchievement[] = [
  {
    id: '1',
    title: '1. miesto na celoštátnej súťaži v programovaní',
    description: 'Študent informatiky vyhral hlavnú kategóriu v celoštátnej súťaži stredoškolských a vysokoškolských tímov.',
    studentName: 'M. K.',
    category: 'Súťaže',
    year: 2024,
  },
  {
    id: '2',
    title: 'Stáž v Silicon Valley',
    description: 'Študentka absolvovala trojmesačnú stáž v technologickej spoločnosti v USA v rámci programu IAESTE.',
    studentName: 'A. S.',
    category: 'Stáže',
    year: 2024,
  },
  {
    id: '3',
    title: 'Publikácia na medzinárodnej konferencii',
    description: 'Študentský tím publikoval výsledky výskumu na medzinárodnej konferencii z oblasti kybernetickej bezpečnosti.',
    studentName: 'Tím KSI',
    category: 'Publikácie',
    year: 2023,
  },
  {
    id: '4',
    title: 'Víťazstvo v robotickej súťaži',
    description: 'Tím z FEI zvíťazil v kategórii autonomných robotov na slovenskej pretekoch.',
    studentName: 'Robotika FEI',
    category: 'Súťaže',
    year: 2023,
  },
  {
    id: '5',
    title: 'Úspešný štartup po štúdiu',
    description: 'Absolvent informatiky založil vlastnú IT firmu a zamestnal viacero bývalých spolužiakov.',
    studentName: 'J. T.',
    category: 'Projekty',
    year: 2023,
  },
];

export const ACHIEVEMENT_CATEGORIES = [...new Set(ACHIEVEMENTS.map((a) => a.category))];
export const ACHIEVEMENT_YEARS = [...new Set(ACHIEVEMENTS.map((a) => a.year))].sort((a, b) => b - a);
