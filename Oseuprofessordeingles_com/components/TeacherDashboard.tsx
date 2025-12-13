
import React, { useState, useEffect } from 'react';
import { Booking, Course, Review, Teacher, User, UserRole } from '../types';
import { FinancialDashboard } from './FinancialDashboard';
import { LessonGenerator } from './LessonGenerator';
import { initializeGoogleDriveFolder, createStudentNotebook } from '../services/googleDocsService';

interface TeacherDashboardProps {
  myCourses?: Course[];
  myReviews?: Review[];
  onCreateCourse?: () => void;
  // Mocking the logged in teacher for availability editing
  currentTeacher?: Teacher; 
  onUpdateAvailability?: (newAvailability: Record<string, number[]>) => void;
  language: 'EN' | 'PT';
}

// Mock Students with Doc Info
const MOCK_STUDENTS: User[] = [
    { 
        id: 's1', name: 'Alice Freeman', email: 'alice@test.com', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/alice/50/50', 
        level: 'Intermediate', goal: 'Business', 
        googleDocsIntegration: { linkedFolderId: 'f1', docUrl: 'https://docs.google.com', lastSync: '2 days ago' } 
    },
    { 
        id: 's2', name: 'Bob Smith', email: 'bob@test.com', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/bob/50/50', 
        level: 'Beginner', goal: 'Travel', 
        // No integration yet
    },
    { 
        id: 's3', name: 'Charlie Brown', email: 'charlie@test.com', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/charlie/50/50', 
        level: 'Advanced', goal: 'Fluency', 
        googleDocsIntegration: { linkedFolderId: 'f3', docUrl: 'https://docs.google.com', lastSync: 'Today' } 
    },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 8:00 to 22:00

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
    myCourses = [], 
    myReviews = [], 
    onCreateCourse,
    currentTeacher,
    onUpdateAvailability,
    language
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CLASSROOM' | 'SCHEDULE' | 'COURSES' | 'FINANCIALS'>('OVERVIEW');
  const [schedule, setSchedule] = useState<Record<string, number[]>>({});
  
  // Lesson Generator State
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  
  // Local student state to handle updates (like linking docs)
  const [students, setStudents] = useState<User[]>(MOCK_STUDENTS);
  const [processingStudentId, setProcessingStudentId] = useState<string | null>(null);

  const isPT = language === 'PT';

  useEffect(() => {
      if (currentTeacher?.availability) {
          setSchedule(currentTeacher.availability);
      } else {
          // Default empty schedule if none exists
          const empty = DAYS.reduce((acc, day) => ({ ...acc, [day]: [] }), {});
          setSchedule(empty);
      }
  }, [currentTeacher]);

  const toggleSlot = (day: string, hour: number) => {
      setSchedule(prev => {
          const daySlots = prev[day] || [];
          if (daySlots.includes(hour)) {
              return { ...prev, [day]: daySlots.filter(h => h !== hour) };
          } else {
              return { ...prev, [day]: [...daySlots, hour].sort((a, b) => a - b) };
          }
      });
  };

  const handleSaveSchedule = () => {
      if (onUpdateAvailability) {
          onUpdateAvailability(schedule);
          alert(isPT ? "Agenda atualizada com sucesso!" : "Schedule updated successfully! Students can now book these slots.");
      }
  };

  // Google Docs Integration Handler
  const handleLinkGoogleDocs = async (studentId: string) => {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      setProcessingStudentId(studentId);
      try {
          // 1. Create Folder
          const folderRes = await initializeGoogleDriveFolder(student.name, currentTeacher?.name || 'Teacher');
          
          // 2. Create Notebook
          const docRes = await createStudentNotebook(folderRes.folderId, student.name, currentTeacher?.name || 'Teacher');

          // 3. Update Local State
          setStudents(prev => prev.map(s => {
              if (s.id === studentId) {
                  return {
                      ...s,
                      googleDocsIntegration: {
                          linkedFolderId: folderRes.folderId,
                          docUrl: docRes.docUrl,
                          lastSync: 'Just now'
                      }
                  };
              }
              return s;
          }));
      } catch (error) {
          console.error("Failed to link docs", error);
          alert("Failed to connect to Google Drive.");
      } finally {
          setProcessingStudentId(null);
      }
  };

  const openGenerator = (student: User) => {
      setSelectedStudent(student);
      setIsGeneratorOpen(true);
  };

  const averageRating = myReviews.length > 0 
    ? (myReviews.reduce((acc, r) => acc + r.rating, 0) / myReviews.length).toFixed(1)
    : '0.0';

  // --- Gamification Logic ---
  const reviewCount = currentTeacher?.reviewCount || myReviews.length;
  const ratingVal = Number(averageRating);

  let rank = 'Rookie';
  let commission = 30;
  let nextRank = 'Pro';
  let progress = 0;
  let requirements = '10 Reviews';

  if (reviewCount >= 100 && ratingVal >= 4.9) {
      rank = 'Legend';
      commission = 15;
      nextRank = 'Max Level';
      progress = 100;
      requirements = 'None';
  } else if (reviewCount >= 50 && ratingVal >= 4.8) {
      rank = 'Elite';
      commission = 20;
      nextRank = 'Legend';
      progress = (reviewCount - 50) / (100 - 50) * 100;
      requirements = '100 Reviews + 4.9 Rating';
  } else if (reviewCount >= 10) {
      rank = 'Pro';
      commission = 25;
      nextRank = 'Elite';
      progress = (reviewCount - 10) / (50 - 10) * 100;
      requirements = '50 Reviews + 4.8 Rating';
  } else {
      progress = (reviewCount / 10) * 100;
  }

  const getRankColor = (r: string) => {
      if (r === 'Legend') return 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]';
      if (r === 'Elite') return 'text-purple-400';
      if (r === 'Pro') return 'text-blue-400';
      return 'text-gray-400';
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{isPT ? 'Painel de Comando do Professor' : 'Teacher Command Center'}</h1>
          <p className="text-gray-400">{isPT ? 'Gerencie seu império,' : 'Manage your empire,'} {currentTeacher?.name || 'Teacher'}.</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0 overflow-x-auto pb-2 md:pb-0">
             <button onClick={() => setActiveTab('OVERVIEW')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'OVERVIEW' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}>{isPT ? 'Visão Geral' : 'Overview'}</button>
             <button onClick={() => setActiveTab('CLASSROOM')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'CLASSROOM' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}>{isPT ? 'Sala Inteligente' : 'Smart Classroom'}</button>
             <button onClick={() => setActiveTab('SCHEDULE')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'SCHEDULE' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}>{isPT ? 'Agenda' : 'Schedule'}</button>
             <button onClick={() => setActiveTab('COURSES')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'COURSES' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}>{isPT ? 'Meus Cursos' : 'My Courses'}</button>
             <button onClick={() => setActiveTab('FINANCIALS')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'FINANCIALS' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}>{isPT ? 'Financeiro' : 'Financials'}</button>
        </div>
      </div>

      {activeTab === 'OVERVIEW' && (
          <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
            
            {/* Gamification / Commission Card */}
            <div className="lg:col-span-3 bg-gradient-to-r from-gray-900 to-black border border-gray-800 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-full border-2 border-gray-700 flex items-center justify-center bg-gray-900 text-2xl font-bold ${getRankColor(rank)}`}>
                            {rank.charAt(0)}
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">{isPT ? 'Ranking Atual' : 'Current Rank'}</p>
                            <h2 className={`text-3xl font-bold font-orbitron ${getRankColor(rank)}`}>{rank}</h2>
                        </div>
                    </div>

                    <div className="flex-1 w-full md:px-8">
                         <div className="flex justify-between text-sm mb-2">
                             <span className="text-gray-400">{isPT ? 'Progresso para' : 'Progress to'} <span className="text-white font-bold">{nextRank}</span></span>
                             <span className="text-cyan-400 font-mono">{Math.floor(progress)}%</span>
                         </div>
                         <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out relative" style={{ width: `${progress}%` }}>
                                 <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                             </div>
                         </div>
                         <p className="text-xs text-gray-500 mt-2 text-center md:text-left">{isPT ? 'Próximo Benefício:' : 'Next Benefit:'} {requirements} {isPT ? 'para desbloquear' : 'to unlock'} <span className="text-green-400">{isPT ? 'taxa menor' : 'lower commission'}</span></p>
                    </div>

                    <div className="text-center bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                        <p className="text-gray-500 text-xs uppercase font-bold">{isPT ? 'Taxa da Plataforma' : 'Platform Fee'}</p>
                        <h3 className="text-2xl font-bold text-red-400">{commission}%</h3>
                    </div>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl relative overflow-hidden group cursor-pointer" onClick={() => setActiveTab('FINANCIALS')}>
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-16 h-16 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/></svg>
                    </div>
                    <p className="text-gray-500 text-sm uppercase font-bold">{isPT ? 'Receita Mensal' : 'Monthly Revenue'}</p>
                    <h3 className="text-3xl font-bold text-white mt-1">R$ 4.250,00</h3>
                    <span className="text-green-500 text-xs flex items-center gap-1 mt-2">↑ 12% {isPT ? 'vs mês passado' : 'vs last month'}</span>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <p className="text-gray-500 text-sm uppercase font-bold">{isPT ? 'Horas Ensinadas' : 'Hours Taught'}</p>
                    <h3 className="text-3xl font-bold text-white mt-1">32.5h</h3>
                    <span className="text-gray-500 text-xs mt-2">{isPT ? 'Meta: 40h' : 'Target: 40h'}</span>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <p className="text-gray-500 text-sm uppercase font-bold">{isPT ? 'Visualizações do Perfil' : 'Profile Views'}</p>
                    <h3 className="text-3xl font-bold text-white mt-1">1,204</h3>
                    <span className="text-cyan-500 text-xs flex items-center gap-1 mt-2">↑ {isPT ? 'Tráfego Alto' : 'High Traffic'}</span>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <p className="text-gray-500 text-sm uppercase font-bold">{isPT ? 'Avaliação' : 'Rating'}</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{averageRating}</h3>
                    <div className="flex text-yellow-500 text-xs mt-2">{'★'.repeat(Math.round(Number(averageRating)))}</div>
                </div>
            </div>
          </div>
      )}

      {activeTab === 'CLASSROOM' && (
          <div className="animate-fade-in">
              <div className="mb-8 flex justify-between items-center">
                  <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{isPT ? 'Sala de Aula Inteligente' : 'Smart Classroom'}</h2>
                      <p className="text-gray-400">{isPT ? 'Gerencie seus alunos e currículo impulsionado por IA.' : 'Manage your active students and AI-powered curriculum.'}</p>
                  </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {students.map(student => (
                      <div key={student.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col">
                          <div className="p-6 flex-1">
                              <div className="flex items-center gap-4 mb-4">
                                  <img src={student.avatarUrl} alt={student.name} className="w-14 h-14 rounded-full border-2 border-gray-700" />
                                  <div>
                                      <h3 className="font-bold text-white">{student.name}</h3>
                                      <div className="flex items-center gap-2 mt-1">
                                          <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400">{student.level}</span>
                                          <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded border border-purple-900/50">{student.goal}</span>
                                      </div>
                                  </div>
                              </div>

                              <div className="space-y-3">
                                  <div className="bg-black/40 rounded-lg p-3 border border-gray-800">
                                      <div className="flex justify-between items-center mb-2">
                                          <span className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1">
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                              Google Notebook
                                          </span>
                                          {student.googleDocsIntegration ? (
                                              <span className="text-[10px] text-green-400">● {isPT ? 'Ativo' : 'Active'}</span>
                                          ) : (
                                              <span className="text-[10px] text-gray-600">● {isPT ? 'Não Vinculado' : 'Not Linked'}</span>
                                          )}
                                      </div>
                                      
                                      {student.googleDocsIntegration ? (
                                          <div className="flex items-center justify-between">
                                              <span className="text-xs text-gray-400">{isPT ? 'Sinc:' : 'Last Sync:'} {student.googleDocsIntegration.lastSync}</span>
                                              <a href={student.googleDocsIntegration.docUrl} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                                                  {isPT ? 'Abrir Doc' : 'Open Doc'} ↗
                                              </a>
                                          </div>
                                      ) : (
                                          <button 
                                            onClick={() => handleLinkGoogleDocs(student.id)}
                                            disabled={processingStudentId === student.id}
                                            className="w-full text-xs bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 border border-blue-800 py-2 rounded transition-all"
                                          >
                                              {processingStudentId === student.id ? 'Connecting...' : (isPT ? 'Conectar Google Drive' : 'Connect Google Drive')}
                                          </button>
                                      )}
                                  </div>
                              </div>
                          </div>

                          <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex gap-2">
                              <button 
                                onClick={() => openGenerator(student)}
                                disabled={!student.googleDocsIntegration}
                                className="flex-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                              >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                  {isPT ? 'Gerar Lição' : 'Gen Lesson'}
                              </button>
                              <button className="px-3 py-2 border border-gray-700 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-all">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
      
      {activeTab === 'SCHEDULE' && (
          <div className="animate-fade-in bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h3 className="text-2xl font-bold text-white">{isPT ? 'Gerenciador de Disponibilidade' : 'Availability Manager'}</h3>
                      <p className="text-sm text-gray-400">{isPT ? 'Defina seus horários semanais. Alunos só podem agendar slots abertos.' : 'Set your recurring weekly hours. Students can only book open slots.'}</p>
                  </div>
                  <button 
                    onClick={handleSaveSchedule}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-900/20"
                  >
                      {isPT ? 'Salvar Agenda' : 'Save Schedule'}
                  </button>
              </div>

              <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                      <thead>
                          <tr>
                              <th className="p-2 border-b border-gray-800 text-left text-gray-500 text-sm w-20">{isPT ? 'Hora' : 'Time'}</th>
                              {DAYS.map(day => (
                                  <th key={day} className="p-2 border-b border-gray-800 text-center text-white font-bold min-w-[80px]">
                                      {day}
                                  </th>
                              ))}
                          </tr>
                      </thead>
                      <tbody>
                          {HOURS.map(hour => (
                              <tr key={hour} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                                  <td className="p-3 text-gray-400 text-xs font-mono">{hour}:00</td>
                                  {DAYS.map(day => {
                                      const isAvailable = schedule[day]?.includes(hour);
                                      return (
                                          <td key={`${day}-${hour}`} className="p-1">
                                              <button
                                                  onClick={() => toggleSlot(day, hour)}
                                                  className={`w-full h-10 rounded-lg text-xs font-bold transition-all ${
                                                      isAvailable
                                                      ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(8,145,178,0.4)]' 
                                                      : 'bg-gray-800/50 text-gray-600 hover:bg-gray-700'
                                                  }`}
                                              >
                                                  {isAvailable ? (isPT ? 'LIVRE' : 'OPEN') : '-'}
                                              </button>
                                          </td>
                                      );
                                  })}
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                  {isPT ? 'Nota: Mudanças afetam apenas novos agendamentos.' : 'Note: Changes affect future bookings only. Existing confirmed bookings remain unchanged.'}
              </p>
          </div>
      )}

      {activeTab === 'COURSES' && (
          <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold text-white">{isPT ? 'Minha Biblioteca' : 'My Library'}</h2>
                   <button onClick={onCreateCourse} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-500">{isPT ? 'Criar Novo' : 'Create New'}</button>
              </div>

              {myCourses.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myCourses.map(course => (
                          <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all">
                                <div className="h-40 overflow-hidden relative">
                                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">{isPT ? 'Publicado' : 'Published'}</div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-white mb-1">{course.title}</h3>
                                    <p className="text-sm text-gray-400 mb-3">{course.modules} {isPT ? 'Módulos' : 'Modules'} • {course.duration}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-purple-400">R$ {course.price}</span>
                                        <button className="text-xs text-gray-500 hover:text-white">{isPT ? 'Editar' : 'Edit'}</button>
                                    </div>
                                </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center h-64 border border-gray-800 border-dashed rounded-2xl bg-gray-900/30">
                      <p className="text-gray-500 mb-4">{isPT ? 'Você ainda não criou nenhum curso.' : "You haven't created any courses yet."}</p>
                      <button onClick={onCreateCourse} className="text-purple-400 hover:text-white font-bold">{isPT ? 'Comece seu primeiro curso' : 'Start your first course'}</button>
                  </div>
              )}
          </div>
      )}

      {activeTab === 'FINANCIALS' && <FinancialDashboard language={language} />}

      {/* Lesson Generator Modal */}
      {isGeneratorOpen && selectedStudent && selectedStudent.googleDocsIntegration && (
          <LessonGenerator 
              studentName={selectedStudent.name}
              studentLevel={selectedStudent.level || 'Intermediate'}
              studentGoal={selectedStudent.goal || 'General'}
              docId={selectedStudent.googleDocsIntegration.linkedFolderId} // Simplified mock ID usage
              onClose={() => setIsGeneratorOpen(false)}
              onSuccess={() => setIsGeneratorOpen(false)}
          />
      )}
    </div>
  );
};
