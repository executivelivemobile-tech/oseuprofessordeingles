
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToMacley, sendToolResponse } from '../services/geminiService';
import { ChatMessage, AIAction } from '../types';

interface MacleyWidgetProps {
    onAction?: (action: AIAction) => void;
    language?: 'EN' | 'PT';
}

// Helper for browser compatibility
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const MacleyWidget: React.FC<MacleyWidgetProps> = ({ onAction, language = 'EN' }) => {
  const isPT = language === 'PT';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
        id: '0', 
        role: 'model', 
        text: isPT ? 'Olá! Eu sou o Macley. Posso te ajudar a encontrar professores, cursos ou navegar na plataforma.' : 'Hello! I am Macley. I can help you find teachers, courses, or navigate the platform.', 
        timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Voice State
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update initial greeting when language changes if chat is empty/default
  useEffect(() => {
      if (messages.length === 1 && messages[0].id === '0') {
          setMessages([{
              id: '0', 
              role: 'model', 
              text: isPT ? 'Olá! Eu sou o Macley. Posso te ajudar a encontrar professores, cursos ou navegar na plataforma.' : 'Hello! I am Macley. I can help you find teachers, courses, or navigate the platform.', 
              timestamp: new Date() 
          }]);
      }
  }, [language]);

  // Initialize Speech Recognition
  useEffect(() => {
      if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = isPT ? 'pt-BR' : 'en-US'; 

          recognition.onstart = () => setIsListening(true);
          recognition.onend = () => setIsListening(false);
          
          recognition.onresult = (event: any) => {
              const transcript = event.results[0][0].transcript;
              if (transcript) {
                  handleSend(transcript);
              }
          };

          recognitionRef.current = recognition;
      }
  }, [isPT]); // Re-init if language changes

  const speakText = (text: string) => {
      if (!window.speechSynthesis) return;
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isPT ? 'pt-BR' : 'en-US';
      utterance.rate = 1.1; // Slightly faster for modern feel
      
      // Try to find a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = isPT 
        ? voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt')) 
        : voices.find(v => v.name.includes('Google US English') || v.lang === 'en-US');
      
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
  };

  const toggleVoiceMode = () => {
      setIsVoiceMode(!isVoiceMode);
      if (isVoiceMode) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
      }
  };

  const handleMicClick = () => {
      if (isListening) {
          recognitionRef.current?.stop();
      } else {
          recognitionRef.current?.start();
      }
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await sendMessageToMacley(userMsg.text);
    
    let finalText = response.text || (isPT ? "Processei isso." : "I processed that.");

    // Handle Function Calls (Tools)
    if (response.functionCalls && response.functionCalls.length > 0 && onAction) {
        const functionResponses = [];
        
        for (const call of response.functionCalls) {
            console.log("Macley Tool Call:", call.name, call.args);
            
            let result = { status: 'ok' }; 
            
            if (call.name === 'navigate_to') {
                const view = call.args.view as string;
                onAction({ type: 'NAVIGATE', payload: view });
                result = { status: `Navigated to ${view}` };
            } 
            else if (call.name === 'search_teachers') {
                onAction({ type: 'FILTER_TEACHERS', payload: call.args });
                result = { status: `Filtered teachers by ${JSON.stringify(call.args)}` };
            }
            else if (call.name === 'search_courses') {
                onAction({ type: 'FILTER_COURSES', payload: call.args });
                result = { status: `Filtered courses by ${JSON.stringify(call.args)}` };
            }

            functionResponses.push({
                id: call.id,
                name: call.name,
                response: { result }
            });
        }

        // Send tool output back to Gemini
        const toolResponse = await sendToolResponse(functionResponses);
        if (toolResponse?.text) {
            finalText = toolResponse.text;
        }
        
        const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: finalText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);

    } else {
        // Standard Text Response
        const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: finalText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
    }

    setIsLoading(false);

    if (isVoiceMode) {
        speakText(finalText);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className={`mb-4 w-80 md:w-96 transition-all duration-500 ease-in-out bg-black/90 border border-cyan-500/50 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(0,217,249,0.2)] flex flex-col overflow-hidden animate-slide-up ${isVoiceMode ? 'h-[400px]' : 'h-[500px]'}`}>
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-b border-cyan-500/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-bounce' : 'bg-green-400 animate-pulse'}`}></div>
              <h3 className="font-orbitron text-cyan-400 font-bold tracking-wider">MACLEY AI</h3>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={toggleVoiceMode}
                    className={`text-xs uppercase font-bold px-2 py-1 rounded border transition-colors ${isVoiceMode ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-transparent text-cyan-500 border-cyan-500 hover:bg-cyan-900/30'}`}
                >
                    {isVoiceMode ? (isPT ? 'Voz ON' : 'Voice ON') : (isPT ? 'Voz OFF' : 'Voice OFF')}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-cyan-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
          </div>

          {/* Voice Visualization / Messages */}
          {isVoiceMode ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                  {/* Holographic Circle */}
                  <div className={`relative w-40 h-40 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isListening ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)] scale-110' : isSpeaking ? 'border-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.6)] animate-pulse' : 'border-gray-700'}`}>
                      
                      {/* Inner Core */}
                      <div className={`w-20 h-20 rounded-full transition-all duration-200 ${isListening ? 'bg-red-500/20' : isSpeaking ? 'bg-cyan-400/20' : 'bg-gray-800'}`}></div>
                      
                      {/* Rotating Rings */}
                      <div className={`absolute inset-0 border-t-2 border-transparent rounded-full animate-spin ${isListening ? 'border-t-red-500' : 'border-t-cyan-500'}`} style={{ animationDuration: '2s' }}></div>
                      <div className={`absolute inset-2 border-r-2 border-transparent rounded-full animate-spin ${isListening ? 'border-r-red-500' : 'border-r-cyan-500'}`} style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>

                      {/* Icon */}
                      <div className="absolute z-10">
                          {isListening ? (
                              <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                          ) : (
                              <svg className="w-10 h-10 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.5l6-4.5-6-4.5v9z"/></svg>
                          )}
                      </div>
                  </div>

                  <div className="mt-8 text-center h-16">
                      <p className="text-cyan-400 font-mono text-sm mb-1">
                          {isListening ? (isPT ? "Ouvindo..." : "Listening...") : isSpeaking ? (isPT ? "Falando..." : "Speaking...") : (isPT ? "Pronto" : "Ready")}
                      </p>
                      <p className="text-white font-bold text-lg animate-fade-in truncate max-w-[280px]">
                          {isListening ? "..." : messages[messages.length - 1]?.text}
                      </p>
                  </div>

                  <button 
                    onClick={handleMicClick}
                    className={`mt-4 p-4 rounded-full transition-all shadow-lg ${isListening ? 'bg-red-600 hover:bg-red-500 animate-pulse' : 'bg-cyan-600 hover:bg-cyan-500'}`}
                  >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  </button>
              </div>
          ) : (
              // Standard Text Mode
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        msg.role === 'user' 
                            ? 'bg-cyan-600/20 border border-cyan-500/50 text-cyan-50' 
                            : 'bg-gray-800/50 border border-gray-600/50 text-gray-200'
                        }`}>
                        {msg.text}
                        </div>
                    </div>
                    ))}
                    {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800/50 p-3 rounded-lg text-xs text-cyan-400 animate-pulse flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                        {isPT ? 'Processando...' : 'Processing...'}
                        </div>
                    </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-cyan-500/30 bg-black/40">
                    <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isPT ? "Digite um comando..." : "Type a command..."}
                        className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                    <button 
                        onClick={() => handleSend()}
                        disabled={isLoading}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                    </div>
                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar">
                        <button onClick={() => handleSend(isPT ? "Encontre professores de Business baratos" : "Find Business English teachers under R$100")} className="text-xs border border-cyan-900 bg-cyan-900/20 text-cyan-400 px-2 py-1 rounded whitespace-nowrap hover:bg-cyan-900/40 transition-colors">
                            {isPT ? 'Professores Baratos' : 'Cheap Teachers'}
                        </button>
                        <button onClick={() => handleSend(isPT ? "Mostre cursos de tecnologia" : "Show me courses about Technology")} className="text-xs border border-cyan-900 bg-cyan-900/20 text-cyan-400 px-2 py-1 rounded whitespace-nowrap hover:bg-cyan-900/40 transition-colors">
                            {isPT ? 'Cursos Tech' : 'Tech Courses'}
                        </button>
                    </div>
                </div>
              </>
          )}
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(0,217,249,0.5)] transition-all transform hover:scale-110"
        >
          <div className="absolute inset-0 rounded-full border-2 border-cyan-300 opacity-0 group-hover:opacity-100 animate-ping"></div>
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      )}
    </div>
  );
};
