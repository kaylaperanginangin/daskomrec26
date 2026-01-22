import React, { useState } from 'react';

export default function AdminDashboard() {
    // --- 1. DATA STATES ---
    const [shiftOn, setShiftOn] = useState(true);
    const [announcementOn, setAnnouncementOn] = useState(false);
    const [systemState, setSystemState] = useState('Administration');

    // Announcement Content Data
    const [passMessage, setPassMessage] = useState("Congratulations! You have passed the selection process. Welcome to the team.");
    const [failMessage, setFailMessage] = useState("Thank you for your participation. Unfortunately, you did not pass this selection phase.");

    // --- 2. UI/MODAL STATES ---
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState({ type: '', value: null });
    
    // Editor State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editorTab, setEditorTab] = useState('pass'); // 'pass' or 'fail'
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    // Temp states for the editor (so we can cancel without saving)
    const [tempPass, setTempPass] = useState('');
    const [tempFail, setTempFail] = useState('');

    const stateOptions = [
        "Administration",
        "Coding and Writing Test",
        "Interview",
        "Grouping Task",
        "Teaching Test",
        "Rising"
    ];

    // --- 3. HANDLERS ---

    // -- Main Toggle Logic --
    const requestChange = (type, value) => {
        setPendingAction({ type, value });
        setIsConfirmOpen(true);
    };

    const applyChange = () => {
        const { type, value } = pendingAction;
        if (type === 'shift') setShiftOn(value);
        if (type === 'announcement') setAnnouncementOn(value);
        if (type === 'state') setSystemState(value);
        setIsConfirmOpen(false);
        setPendingAction({ type: '', value: null });
    };

    const cancelChange = () => {
        setIsConfirmOpen(false);
        setPendingAction({ type: '', value: null });
    };

    // -- Editor Logic --
    const openEditor = () => {
        // Load current saved messages into temp state
        setTempPass(passMessage);
        setTempFail(failMessage);
        setIsPreviewMode(false);
        setIsEditorOpen(true);
    };

    const saveDrafts = () => {
        setPassMessage(tempPass);
        setFailMessage(tempFail);
        setIsEditorOpen(false);
    };

    // --- 4. SUB-COMPONENTS ---

    const Toggle = ({ isOn, onToggle }) => (
        <button 
            onClick={() => requestChange(onToggle.type, !isOn)}
            className={`
                relative w-16 h-8 rounded-full transition-all duration-300 ease-in-out focus:outline-none shadow-inner
                ${isOn 
                    ? 'bg-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                    : 'bg-slate-700/80 hover:bg-slate-600/80'}
            `}
        >
            <div 
                className={`
                    absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 cubic-bezier(0.4, 0.0, 0.2, 1)
                    ${isOn ? 'translate-x-8' : 'translate-x-0'}
                `} 
            />
        </button>
    );

    const StatusBadge = ({ isOn, activeText, inactiveText }) => (
        <div className={`
            px-4 py-1.5 rounded-md text-xs font-bold tracking-[0.2em] uppercase border backdrop-blur-sm transition-all duration-300 min-w-[90px] text-center
            ${isOn 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300/70'}
        `}>
            {isOn ? activeText : inactiveText}
        </div>
    );

    const labelStyle = "text-blue-200/70 text-sm font-bold tracking-[0.25em] uppercase mb-3 block";

    return (
        <div className="relative z-50">
            {/* --- MAIN DASHBOARD PANEL --- */}
            <div className="w-full min-w-[340px] max-w-4xl mt-14 p-10 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl animate-fadeIn">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

                    {/* --- LEFT SECTION --- */}
                    <div className="flex flex-col justify-center gap-8 md:pr-12 pb-8 md:pb-0 border-b md:border-b-0 md:border-r border-white/10">
                        
                        {/* Shift Row */}
                        <div className="flex items-center justify-between group">
                            <div className="flex flex-col gap-1">
                                <span className={labelStyle}>Shift Selection</span>
                                <StatusBadge isOn={shiftOn} activeText="Online" inactiveText="Offline" />
                            </div>
                            <Toggle isOn={shiftOn} onToggle={{ type: 'shift' }} />
                        </div>

                        {/* Announcement Row */}
                        <div className="flex items-center justify-between group">
                            <div className="flex flex-col gap-1">
                                <span className={labelStyle}>Announcement</span>
                                <div className="flex items-center gap-3">
                                    <StatusBadge isOn={announcementOn} activeText="Live" inactiveText="Hidden" />
                                    {/* Edit Button */}
                                    <button 
                                        onClick={openEditor}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Draft
                                    </button>
                                </div>
                            </div>
                            <Toggle isOn={announcementOn} onToggle={{ type: 'announcement' }} />
                        </div>
                    </div>

                    {/* --- RIGHT SECTION --- */}
                    <div className="flex flex-col justify-center md:pl-12 pt-8 md:pt-0">
                        <label className={labelStyle}>Current Phase</label>
                        <div className="relative group w-full">
                            <select 
                                value={systemState} 
                                onChange={(e) => requestChange('state', e.target.value)}
                                className="w-full bg-black/30 border border-white/10 text-white text-lg rounded-xl px-6 py-5 focus:outline-none focus:border-blue-400/50 focus:bg-white/5 appearance-none cursor-pointer transition-all hover:bg-white/5 hover:border-white/20 font-light tracking-wide"
                            >
                                {stateOptions.map((opt) => (
                                    <option key={opt} value={opt} className="bg-slate-900 text-gray-300 py-2">
                                        {opt}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-blue-200/50 transition-transform duration-300 group-hover:translate-y-[-20%]">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONFIRMATION DIALOG (Global) --- */}
            {isConfirmOpen && (
                <div className="absolute inset-0 z-[70] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl transition-opacity duration-300" />
                    <div className="relative w-[90%] max-w-md bg-[#0f172a] border border-white/20 p-8 rounded-2xl shadow-2xl animate-popIn">
                        <h3 className="text-xl text-white font-bold mb-2">Are you sure?</h3>
                        <p className="text-blue-200/70 mb-8 text-sm leading-relaxed">
                            You are about to change the <span className="text-emerald-400 font-semibold uppercase">{pendingAction.type}</span> setting.
                        </p>
                        <div className="flex items-center gap-4 justify-end">
                            <button onClick={cancelChange} className="px-6 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors">Cancel</button>
                            <button onClick={applyChange} className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30 transition-all transform active:scale-95">Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- EDITOR MODAL (Draft & Preview) --- */}
            {isEditorOpen && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300" onClick={() => setIsEditorOpen(false)} />
                    
                    <div className="relative w-full max-w-2xl bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-popIn h-[600px]">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                            <h2 className="text-lg font-bold text-white tracking-wide">Announcement Manager</h2>
                            
                            {/* Preview Toggle */}
                            <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/10">
                                <button 
                                    onClick={() => setIsPreviewMode(false)}
                                    className={`px-3 py-1 text-xs font-bold uppercase rounded-md transition-all ${!isPreviewMode ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white'}`}
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => setIsPreviewMode(true)}
                                    className={`px-3 py-1 text-xs font-bold uppercase rounded-md transition-all ${isPreviewMode ? 'bg-emerald-600 text-white' : 'text-white/50 hover:text-white'}`}
                                >
                                    Preview
                                </button>
                            </div>
                        </div>

                        {/* Tabs (Pass vs Fail) */}
                        <div className="flex border-b border-white/5">
                            <button 
                                onClick={() => setEditorTab('pass')}
                                className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${editorTab === 'pass' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                Pass Message
                            </button>
                            <button 
                                onClick={() => setEditorTab('fail')}
                                className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${editorTab === 'fail' ? 'border-rose-500 text-rose-400 bg-rose-500/5' : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                Fail Message
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-8 bg-black/20 overflow-y-auto">
                            {!isPreviewMode ? (
                                // EDIT MODE
                                <div className="h-full flex flex-col">
                                    <label className="text-blue-200/50 text-xs font-bold uppercase mb-2">
                                        Drafting {editorTab} message
                                    </label>
                                    <textarea
                                        value={editorTab === 'pass' ? tempPass : tempFail}
                                        onChange={(e) => editorTab === 'pass' ? setTempPass(e.target.value) : setTempFail(e.target.value)}
                                        className="w-full h-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all resize-none text-base leading-relaxed"
                                        placeholder="Type your announcement here..."
                                    />
                                </div>
                            ) : (
                                // PREVIEW MODE (Simulating User View)
                                <div className="h-full flex items-center justify-center">
                                    <div className={`
                                        w-full max-w-md p-6 rounded-xl border relative overflow-hidden
                                        ${editorTab === 'pass' 
                                            ? 'bg-emerald-900/20 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                                            : 'bg-rose-900/20 border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.1)]'}
                                    `}>
                                        <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-50" />
                                        <h4 className={`text-lg font-bold mb-3 ${editorTab === 'pass' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {editorTab === 'pass' ? '🎉 Status: PASSED' : '⚠️ Status: NOT SELECTED'}
                                        </h4>
                                        <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                                            {editorTab === 'pass' ? tempPass : tempFail}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                            <button 
                                onClick={() => setIsEditorOpen(false)} 
                                className="px-6 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                Discard Changes
                            </button>
                            <button 
                                onClick={saveDrafts} 
                                className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30 transition-all"
                            >
                                Save Draft
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Animation Styles */}
            <style>{`
                @keyframes popIn {
                    0% { opacity: 0; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-popIn {
                    animation: popIn 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}