import { useRef, useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

import UnderwaterEffect from '@components/UnderwaterEffect';
import background from '@assets/backgrounds/Background3.png';
import ButtonSidebar from '@components/ButtonSidebar';
import AdminSidebar from '@components/AdminSidebar';
import AdminDashboard from '@components/AdminDashboard';

export default function HomeAdmin() {
    const backgroundRef = useRef(null);
    const USER = 'Jyothi';

    // Intro states
    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isZooming, setIsZooming] = useState(true);
    const [inputLocked, setInputLocked] = useState(true);

    // Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Scroll State (To hide the arrow)
    const [hasScrolled, setHasScrolled] = useState(false);

    // Logout
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

    // Detect Scroll
    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        if (scrollTop > 50) {
            setHasScrolled(true);
        } else {
            setHasScrolled(false);
        }
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

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') skipIntro();
        };
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
        /* Left-Right Movement */
        @keyframes nudgeHorizontal {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(15px); }
        }
        /* Breathing (Scale + Opacity) */
        @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.7; }
        }
        .cold-blue-filter {
            filter: brightness(1) contrast(.95) saturate(2.5) hue-rotate(25deg) sepia(.08);
        }
        .pulse-effect {
            animation: subtlePulse 3s ease-in-out infinite;
        }
        /* Combine Nudge and Breathe */
        .animate-nudge {
            animation: nudgeHorizontal 1.5s ease-in-out infinite;
        }
    `;

    return (
        <>
            <Head title="Home" />
            <style>{styles}</style>

            <div className="fixed inset-0 w-full h-full bg-[#0a2a4a] text-white overflow-hidden">

                {/* Background Layer */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    {/* Gradient */}
                    <div
                        className={`absolute inset-0 transition-opacity duration-700 ${showImage ? 'opacity-0' : 'opacity-100'}`}
                        style={{ background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)' }}
                    />

                    {/* Image */}
                    <img
                        ref={backgroundRef}
                        src={background}
                        alt="background"
                        onLoad={() => setImageLoaded(true)}
                        className={`
                            absolute inset-0 w-full h-full object-cover transition-all duration-1500 ease-out
                            ${showImage && imageLoaded ? 'opacity-100' : 'opacity-0'}
                            ${!isZooming ? 'pulse-effect' : ''}
                            cold-blue-filter
                        `}
                        style={{
                            transform: showImage && imageLoaded ? (isZooming ? 'scale(1.5)' : 'scale(1.0)') : 'scale(1.3)',
                            transformOrigin: 'center',
                        }}
                    />

                    {/* Effects */}
                    <UnderwaterEffect />
                    <div className={`absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black/30 transition-opacity duration-1000 ${showImage && imageLoaded ? 'opacity-100' : 'opacity-0'}`} />
                </div>


                <div
                    className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden"
                    onScroll={handleScroll}
                >
                    <div className={`
                        w-full min-h-full flex flex-col items-center justify-start
                        pt-24 pb-32 px-4 md:px-8
                        transition-all duration-1000
                        ${isZooming ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                    `}>

                        {/* Header Text */}
                        <div className="text-center relative z-10 mb-8 mt-4 md:mt-10">
                            <h1
                                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight"
                                style={{
                                    fontFamily: 'Cormorant Infant, serif',
                                    textShadow: '0 2px 20px rgba(0,0,0,.8)'
                                }}
                            >
                                Welcome back, {USER}
                            </h1>
                            <h1
                                className="text-2xl md:text-3xl lg:text-5xl font-bold leading-tight"
                                style={{
                                    fontFamily: 'Cormorant Infant, serif',
                                    textShadow: '0 2px 20px rgba(0,0,0,.8)'
                                }}
                            >
                                Let The Deep Uncover Your Purpose
                            </h1>
                        </div>

                        {/* Dashboard Component */}
                        <AdminDashboard />

                    </div>
                </div>


                {/* Sidebar Button & Click Me Text */}
                <div className={`
                    absolute top-6 left-6 z-60
                    transition-all duration-700 ease-out
                    flex items-center
                    ${!isZooming && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6 pointer-events-none'}
                `}>

                    <ButtonSidebar onClick={toggleSidebar} />

                    {/* Animated Text - Hidden if sidebar open OR if scrolled */}
                    <div className={`
                        transition-all duration-500 ease-in-out
                        ${!isSidebarOpen && !hasScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}
                    `}>
                         <div className="animate-nudge flex items-center mb-5 sm:mb-6">
                            <span className="text-7xl leading-none font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] pb-2">
                                ←
                            </span>
                            <span className="text-lg md:text-xl pt-5 font-serif uppercase tracking-widest text-cyan-200/90 drop-shadow-md whitespace-nowrap">
                                Dive in
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sidebar Menu */}
                <AdminSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                />

                {/* Logout Fade Overlay */}
                <div
                    className="absolute inset-0 z-70 pointer-events-none transition-opacity duration-1000 ease-in-out"
                    style={{
                        background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)',
                        opacity: isLoggingOut ? 1 : 0
                    }}
                />

                {/* Input Lock Overlay */}
                {inputLocked && <div className="absolute inset-0 z-80 pointer-events-auto" />}

            </div>
        </>
    );
}
