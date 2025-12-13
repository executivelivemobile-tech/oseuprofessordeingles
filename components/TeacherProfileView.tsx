
import React, { useMemo, useState } from 'react';
import { Teacher } from '../types';
import { TeacherCard, VerifiedBadge } from './Cards';

interface TeacherProfileViewProps {
  teacher: Teacher;
  similarTeachers: Teacher[];
  onBook: () => void;
  onNavigateTeacher: (id: string) => void;
  onBack: () => void;
  language: 'EN' | 'PT';
}

const ElitePackageCard: React.FC<{ teacher: Teacher; onBook: () => void; language: 'EN' | 'PT' }> = ({ teacher, onBook, language }) => {
    // State for selected duration
    const [duration, setDuration] = useState<3 | 6 | 12>(6);

    // --- NEW MARKETING LOGIC: PROGRESSIVE DISCOUNTS ---
    const packageStats = useMemo(() => {
        let totalSlots, discountPercent, label, subLabel, bonuses, margin;
        const isPT = language === 'PT';

        switch (duration) {
            case 3: // QUARTERLY
                totalSlots = 24; // 3 months * 8 classes
                discountPercent = 0.05; // 5% OFF
                margin = 3; 
                label = isPT ? "Sprint Trimestral" : "Quarterly Sprint";
                subLabel = isPT ? "Evolução Rápida" : "Quick level up";
                bonuses = [
                    isPT ? "24 Aulas Reservadas 1:1" : "24 Reserved 1:1 Slots",
                    isPT ? "3 Cancelamentos Flexíveis" : "3 Flexible Cancellations",
                    isPT ? "Suporte via WhatsApp" : "WhatsApp Support"
                ];
                break;
            case 12: // ANNUAL
                totalSlots = 96; // 12 months * 8 classes
                discountPercent = 0.30; // 30% OFF (Massive Value)
                margin = 16;
                label = isPT ? "Academia Anual" : "Yearly Academy";
                subLabel = isPT ? "Domínio Nativo" : "Native Mastery Path";
                bonuses = [
                    isPT ? "96 Aulas Reservadas 1:1" : "96 Reserved 1:1 Slots",
                    isPT ? "16 Cancelamentos Flexíveis" : "16 Flexible Cancellations",
                    isPT ? "Roteiro Completo + IA" : "Full Roadmap + AI Suite",
                    isPT ? "Certificado Oficial de Proficiência" : "Official Proficiency Certificate",
                    isPT ? "Suporte Prioritário VIP" : "VIP Priority Support"
                ];
                break;
            case 6: // SEMESTER (Default)
            default:
                totalSlots = 48; // 6 months * 8 classes
                discountPercent = 0.15; // 15% OFF
                margin = 6;
                label = isPT ? "Programa Semestral" : "Semester Program";
                subLabel = isPT ? "Do zero à fluência" : "From stuck to fluent";
                bonuses = [
                    isPT ? "48 Aulas Reservadas 1:1" : "48 Reserved 1:1 Slots",
                    isPT ? "6 Cancelamentos Flexíveis" : "6 Flexible Cancellations",
                    isPT ? "Roteiro Personalizado + IA" : "Personalized Roadmap + AI",
                    isPT ? "Acesso Direto ao WhatsApp" : "Direct WhatsApp Access"
                ];
                break;
        }

        // Calculation
        const standardTotalValue = teacher.hourlyRate * totalSlots; // What it would cost buying 1 by 1
        const finalPackagePrice = standardTotalValue * (1 - discountPercent);
        const savings = standardTotalValue - finalPackagePrice;
        
        // Per Class Math
        const pricePerClass = finalPackagePrice / totalSlots;

        return {
            totalSlots,
            margin,
            label,
            subLabel,
            bonuses,
            discountLabel: `${(discountPercent * 100).toFixed(0)}% OFF`,
            standardTotalValue: Math.ceil(standardTotalValue),
            grossPrice: Math.ceil(finalPackagePrice / 10) * 10, // Round to nice number
            installmentPrice: Math.ceil((finalPackagePrice * 1.10) / 12), // 12x with 10% interest factor
            savings: Math.ceil(savings),
            pricePerClass: Math.floor(pricePerClass),
            standardRate: teacher.hourlyRate,
            classLabel: isPT ? "Aulas" : "Classes",
            saveLabel: isPT ? "Economize" : "Save",
            perClassLabel: isPT ? "/aula" : "/class",
            dealButtonLabel: isPT ? `Garantir Oferta de ${duration} Meses` : `Secure ${duration}-Month Deal`
        };
    }, [teacher.hourlyRate, duration, language]);

    return (
        <div className={`bg-gradient-to-br from-gray-900 to-black border rounded-3xl p-1 relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)] mb-6 group transition-all duration-500 ${
            duration === 6 ? 'border-yellow-600/50 shadow-[0_0_30px_rgba(234,179,8,0.15)]' : 
            duration === 12 ? 'border-cyan-600/50 shadow-[0_0_30px_rgba(8,145,178,0.15)]' : 
            'border-gray-700'
        }`}>
            {/* Discount Banner */}
            <div className={`absolute top-4 right-0 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest transform rotate-0 shadow-lg z-20 ${
                duration === 6 ? 'bg-red-600' : duration === 12 ? 'bg-cyan-600' : 'bg-gray-700'
            }`}>
                {packageStats.discountLabel}
            </div>
            
            <div className="bg-gray-900/95 rounded-[22px] p-6 relative z-10 h-full flex flex-col">
                
                {/* Duration Toggles */}
                <div className="flex bg-black/40 p-1 rounded-xl mb-6 border border-gray-800 relative">
                    <button 
                        onClick={() => setDuration(3)}
                        className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${duration === 3 ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        3 Mo
                    </button>
                    <button 
                        onClick={() => setDuration(6)}
                        className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${duration === 6 ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        6 Mo
                    </button>
                    <button 
                        onClick={() => setDuration(12)}
                        className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${duration === 12 ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        1 {language === 'PT' ? 'Ano' : 'Year'}
                    </button>
                </div>

                {/* PRICING HERO - Moved to Top */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-4xl font-bold text-white tracking-tight">R$ {packageStats.grossPrice}</span>
                    </div>
                    <div className="flex justify-center items-center gap-2 mt-2">
                         <span className="bg-green-900/30 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-800 uppercase">
                            {packageStats.saveLabel} R$ {packageStats.savings}
                        </span>
                        <span className="text-gray-500 text-xs line-through">R$ {packageStats.standardTotalValue}</span>
                    </div>
                     <p className="text-gray-400 text-xs mt-2">
                        {language === 'PT' ? 'Ou 12x de' : 'Or 12x'} <span className="text-white font-bold">R$ {packageStats.installmentPrice}</span>
                    </p>
                </div>

                {/* Package Core Stats Row */}
                <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/50 mb-6 flex justify-between items-center">
                    <div className="text-left">
                        <span className="block text-white font-bold text-lg">{packageStats.totalSlots} {packageStats.classLabel}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{packageStats.label}</span>
                    </div>
                    <div className="h-8 w-px bg-gray-700"></div>
                    <div className="text-right">
                        <span className="block text-green-400 font-bold text-lg">R$ {packageStats.pricePerClass}<span className="text-xs text-gray-500 font-normal">{packageStats.perClassLabel}</span></span>
                        <span className="text-[10px] text-gray-500 line-through">R$ {packageStats.standardRate}</span>
                    </div>
                </div>

                {/* Value Stack */}
                <div className="space-y-3 mb-6 flex-1 border-t border-gray-800 pt-4">
                    {packageStats.bonuses.map((bonus, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <div className="mt-1 bg-cyan-900/20 p-1 rounded-full text-cyan-400">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <p className="text-sm text-gray-300 font-medium">{bonus}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="space-y-3">
                    <button 
                        onClick={onBook}
                        className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] text-sm uppercase tracking-wider ${
                            duration === 6 ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black shadow-yellow-900/20' :
                            duration === 12 ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-cyan-900/20' :
                            'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                    >
                        {packageStats.dealButtonLabel}
                    </button>
                    <p className="text-center text-[10px] text-gray-500 leading-tight">
                        {language === 'PT' 
                            ? `*Inclui ${packageStats.margin} cancelamentos flexíveis. Garantia de reembolso de 30 dias.` 
                            : `*Includes ${packageStats.margin} flexible cancellations. 30-Day Money-Back Guarantee.`}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const TeacherProfileView: React.FC<TeacherProfileViewProps> = ({ 
  teacher, 
  similarTeachers, 
  onBook, 
  onNavigateTeacher,
  onBack,
  language
}) => {
  const isPT = language === 'PT';

  return (
    <div className="min-h-screen pt-24 px-4 max-w-6xl mx-auto pb-20 animate-fade-in">
        <button onClick={onBack} className="text-gray-500 hover:text-white mb-6 flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {isPT ? 'Voltar para busca' : 'Back to search'}
        </button>

        <div className="grid lg:grid-cols-3 gap-8 relative">
            
            {/* Left Content Column */}
            <div className="lg:col-span-2 space-y-8">
                {/* Header Card */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-visible">
                     {/* Background blur effect */}
                     <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-900/20 to-transparent rounded-t-3xl"></div>
                     
                     <div className="relative z-10 shrink-0">
                        <div className="relative inline-block">
                            <img src={teacher.photoUrl} className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-800 object-cover shadow-2xl" alt={teacher.name} />
                            {teacher.verified && (
                                <div className="absolute bottom-0 right-0 z-20" title="Verified Pro">
                                    <VerifiedBadge size="lg" />
                                </div>
                            )}
                        </div>
                     </div>

                     <div className="flex-1 text-center md:text-left relative z-10">
                         <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{teacher.name}</h1>
                         <p className="text-cyan-400 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                             {teacher.location}
                         </p>
                         <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                             {teacher.niche.map(n => (
                                 <span key={n} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-bold border border-gray-700">{n}</span>
                             ))}
                         </div>
                         <p className="text-gray-300 leading-relaxed max-w-2xl">
                             {teacher.bio}
                         </p>
                     </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 text-center">
                        <div className="text-yellow-500 font-bold text-xl mb-1 flex items-center justify-center gap-1">
                            {teacher.rating} <span className="text-sm">★</span>
                        </div>
                        <div className="text-xs text-gray-500 uppercase font-bold">{isPT ? 'Nota' : 'Rating'}</div>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 text-center">
                        <div className="text-white font-bold text-xl mb-1">{teacher.reviewCount}</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">{isPT ? 'Avaliações' : 'Reviews'}</div>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 text-center">
                        <div className="text-green-400 font-bold text-xl mb-1">100%</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">{isPT ? 'Taxa de Resp.' : 'Response Rate'}</div>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 text-center">
                        <div className="text-purple-400 font-bold text-xl mb-1">350+</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">{isPT ? 'Alunos' : 'Students'}</div>
                    </div>
                </div>

                {/* Video */}
                {teacher.introVideoUrl && (
                    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                             <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                             {isPT ? 'Apresentação em Vídeo' : 'Video Introduction'}
                        </h3>
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                        <video 
                            controls 
                            className="w-full h-full object-cover"
                            poster={teacher.photoUrl}
                        >
                            <source src={teacher.introVideoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        </div>
                    </div>
                )}

                {/* Reviews */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">{isPT ? 'Comentários de Alunos' : 'Student Reviews'}</h3>
                    <div className="space-y-6">
                        {teacher.reviews && teacher.reviews.length > 0 ? (
                            teacher.reviews.map((review, idx) => (
                                <div key={idx} className="border-b border-gray-800 pb-6 last:border-0 last:pb-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                                                {review.studentName.charAt(0)}
                                            </div>
                                            <span className="font-bold text-white text-sm">{review.studentName}</span>
                                        </div>
                                        <div className="flex text-yellow-500 text-xs">{'★'.repeat(review.rating)}</div>
                                    </div>
                                    <p className="text-gray-300 text-sm italic pl-11">"{review.comment}"</p>
                                    <span className="text-gray-600 text-xs mt-2 block pl-11">{review.date}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">{isPT ? 'Ainda sem avaliações.' : 'No reviews yet.'}</p>
                        )}
                    </div>
                </div>

                {/* Similar Teachers (Cross Sell) */}
                {similarTeachers.length > 0 && (
                     <div>
                         <h3 className="text-xl font-bold text-white mb-6 mt-10">{isPT ? 'Professores Similares' : 'Similar Teachers'}</h3>
                         <div className="grid md:grid-cols-2 gap-4">
                             {similarTeachers.slice(0, 2).map(t => (
                                 <TeacherCard 
                                    key={t.id} 
                                    teacher={t} 
                                    isFavorite={false} 
                                    onToggleFavorite={() => {}} 
                                    onClick={() => onNavigateTeacher(t.id)} 
                                 />
                             ))}
                         </div>
                     </div>
                )}
            </div>

            {/* Right Sticky Sidebar (Booking) */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                    
                    {/* NEW: Elite Package Card */}
                    <ElitePackageCard teacher={teacher} onBook={onBook} language={language} />

                    {/* Standard Booking Card */}
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl shadow-cyan-900/10">
                        <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-6">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">{isPT ? 'Valor Avulso' : 'Standard Rate'}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-white">R$ {teacher.hourlyRate}</span>
                                    <span className="text-gray-500 text-sm">/ 50m</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="bg-green-900/30 text-green-400 text-xs font-bold px-2 py-1 rounded border border-green-800">
                                    {isPT ? 'Disponível' : 'Available'}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {isPT ? 'Aula de vídeo 1:1 de 50min' : '50-minute 1:1 video lesson'}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                {isPT ? 'Pagamento Seguro (PIX / Cartão)' : 'Secure Payment (PIX / Card)'}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {isPT ? 'Satisfação Garantida' : 'Satisfaction Guaranteed'}
                            </div>
                        </div>

                        <button 
                            onClick={onBook}
                            className="w-full bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-400 border border-cyan-800 font-bold py-4 rounded-xl transition-all mb-3 text-sm"
                        >
                            {isPT ? 'Agendar Aula Avulsa' : 'Book Single Lesson'}
                        </button>
                        <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all border border-gray-700 text-sm">
                            {isPT ? 'Enviar Mensagem' : 'Message Teacher'}
                        </button>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 text-center">
                        <p className="text-xs text-gray-400 mb-2">{isPT ? 'Compartilhar perfil' : 'Share this profile'}</p>
                        <div className="flex justify-center gap-4">
                            <button className="text-gray-500 hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></button>
                            <button className="text-gray-500 hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></button>
                            <button className="text-gray-500 hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.843 13.739c-1.237-.165-1.722-.843-1.77-1.572 0 0 .235-1.921-.77-3.77-.333-.615-.818-1.077-1.432-1.341.312-2.106 1.488-3.088 2.508-3.088 1.968 0 3.036 2.074 3.036 4.717 0 .899-.247 2.074-1.572 5.054zm-9.686 0c-1.325-2.98-1.572-4.155-1.572-5.054 0-2.643 1.068-4.717 3.036-4.717 1.02 0 2.196.982 2.508 3.088-.614.264-1.099.726-1.432 1.341-1.005 1.849-.77 3.77-.77 3.77-.048.729-.533 1.407-1.77 1.572zm12.394 1.785c-.967-.327-2.179-.176-2.541.67-.361.846-1.737 1.583-4.01 1.583-2.273 0-3.649-.737-4.01-1.583-.362-.846-1.574-.997-2.541-.67-2.459.832-2.887 3.238-2.316 5.568.614 2.504 3.526 2.907 8.867 2.907 5.341 0 8.253-.403 8.867-2.907.571-2.33-.143-4.736-2.316-5.568z"/></svg></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
