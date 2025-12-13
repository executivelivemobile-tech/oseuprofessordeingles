
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MOCK_TEACHERS } from '../constants';
import { VerifiedBadge } from './Cards';

export const Hero3D: React.FC<{ onSelectTeacher: (id: string) => void }> = ({ onSelectTeacher }) => {
  // Sort teachers by rating descending for the carousel
  const sortedTeachers = useMemo(() => {
      return [...MOCK_TEACHERS].sort((a, b) => b.rating - a.rating);
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-rotate logic
  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [activeIndex]);

  const startAutoplay = () => {
    stopAutoplay();
    autoplayRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % sortedTeachers.length);
    }, 4000);
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
    }
  };

  const handleNext = () => {
    stopAutoplay();
    setActiveIndex((prev) => (prev + 1) % sortedTeachers.length);
  };

  const handlePrev = () => {
    stopAutoplay();
    setActiveIndex((prev) => (prev - 1 + sortedTeachers.length) % sortedTeachers.length);
  };

  // Calculate 3D styles for each card based on distance from active index
  const getStyles = (index: number) => {
    const total = sortedTeachers.length;
    // Calculate distance accounting for wrap-around
    let distance = (index - activeIndex + total) % total;
    if (distance > total / 2) distance -= total;
    
    // Visibility optimization: only show close neighbors
    const absDist = Math.abs(distance);
    const isVisible = absDist <= 2;

    if (!isVisible) return { display: 'none' };

    const xOffset = distance * 260; // Slightly increased horizontal spacing
    
    // CRYSTAL CLEAR LOGIC:
    // Base size is now the "Active" size. We scale DOWN for neighbors.
    // Active: Scale 1.0 (Pixel Perfect)
    // Neighbors: Scale 0.75, 0.6, etc.
    const scale = Math.max(0, 1 - absDist * 0.25); 
    
    const rotateY = distance > 0 ? -25 : distance < 0 ? 25 : 0; // Rotate inwards
    const zIndex = 100 - absDist;
    const opacity = absDist === 0 ? 1 : 0.5; // Lower opacity for background

    return {
      transform: `translateX(${xOffset}px) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex,
      opacity,
      // No blur filter to ensure sharpness
      boxShadow: absDist === 0 ? '0 30px 60px -15px rgba(0, 0, 0, 0.8)' : 'none',
      transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
      backfaceVisibility: 'hidden' as any,
      WebkitFontSmoothing: 'antialiased',
      transformStyle: 'preserve-3d' as any,
    };
  };

  return (
    <div className="relative h-[700px] w-full flex items-center justify-center overflow-hidden perspective-1000 bg-gradient-to-b from-transparent via-black/20 to-black">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative w-full max-w-7xl h-[550px] flex items-center justify-center preserve-3d">
            {sortedTeachers.map((teacher, index) => (
                <div
                    key={teacher.id}
                    // Increased base dimensions to be the "Max Size" natively.
                    // w-[300px] -> w-[380px]
                    // h-[420px] -> h-[540px]
                    className="absolute w-[380px] h-[540px] bg-gray-900 border border-gray-700/50 rounded-3xl overflow-hidden cursor-pointer shadow-2xl origin-center will-change-transform"
                    style={getStyles(index)}
                    onClick={() => {
                        if (index === activeIndex) {
                            onSelectTeacher(teacher.id);
                        } else {
                            setActiveIndex(index);
                            stopAutoplay();
                        }
                    }}
                    onMouseEnter={stopAutoplay}
                    onMouseLeave={startAutoplay}
                >
                    {/* Active State Glow */}
                    {index === activeIndex && (
                        <div className="absolute inset-0 rounded-3xl ring-1 ring-cyan-400/50 shadow-[0_0_50px_rgba(34,211,238,0.2)] z-50 pointer-events-none"></div>
                    )}
                    
                    {/* Rank Badge for Top 3 */}
                    {index < 3 && (
                        <div className="absolute top-5 left-5 z-20 bg-yellow-500 text-black font-bold text-sm px-3 py-1 rounded-lg shadow-lg">
                            #{index + 1}
                        </div>
                    )}

                    {/* Image Container */}
                    <div className="h-[65%] relative overflow-hidden">
                         <img 
                            src={teacher.photoUrl} 
                            alt={teacher.name} 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            style={{ 
                                imageRendering: 'auto', // CSS property hint
                                backfaceVisibility: 'hidden'
                            }} 
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                         
                         {/* Top Badges */}
                         <div className="absolute top-5 right-5 flex flex-col items-end gap-2">
                             {/* Verified Badge */}
                            {teacher.verified && (
                                <div className="pt-2" title="Verified Teacher">
                                     <VerifiedBadge size="md" />
                                </div>
                            )}
                         </div>
                    </div>

                    {/* Content Area */}
                    <div className="h-[35%] p-6 flex flex-col justify-between relative bg-black/80 backdrop-blur-xl border-t border-white/10">
                        <div>
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-3xl font-bold text-white font-orbitron truncate">{teacher.name}</h3>
                                <div className="flex items-center gap-1 bg-yellow-900/30 px-2 py-1 rounded border border-yellow-700/30">
                                    <span className="text-yellow-400 text-sm">★</span>
                                    <span className="text-yellow-400 text-base font-bold">{teacher.rating}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs uppercase tracking-wider font-bold px-2 py-1 rounded bg-cyan-900/50 text-cyan-300 border border-cyan-800">{teacher.accent} Accent</span>
                                {teacher.introVideoUrl && (
                                    <span className="text-xs uppercase tracking-wider font-bold px-2 py-1 rounded bg-purple-900/50 text-purple-300 border border-purple-800 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                        Video
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                             <div className="text-gray-400">
                                 <span className="block text-gray-500 uppercase text-[10px] font-bold tracking-widest">Hourly Rate</span>
                                 <span className="text-2xl font-bold text-white">R$ {teacher.hourlyRate}</span>
                             </div>
                             <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-cyan-500/40 hover:scale-105 transition-all">
                                VIEW PROFILE
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Navigation Controls */}
        <button onClick={handlePrev} className="absolute left-4 md:left-12 z-50 p-4 rounded-full bg-black/40 border border-gray-600 text-white hover:bg-cyan-900/80 hover:border-cyan-400 hover:scale-110 transition-all backdrop-blur-sm group">
            <svg className="w-8 h-8 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={handleNext} className="absolute right-4 md:right-12 z-50 p-4 rounded-full bg-black/40 border border-gray-600 text-white hover:bg-cyan-900/80 hover:border-cyan-400 hover:scale-110 transition-all backdrop-blur-sm group">
            <svg className="w-8 h-8 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Cinematic Indicators */}
        <div className="absolute bottom-6 flex gap-3 z-50">
            {sortedTeachers.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => { setActiveIndex(idx); stopAutoplay(); }}
                    className={`h-1.5 transition-all duration-500 rounded-full ${
                        idx === activeIndex 
                        ? 'w-16 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(34,211,238,0.8)]' 
                        : 'w-2 bg-gray-700 hover:bg-gray-500'
                    }`}
                />
            ))}
        </div>
    </div>
  );
};
