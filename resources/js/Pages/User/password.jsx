import { useRef, useState, useEffect, useMemo } from "react";
import { Head, router, useForm } from "@inertiajs/react";

/* Background Assets */
import ImgMain from "@assets/backgrounds/Main.webp";
import ImgBuilding from "@assets/others/DECORATIONS/Atlantis Ruins/06-Building.webp";
import ImgRoad from "@assets/backgrounds/Road.webp";

/* Decor Assets */
import LogoDLOR from "@assets/logo/ORB_DLOR 1.webp";
import DecorSeaweed from "@assets/others/DECORATIONS/Seaweed & Coral Reefs/29.webp";
import DecorFish from "@assets/others/DECORATIONS/Fish & Other Sea Creatures/02-Fish.webp";

/* Button Components */
import ButtonRegular from "@assets/buttons/Regular.webp";
import ButtonSidebar from "@components/ButtonSidebar";
import ButtonHome from "@components/ButtonHome";

/* Other Components */
import UserSidebar from "@components/UserSidebar";
import UnderwaterEffect from "@components/UnderwaterEffect";
import BlueModalWrapper from "@components/BlueBox";

export default function ChangePassword() {
    const { data, setData, put, errors, processing, reset } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const backgroundRef = useRef(null);
    const [showImage, setShowImage] = useState(false);

    const [isZooming, setIsZooming] = useState(true);
    const [inputLocked, setInputLocked] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // View Password States
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Navigation States
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const bubbles = useMemo(() => {
        return Array.from({ length: 15 }).map((_, i) => ({
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * 10 + 5}px`,
            duration: `${Math.random() * 5 + 5}s`,
            delay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.5 + 0.1,
        }));
    }, []);

    const toggleSidebar = () => {
        if (inputLocked || isLoggingOut || isExiting) return;
        setIsSidebarOpen((prev) => !prev);
    };

    const handleNavigate = (url) => {
        if (inputLocked || isLoggingOut || isExiting) return;
        setIsExiting(true);
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => router.visit(url), 1000);
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

    const handleChangeClick = () => {
        setShowModal(true);
    };

    const handleConfirmChange = () => {
        put("/user/password", {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                reset();
                setTimeout(() => {
                    setShowSuccess(true);
                }, 300);
            },
            onError: () => {
                setShowModal(false);
            },
        });
    };

    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);
        const zoomTimer = setTimeout(() => {
            setIsZooming(false);
            setInputLocked(false);
        }, 500);

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                if (showModal) {
                    setShowModal(false);
                } else {
                    clearTimeout(showTimer);
                    clearTimeout(zoomTimer);
                    setShowImage(true);
                    setIsZooming(false);
                    setInputLocked(false);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showModal]);

    const getBackgroundStyle = () => {
        if (isExiting) {
            return {
                transform: "scale(1)",
                opacity: 1,
                filter: "blur(15px)",
                transition: "transform 1s ease-in-out, filter 1s ease-in-out",
            };
        }

        return {
            transform: isZooming ? "scale(1.5)" : "scale(1)",
            opacity: showImage ? 1 : 0,
            filter:
                isSidebarOpen || showModal
                    ? "brightness(0.5) blur(3px)"
                    : "brightness(0.8) saturate(1.2)",
            transition:
                "transform 1.5s ease-out, opacity 0.7s ease-in, filter 0.5s ease",
        };
    };

    const getFormStyle = () => ({
        opacity: !inputLocked && !isLoggingOut && !isExiting ? 1 : 0,
        transform:
            !inputLocked && !isLoggingOut && !isExiting
                ? "translateY(0)"
                : "translateY(20px)",
        filter: showModal ? "blur(5px)" : "none",
        pointerEvents: showModal ? "none" : "auto",
        transition:
            "opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s, filter 0.3s",
    });

    const customStyles = `
        @keyframes swimRightToLeft {
            0% { transform: translateX(110vw) translateY(0); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateX(-30vw) translateY(-20px); opacity: 0; }
        }
        @keyframes swimLeftToRight {
            0% { transform: translateX(-30vw) translateY(0); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateX(110vw) translateY(-20px); opacity: 0; }
        }

        @keyframes swayLeft {
            0% { transform: translateX(-30px) translateY(20px) rotate(25deg); }
            100% { transform: translateX(-30px) translateY(20px) rotate(35deg); }
        }
        @keyframes swayRight {
            0% { transform: translateX(30px) translateY(20px) scaleX(-1) rotate(-25deg); }
            100% { transform: translateX(30px) translateY(20px) scaleX(-1) rotate(-35deg); }
        }

        @keyframes modalPop {
            0% { opacity: 0; transform: scale(0.9) translateY(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }

        @keyframes rise {
            0% { transform: translateY(100vh) scale(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-10vh) scale(1.5); opacity: 0; }
        }

        .fish-top-anim { animation: swimRightToLeft 35s linear infinite; }
        .fish-bottom-anim { animation: swimLeftToRight 40s linear infinite; }

        .seaweed-left-anim {
            animation: swayLeft 5s ease-in-out infinite alternate;
            transform-origin: bottom;
        }
        .seaweed-right-anim {
            animation: swayRight 6s ease-in-out infinite alternate;
            transform-origin: bottom;
        }

        .modal-anim { animation: modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

        .bubble {
            position: absolute;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            pointer-events: none;
        }
    `;

    const EyeIcon = ({ visible }) => (
        visible ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
        )
    );

    return (
        <>
            <Head title="Change Password" />
            <style>{customStyles}</style>
            <UnderwaterEffect />

            <div className="relative w-full h-screen overflow-hidden text-white font-caudex">

                {/* Background Components */}
                <div className="absolute inset-0 z-0 pointer-events-none blur-[3px] transition-all duration-700">
                    <div className="absolute inset-0 bg-[#0C365B]" />
                    <img
                        ref={backgroundRef}
                        src={ImgMain}
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={getBackgroundStyle()}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img
                            src={ImgBuilding}
                            alt="Building"
                            className="absolute w-full h-full min-w-[2000px] object-cover object-center"
                        />
                    </div>
                </div>

                {/* Bubbles */}
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                    {bubbles.map((b, i) => (
                        <div
                            key={i}
                            className="bubble"
                            style={{
                                left: b.left,
                                width: b.size,
                                height: b.size,
                                animation: `rise ${b.duration} linear ${b.delay} infinite`,
                                opacity: b.opacity,
                            }}
                        />
                    ))}
                </div>

                {/* Road */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <img
                        src={ImgRoad}
                        alt="ImgRoad"
                        className="absolute bottom-0 left-0 w-full h-auto object-cover"
                        style={{
                            filter: "sepia(1) hue-rotate(150deg) saturate(2) contrast(1.5) brightness(0.9)",
                        }}
                    />
                </div>

                {/* Le Fishe */}
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                    <div className="absolute top-[20%] w-full fish-top-anim">
                        <img src={DecorFish} alt="fish top" className="w-24 md:w-48 transform scale-x-[-1]" />
                    </div>
                    <div className="absolute bottom-[20%] w-full fish-bottom-anim">
                        <img src={DecorFish} alt="fish bottom" className="w-32 md:w-56" />
                    </div>
                </div>

                {/* The Form */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center" style={getFormStyle()}>
                    <div className="text-center mb-6">
                        <h1 className="text-4xl md:text-5xl mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wide">
                            Change The Password
                        </h1>
                        <p className="text-sm md:text-lg text-gray-200 opacity-90 tracking-wider drop-shadow-md font-caudex">
                            After you changed don't forget the password
                        </p>
                    </div>

                    <div className="w-full max-w-[450px] px-8 space-y-6">

                        {/* Old Password */}
                        <div className="group">
                            <label className="block text-lg mb-1 ml-1 drop-shadow-md text-gray-100">Old Password</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={data.current_password}
                                    onChange={(e) => setData("current_password", e.target.value)}
                                    className="w-full h-12 bg-gray-300 text-gray-800 rounded-md px-4 pr-12 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all placeholder-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
                                >
                                    <EyeIcon visible={showCurrentPassword} />
                                </button>
                            </div>
                            {errors.current_password && <div className="text-red-400 text-sm mt-1">{errors.current_password}</div>}
                        </div>

                        {/* New Password */}
                        <div className="group">
                            <label className="block text-lg mb-1 ml-1 drop-shadow-md text-gray-100">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    className="w-full h-12 bg-gray-300 text-gray-800 rounded-md px-4 pr-12 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all placeholder-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
                                >
                                    <EyeIcon visible={showNewPassword} />
                                </button>
                            </div>
                            {errors.password && <div className="text-red-400 text-sm mt-1">{errors.password}</div>}
                        </div>

                        {/* Confirm Password */}
                        <div className="group">
                            <label className="block text-lg mb-1 ml-1 drop-shadow-md text-gray-100">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData("password_confirmation", e.target.value)}
                                    className="w-full h-12 bg-gray-300 text-gray-800 rounded-md px-4 pr-12 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all placeholder-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
                                >
                                    <EyeIcon visible={showConfirmPassword} />
                                </button>
                            </div>
                            {errors.password_confirmation && <div className="text-red-400 text-sm mt-1">{errors.password_confirmation}</div>}
                        </div>

                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleChangeClick}
                                className="relative w-64 h-16 flex items-center justify-center group active:scale-95 transition-transform"
                            >
                                <img
                                    src={ButtonRegular}
                                    alt="change button"
                                    className="absolute inset-0 w-full h-full object-fill pointer-events-none drop-shadow-lg"
                                    style={{ filter: "brightness(0.9) hue-rotate(10deg) saturate(1.2)" }}
                                />
                                <span className="relative z-10 text-white text-3xl font-caudex tracking-widest pb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                                    Change
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Seaweed Decor */}
                <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000 ${isZooming || isExiting || isLoggingOut ? "opacity-0" : "opacity-100"}`}>
                    <img src={DecorSeaweed} alt="Seaweed left" className="absolute bottom-0 left-[-30%] w-60 md:bottom-0 md:left-[-5%] md:w-85 filter brightness-90 seaweed-left-anim" />
                    <img src={DecorSeaweed} alt="Seaweed right" className="absolute bottom-0 right-[-35%] w-60 md:bottom-0 md:right-[-10%] md:w-85 filter brightness-90 seaweed-right-anim scale-x-[-1]" />
                </div>

                {/* Modals & Sidebar */}
                <BlueModalWrapper isOpen={showModal} onClose={() => setShowModal(false)}>
                    <div className="flex flex-col justify-center items-center text-center h-full w-full space-y-3 transition-all modal-anim">
                        <h1 className="font-caudex text-xs text-white px-10 sm:px-0 tracking-[0.2em] uppercase drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] leading-tight font-bold">
                            Let The Deep Uncover Your Purpose
                        </h1>
                        <h1 className="font-caudex text-xl sm:text-4xl text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] leading-tight font-bold">
                            Are you sure to <br /> change the password?
                        </h1>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-4">
                            <button onClick={() => setShowModal(false)} className="relative flex items-center justify-center h-12 min-w-[150px] md:min-w-[180px] px-6 group active:scale-95 transition-transform">
                                <img src={ButtonRegular} alt="No bg" className="absolute inset-0 w-full h-full object-fill pointer-events-none" />
                                <span className="relative z-10 text-white text-2xl tracking-wide">No</span>
                            </button>
                            <button onClick={handleConfirmChange} className="relative flex items-center justify-center h-12 min-w-[150px] md:min-w-[180px] px-6 group active:scale-95 transition-transform">
                                <img src={ButtonRegular} alt="Yes bg" className="absolute inset-0 w-full h-full object-fill pointer-events-none" />
                                <span className="relative z-10 text-white text-2xl tracking-wide">Yes</span>
                            </button>
                        </div>
                    </div>
                </BlueModalWrapper>

                <BlueModalWrapper isOpen={showSuccess} onClose={() => setShowSuccess(false)}>
                    <div className="flex flex-col justify-center items-center text-center h-full w-full space-y-3 transition-all modal-anim">
                        <h1 className="font-caudex text-center text-2xl sm:text-4xl text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] leading-tight font-bold p-4 px-10 sm:px-30 sm:pl-32">
                            Your password already changed, don't forget it again!
                        </h1>
                        <button onClick={() => setShowSuccess(false)} className="relative flex items-center justify-center h-12 min-w-[150px] md:min-w-[180px] px-6 group active:scale-95 transition-transform">
                            <img src={ButtonRegular} alt="Ok bg" className="absolute inset-0 w-full h-full object-fill pointer-events-none" />
                            <span className="relative z-10 text-white text-2xl tracking-wide">Okay</span>
                        </button>
                        <div className="absolute bottom-0 right-7 sm:bottom-20 sm:right-25">
                            <img src={LogoDLOR} alt="Logo" className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-md" />
                        </div>
                    </div>
                </BlueModalWrapper>

                <div className={`absolute top-6 left-6 z-70 transition-all duration-700 ease-out ${!isZooming && !isLoggingOut && !isExiting ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 pointer-events-none"}`} >
                    <ButtonSidebar onClick={toggleSidebar} />
                </div>

                <div className={`absolute top-6 right-6 z-70 transition-all duration-700 ease-out ${!isZooming && !isLoggingOut && !isExiting ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none"}`} >
                    <ButtonHome onClick={() => handleNavigate('/User/home')} />
                </div>

                <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} onNavigate={handleNavigate} />

                <div className="fixed inset-0 z-70 pointer-events-none transition-opacity duration-1000" style={{ background: "linear-gradient(to bottom, #0a2a4a, #0c365b)", opacity: isLoggingOut ? 1 : 0 }} />

                {/* Footer */}
                <div className={`absolute bottom-4 w-full text-center z-40 pointer-events-none transition-opacity duration-1000 delay-500 ${isZooming || isExiting || isLoggingOut ? "opacity-0" : "opacity-100"}`} >
                    <p className="text-white font-caudex text-[10px] md:text-xl tracking-widest drop-shadow-md">
                        @Atlantis.DLOR2026. All Right Served
                    </p>
                </div>
            </div>
        </>
    );
}
