import { createContext, useContext, useEffect, useRef } from 'react';
import { Howl } from 'howler';

import SoundBackground from '@assets/sounds/MorrowindTheme.opus';

const SoundContext = createContext();

export function SoundProvider({ children }) {
    const musicRef = useRef(null);

    useEffect(() => {
        musicRef.current = new Howl({
            src: [SoundBackground],
            loop: true,
            volume: 1.0,
            html5: true,
        });

        const startMusic = () => {
            if (!musicRef.current.playing()) musicRef.current.play();
        };

        window.addEventListener('click', startMusic);
        window.addEventListener('keydown', startMusic);

        return () => {
            window.removeEventListener('click', startMusic);
            window.removeEventListener('keydown', startMusic);
        };
    }, []);

    const toggleMute = () => {
        if (musicRef.current) musicRef.current.mute(!musicRef.current._muted);
    };

    const setVolume = (v) => {
        if (musicRef.current) musicRef.current.volume(v);
    };

    return (
        <SoundContext.Provider value={{ toggleMute, setVolume }}>
            {children}
        </SoundContext.Provider>
    );
}

export const useMusic = () => useContext(SoundContext);
