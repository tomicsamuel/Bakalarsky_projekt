'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@heroui/button';

import './pack.css';

type Props = {
  confidence: number;
  onOpen: () => void;
  /** Volané pred začatím animácie (napr. záloha dát pre registráciu). */
  onBeforeOpen?: () => void;
};

const SHAKE_DURATION_MS = 600;

export default function PackIntro({ confidence, onOpen, onBeforeOpen }: Props) {
  const [isShaking, setIsShaking] = useState(false);

  const handleOpenPack = () => {
    if (isShaking) return;
    onBeforeOpen?.();
    setIsShaking(true);
    setTimeout(() => {
      onOpen();
    }, SHAKE_DURATION_MS);
  };

  return (
    <motion.div
      className="pack-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="pack-intro__card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 24 }}
      >
        <h2 className="pack-intro__title">Tvoj pack je pripravený</h2>
        <p className="pack-intro__desc">
          Na základe odpovedí sme ti pripravili balíček odporúčaných odborov. Otvor ho a zisti, čo ti padne.
        </p>
        <p className="pack-intro__instruction" aria-hidden>
          Otvoríš balík, potom prejdeš kartami vľavo/vpravo a na konci ťa čaká rozstrel.
        </p>
        <div className="pack-intro__confidence" role="status">
          <span className="pack-intro__confidence-label">Istota odporúčania:</span>
          <span className="pack-intro__confidence-value">{confidence}%</span>
        </div>

        <div className="pack-intro__pack-wrap">
          <motion.button
            type="button"
            className="pack-intro__pack"
            onClick={handleOpenPack}
            disabled={isShaking}
            aria-label="Otvoriť balíček"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            animate={
              isShaking
                ? {
                    x: [0, -8, 8, -6, 6, -4, 4, 0],
                    rotate: [0, -3, 3, -2, 2, -1, 1, 0],
                    scale: [1, 1.02, 0.98, 1.02, 0.99, 1],
                    transition: { duration: SHAKE_DURATION_MS / 1000, ease: 'easeInOut' },
                  }
                : {}
            }
          >
            <span className="pack-intro__pack-inner" aria-hidden />
            <span className="pack-intro__pack-shine" aria-hidden />
          </motion.button>
        </div>

        <div className="pack-intro__actions">
          <Button
            type="button"
            color="primary"
            variant="solid"
            size="lg"
            onPress={handleOpenPack}
            isDisabled={isShaking}
            aria-label="Otvoriť balíček"
            className="pack-intro__btn pack-intro__btn--primary"
          >
            Otvoriť pack
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
