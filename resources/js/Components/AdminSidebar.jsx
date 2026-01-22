import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';

import ButtonRegular from '@assets/buttons/ButtonRegular.png'
import ButtonStar from '@assets/buttons/ButtonStar.png'
import ButtonAnchor from '@assets/buttons/ButtonAnchor.png'
import ButtonChain from '@assets/buttons/ButtonChain.png'

import ButtonCores from '@assets/buttons/ButtonCores.png';

export default function UserSidebar({ isOpen, onClose, onLogout }) {
    const [coreUnlocked, setCoreUnlocked] = useState(true);
    const [wiggle, setWiggle] = useState(false);
    const [coreClickCount, setCoreClickCount] = useState(0);
    const clickTimer = useRef(null);

    const buttonWrapper =
        "relative transition-transform duration-300 hover:scale-110 active:scale-95";

    const imageStyle =
        "w-100 h-auto drop-shadow-[0_0_16px_rgba(96,165,250,0.6)] hover:drop-shadow-[0_0_28px_rgba(96,165,250,0.9)]";

    const handleCoreClick = () => {
        if (!coreUnlocked) {
            setWiggle(true);
            setTimeout(() => setWiggle(false), 300);

            setCoreClickCount(prev => {
                const newCount = prev + 1;
                if (clickTimer.current) clearTimeout(clickTimer.current);
                clickTimer.current = setTimeout(() => setCoreClickCount(0), 2000);
                if (newCount >= 3) {
                    router.visit('/user'); 
                }
                return newCount;
            });
        } else {
            router.visit('/user/cores')
        }
    };

    const handleLogoutClick = () => {
        if (onLogout) onLogout();
    };

    const style = `
        @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
            75% { transform: rotate(-5deg); }
        }
        .animate-wiggle {
            animation: wiggle 0.3s ease;
        }
    `;

    return (
        <>
            <style>{style}</style>

            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/10 backdrop-blur-xs transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                } z-40`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                onClick={(e) => e.stopPropagation()}
                className={`fixed top-0 left-0 h-screen w-full md:w-90 bg-black/30 backdrop-blur-xs text-white shadow-xl transform transition-transform duration-300 z-50
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="h-full overflow-y-auto flex">
                    <div className="flex flex-col gap-12 m-auto min-h-0 p-10">

                        {/* Profile / Password */}
                        <div className="flex flex-col gap-2">
                            <button type="button" className={buttonWrapper} onClick={() => {router.visit('/user/password')}}>
                                <img src={ButtonRegular} className={imageStyle} alt="Change Password"/>
                                <span 
                                    className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold mb-2" 
                                    style={{ 
                                        color: '#e0f2fe', 
                                        textShadow: '0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)' 
                                    }}>
                                    CHANGE PASSWORD
                                </span>
                            </button>
                        </div>

                        {/* Announcement / Shift / Core */}
                        <div className="flex flex-col gap-2">
                            <button type="button" className={buttonWrapper} onClick={() => {router.visit('/user/announcement')}}>
                                <img src={ButtonChain} className={imageStyle} alt="Announcement"/>
                                <span 
                                    className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold mb-2" 
                                    style={{ 
                                        color: '#e0f2fe', 
                                        textShadow: '0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)' 
                                    }}>
                                    ANNOUNCEMENT
                                </span>
                            </button>
                            <button type="button" className={buttonWrapper} onClick={() => {router.visit('/user/shift')}}>
                                <img src={ButtonRegular} className={imageStyle} alt="Announcement"/>
                                <span 
                                    className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold mb-2" 
                                    style={{ 
                                        color: '#e0f2fe', 
                                        textShadow: '0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)' 
                                    }}>
                                    SHIFT
                                </span>
                            </button>
                            <button
                                type="button"
                                className={`${buttonWrapper} ${wiggle ? 'animate-wiggle' : ''}`}
                                onClick={handleCoreClick}
                            >
                                <img
                                    src={ButtonCores}
                                    className={imageStyle}
                                    alt="Core"
                                />
                                <span 
                                    className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold mb-1" 
                                    style={{ 
                                        color: '#e0f2fe', 
                                        textShadow: '0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)' 
                                }}>
                                    CAAS
                                </span>
                            </button>
                        </div>

                        {/* Logout */}
                        <div className="flex flex-col gap-0">
                            <button
                                type="button"
                                className={buttonWrapper}
                                onClick={handleLogoutClick}
                            >
                                <img src={ButtonRegular} className={imageStyle} alt="Logout" style={{filter: 'brightness(0.7) contrast(1.2) saturate(1.2) hue-rotate(20deg)'}}/>
                                <span 
                                    className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold mb-1" 
                                    style={{ 
                                        color: '#e0f2fe', 
                                        textShadow: '0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)' 
                                }}>
                                    LOG OUT
                                </span>
                            </button>
                        </div>

                    </div>
                </div>
            </aside>
        </>
    );
}