import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';
import buttonShiftImg from '@assets/buttons/ButtonAnchor.png';
import UserSidebar from '@components/UserSidebar';
import UnderwaterEffect from '@components/UnderwaterEffect';

import Background3 from '@assets/backgrounds/Background3.png';
import Chains1 from '@assets/others/DECORATIONS/Chains/01-Chain.png';
import Chains2 from '@assets/others/DECORATIONS/Chains/01-Chain.png';
import logoImg from '@assets/logo/ORB_DLOR 1.png';
import Mobileboard from '@assets/backgrounds/02-ABoard_Mobile.png';

// =========================================================================
// MOCKED BACKEND RESPONSE (Only Quote & URL are dynamic)
// =========================================================================
const BACKEND_DATA = {
    passed: {
        quote: "\"Bersiaplah untuk petualangan selanjutnya di kedalaman samudra DLOR.\"",
        url: 'https://line.me/example'
    },
    failed: {
        quote: "\"Jangan berkecil hati, perjalananmu masih panjang.\"",
        url: ''
    }
};

export default function AnnouncementPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [inputLocked, setInputLocked] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Animation States
    const [showBoard, setShowBoard] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);

    // 1. GET DYNAMIC DATA
    const userStatus = 'passed';
    const currentData = BACKEND_DATA[userStatus] || BACKEND_DATA.failed;

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
        return () => { clearTimeout(boardTimer); clearTimeout(initialLock); };
    }, []);

    const styles = `
        /* --- PHYSICS --- */
        @keyframes dropIn {
            0% { transform: translateY(-150%); opacity: 0; }
            60% { transform: translateY(5%); opacity: 1; }
            80% { transform: translateY(-2%); }
            100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes sway {
            0%, 100% { transform: rotate(0deg); }
            33% { transform: rotate(1.5deg); }
            66% { transform: rotate(-1.5deg); }
        }
        @keyframes chainLeftPhysics { 0%, 100% { transform: scaleY(1); } 33% { transform: scaleY(0.97); } 66% { transform: scaleY(1.03); } }
        @keyframes chainRightPhysics { 0%, 100% { transform: scaleY(1); } 33% { transform: scaleY(1.03); } 66% { transform: scaleY(0.97); } }

        /* --- REVEAL ANIMATIONS --- */
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

        /* --- CRT / TYPEWRITER STYLE ANIMATION --- */
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

        /* --- CLASSES --- */
        .animate-drop { animation: dropIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
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

    return (
        <>
            <Head title="Announcement" />
            <style>{styles}</style>

            <div className="relative w-full min-h-screen overflow-hidden text-white font-caudex bg-slate-900">

                {/* NAVIGATION */}
                <div className={`absolute top-6 left-6 z-60 transition-all duration-700 ${!inputLocked ? 'opacity-100' : 'opacity-0 -translate-x-10'}`}>
                    <ButtonSidebar onClick={toggleSidebar} />
                </div>
                <div className={`absolute top-6 right-6 z-60 transition-all duration-700 ${!inputLocked ? 'opacity-100' : 'opacity-0 translate-x-10'}`}>
                    <ButtonHome onClick={() => router.visit('/user/home')} />
                </div>
                <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />

                {/* MAIN CONTENT */}
                <div className="relative z-30 w-full min-h-screen flex justify-center items-center py-10">

                    <div className={`relative w-[95%] max-w-[420px] md:max-w-[700px] h-[600px] sm:h-[650px] md:h-[800px] mt-16 md:mt-20
                                     ${showBoard ? 'animate-drop' : 'opacity-0'}`}>

                        <div className="w-full h-full animate-sway-container">

                            {/* CHAINS */}
                            <div className="absolute -top-[300px] md:-top-[180px] left-[12%] h-[400px] md:h-[250px] z-10 animate-chain-left">
                                <img src={Chains1} alt="Chain Left" className="w-full h-full object-contain" />
                            </div>
                            <div className="absolute -top-[300px] md:-top-[180px] right-[12%] h-[400px] md:h-[250px] z-10 animate-chain-right">
                                <img src={Chains2} alt="Chain Right" className="w-full h-full object-contain" />
                            </div>

                            {/* BOARD BACKGROUND */}
                            <div className="absolute inset-0 z-20 bg-center bg-no-repeat drop-shadow-2xl overflow-hidden"
                                style={{ backgroundImage: `url(${Mobileboard})`, backgroundSize: '100% 100%' }}>

                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.1]">
                                    <img src={logoImg} className="w-[80%] max-w-[300px] grayscale" alt="" />
                                </div>

                                {/* LOCKED STATE */}
                                {!isRevealed && (
                                    <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center pt-[5%] px-10 text-[#092338]
                                                     ${isUnlocking ? 'animate-dissolve' : ''}`}>
                                        <div className={`mb-6 ${isUnlocking ? 'animate-unlock' : ''}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-16 h-16 md:w-24 md:h-24 opacity-80">
                                                <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zm6 10v8H6v-8h12zm-9-2V7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9z"/>
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-xl md:text-3xl tracking-[0.2em] mb-2 uppercase opacity-90">Confidential</h3>
                                        <p className="text-lg font-serif text-center italic opacity-70 mb-8 max-w-[280px] sm:max-w-[320px]">
                                            The result will seal your fate as an atlantean. Are you sure you want to see it?
                                        </p>
                                        <button onClick={handleReveal} disabled={isUnlocking}
                                            className="group relative px-8 py-3 bg-[#092338] text-white rounded-full overflow-hidden shadow-lg transition-all hover:scale-105 active:scale-95">
                                            <span className="relative z-10 font-bold tracking-widest text-sm md:text-lg flex items-center gap-2">
                                                REVEAL RESULT
                                            </span>
                                        </button>
                                    </div>
                                )}

                                {/* REVEALED STATE */}
                                {isRevealed && (
                                    <div className="w-full h-full flex flex-col items-center text-center text-[#092338]
                                                    px-[10%] pt-[32%] sm:pt-[28%] md:pt-[24%] pb-[12%] animate-crt-reveal ml-1">

                                        {/* 1. Header (Static) */}
                                        <div className="relative z-10 w-full mb-4">
                                            <h1 className="text-2xl sm:text-4xl font-bold uppercase tracking-[0.15em] drop-shadow-sm">
                                                {userStatus === 'passed' ? 'CONGRATULATIONS' : 'ANNOUNCEMENT'}
                                            </h1>
                                            <div className="w-24 md:w-48 h-1 bg-[#092338] mx-auto mt-2 rounded-full opacity-80"></div>
                                        </div>

                                        {/* 2. Content Body (Template Preserved) */}
                                        <div className="relative z-10 flex-1 flex flex-col justify-center items-center w-full space-y-4">
                                            <div className="font-serif text-[15px] sm:text-[17px] md:text-xl leading-relaxed md:leading-loose max-w-[90%]">

                                                {/* PASSED TEMPLATE */}
                                                {userStatus === 'passed' ? (
                                                    <div className="space-y-2 text-lg">
                                                        <h1>Selamat! Kamu dinyatakan</h1>
                                                        <div className="py-2 border-y border-dashed border-[#092338]/40 my-2">
                                                            <span className="text-[#005f99] font-black text-4xl md:text-5xl tracking-wide block scale-110">
                                                                LULUS
                                                            </span>
                                                        </div>
                                                        <h1>seleksi tahap ini.</h1>

                                                        {/* --- VARIABLE QUOTE HERE --- */}
                                                        <h1 className="text-sm sm:text-sm md:text-lg italic opacity-70 mt-4">
                                                            {currentData.quote}
                                                        </h1>

                                                        <h1 className="text-sm sm:text-sm md:text-lg italic opacity-70 mt-4">
                                                            <a href={currentData.url} className="underline cursor-pointer">
                                                                {currentData.url}
                                                            </a>
                                                        </h1>
                                                    </div>

                                                /* FAILED TEMPLATE */
                                                ) : (
                                                    <div className="space-y-2 text-lg">
                                                        <h1>Mohon maaf, kamu</h1>
                                                        <div className="py-2 border-y border-dashed border-[#092338]/40 my-2">
                                                            <span className="text-red-700/80 font-black text-4xl md:text-5xl tracking-wide block">
                                                                BELUM LULUS
                                                            </span>
                                                        </div>
                                                        <h1>pada tahap ini.</h1>

                                                        {/* --- VARIABLE QUOTE HERE --- */}
                                                        <h1 className="text-xs sm:text-sm md:text-lg italic opacity-70 mt-4">
                                                            {currentData.quote}
                                                        </h1>
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        {/* 2. RENDER ACTION BUTTON (LINK) */}
                                        {userStatus === 'passed' ? (
                                            <>
                                                <div className="relative z-20 w-full h-28 md:h-40 flex justify-center items-end pb-2">
                                                    <button
                                                        onClick={() => router.visit("/user/shift")}
                                                        className="group relative w-64 sm:w-80 md:w-96 h-28 md:h-40 transition-all duration-300 hover:scale-105 active:scale-95"
                                                    >
                                                        <img
                                                            src={buttonShiftImg}
                                                            alt="Large Action Button"
                                                            className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_6px_8px_rgba(0,0,0,0.3)] scale-110"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center gap-2 pt-1">
                                                            <span className="font-bold text-xl sm:text-2xl md:text-3xl text-white mb-3 drop-shadow-md group-hover:text-cyan-100 transition-colors">
                                                                SELECT SHIFT
                                                            </span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="relative z-20 w-full h-28 md:h-40 flex justify-center items-end pb-2">
                                                    <button
                                                        onClick={() => router.visit("/user/home")}
                                                        className="group relative w-64 sm:w-80 md:w-96 h-28 md:h-40 transition-all duration-300 hover:scale-105 active:scale-95"
                                                    >
                                                        <img
                                                            src={buttonShiftImg}
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
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER & BG --- */}
                <div className="absolute bottom-4 w-full text-center z-40 text-[10px] md:text-xs text-cyan-100/50">
                    <p>@Atlantis.DLOR2026. All Right Served</p>
                </div>
                <div className="absolute inset-0 z-0">
                    <img src={Background3} alt="Background" className="w-full h-full object-cover brightness-[0.6] blur-sm scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-cyan-900/30" />
                </div>
                <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-50">
                    <UnderwaterEffect />
                </div>

            </div>
        </>
    );
}
