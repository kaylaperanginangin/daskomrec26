import { useRef, useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";

/* Background Assets */
import Background from "@assets/backgrounds/Home.webp";

/* Decor Assets */
import DecorLeonidas from "@assets/others/LEONIDAS.webp";
import DecorShip from "@assets/others/DECORATIONS/Shipwreck/18.webp";
import DecorFlag from "@assets/others/DECORATIONS/Shipwreck/19.webp";
import DecorFish from "@assets/others/DECORATIONS/Fish & Other Sea Creatures/02-Fish.webp";

/* Other Components */
import UnderwaterEffect from "@components/UnderwaterEffect";
import ButtonSidebar from "@components/ButtonSidebar";
import UserSidebar from "@components/UserSidebar";

export default function Home() {
    const backgroundRef = useRef(null);
    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isZooming, setIsZooming] = useState(true);
    const [inputLocked, setInputLocked] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isFalling, setIsFalling] = useState(false);

    const toggleSidebar = () => {
        if (inputLocked || isLoggingOut) return;
        setIsSidebarOpen((prev) => !prev);
    };

    const handleLogout = () => {
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => {
            setIsLoggingOut(true);
            setTimeout(() => router.post("/logout"), 1000);
        }, 350);
    };

    const handleHeadClick = () => {
        console.log("Leonidas Head Clicked!");
    };

    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);

        const zoomTimer = setTimeout(() => {
            setIsZooming(false);
            setInputLocked(false);
            setIsFalling(true);
        }, 1800);

        const fallStopTimer = setTimeout(() => {
            setIsFalling(false);
        }, 1800 + 6500);

        const skipIntro = () => {
            clearTimeout(showTimer);
            clearTimeout(zoomTimer);
            clearTimeout(fallStopTimer);
            setShowImage(true);
            setIsZooming(false);
            setInputLocked(false);
            setIsFalling(false);
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") skipIntro();
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("click", skipIntro);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(zoomTimer);
            clearTimeout(fallStopTimer);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("click", skipIntro);
        };
    }, []);

    // --- TRAIL CONFIG ---
    const bubbles = useRef(
        [...Array(18)].map((_, i) => ({
            id: i,
            left: Math.random() * 40 + 30 + "%",
            size: Math.random() * 4 + 2 + "px",
            delay: Math.random() * 2 + "s",
            duration: Math.random() * 1.2 + 0.6 + "s",
        })),
    ).current;

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
        @keyframes sway {
            0%, 100% { transform: rotate(-1deg) translateY(0); }
            50% { transform: rotate(1deg) translateY(-5px); }
        }
        .animate-sway {
            animation: sway 4s ease-in-out infinite;
        }
        @keyframes swimRight {
            from { transform: translateX(-20vw); }
            to { transform: translateX(120vw); }
        }
        @keyframes swimLeft {
            from { transform: translateX(120vw); }
            to { transform: translateX(-20vw); }
        }
        .fish-swim-right { animation: swimRight linear infinite; }
        .fish-swim-left { animation: swimLeft linear infinite; }
    `;

    return (
        <>
            <Head title="Home" />
            <style>{styles}</style>
            <UnderwaterEffect />

            <div className="relative w-full min-h-screen overflow-hidden">
                <div
                    className={`absolute inset-0 transition-opacity duration-700 ${showImage ? "opacity-0" : "opacity-100"}`}
                    style={{
                        Background:
                            "linear-gradient(to bottom, #0a2a4a, #0c365b)",
                    }}
                />

                <img
                    ref={backgroundRef}
                    src={Background}
                    alt="Background"
                    onLoad={() => setImageLoaded(true)}
                    className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-[1500ms] ease-out ${showImage && imageLoaded ? "opacity-100" : "opacity-0"} ${!isZooming ? "pulse-effect" : ""} cold-blue-filter`}
                    style={{
                        transform:
                            showImage && imageLoaded
                                ? isZooming
                                    ? "scale(1.5)"
                                    : "scale(1.0)"
                                : "scale(1.3)",
                        transformOrigin: "center",
                    }}
                />

                {/* Le Fishe */}
                <div
                    className={`absolute inset-0 z-5 pointer-events-none transition-all duration-1000 ${isZooming ? "opacity-0" : "opacity-100"}`}
                >
                    <div
                        className="absolute top-[20%] left-0 w-[8vw] md:w-[7vw] fish-swim-right opacity-60"
                        style={{ animationDuration: "25s" }}
                    >
                        <img
                            src={DecorFish}
                            className="w-full h-auto animate-sway"
                        />
                    </div>
                    <div
                        className="absolute top-[60%] left-0 w-[12vw] md:w-[9vw] fish-swim-right opacity-50"
                        style={{
                            animationDuration: "35s",
                            animationDelay: "2s",
                        }}
                    >
                        <img
                            src={DecorFish}
                            className="w-full h-auto animate-sway"
                            style={{ filter: "hue-rotate(30deg)" }}
                        />
                    </div>
                    <div
                        className="absolute top-[40%] left-0 w-[6vw] md:w-[6vw] fish-swim-left opacity-40"
                        style={{
                            animationDuration: "40s",
                            animationDelay: "5s",
                        }}
                    >
                        <img
                            src={DecorFish}
                            className="w-full h-auto animate-sway scale-x-[-1]"
                        />
                    </div>
                </div>

                {/* Leonidas */}
                <div
                    className={`z-20 absolute inset-0 pointer-events-none transition-all duration-[1500ms] ease-out`}
                    style={{
                        transform:
                            showImage && imageLoaded
                                ? isZooming
                                    ? "scale(1.5)"
                                    : "scale(1.0)"
                                : "scale(1.3)",
                        transformOrigin: "center",
                    }}
                >
                    <div
                        onClick={handleHeadClick}
                        className={`
                            absolute bottom-[28%] left-[38%] w-[14%] md:w-[8%] lg:bottom-[18%] lg:left-[45%] lg:w-[5%] -translate-x-1/2
                            z-10 pointer-events-auto cursor-pointer
                            transition-opacity duration-300
                            ${!showImage ? "opacity-0" : "opacity-100"}
                        `}
                    >
                        <img
                            src={DecorLeonidas}
                            alt="Leonidas Head"
                            className="w-full h-auto object-contain blur-[1px] relative z-10"
                        />
                    </div>
                </div>

                {/* Decor */}
                <div
                    className={`absolute inset-0 z-10 pointer-events-none transition-all duration-1000 ${isZooming ? "opacity-0 scale-110" : "opacity-100 scale-100"}`}
                >
                    <div className="absolute bottom-[-8%] left-[-7%] w-[60%] lg:bottom-[-16%] lg:left-[-4%] lg:w-[90%] max-w-[600px] -rotate-[6deg] origin-bottom-left">
                        <img
                            src={DecorFlag}
                            alt="Broken Mast"
                            className="w-full h-auto animate-sway object-contain opacity-80"
                        />
                    </div>
                    <div className="absolute bottom-[-9%] right-[-14%] w-[60%] lg:bottom-[-25%] lg:right-[-10%] lg:w-[90%] max-w-[800px]">
                        <img
                            src={DecorShip}
                            alt="Shipwreck"
                            className="w-full h-auto animate-sway object-contain scale-x-[-1]"
                            style={{ animationDelay: "0.5s" }}
                        />
                    </div>
                </div>

                <div
                    className={`absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30 pointer-events-none transition-opacity duration-1000 ${showImage && imageLoaded ? "opacity-100" : "opacity-0"}`}
                />

                <div className={`absolute top-6 left-6 z-70 transition-all duration-700 ease-out flex items-center ${!isZooming && !isLoggingOut ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 pointer-events-none"}`} >
                    <ButtonSidebar onClick={toggleSidebar} />

                    <div className={`transition-all duration-500 ease-in-out ${!isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}`} >
                        <div className="animate-nudge flex items-center gap-3">
                            {/* Arrow */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className="w-8 h-8 md:w-12 md:h-12 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>

                            <span className="text-sm md:text-xl font-serif uppercase tracking-widest text-cyan-200/90 drop-shadow-md whitespace-nowrap pt-[2px]">
                                Dive in
                            </span>
                        </div>
                    </div>
                </div>

                <UserSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                />

                <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isZooming ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                >
                    <div className="text-center md:px-4 relative z-10">
                        <h1
                            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4"
                            style={{
                                fontFamily: "Cormorant Infant, serif",
                                textShadow: "0 2px 20px rgba(0,0,0,.8)",
                            }}
                        >
                            Welcome To Atlantis
                        </h1>
                        <h1
                            className="text-2xl md:text-3xl lg:text-5xl font-bold text-white"
                            style={{
                                fontFamily: "Cormorant Infant, serif",
                                textShadow: "0 2px 20px rgba(0,0,0,.8)",
                            }}
                        >
                            Let The Deep Uncover Your Purpose
                        </h1>
                    </div>
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
                <div className={`absolute bottom-4 w-full text-center z-20 pointer-events-none transition-opacity duration-1000 delay-500 ${isZooming ? "opacity-0" : "opacity-100"}`} >
                    <p className="text-white font-caudex text-[8px] md:text-xl tracking-widest drop-shadow-md">
                        @Atlantis.DLOR2026. All Right Served
                    </p>
                </div>
            </div>
        </>
    );
}
