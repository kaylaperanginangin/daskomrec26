import { useRef, useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";

/* Background Assets */
import Background from "@assets/backgrounds/Alternate.webp";

/* Decor Assets */
import DecorRumput from "@assets/others/DECORATIONS/Seaweed & Coral Reefs/32.webp";

/* Button Components */
import ButtonSidebar from "@components/ButtonSidebar";
import ButtonHome from "@components/ButtonHome";

/* Other Components */
import UnderwaterEffect from "@components/UnderwaterEffect";
import UserSidebar from "@components/UserSidebar";
import CoresMap from "@components/CoresMap";
import UnlockDialog from "@components/UnlockDialog";

export default function Cores({ puzzles = [] }) {
    const backgroundRef = useRef(null);

    const STATUS = {
        HIDDEN: "hidden",
        LOCKED: "locked",
        UNLOCKED: "unlocked",
    };

    const CRYPT_TEXT = "==gCNEnY1pGIxRHIih2ZSBSSVBCaxpXcDByakVnRgcGauNXcCByboFmcoVHV"

    const clueMap = {};
    const puzzleIdMap = {};
    puzzles.forEach((p) => {
        clueMap[p.name] = p.clue || "";
        puzzleIdMap[p.name] = p.id;
    });

    const buildTerritoryStates = () => {
        const states = {};
        puzzles.forEach((p) => {
            states[p.name] = p.status ? STATUS.UNLOCKED : STATUS.LOCKED;
        });
        return states;
    };

    const [territoryStates, setTerritoryStates] =
        useState(buildTerritoryStates);

    useEffect(() => {
        setTerritoryStates(buildTerritoryStates());
    }, [puzzles]);

    const [dialogState, setDialogState] = useState({
        isOpen: false,
        territoryId: null,
        isError: false,
        isAlreadyUnlocked: false,
    });

    const handleMapInteract = (id) => {
        const currentStatus = territoryStates[id];

        if (
            currentStatus === STATUS.LOCKED ||
            currentStatus === STATUS.UNLOCKED
        ) {
            setDialogState({
                isOpen: true,
                territoryId: id,
                isError: false,
                isAlreadyUnlocked: currentStatus === STATUS.UNLOCKED,
            });
        }
    };

    const handleUnlockSubmit = (inputCode) => {
        const { territoryId } = dialogState;
        const puzzleId = puzzleIdMap[territoryId];

        router.post(
            `/user/cores/unlock/${puzzleId}`,
            {
                answer: inputCode,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setTerritoryStates((prev) => ({
                        ...prev,
                        [territoryId]: STATUS.UNLOCKED,
                    }));
                    setDialogState({
                        isOpen: false,
                        territoryId: null,
                        isError: false,
                        isAlreadyUnlocked: false,
                    });
                },
                onError: () => {
                    // Incorrect answer
                    setDialogState((prev) => ({ ...prev, isError: true }));
                },
            },
        );
    };

    const allUnlocked =
        Object.keys(territoryStates).length > 0 &&
        Object.values(territoryStates).every((s) => s === STATUS.UNLOCKED);

    const [isSecretOpen, setIsSecretOpen] = useState(false);

    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [inputLocked, setInputLocked] = useState(true);
    const [isMapPlacing, setisMapPlacing] = useState(true);

    // Navigation States
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const toggleSidebar = () => {
        if (inputLocked || isLoggingOut || isExiting) return;
        setIsSidebarOpen((prev) => !prev);
    };

    // --- GENERIC NAVIGATION HANDLER ---
    const handleNavigate = (url) => {
        if (inputLocked || isLoggingOut || isExiting) return;

        setIsExiting(true);
        setInputLocked(true);
        setIsSidebarOpen(false);
        // Wait 1s for animation
        setTimeout(() => router.visit(url), 1000);
    };

    const handleLogout = () => {
        if (inputLocked || isLoggingOut || isExiting) return;

        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => {
            setIsLoggingOut(true);
            setTimeout(() => router.post("/logout"), 1000);
        }, 350);
    };

    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);
        const placeCardTimer = setTimeout(() => {
            setisMapPlacing(false);
            setInputLocked(false);
        }, 100);

        const skipIntro = () => {
            clearTimeout(showTimer);
            clearTimeout(placeCardTimer);
            setShowImage(true);
            setisMapPlacing(false);
            setInputLocked(false);
        };

        const handleKeyDown = (e) => e.key === "Escape" && skipIntro();
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("click", skipIntro);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(placeCardTimer);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("click", skipIntro);
        };
    }, []);

    const styles = `
        @keyframes subtlePulse {
            0%,100% { opacity:1 }
            50% { opacity:.95 }
        }
        .cold-blue-filter {
            filter: brightness(1.1) contrast(1.2) saturate(1) hue-rotate(15deg) sepia(0);
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
            animation: swaySeaweed 7s ease-in-out infinite reverse;
            transform-origin: bottom center;
        }
        @keyframes glowPulse {
            0%,
            50% { box-shadow: 0 0 25px rgba(34,211,238,0.7), 0 0 50px rgba(34,211,238,0.4); }
            100% { box-shadow: 0 0 15px rgba(34,211,238,0.4), 0 0 30px rgba(34,211,238,0.2); }
        }
        .glow-pulse {
            animation: glowPulse 2s ease-in-out infinite;
        }
        @keyframes secretPopIn {
            0% { opacity: 0; transform: scale(0.9) translateY(20px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-secret-pop { animation: secretPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
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
            transformOrigin: "center",
            transition: "transform 1s ease-in-out, filter 1s ease-in-out",
            objectPosition: "center 10%",
        };
    };

    const getMapStyle = () => {
        let scale = isMapPlacing ? 1.8 : 1.0;
        let rotate = isMapPlacing ? -25 : -10;
        let opacity = isMapPlacing ? 0 : 1;
        if (isExiting) {
            opacity = 0;
            scale = 0.9;
        }
        return {
            transform: `scale(${scale}) rotate(${rotate}deg)`,
            opacity,
            transition: "transform 1s ease-in-out, opacity 1s ease-in-out",
            perspective: "1000px",
        };
    };

    return (
        <>
            <Head title="Home" />
            <style>{styles}</style>

            <UnlockDialog
                isOpen={dialogState.isOpen}
                territoryName={dialogState.territoryId}
                isError={dialogState.isError}
                onClose={() =>
                    setDialogState({ ...dialogState, isOpen: false })
                }
                onSubmit={handleUnlockSubmit}
                clue={clueMap[dialogState.territoryId] || ""}
                isAlreadyUnlocked={dialogState.isAlreadyUnlocked}
            />

            <div className="relative w-full min-h-screen overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        Background:
                            "linear-gradient(to bottom, #0a2a4a, #0c365b)",
                    }}
                />

                <div className="absolute inset-0 cold-blue-filter">
                    <img
                        ref={backgroundRef}
                        src={Background}
                        alt="Background"
                        onLoad={() => setImageLoaded(true)}
                        className="w-full h-full object-cover pointer-events-none"
                        style={getBackgroundStyle()}
                    />
                </div>

                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
                    style={{ Background: "rgba(2, 99, 196, 0.2)" }}
                />

                <UnderwaterEffect
                    isLoaded={showImage && imageLoaded}
                    isZooming={false}
                />

                {/* Seaweed Decorations */}
                <div
                    className={`absolute inset-0 z-20 pointer-events-none hidden md:block transition-opacity duration-1000 ${isMapPlacing || isExiting || isLoggingOut ? "opacity-0" : "opacity-100"}`}
                >
                    <div className="absolute bottom-[-5%] left-[-10%] w-[45vw] max-w-[620px] rotate-20 origin-bottom]">
                        <img
                            src={DecorRumput}
                            alt="Seaweed"
                            className="w-full h-auto seaweed-anim-2 brightness-75"
                        />
                    </div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[45vw] max-w-[580px] rotate-20 origin-bottom">
                        <img
                            src={DecorRumput}
                            alt="Seaweed"
                            className="w-full h-auto seaweed-anim-1"
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] scale-x-[-1]">
                        <div className="absolute bottom-[-10%] left-[-40%] w-[45vw] max-w-[620px] rotate-20 origin-bottom">
                            <img
                                src={DecorRumput}
                                alt="Seaweed"
                                className="w-full h-auto seaweed-anim-2 opacity-80 brightness-75"
                            />
                        </div>
                        <div className="absolute bottom-[-25%] left-[-30%] w-[45vw] max-w-[580px] rotate-20 origin-bottom">
                            <img
                                src={DecorRumput}
                                alt="Seaweed"
                                className="w-full h-auto seaweed-anim-1 opacity-100"
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black/30 pointer-events-none transition-opacity duration-1000"
                    style={{ opacity: showImage && imageLoaded ? 1 : 0 }}
                />

                <div className={`absolute top-6 left-6 z-70 transition-all duration-700 ease-out ${!inputLocked && !isLoggingOut && !isExiting ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 pointer-events-none"}`} >
                    <ButtonSidebar onClick={toggleSidebar} />
                </div>

                <div className={`absolute top-6 right-6 z-70 transition-all duration-700 ease-out ${!inputLocked && !isLoggingOut && !isExiting ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none"}`} >
                    <ButtonHome onClick={() => handleNavigate("/User/home")} />
                </div>

                <UserSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                />

                {/* The Map */}
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={getMapStyle()}
                >
                    <CoresMap
                        territoryStates={territoryStates}
                        onTerritoryClick={handleMapInteract}
                    />
                </div>

                {/* Exit Fade */}
                <div
                    className="fixed inset-0 z-70 pointer-events-none transition-opacity duration-1000"
                    style={{
                        Background:
                            "linear-gradient(to bottom, #0a2a4a, #0c365b)",
                        opacity: isLoggingOut ? 1 : 0,
                    }}
                />
                {inputLocked && (
                    <div className="fixed inset-0 z-80 pointer-events-auto" />
                )}

                {/* Unlocked ALL */}
                {allUnlocked && !isMapPlacing && !isExiting && !isLoggingOut && (
                    <div className="absolute bottom-30 md:bottom-24 w-full flex justify-center z-50 transition-opacity duration-1000 animate-fadeIn">
                        <button
                            onClick={() => setIsSecretOpen(true)}
                            className="glow-pulse px-8 py-4 bg-cyan-900/40 border-2 border-cyan-400/60 text-cyan-100 font-serif font-bold text-lg md:text-xl uppercase tracking-[0.3em] backdrop-blur-md hover:bg-cyan-500/30 hover:border-cyan-300 transition-all duration-300"
                        >
                            Reveal The Secret
                        </button>
                    </div>
                )}

                {/* Secret Modal */}
                {isSecretOpen && (
                    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsSecretOpen(false)}
                        />
                        <div className="relative w-full max-w-xl animate-secret-pop">
                            <div className="relative bg-[#060e18] border border-cyan-500/30 p-8 md:p-12 shadow-[0_0_60px_rgba(6,182,212,0.2)]">
                                {/* Decorative corners */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/70"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/70"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/70"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/70"></div>

                                {/* Top glow line */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"></div>

                                <h3
                                    className="text-3xl md:text-4xl font-serif font-bold text-cyan-100 text-center mb-2 tracking-wider"
                                    style={{
                                        textShadow:
                                            "0 0 20px rgba(6,182,212,0.5)",
                                    }}
                                >
                                    The Depth Reveals
                                </h3>
                                <p className="text-cyan-300/50 text-xs text-center uppercase tracking-[0.3em] mb-8 font-serif">
                                    All cores unlocked
                                </p>

                                <div className="bg-black/50 border border-cyan-500/20 p-6 mb-8">
                                    <p className="text-cyan-200 font-mono text-sm md:text-base break-all leading-relaxed text-center select-all">
                                        {CRYPT_TEXT}
                                    </p>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        onClick={() => setIsSecretOpen(false)}
                                        className="px-8 py-3 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/20 hover:border-cyan-300 transition-all text-xs font-serif font-bold uppercase tracking-[0.2em]"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div
                    className={`absolute bottom-4 w-full text-center z-40 pointer-events-none transition-opacity duration-1000 delay-500 ${isMapPlacing || isExiting || isLoggingOut ? "opacity-0" : "opacity-100"}`}
                >
                    <p className="text-white font-caudex text-[10px] md:text-xl tracking-widest drop-shadow-md">
                        @Atlantis.DLOR2026. All Right Served
                    </p>
                </div>
            </div>
        </>
    );
}
