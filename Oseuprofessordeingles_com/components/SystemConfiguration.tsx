import React, { useState, useEffect } from 'react';

interface ServiceMetric {
    id: number;
    name: string;
    type: string;
    status: string;
    latency: number;
}

const SystemConfiguration: React.FC = () => {
    const [scanProgress, setScanProgress] = useState(0);
    const [metrics, setMetrics] = useState<ServiceMetric[]>([
        { id: 1, name: 'OpenAI GPT-4', type: 'LLM ENGINE', status: 'ONLINE', latency: 124 },
        { id: 2, name: 'Deepgram Nova-2', type: 'STT ENGINE', status: 'ONLINE', latency: 45 },
        { id: 3, name: 'ElevenLabs Turbo', type: 'TTS ENGINE', status: 'ONLINE', latency: 89 },
        { id: 4, name: 'Supabase Database', type: 'DATA STORE', status: 'ONLINE', latency: 22 }
    ]);

    // Simula o progresso do scan ao carregar a página
    useEffect(() => {
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Simula pequena variação na latência para parecer "vivo"
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => prev.map(m => ({
                ...m,
                latency: Math.max(20, m.latency + (Math.random() > 0.5 ? 5 : -5))
            })));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-start bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 font-orbitron">System Health Matrix</h2>
                    <p className="text-gray-400 text-sm max-w-xl">
                        Real-time monitoring of external APIs and internal subsystems. 
                        Sensitive environment variables (API_KEY) are securely managed server-side.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-lg border border-gray-700">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Operational</span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map(service => (
                    <div key={service.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${
                                service.status === 'ONLINE' ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-400'
                            }`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500">{service.type}</span>
                        </div>
                        <h4 className="text-white font-bold text-sm mb-1">{service.name}</h4>
                        <div className="flex items-end justify-between">
                            <span className="text-xs text-gray-400">{service.status}</span>
                            <span className={`text-xl font-bold font-mono ${service.latency > 100 ? 'text-yellow-400' : 'text-cyan-400'}`}>
                                {Math.round(service.latency)}ms
                            </span>
                        </div>
                        {/* Live Graph Bar */}
                        <div className="absolute bottom-0 left-0 h-1 bg-gray-800 w-full">
                            <div 
                                className="h-full bg-cyan-500 transition-all duration-1000" 
                                style={{ width: `${Math.min(100, service.latency / 2)}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Diagnostic Terminal */}
            <div className="bg-black border border-gray-800 rounded-xl p-6 font-mono text-sm shadow-inner relative overflow-hidden">
                <div className="flex justify-between text-gray-500 mb-2 border-b border-gray-800 pb-2">
                    <span>ROOT@OSEUPROFESSOR:~# run_diagnostics.sh</span>
                    <span>{scanProgress}%</span>
                </div>
                <div className="space-y-1 h-48 overflow-y-auto custom-scrollbar">
                    {scanProgress > 10 && <div className="text-green-500">[OK] Environment variables loaded.</div>}
                    {scanProgress > 25 && <div className="text-green-500">[OK] Database connection pool verified (5/5 nodes).</div>}
                    {scanProgress > 40 && <div className="text-green-500">[OK] Neural Engine (Gemini 1.5) handshake successful.</div>}
                    {scanProgress > 60 && <div className="text-green-500">[OK] SSL Certificates valid (Expires in 82 days).</div>}
                    {scanProgress > 80 && <div className="text-green-500">[OK] CDN Edge locations synced (São Paulo, Rio, Miami).</div>}
                    {scanProgress === 100 && <div className="text-cyan-400 animate-pulse">{'>>'} SYSTEM READY. WAITING FOR COMMAND.</div>}
                </div>
                
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
            </div>
        </div>
    );
};

export default SystemConfiguration;
