import { useState, useEffect, useRef, useMemo } from "react";
import { Head, router, usePage } from "@inertiajs/react";

/* Background Assets */
import ImgMain from '@assets/backgrounds/Main.webp';

/* Button Components */
import ButtonRegular from '@assets/buttons/Regular.webp';
import ButtonSidebar from "@components/ButtonSidebar";
import ButtonHome from "@components/ButtonHome";

/* Other Components */
import UserSidebar from "@components/UserSidebar";
import UnderwaterEffect from "@components/UnderwaterEffect";
import ShiftTable from "@components/Table";
import BlueModalWrapper from "@components/BlueBox";
import ShiftSuccessModal from '@components/ShiftSuccessModal';


export default function ShiftPage({
    shifts: rawShifts = [],
    hasChosen: initialHasChosen = false,
    chosenShift: initialChosenShift = null,
}) {
    const backgroundRef = useRef(null);
    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isZooming, setIsZooming] = useState(true);
    const [inputLocked, setInputLocked] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(initialHasChosen);
    const [selectedShift, setSelectedShift] = useState(
        initialChosenShift
            ? {
                  ...initialChosenShift,
                  time_start: initialChosenShift.time_start,
                  time_end: initialChosenShift.time_end,
              }
            : null,
    );
    const [hasChosen, setHasChosen] = useState(initialHasChosen);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { errors } = usePage().props;

    const shifts = useMemo(
        () =>
            rawShifts.map((s) => ({
                id: s.id,
                shift: s.shift_no,
                date: s.date,
                timeStart: s.time_start ? s.time_start.substring(0, 5) : "",
                timeEnd: s.time_end ? s.time_end.substring(0, 5) : "",
                quota: s.kuota,
                caasBooked: Array(s.plottingans_count || 0).fill(null),
                type: null,
            })),
        [rawShifts],
    );

    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);
        const zoomTimer = setTimeout(() => {
            setIsZooming(false);
            setInputLocked(false);
        }, 100);

        const skipIntro = () => {
            clearTimeout(showTimer);
            clearTimeout(zoomTimer);
            setShowImage(true);
            setIsZooming(false);
            setInputLocked(false);
        };

        window.addEventListener(
            "keydown",
            (e) => e.key === "Escape" && skipIntro(),
        );
        window.addEventListener("click", skipIntro);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(zoomTimer);
            window.removeEventListener("keydown", skipIntro);
            window.removeEventListener("click", skipIntro);
        };
    }, []);

    const handleNavigate = (url) => {
        if (inputLocked || isLoggingOut || isExiting) return;

        setIsExiting(true);
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => router.visit(url), 1000);
    };

    const handleAddClick = (shift) => {
        if (hasChosen) return;
        setSelectedShift({
            ...shift,
            time_start: shift.timeStart,
            time_end: shift.timeEnd,
        });
        setShowModal(true);
    };

    const handleConfirmAdd = () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        router.post(
            "/user/shift",
            {
                shift_id: selectedShift?.id,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setHasChosen(true);
                    setShowModal(false);
                    setTimeout(() => setShowSuccess(true), 300);
                },
                onError: () => {
                    setShowModal(false);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const handleLogout = () => {
        if (inputLocked || isLoggingOut || isExiting) return;

        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => {
            setIsLoggingOut(true);
            setTimeout(() => router.post("/logout"), 1000);
        }, 350);
    };

    const styles = `
        @keyframes subtlePulse {
            0%,
            100% { opacity:1 }
            50% { opacity:.9 }
        }
        .pulse-effect { animation: subtlePulse 4s ease-in-out infinite; }
        .cold-blue-filter { filter: brightness(0.8) contrast(1.1) saturate(1.2); }
    `;

    const isUIHidden = isZooming || isLoggingOut || isExiting;

    return (
        <>
            <Head title="Choose Shift" />
            <style>{styles}</style>

            <div className="fixed inset-0 w-full h-full text-white font-caudex bg-[#0a2a4a] overflow-y-auto md:overflow-hidden">
                {/* Background */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <img
                        ref={backgroundRef}
                        src={ImgMain}
                        alt="bg"
                        onLoad={() => setImageLoaded(true)}
                        className={`w-full h-full object-cover transition-all duration-1500 ease-out
                            ${showImage && imageLoaded ? "opacity-100" : "opacity-0"}
                            ${!isZooming ? "pulse-effect" : ""} cold-blue-filter`}
                        style={{
                            transform:
                                showImage && imageLoaded && !isExiting
                                    ? "scale(1.0)"
                                    : isExiting
                                        ? "scale(1.0)"
                                        : "scale(1.2)",
                            filter: isExiting ? "blur(15px) brightness(0.6)" : "brightness(0.8) contrast(1.1) saturate(1.2)",
                            opacity: isExiting ? 0 : (showImage && imageLoaded ? 1 : 0),
                            transition: "transform 1.5s ease-out, filter 1s ease-in-out, opacity 1s ease-in-out",
                            transformOrigin: "center",
                        }}
                    />
                </div>

                <div className="fixed inset-0 z-10 pointer-events-none">
                    <UnderwaterEffect />
                </div>

                {/* Sidebar Button */}
                <div
                    className={`fixed top-4 left-4 md:top-6 md:left-6 z-70 transition-all duration-700 ease-out
                    ${!isUIHidden ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 pointer-events-none"}`}
                >
                    <ButtonSidebar
                        onClick={() => setIsSidebarOpen((prev) => !prev)}
                    />
                </div>

                {/* Home Button */}
                <div
                    className={`fixed top-4 right-4 md:top-6 md:right-6 z-70 transition-all duration-700 ease-out
                    ${!isUIHidden ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none"}`}
                >
                    <ButtonHome onClick={() => handleNavigate("/User/home")} />
                </div>

                {/* Main Content */}
                <div
                    className={`relative z-40 flex flex-col items-center justify-start md:justify-center min-h-full w-full px-4 pt-24 pb-12 md:py-0 transition-all duration-1000
                    ${isUIHidden ? "opacity-0 scale-95" : "opacity-100 scale-100"}
                    ${showModal || showSuccess ? "blur-sm brightness-75" : ""}`}
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl mb-6 md:mb-10 font-bold drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] tracking-wide text-center shrink-0">
                        Choose Your Shift
                    </h1>

                    <div className="w-full max-w-[95%] md:max-w-7xl">
                        <ShiftTable
                            shifts={shifts}
                            onAddShift={handleAddClick}
                            hasChosen={hasChosen}
                        />
                    </div>

                    <div className="mt-10 md:absolute md:bottom-6 w-full text-center text-white text-[10px] md:text-sm tracking-widest opacity-60">
                        @Atlantis.DLOR2026. All Right Served
                    </div>
                </div>

                <UserSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                />

                <BlueModalWrapper
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                >
                    <div className="flex flex-col justify-center items-center text-center h-full w-full space-y-6 px-4">
                        <h1 className="font-caudex text-xs text-white px-10 sm:px-0 tracking-[0.2em] uppercase drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] leading-tight font-bold">
                            Let The Deep Uncover Your Purpose
                        </h1>
                        <h1 className="font-caudex text-xl sm:text-4xl text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] leading-tight font-bold">
                            Are you sure you want <br /> to add this shift?
                        </h1>
                        <div className="flex gap-4 flex-col sm:flex-row md:gap-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="relative w-40 h-12 px-6 active:scale-95 transition-transform"
                            >
                                <img
                                    src={ButtonRegular}
                                    alt="btn"
                                    className="absolute inset-0 w-full h-full object-fill"
                                />
                                <span className="relative z-10 text-white text-2xl font-bold">
                                    No
                                </span>
                            </button>
                            <button
                                onClick={handleConfirmAdd}
                                className="relative w-40 h-12 px-6 active:scale-95 transition-transform"
                            >
                                <img
                                    src={ButtonRegular}
                                    alt="btn"
                                    className="absolute inset-0 w-full h-full object-fill"
                                />
                                <span className="relative z-10 text-white text-2xl font-bold">
                                    Yes
                                </span>
                            </button>
                        </div>
                    </div>
                </BlueModalWrapper>

                <ShiftSuccessModal
                    isOpen={showSuccess}
                    onClose={() => setShowSuccess(false)}
                    shift={selectedShift}
                    isExiting={isExiting || isLoggingOut}
                />

                {/* Filter Fade */}
                <div
                    className={`fixed inset-0 z-90 pointer-events-none transition-opacity duration-1000 bg-[#0a2a4a] ${isLoggingOut ? "opacity-100" : "opacity-0"}`}
                />

                {/* Input Lock Layer */}
                {inputLocked && (
                    <div className="fixed inset-0 z-100 cursor-wait" />
                )}
            </div>
        </>
    );
}
