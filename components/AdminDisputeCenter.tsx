
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
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
            
            {/* List Column */}
            <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        Active Cases ({openDisputes.length})
                    </h3>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                    {openDisputes.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No active disputes. System nominal.
                        </div>
                    )}
                    {openDisputes.map(dispute => (
                        <div 
                            key={dispute.id}
                            onClick={() => setSelectedDisputeId(dispute.id)}
                            className={`p-4 rounded-xl cursor-pointer border transition-all ${
                                selectedDisputeId === dispute.id 
                                ? 'bg-red-900/20 border-red-500' 
                                : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-red-400 bg-red-900/30 px-2 py-0.5 rounded">{dispute.reason}</span>
                                <span className="text-[10px] text-gray-500">{dispute.createdAt}</span>
                            </div>
                            <p className="text-white font-bold text-sm truncate">{dispute.reporterName}</p>
                            <p className="text-gray-400 text-xs truncate">vs. {dispute.respondentName}</p>
                        </div>
                    ))}

                    {resolvedDisputes.length > 0 && (
                        <>
                            <div className="p-2 pt-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Resolved History</div>
                            {resolvedDisputes.map(dispute => (
                                <div 
                                    key={dispute.id}
                                    className="p-4 rounded-xl border border-gray-800 bg-black/20 opacity-60"
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-400 text-xs font-bold">{dispute.reason}</span>
                                        <span className="text-green-500 text-[10px] uppercase border border-green-900 px-1 rounded">{dispute.resolution}</span>
                                    </div>
                                    <p className="text-gray-500 text-xs mt-1">ID: {dispute.id}</p>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Detail Column */}
            <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col relative overflow-hidden">
                {activeDispute ? (
                    <>
                        <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-800">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Case #{activeDispute.id}</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span>Booking ID: <span className="font-mono text-cyan-400">{activeDispute.bookingId}</span></span>
                                    <span>•</span>
                                    <span>Status: <span className="text-yellow-500 font-bold">{activeDispute.status}</span></span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs text-gray-500 uppercase font-bold">Total Value</span>
                                <span className="text-xl font-bold text-white">R$ 150,00</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-6">
                            {/* Evidence */}
                            <div className="bg-black/40 rounded-xl p-4 border border-gray-700">
                                <h4 className="text-gray-300 font-bold text-sm mb-3 uppercase tracking-wider border-b border-gray-800 pb-2">Reporter Statement</h4>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-white shrink-0">
                                        {activeDispute.reporterName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-cyan-400 font-bold text-sm mb-1">{activeDispute.reporterName} (Student)</p>
                                        <p className="text-gray-300 text-sm leading-relaxed bg-gray-800/50 p-3 rounded-lg rounded-tl-none">
                                            {activeDispute.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/40 rounded-xl p-4 border border-gray-700">
                                <h4 className="text-gray-300 font-bold text-sm mb-3 uppercase tracking-wider border-b border-gray-800 pb-2">System Logs</h4>
                                <div className="space-y-2 font-mono text-xs">
                                    <div className="flex gap-2 text-gray-400">
                                        <span>[14:00]</span> <span>Room created</span>
                                    </div>
                                    <div className="flex gap-2 text-green-400">
                                        <span>[14:01]</span> <span>Student {activeDispute.reporterName} joined</span>
                                    </div>
                                    <div className="flex gap-2 text-red-400">
                                        <span>[14:15]</span> <span>Teacher {activeDispute.respondentName} NOT detected</span>
                                    </div>
                                    <div className="flex gap-2 text-gray-400">
                                        <span>[14:20]</span> <span>Student left room</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <h4 className="text-gray-300 font-bold text-sm mb-4 uppercase tracking-wider">Adjudication Protocol</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <button 
                                    onClick={() => onResolve(activeDispute.id, 'REFUND_STUDENT')}
                                    className="bg-green-900/30 hover:bg-green-900/50 border border-green-600 text-green-400 py-3 rounded-xl font-bold text-sm transition-all"
                                >
                                    Refund Student (100%)
                                </button>
                                <button 
                                    onClick={() => onResolve(activeDispute.id, 'SPLIT')}
                                    className="bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-600 text-yellow-400 py-3 rounded-xl font-bold text-sm transition-all"
                                >
                                    Split (50/50)
                                </button>
                                <button 
                                    onClick={() => onResolve(activeDispute.id, 'DISMISSED')}
                                    className="bg-red-900/30 hover:bg-red-900/50 border border-red-600 text-red-400 py-3 rounded-xl font-bold text-sm transition-all"
                                >
                                    Dismiss Dispute
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                        </div>
                        <p>Select a case to view evidence and take action.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
