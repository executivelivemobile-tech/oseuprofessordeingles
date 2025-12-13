
import React, { useState, useEffect, useRef } from 'react';

interface TechCheckProps {
    onJoin: () => void;
    onCancel: () => void;
}

export const TechCheck: React.FC<TechCheckProps> = ({ onJoin, onCancel }) => {
    const [step, setStep] = useState<number>(0); // 0: Init, 1: Devices, 2: Network, 3: Ready
    const [micLevel, setMicLevel] = useState<number>(0);
    const [hasCamera, setHasCamera] = useState<boolean>(false);
    const [networkSpeed, setNetworkSpeed] = useState<string>('Checking...');
    
    const videoRef = useRef<HTMLVideoElement>(null);
    
    // Simulate Microphone Visualization
    useEffect(() => {
        const interval = setInterval(() => {
            // Random fluctuate based on "noise"
            setMicLevel(Math.random() * 100);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Initialize Devices (Simulated for Demo)
    useEffect(() => {
        const initDevices = async () => {
            await new Promise(r => setTimeout(r, 1000));
            setHasCamera(true);
            setStep(1);
            
            // Network Check
            setTimeout(() => {
                setNetworkSpeed('125 Mbps (Stable)');
                setStep(2);
            }, 1500);

            // Ready
            setTimeout(() => {
                setStep(3);
            }, 3000);
        };
        initDevices();
    }, []);

    return (
        <div className="fixed inset-0 z-[60] bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-gray-900 to-black">
                    <h2 className="text-xl font-bold text-white font-orbitron tracking-wide">SYSTEM DIAGNOSTIC</h2>
                    <div className="flex gap-2">
                        <span className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-green-500' : 'bg-gray-700'}`}></span>
                        <span className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-green-500' : 'bg-gray-700'}`}></span>
                        <span className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-green-500' : 'bg-gray-700'}`}></span>
                    </div>
                </div>

                <div className="p-8 flex flex-col md:flex-row gap-8">
                    {/* Camera Preview */}
                    <div className="w-full md:w-1/2">
                        <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden relative border-2 border-gray-700 shadow-inner group">
                            {hasCamera ? (
                                <>
                                    {/* Mock Camera Feed */}
                                    <img 
                                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop" 
                                        alt="Camera Preview" 
                                        className="w-full h-full object-cover opacity-80" 
                                    />
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-green-400 font-mono border border-green-500/30">
                                        HD 1080p
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full flex-col text-gray-500">
                                    <div className="w-8 h-8 border-2 border-gray-600 border-t-cyan-500 rounded-full animate-spin mb-2"></div>
                                    <span className="text-xs">Initializing Camera...</span>
                                </div>
                            )}
                            
                            {/* Face Tracking Rect (Visual Flair) */}
                            {step >= 1 && (
                                <div className="absolute top-1/4 left-1/3 w-1/3 h-1/2 border border-cyan-500/50 rounded-lg">
                                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></div>
                                    <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400"></div>
                                    <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-400"></div>
                                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400"></div>
                                </div>
                            )}
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-2">Face Tracking Active</p>
                    </div>

                    {/* Stats */}
                    <div className="w-full md:w-1/2 space-y-6">
                        {/* Mic Check */}
                        <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1 font-bold uppercase">
                                <span>Audio Input</span>
                                <span>{step >= 1 ? 'Optimal' : 'Waiting...'}</span>
                            </div>
                            <div className="flex gap-1 h-6 items-end">
                                {[...Array(20)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`flex-1 rounded-sm transition-all duration-75 ${
                                            (micLevel / 5) > i ? 'bg-green-500' : 'bg-gray-800'
                                        }`}
                                        style={{ height: `${(micLevel / 5) > i ? Math.random() * 80 + 20 : 20}%` }}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Network Check */}
                        <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1 font-bold uppercase">
                                <span>Network Latency</span>
                                <span className={step >= 2 ? 'text-green-400' : 'text-gray-500'}>{networkSpeed}</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${step >= 2 ? 'bg-cyan-500 w-full' : 'bg-yellow-500 w-1/3 animate-pulse'}`} 
                                ></div>
                            </div>
                        </div>

                        {/* Checklist */}
                        <div className="space-y-2 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                            <div className={`flex items-center gap-3 text-sm ${step >= 1 ? 'text-green-400' : 'text-gray-500'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Camera Permission Granted
                            </div>
                            <div className={`flex items-center gap-3 text-sm ${step >= 1 ? 'text-green-400' : 'text-gray-500'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Microphone Permission Granted
                            </div>
                            <div className={`flex items-center gap-3 text-sm ${step >= 2 ? 'text-green-400' : 'text-gray-500'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                WebRTC Connection Stable
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-between items-center">
                    <button onClick={onCancel} className="text-gray-500 hover:text-white text-sm font-bold">
                        Cancel Session
                    </button>
                    <button 
                        onClick={onJoin}
                        disabled={step < 3}
                        className="bg-green-600 hover:bg-green-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
                    >
                        {step < 3 ? 'Checking System...' : 'JOIN CLASSROOM'}
                        {step >= 3 && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                    </button>
                </div>
            </div>
        </div>
    );
};
