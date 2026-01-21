import { useRef, useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';

import background from '@assets/backgrounds/utama.png';
import road from '@assets/backgrounds/road.png';
import trial from '@assets/backgrounds/trial.png';
import door2 from '@assets/backgrounds/door2.png';
import scroll from '@assets/backgrounds/scroll2.png';
import Sign04 from '@assets/buttons/sign1.png';
import BlueInputBox from '@components/BlueInputBox';

export default function Login() {
    const trialRef = useRef(null);
    const rafRef = useRef(null);
    const scrollWrapperRef = useRef(null);
    const doorRef = useRef(null);
    const roadRef = useRef(null);

    const BASE_OFFSET = { x: 20, y: -260 };
    const OUT_OFFSET = { x: 20, y: 0 };
    const IN_OFFSET = OUT_OFFSET;

    const SCALE = {
        bg: { idle: 2.1, enter: 1.7, out: 1 },
        door: { enter: 1.55, idle: 2.1, in: 4.2, out: 1 },
        road: { enter: 1.55, idle: 2.1, in: 4.2, out: 1 },
        scroll: { enter: 0.6, idle: 1.0, in: 0.95, out: 0.5 },
    };

    const [isIntro, setIsIntro] = useState(true);
    const [cameraState, setCameraState] = useState('enter'); // enter | idle | in | out
    const [showColorFade, setShowColorFade] = useState(false);
    const [fadeScroll, setFadeScroll] = useState(false);

    const { data, setData, processing } = useForm({ username: '', password: '' });

    const getTransform = (type) => {
        const scale = SCALE[type][cameraState] ?? SCALE[type].idle;

        const offset =
            cameraState === 'out'
                ? OUT_OFFSET
                : cameraState === 'in'
                    ? IN_OFFSET
                    : BASE_OFFSET;

        return `translate(${offset.x}px, ${offset.y}px) scale(${scale})`;
    };

    // Parallax effect
    const handleMouseMove = (e) => {
        if (rafRef.current || isIntro || cameraState !== 'idle') return;

        rafRef.current = requestAnimationFrame(() => {
            if (!trialRef.current || !roadRef.current) return;

            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 50;
            const y = (e.clientY / innerHeight - 0.5) * 50;

            trialRef.current.style.transform = `translate(${x + BASE_OFFSET.x}px, ${y + BASE_OFFSET.y}px) scale(${SCALE.bg.idle})`;
            roadRef.current.style.transform = `translate(${x + BASE_OFFSET.x}px, ${y + BASE_OFFSET.y}px) scale(${SCALE.road.idle})`;

            rafRef.current = null;
        });
    };

    const handleMouseLeave = () => {
        if (!trialRef.current || !roadRef.current) return;
        trialRef.current.style.transform = getTransform('bg');
        roadRef.current.style.transform = getTransform('road');
    };

    const handleOutsideClick = (e) => {
        if (cameraState !== 'idle' || isIntro) return;
        if (!scrollWrapperRef.current?.contains(e.target)) {
            setCameraState('out');
            setTimeout(() => router.visit('/'), 1200);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (cameraState !== 'idle') return;

        setFadeScroll(true);
        setTimeout(() => setCameraState('in'), 500);
        setTimeout(() => setShowColorFade(true), 800);
        setTimeout(() => router.visit('/user/home'), 2000);
    };

    useEffect(() => {
        const t = setTimeout(() => {
            setIsIntro(false);
            setCameraState('idle');
        }, 0);

        return () => clearTimeout(t);
    }, []);

    // Reusable styles for transforms
    const bgStyle = { transform: getTransform('bg') };
    const doorStyle = { transform: getTransform('door') };
    const roadStyle = { transform: getTransform('road'), objectPosition: 'center bottom' };

    return (
        <>
            <Head title="Login" />
            <style>{`
                @keyframes swimRight { from { transform: translateX(-50vw); } to { transform: translateX(120vw); } }
                @keyframes swimLeft { from { transform: translateX(120vw) scaleX(-1); } to { transform: translateX(-50vw) scaleX(-1); } }
                .fish-swim-right { animation: swimRight 35s linear infinite; }
                .fish-swim-left { animation: swimLeft 40s linear infinite; }
                .cold-blue-filter { filter: brightness(0.85) contrast(1.1) saturate(0.8) hue-rotate(180deg) sepia(0.1); }
                .cold-blue-filter-light { filter: brightness(0.9) contrast(1.3) saturate(2); }
                .cold-blue-filter-door { filter: brightness(1) contrast(1.5) saturate(1.5); }
                .cold-blue-filter-scroll { filter: brightness(1.1) contrast(1) saturate(0.2) hue-rotate(220deg) sepia(0.2); }
            `}</style>

            <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleOutsideClick}
                className="relative w-full min-h-screen overflow-hidden bg-[#0a243b]"
            >
                {/* Overlays */}
                <div className="absolute inset-0 bg-[#0c365b]/20 z-15 pointer-events-none mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 to-blue-900/20 z-15 pointer-events-none mix-blend-color" />

                {/* Backgrounds */}
                <img src={background} alt="background" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                <img ref={roadRef} src={road} alt="road" className="absolute inset-0 w-full h-full object-cover z-5 transition-transform duration-1000 ease-in-out cold-blue-filter-light" style={roadStyle} />
                <img ref={trialRef} src={trial} alt="background" className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-1000 ease-in-out cold-blue-filter-light" style={bgStyle} />
                <img ref={doorRef} src={door2} alt="door" className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-1000 ease-in-out cold-blue-filter-door" style={doorStyle} />

                {/* Blur & glow overlays */}
                <div className="absolute inset-0 backdrop-blur-sm bg-black/10 z-20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-800/5 via-blue-900/10 to-indigo-900/15 z-25 pointer-events-none mix-blend-screen" />

                {/* Scroll & Form */}
                <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none" ref={scrollWrapperRef}>
                    <div
                        className="flex flex-col items-center justify-center transition-all duration-1500 ease-in-out"
                        style={{
                            transform: `scale(${SCALE.scroll[cameraState] ?? SCALE.scroll.idle})`,
                            opacity: fadeScroll ? 0 : (cameraState === 'enter' || cameraState === 'out' ? 0 : 1),
                            filter: cameraState === 'out' ? 'blur(8px)' : 'blur(0px)',
                            pointerEvents: cameraState === 'idle' ? 'auto' : 'none',
                            width: '520px',
                            maxHeight: '90vh',
                        }}
                    >
                        {/* Scroll Image with responsive scaling */}
                        <img
                            src={scroll}
                            alt="scroll"
                            className="
                                w-auto max-h-full object-contain cold-blue-filter-scroll origin-center
                                scale-125 sm:scale-170 md:scale-190
                            "
                        />

                        {/* Scroll Contents */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-12 md:px-0 text-[#0b3a66] gap-0 sm:gap-6">
                            <h1 className="font-serif font-extrabold tracking-wide drop-shadow-lg text-[2.5rem] sm:text-6xl sm:mb-4 text-center"
                                style={{ fontFamily: 'Cormorant Infant', color: '#0c365b', textShadow: '0 2px 10px rgba(12, 54, 91, 0.3), 0 0 20px rgba(96, 165, 250, 0.2)' }}>
                                Insert The Key
                            </h1>
                            <form onSubmit={handleSubmit} className="w-[70%] sm:w-[90%] max-w-105 flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="font-serif font-bold text-2xl sm:text-3xl" style={{ color: '#0c365b' }}>Username</label>
                                    <BlueInputBox value={data.username} onChange={(e) => setData('username', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-serif font-bold text-2xl sm:text-3xl" style={{ color: '#0c365b' }}>Password</label>
                                    <BlueInputBox type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                                </div>
                                <button type="submit" disabled={processing} className="mt-6 relative self-center transition-transform duration-300 hover:scale-110">
                                    <img src={Sign04} alt="Start" className="w-55 h-12.5 drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] cold-blue-filter-light" />
                                    <span className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold tracking-[2px]" style={{ color: '#e0f2fe', textShadow: '0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)' }}>
                                        Dive In
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 z-30 pointer-events-none mix-blend-lighten opacity-30">
                    <div className="absolute inset-0 bg-linear-to-b from-cyan-400/5 via-transparent to-blue-500/5" />
                </div>

                {/* Fade to Deep Blue */}
                <div className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-1000 ease-in-out" style={{ background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)', opacity: showColorFade ? 1 : 0 }} />
            </div>
        </>
    );
}
