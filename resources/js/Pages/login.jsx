import React, { useRef, useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import axios from "axios";

/* Background Assets */
import ImgMain from '@assets/backgrounds/Main.webp';
import ImgRoad from '@assets/backgrounds/Road.webp';
import ImgOrb from '@assets/backgrounds/Orb.webp';
import ImgDoorLocked from '@assets/backgrounds/DoorLocked.webp';
import ImgDoorUnlocked from '@assets/backgrounds/DoorUnlocked.webp';
import ImgScroll from "@assets/backgrounds/Scroll.webp";

/* Other Assets */
import ButtonLogin from "@assets/buttons/Regular.webp";
import BlueInputBox from "@components/BlueInputBox";

/* Other Components */
import UnderwaterEffect from "@components/UnderwaterEffect";

export default function Login() {
    const orbRef = useRef(null);
    const rafRef = useRef(null);
    const scrollWrapperRef = useRef(null);
    const doorRef = useRef(null);
    const roadRef = useRef(null);

    const OFFSET = {
        base: {x: 0, y : 430},
        out: {x: 0, y: 430},
        in: {x:0, y: 1100},
    }

    const SCALE = {
        bg: { enter: 1.0, idle: 1.7, out: 1.2 },
        door: { enter: 1.0, idle: 1.7, in: 3.5, out: 1.2 },
        road: { enter: 1.0, idle: 1.7, in: 3.5, out: 1.2 },
        scroll: { enter: 0.6, idle: 1, in: 0.95, out: 0.6 },
    };

    const [isIntro, setIsIntro] = useState(true);
    const [cameraState, setCameraState] = useState("enter");
    const [showColorFade, setShowColorFade] = useState(false);
    const [fadeScroll, setFadeScroll] = useState(false);

    /* Form into Backend */
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            nim: "",
            password: "",
        });

    const getTransform = (type) => {
        const scale = SCALE[type][cameraState] ?? SCALE[type].idle;
        const offset =
            cameraState === "out"
                ? OFFSET["out"]
                : cameraState === "in"
                  ? OFFSET["in"]
                  : OFFSET["base"];

        return `translate(${offset.x}px, ${offset.y}px) scale(${scale})`;
    };

    const handleMouseMove = (e) => {
        if (rafRef.current || isIntro || cameraState !== "idle") return;

        rafRef.current = requestAnimationFrame(() => {
            if (!orbRef.current || !roadRef.current) return;

            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 30;
            const y = (e.clientY / innerHeight - 0.5) * 30;

            orbRef.current.style.transform = `translate(${x}px, ${y}px) scale(${SCALE.bg.idle})`;
            roadRef.current.style.transform = `translate(${x}px, ${y}px) scale(${SCALE.road.idle})`;

            rafRef.current = null;
        });
    };

    const handleMouseLeave = () => {
        if (!orbRef.current || !roadRef.current) return;
        orbRef.current.style.transform = getTransform("bg");
        roadRef.current.style.transform = getTransform("road");
    };

    const handleOutsideClick = (e) => {
        if (cameraState !== "idle" || isIntro) return;
        if (!scrollWrapperRef.current?.contains(e.target)) {
            setCameraState("out");
            setTimeout(() => router.visit("/"), 1200);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (cameraState !== "idle" || isSubmitting) return;

        setIsSubmitting(true);
        clearErrors();

        axios.post("/login", data)
            .then((response) => {
                setFadeScroll(true);
                setTimeout(() => setCameraState("in"), 500);
                setTimeout(() => setShowColorFade(true), 800);
                setTimeout(() => {
                    window.location.href = response.data.redirect_url;
                }, 2500);
            })
            .catch((error) => {
                setIsSubmitting(false);
                if (error.response && error.response.status === 422) {
                    const serverErrors = error.response.data.errors;
                    Object.keys(serverErrors).forEach((key) => {
                        setError(key, serverErrors[key][0]);
                    });
                } else {
                    console.error("Login error", error);
                }
            });
    };

    useEffect(() => {
        const t = setTimeout(() => {
            setIsIntro(false);
            setCameraState("idle");
        }, 0);
        return () => clearTimeout(t);
    }, []);

    const commonTransformStyle = {
        transformOrigin: "bottom center",
        transition: "transform 2000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    };

    const orbStyle = { ...commonTransformStyle, transform: getTransform("bg") };
    const doorStyle = { ...commonTransformStyle, transform: getTransform("door"), };
    const roadStyle = { ...commonTransformStyle, transform: getTransform("road"), };

    const hasError = Object.keys(errors).length > 0;

    const styles = `
        .atlantis-sync {
            filter: sepia(1) hue-rotate(150deg) saturate(2) contrast(1.5) brightness(0.9);
        }
        .deep-ocean-bg {
            filter: brightness(0.8) saturate(1.2) contrast(1.1);
        }
        .cold-blue-filter-scroll {
            filter: brightness(1.1) contrast(1) saturate(0.2) hue-rotate(220deg) sepia(0.2);
        }

        .bottom-centered-asset {
            position: absolute;
            bottom: 0;
            left: 50%;
        }

        @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
        }
        .shake {
            animation: errorShake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
    `

    return (
        <>
            <Head title="Login" />
            <style>{styles}</style>

            <UnderwaterEffect />

            <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleOutsideClick}
                className="relative w-full min-h-screen overflow-hidden bg-[#0a243b]"
            >

                {/* Background */}
                <img
                    src={ImgMain}
                    alt="background"
                    className="absolute inset-0 w-full h-auto object-cover pointer-events-none deep-ocean-bg"
                />

                <img
                    ref={roadRef}
                    src={ImgRoad}
                    alt="road"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-auto min-w-[2000px] z-5 atlantis-sync"
                    style={roadStyle}
                />

                <img
                    ref={orbRef}
                    src={ImgOrb}
                    alt="background"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-auto min-w-[2000px] z-0 atlantis-sync"
                    style={orbStyle}
                />

            <img
                ref={doorRef}
                src={cameraState === "in" ? ImgDoorUnlocked : ImgDoorLocked}
                alt="door"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-auto min-w-[2000px] z-10 atlantis-sync"
                style={doorStyle}
            />

                <div className="absolute inset-0 backdrop-blur-[2px] bg-black/10 z-20 pointer-events-none" />
                <div className="absolute inset-0 bg-linear-to-b from-cyan-800/5 via-blue-900/10 to-indigo-900/15 z-25 pointer-events-none mix-blend-screen" />

                {/* Scroll & Form */}
                <div
                    className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
                    ref={scrollWrapperRef}
                >
                    <div
                        className={`flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${hasError ? "shake" : ""}`}
                        style={{
                            transform: `scale(${SCALE.scroll[cameraState] ?? SCALE.scroll.idle})`,
                            opacity: fadeScroll
                                ? 0
                                : cameraState === "enter" ||
                                    cameraState === "out"
                                  ? 0
                                  : 1,
                            filter:
                                cameraState === "out"
                                    ? "blur(8px)"
                                    : "blur(0px)",
                            pointerEvents:
                                cameraState === "idle" ? "auto" : "none",
                            width: "520px",
                            maxHeight: "90vh",
                        }}
                    >
                        <img
                            src={ImgScroll}
                            alt="scroll"
                            className="w-auto max-h-full object-contain cold-blue-filter-scroll origin-center scale-150 sm:scale-170 md:scale-190"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-14 sm:px-12 text-[#0b3a66] gap-1 sm:gap-6">
                            <h1
                                className="font-serif font-extrabold tracking-wide drop-shadow-lg text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 text-center"
                                style={{
                                    fontFamily: "Cormorant Infant",
                                    color: hasError ? "#7f1d1d" : "#0c365b",
                                    textShadow:
                                        "0 2px 10px rgba(12, 54, 91, 0.3), 0 0 20px rgba(96, 165, 250, 0.2)",
                                }}
                            >
                                {hasError ? "Access Denied" : "Insert The Key"}
                            </h1>

                            <form
                                onSubmit={handleSubmit}
                                className="w-auto sm:w-[90%] max-w-105 flex flex-col gap-3 sm:gap-4"
                            >
                                <div className="flex flex-col gap-1">
                                    <label
                                        className="font-serif font-bold text-2xl md:text-4xl"
                                        style={{
                                            fontFamily: "Cormorant Infant",
                                            color: "#0c365b",
                                            textShadow:
                                                "0 2px 10px rgba(12, 54, 91, 0.3), 0 0 20px rgba(96, 165, 250, 0.2)",
                                        }}
                                    >
                                        NIM
                                    </label>
                                    <BlueInputBox
                                        value={data.nim}
                                        onChange={(e) =>
                                            setData("nim", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label
                                        className="font-serif font-bold text-2xl md:text-4xl"
                                        style={{
                                            fontFamily: "Cormorant Infant",
                                            color: "#0c365b",
                                            textShadow:
                                                "0 2px 10px rgba(12, 54, 91, 0.3), 0 0 20px rgba(96, 165, 250, 0.2)",
                                        }}
                                    >
                                        Password
                                    </label>
                                    <BlueInputBox
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                </div>

                                {/* Red Error Message */}
                                {hasError && (
                                    <p className="text-red-700 font-serif font-bold text-center text-sm animate-pulse tracking-tight">
                                        The key does not match the lock...
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-4 sm:mt-8 relative self-center transition-transform duration-300 hover:scale-110"
                                >
                                    <img
                                        src={ButtonLogin}
                                        alt="Start"
                                        className="w-45 sm:w-55 h-11 sm:h-13 drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] cold-blue-filter-light"
                                    />
                                    <span
                                        className="absolute inset-0 flex items-center justify-center text-xl sm:text-3xl font-extrabold tracking-[2px]"
                                        style={{
                                            color: "#e0f2fe",
                                            textShadow:
                                                "0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)",
                                        }}
                                    >
                                        Dive In
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="absolute inset-0 z-30 pointer-events-none mix-blend-lighten opacity-30">
                    <div className="absolute inset-0 bg-linear-to-b from-cyan-400/5 via-transparent to-blue-500/5" />
                </div>
                <div
                    className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-1000 ease-in-out"
                    style={{
                        background:
                            "linear-gradient(to bottom, #0a2a4a, #0c365b)",
                        opacity: showColorFade ? 1 : 0,
                    }}
                />
            </div>
        </>
    );
}
