import React, { useEffect, useState } from 'react';
import PCboard from '@assets/backgrounds/01-ABoard_PC.png';
import Mobileboard from '@assets/backgrounds/02-ABoard_Mobile.png';
import btnCloseXImg from '@assets/buttons/07-Button.png';

export default function BlueModalWrapper({ isOpen, onClose, children, className = "" }) {
    const [shouldRender, setShouldRender] = useState(false);
    const [animateTrigger, setAnimateTrigger] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);

            const timer = setTimeout(() => {
                setAnimateTrigger(true);
            }, 20);

            return () => clearTimeout(timer);

        } else {
            setAnimateTrigger(false);

            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">

            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out
                ${animateTrigger ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            <div
                className={`relative z-10 w-full max-w-[350px] sm:max-w-[900px] transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) transform origin-center
                ${animateTrigger ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >

                {/* Mobile layout */}
                <div
                    className="block sm:hidden w-full aspect-3/4 bg-contain bg-center bg-no-repeat flex-col"
                    style={{ backgroundImage: `url(${Mobileboard})` }}
                >
                    <div className={`w-full h-full p-8 pt-24 pb-12 overflow-y-auto no-scrollbar ${className}`}>
                        {children}
                    </div>
                </div>

                {/* Desktop layout */}
                <div
                    className="hidden sm:block w-full aspect-4/3 bg-contain bg-center bg-no-repeat flex-col"
                    style={{ backgroundImage: `url(${PCboard})` }}
                >
                    <div className={`w-full h-full p-16 pt-24 overflow-y-auto custom-scrollbar ${className}`}>
                        {children}
                    </div>
                </div>

            </div>
        </div>
    );
}
