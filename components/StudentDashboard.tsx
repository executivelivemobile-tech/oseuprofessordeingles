
import React, { useState } from 'react';
import { Booking, Course } from '../types';
import { LearningRoadmap } from './LearningRoadmap';

interface StudentDashboardProps {
  bookings: Booking[];
  myCourses: Course[];
  courseProgress: Record<string, string[]>;
  onNavigateToCourse: (courseId: string) => void;
  onReviewTeacher?: (bookingId: string) => void;
  onCompleteLesson?: (bookingId: string) => void;
  onJoinClass?: (bookingId: string) => void;
  onTakeAssessment?: () => void;
  onOpenSimulator?: () => void;
  onOpenHomework?: () => void;
  onOpenVault?: () => void; 
  onReportIssue?: (booking: Booking) => void;
  onFindTeacher?: () => void; // New Prop
  language: 'EN' | 'PT';
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  bookings, 
  myCourses,
  courseProgress,
  onNavigateToCourse,
  onReviewTeacher,
  onCompleteLesson,
  onJoinClass,
  onTakeAssessment,
  onOpenSimulator,
  onOpenHomework,
  onOpenVault,
  onReportIssue,
  onFindTeacher,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'HISTORY'>('UPCOMING');
  const isPT = language === 'PT';

  const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const historyBookings = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED' || b.status === 'DISPUTED')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const nextLesson = upcomingBookings[0];

  const calculateProgress = (course: Course) => {
      const completed = courseProgress[course.id]?.length || 0;
      const total = course.syllabus?.reduce((acc, mod) => acc + mod.lessons.length, 0) || 0;
      if (total === 0) return 0;
      return Math.round((completed / total) * 100);
  };

  const handleRoadmapAction = (type: string) => {
      switch (type) {
          case 'BOOK_CLASS': onFindTeacher?.(); break;
          case 'ASSESSMENT': onTakeAssessment?.(); break;
          case 'PRACTICE': onOpenVault?.(); break;
          case 'COURSE': onNavigateToCourse('c1'); break; // Fallback or navigate to courses list
          default: console.log('Action:', type);
      }
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{isPT ? 'Área do Aluno' : 'Student Dashboard'}</h1>
          <p className="text-gray-400">{isPT ? 'Bem-vindo de volta, Viajante. Sua jornada continua.' : 'Welcome back, Traveler. Your journey continues.'}</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
             <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-center">
                 <span className="block text-xs text-gray-500 uppercase">{isPT ? 'Horas Estudadas' : 'Hours Learned'}</span>
                 <span className="text-xl font-bold text-cyan-400">12.5</span>
             </div>
             <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-center">
                 <span className="block text-xs text-gray-500 uppercase">{isPT ? 'Nível' : 'Level'}</span>
                 <span className="text-xl font-bold text-purple-400">B2</span>
             </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Tabs for Bookings */}
            <div>
                <div className="flex gap-6 border-b border-gray-800 mb-6">
                    <button 
                        onClick={() => setActiveTab('UPCOMING')} 
                        className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'UPCOMING' ? 'border-cyan-500 text-white' : 'border-transparent text-gray-500'}`}
                    >
                        {isPT ? 'Próximas Missões' : 'Upcoming Missions'}
                    </button>
                    <button 
                        onClick={() => setActiveTab('HISTORY')} 
                        className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'HISTORY' ? 'border-cyan-500 text-white' : 'border-transparent text-gray-500'}`}
                    >
                        {isPT ? 'Histórico' : 'Mission History'}
                    </button>
                </div>

                {activeTab === 'UPCOMING' && (
                    <div className="space-y-6">
                         {/* Next Lesson Hero */}
                        {nextLesson ? (
                            <div className="bg-gradient-to-r from-gray-900 to-black border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                
                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-cyan-500 flex items-center justify-center overflow-hidden">
                                            <span className="text-2xl">👨‍🏫</span> 
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-bold text-white">{nextLesson.teacherName}</h4>
                                            <p className="text-cyan-400">{new Date(nextLesson.date).toLocaleDateString()} at {nextLesson.timeSlot}</p>
                                            <span className="inline-block mt-2 text-xs bg-cyan-900/40 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                                                {isPT ? 'Confirmado' : 'Confirmed'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 w-full md:w-auto">
                                        <button 
                                            onClick={() => onJoinClass && onJoinClass(nextLesson.id)}
                                            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)]"
                                        >
                                            {isPT ? 'Entrar na Sala' : 'Join Class Room'}
                                        </button>
                                        <button 
                                            onClick={() => onCompleteLesson && onCompleteLesson(nextLesson.id)}
                                            className="px-6 py-2 bg-transparent border border-gray-700 text-gray-400 hover:text-green-400 hover:border-green-400 rounded-xl text-sm transition-all"
                                        >
                                            {isPT ? 'Simular Conclusão' : 'Simulate Completion'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-900/50 border border-gray-800 border-dashed rounded-2xl p-8 text-center">
                                <p className="text-gray-500 mb-4">{isPT ? 'Nenhuma aula agendada.' : 'No upcoming missions scheduled.'}</p>
                                <button 
                                    onClick={onFindTeacher}
                                    className="text-cyan-400 hover:text-white font-bold"
                                >
                                    {isPT ? 'Encontrar Professor' : 'Find a Teacher'} →
                                </button>
                            </div>
                        )}
                        
                        {/* List of other upcoming */}
                        {upcomingBookings.length > 1 && (
                             <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">{isPT ? 'Agenda Futura' : 'Future Schedule'}</h3>
                                <div className="space-y-4">
                                    {upcomingBookings.slice(1).map((booking) => (
                                         <div key={booking.id} className="flex items-center gap-4 p-3 bg-black/20 rounded-lg">
                                            <div className="bg-gray-800 p-2 rounded text-center min-w-[60px]">
                                                <div className="text-xs text-gray-500 uppercase">{new Date(booking.date).toLocaleDateString('en-US', {weekday: 'short'})}</div>
                                                <div className="font-bold text-white">{new Date(booking.date).getDate()}</div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-bold text-white">{booking.teacherName}</div>
                                                <div className="text-xs text-gray-500">{booking.timeSlot} • 50 min</div>
                                            </div>
                                         </div>
                                    ))}
                                </div>
                             </div>
                        )}
                    </div>
                )}

                {activeTab === 'HISTORY' && (
                    <div className="space-y-4 animate-fade-in">
                        {historyBookings.length > 0 ? (
                            historyBookings.map(booking => (
                                <div key={booking.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                         <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-500">
                                            ✓
                                         </div>
                                         <div>
                                             <h4 className="font-bold text-white">{booking.teacherName}</h4>
                                             <p className="text-xs text-gray-500">{new Date(booking.date).toLocaleDateString()} • {booking.timeSlot}</p>
                                         </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {booking.status === 'COMPLETED' && !booking.reviewed && (
                                            <button 
                                                onClick={() => onReviewTeacher && onReviewTeacher(booking.id)}
                                                className="text-sm bg-yellow-600/20 text-yellow-400 border border-yellow-600/50 px-4 py-2 rounded-lg hover:bg-yellow-600/40 transition-all font-bold"
                                            >
                                                ★ {isPT ? 'Avaliar' : 'Rate'}
                                            </button>
                                        )}
                                        {booking.status === 'COMPLETED' && booking.reviewed && (
                                            <span className="text-sm text-gray-500 flex items-center gap-1 px-3 py-2">
                                                <span className="text-yellow-500">★</span> {isPT ? 'Avaliado' : 'Reviewed'}
                                            </span>
                                        )}
                                        {booking.status === 'CANCELLED' && (
                                            <span className="text-sm text-red-500 bg-red-900/20 px-3 py-1 rounded">{isPT ? 'Cancelado' : 'Cancelled'}</span>
                                        )}
                                        {booking.status === 'DISPUTED' ? (
                                            <span className="text-sm text-orange-500 bg-orange-900/20 px-3 py-1 rounded border border-orange-900 font-bold">{isPT ? 'Em Disputa' : 'In Dispute'}</span>
                                        ) : (
                                            <button 
                                                onClick={() => onReportIssue && onReportIssue(booking)}
                                                className="text-xs text-gray-500 hover:text-red-400 border border-transparent hover:border-red-900 px-3 py-2 rounded-lg transition-all"
                                            >
                                                {isPT ? 'Reportar Problema' : 'Report Issue'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                {isPT ? 'Nenhuma aula concluída ainda.' : 'No completed lessons yet.'}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* My Courses */}
            <section>
                <h3 className="text-xl font-bold text-white mb-4">{isPT ? 'Cursos Ativos' : 'Active Courses'}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {myCourses.length > 0 ? (
                        myCourses.map(course => {
                            const percent = calculateProgress(course);
                            return (
                                <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer" onClick={() => onNavigateToCourse(course.id)}>
                                    <div className="h-32 overflow-hidden relative">
                                        <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-white truncate mb-2">{course.title}</h4>
                                        <div className="w-full bg-gray-800 h-1.5 rounded-full mb-2">
                                            <div 
                                                className="bg-purple-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-1000"
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span className={`${percent === 100 ? 'text-green-400 font-bold' : ''}`}>
                                                {percent === 100 ? (isPT ? 'Concluído' : 'Completed') : `${percent}% ${isPT ? 'Concluído' : 'Completed'}`}
                                            </span>
                                            <span>{percent === 100 ? (isPT ? 'Revisar' : 'Review') : (isPT ? 'Continuar' : 'Resume')}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-2 bg-gray-900/50 border border-gray-800 border-dashed rounded-2xl p-8 text-center">
                             <p className="text-gray-500">{isPT ? 'Você ainda não se inscreveu em nenhum curso.' : "You haven't enrolled in any courses yet."}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* AI Learning Roadmap */}
            <LearningRoadmap 
                level="Intermediate" 
                goal="Business" 
                onAction={handleRoadmapAction}
            />

            {/* Vault Callout */}
            <div className="bg-gradient-to-br from-green-900/30 to-black border border-green-500/30 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/10 rounded-full blur-2xl group-hover:bg-green-600/20 transition-all"></div>
                <h3 className="text-lg font-bold text-white mb-2 relative z-10 flex items-center gap-2">
                    <span className="bg-green-500 w-2 h-2 rounded-full animate-pulse"></span>
                    {isPT ? 'Cofre Inteligente' : 'Smart Vault'}
                </h3>
                <p className="text-sm text-gray-400 mb-4 relative z-10">{isPT ? 'Revise seu vocabulário salvo com histórias geradas por IA.' : 'Review your saved vocabulary with AI-generated stories.'}</p>
                <button 
                    onClick={onOpenVault}
                    className="w-full bg-green-600/20 hover:bg-green-600 hover:text-white text-green-400 border border-green-600/50 rounded-xl py-2 font-bold text-sm transition-all relative z-10"
                >
                    {isPT ? 'Abrir Cofre' : 'Open Vault'}
                </button>
            </div>

            {/* Assessment Callout */}
            <div className="bg-gradient-to-br from-cyan-900/30 to-black border border-cyan-500/30 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-2xl group-hover:bg-cyan-600/20 transition-all"></div>
                <h3 className="text-lg font-bold text-white mb-2 relative z-10">{isPT ? 'Nivelamento com IA' : 'AI Level Check'}</h3>
                <p className="text-sm text-gray-400 mb-4 relative z-10">{isPT ? 'Não sabe seu nível? Deixe o Macley analisar sua proficiência em 2 minutos.' : 'Not sure about your level? Let Macley analyze your proficiency in 2 minutes.'}</p>
                <button 
                    onClick={onTakeAssessment}
                    className="w-full bg-cyan-600/20 hover:bg-cyan-600 hover:text-white text-cyan-400 border border-cyan-600/50 rounded-xl py-2 font-bold text-sm transition-all relative z-10"
                >
                    {isPT ? 'Iniciar Análise' : 'Start Analysis'}
                </button>
            </div>

            {/* AI Simulator Callout */}
            <div className="bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/30 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all"></div>
                <h3 className="text-lg font-bold text-white mb-2 relative z-10">{isPT ? 'Simulador de Roleplay' : 'Roleplay Simulator'}</h3>
                <p className="text-sm text-gray-400 mb-4 relative z-10">{isPT ? 'Pratique cenários reais como entrevistas ou cafés com IA.' : 'Practice real-world scenarios like job interviews or coffee orders with AI.'}</p>
                <button 
                    onClick={onOpenSimulator}
                    className="w-full bg-purple-600/20 hover:bg-purple-600 hover:text-white text-purple-400 border border-purple-600/50 rounded-xl py-2 font-bold text-sm transition-all relative z-10"
                >
                    {isPT ? 'Entrar no Simulador' : 'Enter Simulator'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
