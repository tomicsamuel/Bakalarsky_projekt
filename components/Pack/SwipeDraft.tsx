'use client';

import { useState, useCallback, useMemo } from 'react';
import { Undo2, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { usePreferLightweightUI } from '@/hooks/usePreferLightweightUI';

import SwipeCard from './SwipeCard';
import type { ScoreResult } from '@/lib/types';
import type { SwipeChoice } from '@/lib/swipeDraft';

import './swipe-draft.css';

type Props = {
  top6: ScoreResult[];
  onComplete: (outcome: {
    liked: ScoreResult[];
    passed: ScoreResult[];
    superlike: ScoreResult | null;
  }) => void;
};

type CardState = { result: ScoreResult; rank: number };

const STACK_VISIBLE_MAX = 4;

export default function SwipeDraft({ top6, onComplete }: Props) {
  const prefersLightUi = usePreferLightweightUI();
  const [stack, setStack] = useState<CardState[]>(() =>
    top6.map((r, i) => ({ result: r, rank: i + 1 }))
  );
  const [liked, setLiked] = useState<ScoreResult[]>([]);
  const [passed, setPassed] = useState<ScoreResult[]>([]);
  const [history, setHistory] = useState<{ result: ScoreResult; rank: number; choice: SwipeChoice }[]>([]);

  const currentIndex = top6.length - stack.length;
  const progress = `${currentIndex + 1}/${top6.length}`;

  const handleSwipe = useCallback(
    (choice: SwipeChoice) => {
      if (stack.length === 0) return;
      const { result, rank } = stack[stack.length - 1];
      setHistory((h) => [...h, { result, rank, choice }]);
      setStack((s) => s.slice(0, -1));
      const newLiked = choice === 'like' ? [...liked, result] : liked;
      const newPassed = choice === 'pass' ? [...passed, result] : passed;
      if (choice === 'like') setLiked((l) => [...l, result]);
      else setPassed((p) => [...p, result]);

      if (stack.length <= 1) {
        onComplete({ liked: newLiked, passed: newPassed, superlike: null });
      }
    },
    [stack, liked, passed, onComplete]
  );

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setStack((s) => [...s, { result: last.result, rank: last.rank }]);
    if (last.choice === 'like') setLiked((l) => l.filter((r) => r.name !== last.result.name || r.field !== last.result.field));
    else setPassed((p) => p.filter((r) => r.name !== last.result.name || r.field !== last.result.field));
  }, [history]);

  const stackForView = useMemo(
    () => (prefersLightUi ? stack.slice(-STACK_VISIBLE_MAX) : stack),
    [prefersLightUi, stack]
  );

  if (stack.length === 0) {
    return (
      <motion.div
        className="swipe-draft swipe-draft--complete"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <p className="swipe-draft__complete-text" aria-live="polite">
          Vyhodnocujem…
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="swipe-draft"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.p
        className="swipe-draft__progress"
        role="status"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {progress}
      </motion.p>
      <div className="swipe-draft__progress-bar" aria-hidden>
        <motion.span
          className="swipe-draft__progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / top6.length) * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        />
      </div>
      <motion.div
        className="swipe-draft__counters"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <span className="swipe-draft__counter swipe-draft__counter--like">
          ♥ {liked.length}
        </span>
        <span className="swipe-draft__counter swipe-draft__counter--pass">
          ✕ {passed.length}
        </span>
      </motion.div>

      <div className="swipe-draft__stack">
        <AnimatePresence initial={false}>
          {stackForView.map((item) => (
            <motion.div
              key={`${item.result.name}__${item.result.field}`}
              className="swipe-draft__card-wrap"
              {...(!prefersLightUi
                ? {
                    layout: true,
                    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
                  }
                : { transition: { type: 'spring' as const, stiffness: 400, damping: 38 } })}
              initial={false}
            >
              <SwipeCard
                result={item.result}
                rank={item.rank}
                onSwipe={handleSwipe}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        className="swipe-draft__actions"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, type: 'spring', stiffness: 300, damping: 26 }}
      >
        <button
          type="button"
          className="swipe-draft__btn swipe-draft__btn--undo"
          onClick={handleUndo}
          disabled={history.length === 0}
          aria-label="Vrátiť posledný swipe"
        >
          <Undo2 size={24} />
        </button>
        <button
          type="button"
          className="swipe-draft__btn swipe-draft__btn--pass"
          onClick={() => handleSwipe('pass')}
          aria-label="Pass"
        >
          <X size={28} />
        </button>
        <button
          type="button"
          className="swipe-draft__btn swipe-draft__btn--like"
          onClick={() => handleSwipe('like')}
          aria-label="Like"
        >
          <Heart size={28} />
        </button>
      </motion.div>
    </motion.div>
  );
}
