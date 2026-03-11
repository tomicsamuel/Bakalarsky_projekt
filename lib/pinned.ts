const PINNED_KEY = 'fei_finder_pinned';

export function addToPinned(name: string, field: string): void {
  if (typeof window === 'undefined') return;
  const key = `${name}__${field}`;
  try {
    const raw = localStorage.getItem(PINNED_KEY);
    const set = new Set(raw ? (JSON.parse(raw) as string[]) : []);
    set.add(key);
    localStorage.setItem(PINNED_KEY, JSON.stringify([...set]));
  } catch {
    localStorage.setItem(PINNED_KEY, JSON.stringify([key]));
  }
}
