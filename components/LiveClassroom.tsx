
import React, { useState, useEffect } from 'react';
import { Booking, Teacher } from '../types';
import { TechCheck } from './TechCheck';
import { Whiteboard } from './Whiteboard';

interface LiveClassroomProps {
  booking: Booking;
  teacher?: Teacher;
  onEndCall: () => void;
}

export const LiveClassroom: React.FC<LiveClassroomProps> = ({ booking, teacher, onEndCall }) => {
  const [sessionState, setSessionState] = useState<'CHECK' | 'LIVE'>('CHECK');
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'CHAT' | 'NOTES' | 'AI_HINTS'>('AI_HINTS');
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [timer, setTimer] = useState(3000); // 50 minutes in seconds
  
  // External Link Handling (For immediate commercial use without complex WebRTC server)
  // In a real app, this link would come from the booking.meetingUrl or teacher.preferences
  const EXTERNAL_MEETING_LINK = `https://meet.google.com/new`; 

  useEffect(() => {
    let interval: any;
    if (sessionState === 'LIVE') {
        interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionState]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleLaunchExternal = () => {
      window.open(EXTERNAL_MEETING_LINK, '_blank');
  };

  if (sessionState === 'CHECK') {
      return <TechCheck onJoin={() => setSessionState('LIVE')} onCancel={onEndCall} />;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* HUD Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-30 flex justify-between items-start pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 px-4 py-2 rounded-lg flex items-center gap-3 pointer-events-auto">
           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
           <span className="text-red-500 text-xs font-bold tracking-widest uppercase">REC</span>
           <div className="h-4 w-px bg-gray-600"></div>
           <span className="text-cyan-400 font-mono text-sm">{formatTime(timer)}</span>
        </div>
        
        <div className="bg-black/40 backdrop-blur-md border border-gray-700 px-4 py-2 rounded-lg text-xs text-gray-400 font-mono flex items-center gap-2 pointer-events-auto">
            <span>MODE: HYBRID</span>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
          
          {/* Main Video Stage */}
          <div className="flex-1 relative bg-gray-900 flex items-center justify-center overflow-hidden group">
              
              {/* Fallback / External Link UI */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                  <div className="bg-black/50 p-8 rounded-2xl border border-gray-700 backdrop-blur text-center max-w-md">
                      <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Ready to Connect?</h3>
                      <p className="text-gray-400 mb-6">
                          For the best video quality, the teacher has requested to use an external secure line.
                      </p>
                      <button 
                        onClick={handleLaunchExternal}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all flex items-center justify-center gap-2 mb-4"
                      >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          Launch Meeting Room
                      </button>
                      <p className="text-xs text-gray-600">Don't close this tab. The timer is running here.</p>
                  </div>
              </div>

              {/* Collaborative Whiteboard Overlay (Can be toggled on top) */}
              {showWhiteboard && <Whiteboard />}

              {/* Teacher Name Label */}
              <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur border border-gray-600 px-4 py-2 rounded-lg z-20">
                  <p className="text-white font-bold text-sm">{teacher?.name || booking.teacherName}</p>
                  <p className="text-cyan-400 text-xs uppercase tracking-wider">Instructor</p>
              </div>

              {/* Student Self-View (PIP) */}
              <div className="absolute top-6 right-6 w-48 h-32 bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 shadow-2xl z-40 drag cursor-move hover:border-cyan-500 transition-colors">
                  {camOn ? (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-xs text-gray-400">Your Camera</span>
                      </div>
                  ) : (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      </div>
                  )}
                  <div className="absolute bottom-2 right-2 flex gap-1">
                      {!micOn && <div className="bg-red-500 p-1 rounded-full"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg></div>}
                  </div>
              </div>
          </div>

          {/* Sidebar Tools */}
          <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col z-30">
              <div className="flex border-b border-gray-800">
                  <button onClick={() => setActiveTab('AI_HINTS')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'AI_HINTS' ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-900/10' : 'text-gray-500 hover:text-white'}`}>AI Hints</button>
                  <button onClick={() => setActiveTab('NOTES')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'NOTES' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-900/10' : 'text-gray-500 hover:text-white'}`}>Notes</button>
                  <button onClick={() => setActiveTab('CHAT')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'CHAT' ? 'text-green-400 border-b-2 border-green-400 bg-green-900/10' : 'text-gray-500 hover:text-white'}`}>Chat</button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                  {activeTab === 'AI_HINTS' && (
                      <div className="space-y-4">
                          <div className="bg-purple-900/20 border border-purple-500/30 p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                  <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse"></div>
                                  <span className="text-purple-400 text-xs font-bold">MACLEY LISTENING...</span>
                              </div>
                              <p className="text-sm text-gray-300">Suggested vocabulary for "Environment":</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="text-xs bg-purple-900/50 text-purple-200 px-2 py-1 rounded">Sustainability</span>
                                  <span className="text-xs bg-purple-900/50 text-purple-200 px-2 py-1 rounded">Carbon Footprint</span>
                              </div>
                          </div>
                          <div className="bg-gray-800/50 p-3 rounded-lg">
                              <p className="text-xs text-gray-400 mb-1">Correction:</p>
                              <p className="text-sm text-red-300 line-through">I have been there yesterday.</p>
                              <p className="text-sm text-green-400">I was there yesterday.</p>
                          </div>
                      </div>
                  )}

                  {activeTab === 'NOTES' && (
                      <textarea 
                        className="w-full h-full bg-transparent text-gray-300 text-sm focus:outline-none resize-none" 
                        placeholder="Type your class notes here..."
                        defaultValue="Homework: Watch the TED talk on minimalism."
                      />
                  )}

                  {activeTab === 'CHAT' && (
                      <div className="flex flex-col h-full justify-between">
                          <div className="space-y-3">
                              <div className="flex gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gray-700 flex-shrink-0"></div>
                                  <div className="bg-gray-800 p-2 rounded-lg rounded-tl-none text-xs text-gray-300">
                                      Can you hear me clearly?
                                  </div>
                              </div>
                              <div className="flex gap-2 flex-row-reverse">
                                  <div className="w-6 h-6 rounded-full bg-cyan-700 flex-shrink-0"></div>
                                  <div className="bg-cyan-900/50 p-2 rounded-lg rounded-tr-none text-xs text-white">
                                      Yes, loud and clear!
                                  </div>
                              </div>
                          </div>
                          <div className="mt-4">
                              <input className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="Type a message..." />
                          </div>
                      </div>
                  )}
              </div>
          </div>
      </div>

      {/* Control Bar */}
      <div className="bg-gray-900 border-t border-gray-800 p-4 flex justify-center items-center gap-4 relative z-50">
          <button 
            onClick={() => setMicOn(!micOn)}
            className={`p-4 rounded-full transition-all ${micOn ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-red-500 hover:bg-red-400 text-white'}`}
          >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={micOn ? "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" : "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"} stroke="currentColor" /></svg>
          </button>
          
          <button 
            onClick={() => setCamOn(!camOn)}
            className={`p-4 rounded-full transition-all ${camOn ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-red-500 hover:bg-red-400 text-white'}`}
          >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={camOn ? "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} /></svg>
          </button>

          {/* Whiteboard Toggle */}
          <button 
            onClick={() => setShowWhiteboard(!showWhiteboard)}
            className={`p-4 rounded-full transition-all ${showWhiteboard ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
            title="Toggle Whiteboard"
          >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>

          <button 
            onClick={onEndCall}
            className="px-8 py-4 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all"
          >
              End Lesson
          </button>
      </div>
    </div>
  );
};
