'use client';

import { useEffect, useState } from 'react';
import './confetti.css';

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export default function Confetti({ active, duration = 2000 }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
    color: string;
  }>>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    // Vytvor 50 confetti častíc
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 300,
      duration: duration + Math.random() * 500,
      color: ['#FFC44A', '#FF8A2A', '#E55B00', '#FFD65C', '#FF9A2A'][
        Math.floor(Math.random() * 5)
      ],
    }));

    setParticles(newParticles);

    // Vyčistiť po animácii
    const timer = setTimeout(() => {
      setParticles([]);
    }, duration + 1000);

    return () => clearTimeout(timer);
  }, [active, duration]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="confetti-container" aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.left}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}ms`,
            animationDuration: `${particle.duration}ms`,
          }}
        />
      ))}
    </div>
  );
}


