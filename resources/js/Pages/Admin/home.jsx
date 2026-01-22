import { useRef, useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

// --- IMPORTS ---
import UnderwaterEffect from '@components/UnderwaterEffect';
import background from '@assets/backgrounds/Background3.png';
import ButtonSidebar from '@components/ButtonSidebar';
import AdminSidebar from '@components/AdminSidebar';
// Import your new component here
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

    // Logout
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const toggleSidebar = () => {
        if (inputLocked || isLoggingOut) return;
        setIsSidebarOpen(prev => !prev);
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

    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);
        const zoomTimer = setTimeout(() => {
            setIsZooming(false);
            setInputLocked(false);
        }, 1800);

        // Function to skip intro
        const skipIntro = () => {
            clearTimeout(showTimer);
            clearTimeout(zoomTimer);
            setShowImage(true);
            setIsZooming(false);
            setInputLocked(false);
        };

        // Listen for key press (e.g., "Escape") to skip
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') skipIntro();
        };
        window.addEventListener('keydown', handleKeyDown);

        // Optional: listen for mouse click anywhere to skip
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

        /* Spring ease for toggle switch */
        .ease-spring {
            transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
    `;

    return (
        <>
            <Head title="Home" />
            <style>{styles}</style>

            <div className="relative w-full min-h-screen overflow-hidden">

                {/* INITIAL GRADIENT BACKGROUND */}
                <div
                    className={`
                        absolute inset-0
                        transition-opacity duration-700
                        ${showImage ? 'opacity-0' : 'opacity-100'}
                    `}
                    style={{ background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)' }}
                />

                {/* BACKGROUND IMAGE */}
                <img
                    ref={backgroundRef}
                    src={background}
                    alt="background"
                    onLoad={() => setImageLoaded(true)}
                    className={`
                        absolute inset-0 w-full h-full object-cover
                        pointer-events-none
                        transition-all duration-1500 ease-out
                        ${showImage && imageLoaded ? 'opacity-100' : 'opacity-0'}
                        ${!isZooming ? 'pulse-effect' : ''}
                        cold-blue-filter
                    `}
                    style={{
                        transform: showImage && imageLoaded
                            ? isZooming ? 'scale(1.5)' : 'scale(1.0)'
                            : 'scale(1.3)',
                        transformOrigin: 'center',
                    }}
                />

                {/* UNDERWATER EFFECT */}
                <UnderwaterEffect />

                {/* DARK VIGNETTE */}
                <div
                    className={`
                        absolute inset-0
                        bg-linear-to-b
                        from-black/25 via-transparent to-black/30
                        pointer-events-none
                        transition-opacity duration-1000
                        ${showImage && imageLoaded ? 'opacity-100' : 'opacity-0'}
                    `}
                />

                {/* SIDEBAR BUTTON */}
                <div
                    className={`
                        absolute top-6 left-6 z-60
                        transition-all duration-700 ease-out
                        ${!isZooming && !isLoggingOut
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-6 pointer-events-none'}
                    `}
                >
                    <ButtonSidebar onClick={toggleSidebar} />
                </div>

                {/* USER SIDEBAR */}
                <AdminSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                />

                {/* CENTER CONTENT */}
                <div
                    className={`
                        absolute inset-0
                        flex flex-col items-center justify-center
                        transition-all duration-1000
                        ${isZooming ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                    `}
                >
                    <div className="text-center md:px-4 relative z-10 mb-2">
                        <h1
                            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4"
                            style={{
                                fontFamily: 'Cormorant Infant, serif',
                                textShadow: '0 2px 20px rgba(0,0,0,.8)',
                            }}
                        >
                            Welcome back, {USER}
                        </h1>
                    </div>

                    {/* --- DASHBOARD CONTROL PANEL --- */}
                    <AdminDashboard />

                </div>

                {/* LOGOUT FADE */}
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