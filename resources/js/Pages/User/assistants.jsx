import { useRef, useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

/* Background Assets */
import Background from '@assets/backgrounds/Alternate.webp';

/* Decor Assets */
import DecorRumput from '@assets/others/DECORATIONS/Seaweed & Coral Reefs/32.webp';

/* Button Components */
import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';

/* Other Components */
import UserSidebar from '@components/UserSidebar';
import AssistantBook from '@components/AssistantBook';
import BookControls from '@components/BookControls';
import UnderwaterEffect from '@components/UnderwaterEffect';

export default function Assistants() {
    const backgroundRef = useRef(null);
    const bookControlRef = useRef(null);

    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [inputLocked, setInputLocked] = useState(true);
    const [isBookPlacing, setIsBookPlacing] = useState(true);

    const [pageIndex, setPageIndex] = useState(0);
    const totalIndices = 89 + 2;

    const [bookDim, setBookDim] = useState({ width: 300, height: 450 });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;

            let targetW, targetH;

            if (w < 768) {
                let mobileW = w * 0.85;

                if (mobileW * 1.5 > h * 0.60) {
                    mobileW = (h * 0.60) / 1.5;
                }

                targetW = mobileW;

                if (w < 385) {
                    targetW = Math.min(targetW, 280);
                } else {
                    targetW = Math.min(targetW, 400);
                }

                targetH = targetW * 1.5;

            } else {
                targetH = h * 0.65;
                targetW = targetH * 0.66;

                if (w < 1280) {
                    targetW = Math.min(targetW, 400);
                    targetH = targetW * 1.5;
                } else {
                    targetW = Math.min(targetW, 450);
                    targetH = targetW * 1.5;
                }
            }

            setBookDim({ width: targetW, height: targetH });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);

        const placeBookTimer = setTimeout(() => {
            setIsBookPlacing(false);
            setInputLocked(false);
        }, 100);

        const skipIntro = () => {
            clearTimeout(showTimer);
            clearTimeout(placeBookTimer);
            setShowImage(true);
            setIsBookPlacing(false);
            setInputLocked(false);
        };

        const handleKeyDown = e => e.key === 'Escape' && skipIntro();
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', skipIntro);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(placeBookTimer);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', skipIntro);
        };
    }, []);

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

    // Book Control
    const handlePrev = () => bookControlRef.current?.flipPrev();
    const handleNext = () => bookControlRef.current?.flipNext();

    const handleGoToPage = (val) => {
        let p = parseInt(val);
        if (isNaN(p)) p = 0;
        if (p < 0) p = 0;
        if (p >= totalIndices) p = totalIndices - 1;
        bookControlRef.current?.flip(p);
    };

    const onBookFlip = (index) => {
        setPageIndex(index);
    };

    const styles = `
        .cold-blue-filter {
            filter: brightness(1.1) contrast(1.2) saturate(1) hue-rotate(15deg) sepia(0);
        }
        .book-filter {
            filter: brightness(1.1) contrast(1) saturate(2) hue-rotate(0deg) sepia(0.2);
        }
        @keyframes floatBook {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        .animate-float {
            animation: floatBook 6s ease-in-out infinite;
        }

                /* --- ANIMASI DecorRumput --- */
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
        if (isExiting) { scale = 1; blur = 15; }
        return {
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
            transformOrigin: 'center',
            transition: 'transform 1s ease-in-out, filter 1s ease-in-out',
            objectPosition: 'center 10%',
        };
    };

    const getBookStyle = () => {
        let scale = 1;
        let translateY = 0;
        let opacity = 1;

        if (isBookPlacing) {
            scale = 1.5;
            translateY = 100;
            opacity = 0;
        }

        if (isExiting) {
            scale = 0.9;
            opacity = 0;
        }

        return {
            transform: `scale(${scale}) translateY(${translateY}px)`,
            opacity,
            transition: 'transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.8s ease-in-out',
        };
    };

    return (
        <>
            <Head title="Assistants" />
            <style>{styles}</style>
            <UnderwaterEffect
                isLoaded={showImage && imageLoaded}
                isZooming={false}
            />

            <div className="relative w-full h-dvh overflow-hidden flex flex-col items-center justify-between">

                {/* Background */}
                <div className="absolute inset-0 z-0" style={{ Background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)' }} />
                <div className="absolute inset-0 z-0 cold-blue-filter">
                    <img
                        ref={backgroundRef}
                        src={Background}
                        alt="Background"
                        onLoad={() => setImageLoaded(true)}
                        className="w-full h-full object-cover pointer-events-none"
                        style={getBackgroundStyle()}
                    />
                </div>
                <div className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000" style={{ Background: 'rgba(2, 99, 196, 0.2)' }} />
                <div className="absolute inset-0 z-20 bg-linear-to-b from-black/25 via-transparent to-black/30 pointer-events-none transition-opacity duration-1000" style={{ opacity: showImage && imageLoaded ? 1 : 0 }} />

                {/* Rumput Laut */}
                <div className={`absolute inset-0 z-20 pointer-events-none hidden md:block transition-opacity duration-1000 ${isBookPlacing || isExiting || isLoggingOut ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="absolute bottom-[-5%] left-[-10%] w-[45vw] max-w-[620px] rotate-20 origin-bottom]">
                        <img
                            src={DecorRumput}
                            alt="Seaweed Left Back"
                            className="w-full h-auto seaweed-anim-2 brightness-75"
                        />
                    </div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[45vw] max-w-[580px] rotate-20 origin-bottom">
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

                {/* Header */}
                <div className="relative z-50 w-full shrink-0 pt-0 md:pt-6 pb-2 px-4 flex flex-col items-center justify-center pointer-events-none">
                    {/* Title Text */}
                    <div className={`text-center font-extrabold transition-all duration-700 mt-24 md:mt-4
                        ${!inputLocked && !isLoggingOut && !isExiting ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
                        style={{ fontFamily: 'Cormorant Infant, serif' }}
                    >
                        <h1 className="text-lg sm:text-2xl md:text-3xl text-cyan-200/80 leading-tight uppercase tracking-widest drop-shadow-md">
                            Daskom Laboratory
                        </h1>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                            Assistants 2026
                        </h1>
                    </div>
                </div>


                {/* The Book */}
                <div className="relative z-40 flex-1 w-full flex items-center justify-center p-4">
                    <div
                        className={`transition-all duration-1000 book-filter ${!isBookPlacing && !isExiting ? 'animate-float' : ''}`}
                        style={getBookStyle()}
                    >
                        <div style={{ width: bookDim.width, height: bookDim.height }}>
                            <AssistantBook
                                ref={bookControlRef}
                                onPageChange={onBookFlip}
                                width={bookDim.width}
                                height={bookDim.height}
                            />
                        </div>
                    </div>
                </div>


                {/* The Book Controls */}
                <div className={`relative z-50 w-full shrink-0 flex justify-center pb-8 md:pb-10 transition-all duration-700
                    ${!inputLocked && !isLoggingOut && !isExiting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                    <BookControls
                        onPrev={handlePrev}
                        onNext={handleNext}
                        onGoToPage={handleGoToPage}
                        currentPage={pageIndex}
                        totalPages={totalIndices - 1}
                    />
                </div>

                {/* Navigation Buttons */}
                <div
                    className={`fixed top-6 left-6 z-70 transition-all duration-700 ease-out
                        ${!inputLocked && !isLoggingOut && !isExiting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6 pointer-events-none'}`}
                >
                    <ButtonSidebar onClick={toggleSidebar} />
                </div>

                <div
                    className={`fixed top-6 right-6 z-70 transition-all duration-700 ease-out
                        ${!inputLocked && !isLoggingOut && !isExiting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'}`}
                >
                    <ButtonHome onClick={() => handleNavigate('/User/home')} />
                </div>

                <UserSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                />

                <div
                    className="fixed inset-0 z-70 pointer-events-none transition-opacity duration-1000"
                    style={{
                        background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)',
                        opacity: isLoggingOut ? 1 : 0
                    }}
                />

                {inputLocked && <div className="fixed inset-0 z-80 pointer-events-auto" />}
            </div>
        </>
    );
}
