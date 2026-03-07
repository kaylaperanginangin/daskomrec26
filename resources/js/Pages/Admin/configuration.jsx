import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Head, router } from "@inertiajs/react";
import { createPortal } from "react-dom";

/* Background Assets */
import Background from "@assets/backgrounds/Alternate.webp";

/* Buttons Components */
import ButtonSidebar from "@components/ButtonSidebar";
import ButtonHome from "@components/ButtonHome";

/* Other Components */
import AdminSidebar from "@components/AdminSidebar";
import RichTextEditor from "@components/RichTextEditor";
import UnderwaterEffect from "@components/UnderwaterEffect";

// Icons
import {
    PencilSquareIcon,
    TrashIcon,
    PlusIcon,
    UserGroupIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
    IdentificationIcon,
    ExclamationTriangleIcon,
    UserPlusIcon,
    ListBulletIcon,
    TableCellsIcon,
    UserMinusIcon,
    ChartBarIcon,
    MagnifyingGlassIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

export default function Configuration({ stages }) {
    const backgroundRef = useRef(null);
    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isZooming, setIsZooming] = useState(true);
    const [inputLocked, setInputLocked] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Edit form modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formProcessing, setFormProcessing] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [formData, setFormData] = useState({
        stageId: null,
        stageName: "",
        success_message: "",
        fail_message: "",
        link: "",
        pengumuman_on: false,
        isi_jadwal_on: false,
        puzzles_on: false,
    });

    // Initialize configurations from stages
    const [configurations, setConfigurations] = useState(() => {
        if (stages && stages.length > 0) {
            const allConfigs = [];
            stages.forEach((stage) => {
                if (stage.configurations && stage.configurations.length > 0) {
                    stage.configurations.forEach((config) => {
                        allConfigs.push({
                            ...config,
                            stageName: stage.name,
                            stageId: stage.id,
                            success_message: stage.success_message || "",
                            fail_message: stage.fail_message || "",
                            link: stage.link || "",
                        });
                    });
                }
            });
            return allConfigs;
        }
        return [];
    });

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "danger",
        onConfirm: () => {},
    });

    const closeAllModals = useCallback(() => {
        setIsFormOpen(false);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }, []);

    // Toggle handler — persists to backend immediately
    const handleToggle = (config, field) => {
        const newValue = !config[field];

        setConfigurations((prev) =>
            prev.map((c) =>
                c.id === config.id ? { ...c, [field]: newValue } : c,
            ),
        );

        router.put(
            `/admin/configuration/${config.stageId}`,
            {
                success_message: config.success_message,
                fail_message: config.fail_message,
                link: config.link,
                pengumuman_on:
                    field === "pengumuman_on" ? newValue : config.pengumuman_on,
                isi_jadwal_on:
                    field === "isi_jadwal_on" ? newValue : config.isi_jadwal_on,
                puzzles_on:
                    field === "puzzles_on" ? newValue : config.puzzles_on,
            },
            { preserveScroll: true },
        );
    };

    // Open edit modal
    const openEditForm = (config) => {
        setFormData({
            stageId: config.stageId,
            stageName: config.stageName,
            success_message: config.success_message || "",
            fail_message: config.fail_message || "",
            link: config.link || "",
            pengumuman_on: config.pengumuman_on,
            isi_jadwal_on: config.isi_jadwal_on,
            puzzles_on: config.puzzles_on,
        });
        setIsPreviewMode(false);
        setIsFormOpen(true);
    };

    // Submit edit form
    const handleSaveStage = (e) => {
        e.preventDefault();
        setFormProcessing(true);

        router.put(
            `/admin/configuration/${formData.stageId}`,
            {
                success_message: formData.success_message,
                fail_message: formData.fail_message,
                link: formData.link,
                pengumuman_on: formData.pengumuman_on,
                isi_jadwal_on: formData.isi_jadwal_on,
                puzzles_on: formData.puzzles_on,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setFormProcessing(false);
                    setIsFormOpen(false);
                },
                onError: () => {
                    setFormProcessing(false);
                },
            },
        );
    };

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
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                if (isFormOpen || confirmModal.isOpen) closeAllModals();
                else skipIntro();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("click", skipIntro);
        return () => {
            clearTimeout(showTimer);
            clearTimeout(zoomTimer);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("click", skipIntro);
        };
    }, [isFormOpen, confirmModal.isOpen, closeAllModals]);

    const handleLogout = () => {
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => {
            setIsLoggingOut(true);
            setTimeout(() => router.post("/logout"), 1000);
        }, 350);
    };

    const styles = `
        @keyframes subtlePulse { 0%,100% { opacity:1 } 50% { opacity:.95 } }
        .cold-blue-filter { filter: brightness(0.9) contrast(1.1) saturate(1.5) hue-rotate(15deg) sepia(0.1); }
        .pulse-effect { animation: subtlePulse 3s ease-in-out infinite; }
        .atlantean-panel { background: rgba(15, 28, 46, 0.75); backdrop-filter: blur(12px); border: 4px double rgba(6, 182, 212, 0.3); }
        .input-etched { background: rgba(0,0,0,0.2); border-bottom: 2px solid rgba(255,255,255,0.1); color: white; transition: all 0.3s; padding: 12px; }
        .input-etched:focus { outline: none; border-bottom-color: #22d3ee; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.3); border-radius: 10px; }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        .animate-popIn { animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        input[type="time"]::-webkit-calendar-picker-indicator{
            filter: invert(75%);
        }

        input[type="date"]::-webkit-calendar-picker-indicator{
            filter: invert(75%);
        }
    `;

    return (
        <>
            <Head title="Configuration" />
            <style>{styles}</style>

            <div className="fixed inset-0 w-full h-full bg-[#0a2a4a] text-white overflow-y-auto md:overflow-hidden font-sans">
                {/* Background */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <img
                        ref={backgroundRef}
                        src={Background}
                        alt="bg"
                        onLoad={() => setImageLoaded(true)}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1500 ease-out ${showImage && imageLoaded ? "opacity-100" : "opacity-0"} ${!isZooming ? "pulse-effect" : ""} cold-blue-filter`}
                        style={{
                            transform:
                                showImage && imageLoaded
                                    ? isZooming
                                        ? "scale(1.5)"
                                        : "scale(1.0)"
                                    : "scale(1.3)",
                            transformOrigin: "center",
                        }}
                    />
                    <UnderwaterEffect />
                    <div
                        className={`absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black/30 transition-opacity duration-1000 ${showImage && imageLoaded ? "opacity-100" : "opacity-0"}`}
                    />
                </div>

                {/* Contents */}
                <div
                    className={`relative md:absolute md:inset-0 z-10 flex flex-col items-center justify-start md:justify-center p-4 md:p-8 transition-all duration-1000 ${isZooming ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                >
                    <div className="text-center relative z-10 mb-8 w-auto md:w-full max-w-7xl flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mt-20 md:mt-0">
                        <div className="text-center md:text-left">
                            <h1
                                className="text-5xl md:text-7xl font-bold leading-tight"
                                style={{
                                    fontFamily: "Cormorant Infant, serif",
                                    textShadow: "0 2px 20px rgba(0,0,0,.8)",
                                }}
                            >
                                Stage Configuration
                            </h1>
                            <p className="text-sm text-cyan-400/80 font-serif tracking-[0.3em] uppercase mt-1">
                                Manage the stage
                            </p>
                        </div>
                    </div>

                    <div className="w-full max-w-7xl pb-20 md:pb-0">
                        <div className="atlantean-panel p-6 flex flex-col xl:flex-row justify-between items-center gap-6 rounded-t-2xl"></div>

                        <div className="atlantean-panel flex flex-col border-t-0 rounded-b-2xl overflow-hidden">
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[950px]">
                                    <thead className="bg-[#0f1c2e]/95 sticky top-0 z-10 border-b border-white/10 text-cyan-100/70 font-serif text-[10px] md:text-xs uppercase tracking-widest">
                                        <tr>
                                            <th className="p-4 w-16 pl-8">
                                                No
                                            </th>
                                            <th className="p-4">Stage</th>
                                            <th className="p-4">
                                                Announcement
                                            </th>
                                            <th className="p-4">
                                                Shift Selection
                                            </th>
                                            <th className="p-4">Puzzles</th>
                                            <th className="p-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-sans">
                                        {configurations.map((config, index) => (
                                            <tr
                                                key={config.id}
                                                className="border-b border-white/5 hover:bg-cyan-400/5 transition-colors group"
                                            >
                                                <td className="p-4 pl-8 font-mono text-white/30 text-[10px]">
                                                    {index + 1}
                                                </td>
                                                <td className="p-4 text-base md:text-lg font-bold uppercase tracking-widest">
                                                    {config.stageName}
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() =>
                                                            handleToggle(
                                                                config,
                                                                "pengumuman_on",
                                                            )
                                                        }
                                                        className={`px-6 py-2 rounded-sm font-bold uppercase tracking-widest text-sm transition-all ${
                                                            config.pengumuman_on
                                                                ? "bg-emerald-500/30 border border-emerald-500/50 text-emerald-100 hover:bg-emerald-600"
                                                                : "bg-gray-600/20 border border-gray-500/30 text-gray-400 hover:bg-gray-500/20"
                                                        }`}
                                                    >
                                                        {config.pengumuman_on
                                                            ? "ON"
                                                            : "OFF"}
                                                    </button>
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() =>
                                                            handleToggle(
                                                                config,
                                                                "isi_jadwal_on",
                                                            )
                                                        }
                                                        className={`px-6 py-2 rounded-sm font-bold uppercase tracking-widest text-sm transition-all ${
                                                            config.isi_jadwal_on
                                                                ? "bg-emerald-500/30 border border-emerald-500/50 text-emerald-100 hover:bg-emerald-600"
                                                                : "bg-gray-600/20 border border-gray-500/30 text-gray-400 hover:bg-gray-500/20"
                                                        }`}
                                                    >
                                                        {config.isi_jadwal_on
                                                            ? "ON"
                                                            : "OFF"}
                                                    </button>
                                                </td>
                                                <td className="p-4">
                                                    {config.stageName ===
                                                        "Rising" && (
                                                        <button
                                                            onClick={() =>
                                                                handleToggle(
                                                                    config,
                                                                    "puzzles_on",
                                                                )
                                                            }
                                                            className={`px-6 py-2 rounded-sm font-bold uppercase tracking-widest text-sm transition-all ${
                                                                config.puzzles_on
                                                                    ? "bg-emerald-500/30 border border-emerald-500/50 text-emerald-100 hover:bg-emerald-600"
                                                                    : "bg-gray-600/20 border border-gray-500/30 text-gray-400 hover:bg-gray-500/20"
                                                            }`}
                                                        >
                                                            {config.puzzles_on
                                                                ? "ON"
                                                                : "OFF"}
                                                        </button>
                                                    )}
                                                </td>

                                                <td className="p-4">
                                                    <button
                                                        onClick={() =>
                                                            openEditForm(config)
                                                        }
                                                        className="p-2 border border-amber-500/30 text-amber-400 hover:text-white rounded-sm hover:bg-amber-500/10 transition-all"
                                                    >
                                                        <PencilSquareIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/* EDIT MODAL */}
                {isFormOpen &&
                    createPortal(
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                            <div
                                className="absolute inset-0 bg-[#020406]/90 backdrop-blur-sm"
                                onClick={closeAllModals}
                            />
                            <div className="relative w-full max-w-xl bg-[#0a121d] border-2 border-double border-cyan-600/30 shadow-2xl animate-popIn my-8">
                                <button
                                    onClick={closeAllModals}
                                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-all z-10"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                                {/* Header */}
                                <div className="flex items-center gap-4 p-6 border-b border-white/5">
                                    <PencilSquareIcon
                                        className="w-8 h-8"
                                        style={{ color: "#ffffff" }}
                                    />
                                    <h2 className="text-2xl font-serif font-bold text-cyan-100 uppercase tracking-widest">
                                        {formData.stageName}
                                    </h2>
                                </div>
                                {/* Edit/Preview Toggle */}
                                <div className="flex border-b border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setIsPreviewMode(false)}
                                        className={`flex-1 py-3 text-xs font-serif font-bold uppercase tracking-widest transition-all ${!isPreviewMode ? "bg-cyan-700/20 text-cyan-100 border-b-2 border-cyan-500" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsPreviewMode(true)}
                                        className={`flex-1 py-3 text-xs font-serif font-bold uppercase tracking-widest transition-all ${isPreviewMode ? "bg-cyan-700/20 text-cyan-100 border-b-2 border-cyan-500" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}
                                    >
                                        Preview
                                    </button>
                                </div>
                                {/* Content */}
                                <div className="p-8">
                                    {!isPreviewMode ? (
                                        <form
                                            onSubmit={handleSaveStage}
                                            className="flex flex-col gap-6 text-sm text-white"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <label className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px]">
                                                    Success Message
                                                </label>
                                                <RichTextEditor
                                                    editorKey={`success-${formData.stageId}`}
                                                    value={
                                                        formData.success_message
                                                    }
                                                    onChange={(value) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            success_message:
                                                                value,
                                                        }))
                                                    }
                                                    placeholder="Enter success message..."
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px]">
                                                    Fail Message
                                                </label>
                                                <RichTextEditor
                                                    editorKey={`fail-${formData.stageId}`}
                                                    value={
                                                        formData.fail_message
                                                    }
                                                    onChange={(value) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            fail_message: value,
                                                        }))
                                                    }
                                                    placeholder="Enter fail message..."
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px]">
                                                    Link
                                                </label>
                                                <input
                                                    type="url"
                                                    className="input-etched w-full"
                                                    placeholder="https://..."
                                                    value={formData.link}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            link: e.target
                                                                .value,
                                                        }))
                                                    }
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={formProcessing}
                                                className={`w-full py-4 border font-bold font-serif uppercase tracking-[0.2em] transition-all ${
                                                    formProcessing
                                                        ? "bg-gray-600/20 border-gray-500/30 text-gray-400 cursor-not-allowed"
                                                        : "bg-cyan-700/20 border-cyan-500/50 text-cyan-100 hover:bg-cyan-600 hover:text-black"
                                                }`}
                                            >
                                                {formProcessing
                                                    ? "Processing..."
                                                    : "Save Changes"}
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="flex flex-col gap-6 text-sm text-white">
                                            <div className="border border-emerald-500/20 bg-emerald-900/10 p-6 relative">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                                                <h4 className="text-lg font-serif text-emerald-400 mb-4 text-center uppercase tracking-widest">
                                                    Success Message Preview
                                                </h4>
                                                <div
                                                    className="text-emerald-100/80 leading-relaxed font-light prose prose-invert prose-sm max-w-none"
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            formData.success_message ||
                                                            "<p class='text-emerald-100/40 italic'>No message set</p>",
                                                    }}
                                                />
                                            </div>
                                            <div className="border border-rose-500/20 bg-rose-900/10 p-6 relative">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent"></div>
                                                <h4 className="text-lg font-serif text-rose-400 mb-4 text-center uppercase tracking-widest">
                                                    Fail Message Preview
                                                </h4>
                                                <div
                                                    className="text-rose-100/80 leading-relaxed font-light prose prose-invert prose-sm max-w-none"
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            formData.fail_message ||
                                                            "<p class='text-rose-100/40 italic'>No message set</p>",
                                                    }}
                                                />
                                            </div>
                                            {formData.link && (
                                                <div className="border border-cyan-500/20 bg-cyan-900/10 p-4">
                                                    <span className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px] block mb-2">
                                                        Link
                                                    </span>
                                                    <a
                                                        href={formData.link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-cyan-300 hover:text-cyan-100 underline break-all"
                                                    >
                                                        {formData.link}
                                                    </a>
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsPreviewMode(false)
                                                }
                                                className="w-full py-4 border bg-cyan-700/20 border-cyan-500/50 text-cyan-100 hover:bg-cyan-600 hover:text-black font-bold font-serif uppercase tracking-[0.2em] transition-all"
                                            >
                                                Back to Edit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>,
                        document.body,
                    )}
                {/* CONFIRMATION DIALOG */}
                {confirmModal.isOpen &&
                    createPortal(
                        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
                            <div
                                className="absolute inset-0 bg-black/95 backdrop-blur-sm"
                                onClick={closeAllModals}
                            />
                            <div className="relative bg-[#0a121d] border-2 border-double border-amber-600/30 p-12 max-w-md w-full text-center animate-popIn shadow-2xl text-white">
                                <div className="mb-6 flex justify-center text-amber-500/80 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                                    <ExclamationTriangleIcon className="w-16 h-16" />
                                </div>
                                <h3 className="text-3xl font-serif font-bold mb-4 uppercase tracking-widest">
                                    {confirmModal.title}
                                </h3>
                                <p className="text-amber-100/60 text-sm mb-10 leading-relaxed font-light">
                                    {confirmModal.message}
                                </p>
                                <div className="flex gap-6">
                                    <button
                                        onClick={closeAllModals}
                                        className="flex-1 py-3 border border-white/10 hover:bg-white/5 transition-all text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        onClick={confirmModal.onConfirm}
                                        className={`flex-1 py-3 font-bold text-white text-xs uppercase tracking-widest shadow-lg ${confirmModal.type === "danger" ? "bg-rose-700/20 border border-rose-500/50 hover:bg-rose-600" : "bg-amber-700/20 border border-amber-500/50 hover:bg-amber-600"} hover:text-black transition-all`}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body,
                    )}

                {/* Sidebar Button */}
                <div className={`absolute top-6 left-6 z-60 transition-all duration-700 ease-out ${!isZooming && !isLoggingOut ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 pointer-events-none"}`} >
                    <ButtonSidebar onClick={() => setIsSidebarOpen((prev) => !prev)} />
                </div>
                <div className={`absolute top-6 right-6 z-60 transition-all duration-700 ease-out ${!isZooming && !isLoggingOut ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none"}`} >
                    <ButtonHome onClick={() => router.visit("/admin/home")} />
                </div>

                <AdminSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                />

                <div
                    className="fixed inset-0 z-70 pointer-events-none transition-opacity duration-1000 ease-in-out"
                    style={{
                        background:
                            "linear-gradient(to bottom, #0a2a4a, #0c365b)",
                        opacity: isLoggingOut ? 1 : 0,
                    }}
                />
                {inputLocked && (
                    <div className="fixed inset-0 z-80 pointer-events-auto" />
                )}
            </div>
        </>
    );
}
