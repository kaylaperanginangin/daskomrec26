import React from 'react';
import popupFrameBlue from '@assets/backgrounds/01-ABoard_PC.png';
import btnCloseXImg from '@assets/buttons/07-Button.png';

export default function BlueModalWrapper({ isOpen, onClose, children, className = "" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-xs transition-opacity duration-300">
            <div className="relative w-full max-w-[700px] aspect-[4/3] flex flex-col items-center justify-center animate-popup">
                
                {/* 1. BACKGROUND FRAME (Tetap ada) */}
                <img
                    src={popupFrameBlue}
                    alt="popup frame"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-2xl"
                />

                {/* 2. TOMBOL CLOSE (Tetap ada) */}
                <button
                    onClick={onClose}
                    className="absolute top-[25%] right-[17%] z-20 w-16 h-16 hover:scale-110 transition-transform active:scale-90"
                >
                    <img 
                        src={btnCloseXImg} 
                        alt="Close" 
                        className="w-full h-full object-contain drop-shadow-md" 
                    />
                </button>

                {/* 3. AREA KONTEN DINAMIS (Safe Area) */}
                <div className={`absolute top-[30%] bottom-[25%] left-[18%] right-[18%] z-10 overflow-hidden ${className}`}>
                    {children}
                </div>

            </div>
        </div>
    );
}