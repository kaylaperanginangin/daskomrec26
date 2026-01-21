import { useState, useRef } from 'react';

import card_fem from '@assets/cards/Female_CAAS.png';
import card_boy from '@assets/cards/Male_CAAS.png';

export default function CardCaas({ sex, name, nim, cls, major }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const [bubbles, setBubbles] = useState([]);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = ((centerY - y) / centerY) * 5;

    setRotate({ x: rotateX, y: rotateY });
    setShinePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    setHovered(true); // show underwater light when cursor is detected
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setShinePos({ x: 50, y: 50 });
    setHovered(false); // hide light when cursor leaves
  };

  const handleClick = () => {
    setClicked(true);

    const newBubbles = Array.from({ length: 20 }, () => {
      const edge = Math.floor(Math.random() * 4);
      let left = 0;
      let bottom = 0;
      switch (edge) {
        case 0:
          left = Math.random() * 100;
          bottom = 100;
          break;
        case 1:
          left = 100;
          bottom = Math.random() * 100;
          break;
        case 2:
          left = Math.random() * 100;
          bottom = 0;
          break;
        case 3:
          left = 0;
          bottom = Math.random() * 100;
          break;
      }
      return {
        id: Math.random(),
        left,
        bottom,
        size: 5 + Math.random() * 12,
        duration: 2 + Math.random() * 2,
        driftX: (Math.random() - 0.5) * 50,
      };
    });

    setBubbles(prev => [...prev, ...newBubbles]);
    setTimeout(() => setClicked(false), 200);
  };

  const shadowX = rotate.y * 2;
  const shadowY = -rotate.x * 2 + 15;

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      className="relative w-full max-w-[250px] md:max-w-[380px] cursor-pointer rounded-xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        boxShadow: `${shadowX}px ${shadowY}px 30px rgba(0,0,0,0.6)`,
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <div
        className="w-full h-full rounded-xl relative overflow-hidden"
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${clicked ? 0.98 : 1})`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Card Image */}
        <img
          src={sex === 'female' ? card_fem : card_boy}
          alt={`${sex} CAAS card`}
          className="w-full h-full object-cover object-top rounded-xl"
        />

        {/* Underwater Lighting */}
        {hovered && (
          <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden">
            {/* Moving light rays */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.01), transparent 60%),
                             radial-gradient(circle at 70% 70%, rgba(255,255,255,0.03), transparent 60%)`,
                animation: 'light-move 20s linear infinite',
                backgroundSize: '300% 300%',
                mixBlendMode: 'screen',
              }}
            />

            {/* Shine that follows mouse */}
            <div
              className="absolute inset-0 pointer-events-none rounded-xl"
              style={{
                background: `radial-gradient(circle 150px at ${shinePos.x}% ${shinePos.y}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)`,
                transition: 'background 0.1s ease',
                mixBlendMode: 'screen',
              }}
            />
          </div>
        )}

        {/* Overlay Text */}
        <div
          className="absolute inset-0 flex flex-col justify-end items-start text-left text-[#7C5D12] font-bold z-10 ml-25 mb-19 sm:ml-38 sm:mb-30"
          style={{ fontFamily: 'Cormorant Infant, serif' }}
        >
          <p className="text-lg leading-[0.9] sm:text-xl sm:leading-[1.15]">{name}</p>
          <p className="text-lg leading-[0.9] sm:text-xl sm:leading-[1.15]">{nim}</p>
          <p className="text-lg leading-[0.9] sm:text-xl sm:leading-[1.15]">{cls}</p>
          <p className="text-lg leading-[0.9] sm:text-xl sm:leading-[1.15]">{major}</p>
        </div>

        {/* Bubble Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="bubble"
              style={{
                left: `${bubble.left}%`,
                bottom: `${bubble.bottom}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                animationDuration: `${bubble.duration}s`,
                transform: `translateX(0px)`,
                '--driftX': `${bubble.driftX}px`,
              }}
              onAnimationEnd={() =>
                setBubbles(prev => prev.filter(b => b.id !== bubble.id))
              }
            />
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        .bubble {
          position: absolute;
          background-color: rgba(255,255,255,0.6);
          border-radius: 50%;
          animation-name: bubble-rise;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: forwards;
        }

        @keyframes bubble-rise {
          0% {
            transform: translateX(0px) translateY(0px) scale(0.8);
            opacity: 0.6;
          }
          50% {
            transform: translateX(calc(var(--driftX)/2)) translateY(-60px) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translateX(var(--driftX)) translateY(-150px) scale(0.6);
            opacity: 0;
          }
        }

        @keyframes light-move {
            0% { background-position: 0% 0%, 100% 100%; }
            50% { background-position: 10% 10%, 90% 90%; }
            100% { background-position: 0% 0%, 100% 100%; }
        }
      `}</style>
    </div>
  );
}