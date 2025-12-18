
import React, { useState } from 'react';
import { analyzeStudentCorpus } from '../services/googleDocsService';
import { researchTrends, generateDraftPost } from '../services/geminiService';
import { StudentPersona, ContentTrend, DraftPost } from '../types';
import { dataService } from '../services/dataService';

export const ContentEngine: React.FC = () => {
    const [step, setStep] = useState<'IDLE' | 'SCANNING' | 'RESEARCHING' | 'GENERATING' | 'DONE'>('IDLE');
    const [personas, setPersonas] = useState<StudentPersona[]>([]);
    const [trends, setTrends] = useState<ContentTrend[]>([]);
    const [drafts, setDrafts] = useState<DraftPost[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [isPublishing, setIsPublishing] = useState<string | null>(null);

    const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const runEngine = async () => {
        setStep('SCANNING');
        setLogs([]);
        setPersonas([]);
        setTrends([]);
        setDrafts([]);

        addLog("Iniciando varredura neural em documentos de alunos...");
        const detectedPersonas = await analyzeStudentCorpus();
        setPersonas(detectedPersonas);
        addLog(`Identificados ${detectedPersonas.length} clusters de interesse.`);
        
        setStep('RESEARCHING');
        addLog("Conectando ao Grounding do Google Search...");
        const detectedTrends = await researchTrends(detectedPersonas);
        setTrends(detectedTrends);
        addLog(`Detectadas ${detectedTrends.length} tendências relevantes hoje.`);

        setStep('GENERATING');
        addLog("Sintetizando conteúdo pedagógico-comercial...");
        
        const newDrafts: DraftPost[] = [];
        for (let i = 0; i < Math.min(2, detectedTrends.length); i++) {
            const trend = detectedTrends[i];
            const targetPersona = personas[i % personas.length];
            addLog(`Redigindo: "${trend.topic}" para ${targetPersona.role}...`);
            const draft = await generateDraftPost(trend, targetPersona);
            if (draft) newDrafts.push(draft);
        }
        
        setDrafts(newDrafts);
        setStep('DONE');
        addLog("Ciclo completo. Aguardando revisão humana para publicação.");
    };

    const handleApproveAndPublish = async (draft: DraftPost) => {
        setIsPublishing(draft.id);
        try {
            await dataService.publishGeneratedPost({
                ...draft,
                status: 'PUBLISHED'
            });
            setDrafts(prev => prev.filter(d => d.id !== draft.id));
            addLog(`Post "${draft.title}" publicado com sucesso no Feed global.`);
        } catch (e) {
            addLog(`Erro ao publicar post.`);
        } finally {
            setIsPublishing(null);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8 bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.8)]"></span>
                        Neural Content Engine v2.1
                    </h1>
                    <p className="text-gray-400 mt-1">Gerador autônomo de tráfego orgânico baseado em contexto real de alunos.</p>
                </div>
                <button 
                    onClick={runEngine}
                    disabled={step !== 'IDLE' && step !== 'DONE'}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {step === 'IDLE' || step === 'DONE' ? (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Executar Auto-Pilot
                        </>
                    ) : (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sincronizando Tendências...
                        </>
                    )}
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-black border border-gray-800 rounded-2xl p-6 font-mono text-sm h-80 overflow-y-auto shadow-inner">
                        <div className="text-green-500 mb-2 font-bold uppercase tracking-tighter">>>> MACLEY_CORE_LOG</div>
                        {logs.map((log, i) => (
                            <div key={i} className="text-gray-400 mb-1 border-l-2 border-gray-800 pl-2 leading-tight py-1">{log}</div>
                        ))}
                        {(step === 'SCANNING' || step === 'RESEARCHING' || step === 'GENERATING') && <div className="text-cyan-500 animate-pulse mt-2">Processando...</div>}
                    </div>

                    {personas.length > 0 && (
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-slide-up">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2 uppercase text-xs tracking-widest text-gray-500">
                                Segmentação Detectada
                            </h3>
                            <div className="space-y-3">
                                {personas.map((p, i) => (
                                    <div key={i} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                                        <div className="flex justify-between items-start">
                                            <span className="text-white font-bold text-xs">{p.role}</span>
                                            <span className="bg-cyan-900/30 text-cyan-400 text-[10px] px-2 py-0.5 rounded border border-cyan-800">{p.count} Alunos</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {p.interests.slice(0,2).map(int => <span key={int} className="text-[9px] text-gray-500">#{int}</span>)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 h-full min-h-[500px]">
                        <h2 className="text-xl font-bold text-white mb-6 font-orbitron">Fila de Rascunhos Estratégicos</h2>
                        
                        {drafts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-80 text-gray-500 border border-gray-800 border-dashed rounded-xl bg-black/20">
                                <p className="font-mono text-xs">Waiting for initialization...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {drafts.map((draft, idx) => (
                                    <div key={idx} className="bg-gray-800/40 border border-gray-700 rounded-2xl overflow-hidden flex flex-col md:flex-row transition-all hover:border-cyan-500/30">
                                        <div className="w-full md:w-48 h-32 md:h-auto relative shrink-0">
                                            <img src={draft.imageUrl} className="w-full h-full object-cover" alt="Draft" />
                                            <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg uppercase">
                                                AI Draft
                                            </div>
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-white leading-tight">{draft.title}</h3>
                                                <span className="text-[10px] text-gray-500 font-mono">SEO: {draft.seoKeywords.slice(0,2).join(', ')}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 italic">"{draft.excerpt}"</p>
                                            
                                            <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-center">
                                                <div className="flex gap-2">
                                                    <span className="text-[10px] bg-gray-900 px-2 py-1 rounded text-gray-500">Público: {draft.targetAudience}</span>
                                                    <span className="text-[10px] bg-gray-900 px-2 py-1 rounded text-gray-500">{draft.readTime}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="text-xs text-gray-500 hover:text-white px-3 py-2 transition-colors">Editar Conteúdo</button>
                                                    <button 
                                                        onClick={() => handleApproveAndPublish(draft)}
                                                        disabled={isPublishing === draft.id}
                                                        className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-lg shadow-green-900/20 transition-all flex items-center gap-2"
                                                    >
                                                        {isPublishing === draft.id ? 'Publicando...' : 'Aprovar e Publicar'}
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                    </button>
                                                </div>
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
