'use client';

import { useSyncExternalStore } from 'react';

/** Touch / užší viewport – nižší náklad na tiene, blur a layout animácie. */
function subscribe(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mq1 = window.matchMedia('(hover: none)');
  const mq2 = window.matchMedia('(max-width: 900px)');
  mq1.addEventListener('change', cb);
  mq2.addEventListener('change', cb);
  return () => {
    mq1.removeEventListener('change', cb);
    mq2.removeEventListener('change', cb);
  };
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return (
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(max-width: 900px)').matches
    );
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function usePreferLightweightUI(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
