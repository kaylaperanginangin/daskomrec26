import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';

/* Background Assets */
import Background from '@assets/backgrounds/Main.webp';

/* Decor Assets */
import Hijau from '@assets/others/mike.webp';

/* Other Components */
import UnderwaterEffect from '@components/UnderwaterEffect'

export default function NotFound() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <Head title="Page Not Found" />
            <UnderwaterEffect/>

            <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-[#001f3f]">
                <div className="absolute inset-0 z-0">
                    <img
                        src={Background}
                        alt="Background Underwater"
                        className="w-full h-full object-cover brightness-[0.8]"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-900/20 to-black/60" />
                </div>
                <div className="relative z-10 flex flex-col items-center text-center px-4">
                    <div className="flex items-end justify-center gap-2 sm:gap-4 font-serif select-none">
                        <span
                            className="text-[120px] sm:text-[180px] md:text-[280px] leading-none text-white drop-shadow-2xl"
                        >
                            4
                        </span>
                        <div className="relative w-[80px] sm:w-[120px] md:w-[180px] mb-2 sm:mb-4 md:mb-8">
                            <img
                                src={Hijau}
                                alt="Mike Wazowski"
                                className="w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] animate-bounce-slow"
                            />
                        </div>

                        <span
                            className="text-[120px] sm:text-[180px] md:text-[280px] leading-none text-white drop-shadow-2xl scale-x-[-1]"
                        >
                            4
                        </span>
                    </div>

                    <p className="mt-2 md:mt-4 text-white text-lg sm:text-2xl md:text-4xl font-serif tracking-wide drop-shadow-md opacity-90">
                        This is mike, i can’t find that page...
                    </p>

                </div>

                <div className="absolute inset-0 z-20 pointer-events-none opacity-30 mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>
        </>
    );
}
