import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

import SoundBackground from '@assets/sounds/MorrowindTheme.opus';

const SoundContext = createContext();

export function SoundProvider({ children }) {
    const musicRef = useRef(null);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        musicRef.current = new Howl({
            src: [SoundBackground],
            loop: true,
            volume: 0.3,
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
        if (!musicRef.current) return;

        const newMuted = !muted;
        musicRef.current.mute(newMuted);
        setMuted(newMuted);
    };

    const setVolume = (v) => {
        if (musicRef.current) musicRef.current.volume(v);
    };

    return (
        <SoundContext.Provider value={{ toggleMute, setVolume, muted }}>
            {children}
        </SoundContext.Provider>
    );
}

export const useMusic = () => useContext(SoundContext);
