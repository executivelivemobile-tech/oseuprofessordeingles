
import React, { useState } from 'react';
import { Dispute } from '../types';

interface AdminDisputeCenterProps {
    disputes: Dispute[];
    onResolve: (disputeId: string, resolution: any) => void;
}

export const AdminDisputeCenter: React.FC<AdminDisputeCenterProps> = ({ disputes, onResolve }) => {
    const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
    const activeDispute = disputes.find(d => d.id === selectedDisputeId);

    const openDisputes = disputes.filter(d => d.status === 'OPEN');
    const resolvedDisputes = disputes.filter(d => d.status !== 'OPEN');

    return (
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)] min-h-[600px]">
            <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                <div className="p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
                    <h3 className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-tighter">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        Disputas Ativas ({openDisputes.length})
                    </h3>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
                    {openDisputes.length === 0 && (
                        <div className="p-12 text-center text-gray-500 text-xs italic">
                            Sistema em conformidade. Zero disputas.
                        </div>
                    )}
                    {openDisputes.map(dispute => (
                        <div 
                            key={dispute.id}
                            onClick={() => setSelectedDisputeId(dispute.id)}
                            className={`p-4 rounded-xl cursor-pointer border transition-all ${
                                selectedDisputeId === dispute.id 
                                ? 'bg-red-900/20 border-red-500 shadow-lg' 
                                : 'bg-black/40 border-gray-800 hover:border-gray-600'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[9px] font-black text-red-400 bg-red-900/30 px-2 py-0.5 rounded border border-red-900/50 uppercase tracking-widest">{dispute.reason}</span>
                                <span className="text-[9px] text-gray-600 font-mono">{dispute.createdAt}</span>
                            </div>
                            <p className="text-white font-bold text-sm truncate">{dispute.reporterName}</p>
                            <p className="text-gray-500 text-[10px] truncate uppercase tracking-tighter">vs. {dispute.respondentName}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-2xl">
                {activeDispute ? (
                    <div className="animate-fade-in flex flex-col h-full">
                        <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-800">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2 font-orbitron tracking-tight">CASE_{activeDispute.id}</h2>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span>REF_BOOKING: <span className="font-mono text-cyan-400">{activeDispute.bookingId}</span></span>
                                    <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                                    <span>STATUS: <span className="text-yellow-500 font-bold uppercase">{activeDispute.status}</span></span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">VALOR RETIDO</span>
                                <span className="text-3xl font-bold text-white font-mono">R$ 150,00</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                            <div className="bg-black/40 rounded-2xl p-6 border border-gray-800 relative">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/></svg>
                                </div>
                                <h4 className="text-gray-400 font-black text-[10px] mb-4 uppercase tracking-[0.2em] border-b border-gray-800 pb-2">Depoimento do Solicitante</h4>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-cyan-900/30 border border-cyan-500/50 flex items-center justify-center font-bold text-cyan-400 shrink-0 shadow-lg">
                                        {activeDispute.reporterName.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-cyan-400 font-bold text-sm mb-2">{activeDispute.reporterName} (Aluno)</p>
                                        <div className="text-gray-300 text-sm leading-relaxed bg-gray-800/40 p-4 rounded-xl border border-gray-700/50 italic">
                                            "{activeDispute.description}"
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/40 rounded-2xl p-6 border border-red-900/20">
                                <h4 className="text-gray-400 font-black text-[10px] mb-4 uppercase tracking-[0.2em] border-b border-gray-800 pb-2">Logs de Evidência Técnica</h4>
                                <div className="space-y-2 font-mono text-[10px]">
                                    <div className="flex gap-4 text-gray-600 border-b border-gray-800/50 pb-1">
                                        <span>[14:00:00]</span> <span>ROOM_INITIALIZED: SESSION_ID_{activeDispute.bookingId}</span>
                                    </div>
                                    <div className="flex gap-4 text-green-500 border-b border-gray-800/50 pb-1">
                                        <span>[14:01:05]</span> <span>USER_JOINED: {activeDispute.reporterName.toUpperCase()}</span>
                                    </div>
                                    <div className="flex gap-4 text-red-500 border-b border-gray-800/50 pb-1">
                                        <span>[14:15:00]</span> <span>TIMEOUT: TEACHER_NOT_DETECTED (ID: {activeDispute.respondentName.toUpperCase()})</span>
                                    </div>
                                    <div className="flex gap-4 text-gray-600">
                                        <span>[14:20:12]</span> <span>USER_LEFT: SESSION_TERMINATED_BY_STUDENT</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-800">
                            <h4 className="text-red-500 font-black text-[10px] mb-4 uppercase tracking-[0.3em]">Protocolo de Adjudicação Direta</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button 
                                    onClick={() => onResolve(activeDispute.id, 'REFUND_STUDENT')}
                                    className="bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-900/30 transition-all flex flex-col items-center gap-1"
                                >
                                    <span>Reembolsar Aluno</span>
                                    <span className="text-[8px] opacity-70">Payout do Professor será ZERADO</span>
                                </button>
                                <button 
                                    onClick={() => onResolve(activeDispute.id, 'SPLIT')}
                                    className="bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center gap-1"
                                >
                                    <span>Split Amigável</span>
                                    <span className="text-[8px] opacity-70">Cobre taxas da plataforma</span>
                                </button>
                                <button 
                                    onClick={() => onResolve(activeDispute.id, 'DISMISSED')}
                                    className="bg-green-700 hover:bg-green-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-900/30 transition-all flex flex-col items-center gap-1"
                                >
                                    <span>Pagar Professor</span>
                                    <span className="text-[8px] opacity-70">Ignorar queixa do aluno</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-600 space-y-6">
                        <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-700">
                            <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-center">Aguardando Seleção de Caso para Análise Master</p>
                    </div>
                )}
            </div>
        </div>
    );
};
