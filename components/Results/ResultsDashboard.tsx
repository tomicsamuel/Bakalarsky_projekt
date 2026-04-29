import './results-dashboard.css';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';

import FiltersBar from './FiltersBar';
import ProgressUnlock from './ProgressUnlock';
import ConfidenceMeter from './ConfidenceMeter';
import DuelModal from '@/components/Duel/DuelModal';
import BracketProgress from '@/components/Duel/BracketProgress';
import ShelfView from '@/components/Shelf/ShelfView';
import RadarChart from '@/components/Radar/RadarChart';
import PackIntro from '@/components/Pack/PackIntro';
import PackOpening from '@/components/Pack/PackOpening';
import CardRevealGrid from '@/components/Pack/CardRevealGrid';
import SwipeDraft from '@/components/Pack/SwipeDraft';
import SwipeResult from '@/components/Pack/SwipeResult';
import RunoffIntro from '@/components/Runoff/RunoffIntro';
import RunoffArena from '@/components/Runoff/RunoffArena';
import RunoffResult from '@/components/Runoff/RunoffResult';
import type { BracketMatch } from '@/components/Duel/BracketProgress';

import {
  computeDuelQueue,
  resolveStep,
  explainLiked,
  type DuelStep,
} from '@/lib/swipeDraft';
import ExplainDrawer from './ExplainDrawer';

import { explainWhatIf, explainDuelWinner } from '@/lib/explain';
import { addToPinned } from '@/lib/pinned';
import { majorHasTag } from '@/lib/majorsMeta';
import { computeConfidence } from '@/lib/confidence';
import type { FilterState, ScoreResult } from '@/lib/types';

type PackPhase = 'intro' | 'opening' | 'swipe' | 'swipe_result' | 'runoff_intro' | 'final_boss' | 'runoff_bracket' | 'reveal' | 'done';

type RunoffBracketState = {
  candidates: ScoreResult[];
  winners: ScoreResult[];
  currentPair: [ScoreResult, ScoreResult];
};

type SwipeDuelQueue = {
  steps: DuelStep[];
  stepIndex: number;
  winners: ScoreResult[];
  finalDuel: boolean;
};

type ImpactChip = { label: string; tag?: string };

type SwipeResultState = {
  winner: ScoreResult;
  alternative: ScoreResult;
  explanation: string;
  superlikeName: string | null;
  reasons?: string[];
  impactChips?: ImpactChip[];
};

type Props = {
  baseResults: ScoreResult[]; // output from lib/scoring (sorted)
  completenessPercent: number; // PR7
  /** Bez prihlásenia – pred pack / shuffle uložiť stav pre registráciu */
  onGuestInteractive?: () => void;
};

function defaultFilter(): FilterState {
  return { emphasis: 50, toggles: {}, difficulty: 'mid' };
}

function applyWhatIf(base: ScoreResult[], filter: FilterState): ScoreResult[] {
  const emphasis = Math.max(0, Math.min(100, filter.emphasis));
  const factor = (emphasis - 50) / 50; // -1..+1

  const boosted = base.map((r) => {
    let bump = 0;
    if (filter.toggles.Bezpečnosť && majorHasTag(r, 'Bezpečnosť')) bump += 8;
    if (filter.toggles.Hardware && majorHasTag(r, 'Hardware')) bump += 8;
    if (filter.toggles['Kód'] && majorHasTag(r, 'Kód')) bump += 6;
    if (filter.toggles.Algoritmy && majorHasTag(r, 'Algoritmy')) bump += 6;
    if (filter.toggles.Sieťovanie && majorHasTag(r, 'Sieťovanie')) bump += 6;

    // emphasis scales bump slightly; base score remains dominant (so “not dramatic”).
    const scaled = bump * (0.6 + 0.4 * Math.max(0, factor + 1) / 2);
    return { ...r, score: Math.round(r.score + scaled) };
  });

  return boosted.sort((a, b) => b.score - a.score);
}

export default function ResultsDashboard({
  baseResults,
  completenessPercent,
  onGuestInteractive,
}: Props) {
  const [filter, setFilter] = useState<FilterState>(defaultFilter());
  const [debouncedFilter, setDebouncedFilter] = useState<FilterState>(filter);

  // Debounce slider/toggles changes (PR2).
  const debounceRef = useRef<number | null>(null);
  const liveClearRef = useRef<number | null>(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setDebouncedFilter(filter);
      setLiveAnnouncement('Poradie odborov prepočítané');
      if (liveClearRef.current) window.clearTimeout(liveClearRef.current);
      liveClearRef.current = window.setTimeout(() => setLiveAnnouncement(''), 2000);
    }, 120);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      if (liveClearRef.current) window.clearTimeout(liveClearRef.current);
    };
  }, [filter]);

  const prevRef = useRef<ScoreResult[]>(baseResults);
  const computed = useMemo(() => applyWhatIf(baseResults, debouncedFilter), [baseResults, debouncedFilter]);

  const explanation = useMemo(() => explainWhatIf({ prev: prevRef.current, next: computed, filter: debouncedFilter }), [computed, debouncedFilter]);
  useEffect(() => {
    prevRef.current = computed;
  }, [computed]);

  // Compare / Duel state (PR5) – pre Shelf (packPhase === 'done').
  const [compare, setCompare] = useState<ScoreResult[]>([]);
  const addToCompare = (r: ScoreResult) => {
    setCompare((prev) => {
      if (prev.find((x) => x.name === r.name && x.field === r.field)) return prev;
      if (prev.length >= 2) return [prev[1], r];
      return [...prev, r];
    });
  };
  const duelOpen = compare.length === 2;

  // Pack flow: Shortlist + Duel (2 sloty).
  const [duelSlots, setDuelSlots] = useState<[ScoreResult | null, ScoreResult | null]>([null, null]);
  const [packDuelOpen, setPackDuelOpen] = useState(false);
  const [duelScoreDeltas, setDuelScoreDeltas] = useState<Record<string, number>>({});
  const [duelConfidenceDelta, setDuelConfidenceDelta] = useState(0);
  const [duelWinnerMessage, setDuelWinnerMessage] = useState<{ winner: ScoreResult; reason: string } | null>(null);

  // Swipe draft flow
  const [swipeResult, setSwipeResult] = useState<SwipeResultState | null>(null);
  const [swipeDuelQueue, setSwipeDuelQueue] = useState<SwipeDuelQueue | null>(null);
  const [swipeOutcome, setSwipeOutcome] = useState<{
    liked: ScoreResult[];
    passed: ScoreResult[];
    superlike: ScoreResult | null;
  } | null>(null);
  const [finalBossCandidates, setFinalBossCandidates] = useState<[ScoreResult, ScoreResult] | null>(null);
  /** Vstupná obrazovka rozstrelu: kandidáti + režim (final_boss pre 0/2, bracket pre 3/4). */
  const [runoffIntroCandidates, setRunoffIntroCandidates] = useState<ScoreResult[] | null>(null);
  const [runoffIntroMode, setRunoffIntroMode] = useState<'final_boss' | 'bracket' | null>(null);
  /** Rozstrel turnaj pre 3 alebo 4 kandidátov – vždy RunoffArena, nie Duel. */
  const [runoffBracketState, setRunoffBracketState] = useState<RunoffBracketState | null>(null);

  /** Po dueloch: zoradenie podľa baseScore + duelScoreDeltas (Model A). */
  const displayResults = useMemo(() => {
    if (Object.keys(duelScoreDeltas).length === 0) return computed;
    return [...computed]
      .map((r) => {
        const key = `${r.name}__${r.field}`;
        const delta = duelScoreDeltas[key] ?? 0;
        return { ...r, score: Math.round(r.score + delta) };
      })
      .sort((a, b) => b.score - a.score);
  }, [computed, duelScoreDeltas]);

  const addToDuelSlot = (r: ScoreResult) => {
    setDuelSlots((prev) => {
      const key = `${r.name}__${r.field}`;
      const inA = prev[0]?.name === r.name && prev[0]?.field === r.field;
      const inB = prev[1]?.name === r.name && prev[1]?.field === r.field;
      if (inA) return [null, prev[1]];
      if (inB) return [prev[0], null];
      if (!prev[0]) return [r, prev[1]];
      if (!prev[1]) return [prev[0], r];
      return [prev[1], r];
    });
  };

  const handlePackDuelWinner = (winner: ScoreResult) => {
    if (swipeDuelQueue) {
      handleSwipeDuelWinner(winner);
      return;
    }
    const [a, b] = duelSlots;
    if (!a || !b) return;
    const loser = a.name === winner.name && a.field === winner.field ? b : a;
    const winnerKey = `${winner.name}__${winner.field}`;
    const loserKey = `${loser.name}__${loser.field}`;
    setDuelScoreDeltas((prev) => ({
      ...prev,
      [winnerKey]: (prev[winnerKey] ?? 0) + 1.5,
      [loserKey]: (prev[loserKey] ?? 0) - 0.5,
    }));
    setDuelConfidenceDelta((prev) => Math.min(100, prev + 5));
    addToPinned(winner.name, winner.field);
    setDuelSlots([null, null]);
    setPackDuelOpen(false);
    setDuelWinnerMessage({
      winner,
      reason: explainDuelWinner(winner),
    });
    setTimeout(() => setDuelWinnerMessage(null), 6000);
  };

  const handleSwipeDuelWinner = (winner: ScoreResult) => {
    if (!swipeDuelQueue || !swipeOutcome) return;
    const nextWinners = [...swipeDuelQueue.winners, winner];
    const nextIndex = swipeDuelQueue.stepIndex + 1;

    if (nextIndex < swipeDuelQueue.steps.length) {
      const nextStep = swipeDuelQueue.steps[nextIndex];
      const pair = resolveStep(nextStep, winner);
      if (pair) {
        setDuelSlots(pair);
        setSwipeDuelQueue({ ...swipeDuelQueue, winners: nextWinners, stepIndex: nextIndex });
        setPackDuelOpen(true);
        return;
      }
    }

    if (swipeDuelQueue.finalDuel && nextWinners.length === 2) {
      setDuelSlots([nextWinners[0], nextWinners[1]]);
      setSwipeDuelQueue({ ...swipeDuelQueue, winners: nextWinners, stepIndex: nextIndex });
      setPackDuelOpen(true);
      return;
    }

    const loser =
      duelSlots[0] && duelSlots[1]
        ? duelSlots[0].name === winner.name && duelSlots[0].field === winner.field
          ? duelSlots[1]
          : duelSlots[0]
        : winner;
    const winnerKey = `${winner.name}__${winner.field}`;
    setDuelScoreDeltas((prev) => ({ ...prev, [winnerKey]: (prev[winnerKey] ?? 0) + 1.5 }));
    const bracketReasons = [
      explainDuelWinner(winner),
      'Postup cez rozstrelový bracket.',
    ];
    setSwipeResult({
      winner,
      alternative: loser,
      explanation: explainLiked(swipeOutcome.liked, swipeOutcome.superlike),
      superlikeName: swipeOutcome.superlike?.name ?? null,
      reasons: bracketReasons,
      impactChips: [{ label: explainDuelWinner(winner) }, { label: 'Postup cez rozstrelový bracket.' }],
    });
    setSwipeDuelQueue(null);
    setSwipeOutcome(null);
    setDuelSlots([null, null]);
    setPackDuelOpen(false);
    setPackPhase('swipe_result');
    addToPinned(winner.name, winner.field);
    setDuelConfidenceDelta((prev) => Math.min(100, prev + 5));
  };

  const handleSwipeComplete = (outcome: {
    liked: ScoreResult[];
    passed: ScoreResult[];
    superlike: ScoreResult | null;
  }) => {
    setSwipeOutcome(outcome);

    if (outcome.liked.length === 0) {
      const [a, b] = top6.slice(0, 2);
      setRunoffIntroCandidates([a, b]);
      setRunoffIntroMode('final_boss');
      setPackDuelOpen(false);
      setSwipeDuelQueue(null);
      setDuelSlots([null, null]);
      setPackPhase('runoff_intro');
      return;
    }

    if (outcome.liked.length === 2) {
      setRunoffIntroCandidates([outcome.liked[0], outcome.liked[1]]);
      setRunoffIntroMode('final_boss');
      setPackDuelOpen(false);
      setSwipeDuelQueue(null);
      setDuelSlots([null, null]);
      setPackPhase('runoff_intro');
      return;
    }

    const resolution = computeDuelQueue(top6, outcome.liked, outcome.passed);

    if (resolution.fallbackWinner != null && resolution.fallbackAlternative != null) {
      const wk = `${resolution.fallbackWinner.name}__${resolution.fallbackWinner.field}`;
      setDuelScoreDeltas((prev) => ({ ...prev, [wk]: (prev[wk] ?? 0) + 1.5 }));
      setSwipeResult({
        winner: resolution.fallbackWinner,
        alternative: resolution.fallbackAlternative,
        explanation: explainLiked(outcome.liked, outcome.superlike),
        superlikeName: outcome.superlike?.name ?? null,
      });
      setPackPhase('swipe_result');
      addToPinned(resolution.fallbackWinner.name, resolution.fallbackWinner.field);
      setDuelConfidenceDelta((prev) => Math.min(100, prev + 5));
      return;
    }

    if (outcome.liked.length === 3 || outcome.liked.length === 4) {
      setRunoffIntroCandidates(outcome.liked);
      setRunoffIntroMode('bracket');
      setPackDuelOpen(false);
      setSwipeDuelQueue(null);
      setDuelSlots([null, null]);
      setPackPhase('runoff_intro');
      return;
    }

    setPackPhase('done');
  };

  // Confidence + duel (PR) + progress unlock (PR7).
  const completeness01 = Math.max(0, Math.min(1, completenessPercent / 100));
  const confidence = useMemo(
    () =>
      computeConfidence({
        completeness01,
        results: computed,
        duelDelta: duelConfidenceDelta,
      }),
    [completeness01, computed, duelConfidenceDelta]
  );
  const [explainResult, setExplainResult] = useState<{ result: ScoreResult; rank: number } | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'radar'>('cards');

  // Pack flow state (Fáza 1 – Card Pack Reveal) – vždy začíname animáciou
  const [packPhase, setPackPhase] = useState<PackPhase>('intro');

  const top6 = useMemo(() => computed.slice(0, 6), [computed]);

  const bracketMatches = useMemo((): BracketMatch[] => {
    if (!swipeDuelQueue) return [];
    const { stepIndex, finalDuel, winners } = swipeDuelQueue;
    const isFinal = finalDuel && winners.length === 2;
    const list: BracketMatch[] = [];
    if (finalDuel) {
      list.push({
        label: 'Semifinále 1',
        status: stepIndex > 0 ? 'done' : stepIndex === 0 ? 'active' : 'pending',
      });
      list.push({
        label: 'Semifinále 2',
        status: isFinal ? 'done' : stepIndex > 1 ? 'done' : stepIndex === 1 ? 'active' : 'pending',
      });
      list.push({ label: 'Finále', status: isFinal ? 'active' : 'pending' });
    } else {
      list.push({
        label: 'Semifinále',
        status: stepIndex > 0 ? 'done' : 'active',
      });
      list.push({
        label: 'Finále',
        status: stepIndex === 1 ? 'active' : stepIndex > 1 ? 'done' : 'pending',
      });
    }
    return list;
  }, [swipeDuelQueue]);

  return (
    <div className={`results-dashboard ${packPhase === 'done' || packPhase === 'reveal' ? 'results-dashboard--shuffle-bottom-safe' : ''}`}>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>
      {packPhase === 'done' ? (
        <>
          <CardRevealGrid
            results={computed}
            confidence={confidence}
            compare={compare}
            onCompare={addToCompare}
            onRevealComplete={() => {}}
            onExplain={(r, rank) => setExplainResult({ result: r, rank })}
            showDoneButton={false}
          />
          <div className="swipe-reveal-actions">
            <button
              type="button"
              className="swipe-reveal-actions__shuffle"
              onClick={() => {
                onGuestInteractive?.();
                setPackPhase('swipe');
              }}
            >
              Shuffle – vybrať záujmy znova
            </button>
          </div>
        </>
      ) : packPhase === 'intro' ? (
        <PackIntro
          confidence={confidence}
          onBeforeOpen={onGuestInteractive}
          onOpen={() => setPackPhase('opening')}
        />
      ) : packPhase === 'opening' ? (
        <PackOpening onComplete={() => setPackPhase('reveal')} />
      ) : packPhase === 'swipe' ? (
        <SwipeDraft top6={top6} onComplete={handleSwipeComplete} />
      ) : packPhase === 'runoff_intro' && runoffIntroCandidates && runoffIntroMode ? (
        <RunoffIntro
          candidates={runoffIntroCandidates}
          onStart={() => {
            if (runoffIntroMode === 'final_boss' && runoffIntroCandidates.length >= 2) {
              setFinalBossCandidates([runoffIntroCandidates[0], runoffIntroCandidates[1]]);
              setRunoffIntroCandidates(null);
              setRunoffIntroMode(null);
              setPackPhase('final_boss');
            } else if (runoffIntroMode === 'bracket' && runoffIntroCandidates.length >= 3) {
              const c = runoffIntroCandidates;
              const firstPair: [ScoreResult, ScoreResult] = [c[0], c[1]];
              setRunoffBracketState({
                candidates: c,
                winners: [],
                currentPair: firstPair,
              });
              setRunoffIntroCandidates(null);
              setRunoffIntroMode(null);
              setPackPhase('runoff_bracket');
            }
          }}
          onBackToSwipes={() => {
            setRunoffIntroCandidates(null);
            setRunoffIntroMode(null);
            setPackPhase('reveal');
          }}
        />
      ) : packPhase === 'final_boss' && finalBossCandidates ? (
        <RunoffArena
          left={finalBossCandidates[0]}
          right={finalBossCandidates[1]}
          onBack={() => {
            setFinalBossCandidates(null);
            setPackPhase('reveal');
          }}
          onComplete={(winner, alternative, reasons, impactChips) => {
            const winnerKey = `${winner.name}__${winner.field}`;
            setDuelScoreDeltas((prev) => ({ ...prev, [winnerKey]: (prev[winnerKey] ?? 0) + 1.5 }));
            setSwipeResult({
              winner,
              alternative,
              explanation: explainLiked(swipeOutcome?.liked ?? [], swipeOutcome?.superlike ?? null),
              superlikeName: swipeOutcome?.superlike?.name ?? null,
              reasons,
              impactChips,
            });
            setFinalBossCandidates(null);
            setPackPhase('swipe_result');
            addToPinned(winner.name, winner.field);
            setDuelConfidenceDelta((prev) => Math.min(100, prev + 5));
          }}
        />
      ) : packPhase === 'runoff_bracket' && runoffBracketState ? (
        <RunoffArena
          left={runoffBracketState.currentPair[0]}
          right={runoffBracketState.currentPair[1]}
          onBack={() => {
            setRunoffBracketState(null);
            setPackPhase('reveal');
          }}
          onComplete={(winner, alternative, reasons, impactChips) => {
            const { candidates, winners } = runoffBracketState;
            const newWinners = [...winners, winner];

            if (candidates.length === 3) {
              if (newWinners.length === 1) {
                setRunoffBracketState({
                  candidates,
                  winners: newWinners,
                  currentPair: [winner, candidates[2]],
                });
              } else {
                const winnerKey = `${winner.name}__${winner.field}`;
                setDuelScoreDeltas((prev) => ({ ...prev, [winnerKey]: (prev[winnerKey] ?? 0) + 1.5 }));
                setSwipeResult({
                  winner,
                  alternative,
                  explanation: explainLiked(swipeOutcome?.liked ?? [], swipeOutcome?.superlike ?? null),
                  superlikeName: swipeOutcome?.superlike?.name ?? null,
                  reasons,
                  impactChips,
                });
                setRunoffBracketState(null);
                setPackPhase('swipe_result');
                addToPinned(winner.name, winner.field);
                setDuelConfidenceDelta((prev) => Math.min(100, prev + 5));
              }
            } else {
              if (newWinners.length === 1) {
                setRunoffBracketState({
                  candidates,
                  winners: newWinners,
                  currentPair: [candidates[2], candidates[3]],
                });
              } else if (newWinners.length === 2) {
                setRunoffBracketState({
                  candidates,
                  winners: newWinners,
                  currentPair: [newWinners[0], newWinners[1]],
                });
              } else {
                const winnerKey = `${winner.name}__${winner.field}`;
                setDuelScoreDeltas((prev) => ({ ...prev, [winnerKey]: (prev[winnerKey] ?? 0) + 1.5 }));
                setSwipeResult({
                  winner,
                  alternative,
                  explanation: explainLiked(swipeOutcome?.liked ?? [], swipeOutcome?.superlike ?? null),
                  superlikeName: swipeOutcome?.superlike?.name ?? null,
                  reasons,
                  impactChips,
                });
                setRunoffBracketState(null);
                setPackPhase('swipe_result');
                addToPinned(winner.name, winner.field);
                setDuelConfidenceDelta((prev) => Math.min(100, prev + 5));
              }
            }
          }}
        />
      ) : packPhase === 'swipe_result' && swipeResult ? (
        swipeResult.reasons ? (
          <RunoffResult
            winner={swipeResult.winner}
            alternative={swipeResult.alternative}
            reasons={swipeResult.reasons}
            impactChips={swipeResult.impactChips}
            superlikeName={swipeResult.superlikeName}
            onBack={() => {
              setSwipeResult(null);
              setPackPhase('done');
            }}
            onTryAgain={() => {
              setSwipeResult(null);
              setPackPhase('swipe');
            }}
          />
        ) : (
          <SwipeResult
            winner={swipeResult.winner}
            alternative={swipeResult.alternative}
            explanation={swipeResult.explanation}
            superlikeName={swipeResult.superlikeName}
            reasons={swipeResult.reasons}
            onBack={() => {
              setSwipeResult(null);
              setPackPhase('done');
            }}
          />
        )
      ) : packPhase === 'reveal' ? (
        <>
          <CardRevealGrid
            results={computed}
            confidence={confidence}
            duelSlots={[null, null]}
            compare={compare}
            onCompare={addToCompare}
            onRevealComplete={() => setPackPhase('done')}
            onExplain={(r, rank) => setExplainResult({ result: r, rank })}
            showDoneButton={false}
          />
          <div className="swipe-reveal-actions">
            <button
              type="button"
              className="swipe-reveal-actions__shuffle"
              onClick={() => setPackPhase('swipe')}
            >
              Shuffle – vybrať záujmy
            </button>
          </div>
        </>
      ) : null}

      {explainResult && (
        <ExplainDrawer
          result={explainResult.result}
          rank={explainResult.rank}
          onClose={() => setExplainResult(null)}
        />
      )}

      {compare.length > 0 && (
        <div className="compare-bar" role="region" aria-label="Porovnanie">
          <span className="compare-bar__label">
            {compare.length === 1
              ? `${compare[0].name} — klikni na „Porovnať“ pri inom odbore a otvorí sa duel`
              : `${compare[0].name} × ${compare[1].name} — porovnanie je otvorené`}
          </span>
          <div className="compare-bar__actions">
            <button
              type="button"
              className="compare-bar__btn"
              onClick={() => setCompare([])}
            >
              Zrušiť
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {packDuelOpen && swipeDuelQueue && (
          <BracketProgress
            steps={swipeDuelQueue.steps}
            stepIndex={swipeDuelQueue.stepIndex}
            finalDuel={swipeDuelQueue.finalDuel}
            winnersCount={swipeDuelQueue.winners.length}
            matches={bracketMatches}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {packDuelOpen && duelSlots[0] && duelSlots[1] && (
          <DuelModal
            key="pack-duel"
            left={duelSlots[0]}
            right={duelSlots[1]}
            onClose={() => setPackDuelOpen(false)}
            onPickWinner={handlePackDuelWinner}
            leftRank={
              (computed.findIndex(
                (r) => r.name === duelSlots[0]?.name && r.field === duelSlots[0]?.field
              ) + 1) || 1
            }
            rightRank={
              (computed.findIndex(
                (r) => r.name === duelSlots[1]?.name && r.field === duelSlots[1]?.field
              ) + 1) || 2
            }
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!packDuelOpen && duelOpen && (
          <DuelModal
            key="compare-duel"
            left={compare[0]}
            right={compare[1]}
            onClose={() => setCompare([])}
            onPickWinner={(r) => {
              addToPinned(r.name, r.field);
              setCompare([]);
            }}
            leftRank={
              (computed.findIndex(
                (r) => r.name === compare[0]?.name && r.field === compare[0]?.field
              ) + 1) || 1
            }
            rightRank={
              (computed.findIndex(
                (r) => r.name === compare[1]?.name && r.field === compare[1]?.field
              ) + 1) || 2
            }
          />
        )}
      </AnimatePresence>

    </div>
  );
}

