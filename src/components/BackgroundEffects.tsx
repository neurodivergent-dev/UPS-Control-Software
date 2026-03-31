import React, { useEffect, useState } from 'react';

const BackgroundEffects: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Glow Trail */}
      <div 
        className="glow-trail"
        style={{ 
          transform: `translate(${mousePos.x - 150}px, ${mousePos.y - 150}px)`,
        }}
      />

      {/* Grid System with Parallax */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          transform: `translate(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px)`,
        }}
      />

      {/* Floating Data Fragments */}
      <div className="absolute inset-0 data-stream-container opacity-10">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute data-stream-item text-[10px] font-mono text-accent whitespace-nowrap"
            style={{
              left: `${i * 20}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {Math.random().toString(16).substring(2, 10).toUpperCase()}
            <div className="w-px h-20 bg-gradient-to-b from-accent to-transparent mt-2 mx-auto" />
          </div>
        ))}
      </div>

      {/* Ambient Large Glows */}
      <div className="vibe-glow -left-[10%] -top-[10%] animate-pulse-glow" />
      <div className="vibe-glow -right-[10%] -bottom-[10%] animate-pulse-glow" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default BackgroundEffects;
