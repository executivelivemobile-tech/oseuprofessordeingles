
import React, { useMemo } from 'react';
import { Hero3D } from './Hero3D';
import { CourseCard, TeacherCard } from './Cards';
import { Course, Teacher, User } from '../types';
import { MOCK_TEACHERS } from '../constants';

interface HomeViewProps {
    currentUser: User | null;
    courses: Course[];
    onNavigateTeacher: (id: string) => void;
    onNavigateCourse: (id: string) => void;
    onNavigateAllCourses: () => void;
    onFindTeacher: () => void;
    favoriteIds: string[];
    onToggleFavorite: (id: string) => void;
    language: 'EN' | 'PT';
}

export const HomeView: React.FC<HomeViewProps> = ({ 
    currentUser,
    courses, 
    onNavigateTeacher, 
    onNavigateCourse, 
    onNavigateAllCourses,
    onFindTeacher,
    favoriteIds,
    onToggleFavorite,
    language
}) => {

    // --- AI Matching Logic ---
    const recommendations = useMemo(() => {
        if (!currentUser || !currentUser.onboardingCompleted) return null;

        const goal = currentUser.goal || 'General';
        const level = currentUser.level || 'Beginner';

        // 1. Filter Teachers based on Goal
        let targetNiches: string[] = [];
        if (goal === 'Career') targetNiches = ['Business', 'Tech', 'Interviews', 'Medical'];
        else if (goal === 'Exams') targetNiches = ['IELTS', 'TOEFL', 'Academic'];
        else if (goal === 'Travel') targetNiches = ['Travel', 'Conversation', 'Beginners'];
        else targetNiches = ['Conversation', 'General'];

        const recommendedTeachers = MOCK_TEACHERS.filter(t => 
            t.niche.some(n => targetNiches.includes(n))
        ).slice(0, 3);

        // 2. Filter Courses based on Level & Goal
        const recommendedCourses = courses.filter(c => {
            const levelMatch = c.level === level;
            // Simple keyword match for category/goal
            const categoryMatch = goal === 'Career' ? ['Business', 'Tech'].includes(c.category) 
                                : goal === 'Travel' ? ['Travel'].includes(c.category)
                                : true;
            return levelMatch || categoryMatch;
        }).slice(0, 3);

        return { teachers: recommendedTeachers, courses: recommendedCourses };
    }, [currentUser, courses]);

    return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
             <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px]"></div>
             <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="z-10 max-w-4xl mx-auto mb-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            {language === 'PT' ? 'INGLÊS PARA' : 'ENGLISH FOR'} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 neon-text">
              {language === 'PT' ? 'O FUTURO PRÓXIMO' : 'THE NEAR FUTURE'}
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            {language === 'PT' 
                ? 'Conecte-se com professores de elite através do nosso hiper-mercado ou faça cursos premium instantaneamente. Potencializado por Pessoas, aprimorado por IA.' 
                : 'Connect with elite teachers via our hyper-market or stream premium courses instantly. Powered by People, enhanced by AI. Effectiveness Designed for results.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onFindTeacher} className="bg-cyan-600 text-white px-8 py-4 rounded-full font-bold hover:bg-cyan-500 transition-all shadow-[0_0_20px_rgba(8,145,178,0.5)]">
              {language === 'PT' ? 'Encontrar Professor' : 'Find a Teacher'}
            </button>
            <button onClick={onNavigateAllCourses} className="bg-transparent border border-gray-600 text-white px-8 py-4 rounded-full font-bold hover:border-white transition-all">
              {language === 'PT' ? 'Explorar Cursos' : 'Explore Courses'}
            </button>
          </div>
        </div>

        <div className="w-full z-10 mb-20">
            <Hero3D onSelectTeacher={onNavigateTeacher} />
        </div>
      </section>

      {/* --- AI Personalized Section --- */}
      {recommendations && (recommendations.teachers.length > 0 || recommendations.courses.length > 0) && (
          <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800 relative overflow-hidden">
              {/* Decorative AI Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-sm"></div>
              
              <div className="max-w-7xl mx-auto px-4 relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center animate-pulse">
                          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-white">Macley's Picks for You</h2>
                          <p className="text-sm text-cyan-400">Curated based on your goal: <span className="font-bold uppercase">{currentUser?.goal}</span></p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Teacher Picks */}
                      {recommendations.teachers.length > 0 && (
                          <div className="space-y-4">
                              <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Top Teacher Matches</h3>
                              <div className="space-y-4">
                                  {recommendations.teachers.map(teacher => (
                                      <div key={teacher.id} className="bg-gray-800/40 border border-gray-700 p-3 rounded-xl flex items-center gap-4 hover:border-cyan-500/50 transition-colors cursor-pointer" onClick={() => onNavigateTeacher(teacher.id)}>
                                          <img src={teacher.photoUrl} className="w-12 h-12 rounded-full object-cover" alt={teacher.name} />
                                          <div className="flex-1">
                                              <h4 className="text-white font-bold">{teacher.name}</h4>
                                              <p className="text-xs text-gray-400">{teacher.niche.join(', ')}</p>
                                          </div>
                                          <div className="text-right">
                                              <div className="text-yellow-500 text-xs font-bold">★ {teacher.rating}</div>
                                              <div className="text-white text-sm font-bold">R$ {teacher.hourlyRate}</div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                      {/* Course Picks */}
                      {recommendations.courses.length > 0 && (
                          <div className="space-y-4">
                              <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Recommended Courses</h3>
                              <div className="space-y-4">
                                  {recommendations.courses.map(course => (
                                      <div key={course.id} className="bg-gray-800/40 border border-gray-700 p-3 rounded-xl flex items-center gap-4 hover:border-purple-500/50 transition-colors cursor-pointer" onClick={() => onNavigateCourse(course.id)}>
                                          <img src={course.thumbnailUrl} className="w-16 h-12 rounded object-cover" alt={course.title} />
                                          <div className="flex-1">
                                              <h4 className="text-white font-bold text-sm line-clamp-1">{course.title}</h4>
                                              <div className="flex items-center gap-2 mt-1">
                                                  <span className="text-[10px] bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">{course.level}</span>
                                              </div>
                                          </div>
                                          <div className="text-purple-400 font-bold text-sm">R$ {course.price}</div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </section>
      )}

      {/* Featured Courses */}
      <section className="py-20 bg-black/50 backdrop-blur-sm border-t border-gray-900">
          <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-end mb-10">
                  <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
                      <p className="text-gray-400">Instant access to premium content.</p>
                  </div>
                  <button onClick={onNavigateAllCourses} className="text-cyan-400 hover:text-white transition-colors">View All →</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.slice(0, 3).map(course => (
                    <CourseCard 
                        key={course.id} 
                        course={course} 
                        isFavorite={favoriteIds.includes(course.id)}
                        onToggleFavorite={(e) => { e.stopPropagation(); onToggleFavorite(course.id); }}
                        onClick={() => onNavigateCourse(course.id)}
                    />
                  ))}
              </div>
          </div>
      </section>
      
      {/* How it Works */}
      <section className="py-20 border-t border-gray-900">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
              <div className="p-8 border border-gray-800 rounded-2xl bg-gradient-to-br from-gray-900 to-black">
                  <h3 className="text-2xl font-bold text-white mb-4">For Students</h3>
                  <ul className="space-y-4 text-gray-400">
                      <li className="flex items-center gap-3"><span className="bg-cyan-900/50 text-cyan-400 w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span> Search for a teacher or course.</li>
                      <li className="flex items-center gap-3"><span className="bg-cyan-900/50 text-cyan-400 w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span> Book a slot or buy instantly via PIX/Card.</li>
                      <li className="flex items-center gap-3"><span className="bg-cyan-900/50 text-cyan-400 w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span> Learn in our virtual classroom or dashboard.</li>
                  </ul>
              </div>
               <div className="p-8 border border-gray-800 rounded-2xl bg-gradient-to-br from-gray-900 to-black">
                  <h3 className="text-2xl font-bold text-white mb-4">For Teachers</h3>
                  <ul className="space-y-4 text-gray-400">
                      <li className="flex items-center gap-3"><span className="bg-purple-900/50 text-purple-400 w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span> Apply & verify your identity.</li>
                      <li className="flex items-center gap-3"><span className="bg-purple-900/50 text-purple-400 w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span> Set your own rates & schedule.</li>
                      <li className="flex items-center gap-3"><span className="bg-purple-900/50 text-purple-400 w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span> Get paid weekly via PIX with low fees.</li>
                  </ul>
              </div>
          </div>
      </section>
    </div>
    );
};
