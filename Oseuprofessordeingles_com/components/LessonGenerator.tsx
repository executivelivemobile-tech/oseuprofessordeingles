
import React, { useState } from 'react';
import { generateLessonPlan } from '../services/geminiService';
import { LessonPlan } from '../types';
import { appendLessonToDoc } from '../services/googleDocsService';

interface LessonGeneratorProps {
    studentName: string;
    studentLevel: string;
    studentGoal: string;
    docId: string; // The Google Doc ID
    onClose: () => void;
    onSuccess: () => void;
}

export const LessonGenerator: React.FC<LessonGeneratorProps> = ({ 
    studentName, 
    studentLevel, 
    studentGoal, 
    docId, 
    onClose,
    onSuccess
}) => {
    const [step, setStep] = useState<'INPUT' | 'GENERATING' | 'REVIEW' | 'SYNCING' | 'SUCCESS'>('INPUT');
    const [topic, setTopic] = useState('');
    const [lesson, setLesson] = useState<LessonPlan | null>(null);
    const [finalDocUrl, setFinalDocUrl] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic) return;
        setStep('GENERATING');
        const generatedLesson = await generateLessonPlan(topic, studentLevel, studentGoal);
        if (generatedLesson) {
            setLesson(generatedLesson);
            setStep('REVIEW');
        } else {
            setStep('INPUT');
            alert('Generation failed. Please try again.');
        }
    };

    const handleSync = async () => {
        if (!lesson || !docId) return;
        setStep('SYNCING');
        const result = await appendLessonToDoc(docId, lesson);
        setFinalDocUrl(result.docUrl);
        setStep('SUCCESS');
    };

    const openGoogleDoc = () => {
        if (finalDocUrl) {
            window.open(finalDocUrl, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
                            <span className="font-orbitron font-bold text-white">AI</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Macley Lesson Architect</h3>
                            <p className="text-xs text-gray-400">Target: {studentName} ({studentLevel})</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    
                    {step === 'INPUT' && (
                        <div className="max-w-xl mx-auto space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">What are we teaching today?</h2>
                                <p className="text-gray-400">Macley will structure a complete lesson plan optimized for {studentGoal}.</p>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 font-bold uppercase mb-2">Lesson Topic / Concept</label>
                                <input 
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g. Present Perfect vs Past Simple, Tech Interview Negotiation, Airport Vocabulary"
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-4 text-white text-lg focus:border-cyan-500 focus:outline-none transition-colors"
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end">
                                <button 
                                    onClick={handleGenerate}
                                    disabled={!topic}
                                    className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    Generate Lesson
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'GENERATING' && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="relative w-24 h-24 mb-8">
                                <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-4 bg-cyan-500/10 rounded-full backdrop-blur-sm animate-pulse"></div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Macley is thinking...</h3>
                            <div className="text-cyan-400 font-mono text-sm space-y-1">
                                <p className="animate-fade-in">Analyzing student history...</p>
                                <p className="animate-fade-in animation-delay-500">Structuring pedagogical flow...</p>
                                <p className="animate-fade-in animation-delay-1000">Creating exercises...</p>
                                <p className="animate-fade-in animation-delay-1500">Performing quality check...</p>
                            </div>
                        </div>
                    )}

                    {step === 'REVIEW' && lesson && (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Document Preview */}
                            <div className="flex-1 bg-white text-black p-8 rounded-xl shadow-xl min-h-[600px] font-serif">
                                <div className="border-b-2 border-gray-200 pb-4 mb-6 flex justify-between items-center">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{lesson.topic}</h1>
                                        <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">{lesson.level}</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <section>
                                        <h2 className="text-lg font-bold text-cyan-700 border-b border-gray-100 mb-2">Objectives</h2>
                                        <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                            {lesson.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                                        </ul>
                                    </section>

                                    <section>
                                        <h2 className="text-lg font-bold text-cyan-700 border-b border-gray-100 mb-2">Theory</h2>
                                        <div className="prose prose-sm text-gray-700 whitespace-pre-wrap">{lesson.theory}</div>
                                    </section>

                                    <section>
                                        <h2 className="text-lg font-bold text-cyan-700 border-b border-gray-100 mb-2">Vocabulary</h2>
                                        <div className="grid gap-3">
                                            {lesson.vocabulary.map((vocab, i) => (
                                                <div key={i} className="bg-gray-50 p-3 rounded border-l-4 border-cyan-500">
                                                    <span className="font-bold text-gray-900">{vocab.term}:</span> <span className="text-gray-600">{vocab.definition}</span>
                                                    <p className="text-xs text-gray-500 italic mt-1">Ex: {vocab.example}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h2 className="text-lg font-bold text-cyan-700 border-b border-gray-100 mb-2">Exercises</h2>
                                        <div className="space-y-4">
                                            {lesson.exercises.map((ex, i) => (
                                                <div key={i}>
                                                    <p className="font-bold text-gray-800 mb-1">{i + 1}. {ex.question}</p>
                                                    <div className="border-b border-dotted border-gray-400 h-6 w-full"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </div>

                            {/* Sidebar Controls */}
                            <div className="w-full lg:w-80 space-y-6">
                                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <span className="text-green-400">●</span> Quality Check
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                <span>Clarity</span>
                                                <span className="text-white">{lesson.qualityScore.clarity}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-green-500 h-full" style={{ width: `${lesson.qualityScore.clarity}%` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                <span>Engagement</span>
                                                <span className="text-white">{lesson.qualityScore.engagement}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-purple-500 h-full" style={{ width: `${lesson.qualityScore.engagement}%` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                <span>Overall Score</span>
                                                <span className="text-white font-bold">{lesson.qualityScore.overall}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-cyan-500 h-full" style={{ width: `${lesson.qualityScore.overall}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    {lesson.qualityScore.overall > 85 && (
                                        <div className="mt-4 bg-green-900/20 border border-green-500/30 text-green-400 text-xs p-2 rounded text-center">
                                            ✓ Macley approves this lesson
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={handleSync}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2 group"
                                >
                                    <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    Sync to Google Docs
                                </button>
                                
                                <button 
                                    onClick={() => setStep('INPUT')}
                                    className="w-full bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white font-bold py-3 rounded-xl border border-gray-700 transition-all"
                                >
                                    Regenerate
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'SYNCING' && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center mb-6 animate-pulse shadow-[0_0_40px_rgba(37,99,235,0.5)]">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14.598 0.003L7.76 13.33h5.727l-1.92 10.667L20.25 8.953h-5.903l2.25-8.95H14.6z"/></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Syncing to Drive...</h3>
                            <p className="text-gray-400 text-sm">Appending content to student's digital notebook.</p>
                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="flex flex-col items-center justify-center h-full text-center animate-scale-in">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.5)]">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Lesson Deployed!</h3>
                            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                                The student has been notified and the Google Doc has been updated with the new lesson plan.
                            </p>
                            
                            <div className="flex flex-col gap-3 w-full max-w-xs">
                                <button 
                                    onClick={openGoogleDoc}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" /></svg>
                                    Open Class Notebook
                                </button>
                                
                                <button 
                                    onClick={onSuccess}
                                    className="bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white px-8 py-3 rounded-xl font-bold border border-gray-700 transition-all"
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
