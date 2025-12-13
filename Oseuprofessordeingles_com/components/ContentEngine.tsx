
import React, { useState } from 'react';
import { analyzeStudentCorpus } from '../services/googleDocsService';
import { researchTrends, generateDraftPost } from '../services/geminiService';
import { StudentPersona, ContentTrend, DraftPost } from '../types';

export const ContentEngine: React.FC = () => {
    const [step, setStep] = useState<'IDLE' | 'SCANNING' | 'RESEARCHING' | 'GENERATING' | 'DONE'>('IDLE');
    const [personas, setPersonas] = useState<StudentPersona[]>([]);
    const [trends, setTrends] = useState<ContentTrend[]>([]);
    const [drafts, setDrafts] = useState<DraftPost[]>([]);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const runEngine = async () => {
        setStep('SCANNING');
        setLogs([]);
        setPersonas([]);
        setTrends([]);
        setDrafts([]);

        // 1. Analyze Corpus
        addLog("Initiating Neural Scan of Student Documents...");
        const detectedPersonas = await analyzeStudentCorpus();
        setPersonas(detectedPersonas);
        addLog(`Identified ${detectedPersonas.length} distinct student personas.`);
        
        // 2. Research Trends
        setStep('RESEARCHING');
        addLog("Connecting to Global News Stream (Google Search Grounding)...");
        const detectedTrends = await researchTrends(detectedPersonas);
        setTrends(detectedTrends);
        addLog(`Detected ${detectedTrends.length} relevant trending topics.`);

        // 3. Generate Drafts
        setStep('GENERATING');
        addLog("Synthesizing content...");
        
        const newDrafts: DraftPost[] = [];
        
        // Match trends to personas efficiently
        for (let i = 0; i < Math.min(3, detectedTrends.length); i++) {
            const trend = detectedTrends[i];
            const targetPersona = personas[i % personas.length]; // Rotate personas
            
            addLog(`Drafting: "${trend.topic}" for ${targetPersona.role}...`);
            const draft = await generateDraftPost(trend, targetPersona);
            if (draft) {
                newDrafts.push(draft);
            }
        }
        
        setDrafts(newDrafts);
        setStep('DONE');
        addLog("Content Cycle Complete. Drafts ready for review.");
    };

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.8)]"></span>
                        Neural Content Engine
                    </h1>
                    <p className="text-gray-400 mt-1">Autonomous content generation based on student context & real-time trends.</p>
                </div>
                <button 
                    onClick={runEngine}
                    disabled={step !== 'IDLE' && step !== 'DONE'}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {step === 'IDLE' || step === 'DONE' ? (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Run Auto-Pilot
                        </>
                    ) : (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                        </>
                    )}
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Left Column: Live Terminal */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Status Monitor */}
                    <div className="bg-black border border-gray-800 rounded-2xl p-6 font-mono text-sm h-64 overflow-y-auto shadow-inner custom-scrollbar">
                        <div className="text-green-500 mb-2 font-bold">SYSTEM STATUS: {step}</div>
                        {logs.map((log, i) => (
                            <div key={i} className="text-gray-400 mb-1 border-l-2 border-gray-800 pl-2">{log}</div>
                        ))}
                        {step === 'SCANNING' && <div className="text-cyan-500 animate-pulse">Reading docs...</div>}
                    </div>

                    {/* Personas Detected */}
                    {personas.length > 0 && (
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-fade-in">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                Persona Clusters
                            </h3>
                            <div className="space-y-3">
                                {personas.map((p, i) => (
                                    <div key={i} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                                        <div className="flex justify-between items-start">
                                            <span className="text-white font-bold text-sm">{p.role}</span>
                                            <span className="bg-purple-900/30 text-purple-400 text-xs px-2 py-0.5 rounded">{p.count} Students</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Interests: {p.interests.slice(0, 2).join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Trends Detected */}
                    {trends.length > 0 && (
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-fade-in">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                Hot Topics (Google Grounding)
                            </h3>
                            <div className="space-y-3">
                                {trends.map((t, i) => (
                                    <div key={i} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                                        <p className="text-white font-bold text-sm line-clamp-1">{t.topic}</p>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-xs text-gray-500">{t.source}</span>
                                            <span className="text-[10px] text-cyan-400">High Relevance</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Generated Queue */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 h-full min-h-[600px]">
                        <h2 className="text-xl font-bold text-white mb-6">Generated Content Queue</h2>
                        
                        {drafts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-96 text-gray-500 border border-gray-800 border-dashed rounded-xl">
                                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <p>No drafts generated yet. Start the engine.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {drafts.map((draft, idx) => (
                                    <div key={idx} className="bg-black/40 border border-gray-700 rounded-xl overflow-hidden flex flex-col md:flex-row animate-slide-up" style={{ animationDelay: `${idx * 200}ms` }}>
                                        <div className="w-full md:w-48 h-32 md:h-auto relative">
                                            <img src={draft.imageUrl} className="w-full h-full object-cover" alt="Draft" />
                                            <div className="absolute top-2 left-2 bg-yellow-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                                                {draft.status}
                                            </div>
                                        </div>
                                        <div className="p-5 flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">{draft.category}</span>
                                                    <h3 className="text-lg font-bold text-white mt-1">{draft.title}</h3>
                                                </div>
                                                <span className="text-gray-500 text-xs bg-gray-800 px-2 py-1 rounded">Target: {draft.targetAudience}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{draft.excerpt}</p>
                                            
                                            <div className="bg-gray-800/50 p-2 rounded text-xs text-gray-500 mb-4 border border-gray-700/50">
                                                <span className="font-bold text-gray-400">AI Logic: </span>
                                                {draft.generatedReason}
                                            </div>

                                            <div className="flex gap-2 justify-end">
                                                <button className="text-xs text-gray-400 hover:text-white px-3 py-2">Edit</button>
                                                <button className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg">Approve & Publish</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
