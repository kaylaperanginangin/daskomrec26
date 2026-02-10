import { useRef, useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

import UnderwaterEffect from '@components/UnderwaterEffect';
import background from '@assets/backgrounds/Background3.png';
import ButtonSidebar from '@components/ButtonSidebar';
import UserSidebar from   '@components/UserSidebar';
import Ship from '@assets/others/DECORATIONS/Shipwreck/18.png';
import Flag from '@assets/others/DECORATIONS/Shipwreck/19.png';
import Fish from '@assets/others/DECORATIONS/Fish & Other Sea Creatures/02-Fish.png';
import Leonidas from '@assets/others/LEONIDAS.png';

export default function Home() {
    const backgroundRef = useRef(null);
    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isZooming, setIsZooming] = useState(true);
    const [inputLocked, setInputLocked] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const toggleSidebar = () => {
        if (inputLocked || isLoggingOut) return;
        setIsSidebarOpen(prev => !prev);
    };

    const handleLogout = () => {
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => {
            setIsLoggingOut(true);
            setTimeout(() => router.visit('/'), 1000);
        }, 350);
    };

    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);
        const zoomTimer = setTimeout(() => {
            setIsZooming(false);
            setInputLocked(false);
        }, 1800);

        const skipIntro = () => {
            clearTimeout(showTimer);
            clearTimeout(zoomTimer);
            setShowImage(true);
            setIsZooming(false);
            setInputLocked(false);
        };

        const handleKeyDown = (e) => { if (e.key === 'Escape') skipIntro(); };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', skipIntro);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(zoomTimer);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', skipIntro);
        };
    }, []);

    const styles = `
        @keyframes subtlePulse {
            0%,100% { opacity:1 }
            50% { opacity:.95 }
        }
        @keyframes nudgeHorizontal {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(15px); }
        }
        .cold-blue-filter {
            filter: brightness(1) contrast(.95) saturate(2.5) hue-rotate(25deg) sepia(.08);
        }
        .pulse-effect {
            animation: subtlePulse 3s ease-in-out infinite;
        }
        .animate-nudge {
            animation: nudgeHorizontal 1.5s ease-in-out infinite;
        }
        /* SHIPWRECK ANIMATION */
        @keyframes sway {
            0%, 100% { transform: rotate(-1deg) translateY(0); }
            50% { transform: rotate(1deg) translateY(-5px); }
        }
        .animate-sway {
            animation: sway 4s ease-in-out infinite;
        }
        
        /* FISH ANIMATION */
        @keyframes swimRight {
            from { transform: translateX(-20vw); }
            to { transform: translateX(120vw); }
        }
        @keyframes swimLeft {
            from { transform: translateX(120vw); }
            to { transform: translateX(-20vw); }
        }
        .fish-swim-right {
            animation: swimRight linear infinite;
        }
        .fish-swim-left {
            animation: swimLeft linear infinite;
        }
    `;

    return (
        <>
            <Head title="Home" />
            <style>{styles}</style>

            <div className="relative w-full min-h-screen overflow-hidden">
                {/* INITIAL GRADIENT BACKGROUND */}
                <div
                    className={`absolute inset-0 transition-opacity duration-700 ${showImage ? 'opacity-0' : 'opacity-100'}`}
                    style={{ background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)' }}
                />

                {/* BACKGROUND IMAGE */}
                <img
                    ref={backgroundRef}
                    src={background}
                    alt="background"
                    onLoad={() => setImageLoaded(true)}
                    className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-[1500ms] ease-out ${showImage && imageLoaded ? 'opacity-100' : 'opacity-0'} ${!isZooming ? 'pulse-effect' : ''} cold-blue-filter`}
                    style={{
                        transform: showImage && imageLoaded ? isZooming ? 'scale(1.5)' : 'scale(1.0)' : 'scale(1.3)',
                        transformOrigin: 'center',
                    }}
                />

                {/* FISH LAYER */}
                <div className={`absolute inset-0 z-5 pointer-events-none transition-all duration-1000 ${isZooming ? 'opacity-0' : 'opacity-100'}`}>
                    
                    <div className="absolute top-[20%] left-0 w-[8vw] md:w-[7vw] fish-swim-right opacity-60" style={{ animationDuration: '25s' }}>
                        <img src={Fish} className="w-full h-auto animate-sway" />
                    </div>

                    <div className="absolute top-[60%] left-0 w-[12vw] md:w-[9vw] fish-swim-right opacity-50" style={{ animationDuration: '35s', animationDelay: '2s' }}>
                        <img src={Fish} className="w-full h-auto animate-sway" style={{ filter: 'hue-rotate(30deg)' }} />
                    </div>

                    <div className="absolute top-[40%] left-0 w-[6vw] md:w-[6vw] fish-swim-left opacity-40" style={{ animationDuration: '40s', animationDelay: '5s' }}>
                        <img src={Fish} className="w-full h-auto animate-sway scale-x-[-1]" />
                    </div>

                    <div className="absolute top-[80%] left-0 w-[10vw] md:w-[8vw] fish-swim-right opacity-30 blur-[1px]" style={{ animationDuration: '30s', animationDelay: '10s' }}>
                        <img src={Fish} className="w-full h-auto animate-sway" />
                    </div>
                </div>

                {/* LEONIDAS */}
                <div className={`absolute inset-0 z-5 pointer-events-none transition-all duration-1000 ${isZooming ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="absolute bottom-[28%] left-[40%] w-[12%] md:w-[8%] lg:bottom-[16%] lg:left-[45%] lg:w-[6%] -translate-x-1/2">
                        <img 
                            src={Leonidas} 
                            alt="Leonidas Head" 
                            className="w-full h-auto object-contain drop-shadow-xl"
                        />
                    </div>
                </div>

                {/* DECORATION LAYER (SHIP & FLAG) */}
                <div className={`absolute inset-0 z-10 pointer-events-none transition-all duration-1000 ${isZooming ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
                    
                    <div className="absolute bottom-[-8%] left-[-7%] w-[60%] lg:bottom-[-16%] lg:left-[-4%] lg:w-[90%] max-w-[600px] -rotate-[6deg] origin-bottom-left">
                        <img 
                            src={Flag} 
                            alt="Broken Mast"
                            className="w-full h-auto animate-sway object-contain opacity-80"
                        />
                    </div>

                    <div className="absolute bottom-[-9%] right-[-14%] w-[60%] lg:bottom-[-25%] lg:right-[-10%] lg:w-[90%] max-w-[800px]">
                        <img 
                            src={Ship} 
                            alt="Shipwreck"
                            className="w-full h-auto animate-sway object-contain scale-x-[-1]"
                            style={{ 
                                animationDelay: '0.5s' 
                            }}
                        />
                    </div>

                </div>
                {/* UNDERWATER EFFECT */}
                <UnderwaterEffect />

                {/* DARK VIGNETTE */}
                <div className={`absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30 pointer-events-none transition-opacity duration-1000 ${showImage && imageLoaded ? 'opacity-100' : 'opacity-0'}`} />

                {/* SIDEBAR BUTTON & TEXT */}
                <div className={`absolute top-6 left-6 z-60 transition-all duration-700 ease-out flex items-center ${!isZooming && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6 pointer-events-none'}`}>
                    <ButtonSidebar onClick={toggleSidebar} />
                    <div className={`transition-all duration-500 ease-in-out ${!isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                         <div className="animate-nudge flex items-center mb-5 sm:mb-6">
                            <span className="text-7xl leading-none font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] pb-2">←</span>
                            <span className="text-lg md:text-xl pt-5 font-serif uppercase tracking-widest text-cyan-200/90 drop-shadow-md whitespace-nowrap">Dive in</span>
                        </div>
                    </div>
                </div>

                {/* USER SIDEBAR */}
                <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />

                {/* CENTER TEXT */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isZooming ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                    <div className="text-center md:px-4 relative z-20">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4" style={{ fontFamily: 'Cormorant Infant, serif', textShadow: '0 2px 20px rgba(0,0,0,.8)' }}>
                            Welcome To Atlantis
                        </h1>
                        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white" style={{ fontFamily: 'Cormorant Infant, serif', textShadow: '0 2px 20px rgba(0,0,0,.8)' }}>
                            Let The Deep Uncover Your Purpose
                        </h1>
                    </div>
                </div>

                {/* LOGOUT FADE */}
                <div className="fixed inset-0 z-70 pointer-events-none transition-opacity duration-1000 ease-in-out" style={{ background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)', opacity: isLoggingOut ? 1 : 0 }} />

                {/* INPUT LOCK OVERLAY */}
                {inputLocked && <div className="fixed inset-0 z-80 pointer-events-auto" />}

                {/* === FOOTER === */}
                <div className={`
                    absolute bottom-4 w-full text-center z-20 pointer-events-none
                    transition-opacity duration-1000 delay-500
                    ${isZooming ? 'opacity-0' : 'opacity-100'}
                `}>
                    <p className="text-white font-caudex text-[8px] md:text-xl tracking-widest drop-shadow-md">
                        @Atlantis.DLOR2026. All Right Served
                    </p>
                </div>

            </div>
        </>
    );
}