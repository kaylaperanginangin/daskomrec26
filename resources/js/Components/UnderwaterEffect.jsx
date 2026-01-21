import { useEffect, useState } from 'react';

export default function UnderwaterEffect({ isLoaded, isZooming }) {
    const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

    useEffect(() => {
        const onMove = (e) => {
            setMouse({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            });
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    // Disable everything until start animation finishes
    if (isZooming) return null;

    const styles = `
        @keyframes godrayPulse {
        0%, 100% { opacity: 0.45; }
        50% { opacity: 0.6; }
        }
    `;

    return (
        <>
            <style>{styles}</style>

            {/* SVG distortion filter */}
            <svg className="absolute inset-0 pointer-events-none">
                <filter id="waterDistortion">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.01 0.03"
                        numOctaves="2"
                        seed="2"
                    >
                        <animate
                            attributeName="baseFrequency"
                            dur="12s"
                            values="
                                0.01 0.03;
                                0.015 0.05;
                                0.01 0.03"
                            repeatCount="indefinite"
                        />
                    </feTurbulence>
                    <feDisplacementMap
                        in="SourceGraphic"
                        scale="20"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg>

            {/* Distortion overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    filter: 'url(#waterDistortion)',
                    opacity: 0.35,
                    transition: 'opacity 2s ease',
                }}
            />

            {/* Godray (mouse-following cone light) */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
                        conic-gradient(
                            from ${-30 + mouse.x * 60}deg at ${mouse.x * 100}% 0%,
                            rgba(200,230,255,0.45),
                            rgba(200,230,255,0.15) 20%,
                            rgba(200,230,255,0.05) 40%,
                            transparent 60%
                        )
                    `,
                    maskImage: `
                        radial-gradient(
                            ellipse at ${mouse.x * 100}% 0%,
                            rgba(255,255,255,1),
                            rgba(255,255,255,0.4) 40%,
                            transparent 70%
                        )
                    `,
                    WebkitMaskImage: `
                        radial-gradient(
                            ellipse at ${mouse.x * 100}% 0%,
                            rgba(255,255,255,1),
                            rgba(255,255,255,0.4) 40%,
                            transparent 70%
                        )
                    `,
                    filter: 'blur(30px)',
                    opacity: 0.3 + mouse.y * 0.05,
                    mixBlendMode: 'screen',
                    transition: 'opacity 0.2s ease',
                    animation: 'godrayPulse 6s ease-in-out infinite',
                }}
            />

            {/* Haze layer */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(
                            ellipse at top,
                            rgba(180,220,255,0.15),
                            transparent 70%
                        )
                    `,
                    filter: 'blur(80px)',
                    opacity: 0.4,
                }}
            />

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(25)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute top-0 rounded-full bg-cyan-200/40"
                        style={{
                            left: `${mouse.x * 100 + Math.sin(i) * 10}%`,
                            width: `${1 + Math.random() * 2}px`,
                            height: `${1 + Math.random() * 2}px`,
                            animation: `particlesFloat ${5 + i % 4}s linear infinite`,
                            boxShadow: '0 0 8px rgba(173,216,230,0.6)',
                        }}
                    />
                ))}
            </div>
        </>
    );
}
