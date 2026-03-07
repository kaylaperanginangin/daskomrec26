import { useState, useRef } from "react";
import { router, usePage } from "@inertiajs/react";

import ButtonRegular from "@assets/buttons/Regular.webp";
import ButtonStar from "@assets/buttons/Star.webp";
import ButtonAnchor from "@assets/buttons/Anchor.webp";
import ButtonChain from "@assets/buttons/Chain.webp";

import ButtonCoreUnlocked from "@assets/buttons/CoresUnlocked.webp";
import ButtonCoreLocked from "@assets/buttons/CoresLocked.webp";

export default function UserSidebar({ isOpen, onClose, onLogout, onNavigate }) {
    const { config, userStageId } = usePage().props;

    const isStage6 = userStageId === 6;

    const announcementEnabled = config?.pengumuman_on ?? false;
    const shiftEnabled = config?.isi_jadwal_on ?? false;
    const puzzleEnabled = config?.puzzles_on ?? false;

    const [wiggle, setWiggle] = useState(false);
    const [coreClickCount, setCoreClickCount] = useState(0);
    const clickTimer = useRef(null);

    const buttonWrapper =
        "relative transition-transform duration-300 hover:scale-110 active:scale-95";

    const buttonWrapperDisabled =
        "relative transition-transform duration-300 opacity-40 cursor-not-allowed";

    const imageStyle =
        "w-100 h-auto drop-shadow-[0_0_16px_rgba(96,165,250,0.6)] hover:drop-shadow-[0_0_28px_rgba(96,165,250,0.9)]";

    const imageStyleDisabled =
        "w-100 h-auto drop-shadow-[0_0_8px_rgba(96,165,250,0.3)] grayscale";

    const coreUnlocked = isStage6 && puzzleEnabled;

    const handleNav = (url) => {
        if (onNavigate) {
            onNavigate(url);
        } else {
            router.visit(url);
        }
    };

    const handleCoreClick = () => {
        if (!coreUnlocked) {
            setWiggle(true);
            setTimeout(() => setWiggle(false), 300);

            setCoreClickCount((prev) => {
                const newCount = prev + 1;
                if (clickTimer.current) clearTimeout(clickTimer.current);
                clickTimer.current = setTimeout(
                    () => setCoreClickCount(0),
                    2000,
                );
                if (newCount >= 3) {
                    handleNav("/user");
                }
                return newCount;
            });
        } else {
            handleNav("/user/cores");
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
                    isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                } z-50`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                onClick={(e) => e.stopPropagation()}
                className={`fixed top-0 left-0 h-screen w-full md:w-90 bg-black/30 backdrop-blur-xs text-white shadow-xl transform transition-transform duration-300 z-60
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div className="h-full overflow-y-auto flex">
                    <div className="flex flex-col gap-12 m-auto min-h-0 p-10">
                        {/* Profile / Password */}
                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                className={buttonWrapper}
                                onClick={() => handleNav("/user/profile")}
                            >
                                <img
                                    src={ButtonStar}
                                    className={imageStyle}
                                    alt="Profile"
                                />
                                <span
                                    className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold mb-2"
                                    style={{
                                        color: "#e0f2fe",
                                        textShadow:
                                            "0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)",
                                    }}
                                >
                                    PROFILE
                                </span>
                            </button>
                            <button
                                type="button"
                                className={buttonWrapper}
                                onClick={() => handleNav("/user/password")}
                            >
                                <img
                                    src={ButtonRegular}
                                    className={imageStyle}
                                    alt="Change Password"
                                />
                                <span
                                    className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold mb-2"
                                    style={{
                                        color: "#e0f2fe",
                                        textShadow:
                                            "0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)",
                                    }}
                                >
                                    CHANGE PASSWORD
                                </span>
                            </button>
                        </div>

                        {/* Assistants / Line */}
                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                className={buttonWrapper}
                                onClick={() => handleNav("/user/assistants")}
                            >
                                <img
                                    src={ButtonRegular}
                                    className={imageStyle}
                                    alt="Assistants"
                                />
                                <span
                                    className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold mb-2"
                                    style={{
                                        color: "#e0f2fe",
                                        textShadow:
                                            "0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)",
                                    }}
                                >
                                    ASSISTANTS
                                </span>
                            </button>
                            <button
                                type="button"
                                className={buttonWrapper}
                                onClick={() => handleNav("/user/oaline")}
                            >
                                <img
                                    src={ButtonAnchor}
                                    className={imageStyle}
                                    alt="OA LINE"
                                />
                                <span
                                    className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold mb-2"
                                    style={{
                                        color: "#e0f2fe",
                                        textShadow:
                                            "0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)",
                                    }}
                                >
                                    OA LINE
                                </span>
                            </button>
                        </div>

                        {/* Announcement / Shift / Core */}
                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                className={
                                    announcementEnabled
                                        ? buttonWrapper
                                        : buttonWrapperDisabled
                                }
                                onClick={() => {
                                    if (announcementEnabled)
                                        handleNav("/user/announcement");
                                }}
                                disabled={!announcementEnabled}
                            >
                                <img
                                    src={ButtonChain}
                                    className={
                                        announcementEnabled
                                            ? imageStyle
                                            : imageStyleDisabled
                                    }
                                    alt="Announcement"
                                />
                                <span
                                    className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold mb-2"
                                    style={{
                                        color: "#e0f2fe",
                                        textShadow:
                                            "0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)",
                                    }}
                                >
                                    ANNOUNCEMENT
                                </span>
                            </button>
                            <button
                                type="button"
                                className={
                                    shiftEnabled
                                        ? buttonWrapper
                                        : buttonWrapperDisabled
                                }
                                onClick={() => {
                                    if (shiftEnabled)
                                        handleNav("/user/shift");
                                }}
                                disabled={!shiftEnabled}
                            >
                                <img
                                    src={ButtonRegular}
                                    className={
                                        shiftEnabled
                                            ? imageStyle
                                            : imageStyleDisabled
                                    }
                                    alt="Shift"
                                />
                                <span
                                    className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold mb-2"
                                    style={{
                                        color: "#e0f2fe",
                                        textShadow:
                                            "0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)",
                                    }}
                                >
                                    SHIFT
                                </span>
                            </button>
                            {isStage6 && (
                                <button
                                    type="button"
                                    className={`${coreUnlocked ? buttonWrapper : buttonWrapperDisabled} ${wiggle ? "animate-wiggle" : ""}`}
                                    onClick={handleCoreClick}
                                    disabled={!coreUnlocked}
                                >
                                    <img
                                        src={
                                            coreUnlocked
                                                ? ButtonCoreUnlocked
                                                : ButtonCoreLocked
                                        }
                                        className={
                                            coreUnlocked
                                                ? imageStyle
                                                : imageStyleDisabled
                                        }
                                        alt="Core"
                                    />
                                    <span
                                        className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold mb-1"
                                        style={{
                                            color: "#e0f2fe",
                                            textShadow:
                                                "0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)",
                                        }}
                                    >
                                        {coreUnlocked ? "CORES" : ""}
                                    </span>
                                </button>
                            )}
                        </div>

                        {/* Logout */}
                        <div className="flex flex-col gap-0">
                            <button
                                type="button"
                                className={buttonWrapper}
                                onClick={handleLogoutClick}
                            >
                                <img
                                    src={ButtonRegular}
                                    className={imageStyle}
                                    alt="Logout"
                                    style={{
                                        filter: "brightness(0.7) contrast(1.2) saturate(1.2) hue-rotate(20deg)",
                                    }}
                                />
                                <span
                                    className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold mb-1"
                                    style={{
                                        color: "#e0f2fe",
                                        textShadow:
                                            "0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)",
                                    }}
                                >
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
