import React, { useState } from 'react';

export const CertificateVerification: React.FC = () => {
  const [certId, setCertId] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'VALID' | 'INVALID'>('IDLE');
  const [result, setResult] = useState<{ student: string; course: string; date: string } | null>(null);

  const handleVerify = () => {
      if (!certId.trim()) return;
      setStatus('LOADING');
      
      // Simulate API Check
      setTimeout(() => {
          if (certId.toUpperCase().startsWith('BLK-')) {
              setStatus('VALID');
              setResult({
                  student: 'Demo Student',
                  course: 'English for Full-Stack Developers',
                  date: 'October 24, 2023'
              });
          } else {
              setStatus('INVALID');
              setResult(null);
          }
      }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-2xl mx-auto pb-20 animate-fade-in flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-2">Credential Verification</h1>
        <p className="text-gray-400 text-center mb-8">
            Verify the authenticity of a certificate issued by O Seu Professor de Inglês.
        </p>

        <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
                <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Certificate ID</label>
                <div className="flex gap-2">
                    <input 
                        value={certId}
                        onChange={(e) => setCertId(e.target.value)}
                        placeholder="e.g. BLK-X9Z24..."
                        className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none font-mono uppercase"
                    />
                    <button 
                        onClick={handleVerify}
                        disabled={status === 'LOADING'}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-bold transition-all"
                    >
                        {status === 'LOADING' ? 'Verifying...' : 'Verify'}
                    </button>
                </div>
            </div>

            {status === 'VALID' && result && (
                <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-6 text-center animate-slide-up">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Valid Credential</h3>
                    <p className="text-gray-300 text-sm mb-4">This certificate is authentic and registered in our database.</p>
                    
                    <div className="bg-black/40 rounded-lg p-4 text-left space-y-2">
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                            <span className="text-gray-500 text-xs uppercase">Student</span>
                            <span className="text-white font-bold">{result.student}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                            <span className="text-gray-500 text-xs uppercase">Course</span>
                            <span className="text-white font-bold text-right">{result.course}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-xs uppercase">Issue Date</span>
                            <span className="text-white font-bold">{result.date}</span>
                        </div>
                    </div>
                </div>
            )}

            {status === 'INVALID' && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6 text-center animate-slide-up">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Invalid Credential</h3>
                    <p className="text-gray-300 text-sm">We could not find a certificate with this ID. Please check the code and try again.</p>
                </div>
            )}
        </div>
    </div>
  );
};