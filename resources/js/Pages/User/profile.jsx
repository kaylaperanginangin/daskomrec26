import { useRef, useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';

/* Background Assets */
import Background from '@assets/backgrounds/Alternate.webp';

/* Decor Assets */
import DecorRumput from '@assets/others/DECORATIONS/Seaweed & Coral Reefs/32.webp';

/* Button Components */
import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';

/* Other Components */
import CardCaas from '@components/CaasCard';
import UserSidebar from '@components/UserSidebar';
import UnderwaterEffect from '@components/UnderwaterEffect';

export default function Profile() {
    const backgroundRef = useRef(null);

    const {auth} = usePage().props;
    const user = auth.user;
    const profile= auth.profile|| {};

    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [inputLocked, setInputLocked] = useState(true);
    const [isCardPlacing, setIsCardPlacing] = useState(true);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const toggleSidebar = () => {
        if (inputLocked || isLoggingOut || isExiting) return;
        setIsSidebarOpen(prev => !prev);
    };

    const handleNavigate = (url) => {
        if (inputLocked || isLoggingOut || isExiting) return;

        setIsExiting(true);
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => router.visit(url), 1000);
    };

    const handleLogout = () => {
        if (inputLocked || isLoggingOut || isExiting) return;

        setInputLocked(true);
        setIsSidebarOpen(false);

        setTimeout(() => {
            setIsLoggingOut(true);
            setTimeout(() => router.post('/logout'), 1000);
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
            <Head title="Profile" />
            <style>{styles}</style>

            <div className="relative w-full min-h-screen overflow-hidden">

                {/* Filter */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)' }}
                />

                <div className="absolute inset-0 cold-blue-filter">
                    <img
                        ref={backgroundRef}
                        src={Background}
                        alt="background"
                        onLoad={() => setImageLoaded(true)}
                        className="w-full h-full object-cover pointer-events-none"
                        style={getBackgroundStyle()}
                    />
                </div>


                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
                    style={{
                        background: 'rgba(2, 99, 196, 0.2)'
                    }}
                />

                <UnderwaterEffect
                    isLoaded={showImage && imageLoaded}
                    isZooming={false}
                />

                {/* Vignette */}
                <div
                    className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30 pointer-events-none transition-opacity duration-1000"
                    style={{ opacity: showImage && imageLoaded ? 1 : 0 }}
                />

                {/* Rumput Laut */}
                <div className={`
                    absolute inset-0 z-20 pointer-events-none hidden md:block
                    transition-opacity duration-1000
                    ${isCardPlacing || isExiting || isLoggingOut ? 'opacity-0' : 'opacity-100'}
                `}>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[45vw] max-w-[620px] rotate-20 origin-bottom]">
                        <img
                            src={DecorRumput}
                            alt="Seaweed Left Back"
                            className="w-full h-auto seaweed-anim-2 brightness-75"
                        />
                    </div>
                    <div className="absolute bottom-[-15%] left-[-10%] w-[45vw] max-w-[580px] rotate-20 origin-bottom">
                        <img
                            src={DecorRumput}
                            alt="Seaweed Left Front"
                            className="w-full h-auto seaweed-anim-1"
                        />
                    </div>

                    <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] scale-x-[-1]">
                         <div className="absolute bottom-[-10%] left-[-40%] w-[45vw] max-w-[620px] rotate-20 origin-bottom">
                            <img
                                src={DecorRumput}
                                alt="Seaweed Right Back"
                                className="w-full h-auto seaweed-anim-2 opacity-80 brightness-75"
                            />
                        </div>
                        <div className="absolute bottom-[-25%] left-[-30%] w-[45vw] max-w-[580px] rotate-20 origin-bottom">
                            <img
                                src={DecorRumput}
                                alt="Seaweed Right Front"
                                className="w-full h-auto seaweed-anim-1 opacity-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Button */}
                <div
                    className={`absolute top-6 left-6 z-70 transition-all duration-700 ease-out
                        ${!inputLocked && !isLoggingOut && !isExiting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6 pointer-events-none'}`}
                >
                    <ButtonSidebar onClick={toggleSidebar} />
                </div>

                {/* Home Button */}
                <div
                    className={`absolute top-6 right-6 z-70 transition-all duration-700 ease-out
                        ${!inputLocked && !isLoggingOut && !isExiting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'}`}
                >
                    <ButtonHome onClick={() => handleNavigate('/User/home')} />
                </div>

                {/* Sidebar */}
                <UserSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                />

                {/* Card */}
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={getCardStyle()}
                >
                    <CardCaas
                        sex= {profile.gender?.toLowerCase() || 'male'}
                        name={profile.name|| "Unknown"}
                        nim={user.nim|| "0000000000"}
                        cls={profile.class|| "XX-49-00"}
                        major={profile.major|| "No Major"}
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
                    absolute bottom-4 w-full text-center z-40 pointer-events-none
                    transition-opacity duration-1000 delay-500
                    ${isCardPlacing || isExiting || isLoggingOut ? 'opacity-0' : 'opacity-100'}
                `}>
                    <p className="text-white font-caudex text-[10px] md:text-xl tracking-widest drop-shadow-md">
                        @Atlantis.DLOR2026. All Right Served
                    </p>
                </div>
            </div>
        </>
    );
}
