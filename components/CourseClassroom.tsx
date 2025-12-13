
import React, { useState, useEffect, useMemo } from 'react';
import { Course } from '../types';

interface CourseClassroomProps {
  course: Course;
  completedLessonIds: string[];
  onLessonComplete: (lessonId: string) => void;
  onBack: () => void;
  onCompleteCourse?: (courseId: string) => void; // Callback to open certificate
}

export const CourseClassroom: React.FC<CourseClassroomProps> = ({ 
    course, 
    completedLessonIds, 
    onLessonComplete,
    onBack, 
    onCompleteCourse 
}) => {
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'RESOURCES' | 'NOTES'>('OVERVIEW');
  
  // Watermark State
  const [watermarkPos, setWatermarkPos] = useState({ top: '10%', left: '10%' });

  const currentModule = course.syllabus ? course.syllabus[activeModuleIdx] : null;
  const currentLessonTitle = currentModule ? currentModule.lessons[activeLessonIdx] : 'Introduction';

  // Sample video used for all lessons for demo purposes
  const VIDEO_SRC = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  // Calculate Progress
  const totalLessons = useMemo(() => {
      return course.syllabus?.reduce((acc, mod) => acc + mod.lessons.length, 0) || 0;
  }, [course]);

  const progressPercentage = useMemo(() => {
      if (totalLessons === 0) return 0;
      return Math.round((completedLessonIds.length / totalLessons) * 100);
  }, [completedLessonIds, totalLessons]);

  // Dynamic Watermark Effect
  useEffect(() => {
      const moveWatermark = () => {
          const top = Math.floor(Math.random() * 80) + 10 + '%';
          const left = Math.floor(Math.random() * 80) + 10 + '%';
          setWatermarkPos({ top, left });
      };
      
      const interval = setInterval(moveWatermark, 15000); // Move every 15s
      return () => clearInterval(interval);
  }, []);

  const handleMarkComplete = () => {
      const lessonKey = `${activeModuleIdx}-${activeLessonIdx}`;
      onLessonComplete(lessonKey);

      // Auto advance logic
      if (currentModule && activeLessonIdx < currentModule.lessons.length - 1) {
          setActiveLessonIdx(prev => prev + 1);
      } else if (course.syllabus && activeModuleIdx < course.syllabus.length - 1) {
          setActiveModuleIdx(prev => prev + 1);
          setActiveLessonIdx(0);
      }
  };

  const isCurrentLessonCompleted = completedLessonIds.includes(`${activeModuleIdx}-${activeLessonIdx}`);

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col pt-20">
        {/* Top Navigation */}
        <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Dashboard
                </button>
                <div className="h-6 w-px bg-gray-700"></div>
                <h1 className="text-white font-bold truncate max-w-md">{course.title}</h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-sm font-bold text-cyan-400">{progressPercentage}% Completed</span>
                </div>
                <div className="w-32 h-2 bg-gray-800 rounded-full relative overflow-hidden">
                    <div 
                        className="bg-cyan-500 h-2 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-500" 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                {progressPercentage === 100 && (
                    <button 
                        onClick={() => onCompleteCourse && onCompleteCourse(course.id)}
                        className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg animate-pulse"
                    >
                        🏆 Get Certificate
                    </button>
                )}
            </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Main Content (Video) */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="w-full bg-black aspect-video relative shadow-2xl overflow-hidden group">
                    <video 
                        key={`${activeModuleIdx}-${activeLessonIdx}`} // Force reload on change
                        className="w-full h-full object-contain"
                        controls
                        controlsList="nodownload" // Basic download prevention
                        autoPlay={false}
                        poster={course.thumbnailUrl}
                    >
                        <source src={VIDEO_SRC} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* DRM-Lite Watermark */}
                    <div 
                        className="absolute text-white/20 text-xs font-mono font-bold pointer-events-none select-none z-50 transition-all duration-[2000ms] ease-in-out"
                        style={{ top: watermarkPos.top, left: watermarkPos.left }}
                    >
                        LICENSED TO USER • {new Date().toLocaleDateString()}
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{currentLessonTitle}</h2>
                            <p className="text-gray-400 text-sm">Module {activeModuleIdx + 1}: {currentModule?.title}</p>
                        </div>
                        <button 
                            onClick={handleMarkComplete}
                            disabled={isCurrentLessonCompleted}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                                isCurrentLessonCompleted 
                                ? 'bg-green-900/30 text-green-400 border border-green-500 cursor-default' 
                                : 'bg-gray-800 hover:bg-cyan-900/30 text-gray-300 hover:text-cyan-400 border border-gray-700 hover:border-cyan-500'
                            }`}
                        >
                            {isCurrentLessonCompleted ? (
                                <>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    Completed
                                </>
                            ) : (
                                <>
                                    <div className="w-4 h-4 border-2 border-current rounded-full"></div>
                                    Mark Complete
                                </>
                            )}
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-800 mb-6">
                        <div className="flex gap-6">
                            <button onClick={() => setActiveTab('OVERVIEW')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'OVERVIEW' ? 'border-cyan-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Overview</button>
                            <button onClick={() => setActiveTab('RESOURCES')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'RESOURCES' ? 'border-cyan-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Resources</button>
                            <button onClick={() => setActiveTab('NOTES')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'NOTES' ? 'border-cyan-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>My Notes</button>
                        </div>
                    </div>

                    {activeTab === 'OVERVIEW' && (
                        <div className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                            <p className="mb-4">In this lesson, we will cover the core concepts essential for mastering this module. Please ensure you have watched the previous videos to fully understand the context.</p>
                            <p>Instructor: <span className="text-cyan-400 font-bold">{course.instructorName}</span></p>
                        </div>
                    )}
                    
                    {activeTab === 'RESOURCES' && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-600 cursor-pointer">
                                <div className="bg-red-500/20 p-2 rounded text-red-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg></div>
                                <div>
                                    <p className="text-white text-sm font-bold">Cheat Sheet.pdf</p>
                                    <p className="text-xs text-gray-500">2.4 MB</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-600 cursor-pointer">
                                <div className="bg-blue-500/20 p-2 rounded text-blue-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></div>
                                <div>
                                    <p className="text-white text-sm font-bold">External References</p>
                                    <p className="text-xs text-gray-500">Link</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'NOTES' && (
                         <div className="relative">
                             <textarea className="w-full h-32 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500 text-sm" placeholder="Take notes here..."></textarea>
                             <button className="mt-2 bg-cyan-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-cyan-500">Save Note</button>
                         </div>
                    )}
                </div>
            </div>

            {/* Sidebar (Syllabus) */}
            <div className="w-full lg:w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto">
                <div className="p-4 border-b border-gray-800">
                    <h3 className="font-bold text-white mb-1">Course Content</h3>
                </div>
                <div>
                    {course.syllabus?.map((module, mIdx) => (
                        <div key={mIdx} className="border-b border-gray-800">
                            <div className="p-4 bg-gray-800/50 flex justify-between items-center cursor-pointer hover:bg-gray-800">
                                <h4 className="text-sm font-bold text-gray-200">Module {mIdx + 1}</h4>
                                <span className="text-xs text-gray-500">{module.duration}</span>
                            </div>
                            <div>
                                {module.lessons.map((lesson, lIdx) => {
                                    const isActive = mIdx === activeModuleIdx && lIdx === activeLessonIdx;
                                    const isCompleted = completedLessonIds.includes(`${mIdx}-${lIdx}`);
                                    
                                    return (
                                        <div 
                                            key={lIdx} 
                                            onClick={() => {
                                                setActiveModuleIdx(mIdx);
                                                setActiveLessonIdx(lIdx);
                                            }}
                                            className={`p-4 pl-6 text-sm flex gap-3 cursor-pointer hover:bg-gray-800/80 transition-colors ${isActive ? 'bg-cyan-900/20 border-l-2 border-cyan-500' : 'border-l-2 border-transparent'}`}
                                        >
                                            <div className="mt-0.5">
                                                {isCompleted ? (
                                                    <div className="w-4 h-4 rounded-full bg-green-900 text-green-400 flex items-center justify-center">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                    </div>
                                                ) : isActive ? (
                                                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                                ) : (
                                                     <div className="w-4 h-4 rounded-full border border-gray-600"></div>
                                                )}
                                            </div>
                                            <div className={`${isActive ? 'text-cyan-100 font-medium' : 'text-gray-400'}`}>
                                                {lesson}
                                                <div className="text-xs text-gray-600 mt-0.5">15 min</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};
