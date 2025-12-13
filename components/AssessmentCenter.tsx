
import React, { useState, useEffect } from 'react';
import { AssessmentQuestion } from '../types';

interface AssessmentCenterProps {
    onComplete: (level: string, score: number) => void;
    onCancel: () => void;
}

const QUESTIONS: AssessmentQuestion[] = [
    {
        id: 'q1',
        question: "Select the correct form: 'I _____ to the store yesterday.'",
        options: ["go", "gone", "went", "going"],
        correctIndex: 2,
        levelWeight: 1
    },
    {
        id: 'q2',
        question: "Which sentence is correct?",
        options: ["She don't like pizza.", "She doesn't like pizza.", "She not likes pizza.", "She no like pizza."],
        correctIndex: 1,
        levelWeight: 1
    },
    {
        id: 'q3',
        question: "Choose the synonym for 'Happy':",
        options: ["Sad", "Angry", "Joyful", "Tired"],
        correctIndex: 2,
        levelWeight: 1
    },
    {
        id: 'q4',
        question: "Complete: 'If I _____ you, I would accept the offer.'",
        options: ["was", "were", "am", "be"],
        correctIndex: 1,
        levelWeight: 2
    },
    {
        id: 'q5',
        question: "'I have been working here _____ five years.'",
        options: ["since", "for", "during", "while"],
        correctIndex: 1,
        levelWeight: 2
    },
    {
        id: 'q6',
        question: "The meeting was called _____ due to the storm.",
        options: ["out", "away", "off", "back"],
        correctIndex: 2,
        levelWeight: 3
    },
    {
        id: 'q7',
        question: "Select the best transition: 'He studied hard; _____, he failed the test.'",
        options: ["therefore", "however", "additionally", "consequently"],
        correctIndex: 1,
        levelWeight: 3
    },
    {
        id: 'q8',
        question: "Which word implies a subtle difference in meaning?",
        options: ["Nuance", "Obvious", "Contrast", "Similar"],
        correctIndex: 0,
        levelWeight: 3
    }
];

export const AssessmentCenter: React.FC<AssessmentCenterProps> = ({ onComplete, onCancel }) => {
    const [step, setStep] = useState<'INTRO' | 'TEST' | 'ANALYZING' | 'RESULT'>('INTRO');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(30);

    // Timer logic for TEST phase
    useEffect(() => {
        if (step === 'TEST') {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleAnswer(-1); // Time out, wrong answer
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [step, currentQIndex]);

    const handleAnswer = (optionIndex: number) => {
        const newAnswers = [...answers, optionIndex];
        setAnswers(newAnswers);
        
        if (currentQIndex < QUESTIONS.length - 1) {
            setCurrentQIndex(prev => prev + 1);
            setTimeLeft(30); // Reset timer
        } else {
            setStep('ANALYZING');
            setTimeout(() => {
                setStep('RESULT');
            }, 3000);
        }
    };

    const calculateResult = () => {
        let score = 0;
        let weightedScore = 0;
        let totalWeight = 0;

        answers.forEach((ans, idx) => {
            const q = QUESTIONS[idx];
            totalWeight += q.levelWeight;
            if (ans === q.correctIndex) {
                score++;
                weightedScore += q.levelWeight;
            }
        });

        const percentage = (weightedScore / totalWeight) * 100;
        
        let level = 'Beginner';
        let cefr = 'A1';

        if (percentage > 90) { level = 'Fluent'; cefr = 'C1/C2'; }
        else if (percentage > 70) { level = 'Advanced'; cefr = 'B2'; }
        else if (percentage > 40) { level = 'Intermediate'; cefr = 'B1'; }
        else { level = 'Beginner'; cefr = 'A2'; }

        return { level, cefr, percentage };
    };

    const result = step === 'RESULT' ? calculateResult() : null;

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
            
            {/* Background Animations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            </div>

            <div className="relative z-10 w-full max-w-2xl">
                
                {step === 'INTRO' && (
                    <div className="text-center animate-fade-in">
                        <div className="w-24 h-24 mx-auto mb-8 relative">
                            <div className="absolute inset-0 border-4 border-cyan-500 rounded-full animate-ping opacity-20"></div>
                            <div className="w-full h-full bg-gray-900 border-2 border-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                                <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">SKILL CALIBRATION</h1>
                        <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
                            Macley AI needs to analyze your syntax and vocabulary to personalize your learning path. This takes about 2 minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={() => setStep('TEST')} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-xl font-bold tracking-widest shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all transform hover:scale-105">
                                START ANALYSIS
                            </button>
                            <button onClick={onCancel} className="text-gray-500 hover:text-white px-8 py-4 font-bold">
                                SKIP
                            </button>
                        </div>
                    </div>
                )}

                {step === 'TEST' && (
                    <div className="bg-gray-900/80 border border-gray-700 backdrop-blur-xl rounded-2xl p-8 shadow-2xl animate-slide-up">
                        {/* Progress Header */}
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-gray-500 font-mono text-xs">Q{currentQIndex + 1}/{QUESTIONS.length}</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                                    {timeLeft}s
                                </span>
                                <div className="w-32 h-1 bg-gray-800 rounded-full">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${timeLeft < 10 ? 'bg-red-500' : 'bg-cyan-500'}`} 
                                        style={{ width: `${(timeLeft / 30) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">
                            {QUESTIONS[currentQIndex].question}
                        </h2>

                        <div className="grid gap-3">
                            {QUESTIONS[currentQIndex].options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className="text-left p-4 rounded-xl bg-black/40 border border-gray-700 hover:border-cyan-500 hover:bg-cyan-900/10 transition-all group"
                                >
                                    <span className="inline-block w-6 text-gray-500 group-hover:text-cyan-400 font-mono text-sm">{String.fromCharCode(65 + idx)}.</span>
                                    <span className="text-gray-200 group-hover:text-white font-medium">{opt}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'ANALYZING' && (
                    <div className="text-center animate-pulse">
                        <div className="w-16 h-16 border-4 border-t-cyan-500 border-r-cyan-500 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <h2 className="text-2xl font-bold text-white mb-2">Analyzing Responses...</h2>
                        <p className="text-gray-500 font-mono text-sm">Cross-referencing with CEFR standards</p>
                    </div>
                )}

                {step === 'RESULT' && result && (
                    <div className="text-center animate-scale-in">
                        <div className="bg-gray-900/80 border border-cyan-500/30 backdrop-blur-xl rounded-3xl p-10 shadow-[0_0_50px_rgba(8,145,178,0.2)]">
                            <p className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-4">Calibration Complete</p>
                            
                            <div className="mb-8">
                                <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-orbitron">
                                    {result.cefr}
                                </span>
                                <p className="text-2xl text-white font-bold mt-2">{result.level}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto">
                                <div className="bg-black/40 p-3 rounded-lg border border-gray-700">
                                    <p className="text-xs text-gray-500">Accuracy</p>
                                    <p className="text-lg font-bold text-green-400">{result.percentage.toFixed(0)}%</p>
                                </div>
                                <div className="bg-black/40 p-3 rounded-lg border border-gray-700">
                                    <p className="text-xs text-gray-500">Rec. Course</p>
                                    <p className="text-lg font-bold text-purple-400">{result.level} 101</p>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm mb-8">
                                Macley has updated your profile. We will now prioritize {result.level} content for you.
                            </p>

                            <button 
                                onClick={() => onComplete(result.level, result.percentage)}
                                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl font-bold shadow-lg transition-all"
                            >
                                CONTINUE TO DASHBOARD
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
