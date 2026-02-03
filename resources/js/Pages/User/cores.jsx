import { useRef, useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

import UnderwaterEffect from '@components/UnderwaterEffect';
import background from '@assets/backgrounds/AssistantBackground.png';
import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';
import UserSidebar from '@components/UserSidebar';
import CoresMap from '@components/CoresMap';
import UnlockDialog from '@components/UnlockDialog';

const CLUE = {
    xurith: 'Look underneath',
    thevia: 'the twilight star',
    euprus: 'shining it\'s briliance',
    northgard: 'within the night sky',
}

const PASSCODES = {
    xurith: '1234',
    thevia: '1234',
    euprus: '1234',
    northgard: '1234',
};

const STATUS = {
    HIDDEN: 'hidden',
    LOCKED: 'locked',
    UNLOCKED: 'unlocked'
};

export default function Cores() {
    const backgroundRef = useRef(null);

    const [territoryStates, setTerritoryStates] = useState({
        xurith: STATUS.LOCKED,
        thevia: STATUS.LOCKED,
        euprus: STATUS.LOCKED,
        northgard: STATUS.LOCKED,
    });

    const [dialogState, setDialogState] = useState({
        isOpen: false,
        territoryId: null,
        isError: false,
    });

    const handleMapInteract = (id) => {
        const currentStatus = territoryStates[id];
        // If locked, open dialog to attempt unlock
        if (currentStatus === STATUS.LOCKED) {
            setDialogState({ isOpen: true, territoryId: id, isError: false });
        }
    };

    const handleUnlockSubmit = (inputCode) => {
        const { territoryId } = dialogState;

        // Check passcode for the specific territory
        if (inputCode === PASSCODES[territoryId]) {
            // Success: Unlock ONLY the current territory
            setTerritoryStates(prev => ({
                ...prev,
                [territoryId]: STATUS.UNLOCKED
            }));

            setDialogState({ isOpen: false, territoryId: null, isError: false });
        } else {
            // Failure
            setDialogState(prev => ({ ...prev, isError: true }));
        }
    };

    // --- Standard Page States ---
    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [inputLocked, setInputLocked] = useState(true);
    const [isMapPlacing, setisMapPlacing] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const toggleSidebar = () => {
        if (inputLocked || isLoggingOut) return;
        setIsSidebarOpen(prev => !prev);
    };

    const goHome = () => {
        if (inputLocked || isLoggingOut) return;
        setIsExiting(true);
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => router.visit('/user/home'), 1000);
    };

    const handleLogout = () => {
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => {
            setIsLoggingOut(true);
            setTimeout(() => router.visit('/'), 1000);
        }, 350);
    };

    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);
        const placeCardTimer = setTimeout(() => {
            setisMapPlacing(false);
            setInputLocked(false);
        }, 100);

        const skipIntro = () => {
            clearTimeout(showTimer);
            clearTimeout(placeCardTimer);
            setShowImage(true);
            setisMapPlacing(false);
            setInputLocked(false);
        };

        const handleKeyDown = e => e.key === 'Escape' && skipIntro();
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', skipIntro);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(placeCardTimer);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', skipIntro);
        };
    }, []);

    const styles = `
        @keyframes subtlePulse {
            0%,100% { opacity:1 }
            50% { opacity:.95 }
        }
        .cold-blue-filter {
            filter: brightness(1.1) contrast(1.2) saturate(1) hue-rotate(15deg) sepia(0);
        }
    `;

    const getBackgroundStyle = () => {
        let scale = 1.1;
        let blur = showImage && imageLoaded ? 0 : 10;
        if (isExiting) { scale = 1; blur = 15; }
        return {
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
            transformOrigin: 'center',
            transition: 'transform 1s ease-in-out, filter 1s ease-in-out',
            objectPosition: 'center 10%',
        };
    };

    const getMapStyle = () => {
        let scale = isMapPlacing ? 1.8 : 1.0;
        let rotate = isMapPlacing ? -25 : -10;
        let opacity = isMapPlacing ? 0 : 1;
        if (isExiting) { opacity = 0; scale = 0.9; }
        return {
            transform: `scale(${scale}) rotate(${rotate}deg)`,
            opacity,
            transition: 'transform 1s ease-in-out, opacity 1s ease-in-out',
            perspective: '1000px',
        };
    };

    return (
        <>
            <Head title="Home" />
            <style>{styles}</style>

            {/* --- DIALOG --- */}
            <UnlockDialog
                isOpen={dialogState.isOpen}
                territoryName={dialogState.territoryId}
                isError={dialogState.isError}
                onClose={() => setDialogState({ ...dialogState, isOpen: false })}
                onSubmit={handleUnlockSubmit}
                clue={CLUE[dialogState.territoryId]}
            />

            <div className="relative w-full min-h-screen overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)' }} />

                <div className="absolute inset-0 cold-blue-filter">
                    <img
                        ref={backgroundRef}
                        src={background}
                        alt="background"
                        onLoad={() => setImageLoaded(true)}
                        className="w-full h-full object-cover pointer-events-none"
                        style={getBackgroundStyle()}
                    />
                </div>

                <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000" style={{ background: 'rgba(2, 99, 196, 0.2)' }} />

                <UnderwaterEffect isLoaded={showImage && imageLoaded} isZooming={false} />

                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30 pointer-events-none transition-opacity duration-1000" style={{ opacity: showImage && imageLoaded ? 1 : 0 }} />

                <div className={`absolute top-6 left-6 z-60 transition-all duration-700 ease-out ${!inputLocked && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6 pointer-events-none'}`}>
                    <ButtonSidebar onClick={toggleSidebar} />
                </div>

                <div className={`absolute top-6 right-6 z-60 transition-all duration-700 ease-out ${!inputLocked && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'}`}>
                    <ButtonHome onClick={goHome} />
                </div>

                <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />

                {/* --- MAP CONTAINER --- */}
                <div className="absolute inset-0 flex items-center justify-center" style={getMapStyle()}>
                    <CoresMap
                        territoryStates={territoryStates}
                        onTerritoryClick={handleMapInteract}
                    />
                </div>

                <div className="fixed inset-0 z-70 pointer-events-none transition-opacity duration-1000" style={{ background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)', opacity: isLoggingOut ? 1 : 0 }} />

                {inputLocked && <div className="fixed inset-0 z-80 pointer-events-auto" />}
            </div>
        </>
    );
}
