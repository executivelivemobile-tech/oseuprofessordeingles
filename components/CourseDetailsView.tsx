
import React, { useState } from 'react';
import { Course } from '../types';

interface CourseDetailsViewProps {
  course: Course;
  isOwned: boolean;
  onBuy: () => void;
  onResume: () => void;
  onNavigateInstructor: (id: string) => void;
  language: 'EN' | 'PT';
}

export const CourseDetailsView: React.FC<CourseDetailsViewProps> = ({ 
  course, 
  isOwned, 
  onBuy, 
  onResume,
  onNavigateInstructor,
  language
}) => {
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const isPT = language === 'PT';

  return (
      <div className="min-h-screen bg-black">
          {/* Hero Header */}
          <div className="relative h-[60vh] w-full flex items-end pb-12">
              <div className="absolute inset-0 overflow-hidden">
                  <img src={course.thumbnailUrl} className="w-full h-full object-cover blur-sm opacity-50" alt="bg" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
              </div>
              
              <div className="relative max-w-7xl mx-auto px-4 w-full flex flex-col md:flex-row gap-8 items-end">
                  <div className="flex-1 animate-slide-up">
                      <div className="flex items-center gap-2 mb-4">
                           <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider shadow-lg shadow-purple-900/50">{course.category}</span>
                           <span className="bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">{course.level}</span>
                      </div>
                      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{course.title}</h1>
                      <div className="flex flex-wrap items-center gap-6 text-gray-300">
                          <button 
                            onClick={() => onNavigateInstructor(course.instructorId)}
                            className="flex items-center gap-2 hover:text-white transition-colors group"
                          >
                              <img src={`https://picsum.photos/seed/${course.instructorId}/50/50`} className="w-10 h-10 rounded-full border-2 border-purple-500 group-hover:scale-110 transition-transform" alt={course.instructorName} />
                              <span className="font-bold underline decoration-purple-500/50 underline-offset-4 group-hover:decoration-purple-500">{course.instructorName}</span>
                          </button>
                          <div className="flex items-center gap-2">
                             <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                             <span>{course.modules} {isPT ? 'Módulos' : 'Modules'}</span>
                          </div>
                          <div className="flex text-yellow-500 text-sm gap-1">
                              ★★★★★ <span className="text-gray-500 ml-1">(42)</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-12 relative">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                  <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-8">
                      <h3 className="text-2xl font-bold text-white mb-4">{isPT ? 'Sobre este curso' : 'About this course'}</h3>
                      <p className="text-gray-300 leading-relaxed text-lg">{course.description}</p>
                      
                      <div className="mt-8 grid grid-cols-2 gap-4">
                          {course.features?.map((feat, i) => (
                              <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                                  <div className="bg-green-900/30 p-1 rounded-full">
                                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                  </div>
                                  {feat}
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Syllabus */}
                  <div>
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                          {isPT ? 'Conteúdo do Curso' : 'Course Curriculum'}
                          <span className="text-sm font-normal text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-800">{course.modules} {isPT ? 'Seções' : 'Sections'}</span>
                      </h3>
                      <div className="space-y-4">
                          {course.syllabus?.map((module, idx) => (
                              <div key={idx} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900/20">
                                  <button 
                                    onClick={() => setExpandedModule(expandedModule === idx ? null : idx)}
                                    className="w-full p-5 flex justify-between items-center hover:bg-gray-800/50 transition-colors"
                                  >
                                      <div className="text-left">
                                          <h4 className="font-bold text-white text-lg">{isPT ? 'Módulo' : 'Module'} {idx + 1}: {module.title}</h4>
                                          <p className="text-xs text-gray-500 mt-1">{module.lessons.length} {isPT ? 'Aulas' : 'Lessons'} • {module.duration}</p>
                                      </div>
                                      <svg className={`w-6 h-6 text-gray-500 transition-transform ${expandedModule === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                  </button>
                                  
                                  {expandedModule === idx && (
                                      <div className="border-t border-gray-800 bg-black/40 p-2">
                                          <ul className="space-y-1">
                                              {module.lessons.map((lesson, lIdx) => (
                                                  <li key={lIdx} className="flex items-center gap-4 text-gray-400 text-sm p-3 hover:bg-white/5 rounded-lg transition-colors group">
                                                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-purple-900/50 group-hover:text-purple-400 transition-colors">
                                                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                                      </div>
                                                      <span className="group-hover:text-white transition-colors">{lesson}</span>
                                                      <span className="ml-auto text-xs text-gray-600 border border-gray-700 px-2 py-0.5 rounded group-hover:border-gray-500">{isPT ? 'Prévia' : 'Preview'}</span>
                                                  </li>
                                              ))}
                                          </ul>
                                      </div>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* Sidebar Purchase Card */}
              <div className="lg:col-span-1">
                  <div className="sticky top-24 bg-gray-900/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-6 border border-gray-700 group cursor-pointer">
                          <img src={course.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="preview" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                              </div>
                          </div>
                      </div>

                      <div className="mb-6 pb-6 border-b border-gray-800">
                          <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">{isPT ? 'Pagamento Único' : 'One-time payment'}</span>
                          <div className="flex items-end gap-2 mt-2">
                             <h2 className="text-5xl font-bold text-white">R$ {course.price}</h2>
                             <span className="text-purple-400 font-bold mb-2">BRL</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-through">R$ {(course.price * 1.6).toFixed(0)} (40% OFF)</p>
                      </div>
                      
                      {!isOwned ? (
                          <button 
                            onClick={onBuy}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/40 mb-4 text-lg"
                          >
                              {isPT ? 'Comprar Agora' : 'Buy Now'}
                          </button>
                      ) : (
                          <button 
                            onClick={onResume}
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg mb-4 flex items-center justify-center gap-2 text-lg"
                          >
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> 
                              {isPT ? 'Continuar Estudando' : 'Resume Learning'}
                          </button>
                      )}

                      <p className="text-center text-xs text-gray-500 mb-6">{isPT ? 'Garantia de 30 dias de reembolso' : '30-Day Money-Back Guarantee'}</p>

                      <div className="space-y-4">
                          <h4 className="font-bold text-white text-sm">{isPT ? 'Este curso inclui:' : 'This course includes:'}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {course.duration} {isPT ? 'de vídeo sob demanda' : 'on-demand video'}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                {isPT ? 'Acesso no celular e TV' : 'Access on Mobile and TV'}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {isPT ? 'Certificado de Conclusão' : 'Certificate of Completion'}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};
