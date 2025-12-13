
import React, { useState, useEffect, useMemo } from 'react';
import { Teacher, TimeSlot } from '../types';

interface BookingModalProps {
  teacher: Teacher;
  onClose: () => void;
  onConfirm: (bookingDetails: any) => void;
  language?: 'EN' | 'PT';
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const BookingModal: React.FC<BookingModalProps> = ({ teacher, onClose, onConfirm, language = 'EN' }) => {
  const [step, setStep] = useState<'SCHEDULE' | 'PAYMENT' | 'PROCESSING' | 'SUCCESS'>('SCHEDULE');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CC' | 'PIX'>('CC');
  const isPT = language === 'PT';

  // Generate next 7 days
  const dates = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  }), []);

  // Dynamic slots based on teacher availability
  const availableSlots = useMemo(() => {
      const dayName = DAYS[selectedDate.getDay()];
      // Default to empty if teacher has no specific schedule set
      const availableHours = teacher.availability ? (teacher.availability[dayName] || []) : [];
      
      return availableHours.map(hour => ({
          id: `${dayName}-${hour}`,
          time: `${hour.toString().padStart(2, '0')}:00`,
          available: true
      }));
  }, [selectedDate, teacher]);

  const handlePay = () => {
    setStep('PROCESSING');
    setTimeout(() => {
        setStep('SUCCESS');
    }, 2000);
  };

  const getCalendarUrl = () => {
      if (!selectedSlot) return '#';
      
      const startTime = new Date(selectedDate);
      const [hours] = selectedSlot.split(':');
      startTime.setHours(parseInt(hours), 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1);

      const toISO = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`English Class with ${teacher.name}`)}&dates=${toISO(startTime)}/${toISO(endTime)}&details=${encodeURIComponent(`Class on O Seu Professor Platform.\nLink: https://meet.oseuprofessordeingles.com/room/${teacher.id}`)}&location=Online`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-gray-900 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(8,145,178,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 flex justify-between items-center">
            <div>
                <h3 className="text-xl font-bold text-white font-orbitron">{isPT ? 'AGENDAR SESSÃO' : 'BOOK SESSION'}</h3>
                <p className="text-sm text-cyan-400">{isPT ? 'com' : 'with'} {teacher.name}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
            
            {step === 'SCHEDULE' && (
                <div className="space-y-6 animate-slide-up">
                    {/* Date Selector */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">{isPT ? 'Selecione a Data' : 'Select Date'}</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {dates.map((date) => {
                                const isSelected = date.toDateString() === selectedDate.toDateString();
                                return (
                                    <button
                                        key={date.toISOString()}
                                        onClick={() => {
                                            setSelectedDate(date);
                                            setSelectedSlot(null); // Reset slot when date changes
                                        }}
                                        className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center border transition-all ${
                                            isSelected 
                                            ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]' 
                                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                                        }`}
                                    >
                                        <span className="text-xs uppercase font-bold">{isPT ? DIAS[date.getDay()] : DAYS[date.getDay()]}</span>
                                        <span className="text-xl font-bold">{date.getDate()}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Time Slots */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">{isPT ? 'Horários Disponíveis (BRT)' : 'Available Slots (GMT-3)'}</label>
                        {availableSlots.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3">
                                {availableSlots.map((slot) => (
                                    <button
                                        key={slot.id}
                                        onClick={() => setSelectedSlot(slot.time)}
                                        className={`py-3 rounded-lg text-sm font-bold border transition-all ${
                                            selectedSlot === slot.time
                                                ? 'bg-cyan-900/50 border-cyan-400 text-cyan-400 shadow-[inset_0_0_10px_rgba(34,211,238,0.2)]'
                                                : 'bg-gray-800 border-gray-700 text-white hover:border-gray-500 hover:bg-gray-700'
                                        }`}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        ) : (
                             <div className="bg-gray-800/50 p-6 rounded-xl border border-dashed border-gray-700 text-center text-gray-500">
                                 {isPT ? 'Sem horários disponíveis para este dia.' : 'No slots available for this day.'}
                             </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex justify-between items-center mt-4">
                        <div>
                            <p className="text-xs text-gray-400">{isPT ? 'Valor Total' : 'Total Price'}</p>
                            <p className="text-xl font-bold text-white">R$ {teacher.hourlyRate},00</p>
                        </div>
                        <button 
                            disabled={!selectedSlot}
                            onClick={() => setStep('PAYMENT')}
                            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-6 py-2 rounded-lg font-bold transition-all"
                        >
                            {isPT ? 'Continuar' : 'Continue'}
                        </button>
                    </div>
                </div>
            )}

            {step === 'PAYMENT' && (
                <div className="space-y-6 animate-slide-up">
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400">{isPT ? 'Professor' : 'Teacher'}</span>
                            <span className="text-white font-bold">{teacher.name}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400">{isPT ? 'Data' : 'Date'}</span>
                            <span className="text-white">{selectedDate.toLocaleDateString()} at {selectedSlot}</span>
                        </div>
                        <div className="border-t border-gray-700 my-2 pt-2 flex justify-between">
                            <span className="text-cyan-400">Total</span>
                            <span className="text-cyan-400 font-bold text-lg">R$ {teacher.hourlyRate},00</span>
                        </div>
                    </div>

                    <div>
                         <label className="block text-sm text-gray-400 mb-3">{isPT ? 'Forma de Pagamento' : 'Payment Method'}</label>
                         <div className="grid grid-cols-2 gap-4">
                             <button 
                                onClick={() => setPaymentMethod('CC')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${paymentMethod === 'CC' ? 'bg-cyan-900/20 border-cyan-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                             >
                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                 {isPT ? 'Cartão' : 'Credit Card'}
                             </button>
                             <button 
                                onClick={() => setPaymentMethod('PIX')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${paymentMethod === 'PIX' ? 'bg-cyan-900/20 border-cyan-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                             >
                                 <div className="w-6 h-6 border-2 border-current rounded rotate-45 flex items-center justify-center"><div className="w-1 h-1 bg-current rounded-full"></div></div>
                                 PIX
                             </button>
                         </div>
                    </div>

                    <button 
                        onClick={handlePay}
                        className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all"
                    >
                        {isPT ? 'Confirmar Pagamento' : 'Confirm Payment'}
                    </button>
                    <button onClick={() => setStep('SCHEDULE')} className="w-full text-gray-500 hover:text-white py-2 text-sm">{isPT ? 'Voltar' : 'Go Back'}</button>
                </div>
            )}

            {step === 'PROCESSING' && (
                <div className="flex flex-col items-center justify-center py-10 animate-pulse">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <h3 className="text-xl font-bold text-white mb-2">{isPT ? 'Processando Pagamento Seguro' : 'Processing Secure Payment'}</h3>
                    <p className="text-gray-400">{isPT ? 'Verificando transação...' : 'Verifying transaction details...'}</p>
                </div>
            )}

            {step === 'SUCCESS' && (
                <div className="flex flex-col items-center justify-center py-6 text-center animate-scale-in">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                        <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{isPT ? 'Agendamento Confirmado!' : 'Booking Confirmed!'}</h3>
                    <p className="text-gray-400 mb-6 max-w-xs mx-auto">
                        {isPT ? 'Você tem uma aula com' : 'You are scheduled with'} <span className="text-cyan-400">{teacher.name}</span> <br/>
                        <span className="text-white">{selectedDate.toLocaleDateString()} {isPT ? 'às' : 'at'} {selectedSlot}</span>
                    </p>
                    
                    <div className="w-full bg-gray-800 p-4 rounded-xl mb-4 text-left border border-gray-700">
                        <p className="text-xs text-gray-500 uppercase mb-1">{isPT ? 'Link da Reunião' : 'Meeting Link'}</p>
                        <p className="text-cyan-400 text-sm truncate">https://meet.oseuprofessordeingles.com/room/{teacher.id}-xyz</p>
                    </div>

                    {/* Calendar Integrations */}
                    <div className="flex gap-2 w-full mb-6">
                        <a 
                            href={getCalendarUrl()} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex-1 bg-white hover:bg-gray-200 text-black py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Add to Google Cal
                        </a>
                        <button 
                            className="flex-1 border border-gray-700 hover:bg-gray-800 text-gray-300 py-2 rounded-lg text-xs font-bold"
                            onClick={() => alert("ICS file download would start here.")}
                        >
                            Download .ics
                        </button>
                    </div>

                    <button 
                        onClick={() => {
                            onConfirm({
                                teacherId: teacher.id,
                                date: selectedDate,
                                slot: selectedSlot
                            });
                        }}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold"
                    >
                        {isPT ? 'Ir para o Painel' : 'Go to Dashboard'}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
