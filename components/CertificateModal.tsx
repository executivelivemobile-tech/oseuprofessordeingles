import React from 'react';

interface CertificateModalProps {
  studentName: string;
  courseTitle: string;
  date: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ studentName, courseTitle, date, onClose }) => {
  const verificationId = `BLK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-lg shadow-[0_0_100px_rgba(34,211,238,0.3)] overflow-hidden">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-50 text-gray-500 hover:text-white bg-black/50 p-2 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex flex-col md:flex-row h-full">
            {/* Sidebar Decor */}
            <div className="w-full md:w-24 bg-gradient-to-b from-cyan-600 to-blue-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="md:-rotate-90 text-white font-orbitron font-bold tracking-[0.5em] text-xs md:text-lg whitespace-nowrap py-4">
                    OFFICIAL CREDENTIAL
                </div>
            </div>

            {/* Main Certificate Area */}
            <div className="flex-1 p-8 md:p-16 text-center relative bg-white text-black">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {/* Header */}
                <div className="mb-10">
                    <div className="w-16 h-16 mx-auto bg-black rounded-full flex items-center justify-center mb-4">
                        <span className="text-cyan-400 font-bold font-orbitron text-2xl">O</span>
                    </div>
                    <h2 className="text-4xl font-serif font-bold uppercase tracking-widest text-gray-900 mb-2">Certificate</h2>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">of Completion</p>
                </div>

                {/* Content */}
                <div className="space-y-6 mb-12">
                    <p className="text-gray-600 italic">This validates that</p>
                    <h3 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-800 font-script border-b-2 border-gray-200 pb-4 inline-block px-10">
                        {studentName}
                    </h3>
                    <p className="text-gray-600 italic">has successfully completed the course</p>
                    <h4 className="text-2xl font-bold text-gray-800">{courseTitle}</h4>
                </div>

                {/* Footer details */}
                <div className="flex flex-col md:flex-row justify-between items-end border-t-2 border-gray-100 pt-8 gap-8">
                    <div className="text-left">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Date Issued</p>
                        <p className="font-mono text-gray-700">{date}</p>
                    </div>
                    
                    <div className="flex-1 flex justify-center">
                         {/* Stamp */}
                         <div className="w-24 h-24 border-4 border-cyan-600/30 rounded-full flex items-center justify-center rotate-12 mask-image">
                             <div className="w-20 h-20 border-2 border-dashed border-cyan-600/50 rounded-full flex items-center justify-center text-center">
                                 <span className="text-[8px] font-bold text-cyan-700 uppercase leading-tight">Verified<br/>Blockchain<br/>Secured</span>
                             </div>
                         </div>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Credential ID</p>
                        <p className="font-mono text-gray-700 text-xs">{verificationId}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Action Bar */}
        <div className="bg-gray-800 p-4 flex justify-between items-center">
            <p className="text-gray-400 text-xs">Verify at: verify.oseuprofessordeingles.com</p>
            <div className="flex gap-4">
                <button className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    Share
                </button>
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download PDF
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};