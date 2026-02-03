import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';
import UserSidebar from '@components/UserSidebar';

import PCboard from '@assets/backgrounds/01-ABoard_PC.png';
import Mobileboard from '@assets/backgrounds/02-ABoard_Mobile.png';
import logoImg from '@assets/logo/ORB_DLOR 1.png';

export default function ShiftSuccessModal({ isOpen, onClose, shift }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [animateTrigger, setAnimateTrigger] = useState(false);

    // Sync animation states with isOpen prop
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const timer = setTimeout(() => setAnimateTrigger(true), 20);
            return () => clearTimeout(timer);
        } else {
            setAnimateTrigger(false);
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    const formatTime = (timeString) => {
        if (!timeString) return "-";
        return timeString.substring(0, 5);
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">

            {/* Backdrop with transition */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out
                ${animateTrigger ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Modal Container */}
            <div className={`relative z-10 w-full max-w-[350px] sm:max-w-[850px] transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) transform origin-center
                ${animateTrigger ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

                {/* Mobile Layout */}
                <div
                    className="block sm:hidden w-full aspect-[3/4] bg-contain bg-center bg-no-repeat relative"
                    style={{ backgroundImage: `url(${Mobileboard})` }}
                >
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-16 pt-10">
                        {renderContent()}
                    </div>
                </div>

                {/* Desktop Layout */}
                <div
                    className="hidden sm:block w-full aspect-[4/3] bg-contain bg-center bg-no-repeat relative"
                    style={{ backgroundImage: `url(${PCboard})` }}
                >
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-40 py-84">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );

    // Helper to render the text content in both layouts
    function renderContent() {
        return (
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

                {/* Logo inside content area */}
                <div className="mt-4 sm:mt-0 self-end">
                    <img
                        src={logoImg}
                        alt="DLOR Logo"
                        className="w-[10vw] max-w-[50px] md:max-w-[80px] h-auto object-contain drop-shadow-md"
                    />
                </div>
            </div>
        );
    }
}
