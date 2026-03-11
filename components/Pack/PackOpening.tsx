'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import './pack.css';

const SHAKE_MS = 600;
const FLASH_MS = 150;
const OPEN_MS = 500;
const TOTAL_MS = SHAKE_MS + FLASH_MS + OPEN_MS + 400;

type Props = {
  onComplete: () => void;
};

export default function PackOpening({ onComplete }: Props) {
  const [phase, setPhase] = useState<'shake' | 'flash' | 'open' | 'done'>('shake');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('flash'), SHAKE_MS);
    const t2 = setTimeout(() => setPhase('open'), SHAKE_MS + FLASH_MS);
    const t3 = setTimeout(() => setPhase('done'), SHAKE_MS + FLASH_MS + OPEN_MS);
    const t4 = setTimeout(onComplete, TOTAL_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="pack-opening"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <motion.p
        className="pack-opening__guaranteed"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Zaručene: 1× Legendárna, 2× Epická, 3× Vzácna
      </motion.p>
      <motion.div
        className="pack-opening__pack"
        animate={
          phase === 'shake'
            ? {
                x: [0, -10, 10, -8, 8, -4, 4, 0],
                rotate: [0, -4, 4, -3, 3, -1, 1, 0],
                scale: [1, 1.03, 0.98, 1.02, 0.99, 1],
                transition: { duration: SHAKE_MS / 1000, ease: 'easeInOut' },
              }
            : phase === 'flash'
              ? { opacity: [1, 0.3, 1], transition: { duration: FLASH_MS / 1000 } }
              : phase === 'open' || phase === 'done'
                ? { scale: 1.2, opacity: 0, transition: { duration: OPEN_MS / 1000 } }
                : {}
        }
      >
        <span className="pack-opening__pack-inner" aria-hidden />
        <span className="pack-opening__pack-shine" aria-hidden />
      </motion.div>
      <AnimatePresence>
        {(phase === 'open' || phase === 'done') && (
          <motion.p
            className="pack-opening__hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Otváram…
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
