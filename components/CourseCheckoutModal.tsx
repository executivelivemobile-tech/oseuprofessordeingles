
import React, { useState, useEffect } from 'react';
import { Course } from '../types';

interface CourseCheckoutModalProps {
  course: Course;
  onClose: () => void;
  onConfirm: () => void;
  language?: 'EN' | 'PT';
}

export const CourseCheckoutModal: React.FC<CourseCheckoutModalProps> = ({ course, onClose, onConfirm, language = 'EN' }) => {
  const [step, setStep] = useState<'PAYMENT' | 'PROCESSING' | 'SUCCESS'>('PAYMENT');
  const [method, setMethod] = useState<'CC' | 'PIX'>('CC');
  const [pixTimeLeft, setPixTimeLeft] = useState(600); // 10 minutes
  const [pixCopied, setPixCopied] = useState(false); // Feedback state
  const isPT = language === 'PT';

  // PIX Timer
  useEffect(() => {
    if (method === 'PIX' && step === 'PAYMENT') {
        const timer = setInterval(() => {
            setPixTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }
  }, [method, step]);

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePay = () => {
      setStep('PROCESSING');
      // Simulate API latency
      setTimeout(() => {
          setStep('SUCCESS');
      }, 2500);
  };

  const handleCopyPix = () => {
      const payload = `00020126580014BR.GOV.BCB.PIX0136${course.id}5204000053039865802BR5925O Seu Professor de Ingles6009Sao Paulo62070503***6304`;
      navigator.clipboard.writeText(payload);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh]">
        
        {/* Left Col: Order Summary */}
        <div className="w-full md:w-5/12 bg-gray-800/50 p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-gray-700">
            <h3 className="text-gray-400 text-xs uppercase font-bold mb-6 tracking-widest">{isPT ? 'Resumo do Pedido' : 'Order Summary'}</h3>
            
            <div className="flex-1">
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shadow-lg">
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3">
                        <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">{course.category}</span>
                    </div>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-2 leading-tight">{course.title}</h2>
                <p className="text-sm text-gray-400 mb-4">{isPT ? 'Instrutor' : 'Instructor'}: {course.instructorName}</p>
                
                <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {isPT ? 'Acesso Vitalício' : 'Full Lifetime Access'}
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {isPT ? 'Certificado de Conclusão' : 'Certificate of Completion'}
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {course.modules} {isPT ? 'Módulos' : 'Modules'} / {course.duration}
                    </li>
                </ul>
            </div>

            <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">{isPT ? 'Preço Original' : 'Original Price'}</span>
                    <span className="text-gray-500 line-through">R$ {(course.price * 1.5).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-2xl font-bold text-cyan-400">R$ {course.price},00</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-black/20 py-2 rounded">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    {isPT ? 'Pagamento Seguro SSL 256-bit' : 'Secure 256-bit SSL Encrypted Payment'}
                </div>
            </div>
        </div>

        {/* Right Col: Payment Form */}
        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {step === 'PAYMENT' && (
                <div className="animate-slide-up h-full flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-6 font-orbitron">{isPT ? 'Detalhes do Pagamento' : 'Checkout Details'}</h3>
                    
                    {/* Method Selector */}
                    <div className="flex bg-gray-800 p-1 rounded-xl mb-6">
                        <button 
                            onClick={() => setMethod('CC')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${method === 'CC' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            {isPT ? 'Cartão de Crédito' : 'Credit Card'}
                        </button>
                        <button 
                            onClick={() => setMethod('PIX')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${method === 'PIX' ? 'bg-cyan-900/50 text-cyan-400 shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <div className="w-4 h-4 border-2 border-current rounded rotate-45"></div>
                            {isPT ? 'PIX (Instantâneo)' : 'PIX (Instant)'}
                        </button>
                    </div>

                    {/* Credit Card Form */}
                    {method === 'CC' && (
                        <div className="space-y-4 flex-1">
                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">{isPT ? 'Número do Cartão' : 'Card Number'}</label>
                                <div className="relative">
                                    <input className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none font-mono" placeholder="0000 0000 0000 0000" />
                                    <div className="absolute right-3 top-3 text-gray-500">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M2 7h20v10H2V7zm2 2v6h16V9H4z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase font-bold mb-1">{isPT ? 'Validade' : 'Expiry Date'}</label>
                                    <input className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none text-center" placeholder="MM/YY" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase font-bold mb-1">CVC</label>
                                    <input className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none text-center" placeholder="123" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">{isPT ? 'Nome no Cartão' : 'Name on Card'}</label>
                                <input className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none" placeholder="JOHN DOE" />
                            </div>
                        </div>
                    )}

                    {/* PIX Form */}
                    {method === 'PIX' && (
                        <div className="space-y-4 flex-1 flex flex-col items-center justify-center text-center">
                             <div className="w-48 h-48 bg-white p-2 rounded-xl mb-4 relative">
                                 {/* Mock QR Code */}
                                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=oseuprofessordeingles-${course.id}`} alt="PIX QR" className="w-full h-full" />
                                 {/* Overlay Logo */}
                                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                     <div className="bg-white p-1 rounded-full">
                                         <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center font-bold text-white text-xs">PIX</div>
                                     </div>
                                 </div>
                             </div>
                             <p className="text-white font-bold text-lg">{isPT ? 'Escaneie para pagar:' : 'Scan to pay:'} R$ {course.price},00</p>
                             <p className="text-red-400 text-sm font-mono animate-pulse">{isPT ? 'Tempo restante:' : 'Time remaining:'} {formatTime(pixTimeLeft)}</p>
                             
                             <div className="w-full relative mt-4">
                                 <div className="w-full bg-black/50 border border-gray-700 rounded-lg pl-4 pr-12 py-3 text-gray-500 text-xs truncate cursor-text select-all font-mono">
                                     00020126580014BR.GOV.BCB.PIX0136{course.id}5204000053039865802BR5925
                                 </div>
                                 <button 
                                    onClick={handleCopyPix}
                                    className={`absolute right-1 top-1 bottom-1 px-3 rounded-md transition-all flex items-center justify-center ${pixCopied ? 'bg-green-600 text-white' : 'bg-gray-800 text-cyan-400 hover:bg-gray-700'}`}
                                 >
                                     {pixCopied ? (
                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                     ) : (
                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                     )}
                                 </button>
                             </div>
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-gray-800">
                        <button 
                            onClick={handlePay}
                            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${
                                method === 'CC' 
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/30' 
                                : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-cyan-900/30'
                            }`}
                        >
                            {method === 'CC' ? `${isPT ? 'Pagar' : 'Pay'} R$ ${course.price},00` : (isPT ? 'Já realizei o PIX' : 'I have paid via PIX')}
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-4">
                            {isPT ? 'Ao clicar acima, você concorda com nossos' : 'By clicking the button above, you agree to our'} <span className="underline cursor-pointer">{isPT ? 'Termos de Serviço' : 'Terms of Service'}</span>.
                        </p>
                    </div>
                </div>
            )}

            {step === 'PROCESSING' && (
                 <div className="h-full flex flex-col items-center justify-center animate-pulse">
                     <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                     <h3 className="text-2xl font-bold text-white mb-2">{isPT ? 'Processando Pagamento' : 'Processing Payment'}</h3>
                     <p className="text-gray-400">{isPT ? 'Verificando com seu banco...' : 'Verifying with your bank...'}</p>
                 </div>
            )}

            {step === 'SUCCESS' && (
                 <div className="h-full flex flex-col items-center justify-center animate-scale-in text-center">
                     <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                         <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                     </div>
                     <h3 className="text-3xl font-bold text-white mb-2">{isPT ? 'Acesso Liberado!' : 'Access Granted!'}</h3>
                     <p className="text-gray-400 mb-8 max-w-sm">
                         {isPT ? 'Parabéns! Você se inscreveu com sucesso em' : 'Congratulations! You have successfully enrolled in'} <br/>
                         <span className="text-white font-bold">{course.title}</span>.
                     </p>
                     <button 
                         onClick={onConfirm}
                         className="w-full max-w-xs bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(8,145,178,0.4)]"
                     >
                         {isPT ? 'Começar a Aprender' : 'Start Learning Now'}
                     </button>
                 </div>
            )}

        </div>
      </div>
    </div>
  );
};
