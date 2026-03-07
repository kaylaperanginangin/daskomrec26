import React, { useState, useEffect } from 'react';

/* Background Assets */
import BoardPC from '@assets/backgrounds/BoardPC.webp';
import BoardMobile from '@assets/backgrounds/BoardMobile.webp';
import LogoDLOR from '@assets/logo/ORB_DLOR 1.webp';

/* Chain Assets */
import Chains1 from '@assets/others/DECORATIONS/Chains/01-Chain.webp';
import Chains2 from '@assets/others/DECORATIONS/Chains/01-Chain.webp';


export default function ShiftSuccessModal({ isOpen, onClose, shift, isExiting }) {
    const [shouldRender, setShouldRender] = useState(false);
    const [animateTrigger, setAnimateTrigger] = useState(false);

    useEffect(() => {
        if (isOpen && !isExiting) {
            setShouldRender(true);
            requestAnimationFrame(() => {
                setAnimateTrigger(true);
            });
        } else {
            setAnimateTrigger(false);
        }
    }, [isOpen, isExiting]);

    const handleAnimationEnd = () => {
        if (!animateTrigger) {
            setShouldRender(false);
        }
    };

    if (!shouldRender) return null;

    const formatTime = (timeString) => {
        if (!timeString) return "-";
        return timeString.substring(0, 5);
    };

    const styles = `
        @keyframes dropIn {
            0% { transform: translateY(-150%); opacity: 0; }
            60% { transform: translateY(5%); opacity: 1; }
            80% { transform: translateY(-5%); }
            100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes retractOut {
            0% { transform: translateY(0); opacity: 1; }
            20% { transform: translateY(10%); }
            100% { transform: translateY(-150%); opacity: 1; }
        }

        @keyframes sway {
            0%, 100% { transform: rotate(0deg); }
            33% { transform: rotate(1.5deg); }
            66% { transform: rotate(-1.5deg); }
        }
        @keyframes chainLeftPhysics {
            0%, 100% { transform: scaleY(1); }
            33% { transform: scaleY(0.97); }
            66% { transform: scaleY(1.03); }
        }
        @keyframes chainRightPhysics {
            0%, 100% { transform: scaleY(1); }
            33% { transform: scaleY(1.03); }
            66% { transform: scaleY(0.97); }
        }

        .animate-drop { animation: dropIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-retract { animation: retractOut 1s cubic-bezier(0.7, 0, 0.84, 0) forwards; }

        .animate-sway-container {
            animation: sway 7s ease-in-out infinite;
            transform-origin: top center;
            will-change: transform;
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

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-auto transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
            <style>{styles}</style>

            {/* Backdrop - Removed onClick={onClose} */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-out
                ${animateTrigger && !isExiting ? 'opacity-100' : 'opacity-0'}`}
                // onClick={onClose}  <-- REMOVED THIS LINE
            />

            {/* Modal Container */}
            <div
                className={`relative z-10 w-full max-w-[350px] sm:max-w-[850px] h-auto
                ${animateTrigger && !isExiting ? 'animate-drop' : 'animate-retract'}`}
                onAnimationEnd={handleAnimationEnd}
            >

                <div className="relative w-full h-full animate-sway-container">

                    {/* Chains */}
                    <div className="absolute -top-80 sm:-top-72 left-[15%] h-100 z-0 animate-chain-left pointer-events-none">
                        <img src={Chains1} alt="Chain Left" className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute -top-80 sm:-top-72 right-[15%] h-100 z-0 animate-chain-right pointer-events-none">
                        <img src={Chains2} alt="Chain Right" className="w-full h-full object-contain" />
                    </div>

                    {/* Mobile Layout */}
                    <div
                        className="block sm:hidden w-full aspect-[3/4] bg-contain bg-center bg-no-repeat relative drop-shadow-2xl"
                        style={{ backgroundImage: `url(${BoardMobile})` }}
                    >
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-16 pt-10">
                            <div className="w-full max-w-[90%] flex flex-col items-start text-left relative">
                                <h1 className="font-caudex text-base sm:text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold leading-tight mb-3 md:mb-5">
                                    You can't change the shift once you <br className="hidden sm:block"/> choose it
                                </h1>

                                <div className="flex flex-col mb-3 md:mb-5 w-full">
                                    <h1 className="font-caudex text-base sm:text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold leading-tight mb-1 tracking-wide whitespace-nowrap">
                                        Date : {shift?.date}
                                    </h1>
                                    <h1 className="font-caudex text-base sm:text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold leading-tight tracking-wide whitespace-nowrap">
                                        Time : {formatTime(shift?.time_start)} - {formatTime(shift?.time_end)} WIB
                                    </h1>
                                </div>

                                <h1 className="font-caudex text-base sm:text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold leading-tight tracking-wide">
                                    Don't forget to check OA Line for next <br className="hidden sm:block"/> information!
                                </h1>

                                <div className="mt-4 sm:mt-0 self-end">
                                    <img
                                        src={LogoDLOR}
                                        alt="DLOR Logo"
                                        className="w-[10vw] max-w-[50px] md:max-w-[80px] h-auto object-contain drop-shadow-md"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-4 w-full flex justify-center">
                             <button onClick={onClose} className="text-white/50 text-sm hover:text-white transition-colors">Close</button>
                        </div>
                    </div>

                    {/* Desktop Layout */}
                    <div
                        className="hidden sm:block w-full aspect-[4/3] bg-contain bg-center bg-no-repeat relative drop-shadow-2xl"
                        style={{ backgroundImage: `url(${BoardPC})` }}
                    >
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-40 py-84">
                            <div className="w-full max-w-[90%] flex flex-col items-start text-left relative">
                                <h1 className="font-caudex text-base sm:text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold leading-tight mb-3 md:mb-5">
                                    You can't change the shift once you <br className="hidden sm:block"/> choose it
                                </h1>

                                <div className="flex flex-col mb-3 md:mb-5 w-full">
                                    <h1 className="font-caudex text-base sm:text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold leading-tight mb-1 tracking-wide whitespace-nowrap">
                                        Date : {shift?.date}
                                    </h1>
                                    <h1 className="font-caudex text-base sm:text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold leading-tight tracking-wide whitespace-nowrap">
                                        Time : {formatTime(shift?.time_start)} - {formatTime(shift?.time_end)} WIB
                                    </h1>
                                </div>

                                <h1 className="font-caudex text-base sm:text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold leading-tight tracking-wide">
                                    Don't forget to check OA Line for next <br className="hidden sm:block"/> information!
                                </h1>

                                <div className="mt-4 sm:mt-0 self-end">
                                    <img
                                        src={LogoDLOR}
                                        alt="DLOR Logo"
                                        className="w-[10vw] max-w-[50px] md:max-w-[80px] h-auto object-contain drop-shadow-md"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-16 w-full flex justify-center">
                             <button onClick={onClose} className="text-white/50 text-sm hover:text-white transition-colors">Close</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
