
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToMacley, sendToolResponse } from '../services/geminiService';
import { liveService } from '../services/liveService';
import { ChatMessage, AIAction } from '../types';

interface MacleyWidgetProps {
    onAction?: (action: AIAction) => void;
    language?: 'EN' | 'PT';
}

export const MacleyWidget: React.FC<MacleyWidgetProps> = ({ onAction, language = 'EN' }) => {
  const isPT = language === 'PT';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
        id: '0', 
        role: 'model', 
        text: isPT ? 'Olá! Eu sou o Macley. Como posso ajudar?' : 'Hello! I am Macley. How can I help?', 
        timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Live Voice State
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'IDLE' | 'CONNECTING' | 'ACTIVE'>('IDLE');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
      return () => {
          liveService.disconnect();
          cancelAnimationFrame(animationFrameRef.current);
      };
  }, []);

  const toggleLiveMode = async () => {
      if (isLiveMode) {
          liveService.disconnect();
          setConnectionStatus('IDLE');
          setIsLiveMode(false);
          cancelAnimationFrame(animationFrameRef.current);
      } else {
          setIsLiveMode(true);
          setConnectionStatus('CONNECTING');
          try {
              await liveService.connect(
                  (audioData) => {
                      setConnectionStatus('ACTIVE');
                  },
                  (toolName, args) => {
                      if (onAction && toolName === 'navigate_to') {
                          onAction({ type: 'NAVIGATE', payload: args.view });
                      }
                  }
              );
              startVisualizer();
          } catch (e) {
              console.error("Connection Failed:", e);
              setIsLiveMode(false);
              setConnectionStatus('IDLE');
              alert(isPT ? "Falha na conexão de voz. Verifique seu microfone." : "Voice connection failed. Check your microphone.");
          }
      }
  };

  const startVisualizer = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const draw = () => {
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);
          const time = Date.now() / 200;
          ctx.beginPath();
          ctx.moveTo(0, h / 2);
          for (let x = 0; x < w; x++) {
              const y = (h / 2) + Math.sin(x * 0.08 + time) * 15 * Math.sin(time * 0.3); 
              ctx.lineTo(x, y);
          }
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 2;
          ctx.stroke();
          animationFrameRef.current = requestAnimationFrame(draw);
      };
      draw();
  };

  const handleSendText = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await sendMessageToMacley(userMsg.text);
    if (response.functionCalls && response.functionCalls.length > 0 && onAction) {
        const functionResponses = [];
        for (const call of response.functionCalls) {
            if (call.name === 'navigate_to') onAction({ type: 'NAVIGATE', payload: call.args.view });
            if (call.name === 'search_teachers') onAction({ type: 'FILTER_TEACHERS', payload: call.args });
            if (call.name === 'search_courses') onAction({ type: 'FILTER_COURSES', payload: call.args });
            functionResponses.push({ id: call.id, name: call.name, response: { result: 'ok' } });
        }
        await sendToolResponse(functionResponses);
    }

    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: response.text || "...", timestamp: new Date() }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className={`mb-4 w-80 md:w-96 transition-all duration-500 bg-black/90 border border-cyan-500/50 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up ${isLiveMode ? 'h-[400px]' : 'h-[500px]'}`}>
          
          <div className="p-4 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-b border-cyan-500/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connectionStatus === 'ACTIVE' ? 'bg-red-500 animate-pulse' : connectionStatus === 'CONNECTING' ? 'bg-yellow-500 animate-bounce' : 'bg-green-400'}`}></div>
              <h3 className="font-orbitron text-cyan-400 font-bold tracking-wider">MACLEY {isLiveMode ? 'LIVE' : 'AI'}</h3>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={toggleLiveMode}
                    className={`text-[10px] uppercase font-bold px-2 py-1 rounded border transition-all ${isLiveMode ? 'bg-red-600 text-white border-red-500' : 'bg-transparent text-cyan-500 border-cyan-500'}`}
                >
                    {isLiveMode ? '🔴 STOP VOICE' : '🎤 VOICE MODE'}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
          </div>

          {isLiveMode ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gray-900">
                  <div className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 ${connectionStatus === 'ACTIVE' ? 'shadow-[0_0_60px_rgba(34,211,238,0.3)]' : ''}`}>
                      <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full animate-[spin_15s_linear_infinite]"></div>
                      <canvas ref={canvasRef} width={120} height={120} className="rounded-full opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <svg className={`w-10 h-10 text-white transition-opacity ${connectionStatus === 'ACTIVE' ? 'opacity-100' : 'opacity-40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                      </div>
                  </div>
                  <p className="mt-8 text-cyan-400 font-mono text-xs uppercase tracking-widest animate-pulse">
                      {connectionStatus === 'ACTIVE' ? (isPT ? "Conectado" : "Linked") : (isPT ? "Iniciando Link..." : "Syncing Link...")}
                  </p>
              </div>
          ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-cyan-600/20 border border-cyan-500/50 text-cyan-50' : 'bg-gray-800/50 border border-gray-600/50 text-gray-200'}`}>
                        {msg.text}
                        </div>
                    </div>
                    ))}
                    {isLoading && <div className="text-xs text-cyan-500 animate-pulse ml-2">Neural processing...</div>}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-cyan-500/30 bg-black/40">
                    <div className="flex gap-2">
                    <input 
                        type="text" value={input} onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                        placeholder={isPT ? "Fale com Macley..." : "Talk to Macley..."}
                        className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all"
                    />
                    <button onClick={handleSendText} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                    </div>
                </div>
              </>
          )}
        </div>
      )}

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
