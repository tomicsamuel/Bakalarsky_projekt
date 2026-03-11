'use client';

import './animated-background.css';

export default function AnimatedBackground() {
  return (
    <div className="animated-bg" aria-hidden="true">
      <div className="bg-gradient" />
      <div className="bg-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
        <div className="shape shape-4" />
      </div>
      <div className="bg-grid" />
    </div>
  );
}


