import { useRef, useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

import UnderwaterEffect from '@components/UnderwaterEffect';
import background from '@assets/backgrounds/AssistantBackground.png';
import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';
import UserSidebar from '@components/UserSidebar';
import CardCaas from '@components/CaasCard';
import Rumput from '@assets/others/DECORATIONS/Seaweed & Coral Reefs/32.png';

export default function Home() {
    const backgroundRef = useRef(null);

    // Intro states
    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [inputLocked, setInputLocked] = useState(true);
    const [isCardPlacing, setIsCardPlacing] = useState(true);

    // Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Logout / Exit
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const toggleSidebar = () => {
        if (inputLocked || isLoggingOut) return;
        setIsSidebarOpen(prev => !prev);
    };

    const goHome = () => {
        if (inputLocked || isLoggingOut) return;
        setIsExiting(true);
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => router.visit('/user/home'), 1000);
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
        const placeCardTimer = setTimeout(() => {
            setIsCardPlacing(false);
            setInputLocked(false);
        }, 100);

        const skipIntro = () => {
            clearTimeout(showTimer);
            clearTimeout(placeCardTimer);
            setShowImage(true);
            setIsCardPlacing(false);
            setInputLocked(false);
        };

        const handleKeyDown = e => e.key === 'Escape' && skipIntro();
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', skipIntro);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(placeCardTimer);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', skipIntro);
        };
    }, []);

    const styles = `
        @keyframes subtlePulse {
            0%,100% { opacity:1 }
            50% { opacity:.95 }
        }

        .cold-blue-filter {
            filter:
                brightness(1.1)
                contrast(1.2)
                saturate(1)
                hue-rotate(15deg)
                sepia(0);
        }

        .pulse-effect {
            animation: subtlePulse 3s ease-in-out infinite;
        }

        /* --- ANIMASI RUMPUT --- */
        @keyframes swaySeaweed {
            0%, 100% { transform: rotate(-4deg); }
            50% { transform: rotate(4deg); }
        }
        
        .seaweed-anim-1 {
            animation: swaySeaweed 5s ease-in-out infinite;
            transform-origin: bottom center;
        }
        
        .seaweed-anim-2 {
            animation: swaySeaweed 7s ease-in-out infinite reverse; /* Gerakan berlawanan & lebih lambat */
            transform-origin: bottom center;
        }
    `;

    const getBackgroundStyle = () => {
        let scale = 1.1;
        let blur = showImage && imageLoaded ? 0 : 10;

        if (isExiting) {
            scale = 1;
            blur = 15;
        }

        return {
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
            transformOrigin: 'center',
            transition: 'transform 1s ease-in-out, filter 1s ease-in-out',
            objectPosition: 'center 10%',
        };
    };

    const getCardStyle = () => {
        let scale = isCardPlacing ? 1.8 : 1.0;
        let rotate = isCardPlacing ? -25 : -20;
        let opacity = isCardPlacing ? 0 : 1;

        if (isExiting) {
            opacity = 0;
            scale = 0.9;
        }

        return {
            transform: `scale(${scale}) rotate(${rotate}deg)`,
            opacity,
            transition: 'transform 1s ease-in-out, opacity 1s ease-in-out',
            perspective: '1000px',
        };
        
    };

    return (
        <>
            <Head title="Home" />
            <style>{styles}</style>

            <div className="relative w-full min-h-screen overflow-hidden">

                {/* Gradient base */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)' }}
                />

                {/* The filter  */}
                <div className="absolute inset-0 cold-blue-filter">
                    <img
                        ref={backgroundRef}
                        src={background}
                        alt="background"
                        onLoad={() => setImageLoaded(true)}
                        className="w-full h-full object-cover pointer-events-none"
                        style={getBackgroundStyle()}
                    />
                </div>
        
        
                {/* Blue opacity overlay */}
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
                    style={{
                        background: 'rgba(2, 99, 196, 0.2)', // deep blue
                    }}
                />

                {/* Underwater distortion */}
                <UnderwaterEffect
                    isLoaded={showImage && imageLoaded}
                    isZooming={false}
                />

                {/* Vignette */}
                <div
                    className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30 pointer-events-none transition-opacity duration-1000"
                    style={{ opacity: showImage && imageLoaded ? 1 : 0 }}
                />

                <div className={`absolute inset-0 z-20 pointer-events-none hidden md:block transition-opacity duration-1000 ${isCardPlacing ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[45vw] max-w-[620px] rotate-20 origin-bottom]">
                        <img 
                            src={Rumput} 
                            alt="Seaweed Left Back"
                            className="w-full h-auto seaweed-anim-2 brightness-75"
                        />
                    </div>
                    {/* Rumput Depan (Lebih kecil, gerakan normal) */}
                    <div className="absolute bottom-[-15%] left-[-10%] w-[45vw] max-w-[580px] rotate-20 origin-bottom">
                        <img 
                            src={Rumput} 
                            alt="Seaweed Left Front"
                            className="w-full h-auto seaweed-anim-1"
                        />
                    </div>


                    {/* --- KANAN (Dibalik / Mirror) --- */}
                    {/* Wrapper kanan menggunakan scale-x-[-1] untuk membalik posisi */}
                    <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] scale-x-[-1]">
                         {/* Rumput Belakang */}
                         <div className="absolute bottom-[-10%] left-[-40%] w-[45vw] max-w-[620px] rotate-20 origin-bottom">
                            <img 
                                src={Rumput} 
                                alt="Seaweed Right Back"
                                className="w-full h-auto seaweed-anim-2 opacity-80 brightness-75"
                            />
                        </div>
                        {/* Rumput Depan */}
                        <div className="absolute bottom-[-25%] left-[-30%] w-[45vw] max-w-[580px] rotate-20 origin-bottom">
                            <img 
                                src={Rumput} 
                                alt="Seaweed Right Front"
                                className="w-full h-auto seaweed-anim-1 opacity-100"
                            />
                        </div>
                    </div>

                </div>

                {/* Sidebar Button */}
                <div
                    className={`absolute top-6 left-6 z-60 transition-all duration-700 ease-out
                        ${!inputLocked && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6 pointer-events-none'}`}
                >
                    <ButtonSidebar onClick={toggleSidebar} />
                </div>

                {/* Home Button */}
                <div
                    className={`absolute top-6 right-6 z-60 transition-all duration-700 ease-out
                        ${!inputLocked && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'}`}
                >
                    <ButtonHome onClick={goHome} />
                </div>

                {/* Sidebar */}
                <UserSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                />

                {/* Card */}
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={getCardStyle()}
                >
                    <CardCaas
                        sex="male"
                        name="Jyothi Divyananda"
                        nim="101012400159"
                        cls="TT-48-02"
                        major="Teknik Telekomunikasi"
                    />
                </div>

                {/* Exit Fade */}
                <div
                    className="fixed inset-0 z-70 pointer-events-none transition-opacity duration-1000"
                    style={{
                        background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)',
                        opacity: isLoggingOut ? 1 : 0,
                    }}
                />

                {/* Input lock */}
                {inputLocked && (
                    <div className="fixed inset-0 z-80 pointer-events-auto" />
                )}

                {/* Footer */}
                <div className={`
                    absolute bottom-4 w-full text-center z-50 pointer-events-none
                    transition-opacity duration-1000 delay-500
                    ${isCardPlacing ? 'opacity-0' : 'opacity-100'}
                `}>
                    <p className="text-white font-caudex text-[10px] md:text-xl tracking-widest drop-shadow-md">
                        @Atlantis.DLOR2026. All Right Served
                    </p>
                </div>
            </div>
        </>
    );
}