
import React, { useState, useEffect } from 'react';

export const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('ospi_cookie_consent');
        if (!consent) {
            // Delay slightly for dramatic entrance
            setTimeout(() => setIsVisible(true), 1000);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('ospi_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-[200] p-4 animate-slide-up">
            <div className="max-w-7xl mx-auto bg-black/90 backdrop-blur-xl border border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(34,211,238,0.2)] flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                        <span className="bg-cyan-500 w-2 h-2 rounded-full animate-pulse"></span>
                        Neural Network Privacy Protocols
                    </h3>
                    <p className="text-sm text-gray-400">
                        We use cookies to enable the <span className="text-cyan-400 font-bold">Macley AI Assistant</span>, process secure payments, and analyze learning patterns. 
                        In compliance with LGPD (Brazil), we require your consent to process behavioral data.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="text-gray-500 hover:text-white text-sm font-bold px-4 py-2"
                    >
                        Decline (Essential Only)
                    </button>
                    <button 
                        onClick={handleAccept}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-cyan-900/40 transition-all transform hover:scale-105"
                    >
                        Initialize System
                    </button>
                </div>
            </div>
        </div>
    );
};
