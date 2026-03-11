'use client';

import { useState, useEffect, type ReactNode } from 'react';
import './animated-stats.css';

interface AnimatedStatProps {
  number: number;
  label: string;
  suffix?: string;
  suffixIcon?: ReactNode;
}

function AnimatedStat({ number, label, suffix = '', suffixIcon }: AnimatedStatProps) {
  const [displayNumber, setDisplayNumber] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`stat-${label}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [label]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 60;
    const increment = number / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, number);
      setDisplayNumber(Math.floor(current));

      if (step >= steps) {
        setDisplayNumber(number);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, number]);

  return (
    <div className="animated-stat" id={`stat-${label}`}>
      <div className="stat-number">
        {displayNumber}{suffix}{suffixIcon}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function AnimatedStats() {
  return (
    <div className="animated-stats-container">
      <AnimatedStat number={12} label="študijných programov" />
      <AnimatedStat number={2} label="odbory" />
      <AnimatedStat number={2} label="minúty" />
    </div>
  );
}


