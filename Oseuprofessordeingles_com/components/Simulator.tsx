
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_SCENARIOS } from '../constants';
import { Scenario, ChatMessage } from '../types';
import { sendMessageToMacley } from '../services/geminiService';

interface SimulatorProps {
    onBack: () => void;
}

export const Simulator: React.FC<SimulatorProps> = ({ onBack }) => {
    const [mode, setMode] = useState<'SELECTION' | 'ACTIVE' | 'FEEDBACK'>('SELECTION');
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSelect = (scenario: Scenario) => {
        setSelectedScenario(scenario);
        setMode('ACTIVE');
        // Initial AI Message
        setMessages([{
            id: 'init',
            role: 'model',
            text: scenario.openingLine,
            timestamp: new Date()
        }]);
    };

    const handleSend = async () => {
        if (!input.trim() || !selectedScenario) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsProcessing(true);

        // Construct a specific prompt for roleplay
        const prompt = `
            [ROLEPLAY MODE]
            Scenario: ${selectedScenario.title}
            Your Role: ${selectedScenario.aiRole}
            User Role: ${selectedScenario.userRole}
            Objective: ${selectedScenario.objective}
            
            Current conversation history:
            ${messages.map(m => `${m.role === 'user' ? 'User' : 'You'}: ${m.text}`).join('\n')}
            User: ${userMsg.text}

            Instructions:
            1. Stay in character as the ${selectedScenario.aiRole}.
            2. Keep responses realistic (short if it's a barista, professional if it's an interviewer).
            3. Do NOT break character to explain things.
            4. If the user makes a significant grammar mistake, gently rephrase it in your reply as a clarification question, or just ignore it if it's understandable.
            5. Respond naturally to the user.
        `;

        try {
            const response = await sendMessageToMacley(prompt);
            const aiText = response.text || "...";
            
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: aiText,
                timestamp: new Date()
            }]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-200 pt-20 pb-10 flex flex-col">
            
            {/* Header */}
            <div className="px-6 pb-6 border-b border-gray-900 flex justify-between items-center">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Exit Simulation
                </button>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="font-orbitron font-bold text-cyan-400 tracking-widest">MACLEY SIMULATOR v2.0</span>
                </div>
            </div>

            {mode === 'SELECTION' && (
                <div className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full animate-fade-in">
                    <h1 className="text-4xl font-bold text-white mb-4 text-center">Select Your Mission</h1>
                    <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                        Engage in hyper-realistic roleplay scenarios powered by AI. Practice high-stakes conversations before they happen.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {MOCK_SCENARIOS.map(scenario => (
                            <div 
                                key={scenario.id}
                                onClick={() => handleSelect(scenario)}
                                className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:border-cyan-500/50 transition-all hover:scale-105"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img src={scenario.imageUrl} alt={scenario.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded text-xs font-bold text-white uppercase border border-gray-700">
                                        {scenario.category}
                                    </div>
                                    <div className="absolute bottom-4 left-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                                            scenario.difficulty === 'Easy' ? 'bg-green-900/50 border-green-500 text-green-400' :
                                            scenario.difficulty === 'Medium' ? 'bg-yellow-900/50 border-yellow-500 text-yellow-400' :
                                            'bg-red-900/50 border-red-500 text-red-400'
                                        }`}>
                                            {scenario.difficulty}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">{scenario.title}</h3>
                                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{scenario.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-cyan-400">
                                        <span>Role: {scenario.userRole}</span>
                                        <span>vs</span>
                                        <span>{scenario.aiRole}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {mode === 'ACTIVE' && selectedScenario && (
                <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full overflow-hidden animate-slide-up">
                    
                    {/* Left Panel: Mission Intel */}
                    <div className="w-full md:w-80 bg-gray-900/50 border-r border-gray-800 p-6 flex flex-col">
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Mission Intel</h3>
                            <div className="bg-black/40 rounded-xl p-4 border border-gray-800 mb-4">
                                <p className="text-cyan-400 font-bold text-sm mb-1">Objective</p>
                                <p className="text-gray-300 text-sm">{selectedScenario.objective}</p>
                            </div>
                            <div className="bg-black/40 rounded-xl p-4 border border-gray-800">
                                <p className="text-purple-400 font-bold text-sm mb-1">Counterpart</p>
                                <p className="text-white font-bold">{selectedScenario.aiRole}</p>
                                <p className="text-gray-500 text-xs">AI Persona Active</p>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button 
                                onClick={() => setMode('SELECTION')}
                                className="w-full py-3 border border-red-500/30 text-red-400 hover:bg-red-900/20 rounded-xl text-sm font-bold transition-all"
                            >
                                Abort Mission
                            </button>
                        </div>
                    </div>

                    {/* Right Panel: Chat Interface */}
                    <div className="flex-1 flex flex-col bg-black relative">
                        {/* Chat Feed */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {messages.map((msg) => {
                                const isUser = msg.role === 'user';
                                return (
                                    <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl p-4 ${
                                            isUser 
                                            ? 'bg-cyan-900/20 border border-cyan-500/30 text-cyan-50 rounded-br-none' 
                                            : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-bl-none'
                                        }`}>
                                            {!isUser && (
                                                <p className="text-xs font-bold text-gray-500 mb-1 uppercase">{selectedScenario.aiRole}</p>
                                            )}
                                            <p className="leading-relaxed">{msg.text}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {isProcessing && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-gray-900 border-t border-gray-800">
                            <div className="flex gap-4">
                                <input 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={`Reply as ${selectedScenario.userRole}...`}
                                    className="flex-1 bg-black border border-gray-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-mono"
                                    autoFocus
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={isProcessing || !input.trim()}
                                    className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-6 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)]"
                                >
                                    SEND
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
