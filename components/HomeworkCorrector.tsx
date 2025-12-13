
import React, { useState } from 'react';
import { correctStudentWork } from '../services/geminiService';
import { HomeworkCorrection, VocabularyCard } from '../types';

interface HomeworkCorrectorProps {
    onBack: () => void;
    onSaveToVault?: (word: Partial<VocabularyCard>) => void; // New Prop
}

export const HomeworkCorrector: React.FC<HomeworkCorrectorProps> = ({ onBack, onSaveToVault }) => {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'ANALYZING' | 'RESULTS'>('IDLE');
    const [result, setResult] = useState<HomeworkCorrection | null>(null);

    const handleAnalyze = async () => {
        if (!input.trim()) return;
        setStatus('ANALYZING');
        const correction = await correctStudentWork(input);
        if (correction) {
            setResult(correction);
            setStatus('RESULTS');
        } else {
            setStatus('IDLE');
            alert("Connection interrupted. Macley couldn't process your request.");
        }
    };

    const handleSaveWord = (message: string) => {
        // Simple heuristic to extract a potential keyword from the feedback message
        // In a real app, the API should return structured vocabulary suggestions
        const words = message.split(' ');
        const potentialTerm = words.length > 0 ? words[0].replace(/[^a-zA-Z]/g, '') : "Keyword";
        
        if (onSaveToVault) {
            onSaveToVault({
                term: potentialTerm,
                definition: message,
                example: "Context from homework correction.",
                origin: 'HOMEWORK'
            });
            alert(`Saved "${potentialTerm}" to Vault!`);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-20 flex flex-col h-[calc(100vh-20px)]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
                        NEURAL EDITOR
                    </h1>
                    <p className="text-gray-400 text-sm">AI-Powered Grammar & Style Correction</p>
                </div>
                <button onClick={onBack} className="text-gray-500 hover:text-white flex items-center gap-2 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Exit
                </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                
                {/* Input Column */}
                <div className={`flex-1 flex flex-col transition-all duration-500 ${status === 'RESULTS' ? 'lg:w-1/2' : 'w-full'}`}>
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl relative">
                        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                            <span className="text-xs font-mono text-gray-400 uppercase">Input Terminal</span>
                            <span className="text-xs font-mono text-gray-500">{input.length} chars</span>
                        </div>
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your essay, email, or exercise here..."
                            className="flex-1 bg-transparent p-6 text-gray-200 resize-none focus:outline-none font-mono leading-relaxed"
                            disabled={status === 'ANALYZING'}
                        />
                        <div className="p-4 bg-gray-800/50 border-t border-gray-700">
                            <button 
                                onClick={handleAnalyze}
                                disabled={!input.trim() || status === 'ANALYZING'}
                                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2"
                            >
                                {status === 'ANALYZING' ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                        Run Analysis
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Output Column */}
                {status === 'RESULTS' && result && (
                    <div className="flex-1 flex flex-col lg:w-1/2 animate-slide-left overflow-y-auto">
                        
                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-green-500/10 blur-xl"></div>
                                <div className="relative z-10">
                                    <p className="text-gray-500 text-xs uppercase font-bold">Score</p>
                                    <p className={`text-3xl font-bold ${result.score >= 80 ? 'text-green-400' : result.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {result.score}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                                <p className="text-gray-500 text-xs uppercase font-bold">CEFR Level</p>
                                <p className="text-3xl font-bold text-cyan-400">{result.cefrEstimate}</p>
                            </div>
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                                <p className="text-gray-500 text-xs uppercase font-bold">Tone</p>
                                <p className="text-xl font-bold text-white mt-1">{result.tone}</p>
                            </div>
                        </div>

                        {/* Corrected Text */}
                        <div className="bg-gray-900 border border-purple-500/30 rounded-2xl p-6 mb-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative">
                            <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">
                                Improved Version
                            </div>
                            <p className="text-white font-serif text-lg leading-relaxed whitespace-pre-wrap">
                                {result.corrected}
                            </p>
                            <button 
                                onClick={() => navigator.clipboard.writeText(result.corrected)}
                                className="mt-4 text-xs text-purple-400 hover:text-white flex items-center gap-1 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                Copy Text
                            </button>
                        </div>

                        {/* Feedback List */}
                        <div className="flex-1 bg-black/40 border border-gray-800 rounded-2xl p-6 overflow-y-auto">
                            <h3 className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-widest">Macley's Notes</h3>
                            <div className="space-y-4">
                                {result.feedback.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-3 bg-gray-900/50 rounded-lg border border-gray-800 group hover:border-gray-600 transition-colors">
                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                                            item.type === 'GRAMMAR' ? 'bg-red-500' : 
                                            item.type === 'VOCAB' ? 'bg-yellow-500' : 'bg-blue-500'
                                        }`}></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border mb-1 inline-block ${
                                                    item.type === 'GRAMMAR' ? 'text-red-400 border-red-900 bg-red-900/20' : 
                                                    item.type === 'VOCAB' ? 'text-yellow-400 border-yellow-900 bg-yellow-900/20' : 
                                                    'text-blue-400 border-blue-900 bg-blue-900/20'
                                                }`}>
                                                    {item.type}
                                                </span>
                                                {/* Save Button */}
                                                <button 
                                                    onClick={() => handleSaveWord(item.message)}
                                                    className="text-gray-500 hover:text-green-400 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                                    Save to Vault
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-300">{item.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};
