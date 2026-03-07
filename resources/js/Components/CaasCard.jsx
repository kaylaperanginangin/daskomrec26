import { useState, useRef, useCallback, useMemo } from 'react';

import CardFem from '@assets/cards/Female_CAAS.webp';
import CardBoy from '@assets/cards/Male_CAAS.webp';

const MAX_ROTATION = 8;
const BUBBLE_COUNT = 15;

export default function CardCaas({ sex, name, nim, cls, major }) {
  const cardRef = useRef(null);
  const containerRef = useRef(null);

  const [bubbles, setBubbles] = useState([]);
  const [clicked, setClicked] = useState(false);

  const cardImage = useMemo(() => (sex === 'female' ? CardFem : CardBoy), [sex]);

  const handlePointerMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = x / rect.width;
    const yPct = y / rect.height;

    const xRot = (yPct - 0.5) * 2;
    const yRot = (xPct - 0.5) * 2;

    containerRef.current.style.setProperty('--rx', `${-xRot * MAX_ROTATION}deg`);
    containerRef.current.style.setProperty('--ry', `${yRot * MAX_ROTATION}deg`);
    containerRef.current.style.setProperty('--mx', `${xPct * 100}%`);
    containerRef.current.style.setProperty('--my', `${yPct * 100}%`);
    containerRef.current.style.setProperty('--opacity', '1');
  };

  const handlePointerLeave = () => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty('--rx', '0deg');
    containerRef.current.style.setProperty('--ry', '0deg');
    containerRef.current.style.setProperty('--opacity', '0');
  };

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    spawnBubbles();
    setTimeout(() => setClicked(false), 200);
  };

  const spawnBubbles = useCallback(() => {
    const newBubbles = Array.from({ length: BUBBLE_COUNT }, (_, i) => {
      const edge = Math.floor(Math.random() * 4);
      let left, top;

      switch (edge) {
        case 0:
            left = Math.random() * 100;
            top = 0;
            break; // Top
        case 1:
            left = 100;
            top = Math.random() * 100;
            break; // Right
        case 2:
            left = Math.random() * 100;
            top = 100;
            break; // Bottom
        case 3:
            left = -0;
            top = Math.random() * 100;
            break; // Left
        default:
            left = 0;
            top = 0;
      }
      return {
        id: Date.now() + i,
        left, top,
        size: 6 + Math.random() * 10,
        duration: 1 + Math.random() * 1.5,
        driftX: (Math.random() - 0.5) * 100,
        driftY: -50 - Math.random() * 100,
      };
    });
    setBubbles((prev) => [...prev, ...newBubbles]);
  }, []);

  return (
    <>
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="pearl-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" />
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
          </filter>
        </defs>
      </svg>

      <style>{`
        .card-container {
          --rx: 0deg;
          --ry: 0deg;
          --mx: 50%;
          --my: 50%;
          --opacity: 0;
          --scale: 1;
          perspective: 1000px;
        }

        .card-inner {
          transform: rotateX(var(--rx)) rotateY(var(--ry)) scale(var(--scale));
          transition: transform 0.2s cubic-bezier(0.1, 0.4, 0.3, 1);
          will-change: transform;
        }

        .card-foil {
          opacity: var(--opacity);
          transition: opacity 0.4s ease;
          mix-blend-mode: overlay;
          background-image: repeating-linear-gradient(
            115deg,
            transparent 0%,
            rgba(0, 255, 255, 0.15) 15%,
            rgba(160, 100, 255, 0.15) 25%,
            rgba(255, 255, 255, 0.3) 35%,
            rgba(160, 100, 255, 0.15) 45%,
            rgba(0, 255, 255, 0.15) 55%,
            transparent 70%
          );
          background-size: 250% 250%;
          background-position: calc(var(--mx) * 1.2) calc(var(--my) * 1.2);
          filter: url(#pearl-noise) brightness(1.1);
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
          /* More transparent/glassy bubble style */
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.1) 60%, rgba(255,255,255,0.4) 100%);
          box-shadow: inset 0 0 4px rgba(255,255,255,0.6), 0 2px 5px rgba(0,0,0,0.1);
          animation: floatBubble var(--dur) ease-out forwards;
          pointer-events: none;
          z-index: 50; /* Ensure it sits on top */
        }

        @keyframes floatBubble {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          20% { opacity: 1; transform: translate(0, 0) scale(1.1); }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
      `}</style>

      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        className="card-container relative w-full max-w-[320px] sm:max-w-100 cursor-pointer group select-none"
      >
        <div
          ref={cardRef}
          className="card-inner relative w-full h-full rounded-xl overflow-hidden shadow-2xl"
          style={{
             '--scale': clicked ? 0.96 : 1,
             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          <img
            src={cardImage}
            alt={name}
            className="w-full h-full object-cover pointer-events-none"
          />

          <div className="card-foil absolute inset-0 pointer-events-none z-10" />

          <div
            className="absolute inset-0 flex flex-col justify-end text-[#7C5D12] font-bold z-30 ml-32 mb-24 sm:ml-40 sm:mb-32 pointer-events-none"
            style={{ fontFamily: 'Cormorant Infant, serif' }}
          >
            {[name, nim, cls, major].map((text, idx) => (
              <p
                key={`${text}-${idx}`}
                className="text-lg leading-6 sm:text-xl sm:leading-6 drop-shadow-sm"
                style={{textShadow: '0 1px 4px rgba(255,255,255,0.7)'}}
              >
                {text}
              </p>
            ))}
          </div>
        </div>

        {/* Bubble bubble */}
        <div className="absolute inset-0 pointer-events-none z-50">
          {bubbles.map((b) => (
            <div
              key={b.id}
              className="bubble"
              style={{
                left: `${b.left}%`,
                top: `${b.top}%`,
                width: `${b.size}px`,
                height: `${b.size}px`,
                '--dur': `${b.duration}s`,
                '--dx': `${b.driftX}px`,
                '--dy': `${b.driftY}px`,
              }}
              onAnimationEnd={() =>
                setBubbles((prev) => prev.filter((item) => item.id !== b.id))
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}
