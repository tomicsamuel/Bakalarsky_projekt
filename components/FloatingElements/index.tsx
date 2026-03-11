'use client';

import { useEffect, useState } from 'react';
import './floating-elements.css';

interface FloatingElement {
  id: number;
  size: number;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
}

export default function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Vytvor 15 floating elementov
    const newElements: FloatingElement[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: 20 + Math.random() * 40,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.2,
    }));

    setElements(newElements);
  }, []);

  return (
    <div className="floating-elements-container" aria-hidden="true">
      {elements.map((element) => (
        <div
          key={element.id}
          className="floating-element"
          style={{
            width: `${element.size}px`,
            height: `${element.size}px`,
            left: `${element.left}%`,
            animationDelay: `${element.delay}s`,
            animationDuration: `${element.duration}s`,
            opacity: element.opacity,
          }}
        />
      ))}
    </div>
  );
}


