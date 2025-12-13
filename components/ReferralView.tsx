import React, { useState } from 'react';

export const ReferralView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = "PROF-2024-X9Z";
  const referralLink = `https://oseuprofessordeingles.com/join?ref=${referralCode}`;

  const handleCopy = () => {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'whatsapp' | 'email') => {
      const text = `Join me on O Seu Professor de Inglês and get R$50 off your first class! Use my link: ${referralLink}`;
      if (platform === 'whatsapp') {
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      } else {
          window.open(`mailto:?subject=Learn English with me&body=${encodeURIComponent(text)}`, '_blank');
      }
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-5xl mx-auto pb-20 animate-fade-in">
        
        {/* Hero */}
        <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-3xl p-8 md:p-12 mb-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Invite Friends, Earn <span className="text-cyan-400">R$ 50</span></h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                Help your friends master English. When they book their first lesson, you both get R$ 50 in credits. Win-win.
            </p>

            <div className="bg-black/40 backdrop-blur-md border border-gray-700 rounded-xl p-2 max-w-md mx-auto flex items-center gap-2">
                <div className="flex-1 px-4 text-left font-mono text-gray-300 text-sm truncate">
                    {referralLink}
                </div>
                <button 
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${copied ? 'bg-green-600 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}
                >
                    {copied ? 'Copied!' : 'Copy Link'}
                </button>
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-2 text-green-400 hover:text-white transition-colors bg-green-900/20 px-4 py-2 rounded-lg border border-green-900 hover:bg-green-900/40">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                    WhatsApp
                </button>
                <button onClick={() => handleShare('email')} className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-900 hover:bg-blue-900/40">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Email
                </button>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                <p className="text-gray-500 text-xs uppercase font-bold">Total Clicks</p>
                <h3 className="text-3xl font-bold text-white mt-1">42</h3>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                <p className="text-gray-500 text-xs uppercase font-bold">Successful Referrals</p>
                <h3 className="text-3xl font-bold text-cyan-400 mt-1">3</h3>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                <p className="text-gray-500 text-xs uppercase font-bold">Credits Earned</p>
                <h3 className="text-3xl font-bold text-green-400 mt-1">R$ 150,00</h3>
            </div>
        </div>

        {/* Gamification */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Ambassador Status</h3>
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between text-xs text-gray-400 mb-2 uppercase font-bold">
                    <span>Novice</span>
                    <span>Influencer</span>
                    <span>Partner</span>
                </div>
                <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden mb-4 relative">
                    <div className="w-[30%] h-full bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full"></div>
                    {/* Markers */}
                    <div className="absolute top-0 left-[33%] h-full w-0.5 bg-gray-900"></div>
                    <div className="absolute top-0 left-[66%] h-full w-0.5 bg-gray-900"></div>
                </div>
                <p className="text-gray-400 text-sm">
                    You need <span className="text-white font-bold">7 more referrals</span> to reach Influencer status and unlock 25% commission.
                </p>
            </div>
        </div>
    </div>
  );
};