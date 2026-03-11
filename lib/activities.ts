export type DepartmentActivity = {
  id: string;
  title: string;
  description: string;
  category: string;
  link?: string;
};

/** Kategórie pre filter na stránke Aktivity (zodpovedajú DB). */
export const ACTIVITY_CATEGORIES = [
  'Spolupráca',
  'Výskum',
  'Študenti',
  'Verejnosť',
  'Medzinárodné',
] as const;
