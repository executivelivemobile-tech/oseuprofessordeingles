import React, { useState } from 'react';
import { Teacher, Course } from '../types';
import { TeacherCard, CourseCard } from './Cards';

interface FavoritesViewProps {
  favoriteIds: string[];
  teachers: Teacher[];
  courses: Course[];
  onNavigateTeacher: (id: string) => void;
  onNavigateCourse: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onFindMore: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ 
    favoriteIds, 
    teachers, 
    courses, 
    onNavigateTeacher, 
    onNavigateCourse, 
    onToggleFavorite,
    onFindMore
}) => {
  const [activeTab, setActiveTab] = useState<'TEACHERS' | 'COURSES'>('TEACHERS');

  const savedTeachers = teachers.filter(t => favoriteIds.includes(t.id));
  const savedCourses = courses.filter(c => favoriteIds.includes(c.id));

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-20 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">My List</h1>
                <p className="text-gray-400">Manage your saved mentors and learning paths.</p>
            </div>
            
            <div className="flex gap-4 mt-4 md:mt-0">
                <button 
                    onClick={() => setActiveTab('TEACHERS')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'TEACHERS' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white bg-gray-900'}`}
                >
                    Teachers ({savedTeachers.length})
                </button>
                <button 
                    onClick={() => setActiveTab('COURSES')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'COURSES' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white bg-gray-900'}`}
                >
                    Courses ({savedCourses.length})
                </button>
            </div>
        </div>

        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 min-h-[400px]">
            {activeTab === 'TEACHERS' && (
                savedTeachers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {savedTeachers.map(teacher => (
                            <TeacherCard 
                                key={teacher.id} 
                                teacher={teacher} 
                                isFavorite={true}
                                onToggleFavorite={(e) => { e.stopPropagation(); onToggleFavorite(teacher.id); }}
                                onClick={() => onNavigateTeacher(teacher.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <p className="text-gray-400 mb-4">You haven't saved any teachers yet.</p>
                        <button onClick={onFindMore} className="text-cyan-400 font-bold hover:text-white transition-colors">Find a Teacher</button>
                    </div>
                )
            )}

            {activeTab === 'COURSES' && (
                savedCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {savedCourses.map(course => (
                            <CourseCard 
                                key={course.id} 
                                course={course} 
                                isFavorite={true}
                                onToggleFavorite={(e) => { e.stopPropagation(); onToggleFavorite(course.id); }}
                                onClick={() => onNavigateCourse(course.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <p className="text-gray-400 mb-4">Your wishlist is empty.</p>
                        <button onClick={onFindMore} className="text-cyan-400 font-bold hover:text-white transition-colors">Browse Courses</button>
                    </div>
                )
            )}
        </div>
    </div>
  );
};