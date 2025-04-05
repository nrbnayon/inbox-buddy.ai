// app\(main)\chat\components\TypewriterEffect.jsx
'use client';

import { useState, useEffect } from 'react';

export default function TypewriterEffect() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="flex items-center gap-2">
      <span>Thinking{dots}</span>
      <span className="animate-pulse">▋</span>
    </span>
  );
}