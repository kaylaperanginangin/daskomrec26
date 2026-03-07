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
    PencilSquareIcon,
    TrashIcon,
    EyeIcon,
    PlusIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    MagnifyingGlassIcon,
    ListBulletIcon,
    TableCellsIcon,
    UserGroupIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const formatDisplayDate = (dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return dateString;

    const dayNames = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
    ];
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
    @keyframes subtlePulse { 0%,100% { opacity:1 } 50% { opacity:.95 } }
    .cold-blue-filter { filter: brightness(0.9) contrast(1.1) saturate(1.2) hue-rotate(15deg) sepia(0.1); }
    .pulse-effect { animation: subtlePulse 3s ease-in-out infinite; }
    .atlantean-panel { background: rgba(15, 28, 46, 0.75); backdrop-filter: blur(12px); border: 4px double rgba(6, 182, 212, 0.3); }
    .input-etched { background: rgba(0,0,0,0.2); border-bottom: 2px solid rgba(255,255,255,0.1); color: white; transition: all 0.3s; padding: 12px; }
    .input-etched:focus { outline: none; border-bottom-color: #22d3ee; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.4); border-radius: 3px; }
    @keyframes popIn { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
    .animate-popIn { animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(75%); }
    input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(75%); }
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
                    <UserGroupIcon className="w-5 h-5" />
                </div>
            </div>
            <div className="flex flex-col relative z-10">
                <span
                    className={`text-[10px] font-serif font-bold uppercase tracking-[0.2em] ${isTotal ? "text-cyan-200/60" : "text-amber-200/60"}`}
                >
                    {label}
                </span>
                <span className="text-2xl font-serif text-white tracking-wide">
                    {value}
                </span>
            </div>
        </div>
    );
};

const CaasFormModal = ({ isOpen, form, onSubmit, onClose }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-[#020406]/90 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-2xl bg-[#0a121d] border-2 border-double border-cyan-600/30 p-10 shadow-2xl animate-popIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-all"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <h2 className="text-3xl font-serif font-bold text-cyan-100 border-b border-white/5 pb-4 mb-8 uppercase tracking-widest text-center">
                    {form.data.id ? "Edit User" : "Create User"}
                </h2>
                <form
                    onSubmit={onSubmit}
                    className="flex flex-col gap-6 text-sm text-white"
                >
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">
                                Subject Name
                            </label>
                            <input
                                type="text"
                                required
                                className="input-etched w-full"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData("name", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">
                                NIM
                            </label>
                            <input
                                type="text"
                                required
                                disabled={form.data.id}
                                className={`input-etched w-full ${form.data.id ? "opacity-50 cursor-not-allowed" : ""}`}
                                value={form.data.nim}
                                onChange={(e) =>
                                    form.setData("nim", e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block">
                                Gender
                            </label>
                            <select
                                required
                                className="input-etched w-full"
                                value={form.data.gender}
                                onChange={(e) =>
                                    form.setData("gender", e.target.value)
                                }
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">
                                Major
                            </label>
                            <select
                                required
                                className="input-etched w-full"
                                value={form.data.major}
                                onChange={(e) =>
                                    form.setData("major", e.target.value)
                                }
                            >
                                <option value="">Select Major</option>
                                <option value="Teknik Elektro">
                                    Teknik Elektro
                                </option>
                                <option value="Teknik Biomedis">
                                    Teknik Biomedis
                                </option>
                                <option value="Teknik Fisika">
                                    Teknik Fisika
                                </option>
                                <option value="Teknik Telekomunikasi">
                                    Teknik Telekomunikasi
                                </option>
                                <option value="Teknik Sistem Energi">
                                    Teknik Sistem Energi
                                </option>
                            </select>
                        </div>
                        <div>
                            <label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">
                                Assigned Class
                            </label>
                            <input
                                type="text"
                                required
                                className="input-etched w-full font-mono"
                                value={form.data.class}
                                onChange={(e) =>
                                    form.setData("class", e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className={`w-full py-4 border font-bold font-serif uppercase tracking-[0.2em] transition-all ${form.processing ? "bg-gray-600/20 border-gray-500/30 text-gray-400 cursor-not-allowed" : "bg-cyan-700/20 border-cyan-500/50 text-cyan-100 hover:bg-cyan-600 hover:text-black"}`}
                    >
                        {form.processing
                            ? form.data.id
                                ? "Updating..."
                                : "Creating..."
                            : form.data.id
                              ? "Update Record"
                              : "Authorize Record"}
                    </button>
                </form>
            </div>
        </div>,
        document.body,
    );
};

const CaasViewModal = ({ isOpen, viewData, onClose }) => {
    if (!isOpen || !viewData) return null;
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-[#020406]/95 backdrop-blur-md"
                onClick={onClose}
            />
            <div className="relative w-full max-w-2xl bg-[#0a121d] border-2 border-double border-cyan-600/30 shadow-2xl animate-popIn flex flex-col overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-[#050a10]">
                    <h2 className="text-3xl font-serif font-bold text-cyan-100 tracking-widest uppercase text-center">
                        Subject Manifest
                    </h2>
                    <p className="text-white/40 text-[10px] font-mono uppercase text-center mt-1">
                        Unique Record Identifier: {viewData.nim}
                    </p>
                </div>
                <div className="p-10 flex flex-col gap-8 text-sm text-white">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-1 tracking-widest">
                                Subject Identity
                            </span>
                            <span className="text-2xl font-serif">
                                {viewData.profile?.name || "N/A"}
                            </span>
                        </div>
                        <div>
                            <span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-1 tracking-widest">
                                NIM / ID
                            </span>
                            <span className="text-lg font-mono text-cyan-200">
                                {viewData.nim}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                        <div>
                            <span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-1 tracking-widest">
                                Major
                            </span>
                            <span className="text-base font-bold text-cyan-100">
                                {viewData.profile?.major || "N/A"}
                            </span>
                        </div>
                        <div>
                            <span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-1 tracking-widest">
                                Class Code
                            </span>
                            <span className="text-base font-bold font-mono text-cyan-100">
                                {viewData.profile?.class || "N/A"}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                        <div>
                            <span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-1 tracking-widest">
                                Caas Stage
                            </span>
                            <span className="text-cyan-200 font-bold font-mono tracking-wider">
                                {viewData.caas_stage?.stage?.name || "N/A"}
                            </span>
                        </div>
                        <div>
                            <span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-2 tracking-widest">
                                Gender
                            </span>
                            <span className="px-4 py-1.5 rounded-sm border text-[10px] font-bold uppercase tracking-widest text-cyan-400 border-cyan-500/30 bg-cyan-900/20">
                                {viewData.profile?.gender || "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-white/5 bg-[#050a10] flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-14 py-4 bg-cyan-900/20 border border-white/10 text-white/60 hover:text-white transition-all text-xs font-serif font-bold uppercase tracking-[0.3em]"
                    >
                        Finalize Observation
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onClose }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-[#0a121d] border-2 border-double border-amber-600/30 p-12 max-w-md w-full text-center animate-popIn shadow-2xl text-white">
                <div className="mb-6 flex justify-center text-amber-500/80 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                    <ExclamationTriangleIcon className="w-16 h-16" />
                </div>
                <h3 className="text-3xl font-serif font-bold mb-4 uppercase tracking-widest">
                    {title}
                </h3>
                <p className="text-amber-100/60 text-sm mb-10 leading-relaxed font-light">
                    {message}
                </p>
                <div className="flex gap-6">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 border border-white/10 hover:bg-white/5 transition-all text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest"
                    >
                        Abort
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 font-bold text-white text-xs uppercase tracking-widest shadow-lg bg-rose-700/20 border border-rose-500/50 hover:bg-rose-600 hover:text-black transition-all"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function Caas({ users, stages, filters }) {
    // --- Refs ---
    const backgroundRef = useRef(null);
    const fileInputRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // --- UI State ---
    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isZooming, setIsZooming] = useState(true);
    const [inputLocked, setInputLocked] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- View State ---
    const [viewMode, setViewMode] = useState("regular");
    const ITEMS_PER_PAGE = viewMode === "small" ? 10 : 5;

    // --- Data State ---
    const [searchQuery, setSearchQuery] = useState(filters?.search || "");
    const [jumpPage, setJumpPage] = useState("");

    // --- Modal State ---
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null,
    });
    const [viewData, setViewData] = useState(null);

    // --- Export Modal State ---
    const [exportAll, setExportAll] = useState(true);
    const [exportStage, setExportStage] = useState("");
    const [exportStatus, setExportStatus] = useState("");

    // Form for creating/editing users
    const form = useForm({
        id: null,
        nim: "",
        name: "",
        major: "",
        class: "",
        gender: "",
    });

    // --- Derived Data ---
    const totalCandidatesCount = useMemo(
        () =>
            users.data.reduce(
                (acc, curr) => acc + (curr.plottingans?.length || 0),
                0,
            ),
        [users],
    );
    const currentPage = users.current_page;
    const totalPages = users.last_page;
    const totalUsers = users.total;

    // --- Handlers ---
    const closeAllModals = useCallback(() => {
        setIsFormOpen(false);
        setIsViewOpen(false);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        form.reset();
    }, [form]);

    const handleSearch = (value) => {
        setSearchQuery(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        searchTimeoutRef.current = setTimeout(() => {
            router.get(
                "/admin/caas",
                { search: value, perPage: ITEMS_PER_PAGE },
                { preserveState: true, replace: true },
            );
        }, 300);
    };

    const handleStageChange = (caasStageId, newStageId) => {
        router.put(
            `/admin/caas/${caasStageId}/stage`,
            { stage_id: newStageId },
            { preserveScroll: true, preserveState: true },
        );
    };

    const handleStatusChange = (caasStageId, newStatus) => {
        setConfirmModal({
            isOpen: true,
            title: "Change Status",
            message: `Change status to ${newStatus}?`,
            onConfirm: () => {
                router.put(
                    `/admin/caas/${caasStageId}/status`,
                    { status: newStatus },
                    { preserveScroll: true, preserveState: true },
                );
                closeAllModals();
            },
        });
    };

    // Update pagination when view mode changes
    useEffect(() => {
        router.get(
            "/admin/caas",
            { perPage: ITEMS_PER_PAGE },
            { preserveState: true, replace: true },
        );
    }, [viewMode]);

    // --- Listeners ---
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
                if (isFormOpen || isViewOpen || confirmModal.isOpen)
                    closeAllModals();
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
    }, [isFormOpen, isViewOpen, confirmModal.isOpen, closeAllModals]);

    const getStatusColor = (status) => {
        if (status === "Passed")
            return "text-emerald-400 border-emerald-500/30 bg-emerald-900/20";
        return "text-rose-400 border-rose-500/30 bg-rose-900/20";
    };

    // --- Actions ---
    const handleSave = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => closeAllModals(),
            preserveScroll: true,
        };

        if (form.data.id) {
            form.put(`/users/${form.data.id}`, options);
        } else {
            form.post("/admin/caas", options);
        }
    };

    const handleDelete = (id, name, nim) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Record",
            message: `Permanently delete user ${name} - ${nim}?`,
            onConfirm: () => {
                router.delete(`/users/${id}`);
                closeAllModals();
            },
        });
    };

    const handleExportExcel = () => {
        setExportAll(true);
        setExportStage("");
        setExportStatus("");
        setIsExportOpen(true);
    };

    const handleExportSubmit = () => {
        const params = new URLSearchParams();
        if (!exportAll) {
            if (exportStage) params.append("stage_id", exportStage);
            if (exportStatus) params.append("status", exportStatus);
        }
        params.append("export_all", exportAll ? "1" : "0");
        window.location.href = `/admin/caas/export?${params.toString()}`;
        setIsExportOpen(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        router.post("/admin/caas/import", formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.flash?.success) {
                    setConfirmModal({
                        isOpen: true,
                        title: "Import Successful",
                        message: page.props.flash.success,
                        onConfirm: closeAllModals,
                    });
                }
            },
            onError: (errors) => {
                const errorMsg =
                    errors.file ||
                    errors.error ||
                    Object.values(errors)[0] ||
                    "Import failed. Please check your file format.";
                setConfirmModal({
                    isOpen: true,
                    title: "Import Failed",
                    message: errorMsg,
                    onConfirm: closeAllModals,
                });
            },
        });

        e.target.value = null;
    };

    const handleJumpPage = (e) => {
        if (e.key === "Enter") {
            const pageNum = parseInt(jumpPage);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                router.get(
                    "/admin/caas",
                    {
                        page: pageNum,
                        perPage: ITEMS_PER_PAGE,
                        search: searchQuery,
                    },
                    { preserveState: true },
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
            "/admin/caas",
            { perPage: ITEMS_PER_PAGE, search: searchQuery },
            { preserveState: true, replace: true },
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
                if (isFormOpen || isViewOpen || confirmModal.isOpen)
                    closeAllModals();
                else skipIntro();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("click", skipIntro);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(zoomTimer);
            if (searchTimeoutRef.current)
                clearTimeout(searchTimeoutRef.current);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("click", skipIntro);
        };
    }, [isFormOpen, isViewOpen, confirmModal.isOpen, closeAllModals]);

    return (
        <>
            <Head title="CaAs Management" />
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

                {/* Main Content Area */}
                <div
                    className={`relative md:absolute md:inset-0 z-10 flex flex-col items-center justify-start md:justify-center p-4 md:p-8 transition-all duration-1000 ${isZooming ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                >
                    {/* Header */}
                    <div className="text-center relative z-10 mb-8 mt-24 md:mt-0 w-full max-w-7xl flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h1
                                className="text-5xl md:text-7xl font-bold leading-tight"
                                style={{
                                    fontFamily: "Cormorant Infant, serif",
                                    textShadow: "0 2px 20px rgba(0,0,0,.8)",
                                }}
                            >
                                CaAs Management
                            </h1>
                            <p className="text-sm text-cyan-400/80 font-serif tracking-[0.3em] uppercase mt-1">
                                Find the true gem
                            </p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <StatCard
                                label="Total Subjects"
                                value={totalUsers}
                                type="total"
                            />
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="w-full max-w-7xl pb-20 md:pb-0">
                        <div className="atlantean-panel p-6 flex flex-col xl:flex-row justify-between items-center gap-6 rounded-t-2xl">
                            {/* Left Tools */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        form.reset();
                                        setIsFormOpen(true);
                                    }}
                                    className="px-6 py-3 bg-cyan-600/80 border border-cyan-400/50 hover:bg-cyan-500 rounded-sm font-serif font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all text-xs"
                                >
                                    <PlusIcon className="w-4 h-4" /> New CaAs
                                </button>
                                <button
                                    onClick={() =>
                                        setConfirmModal({
                                            isOpen: true,
                                            title: "Import CaAs",
                                            message: `Do you want to import CaAs?`,
                                            onConfirm: () => {
                                                fileInputRef.current.click();
                                                closeAllModals();
                                            },
                                        })
                                    }
                                    className="p-3 border border-blue-500/40 text-blue-300 rounded-sm hover:bg-blue-900/20 transition-all"
                                >
                                    <ArrowUpTrayIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleExportExcel}
                                    className="p-3 border border-emerald-500/40 text-emerald-300 rounded-sm hover:bg-emerald-900/20 transition-all"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".xlsx, .xls, .csv"
                                    className="hidden"
                                />
                            </div>

                            {/* Right Tools */}
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <div className="bg-black/30 p-1 rounded-sm border border-white/10 flex">
                                    <button
                                        onClick={() => setViewMode("regular")}
                                        className={`p-2 rounded-sm transition-all ${viewMode === "regular" ? "bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "text-white/40 hover:text-white"}`}
                                    >
                                        <TableCellsIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("small")}
                                        className={`p-2 rounded-sm transition-all ${viewMode === "small" ? "bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "text-white/40 hover:text-white"}`}
                                    >
                                        <ListBulletIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <div
                                    className="relative group w-48 md:w-64"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
                                    <input
                                        type="text"
                                        placeholder="Search manifest..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            handleSearch(e.target.value)
                                        }
                                        className="w-full bg-black/30 border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-xs text-cyan-100 focus:outline-none focus:border-cyan-500/50 transition-all tracking-widest"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Main Data Table */}
                        <div className="atlantean-panel flex flex-col border-t-0 rounded-b-2xl overflow-hidden">
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[950px]">
                                    <thead className="bg-[#0f1c2e]/95 sticky top-0 z-10 border-b border-white/10 text-cyan-100/70 font-serif text-[10px] md:text-xs uppercase tracking-widest">
                                        <tr>
                                            <th className="p-4 w-16 pl-8">#</th>
                                            <th className="p-4">Identity</th>
                                            <th className="p-4">Major</th>
                                            <th className="p-4">Class</th>
                                            <th className="p-4">Stage</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 pr-8 text-center">
                                                Manage
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-sans">
                                        {users.data.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className="border-b border-white/5 hover:bg-cyan-400/5 transition-colors group"
                                            >
                                                <td
                                                    className={`${viewMode === "small" ? "px-4 py-1.5 text-sm" : "p-4 pl-8 text-base"} font-mono text-white/30`}
                                                >
                                                    {(currentPage - 1) *
                                                        ITEMS_PER_PAGE +
                                                        index +
                                                        1}
                                                </td>
                                                <td
                                                    className={`${viewMode === "small" ? "px-4 py-1.5" : "p-4"}`}
                                                >
                                                    <div className="flex flex-col">
                                                        <span
                                                            className={`${viewMode === "small" ? "text-sm" : "text-base"} font-bold uppercase tracking-wider text-white`}
                                                        >
                                                            {item.profile
                                                                ?.name || "N/A"}
                                                        </span>
                                                        <span className="text-xs font-bold font-mono text-cyan-500/80 uppercase tracking-widest">
                                                            {item.nim}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td
                                                    className={`${viewMode === "small" ? "px-4 py-1.5 text-sm" : "p-4 text-base"} font-bold text-cyan-100/90`}
                                                >
                                                    {item.profile?.major ||
                                                        "N/A"}
                                                </td>
                                                <td
                                                    className={`${viewMode === "small" ? "px-4 py-1.5 text-sm" : "p-4 text-base"} font-bold text-cyan-100`}
                                                >
                                                    {item.profile?.class ||
                                                        "N/A"}
                                                </td>
                                                <td
                                                    className={`${viewMode === "small" ? "px-4 py-1.5" : "p-4"}`}
                                                >
                                                    <select
                                                        value={
                                                            item.caas_stage
                                                                ?.stage_id || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleStageChange(
                                                                item.caas_stage
                                                                    ?.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className={`${viewMode === "small" ? "text-xs" : "text-sm"} font-bold bg-transparent border border-white/10 rounded-sm px-2 py-1 text-cyan-100 focus:outline-none focus:border-cyan-500/50 cursor-pointer hover:border-cyan-400/30 transition-all`}
                                                    >
                                                        {stages.map((stage) => (
                                                            <option
                                                                key={stage.id}
                                                                value={stage.id}
                                                                className="bg-[#0f1c2e] text-cyan-100"
                                                            >
                                                                {stage.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td
                                                    className={`${viewMode === "small" ? "px-4 py-1.5" : "p-4"}`}
                                                >
                                                    {item.caas_stage ? (
                                                        <div className="flex items-center gap-1.5">
                                                            {[
                                                                "LOLOS",
                                                                "PROSES",
                                                                "GAGAL",
                                                            ].map((status) => (
                                                                <button
                                                                    key={status}
                                                                    onClick={() =>
                                                                        item
                                                                            .caas_stage
                                                                            .status !==
                                                                            status &&
                                                                        handleStatusChange(
                                                                            item
                                                                                .caas_stage
                                                                                .id,
                                                                            status,
                                                                        )
                                                                    }
                                                                    className={`
                                                                        ${viewMode === "small" ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-1.5 text-xs"}
                                                                        font-bold uppercase tracking-wider rounded-sm
                                                                        border transition-all duration-300 cursor-pointer
                                                                        ${
                                                                            item
                                                                                .caas_stage
                                                                                .status ===
                                                                            status
                                                                                ? status ===
                                                                                  "LOLOS"
                                                                                    ? "bg-emerald-900/40 border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                                                                                    : status ===
                                                                                        "PROSES"
                                                                                      ? "bg-amber-900/40 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                                                                                      : "bg-rose-900/40 border-rose-500/60 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                                                                                : "bg-transparent border-white/10 text-white/25 hover:text-white/50 hover:border-white/25"
                                                                        }
                                                                    `}
                                                                >
                                                                    {status}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-white/30 text-xs italic">
                                                            N/A
                                                        </span>
                                                    )}
                                                </td>
                                                <td
                                                    className={`${viewMode === "small" ? "px-4 py-1.5" : "p-4"} pr-8`}
                                                >
                                                    <div className="flex justify-center gap-3">
                                                        <button
                                                            onClick={() => {
                                                                setViewData(
                                                                    item,
                                                                );
                                                                setIsViewOpen(
                                                                    true,
                                                                );
                                                            }}
                                                            className={`${viewMode === "small" ? "p-1.5" : "p-2.5"} border border-cyan-500/30 text-cyan-400 hover:text-white rounded-sm hover:bg-cyan-500/10 transition-all`}
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                form.setData({
                                                                    id: item.id,
                                                                    nim: item.nim,
                                                                    name:
                                                                        item
                                                                            .profile
                                                                            ?.name ||
                                                                        "",
                                                                    major:
                                                                        item
                                                                            .profile
                                                                            ?.major ||
                                                                        "",
                                                                    class:
                                                                        item
                                                                            .profile
                                                                            ?.class ||
                                                                        "",
                                                                    gender:
                                                                        item
                                                                            .profile
                                                                            ?.gender ||
                                                                        "",
                                                                });
                                                                setIsFormOpen(
                                                                    true,
                                                                );
                                                            }}
                                                            className={`${viewMode === "small" ? "p-1.5" : "p-2.5"} border border-amber-500/30 text-amber-400 hover:text-white rounded-sm hover:bg-amber-500/10 transition-all`}
                                                        >
                                                            <PencilSquareIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id,
                                                                    item.profile
                                                                        ?.name,
                                                                    item.nim,
                                                                )
                                                            }
                                                            className={`${viewMode === "small" ? "p-1.5" : "p-2.5"} border border-rose-500/30 text-rose-400 hover:text-white rounded-sm hover:bg-rose-500/10 transition-all`}
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="p-4 border-t border-white/5 bg-[#0f1c2e]/80 backdrop-blur-md flex justify-between items-center text-xs font-serif">
                                <div className="flex items-center gap-6">
                                    <span className="font-bold uppercase tracking-widest text-white/50">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                                        <span className="text-[10px] text-cyan-500/50 uppercase font-bold tracking-widest">
                                            Jump
                                        </span>
                                        <input
                                            type="text"
                                            value={jumpPage}
                                            onChange={(e) =>
                                                setJumpPage(e.target.value)
                                            }
                                            onKeyDown={handleJumpPage}
                                            className="w-12 bg-black/40 border-b border-cyan-500/30 text-center text-cyan-100 py-1 focus:outline-none font-mono"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() =>
                                            router.get(
                                                "/admin/caas",
                                                {
                                                    page: currentPage - 1,
                                                    perPage: ITEMS_PER_PAGE,
                                                    search: searchQuery,
                                                },
                                                { preserveState: true },
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className="p-2 border border-white/10 hover:bg-cyan-500/20 disabled:opacity-20 transition-all"
                                    >
                                        <ChevronLeftIcon className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            router.get(
                                                "/admin/caas",
                                                {
                                                    page: currentPage + 1,
                                                    perPage: ITEMS_PER_PAGE,
                                                    search: searchQuery,
                                                },
                                                { preserveState: true },
                                            )
                                        }
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
                <CaasFormModal
                    isOpen={isFormOpen}
                    form={form}
                    onSubmit={handleSave}
                    onClose={closeAllModals}
                />
                <CaasViewModal
                    isOpen={isViewOpen}
                    viewData={viewData}
                    onClose={closeAllModals}
                />
                <ConfirmModal {...confirmModal} onClose={closeAllModals} />

                {/* UI Fixed Elements */}
                <div
                    className={`fixed top-6 left-6 z-[60] transition-all duration-700 ease-out ${!isZooming && !isLoggingOut ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 pointer-events-none"}`}
                >
                    <ButtonSidebar
                        onClick={() => setIsSidebarOpen((prev) => !prev)}
                    />
                </div>
                <div
                    className={`fixed top-6 right-6 z-[60] transition-all duration-700 ease-out ${!isZooming && !isLoggingOut ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none"}`}
                >
                    <ButtonHome onClick={() => router.visit("/admin/home")} />
                </div>

                <AdminSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                />

                {/* MODALS (Form, View, Confirm) */}
                {isFormOpen &&
                    createPortal(
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <div
                                className="absolute inset-0 bg-[#020406]/90 backdrop-blur-sm"
                                onClick={closeAllModals}
                            />
                            <div className="relative w-full max-w-2xl bg-[#0a121d] border-2 border-double border-cyan-600/30 p-10 shadow-2xl animate-popIn">
                                <button
                                    onClick={closeAllModals}
                                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-all"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                                <h2 className="text-3xl font-serif font-bold text-cyan-100 border-b border-white/5 pb-4 mb-8 uppercase tracking-widest text-center">
                                    {form.data.id ? "Edit User" : "Create User"}
                                </h2>
                                <form
                                    onSubmit={handleSave}
                                    className="flex flex-col gap-6 text-sm text-white"
                                >
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">
                                                Subject Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="input-etched w-full"
                                                value={form.data.name}
                                                onChange={(e) =>
                                                    form.setData(
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">
                                                NIM
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                disabled={form.data.id}
                                                className={`input-etched w-full ${form.data.id ? "opacity-50 cursor-not-allowed" : ""}`}
                                                value={form.data.nim}
                                                onChange={(e) =>
                                                    form.setData(
                                                        "nim",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block">
                                                Gender
                                            </label>
                                            <select
                                                required
                                                className="input-etched w-full"
                                                value={form.data.gender}
                                                onChange={(e) =>
                                                    form.setData(
                                                        "gender",
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select Gender
                                                </option>
                                                <option value="Male">
                                                    Male
                                                </option>
                                                <option value="Female">
                                                    Female
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">
                                                Major
                                            </label>
                                            <select
                                                required
                                                className="input-etched w-full"
                                                value={form.data.major}
                                                onChange={(e) =>
                                                    form.setData(
                                                        "major",
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select Major
                                                </option>
                                                <option value="Teknik Elektro">
                                                    Teknik Elektro
                                                </option>
                                                <option value="Teknik Biomedis">
                                                    Teknik Biomedis
                                                </option>
                                                <option value="Teknik Fisika">
                                                    Teknik Fisika
                                                </option>
                                                <option value="Teknik Telekomunikasi">
                                                    Teknik Telekomunikasi
                                                </option>
                                                <option value="Teknik Sistem Energi">
                                                    Teknik Sistem Energi
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">
                                                Assigned Class
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="input-etched w-full font-mono"
                                                value={form.data.class}
                                                onChange={(e) =>
                                                    form.setData(
                                                        "class",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className={`w-full py-4 border font-bold font-serif uppercase tracking-[0.2em] transition-all ${
                                            form.processing
                                                ? "bg-gray-600/20 border-gray-500/30 text-gray-400 cursor-not-allowed"
                                                : "bg-cyan-700/20 border-cyan-500/50 text-cyan-100 hover:bg-cyan-600 hover:text-black"
                                        }`}
                                    >
                                        {form.processing
                                            ? form.data.id
                                                ? "Updating..."
                                                : "Creating..."
                                            : form.data.id
                                              ? "Update Record"
                                              : "Authorize Record"}
                                    </button>
                                </form>
                            </div>
                        </div>,
                        document.body,
                    )}

                {isViewOpen &&
                    viewData &&
                    createPortal(
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <div
                                className="absolute inset-0 bg-[#020406]/95 backdrop-blur-md"
                                onClick={closeAllModals}
                            />
                            <div className="relative w-full max-w-2xl bg-[#0a121d] border-2 border-double border-cyan-600/30 shadow-2xl animate-popIn flex flex-col overflow-hidden">
                                <div className="p-8 border-b border-white/5 bg-[#050a10]">
                                    <h2 className="text-3xl font-serif font-bold text-cyan-100 tracking-widest uppercase text-center">
                                        Subject Manifest
                                    </h2>
                                    <p className="text-white/40 text-[10px] font-mono uppercase text-center mt-1">
                                        Unique Record Identifier: {viewData.nim}
                                    </p>
                                </div>
                                <div className="p-10 flex flex-col gap-8 text-sm text-white">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-1 tracking-widest">
                                                Subject Identity
                                            </span>
                                            <span className="text-2xl font-serif">
                                                {viewData.profile?.name ||
                                                    "N/A"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-1 tracking-widest">
                                                NIM / ID
                                            </span>
                                            <span className="text-lg font-mono text-cyan-200">
                                                {viewData.nim}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                        <div>
                                            <span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-1 tracking-widest">
                                                Major
                                            </span>
                                            <span className="text-base">
                                                {viewData.profile?.major ||
                                                    "N/A"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-1 tracking-widest">
                                                Class Code
                                            </span>
                                            <span className="text-base font-mono">
                                                {viewData.profile?.class ||
                                                    "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                        <div>
                                            <span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-1 tracking-widest">
                                                Caas Stage
                                            </span>
                                            <span className="text-cyan-200 font-mono tracking-wider">
                                                {viewData.caas_stage?.stage
                                                    ?.name || "N/A"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-2 tracking-widest">
                                                Gender
                                            </span>
                                            <span className="px-4 py-1.5 rounded-sm border text-[10px] font-bold uppercase tracking-widest text-cyan-400 border-cyan-500/30 bg-cyan-900/20">
                                                {viewData.profile?.gender ||
                                                    "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-white/5 bg-[#050a10] flex justify-center">
                                    <button
                                        onClick={closeAllModals}
                                        className="px-14 py-4 bg-cyan-900/20 border border-white/10 text-white/60 hover:text-white transition-all text-xs font-serif font-bold uppercase tracking-[0.3em]"
                                    >
                                        Finalize Observation
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body,
                    )}

                {isExportOpen &&
                    createPortal(
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <div
                                className="absolute inset-0 bg-[#020406]/90 backdrop-blur-sm"
                                onClick={() => setIsExportOpen(false)}
                            />
                            <div className="relative w-full max-w-lg bg-[#0a121d] border-2 border-double border-emerald-600/30 p-10 shadow-2xl animate-popIn">
                                <button
                                    onClick={() => setIsExportOpen(false)}
                                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-all"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                                <h2 className="text-3xl font-serif font-bold text-emerald-100 border-b border-white/5 pb-4 mb-8 uppercase tracking-widest text-center">
                                    Export Data
                                </h2>
                                <div className="flex flex-col gap-6">
                                    {/* Export All Toggle */}
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={exportAll}
                                            onChange={(e) =>
                                                setExportAll(e.target.checked)
                                            }
                                            className="w-5 h-5 accent-emerald-500 cursor-pointer"
                                        />
                                        <span className="text-sm text-white font-serif uppercase tracking-widest group-hover:text-emerald-300 transition-colors">
                                            Export All CaAs Data
                                        </span>
                                    </label>

                                    {/* Stage Filter */}
                                    <div
                                        className={`transition-opacity duration-300 ${exportAll ? "opacity-30 pointer-events-none" : "opacity-100"}`}
                                    >
                                        <label className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">
                                            Stage
                                        </label>
                                        <select
                                            value={exportStage}
                                            onChange={(e) =>
                                                setExportStage(e.target.value)
                                            }
                                            className="input-etched w-full"
                                            disabled={exportAll}
                                        >
                                            <option value="">All Stages</option>
                                            {stages.map((stage) => (
                                                <option
                                                    key={stage.id}
                                                    value={stage.id}
                                                    className="bg-[#0f1c2e]"
                                                >
                                                    {stage.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Status Filter */}
                                    <div
                                        className={`transition-opacity duration-300 ${exportAll ? "opacity-30 pointer-events-none" : "opacity-100"}`}
                                    >
                                        <label className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={exportStatus}
                                            onChange={(e) =>
                                                setExportStatus(e.target.value)
                                            }
                                            className="input-etched w-full"
                                            disabled={exportAll}
                                        >
                                            <option value="">
                                                All Statuses
                                            </option>
                                            <option
                                                value="LOLOS"
                                                className="bg-[#0f1c2e]"
                                            >
                                                LOLOS
                                            </option>
                                            <option
                                                value="PROSES"
                                                className="bg-[#0f1c2e]"
                                            >
                                                PROSES
                                            </option>
                                            <option
                                                value="GAGAL"
                                                className="bg-[#0f1c2e]"
                                            >
                                                GAGAL
                                            </option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={handleExportSubmit}
                                        className="w-full py-4 border font-bold font-serif uppercase tracking-[0.2em] transition-all bg-emerald-700/20 border-emerald-500/50 text-emerald-100 hover:bg-emerald-600 hover:text-black flex items-center justify-center gap-2"
                                    >
                                        <ArrowDownTrayIcon className="w-5 h-5" />
                                        Export to Excel
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body,
                    )}

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
                                        className={`flex-1 py-3 font-bold text-white text-xs uppercase tracking-widest shadow-lg bg-rose-700/20 border border-rose-500/50 hover:bg-rose-600 hover:text-black transition-all`}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body,
                    )}
                {/* Overlays */}
                <div
                    className="fixed inset-0 z-[70] pointer-events-none transition-opacity duration-1000 ease-in-out"
                    style={{
                        background:
                            "linear-gradient(to bottom, #0a2a4a, #0c365b)",
                        opacity: isLoggingOut ? 1 : 0,
                    }}
                />
                {inputLocked && (
                    <div className="fixed inset-0 z-[80] pointer-events-auto" />
                )}
            </div>
        </>
    );
}
