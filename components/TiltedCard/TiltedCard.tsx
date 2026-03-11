'use client';

import { useRef, useState, useCallback } from 'react';

import './tilted-card.css';

type TiltedCardProps = {
  children: React.ReactNode;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  className?: string;
};

export default function TiltedCard({
  children,
  rotateAmplitude = 12,
  scaleOnHover = 1.02,
  className = '',
}: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 2 * rotateAmplitude;
      const rotateX = (y - 0.5) * -2 * rotateAmplitude;

      setTransform({ rotateX, rotateY });
      setShinePos({ x: x * 100, y: y * 100 });
    },
    [rotateAmplitude, scaleOnHover]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setShinePos({ x: 50, y: 50 });
    setIsHovering(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tilted-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${isHovering ? scaleOnHover : 1})`,
      }}
    >
      <div className="tilted-card__inner">
        {children}
        {isHovering && (
          <div
            className="tilted-card__shine"
            style={{
              background: `radial-gradient(circle 80px at ${shinePos.x}% ${shinePos.y}%, rgba(255,255,255,0.4) 0%, transparent 100%)`,
            }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}
