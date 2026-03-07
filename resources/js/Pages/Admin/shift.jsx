import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import { createPortal } from "react-dom";

/* Background Assets */
import Background from "@assets/backgrounds/Alternate.webp";

/* Button Components */
import ButtonSidebar from "@components/ButtonSidebar";
import ButtonHome from "@components/ButtonHome";

/* Other Components */
import AdminSidebar from "@components/AdminSidebar";
import UnderwaterEffect from "@components/UnderwaterEffect";

// Icons
import {
    PencilSquareIcon, TrashIcon, PlusIcon,
    UserGroupIcon, ChevronLeftIcon, ChevronRightIcon,
    XMarkIcon, IdentificationIcon, ExclamationTriangleIcon,
    UserPlusIcon, ListBulletIcon, TableCellsIcon,
    ChartBarIcon, MagnifyingGlassIcon, ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const formatDisplayDate = (dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return dateString;

    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const dayName = dayNames[date.getDay()];
    const dayStr = String(day).padStart(2, "0");
    const monthStr = String(month).padStart(2, "0");
    const yearStr = String(year).padStart(4, "0");

    return `${dayName}, ${dayStr}/${monthStr}/${yearStr}`;
};

const formatDisplayTime = (timeString) => {
    if (!timeString) return "-";
    return timeString.substring(0, 5);
};

const GLOBAL_STYLES = `
    @keyframes subtlePulse {
        0%, 100% { opacity: 1; }
        50%      { opacity: 0.95; }
    }

    @keyframes popIn {
        0%   { opacity: 0; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
    }

    .pulse-effect {
        animation: subtlePulse 3s ease-in-out infinite;
    }

    .animate-popIn {
        animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .input-etched {
        padding: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        color: white;
        transition: all 0.3s;
    }

    .input-etched:focus {
        outline: none;
        border-bottom-color: #22d3ee;
    }

    /* Browser-specific icons (Date/Time) */
    input[type="time"]::-webkit-calendar-picker-indicator,
    input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(75%);
    }

    .atlantean-panel {
        background: rgba(15, 28, 46, 0.75);
        backdrop-filter: blur(12px);
        border: 4px double rgba(6, 182, 212, 0.3);
    }

    .cold-blue-filter {
        filter: brightness(0.9) contrast(1.1) saturate(1.5) hue-rotate(15deg) sepia(0.1);
    }

    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(34, 211, 238, 0.3);
        border-radius: 10px;
    }
`;

const StatCard = ({ label, value, type }) => {
    const isTotal = type === "total";
    return (
        <div
            className={`
            relative overflow-hidden rounded-sm p-4 flex items-center gap-4 group
            border-double border-4 backdrop-blur-md transition-all duration-500 flex-1
            ${
                isTotal
                    ? "bg-[#0f1c2e]/60 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:border-cyan-400/50"
                    : "bg-[#0f1c2e]/60 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:border-amber-400/50"
            }
        `}
        >
            <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-[50px] opacity-20 transition-opacity group-hover:opacity-40 ${isTotal ? "bg-cyan-500" : "bg-amber-500"}`} />
            <div className={`w-10 h-10 border border-white/10 flex items-center justify-center relative z-10 rotate-45 group-hover:rotate-0 transition-transform duration-500 ${isTotal ? "bg-cyan-900/30 text-cyan-200" : "bg-amber-900/30 text-amber-200"}`}>
                <div className="-rotate-45 group-hover:rotate-0 transition-transform duration-500">
                    {isTotal ? <TableCellsIcon className="w-5 h-5" /> : <ChartBarIcon className="w-5 h-5" />}
                </div>
            </div>
            <div className="flex flex-col relative z-10">
                <span className={`text-[10px] font-serif font-bold uppercase tracking-[0.2em] ${isTotal ? "text-cyan-200/60" : "text-amber-200/60"}`}>{label}</span>
                <span className="text-2xl font-serif text-white tracking-wide">{value}</span>
            </div>
        </div>
    );
};

const ShiftFormModal = ({ isOpen, form, onSubmit, onClose }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#020406]/90 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-[#0a121d] border-2 border-double border-cyan-600/30 p-10 shadow-2xl animate-popIn">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-all">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-8">
                    <PencilSquareIcon className="w-8 h-8" style={{ color: "#ffffff" }} />
                    <h2 className="text-3xl font-serif font-bold text-cyan-100 uppercase tracking-widest">
                        {form.data.id ? "Update Shift" : "New Shift"}
                    </h2>
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-6 text-sm text-white">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px]">Shift Name</label>
                            <input type="text" required className="input-etched w-full" value={form.data.shift} onChange={(e) => form.setData("shift", e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px]">Quota</label>
                            <input type="number" required className="input-etched w-full" value={form.data.quota} onChange={(e) => form.setData("quota", e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px]">Start Time</label>
                            <input type="time" required className="input-etched w-full" value={form.data.timeStart} onChange={(e) => form.setData("timeStart", e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px]">End Time</label>
                            <input type="time" required className="input-etched w-full" value={form.data.timeEnd} onChange={(e) => form.setData("timeEnd", e.target.value)} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px]">Shift Date</label>
                        <input type="date" required className="input-etched w-full" value={form.data.date} onChange={(e) => form.setData("date", e.target.value)} />
                    </div>
                    <button type="submit" disabled={form.processing} className={`w-full py-4 border font-bold font-serif uppercase tracking-[0.2em] transition-all ${form.processing ? "bg-gray-600/20 border-gray-500/30 text-gray-400 cursor-not-allowed" : "bg-cyan-700/20 border-cyan-500/50 text-cyan-100 hover:bg-cyan-600 hover:text-black"}`}>
                        {form.processing ? "Processing..." : "Confirm Shift"}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
};

const ShiftControlModal = ({ isOpen, activeShift, onClose }) => {
    if (!isOpen || !activeShift) return null;
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#020406]/95 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-5xl bg-[#0a121d] border-2 border-double border-cyan-600/30 shadow-2xl animate-popIn flex flex-col h-[90vh] md:h-[85vh] overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-[#050a10] flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-[0.3em] mb-1">Shift Control</span>
                        <h2 className="text-4xl font-serif font-bold text-cyan-100 tracking-widest uppercase">{activeShift.shift_no || activeShift.shift}</h2>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-all"><XMarkIcon className="w-8 h-8" /></button>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden text-white">
                    <div className="w-full p-10 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
                        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-3">
                            <IdentificationIcon className="w-6 h-6" /> Shifted Subjects
                        </h3>
                        <div className="flex flex-col gap-4">
                            {(activeShift.plottingans || []).map((plotting) => (
                                <div key={plotting.id} className="p-5 bg-emerald-950/10 border border-white/5 flex justify-between items-center rounded-sm transition-all group">
                                    <div className="flex flex-col">
                                        <span className="text-white text-lg font-serif tracking-wide">{plotting.user?.profile?.name || "Unknown"}</span>
                                        <span className="text-cyan-500/40 text-[10px] font-mono uppercase tracking-[0.2em]">{plotting.user?.email || plotting.id}</span>
                                    </div>
                                    <UserGroupIcon className="w-6 h-6 text-white/5 group-hover:text-emerald-500/20 transition-all" />
                                </div>
                            ))}
                            {(!activeShift.plottingans || activeShift.plottingans.length === 0) && (
                                <p className="text-white/40 text-sm italic">No users assigned to this shift.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-[#050a10] border-t border-white/5 flex justify-end">
                    <button onClick={onClose} className="px-14 py-4 bg-cyan-900/20 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all text-xs font-serif font-bold uppercase tracking-[0.3em]">
                        Finalize Shift
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const ConfirmModal = ({ isOpen, title, message, type, onConfirm, onClose }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#0a121d] border-2 border-double border-amber-600/30 p-12 max-w-md w-full text-center animate-popIn shadow-2xl text-white">
                <div className="mb-6 flex justify-center text-amber-500/80 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                    <ExclamationTriangleIcon className="w-16 h-16" />
                </div>
                <h3 className="text-3xl font-serif font-bold mb-4 uppercase tracking-widest">{title}</h3>
                <p className="text-amber-100/60 text-sm mb-10 leading-relaxed font-light">{message}</p>
                <div className="flex gap-6">
                    <button onClick={onClose} className="flex-1 py-3 border border-white/10 hover:bg-white/5 transition-all text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest">
                        Abort
                    </button>
                    <button onClick={onConfirm} className={`flex-1 py-3 font-bold text-white text-xs uppercase tracking-widest shadow-lg ${type === "danger" ? "bg-rose-700/20 border border-rose-500/50 hover:bg-rose-600" : "bg-amber-700/20 border border-amber-500/50 hover:bg-amber-600"} hover:text-black transition-all`}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function Shift({ shifts, filters }) {
    // --- Refs ---
    const backgroundRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // --- UI State ---
    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isZooming, setIsZooming] = useState(true);
    const [inputLocked, setInputLocked] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState("regular");
    const ITEMS_PER_PAGE = viewMode === "compact" ? 10 : 5;

    // --- Data State ---
    const [searchQuery, setSearchQuery] = useState(filters?.search || "");
    const [jumpPage, setJumpPage] = useState("");

    // --- Modal State ---
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isPlotterOpen, setIsPlotterOpen] = useState(false);
    const [activeShift, setActiveShift] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", type: "danger", onConfirm: () => {} });

    // --- Inertia Form ---
    const form = useForm({
        id: null,
        shift: "",
        date: "",
        timeStart: "",
        timeEnd: "",
        quota: 0,
        caasBooked: [],
    });

    // --- Derived Data ---
    const totalCandidatesCount = useMemo(() => shifts.data.reduce((acc, curr) => acc + (curr.plottingans?.length || 0), 0), [shifts]);
    const currentPage = shifts.current_page;
    const totalPages = shifts.last_page;

    // --- Handlers ---
    const closeAllModals = useCallback(() => {
        setIsFormOpen(false);
        setIsPlotterOpen(false);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }, []);

    const handleSearch = (value) => {
        setSearchQuery(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        searchTimeoutRef.current = setTimeout(() => {
            router.get(
                "/admin/shift",
                { search: value, perPage: ITEMS_PER_PAGE },
                { preserveState: true, replace: true }
            );
        }, 300);
    };

    const handleSaveShift = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                setIsFormOpen(false);
                form.reset();
            },
        };

        if (form.data.id) {
            form.put(`/shifts/${form.data.id}`, options);
        } else {
            form.post("/shifts", options);
        }
    };

    const handleJumpPage = (e) => {
        if (e.key === "Enter") {
            const pageNum = parseInt(jumpPage);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                router.get(
                    "/admin/shift",
                    { page: pageNum, perPage: ITEMS_PER_PAGE, search: searchQuery },
                    { preserveState: true }
                );
            }
            setJumpPage("");
        }
    };

    const handleLogout = () => {
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => {
            setIsLoggingOut(true);
            setTimeout(() => router.post("/logout"), 300);
        }, 350);
    };

    // --- Effects ---
    useEffect(() => {
        router.get(
            "/admin/shift",
            { perPage: ITEMS_PER_PAGE, search: searchQuery },
            { preserveState: true, replace: true }
        );
    }, [viewMode, ITEMS_PER_PAGE]);

    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);
        const zoomTimer = setTimeout(() => { setIsZooming(false); setInputLocked(false); }, 100);

        const skipIntro = () => {
            clearTimeout(showTimer);
            clearTimeout(zoomTimer);
            setShowImage(true);
            setIsZooming(false);
            setInputLocked(false);
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                if (isFormOpen || isPlotterOpen || confirmModal.isOpen) closeAllModals();
                else skipIntro();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("click", skipIntro);
        return () => {
            clearTimeout(showTimer);
            clearTimeout(zoomTimer);
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("click", skipIntro);
        };
    }, [isFormOpen, isPlotterOpen, confirmModal.isOpen, closeAllModals]);

    return (
        <>
            <Head title="Shift Management" />
            <style>{GLOBAL_STYLES}</style>

            <div className="fixed inset-0 w-full h-full bg-[#0a2a4a] text-white overflow-y-auto md:overflow-hidden font-sans">
                {/* Fixed Background */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <img
                        ref={backgroundRef}
                        src={Background}
                        alt="bg"
                        onLoad={() => setImageLoaded(true)}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1500 ease-out ${showImage && imageLoaded ? "opacity-100" : "opacity-0"} ${!isZooming ? "pulse-effect" : ""} cold-blue-filter`}
                        style={{
                            transform: showImage && imageLoaded ? (isZooming ? "scale(1.5)" : "scale(1.0)") : "scale(1.3)",
                            transformOrigin: "center",
                        }}
                    />
                    <UnderwaterEffect />
                    <div className={`absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black/30 transition-opacity duration-1000 ${showImage && imageLoaded ? "opacity-100" : "opacity-0"}`} />
                </div>

                {/* Content Layer */}
                <div className={`relative md:absolute md:inset-0 z-10 flex flex-col items-center justify-start md:justify-center p-4 md:p-8 transition-all duration-1000 ${isZooming ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>

                    <div className="text-center relative z-10 mb-8 w-auto md:w-full max-w-7xl flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mt-20 md:mt-0">
                        <div className="text-center md:text-left">
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: "Cormorant Infant, serif", textShadow: "0 2px 20px rgba(0,0,0,.8)" }}>
                                Shift Management
                            </h1>
                            <p className="text-sm text-cyan-400/80 font-serif tracking-[0.3em] uppercase mt-1">Manage the shift</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <StatCard label="Total Shift" value={shifts.total} type="total" />
                            <StatCard label="Filled Shift" value={totalCandidatesCount} type="passed" />
                        </div>
                    </div>

                    <div className="w-full max-w-7xl pb-20 md:pb-0">
                        <div className="atlantean-panel p-6 flex flex-col xl:flex-row justify-between items-center gap-6 rounded-t-2xl">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        form.reset();
                                        setIsFormOpen(true);
                                    }}
                                    className="px-6 py-3 bg-cyan-600/80 border border-cyan-400/50 hover:bg-cyan-500 rounded-sm font-serif font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all text-xs"
                                >
                                    <PlusIcon className="w-4 h-4" /> New Shift
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <div className="bg-black/30 p-1 rounded-sm border border-white/10 flex">
                                    <button
                                        onClick={() => setViewMode("regular")}
                                        className={`p-2 rounded-sm transition-all ${viewMode === "regular" ? "bg-cyan-600 text-white" : "text-white/40 hover:text-white"}`}
                                    >
                                        <TableCellsIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("compact")}
                                        className={`p-2 rounded-sm transition-all ${viewMode === "compact" ? "bg-cyan-600 text-white" : "text-white/40 hover:text-white"}`}
                                    >
                                        <ListBulletIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="relative group w-48 md:w-64">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
                                    <input
                                        type="text"
                                        placeholder="Search shift or date..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-xs text-cyan-100 focus:outline-none focus:border-cyan-500/50 transition-all tracking-wider"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="atlantean-panel flex flex-col border-t-0 rounded-b-2xl overflow-hidden">
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[950px]">
                                    <thead className="bg-[#0f1c2e]/95 sticky top-0 z-10 border-b border-white/10 text-cyan-100/70 font-serif text-[10px] md:text-xs uppercase tracking-widest">
                                        <tr>
                                            <th className="p-4 w-16 pl-8">No</th>
                                            <th className="p-4">Shift</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Quota</th>
                                            <th className="p-4 pr-8 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-sans">
                                        {shifts.data.map((item, index) => (
                                            <tr key={item.id} className="border-b border-white/5 hover:bg-cyan-400/5 transition-colors group">
                                                <td className={`${viewMode === "compact" ? "px-4 py-1.5 text-sm" : "p-4 text-base"} pl-8 font-mono text-white/30`}>
                                                    {(currentPage - 1) * shifts.per_page + index + 1}
                                                </td>
                                                <td className={`${viewMode === "compact" ? "px-4 py-1.5 text-sm" : "p-4 text-base md:text-lg"} font-bold uppercase tracking-widest`}>
                                                    {item.shift_no}
                                                </td>
                                                <td className={`${viewMode === "compact" ? "px-4 py-1.5 text-sm" : "p-4 text-base"} font-mono`}>
                                                    <span className="text-cyan-100">{formatDisplayDate(item.date)}</span>
                                                    <span className="text-cyan-500/30 mx-1">|</span>
                                                    <span className="text-white/60">{formatDisplayTime(item.time_start)} - {formatDisplayTime(item.time_end)}</span>
                                                </td>
                                                <td className={`${viewMode === "compact" ? "px-4 py-1.5 text-sm" : "p-4 text-lg"} font-medium`}>
                                                    {item.plottingans?.length || 0} <span className="text-white/20">/</span> {item.kuota}
                                                </td>
                                                <td className={`${viewMode === "compact" ? "px-4 py-1.5" : "p-4"} pr-8`}>
                                                    <div className="flex justify-center gap-3">
                                                        <button
                                                            onClick={() => {
                                                                setActiveShift(item);
                                                                setIsPlotterOpen(true);
                                                            }}
                                                            className={`${viewMode === "compact" ? "p-1.5" : "p-2.5"} border border-cyan-500/30 text-cyan-400 hover:text-white rounded-sm hover:bg-cyan-500/10 transition-all`}
                                                        >
                                                            <UserPlusIcon className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                form.setData({
                                                                    ...item,
                                                                    shift: item.shift_no,
                                                                    timeStart: item.time_start,
                                                                    timeEnd: item.time_end,
                                                                    quota: item.kuota,
                                                                });
                                                                setIsFormOpen(true);
                                                            }}
                                                            className={`${viewMode === "compact" ? "p-1.5" : "p-2.5"} border border-amber-500/30 text-amber-400 hover:text-white rounded-sm hover:bg-amber-500/10 transition-all`}
                                                        >
                                                            <PencilSquareIcon className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmModal({
                                                                isOpen: true,
                                                                title: "Delete Shift?",
                                                                message: `Remove ${item.shift_no} permanently?`,
                                                                type: "danger",
                                                                onConfirm: () => {
                                                                    router.delete(`/shifts/${item.id}`);
                                                                    closeAllModals();
                                                                }
                                                            })}
                                                            className={`${viewMode === "compact" ? "p-1.5" : "p-2.5"} border border-rose-500/30 text-rose-400 hover:text-white rounded-sm hover:bg-rose-500/10 transition-all`}
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="p-4 border-t border-white/5 bg-[#0f1c2e]/80 backdrop-blur-md flex justify-between items-center text-xs">
                                <div className="flex items-center gap-6 font-serif">
                                    <span className="text-sm text-white/50 font-bold uppercase tracking-widest">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                                        <span className="text-[10px] text-cyan-500/50 uppercase font-bold tracking-widest">Jump</span>
                                        <input
                                            type="text"
                                            value={jumpPage}
                                            onChange={(e) => setJumpPage(e.target.value)}
                                            onKeyDown={handleJumpPage}
                                            className="w-12 bg-black/40 border-b border-cyan-500/30 text-center text-cyan-100 py-1 focus:outline-none font-mono"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => router.get("/admin/shift", { page: currentPage - 1, perPage: ITEMS_PER_PAGE }, { preserveState: true })}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-white/10 hover:bg-cyan-500/20 disabled:opacity-20 transition-all"
                                    >
                                        <ChevronLeftIcon className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => router.get("/admin/shift", { page: currentPage + 1, perPage: ITEMS_PER_PAGE }, { preserveState: true })}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border border-white/10 hover:bg-cyan-500/20 disabled:opacity-20 transition-all"
                                    >
                                        <ChevronRightIcon className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modals Extracted */}
                <ShiftFormModal isOpen={isFormOpen} form={form} onSubmit={handleSaveShift} onClose={closeAllModals} />
                <ShiftControlModal isOpen={isPlotterOpen} activeShift={activeShift} onClose={closeAllModals} />
                <ConfirmModal {...confirmModal} onClose={closeAllModals} />

                {/* UI Fixed Elements */}
                <div className={`fixed top-6 left-6 z-[60] transition-all duration-700 ease-out ${!isZooming && !isLoggingOut ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 pointer-events-none"}`}>
                    <ButtonSidebar onClick={() => setIsSidebarOpen((prev) => !prev)} />
                </div>
                <div className={`fixed top-6 right-6 z-[60] transition-all duration-700 ease-out ${!isZooming && !isLoggingOut ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none"}`}>
                    <ButtonHome onClick={() => router.visit("/admin/home")} />
                </div>

                <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />

                {/* Overlays */}
                <div className="fixed inset-0 z-[70] pointer-events-none transition-opacity duration-1000 ease-in-out" style={{ background: "linear-gradient(to bottom, #0a2a4a, #0c365b)", opacity: isLoggingOut ? 1 : 0 }} />
                {inputLocked && <div className="fixed inset-0 z-[80] pointer-events-auto" />}
            </div>
        </>
    );
}
