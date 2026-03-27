import React, { useState, useEffect } from 'react';

import ButtonLeft from '@assets/buttons/CircularLeft.webp';
import ButtonRight from '@assets/buttons/CircularRight.webp';

const ControlButton = ({ onClick, disabled, src, alt }) => {
    const [pressed, setPressed] = useState(false);

    return (
        <button
            onMouseDown={() => !disabled && setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            onTouchStart={() => !disabled && setPressed(true)}
            onTouchEnd={() => setPressed(false)}
            onClick={onClick}
            disabled={disabled}
            className={`
                relative focus:outline-none select-none
                flex items-center justify-center
                shrink-0
                transition-opacity duration-300
                ${disabled ? 'opacity-30 cursor-not-allowed grayscale' : 'cursor-pointer hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'}
            `}
        >
            <img
                src={src}
                alt={alt}
                className={`
                    h-20 sm:h-24 w-auto
                    object-contain transition-transform duration-100 ease-out
                    ${pressed ? 'scale-90 brightness-125' : 'scale-100'}
                `}
                style={{
                    filter: pressed && !disabled
                        ? 'drop-shadow(0 0 10px rgba(34,211,238,0.8))'
                        : '',
                }}
            />
        </button>
    );
};

export default function BookControls({
    onPrev,
    onNext,
    onGoToPage,
    currentPage,
    totalPages,
    className = ''
}) {
    const [inputVal, setInputVal] = useState(currentPage);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setInputVal(currentPage);
    }, [currentPage]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onGoToPage(inputVal);
            e.target.blur();
        }
    };

    return (
        <div
            className={`flex items-center justify-center gap-2 md:gap-8 ${className}`}
            style={{ fontFamily: 'Cormorant Infant, serif' }}
            onPointerDown={(e) => e.stopPropagation()}
        >
            <style>{`
                input[type=number]::-webkit-inner-spin-button,
                input[type=number]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type=number] {
                    -moz-appearance: textfield;
                }
            `}</style>

            {/* Previous */}
            <ControlButton
                onClick={onPrev}
                disabled={currentPage === 0}
                src={ButtonLeft}
                alt="Previous"
            />

            {/* The Pill */}
            <div
                className={`
                    relative group flex items-center justify-center gap-1 md:gap-2
                    px-4 py-2 md:px-6 md:py-3
                    min-w-[110px] md:min-w-[160px] /* Reduced min-width on mobile */
                    rounded-full border transition-all duration-300

                    ${isFocused
                        ? 'bg-[#0f1c2e]/90 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                        : 'bg-[#0f1c2e]/60 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:border-cyan-400/40 hover:bg-[#0f1c2e]/80'}

                    backdrop-blur-md
                `}
            >
                {/* Input Field */}
                <input
                    type="number"
                    value={inputVal}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="
                        w-7 bg-transparent text-right
                        text-xl md:text-3xl font-bold text-cyan-50
                        drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]
                        focus:outline-none focus:text-white transition-colors
                        selection:bg-cyan-500/30
                    "
                />

                {/* Divider */}
                <span className="text-cyan-500/50 text-lg md:text-2xl font-light pb-1">/</span>

                {/* Total Pages */}
                <span className="text-cyan-200/60 text-base md:text-xl font-medium tracking-wide pt-1">
                    {totalPages}
                </span>
            </div>

            {/* Next */}
            <ControlButton
                onClick={onNext}
                disabled={currentPage === totalPages}
                src={ButtonRight}
                alt="Next"
            />
        </div>
    );
}
