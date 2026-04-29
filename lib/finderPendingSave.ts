/** Dáta pre uloženie výsledkov – uloženia do sessionStorage pred presmerovaním na registráciu. */

const STORAGE_KEY = 'finder_pending_save_v1';

export type PendingFinderSavePayload = {
  name: string;
  email: string;
  school: string;
  location: string | null;
  age: number | null;
  wantsToStudyAtTUKE: boolean | null;
  howDidYouHear: string[];
  howDidYouHearOther: string | null;
  whyThisSchool: string[];
  expectations: string[];
  interests: string[];
  experience: string[];
  results: Array<{ programName: string; programField: string; score: number }>;
};

export function savePendingFinderResults(payload: PendingFinderSavePayload): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // úložisko nedostupné
  }
}

export function loadPendingFinderResults(): PendingFinderSavePayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingFinderSavePayload;
  } catch {
    return null;
  }
}

export function clearPendingFinderResults(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /**/
  }
}
