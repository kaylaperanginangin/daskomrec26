import React, { useEffect, useState } from 'react';

import BoardPC from '@assets/backgrounds/BoardPC.webp';
import BoardMobile from '@assets/backgrounds/BoardMobile.webp';
import Chains1 from '@assets/others/DECORATIONS/Chains/01-Chain.webp';
import Chains2 from '@assets/others/DECORATIONS/Chains/01-Chain.webp';

export default function BlueModalWrapper({ isOpen, onClose, children, className = "" }) {
    const [shouldRender, setShouldRender] = useState(false);
    const [animateTrigger, setAnimateTrigger] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            requestAnimationFrame(() => {
                setAnimateTrigger(true);
            });
        } else if (shouldRender) {
            setAnimateTrigger(false);
        }
    }, [isOpen, shouldRender]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const styles = `
        @keyframes dropIn {
            0% { transform: translateY(-150%); opacity: 0; }
            60% { transform: translateY(5%); opacity: 1; }
            80% { transform: translateY(-5%); }
            100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes pullUp {
            0% { transform: translateY(0); opacity: 1; }
            20% { transform: translateY(5%); }
            100% { transform: translateY(-150%); opacity: 0; }
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

        .animate-drop {
            animation: dropIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-exit {
            animation: pullUp 1s cubic-bezier(0.5, -0.5, 0.5, 1) forwards;
        }
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

    if (!shouldRender) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <style>{styles}</style>

            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300
                ${animateTrigger ? 'opacity-100' : 'opacity-0'}`}
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            />

            {/* Main Wrapper */}
            <div
                className={`relative z-10 w-full max-w-[350px] sm:max-w-[900px]
                ${isOpen
                    ? (animateTrigger ? 'animate-drop' : 'opacity-0 -translate-y-full')
                    : 'animate-exit'
                }`}
                onAnimationEnd={() => {
                    if (!animateTrigger) {
                        setShouldRender(false);
                    }
                }}
            >

                <div className="w-full h-full animate-sway-container relative">

                    {/* Chains */}
                    <div className="absolute -top-80 sm:-top-70 left-[15%] h-100 z-0 animate-chain-left pointer-events-none">
                        <img src={Chains1} alt="Chain Left" className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute -top-80 sm:-top-70 right-[15%] h-100 z-0 animate-chain-right pointer-events-none">
                        <img src={Chains2} alt="Chain Right" className="w-full h-full object-contain" />
                    </div>

                    {/* Board Content */}
                    <div className="relative z-10 drop-shadow-2xl pointer-events-auto">

                        {/* Mobile layout */}
                        <div
                            className="block sm:hidden w-full aspect-3/4 bg-contain bg-center bg-no-repeat flex-col"
                            style={{ backgroundImage: `url(${BoardMobile})` }}
                        >
                            <div className={`w-full h-full p-8 pt-24 pb-12 overflow-y-auto no-scrollbar ${className}`}>
                                {children}
                            </div>
                        </div>

                        {/* Desktop layout */}
                        <div
                            className="hidden sm:block w-full aspect-4/3 bg-contain bg-center bg-no-repeat flex-col"
                            style={{ backgroundImage: `url(${BoardPC})` }}
                        >
                            <div className={`w-full h-full p-16 pt-24 overflow-y-auto custom-scrollbar ${className}`}>
                                {children}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
