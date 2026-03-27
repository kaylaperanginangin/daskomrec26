import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";

/* Background Assets */
import Background from "@assets/backgrounds/Home.webp";
import BoardMobile from "@assets/backgrounds/BoardMobile.webp";

/* Decor Assets */
import LogoDLOR from "@assets/logo/ORB_DLOR 1.webp";
import Chains1 from "@assets/others/DECORATIONS/Chains/01-Chain.webp";
import Chains2 from "@assets/others/DECORATIONS/Chains/01-Chain.webp";

/* Button Components */
import ButtonShift from "@assets/buttons/Anchor.webp";
import ButtonSidebar from "@components/ButtonSidebar";
import ButtonHome from "@components/ButtonHome";

/* Other Components */
import UserSidebar from "@components/UserSidebar";
import UnderwaterEffect from "@components/UnderwaterEffect";

export default function AnnouncementPage({
    userStatus = "pending",
    successMessage = "",
    failMessage = "",
    link = "",
    shiftEnabled = false,
    announcementEnabled = false,
    stageName = "",
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [inputLocked, setInputLocked] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const [showBoard, setShowBoard] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);

    // 1. GET DYNAMIC DATA
    const isLive = announcementEnabled;

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

    const handleShiftClick = () => {
        handleNavigate("/user/shift");
    };

    useEffect(() => {
        const zoomTimer = setTimeout(() => {
            setInputLocked(false);
        }, 500);
        return () => clearTimeout(zoomTimer);
    }, []);

    const handleReveal = () => {
        setIsUnlocking(true);
        setTimeout(() => {
            setIsRevealed(true);
            setIsUnlocking(false);
            setInputLocked(false);
        }, 800);
    };

    useEffect(() => {
        const boardTimer = setTimeout(() => setShowBoard(true), 100);
        const initialLock = setTimeout(() => setInputLocked(false), 800);
        return () => {
            clearTimeout(boardTimer);
            clearTimeout(initialLock);
        };
    }, []);

    const styles = `
        @keyframes dropIn {
            0% { transform: translateY(-150%); opacity: 0; }
            60% { transform: translateY(5%); opacity: 1; }
            80% { transform: translateY(-2%); }
            100% { transform: translateY(0); opacity: 1; }
        }

        /* Retract Animation */
        @keyframes retractOut {
            0% { transform: translateY(0); opacity: 1; }
            20% { transform: translateY(10%); } /* Dip effect */
            100% { transform: translateY(-150%); opacity: 1; }
        }

        @keyframes sway {
            0%, 100% { transform: rotate(0deg); }
            33% { transform: rotate(1.5deg); }
            66% { transform: rotate(-1.5deg); }
        }
        @keyframes chainLeftPhysics { 0%, 100% { transform: scaleY(1); } 33% { transform: scaleY(0.97); } 66% { transform: scaleY(1.03); } }
        @keyframes chainRightPhysics { 0%, 100% { transform: scaleY(1); } 33% { transform: scaleY(1.03); } 66% { transform: scaleY(0.97); } }

        @keyframes unlockShake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px) rotate(-5deg); }
            50% { transform: translateX(5px) rotate(5deg); }
            75% { transform: translateX(-5px) rotate(-5deg); }
            100% { transform: translateX(0) scale(1.1); opacity: 0; }
        }

        @keyframes dissolveOut {
            0% { opacity: 1; filter: blur(0px); transform: scale(1); }
            100% { opacity: 0; filter: blur(10px); transform: scale(1.2); }
        }

        @keyframes crtTurnOn {
            0% { transform: scale(1, 0.002); opacity: 0; filter: brightness(3); }
            30% { transform: scale(1, 0.002); opacity: 1; filter: brightness(3); }
            60% { transform: scale(1, 1); opacity: 1; filter: brightness(1.5); }
            100% { transform: scale(1, 1); opacity: 1; filter: brightness(1); }
        }

        @keyframes textFlicker {
            0% { opacity: 0.95; }
            5% { opacity: 1; }
            10% { opacity: 0.9; }
            15% { opacity: 1; }
            100% { opacity: 1; }
        }

        @keyframes bubbleRise {
            0% { bottom: -50px; opacity: 0; transform: scale(0.5) translateX(0); }
            20% { opacity: 0.5; }
            50% { transform: scale(1) translateX(20px); } /* Gerakan sedikit ke kanan */
            100% { bottom: 110vh; opacity: 0; transform: scale(1.2) translateX(-20px); } /* Naik sampai atas layar */
        }

        .bubble {
            position: absolute;
            /* Membuat bola transparan dengan kilauan */
            background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1));
            box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.2);
            border-radius: 50%; /* Membuat jadi bulat */
            pointer-events: none; /* Agar tidak menghalangi klik mouse */
            z-index: 10;
        }

        .animate-drop { animation: dropIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-retract { animation: retractOut 1s cubic-bezier(0.7, 0, 0.84, 0) forwards; }

        .animate-sway-container { animation: sway 7s ease-in-out infinite; transform-origin: top center; }
        .animate-chain-left { animation: chainLeftPhysics 7s ease-in-out infinite; transform-origin: top center; }
        .animate-chain-right { animation: chainRightPhysics 7s ease-in-out infinite; transform-origin: top center; }

        .animate-unlock { animation: unlockShake 0.6s ease-in-out forwards; }
        .animate-dissolve { animation: dissolveOut 0.8s ease-out forwards; }

        .animate-crt-reveal {
            animation: crtTurnOn 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards,
                        textFlicker 2s infinite;
            transform-origin: center center;
        }
    `;

    const getBackgroundStyle = () => {
        if (isExiting) {
            return {
                transform: "scale(1)",
                filter: "brightness(0.6) blur(15px)",
                transition: "transform 1s ease-in-out, filter 1s ease-in-out",
            };
        }
        return {
            transform: "scale(1.05)",
            filter: "brightness(0.6) blur(4px)",
            transition: "transform 1s ease-in-out, filter 1s ease-in-out",
        };
    };

    return (
        <>
            <Head title="Announcement" />
            <style>{styles}</style>

            <div className="relative w-full min-h-screen overflow-hidden text-white font-caudex bg-slate-900">
                <div
                    className={`absolute top-6 left-6 z-70 transition-all duration-700 ${!inputLocked && !isLoggingOut && !isExiting ? "opacity-100" : "opacity-0 -translate-x-10 pointer-events-none"}`}
                >
                    <ButtonSidebar onClick={toggleSidebar} />
                </div>
                <div
                    className={`absolute top-6 right-6 z-70 transition-all duration-700 ${!inputLocked && !isLoggingOut && !isExiting ? "opacity-100" : "opacity-0 translate-x-10 pointer-events-none"}`}
                >
                    <ButtonHome onClick={() => handleNavigate("/User/home")} />
                </div>
                <UserSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                />

                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={Background}
                        alt="Background"
                        className="w-full h-full object-cover"
                        style={getBackgroundStyle()}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-cyan-900/30" />
                </div>
                <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-50">
                    <UnderwaterEffect />
                </div>

                {/* Contents */}
                <div className="relative z-30 w-full min-h-screen flex justify-center items-center py-10">
                    <div
                        className={`
                        relative w-[95%] max-w-[420px] md:max-w-[700px] h-[600px] sm:h-[650px] md:h-[800px]
                        ${
                            isExiting || isLoggingOut
                                ? "animate-retract opacity-100"
                                : showBoard
                                  ? "animate-drop"
                                  : "opacity-0"
                        }
                    `}
                    >
                        <div className="w-full h-full animate-sway-container">
                            {/* Chains */}
                            <div className="absolute -top-[300px] md:-top-[180px] left-[12%] h-[400px] md:h-[250px] z-10 animate-chain-left">
                                <img
                                    src={Chains1}
                                    alt="Chain Left"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="absolute -top-[300px] md:-top-[180px] right-[12%] h-[400px] md:h-[250px] z-10 animate-chain-right">
                                <img
                                    src={Chains2}
                                    alt="Chain Right"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Modal Dialog */}
                            <div
                                className="absolute inset-0 z-20 bg-center bg-no-repeat drop-shadow-2xl overflow-hidden"
                                style={{
                                    backgroundImage: `url(${BoardMobile})`,
                                    backgroundSize: "100% 100%",
                                }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.1]">
                                    <img
                                        src={LogoDLOR}
                                        className="w-[80%] max-w-[300px] grayscale"
                                        alt=""
                                    />
                                </div>

                                {isLive ? (
                                    <>
                                        {/* LOCKED STATE */}
                                        {!isRevealed && (
                                            <div
                                                className={`absolute inset-0 z-50 flex flex-col items-center justify-center pt-[5%] px-10 text-[#092338]
                                                            ${isUnlocking ? "animate-dissolve" : ""}`}
                                            >
                                                <div
                                                    className={`mb-6 ${isUnlocking ? "animate-unlock" : ""}`}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                        className="w-16 h-16 md:w-24 md:h-24 opacity-80"
                                                    >
                                                        <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zm6 10v8H6v-8h12zm-9-2V7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9z" />
                                                    </svg>
                                                </div>
                                                <h3 className="font-bold text-xl md:text-3xl tracking-[0.2em] mb-2 uppercase opacity-90">
                                                    Confidential
                                                </h3>
                                                <p className="text-lg font-serif text-center italic opacity-70 mb-8 max-w-[280px] sm:max-w-[320px]">
                                                    The result will seal your
                                                    fate as an atlantean. Are
                                                    you sure you want to see it?
                                                </p>
                                                <button
                                                    onClick={handleReveal}
                                                    disabled={isUnlocking}
                                                    className="group relative px-8 py-3 bg-[#092338] text-white rounded-full overflow-hidden shadow-lg transition-all hover:scale-105 active:scale-95"
                                                >
                                                    <span className="relative z-10 font-bold tracking-widest text-sm md:text-lg flex items-center gap-2">
                                                        REVEAL RESULT
                                                    </span>
                                                </button>
                                            </div>
                                        )}

                                        {/* If Revelaled */}
                                        {isRevealed && (
                                            <div
                                                className="w-full h-full flex flex-col items-center text-center text-[#092338]
                                                            px-[10%] pt-[32%] sm:pt-[28%] md:pt-[24%] pb-[12%] animate-crt-reveal ml-1"
                                            >
                                                <div className="relative z-10 w-full mb-4">
                                                    <h1 className="text-2xl sm:text-4xl font-bold uppercase tracking-[0.15em] drop-shadow-sm">
                                                        {userStatus === "passed" ? "CONGRATULATIONS" : "ANNOUNCEMENT"}
                                                    </h1>
                                                    {stageName && (
                                                        <p className="text-sm md:text-base opacity-60 mt-1 tracking-wider">
                                                            {stageName}
                                                        </p>
                                                    )}
                                                    <div className="w-24 md:w-48 h-1 bg-[#092338] mx-auto mt-2 rounded-full opacity-80"></div>
                                                </div>

                                                <div className="relative z-10 flex-1 flex flex-col justify-center items-center w-full space-y-4">
                                                    <div className="font-serif text-[15px] sm:text-[17px] md:text-xl leading-relaxed md:leading-loose max-w-[90%]">
                                                        {userStatus ===
                                                        "passed" ? (
                                                            <>
                                                                {/* Passed */}
                                                                <div className="space-y-2 text-lg">
                                                                    <h1>
                                                                        {" "}
                                                                        Selamat!
                                                                        Kamu
                                                                        dinyatakan{" "}
                                                                    </h1>
                                                                    <div className="py-2 border-y border-dashed border-[#092338]/40 my-2">
                                                                        <span className="text-[#005f99] font-black text-4xl md:text-5xl tracking-wide block scale-110">
                                                                            LULUS
                                                                        </span>
                                                                    </div>
                                                                    <h1>
                                                                        {" "}
                                                                        seleksi
                                                                        tahap
                                                                        ini.{" "}
                                                                    </h1>
                                                                </div>

                                                                {/* --- VARIABLE QUOTE HERE --- */}
                                                                {successMessage && (
                                                                    <div
                                                                        className="text-xs sm:text-sm md:text-lg opacity-70 mt-4 prose prose-sm max-w-none text-[#092338] break-words whitespace-pre-wrap"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: successMessage,
                                                                        }}
                                                                    />
                                                                )}

                                                                {link && (
                                                                    <h1 className="text-sm sm:text-sm md:text-lg italic opacity-70 mt-4">
                                                                        <a
                                                                            href={
                                                                                link
                                                                            }
                                                                            className="underline cursor-pointer"
                                                                        >
                                                                            {
                                                                                link
                                                                            }
                                                                        </a>
                                                                    </h1>
                                                                )}
                                                            </>
                                                        ) : userStatus === "failed" ? (
                                                            <>
                                                                {/* Failed */}
                                                                <div className="space-y-2 text-lg">
                                                                    <h1>
                                                                        {" "}
                                                                        Mohon
                                                                        maaf,
                                                                        kamu{" "}
                                                                    </h1>
                                                                    <div className="py-2 border-y border-dashed border-[#092338]/40 my-2">
                                                                        <span className="text-red-700/80 font-black text-4xl md:text-5xl tracking-wide block">
                                                                            BELUM
                                                                            LULUS
                                                                        </span>
                                                                    </div>
                                                                    <h1>
                                                                        {" "}
                                                                        pada
                                                                        tahap
                                                                        ini.{" "}
                                                                    </h1>
                                                                </div>

                                                                {/* --- VARIABLE QUOTE HERE --- */}
                                                                {failMessage && (
                                                                <div
                                                                    className="text-xs sm:text-sm md:text-lg opacity-70 mt-4 prose prose-sm max-w-none text-[#092338] break-words whitespace-pre-wrap"
                                                                    dangerouslySetInnerHTML={{
                                                                    __html: failMessage,
                                                                    }}
                                                                />
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {/* Pending */}
                                                                <div className="space-y-2 text-lg">
                                                                    <h1>
                                                                        {" "}
                                                                        Bersabar ya, untuk penyeleksian masih dalam tahap
                                                                        {" "}
                                                                    </h1>
                                                                    <div className="py-2 border-y border-dashed border-[#092338]/40 my-2">
                                                                        <span className="text-orange-600/80 font-black text-4xl md:text-5xl tracking-wide block">
                                                                            PROSES
                                                                        </span>
                                                                    </div>
                                                                    <h1>
                                                                        {" "}
                                                                        pada
                                                                        tahap
                                                                        ini.{" "}
                                                                    </h1>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* 2. RENDER ACTION BUTTON (LINK) */}
                                                {userStatus === "passed" &&
                                                shiftEnabled ? (
                                                    <>
                                                        <div className="relative z-20 w-full h-28 md:h-40 flex justify-center items-end pb-2">
                                                            <button
                                                                onClick={
                                                                    handleShiftClick
                                                                }
                                                                className="group relative w-64 sm:w-80 md:w-96 h-28 md:h-40 transition-all duration-300 hover:scale-105 active:scale-95"
                                                            >
                                                                <img
                                                                    src={
                                                                        ButtonShift
                                                                    }
                                                                    alt="Large Action Button"
                                                                    className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_6px_8px_rgba(0,0,0,0.3)] scale-110"
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center gap-2 pt-1">
                                                                    <span className="font-bold text-xl sm:text-2xl md:text-3xl text-white mb-3 drop-shadow-md group-hover:text-cyan-100 transition-colors">
                                                                        SHIFT
                                                                    </span>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="relative z-20 w-full h-28 md:h-40 flex justify-center items-end pb-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleNavigate(
                                                                        "/User/home",
                                                                    )
                                                                }
                                                                className="group relative w-64 sm:w-80 md:w-96 h-28 md:h-40 transition-all duration-300 hover:scale-105 active:scale-95"
                                                            >
                                                                <img
                                                                    src={
                                                                        ButtonShift
                                                                    }
                                                                    alt="Large Action Button"
                                                                    className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_6px_8px_rgba(0,0,0,0.3)] scale-110"
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center gap-2 pt-1">
                                                                    <span className="font-bold text-xl sm:text-2xl md:text-3xl text-white mb-3 drop-shadow-md group-hover:text-cyan-100 transition-colors">
                                                                        HOME
                                                                    </span>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className={`absolute inset-0 z-50 flex flex-col items-center justify-center pt-[5%] px-10 text-[#092338]`}
                                        >
                                            <h1 className="font-bold text-xl text-center md:text-3xl tracking-[0.2em] mb-2 uppercase opacity-90 max-w-[400px]">
                                                There's nothing here yet
                                            </h1>
                                            <h1 className="text-lg font-serif text-center italic opacity-70 max-w-[280px] sm:max-w-[320px]">
                                                Check out later next time for
                                                the latest information!
                                            </h1>
                                            <button
                                                onClick={() =>
                                                    handleNavigate("/User/home")
                                                }
                                                className="group relative w-64 sm:w-80 md:w-96 h-28 md:h-40 transition-all duration-300 hover:scale-105 active:scale-95"
                                            >
                                                <img
                                                    src={ButtonShift}
                                                    alt="Large Action Button"
                                                    className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_6px_8px_rgba(0,0,0,0.3)] scale-110"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center gap-2 pt-1">
                                                    <span className="font-bold text-xl sm:text-2xl md:text-3xl text-white mb-3 drop-shadow-md group-hover:text-cyan-100 transition-colors">
                                                        HOME
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div
                    className={`absolute bottom-4 w-full text-center z-40 text-[10px] md:text-xs text-cyan-100/50 transition-opacity duration-1000
                    ${isExiting || isLoggingOut ? "opacity-0" : "opacity-100"}`}
                >
                    <p>@Atlantis.DLOR2026. All Right Served</p>
                </div>

                {/* Exit Fade */}
                <div
                    className="fixed inset-0 z-70 pointer-events-none transition-opacity duration-1000"
                    style={{
                        background:
                            "linear-gradient(to bottom, #0a2a4a, #0c365b)",
                        opacity: isLoggingOut ? 1 : 0,
                    }}
                />

                {/* Decorations */}
                <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                    <div
                        className="bubble w-4 h-4 left-[10%]"
                        style={{ animation: "bubbleRise 10s infinite linear" }}
                    />
                    <div
                        className="bubble w-2 h-2 left-[25%]"
                        style={{
                            animation: "bubbleRise 15s infinite linear",
                            animationDelay: "2s",
                        }}
                    />
                    <div
                        className="bubble w-6 h-6 left-[50%]"
                        style={{
                            animation: "bubbleRise 12s infinite linear",
                            animationDelay: "5s",
                        }}
                    />
                    <div
                        className="bubble w-3 h-3 left-[70%]"
                        style={{
                            animation: "bubbleRise 18s infinite linear",
                            animationDelay: "1s",
                        }}
                    />
                    <div
                        className="bubble w-5 h-5 left-[85%]"
                        style={{
                            animation: "bubbleRise 14s infinite linear",
                            animationDelay: "3s",
                        }}
                    />
                </div>
            </div>
        </>
    );
}
