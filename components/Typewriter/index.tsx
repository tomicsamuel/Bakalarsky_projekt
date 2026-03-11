'use client';

import { useState, useEffect } from 'react';
import './typewriter.css';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
}

export default function Typewriter({ text, speed = 50, className = '' }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, speed);

    return () => clearInterval(typeInterval);
  }, [text, speed]);

  return (
    <span className={`typewriter-text ${className}`}>
      {displayedText}
      {isTyping && <span className="typewriter-cursor">|</span>}
    </span>
  );
}


