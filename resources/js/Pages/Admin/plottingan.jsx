import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
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
    UserGroupIcon, ChevronLeftIcon, ChevronRightIcon,
    XMarkIcon, IdentificationIcon, ArrowDownTrayIcon,
    ListBulletIcon, TableCellsIcon, ChartBarIcon,
    MagnifyingGlassIcon, EyeIcon,
} from "@heroicons/react/24/outline";

const formatDisplayDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const dayName = dayNames[date.getDay()];
    const dayStr = String(date.getDate()).padStart(2, "0");
    const monthStr = String(date.getMonth() + 1).padStart(2, "0");
    const yearStr = date.getFullYear();

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

    /* --- Visual Effects & Filters --- */
    .cold-blue-filter {
        filter: brightness(0.9) contrast(1.1) saturate(1.5) hue-rotate(15deg) sepia(0.1);
    }

    .pulse-effect {
        animation: subtlePulse 3s ease-in-out infinite;
    }

    .animate-popIn {
        animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .atlantean-panel {
        background: rgba(15, 28, 46, 0.75);
        backdrop-filter: blur(12px);
        border: 4px double rgba(6, 182, 212, 0.3);
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
            <div
                className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-[50px] opacity-20 transition-opacity group-hover:opacity-40 ${isTotal ? "bg-cyan-500" : "bg-amber-500"}`}
            />
            <div
                className={`w-10 h-10 border border-white/10 flex items-center justify-center relative z-10 rotate-45 group-hover:rotate-0 transition-transform duration-500 ${isTotal ? "bg-cyan-900/30 text-cyan-200" : "bg-amber-900/30 text-amber-200"}`}
            >
                <div className="-rotate-45 group-hover:rotate-0 transition-transform duration-500">
                    {isTotal ? <TableCellsIcon className="w-5 h-5" /> : <ChartBarIcon className="w-5 h-5" />}
                </div>
            </div>
            <div className="flex flex-col relative z-10">
                <span className={`text-[10px] font-serif font-bold uppercase tracking-[0.2em] ${isTotal ? "text-cyan-200/60" : "text-amber-200/60"}`}>
                    {label}
                </span>
                <span className="text-2xl font-serif text-white tracking-wide">{value}</span>
            </div>
        </div>
    );
};

const ShiftUsersModal = ({ isOpen, shift, users, loading, onClose }) => {
    if (!isOpen || !shift) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#020406]/95 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-[#0a121d] border-2 border-double border-cyan-600/30 shadow-2xl animate-popIn flex flex-col max-h-[85vh] overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-[#050a10] flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-[0.3em] mb-1">
                            Users in Shift
                        </span>
                        <h2 className="text-4xl font-serif font-bold text-cyan-100 tracking-widest uppercase">
                            {shift.shift_no}
                        </h2>
                        <span className="text-sm text-white/40 mt-1">
                            {formatDisplayDate(shift.date)} | {formatDisplayTime(shift.time_start)} - {formatDisplayTime(shift.time_end)}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-all">
                        <XMarkIcon className="w-8 h-8" />
                    </button>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden text-white">
                    <div className="w-full p-10 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
                        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-3">
                            <IdentificationIcon className="w-6 h-6" />
                            Assigned Users ({loading ? "..." : users.length})
                        </h3>
                        {loading ? (
                            <p className="text-white/40 text-sm">Loading users...</p>
                        ) : users.length === 0 ? (
                            <p className="text-white/40 text-sm italic">No users assigned to this shift.</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {users.map((plotting) => (
                                    <div
                                        key={plotting.id}
                                        className="p-5 bg-emerald-950/10 border border-white/5 flex justify-between items-center rounded-sm transition-all group hover:border-emerald-500/20"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-white text-lg font-serif tracking-wide">
                                                {plotting.user?.profile?.name || "Unknown"}
                                            </span>
                                            <span className="text-cyan-500/40 text-[10px] font-mono uppercase tracking-[0.2em]">
                                                {plotting.user?.email || "-"}
                                            </span>
                                        </div>
                                        <UserGroupIcon className="w-6 h-6 text-white/5 group-hover:text-emerald-500/20 transition-all" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-4 bg-[#050a10] border-t border-white/5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-14 py-4 bg-cyan-900/20 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all text-xs font-serif font-bold uppercase tracking-[0.3em]"
                    >
                        Close
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
export default function Plottingan({ shifts }) {
    const backgroundRef = useRef(null);

    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isZooming, setIsZooming] = useState(true);
    const [inputLocked, setInputLocked] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState("regular");

    const [searchQuery, setSearchQuery] = useState("");
    const [jumpPage, setJumpPage] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" });

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);
    const [shiftUsers, setShiftUsers] = useState([]);
    const [loadingShiftUsers, setLoadingShiftUsers] = useState(false);

    const ITEMS_PER_PAGE = viewMode === "compact" ? 10 : 5;
    const currentPage = shifts.current_page;
    const totalPages = shifts.last_page;

    const processedData = useMemo(() => {
        let data = [...shifts.data].filter((item) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (item.shift_no?.toLowerCase() || "").includes(query);
        });

        if (sortConfig.key) {
            data.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];
                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return data;
    }, [shifts.data, searchQuery, sortConfig]);

    // --- Handlers ---
    const closeAllModals = useCallback(() => {
        setIsViewModalOpen(false);
        setSelectedShift(null);
        setShiftUsers([]);
    }, []);

    const handleSort = (key) => {
        let direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });
    };

    const handleJumpPage = (e) => {
        if (e.key === "Enter") {
            const pageNum = parseInt(jumpPage);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                router.get(
                    "/admin/plottingan",
                    { page: pageNum, perPage: ITEMS_PER_PAGE },
                    { preserveState: true }
                );
            }
            setJumpPage("");
        }
    };

    const handleViewShiftUsers = async (shift) => {
        if (!shift) return;
        setSelectedShift(shift);
        setIsViewModalOpen(true);
        setLoadingShiftUsers(true);

        try {
            const response = await fetch(`/admin/plottingan/shift/${shift.id}`);
            const data = await response.json();
            setShiftUsers(data);
        } catch (error) {
            console.error("Error fetching shift users:", error);
            setShiftUsers([]);
        } finally {
            setLoadingShiftUsers(false);
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
            "/admin/plottingan",
            { perPage: ITEMS_PER_PAGE },
            { preserveState: true, replace: true }
        );
    }, [viewMode, ITEMS_PER_PAGE]);

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
                if (isViewModalOpen) closeAllModals();
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
    }, [isViewModalOpen, closeAllModals]);

    return (
        <>
            <Head title="Plottingan" />
            <style>{GLOBAL_STYLES}</style>

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
                            transform: showImage && imageLoaded ? (isZooming ? "scale(1.5)" : "scale(1.0)") : "scale(1.3)",
                            transformOrigin: "center",
                        }}
                    />
                    <UnderwaterEffect />
                    <div className={`absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black/30 transition-opacity duration-1000 ${showImage && imageLoaded ? "opacity-100" : "opacity-0"}`} />
                </div>

                {/* Contents */}
                <div className={`relative md:absolute md:inset-0 z-10 flex flex-col items-center justify-start md:justify-center p-4 md:p-8 transition-all duration-1000 ${isZooming ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>

                    {/* Header Details */}
                    <div className="text-center relative z-10 mb-8 w-auto md:w-full max-w-7xl flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mt-20 md:mt-0">
                        <div className="text-center md:text-left">
                            <h1
                                className="text-5xl md:text-7xl font-bold leading-tight"
                                style={{ fontFamily: "Cormorant Infant, serif", textShadow: "0 2px 20px rgba(0,0,0,.8)" }}
                            >
                                Plottingan
                            </h1>
                            <p className="text-sm text-cyan-400/80 font-serif tracking-[0.3em] uppercase mt-1">
                                User Shift Assignments
                            </p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <StatCard label="Total Shifts" value={shifts.total} type="total" />
                        </div>
                    </div>

                    {/* Table Panel */}
                    <div className="w-full max-w-7xl pb-20 md:pb-0">
                        <div className="atlantean-panel p-6 flex flex-col xl:flex-row justify-between items-center gap-6 rounded-t-2xl">

                            {/* Left Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => (window.location.href = "/admin/plottingan/export")}
                                    className="p-3 border border-emerald-500/40 text-emerald-300 rounded-sm hover:bg-emerald-900/20 transition-all"
                                    title="Export all plottingan data"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Right Action Tools */}
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
                                        placeholder="Filter by shift..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
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
                                            <th className="p-4 w-16 pl-8 text-left">No</th>
                                            <th
                                                className="p-4 text-left cursor-pointer hover:text-cyan-400"
                                                onClick={() => handleSort('shift_no')}
                                            >
                                                Shift
                                            </th>
                                            <th
                                                className="p-4 text-left cursor-pointer hover:text-cyan-400"
                                                onClick={() => handleSort('date')}
                                            >
                                                Date
                                            </th>
                                            <th
                                                className="p-4 text-left cursor-pointer hover:text-cyan-400"
                                                onClick={() => handleSort('time_start')}
                                            >
                                                Time
                                            </th>
                                            <th
                                                className="p-4 text-left cursor-pointer hover:text-cyan-400"
                                                onClick={() => handleSort('kuota')}
                                            >
                                                Quota
                                            </th>
                                            <th className="p-4 pr-8 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-sans">
                                        {processedData.map((item, index) => (
                                            <tr key={item.id} className="border-b border-white/5 hover:bg-cyan-400/5 transition-colors group">
                                                <td className={`${viewMode === "compact" ? "px-4 py-1.5" : "p-4"} pl-8 font-mono text-white/30 text-sm`}>
                                                    {(currentPage - 1) * shifts.per_page + index + 1}
                                                </td>
                                                <td className={`${viewMode === "compact" ? "px-4 py-1.5 text-sm" : "p-4 text-base md:text-lg"} font-bold uppercase tracking-widest`}>
                                                    {item.shift_no || "-"}
                                                </td>
                                                <td className={`${viewMode === "compact" ? "px-4 py-1.5 text-sm" : "p-4 text-base"} font-mono text-cyan-100`}>
                                                    {formatDisplayDate(item.date)}
                                                </td>
                                                <td className={`${viewMode === "compact" ? "px-4 py-1.5 text-sm" : "p-4 text-base"} font-mono text-white/60`}>
                                                    {formatDisplayTime(item.time_start)} - {formatDisplayTime(item.time_end)}
                                                </td>
                                                <td className={`${viewMode === "compact" ? "px-4 py-1.5 text-sm" : "p-4 text-lg"} font-medium`}>
                                                    {item.plottingans_count || 0} <span className="text-white/20">/</span> {item.kuota}
                                                </td>
                                                <td className={`${viewMode === "compact" ? "px-4 py-1.5" : "p-4"} pr-8`}>
                                                    <div className="flex justify-center gap-3">
                                                        <button
                                                            onClick={() => handleViewShiftUsers(item)}
                                                            className={`${viewMode === "compact" ? "p-1.5" : "p-2.5"} border border-cyan-500/30 text-cyan-400 hover:text-white rounded-sm hover:bg-cyan-500/10 transition-all`}
                                                            title="View all users in this shift"
                                                        >
                                                            <EyeIcon className="w-5 h-5" />
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
                                        onClick={() => router.get("/admin/plottingan", { page: currentPage - 1, perPage: ITEMS_PER_PAGE }, { preserveState: true })}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-white/10 hover:bg-cyan-500/20 disabled:opacity-20 transition-all"
                                    >
                                        <ChevronLeftIcon className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => router.get("/admin/plottingan", { page: currentPage + 1, perPage: ITEMS_PER_PAGE }, { preserveState: true })}
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

                <ShiftUsersModal
                    isOpen={isViewModalOpen}
                    shift={selectedShift}
                    users={shiftUsers}
                    loading={loadingShiftUsers}
                    onClose={closeAllModals}
                />

                <div className={`fixed top-6 left-6 z-[60] transition-all duration-700 ease-out ${!isZooming && !isLoggingOut ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 pointer-events-none"}`}>
                    <ButtonSidebar onClick={() => setIsSidebarOpen((prev) => !prev)} />
                </div>
                <div className={`fixed top-6 right-6 z-[60] transition-all duration-700 ease-out ${!isZooming && !isLoggingOut ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none"}`}>
                    <ButtonHome onClick={() => (window.location.href = "/admin/home")} />
                </div>

                <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />

                {/* Lock Screen Overlays */}
                <div
                    className="fixed inset-0 z-[70] pointer-events-none transition-opacity duration-1000 ease-in-out"
                    style={{ background: "linear-gradient(to bottom, #0a2a4a, #0c365b)", opacity: isLoggingOut ? 1 : 0 }}
                />
                {inputLocked && <div className="fixed inset-0 z-[80] pointer-events-auto" />}
            </div>
        </>
    );
}
