import React, { useState, useRef } from 'react';

// Assets
import Map from '@assets/map/map.webp';
import Euprus from '@assets/map/Territory/Euprus.webp';
import Northgard from '@assets/map/Territory/Northgard.webp';
import Thevia from '@assets/map/Territory/Thevia.webp';
import Xurith from '@assets/map/Territory/Xurith.webp';

const TERRITORIES = [
  {
    id: 'Northgard',
    src: Northgard,
    className: "w-[15%] h-[15%] left-[55%] top-[8%]"
  },
  {
    id: 'Euprus',
    src: Euprus,
    className: "w-[19%] h-[25.5%] left-[54.7%] top-[19.7%]"
  },
  {
    id: 'Thevia',
    src: Thevia,
    className: "w-[42%] h-[35%] left-[38.9%] top-[30%]"
  },
  {
    id: 'Xurith',
    src: Xurith,
    className: "w-[19%] h-[19%] left-[24.5%] top-[60.5%]"
  },
];

const MAX_ROTATION = 2;

export default function CoresMap({ territoryStates, onTerritoryClick }) {
  const [clickedId, setClickedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const containerRef = useRef(null);
  const imageRefs = useRef({});

  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;
    const xRot = (yPct - 0.5) * 2;
    const yRot = (xPct - 0.5) * 2;
    containerRef.current.style.setProperty('--rx', `${-xRot * MAX_ROTATION}deg`);
    containerRef.current.style.setProperty('--ry', `${yRot * MAX_ROTATION}deg`);
  };

  const handlePointerLeave = () => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty('--rx', '0deg');
    containerRef.current.style.setProperty('--ry', '0deg');
  };

  const isPixelOpaque = (img, clientX, clientY) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const rect = img.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) return false;

    const x = (clientX - rect.left) * (img.naturalWidth / rect.width);
    const y = (clientY - rect.top) * (img.naturalHeight / rect.height);
    canvas.width = 1; canvas.height = 1;

    try {
      ctx.drawImage(img, x, y, 1, 1, 0, 0, 1, 1);
      const alpha = ctx.getImageData(0, 0, 1, 1).data[3];
      return alpha > 10;
    } catch (err) { return false; }
  };

  const handleMapClick = (e) => {
    const reversedIds = TERRITORIES.map(t => t.id).reverse();
    for (const id of reversedIds) {
      const img = imageRefs.current[id];
      if (!img) continue;
      const rect = img.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        if (isPixelOpaque(img, e.clientX, e.clientY)) {
          setClickedId(id);
          setTimeout(() => setClickedId(null), 300);
          onTerritoryClick(id);
          return;
        }
      }
    }
  };

  const handlePointerMoveMap = (e) => {
    const reversedIds = TERRITORIES.map(t => t.id).reverse();
    for (const id of reversedIds) {
      const img = imageRefs.current[id];
      if (!img) continue;
      const rect = img.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
      ) {
        if (isPixelOpaque(img, e.clientX, e.clientY)) {
          setHoveredId(id);
          return;
        }
      }
    }
    setHoveredId(null);
  };

  const styles = `
      .map-container {
          --rx: 0deg;
          --ry: 0deg;
          perspective: 1200px;
      }
      .map-inner {
          transform: rotateX(var(--rx)) rotateY(var(--ry));
          transition: transform 0.2s ease-out;
          filter: drop-shadow(0 20px 30px rgba(0,0,0,0.3));
          background: #f4ecd8;
      }
      .paper-overlay {
          pointer-events: none;
          mix-blend-mode: multiply;
          opacity: 0.4;
      }
      .territory-stack img {
          pointer-events: none;
      }

      @keyframes breathe {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.9; }
      }
      .animate-breathe {
        animation: breathe 4s ease-in-out infinite;
        will-change: opacity;
      }
    `

  return (
    <>
      <style>{styles}</style>

      <svg className="hidden">
        <defs>
          <filter id="static-outline" x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="1" />

            <feColorMatrix
                in="DILATED"
                type="matrix"
                values="0 0 0 0 1
                        0 0 0 0 1
                        0 0 0 0 1
                        0 0 0 1 0"
                result="WHITE_SILHOUETTE"
            />

            <feMerge>
                <feMergeNode in="WHITE_SILHOUETTE" />
            </feMerge>

          </filter>

          <filter id="glow-outline" x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="3" />

            <feColorMatrix
                in="DILATED"
                type="matrix"
                values="0 0 0 0 1
                        0 0 0 0 1
                        0 0 0 0 1
                        0 0 0 1 0"
                result="WHITE_SILHOUETTE"
            />

            <feComposite in="WHITE_FLOOD" in2="DILATED" operator="in" result="WHITE_OUTLINE_SHAPE" />

            <feGaussianBlur in="WHITE_OUTLINE_SHAPE" stdDeviation="4" result="BLURRED_GLOW" />

            <feMerge>
              <feMergeNode in="BLURRED_GLOW" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>

          </filter>
        </defs>
      </svg>

      <div
        ref={containerRef}
        onPointerMove={(e) => {
            handlePointerMove(e);
            handlePointerMoveMap(e);
        }}
        onPointerLeave={() => {
            handlePointerLeave();
            setHoveredId(null);
        }}
        onClick={handleMapClick}
        className="map-container relative w-full max-w-[300px] sm:max-w-[600px] cursor-pointer select-none"
      >
        <div
          className="map-inner relative overflow-hidden rounded-sm border-8 border-[#3d2b1f]/10"
          style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' }}
        >
          <img src={Map} alt="Main Map" className="w-full h-auto block grayscale-[0.2] sepia-[0.2]" />
          <div className="paper-overlay absolute inset-0 z-20" />

          {TERRITORIES.map((t) => {
            const status = territoryStates[t.id];
            const isLocked = status === 'locked';

            const isHovered = hoveredId === t.id;
            const isAnimating = clickedId === t.id;
            const showGlow = isHovered || isAnimating;

            const isThevia = t.id === 'Thevia';
            const fitClass = isThevia ? 'object-fill' : 'object-contain';

            const imgClasses = `absolute inset-0 w-full h-full ${fitClass} transition-transform duration-300 ease-out origin-center`;

            return (
              <div
                key={t.id}
                className={`
                  absolute pointer-events-auto territory-stack transition-all duration-300 ease-out
                  ${t.className}
                  ${showGlow ? 'scale-105 z-30' : 'scale-100 z-10'}
                  ${isLocked ? 'grayscale' : 'grayscale-0'}
                `}
              >
                <img
                  src={t.src}
                  crossOrigin="anonymous"
                  style={{ filter: 'url(#static-outline)' }}
                  className={`${imgClasses} animate-breathe`}
                  alt=""
                />

                {/* Base Image (The Map Texture) */}
                <img
                  ref={el => imageRefs.current[t.id] = el}
                  src={t.src}
                  crossOrigin="anonymous"
                  className={`
                    ${imgClasses}
                    ${isLocked
                        ? 'brightness-75 contrast-100 opacity-100'
                        : 'sepia-[0.3] opacity-100'
                    }
                  `}
                  alt={t.id}
                />

                {/* Image */}
                <img
                  src={t.src}
                  crossOrigin="anonymous"
                  style={{ filter: 'url(#glow-outline)' }}
                  className={`
                    ${imgClasses}
                    ${showGlow ? 'opacity-100' : 'opacity-0'}
                    transition-opacity duration-300 ease-in-out
                    ${isLocked
                        ? 'brightness-100'
                        : 'sepia-0 brightness-110'
                    }
                  `}
                  aria-hidden="true"
                  alt=""
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
