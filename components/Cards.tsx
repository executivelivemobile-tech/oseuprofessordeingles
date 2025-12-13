
import React from 'react';
import { Teacher, Course } from '../types';

// --- NEW PREMIUM ASSETS ---

// The New Premium Verified Badge
export const VerifiedBadge = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    // Size mapping
    const baseSize = size === 'lg' ? 'w-8 h-8' : size === 'md' ? 'w-6 h-6' : 'w-5 h-5';
    
    return (
        <div className={`relative ${baseSize} flex-shrink-0 group select-none`} title="Verified Elite Teacher">
            {/* Inline styles for the metallic glint animation */}
            <style>
                {`
                @keyframes shine-glint {
                    0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { transform: translateX(200%) skewX(-15deg); opacity: 0; }
                }
                `}
            </style>

            {/* 1. Ambient Glow (Golden Halo) */}
            <div className="absolute inset-0 bg-yellow-500 rounded-full blur-[3px] opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>

            {/* 2. The Golden Seal SVG */}
            <svg className="w-full h-full relative z-10 drop-shadow-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="goldGradient" x1="2.3" y1="2.3" x2="21.7" y2="21.7" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FDE68A" /> {/* Amber-200 (Highlight) */}
                        <stop offset="40%" stopColor="#F59E0B" /> {/* Amber-500 (Mid) */}
                        <stop offset="100%" stopColor="#B45309" /> {/* Amber-700 (Shadow) */}
                    </linearGradient>
                </defs>
                
                {/* The Rosette / Scalloped Badge Shape */}
                <path 
                    d="M10.7831 2.20336C11.3995 1.54736 12.6005 1.54736 13.2169 2.20336L14.3976 3.45979C14.6599 3.73887 15.0673 3.848 15.4297 3.7364L17.061 3.23397C17.9126 2.97166 18.7613 3.82035 18.499 4.67197L17.9966 6.3033C17.885 6.66567 17.9941 7.0731 18.2732 7.33535L19.5296 8.51608C20.1856 9.13247 20.1856 10.3335 19.5296 10.9499L18.2732 12.1306C17.9941 12.3929 17.885 12.8003 17.9966 13.1627L18.499 14.794C18.7613 15.6456 17.9126 16.4943 17.061 16.232L15.4297 15.7296C15.0673 15.618 14.6599 15.7271 14.3976 16.0062L13.2169 17.2626C12.6005 17.9186 11.3995 17.9186 10.7831 17.2626L9.60239 16.0062C9.34011 15.7271 8.9327 15.618 8.57034 15.7296L6.93901 16.232C6.08738 16.4943 5.23869 15.6456 5.501 14.794L6.00343 13.1627C6.11502 12.8003 6.0059 12.3929 5.72682 12.1306L4.47039 10.9499C3.81439 10.3335 3.81439 9.13247 4.47039 8.51608L5.72682 7.33535C6.0059 7.0731 6.11502 6.66567 6.00343 6.3033L5.501 4.67197C5.23869 3.82035 6.08738 2.97166 6.93901 3.23397L8.57034 3.7364C8.9327 3.848 9.34011 3.73887 9.60239 3.45979L10.7831 2.20336Z" 
                    fill="url(#goldGradient)" 
                    stroke="#FDE68A" 
                    strokeWidth="0.5"
                />
                
                {/* The Checkmark */}
                <path 
                    d="M8.5 9.5L10.5 11.5L15.5 6.5" 
                    stroke="white" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    transform="translate(0, 1)"
                />
            </svg>

            {/* 3. Metallic Shine Effect (Overlay) */}
            <div className="absolute inset-0 rounded-full overflow-hidden z-20 pointer-events-none">
                <div 
                    className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    style={{ animation: 'shine-glint 4s ease-in-out infinite' }}
                ></div>
            </div>
        </div>
    );
};

const Icons = {
    Play: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
    HeartFilled: () => <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
    HeartOutline: () => <svg className="w-6 h-6 text-gray-400 hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
};

interface CardProps {
    isFavorite: boolean;
    onToggleFavorite: (e: React.MouseEvent) => void;
    onClick: () => void;
}

interface TeacherCardProps extends CardProps {
    teacher: Teacher;
}

interface CourseCardProps extends CardProps {
    course: Course;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, isFavorite, onToggleFavorite, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group cursor-pointer relative"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={teacher.photoUrl} alt={teacher.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex items-end justify-between">
          <div>
              <div className="flex items-center gap-1.5">
                  <h3 className="text-xl font-bold text-white leading-none">{teacher.name}</h3>
                  {/* Insert 3D Badge here */}
                  {teacher.verified && (
                      <div className="mb-0.5">
                          <VerifiedBadge size="sm" />
                      </div>
                  )}
              </div>
              <p className="text-cyan-400 text-xs mt-1">{teacher.location}</p>
          </div>
        </div>
        
        {/* Favorite Button */}
        <button 
            onClick={onToggleFavorite} 
            className="absolute top-2 left-2 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 z-10 transition-all"
        >
            {isFavorite ? <Icons.HeartFilled /> : <Icons.HeartOutline />}
        </button>

        {teacher.introVideoUrl && (
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                <Icons.Play />
                <span className="text-xs text-white">Video</span>
            </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {teacher.niche.slice(0, 3).map(n => (
            <span key={n} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full border border-gray-700">{n}</span>
          ))}
          {teacher.niche.length > 3 && <span className="text-xs text-gray-500">+{teacher.niche.length - 3}</span>}
        </div>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">{teacher.bio}</p>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-1 text-yellow-500">
            <span>★</span>
            <span className="text-white font-bold">{teacher.rating}</span>
            <span className="text-gray-500 text-xs">({teacher.reviewCount})</span>
          </div>
          <div className="text-right">
             <span className="text-lg font-bold text-white">R$ {teacher.hourlyRate}</span>
             <span className="text-xs text-gray-500">/hour</span>
          </div>
        </div>
        <button className="w-full mt-4 bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white py-2 rounded-lg transition-all font-medium border border-cyan-500/30 hover:border-cyan-500">
            View Profile
        </button>
      </div>
    </div>
);

export const CourseCard: React.FC<CourseCardProps> = ({ course, isFavorite, onToggleFavorite, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all group relative cursor-pointer"
    >
       <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded uppercase font-bold z-10 shadow-lg">
           {course.level}
       </div>

       {/* Favorite Button */}
       <button 
            onClick={onToggleFavorite} 
            className="absolute top-2 left-2 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 z-10 transition-all"
        >
            {isFavorite ? <Icons.HeartFilled /> : <Icons.HeartOutline />}
        </button>

       <div className="relative h-40 overflow-hidden">
        <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1 leading-tight h-14 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-gray-700 inline-block"></span>
            {course.instructorName}
        </p>
        <div className="flex justify-between items-end">
             <div>
                 <p className="text-xs text-gray-500">{course.duration} • {course.modules} Modules</p>
             </div>
             <p className="text-xl font-bold text-purple-400">R$ {course.price}</p>
        </div>
        <button className="w-full mt-4 border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-600 hover:text-white py-2 rounded-lg transition-colors font-medium">
            Details
        </button>
      </div>
    </div>
);
