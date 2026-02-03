import React, { useState, useEffect } from 'react';
import Button from '@assets/buttons/ButtonRegular.png';

// Added 'clue' to the props list
export default function UnlockDialog({ isOpen, onClose, onSubmit, territoryName, isError, clue }) {
  const [code, setCode] = useState('');

  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
      setCode('');
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(code);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>

      <div
        onClick={handleBackdropClick}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-sm transition-opacity duration-300 ease-out cursor-pointer
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <div
          className={`relative w-full max-w-lg overflow-hidden transition-all duration-300 ease-out cursor-default
            ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            ${isError ? 'animate-shake' : ''}
          `}
        >

          <div className="relative z-10 p-6 flex flex-col items-center text-white">
            <h2
              className="text-5xl font-extrabold mt-8 mb-2" // Reduced bottom margin to fit clue
              style={{
                  fontFamily: 'Cormorant Infant',
                  textShadow: '0 2px 10px rgba(12, 54, 91, 0.5), 0 0 20px rgba(96, 165, 250, 0.2)' }}
            >
              Be careful...
            </h2>

            {/* --- CLUE DISPLAY ADDED HERE --- */}
            <p className="mb-8 text-lg text-cyan-200 font-serif italic text-center max-w-[85%] drop-shadow-md">
                "{clue}"
            </p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Type your answer"
                  className={`w-full bg-[#D8D8D8] py-3 px-5 text-left text-xl text-[#8D8D8D] placeholder-[#8D8D8D] rounded-lg
                    focus:outline-none transition-all duration-300
                    shadow-[inset_0_4px_8px_rgba(0,0,0,0.3)]
                    focus:shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)]
                    ${isError ? 'border-2 border-red-500/50' : 'border-transparent border-2'}
                  `}
                />

                {isError && (
                  <span className="text-red-700 font-bold text-xs text-center animate-pulse mt-1">
                    The atlantean isn't pleased....
                  </span>
                )}
              </div>

              <div className="flex gap-2 mt-2 justify-center">
                <button
                    type="button"
                    onClick={onClose}
                    className="mt-4 sm:mt-6 relative self-center transition-transform duration-300 hover:scale-110 active:scale-95"
                >
                    <img
                        src={Button}
                        alt="Back"
                        className="w-55 h-13 drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] cold-blue-filter-light"
                    />
                    <span
                        className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold tracking-[2px]"
                        style={{
                            color: '#e0f2fe',
                            textShadow: '0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)'
                        }}>
                        Back
                    </span>
                </button>
                <button
                    type="submit"
                    className="mt-4 sm:mt-6 relative self-center transition-transform duration-300 hover:scale-110 active:scale-95"
                >
                    <img
                        src={Button}
                        alt="Submit"
                        className="w-55 h-13 drop-shadow-[0_0_20px_rgba(96,165,250,0.8)] cold-blue-filter-light"
                    />
                    <span
                        className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold tracking-[2px]"
                        style={{
                            color: '#e0f2fe',
                            textShadow: '0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(96, 165, 250, 0.5)'
                        }}>
                        Submit
                    </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
