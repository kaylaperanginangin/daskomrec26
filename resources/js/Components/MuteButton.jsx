import React from 'react';
import { useMusic } from './SoundProvider';

export default function MuteButton() {
    const { toggleMute, muted } = useMusic();

    const goldGradient = "linear-gradient(145deg, #52b7c3, #1e6883)";
    const atlantisBlue = "#00fbff";

    return (
        <button
            onClick={toggleMute}
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                zIndex: 9999,
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: goldGradient,
                border: '3px solid #05253e',
                boxShadow: muted
                    ? `0 0 10px rgba(0,0,0,0.5)`
                    : `0 0 20px ${atlantisBlue}, inset 0 0 10px rgba(255,255,255,0.5)`,
                transition: 'all 0.3s ease',
                transform: 'scale(1)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
        >
            {muted ? <MutedTrident /> : <ActiveTrident color={atlantisBlue} />}

        </button>
    );
}

function ActiveTrident({ color }) {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 2px ${color})` }}>
            {/* Trident Head */}
            <path
                d="M12 2V12M12 12H10M12 12H14M7 4V10C7 12.7614 9.23858 15 12 15C14.7614 15 17 12.7614 17 10V4"
                stroke="#4a3b00"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            {/* Shaft */}
            <path d="M12 15V22" stroke="#4a3b00" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function MutedTrident() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" opacity="0.6">
            <path
                d="M12 2V12M7 6V10C7 12.7614 9.23858 15 12 15C14.7614 15 17 12.7614 17 10V8"
                stroke="#4a3b00"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path d="M12 15V22" stroke="#4a3b00" strokeWidth="1.5" strokeLinecap="round" />
            {/* The Strike-through (Engraved look) */}
            <line x1="5" y1="5" x2="19" y2="19" stroke="#7e0000" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
