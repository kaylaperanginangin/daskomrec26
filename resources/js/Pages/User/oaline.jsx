import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

/* Background Assets */
import Background from '@assets/backgrounds/Home.webp';
import BoardPC from '@assets/backgrounds/BoardPC.webp';
import BoardMobile from '@assets/backgrounds/BoardMobile.webp';

/* Decor Assets */
import Chains1 from '@assets/others/DECORATIONS/Chains/01-Chain.webp';
import Chains2 from '@assets/others/DECORATIONS/Chains/01-Chain.webp';
import LogoDLOR from '@assets/logo/ORB_DLOR 1.webp';
import ImgLineQR from '@assets/logo/Code.webp';

/* Button Components */
import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';

/* Other Components */
import UserSidebar from '@components/UserSidebar';
import UnderwaterEffect from '@components/UnderwaterEffect';


export default function OaLinePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [inputLocked, setInputLocked] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [showBoard, setShowBoard] = useState(false);

    const lineInfo = {
        id: "@492ehaee",
        link: "https://line.me/R/ti/p/%40492ehaee"
    };

    const toggleSidebar = () => {
        if (inputLocked || isLoggingOut || isExiting) return;
        setIsSidebarOpen(prev => !prev);
    };

    // --- GENERIC NAVIGATION HANDLER ---
    const handleNavigate = (url) => {
        if (inputLocked || isLoggingOut || isExiting) return;

        setIsExiting(true);
        setInputLocked(true);
        setIsSidebarOpen(false);
        // Wait 1s for the retract animation to finish before moving
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
        const boardTimer = setTimeout(() => setShowBoard(true), 100);
        const unlockTimer = setTimeout(() => setInputLocked(false), 800);
        return () => {
            clearTimeout(boardTimer);
            clearTimeout(unlockTimer);
        }
    }, []);

    const styles = `
        @keyframes dropIn {
            0% { transform: translateY(-150%); opacity: 0; }
            60% { transform: translateY(5%); opacity: 1; }
            80% { transform: translateY(-2%); }
            100% { transform: translateY(0); opacity: 1; }
        }

        /* New Retract Animation */
        @keyframes retractOut {
            0% { transform: translateY(0); opacity: 1; }
            20% { transform: translateY(10%); } /* Small dip for physics feel */
            100% { transform: translateY(-150%); opacity: 1; }
        }

        @keyframes sway {
            0%, 100% { transform: rotate(0deg); }
            33% { transform: rotate(1.5deg); }
            66% { transform: rotate(-1.5deg); }
        }
        @keyframes chainLeftPhysics {
            0%,
            33% { transform: scaleY(0.97); }
            66% { transform: scaleY(1.03); }
            100% { transform: scaleY(1); }
        }
        @keyframes chainRightPhysics {
            0%,
            33% { transform: scaleY(1.03); }
            66% { transform: scaleY(0.97); }
            100% { transform: scaleY(1); }
        }

        .animate-drop { animation: dropIn 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-retract { animation: retractOut 1s cubic-bezier(0.7, 0, 0.84, 0) forwards; }

        .animate-sway-container {
            animation: sway 7s ease-in-out infinite;
            transform-origin: top center;
        }
        .animate-chain-left {
            animation: chainLeftPhysics 7s ease-in-out infinite;
            transform-origin: top center;
        }
        .animate-chain-right {
            animation: chainRightPhysics 7s ease-in-out infinite;
            transform-origin: top center;
        }
    `;

    const getBackgroundStyle = () => {
        if (isExiting) {
            return {
                transform: 'scale(1)',
                filter: 'brightness(0.6) blur(15px)',
                transition: 'transform 1s ease-in-out, filter 1s ease-in-out',
            };
        }
        return {
            transform: 'scale(1.05)',
            filter: 'brightness(0.6) blur(4px)',
            transition: 'transform 1s ease-in-out, filter 1s ease-in-out',
        };
    };

    return (
        <>
            <Head title="OA Line" />
            <style>{styles}</style>

            <div className="relative w-full min-h-screen overflow-hidden text-white font-caudex bg-slate-900">

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

                <div className={`absolute top-6 left-6 z-70 transition-all duration-700 ${!inputLocked && !isLoggingOut && !isExiting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
                    <ButtonSidebar onClick={toggleSidebar} />
                </div>

                <div className={`absolute top-6 right-6 z-70 transition-all duration-700 ${!inputLocked && !isLoggingOut && !isExiting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
                    <ButtonHome onClick={() => handleNavigate('/User/home')} />
                </div>

                <UserSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                />

                {/* The Real Stuff */}
                <div className="relative z-30 w-full min-h-screen flex justify-center items-center py-10">
                    <div className={`
                        relative w-[90%] max-w-[450px] sm:max-w-[900px] h-[550px] sm:h-[750px]
                        ${(isExiting || isLoggingOut)
                            ? 'opacity-100 animate-retract'
                            : showBoard
                                ? 'opacity-100 animate-drop'
                                : 'opacity-0'}
                    `}>

                        <div className="w-full h-full animate-sway-container">

                            {/* Chains */}
                            <div className="absolute -top-80 sm:-top-70 left-[15%] h-100 z-10 animate-chain-left">
                                <img src={Chains1} alt="Chain Left" className="w-full h-full object-contain" />
                            </div>
                            <div className="absolute -top-80 sm:-top-70 right-[15%] h-100 z-10 animate-chain-right">
                                <img src={Chains2} alt="Chain Right" className="w-full h-full object-contain" />
                            </div>

                            {/* Board Frame */}
                            <div className="absolute inset-0 z-20 overflow-hidden drop-shadow-2xl">
                                <img
                                    src={BoardMobile}
                                    alt="Frame Mobile"
                                    className="block sm:hidden absolute inset-0 w-full h-full object-contain pointer-events-none"
                                />
                                <img
                                    src={BoardPC}
                                    alt="Frame PC"
                                    className="hidden sm:block absolute inset-0 w-full h-full object-contain pointer-events-none"
                                />

                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08] scale-110">
                                    <img src={LogoDLOR} className="w-[80%] max-w-[300px] grayscale" alt="Orb Background" />
                                </div>
                            </div>

                            {/* QR */}
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center
                                            pt-[24%] pb-[20%] px-[14%]
                                            sm:pt-[22%] sm:pb-[18%] sm:px-[18%]">

                                <h1 className="text-2xl sm:text-5xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight text-white mb-6">
                                    Official Account Line
                                </h1>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 w-full">
                                    {/* QR Code */}
                                    <div className="shrink-0 bg-white p-2 rounded-xl shadow-lg rotate-0 sm:-rotate-2 transition-transform hover:rotate-0 duration-300">
                                        <img
                                            src={ImgLineQR}
                                            alt="QR Code Line"
                                            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
                                        />
                                    </div>

                                    {/* Line Info */}
                                    <div className="flex flex-col items-center sm:items-start space-y-3 text-[#092338]">
                                        <div className="flex flex-col items-center sm:items-start">
                                            <span className="text-[10px] sm:text-sm uppercase tracking-widest font-bold opacity-70">
                                                ID Line
                                            </span>
                                            <p className="text-xl sm:text-3xl font-bold drop-shadow-sm select-all tracking-wide">
                                                {lineInfo.id}
                                            </p>
                                        </div>

                                        <a
                                            href={lineInfo.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-[#0C365B] hover:brightness-110 text-white px-6 py-2.5 rounded-full font-bold shadow-lg
                                                     transition-all active:scale-95 flex items-center gap-2 text-xs sm:text-base mt-2"
                                        >
                                            <span>Add Friend</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>
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

                {/* Footer */}
                <div className={`absolute bottom-4 w-full text-center z-40 text-[10px] md:text-xs text-cyan-100/50 transition-opacity duration-1000
                    ${isExiting || isLoggingOut ? 'opacity-0' : 'opacity-100'}`}>
                    <p>@Atlantis.DLOR2026. All Right Served</p>
                </div>
            </div>
        </>
    );
}
