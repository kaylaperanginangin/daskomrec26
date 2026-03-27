import { useEffect, useRef, useMemo } from 'react';

export default function UnderwaterEffect({ isLoaded, isZooming }) {
    const containerRef = useRef(null);

    useEffect(() => {
        let rafId;
        const onMove = (e) => {
            if (!containerRef.current) return;

            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const x = e.clientX / window.innerWidth;
                const angle = (0.5 - x) * 30;

                containerRef.current.style.setProperty('--light-angle', `${angle}deg`);
            });
        };

        window.addEventListener('mousemove', onMove);
        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(rafId);
        };
    }, []);

    const particles = useMemo(() => {
        return [...Array(25)].map((_, i) => ({
            left: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 3}px`,
            duration: `${8 + Math.random() * 15}s`,
            delay: `-${Math.random() * 15}s`,
            opacity: 0.2 + Math.random() * 0.4
        }));
    }, []);

    if (isZooming) return null;

    const styles = `
        @keyframes floatUp {
            0% { transform: translateY(110vh); opacity: 0; }
            20% { opacity: var(--p-opacity); }
            80% { opacity: var(--p-opacity); }
            100% { transform: translateY(-10vh); opacity: 0; }
        }
        @keyframes godrayPulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.9; }
        }
    `;

    return (
        <>
            <div
                ref={containerRef}
                className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
                style={{
                    '--light-angle': '0deg',
                }}
            >
                <style>{styles}</style>


                {/* Darker Vignette */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 5, 20, 0.3) 100%)',
                        zIndex: 1
                    }}
                />

                {/* The godray */}
                <div
                    className="absolute inset-0"
                    style={{
                        zIndex: 2,
                        mixBlendMode: 'screen',
                        filter: 'blur(80px)',

                        background: `
                            conic-gradient(
                                from var(--light-angle) at 50% -20%,
                                transparent 0deg,
                                rgba(100, 220, 255, 0.1) 170deg,
                                rgba(180, 230, 255, 0.1) 180deg,
                                rgba(100, 220, 255, 0.1) 190deg,
                                transparent 255deg
                            )
                        `,
                        animation: 'godrayPulse 12s ease-in-out infinite'
                    }}
                />

                {/* Distorted Overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        zIndex: 3,
                        backdropFilter: 'url(#waterDistortion) blur(1px)',
                        WebkitBackdropFilter: 'url(#waterDistortion) blur(1px)',
                        background: 'rgba(0, 100, 200, 0.08)',
                        pointerEvents: 'none'
                    }}
                />

                {/* Particles */}
                <div className="absolute inset-0" style={{ zIndex: 4 }}>
                    {particles.map((p, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full"
                            style={{
                                left: p.left,
                                width: p.width,
                                height: p.width,
                                '--p-opacity': p.opacity,
                                opacity: 0,
                                boxShadow: '0 0 8px rgba(255,255,255,0.4)',
                                animation: `floatUp ${p.duration} linear infinite`,
                                animationDelay: p.delay,
                            }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
