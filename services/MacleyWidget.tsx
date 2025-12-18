
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToMacley, sendToolResponse, startChat } from '../services/geminiService';
import { ChatMessage, AIAction } from '../types';

interface MacleyWidgetProps {
    onAction?: (action: AIAction) => void;
    language?: 'EN' | 'PT';
    isActiveStudent?: boolean;
}

export const MacleyWidget: React.FC<MacleyWidgetProps> = ({ onAction, language = 'EN', isActiveStudent = false }) => {
  const isPT = language === 'PT';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicialização Silenciosa
  useEffect(() => {
    if (isOpen && messages.length === 0) {
        setMessages([{ 
            id: '0', 
            role: 'model', 
            text: isPT ? 'Estabelecendo link neural... Como posso ajudar hoje?' : 'Establishing neural link... How can I help today?', 
            timestamp: new Date() 
        }]);
        startChat(); // Pré-aquece a sessão
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendText = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setErrorStatus(null);

    try {
        const response = await sendMessageToMacley(userMsg.text);
        
        if (response.functionCalls && response.functionCalls.length > 0 && onAction) {
            const functionResponses = [];
            for (const call of response.functionCalls) {
                if (call.name === 'navigate_to') {
                    onAction({ type: 'NAVIGATE', payload: call.args.view });
                }
                functionResponses.push({ id: call.id, name: call.name, response: { result: 'ok' } });
            }
            await sendToolResponse(functionResponses);
        }

        setMessages(prev => [...prev, { 
            id: (Date.now() + 1).toString(), 
            role: 'model', 
            text: response.text || (isPT ? "Entendido. Realizando comando..." : "Understood. Executing command..."), 
            timestamp: new Date() 
        }]);
    } catch (err) {
        setErrorStatus(isPT ? "Falha no Link" : "Neural Link Failure");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className={`mb-4 w-80 md:w-96 h-[500px] bg-black/95 border ${isActiveStudent ? 'border-purple-500/50 shadow-purple-500/30' : 'border-cyan-500/50 shadow-cyan-500/30'} backdrop-blur-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up`}>
          {/* Header */}
          <div className={`p-4 border-b flex justify-between items-center ${isActiveStudent ? 'bg-purple-900/40' : 'bg-cyan-900/40'}`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-ping' : 'bg-green-400'} shadow-[0_0_8px_rgba(74,222,128,0.5)]`}></div>
              <h3 className={`font-orbitron font-bold tracking-widest text-sm ${isActiveStudent ? 'text-purple-400' : 'text-cyan-400'}`}>MACLEY {isActiveStudent ? 'MENTOR' : 'CORE'}</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                      ? (isActiveStudent ? 'bg-purple-600/20 border border-purple-500/30 text-purple-50 rounded-tr-none' : 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-50 rounded-tr-none') 
                      : 'bg-gray-800/40 border border-gray-700/50 text-gray-200 rounded-tl-none backdrop-blur-md'
                  }`}>
                  {msg.text}
                  </div>
              </div>
              ))}
              {isLoading && (
                  <div className="flex justify-start">
                      <div className="bg-gray-800/40 border border-gray-700/50 p-3 rounded-2xl rounded-tl-none flex gap-1">
                          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-75"></div>
                          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-150"></div>
                      </div>
                  </div>
              )}
              {errorStatus && (
                  <div className="text-center">
                      <span className="text-[10px] bg-red-900/40 text-red-400 border border-red-500/30 px-2 py-1 rounded uppercase font-bold tracking-widest">{errorStatus}</span>
                  </div>
              )}
              <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5 bg-black/40">
              <div className="flex gap-2">
              <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                  placeholder={isPT ? "Comando neural..." : "Neural command..."}
                  className="flex-1 bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
              />
              <button 
                  onClick={handleSendText} 
                  disabled={isLoading || !input.trim()}
                  className={`p-2.5 rounded-xl transition-all ${
                      isActiveStudent 
                      ? 'bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-900/20' 
                      : 'bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-900/20'
                  } disabled:opacity-30`}
              >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
              </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all transform hover:scale-110 active:scale-95 group ${
              isActiveStudent 
              ? 'bg-purple-600 shadow-[0_0_30px_rgba(168,85,247,0.4)] border border-purple-400/30' 
              : 'bg-cyan-600 shadow-[0_0_30px_rgba(34,211,238,0.4)] border border-cyan-400/30'
          }`}
        >
          {/* Animated rings */}
          <div className={`absolute inset-0 rounded-full border-2 animate-ping opacity-20 ${isActiveStudent ? 'border-purple-300' : 'border-cyan-300'}`}></div>
          <div className="relative z-10">
            <svg className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
          </div>
        </button>
      )}
    </div>
  );
};
