import { useRef, useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

import UnderwaterEffect from '@components/UnderwaterEffect';
import background from '@assets/backgrounds/AssistantBackground.png';
import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';
import UserSidebar from '@components/UserSidebar';
import CardCaas from '@components/CaasCard';

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

    // Sidebar toggle
    const toggleSidebar = () => {
        if (inputLocked || isLoggingOut) return;
        setIsSidebarOpen(prev => !prev);
    };

    // Home navigation with exit animation
    const goHome = () => {
        if (inputLocked || isLoggingOut) return;
        setIsExiting(true);
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => router.visit('/user/home'), 1000);
    };

    // Logout handler
    const handleLogout = () => {
        setInputLocked(true);
        setIsSidebarOpen(false);

        setTimeout(() => {
            setIsLoggingOut(true);
            setTimeout(() => router.visit('/'), 1000);
        }, 350);
    };

    // Intro animation
    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);

        // Start card placing animation shortly after image shows
        const placeCardTimer = setTimeout(() => {
            setIsCardPlacing(false); // animation complete
            setInputLocked(false);   // unlock input after animation
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
                brightness(1)
                contrast(.95)
                saturate(2.5)
                hue-rotate(25deg)
                sepia(.08);
        }

        .pulse-effect {
            animation: subtlePulse 3s ease-in-out infinite;
        }
    `;

    const getBackgroundStyle = () => {
        let scale = 1.2;
        let blur = showImage && imageLoaded ? 0 : 10;

        if (isExiting) {
            scale = 1;        // zoom out
            blur = 15;          // blur more
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
        let scale = isCardPlacing ? 1.5 : 1.0;
        let rotate = isCardPlacing ? -25 : -21;
        let opacity = isCardPlacing ? 0 : 1;

        if (isExiting) {
            opacity = 0;   // fade out
            scale = 0.8;
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

                {/* INITIAL GRADIENT BACKGROUND */}
                <div
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{ background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)' }}
                />

                {/* BACKGROUND IMAGE */}
                <img
                    ref={backgroundRef}
                    src={background}
                    alt="background"
                    onLoad={() => setImageLoaded(true)}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none cold-blue-filter"
                    style={getBackgroundStyle()}
                />

                {/* UNDERWATER EFFECT */}
                <UnderwaterEffect
                    isLoaded={showImage && imageLoaded}
                    isZooming={false} // removed zoom
                />

                {/* DARK VIGNETTE */}
                <div
                    className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30 pointer-events-none transition-opacity duration-1000"
                    style={{ opacity: showImage && imageLoaded ? 1 : 0 }}
                />

                {/* SIDEBAR BUTTON */}
                <div
                    className={`absolute top-6 left-6 z-60 transition-all duration-700 ease-out
                        ${!inputLocked && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6 pointer-events-none'}`}
                >
                    <ButtonSidebar onClick={toggleSidebar} />
                </div>

                {/* HOME BUTTON */}
                <div
                    className={`absolute top-6 right-6 z-60 transition-all duration-700 ease-out
                        ${!inputLocked && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'}`}
                >
                    <ButtonHome onClick={goHome} />
                </div>

                {/* USER SIDEBAR */}
                <UserSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                />

                {/* CENTER CARD */}
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

                {/* LOGOUT / EXIT FADE */}
                <div
                    className="fixed inset-0 z-70 pointer-events-none transition-opacity duration-1000 ease-in-out"
                    style={{
                        background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)',
                        opacity: isLoggingOut ? 1 : 0,
                    }}
                />

                {/* INPUT LOCK OVERLAY */}
                {inputLocked && (
                    <div className="fixed inset-0 z-80 pointer-events-auto" />
                )}
            </div>
        </>
    );
}