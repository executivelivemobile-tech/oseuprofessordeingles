
import React from 'react';
import { ViewState } from '../types';

interface FooterProps {
    onNavigate: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-black border-t border-gray-900 py-12 mt-20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                <div>
                    <h4 className="font-orbitron font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                        PLATFORM
                    </h4>
                    <ul className="space-y-2 text-gray-500 text-sm">
                        <li><button onClick={() => onNavigate('ABOUT')} className="hover:text-cyan-400 transition-colors">About Us</button></li>
                        <li><button onClick={() => onNavigate('BLOG')} className="hover:text-cyan-400 transition-colors">Blog & Insights</button></li>
                        <li><button onClick={() => onNavigate('TERMS')} className="hover:text-cyan-400 transition-colors">Terms of Use</button></li>
                        <li><button onClick={() => onNavigate('PRIVACY')} className="hover:text-cyan-400 transition-colors">Privacy Policy (LGPD)</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-orbitron font-bold text-white mb-4">TEACHERS</h4>
                    <ul className="space-y-2 text-gray-500 text-sm">
                        <li><button onClick={() => onNavigate('ONBOARDING')} className="hover:text-cyan-400 transition-colors">Become a Teacher</button></li>
                        <li><button onClick={() => onNavigate('TERMS')} className="hover:text-cyan-400 transition-colors">Teacher Rules</button></li>
                        <li><button onClick={() => onNavigate('ABOUT')} className="hover:text-cyan-400 transition-colors">Success Stories</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-orbitron font-bold text-white mb-4">STUDENTS</h4>
                    <ul className="space-y-2 text-gray-500 text-sm">
                        <li><button onClick={() => onNavigate('FIND_TEACHER')} className="hover:text-cyan-400 transition-colors">Find a Teacher</button></li>
                        <li><button onClick={() => onNavigate('COURSES')} className="hover:text-cyan-400 transition-colors">Buy Courses</button></li>
                        <li><button onClick={() => onNavigate('FAQ')} className="hover:text-cyan-400 transition-colors">Student Help Center</button></li>
                        <li><button onClick={() => onNavigate('REFERRALS')} className="hover:text-cyan-400 transition-colors">Refer & Earn</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-orbitron font-bold text-white mb-4">SUPPORT</h4>
                    <p className="text-gray-500 text-sm mb-4">
                        Need help? Ask Macley, our AI assistant, or email us.
                    </p>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => onNavigate('VERIFY_CERTIFICATE')} className="text-left text-xs text-cyan-400 hover:text-white transition-colors flex items-center gap-2 group">
                            <div className="w-6 h-6 rounded bg-cyan-900/30 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            </div>
                            Verify Certificates
                        </button>
                    </div>
                </div>
            </div>
            <div className="text-center text-gray-800 text-xs mt-12 font-mono">
                © 2024 oseuprofessordeingles.com. Engineered for Fluency.
            </div>
        </footer>
    );
};
