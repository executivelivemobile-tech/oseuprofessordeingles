
import React, { useState, useEffect } from 'react';
import { User, UserRole, ViewState } from '../types';
import { dataService } from '../services/dataService';

interface NavbarProps {
    currentUser: User | null;
    currentView: ViewState;
    onNavigate: (view: ViewState) => void;
    onOpenAuth: () => void;
    onLogout: () => void;
    hasUnread?: boolean;
    language: 'EN' | 'PT';
    onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
    currentUser, 
    currentView, 
    onNavigate, 
    onOpenAuth, 
    onLogout, 
    hasUnread,
    language,
    onToggleLanguage
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [dbConnected, setDbConnected] = useState(false);

    useEffect(() => {
        dataService.checkConnection().then(setDbConnected);
    }, []);

    const handleNav = (view: ViewState) => {
        onNavigate(view);
        setIsMenuOpen(false); // Close mobile menu if open
    };

    return (
        <nav className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer group" onClick={() => handleNav('HOME')}>
                        <div className="w-8 h-8 mr-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold font-orbitron group-hover:rotate-12 transition-transform">
                            O
                        </div>
                        <span className="text-xl md:text-2xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                            OSEUPROFESSOR
                        </span>
                        {/* System Status Dot */}
                        <div 
                            className={`ml-2 w-2 h-2 rounded-full ${dbConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} 
                            title={dbConnected ? "System Online" : "Running in Mock Mode"}
                        ></div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button onClick={() => handleNav('FIND_TEACHER')} className={`text-sm font-medium transition-colors ${currentView === 'FIND_TEACHER' ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}>
                            {language === 'PT' ? 'Professores' : 'Teachers'}
                        </button>
                        <button onClick={() => handleNav('COURSES')} className={`text-sm font-medium transition-colors ${currentView === 'COURSES' ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}>
                            {language === 'PT' ? 'Cursos' : 'Courses'}
                        </button>
                        <button onClick={() => handleNav('BLOG')} className={`text-sm font-medium transition-colors ${currentView === 'BLOG' || currentView === 'BLOG_POST' ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}>Blog</button>
                        
                        {!currentUser && (
                             <button onClick={() => handleNav('ONBOARDING')} className="text-sm font-medium text-gray-300 hover:text-white">
                                 {language === 'PT' ? 'Seja Professor' : 'Become a Teacher'}
                             </button>
                        )}

                        <div className="h-6 w-px bg-gray-800 mx-2"></div>

                        {/* FUTURISTIC RADIOACTIVE BUTTON */}
                        <button
                            onClick={onToggleLanguage}
                            className={`
                                relative px-6 py-2 font-orbitron font-extrabold text-xs tracking-widest uppercase transition-all duration-500 transform hover:scale-105 rounded-sm overflow-hidden group
                                ${language === 'PT' 
                                    ? 'bg-lime-500 text-black shadow-[0_0_40px_rgba(132,204,22,0.8)] border border-lime-400' 
                                    : 'bg-transparent text-lime-500 border border-lime-500/50 hover:border-lime-400 hover:shadow-[0_0_20px_rgba(132,204,22,0.5)]'
                                }
                            `}
                        >
                            {/* Inner Glow Core */}
                            <div className={`absolute inset-0 bg-lime-400 blur-xl opacity-0 transition-opacity duration-300 ${language === 'PT' ? 'opacity-50 animate-pulse' : 'group-hover:opacity-20'}`}></div>
                            
                            {/* Scanline Effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none"></div>

                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {language === 'PT' ? 'BRAZIL MODE' : 'PT-BR'}
                            </span>
                        </button>

                        <div className="h-6 w-px bg-gray-800 mx-2"></div>

                        {currentUser ? (
                            <div className="flex items-center gap-4">
                                {/* Inbox Icon */}
                                <button 
                                    onClick={() => handleNav('MESSAGES')}
                                    className={`relative p-2 rounded-full hover:bg-gray-800 transition-colors ${currentView === 'MESSAGES' ? 'text-cyan-400' : 'text-gray-400'}`}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    {hasUnread && (
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black"></span>
                                    )}
                                </button>

                                <div className="relative group">
                                    <button className="flex items-center gap-3 focus:outline-none">
                                        <div className="text-right hidden lg:block">
                                            <div className="text-sm font-bold text-white">{currentUser.name}</div>
                                            <div className="text-xs text-cyan-400 uppercase tracking-wider">{currentUser.role}</div>
                                        </div>
                                        <img 
                                            src={currentUser.avatarUrl} 
                                            alt={currentUser.name} 
                                            className="w-10 h-10 rounded-full border-2 border-gray-700 group-hover:border-cyan-500 transition-colors object-cover" 
                                        />
                                    </button>

                                    {/* Dropdown */}
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
                                        <div className="py-2">
                                            {currentUser.role === UserRole.STUDENT && (
                                                <button onClick={() => handleNav('STUDENT_DASHBOARD')} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">My Dashboard</button>
                                            )}
                                            {currentUser.role === UserRole.TEACHER && (
                                                <button onClick={() => handleNav('TEACHER_DASHBOARD')} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">Teacher Panel</button>
                                            )}
                                            {currentUser.role === UserRole.ADMIN && (
                                                <button onClick={() => handleNav('ADMIN_DASHBOARD')} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300">Admin Panel</button>
                                            )}
                                            <button onClick={() => handleNav('FAVORITES')} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">Saved & Wishlist</button>
                                            <button onClick={() => handleNav('REFERRALS')} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">Refer & Earn</button>
                                            <button onClick={() => handleNav('SETTINGS')} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">Settings</button>
                                            <div className="border-t border-gray-800 my-1"></div>
                                            <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800">Sign Out</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <button onClick={onOpenAuth} className="text-white hover:text-cyan-400 font-bold text-sm">Log In</button>
                                <button onClick={onOpenAuth} className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:shadow-cyan-400/50">
                                    Join for Free
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={onToggleLanguage}
                            className={`
                                relative px-2 py-1 font-orbitron font-bold text-xs tracking-widest uppercase rounded border
                                ${language === 'PT' 
                                    ? 'bg-lime-500 text-black border-lime-400 shadow-[0_0_15px_rgba(132,204,22,0.8)]' 
                                    : 'bg-transparent text-lime-500 border-lime-500'
                                }
                            `}
                        >
                            PT
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {isMenuOpen && (
                 <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 pt-2 pb-6 space-y-2 animate-slide-down">
                    <button onClick={() => handleNav('HOME')} className="block w-full text-left py-3 text-base font-medium text-gray-300 border-b border-gray-800">Home</button>
                    <button onClick={() => handleNav('FIND_TEACHER')} className="block w-full text-left py-3 text-base font-medium text-gray-300 border-b border-gray-800">Find Teachers</button>
                    <button onClick={() => handleNav('COURSES')} className="block w-full text-left py-3 text-base font-medium text-gray-300 border-b border-gray-800">Courses</button>
                    <button onClick={() => handleNav('BLOG')} className="block w-full text-left py-3 text-base font-medium text-gray-300 border-b border-gray-800">Blog</button>
                    
                    {currentUser ? (
                        <>
                             <div className="py-3 flex items-center gap-3">
                                 <img src={currentUser.avatarUrl} className="w-8 h-8 rounded-full" />
                                 <span className="text-white font-bold">{currentUser.name}</span>
                             </div>
                             <button onClick={() => handleNav('MESSAGES')} className="block w-full text-left py-3 text-gray-300 flex items-center justify-between">
                                 Inbox {hasUnread && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                             </button>
                             <button onClick={() => handleNav(currentUser.role === 'TEACHER' ? 'TEACHER_DASHBOARD' : 'STUDENT_DASHBOARD')} className="block w-full text-left py-3 text-cyan-400 font-bold">Dashboard</button>
                             <button onClick={() => handleNav('FAVORITES')} className="block w-full text-left py-3 text-gray-300">Favorites</button>
                             <button onClick={() => handleNav('REFERRALS')} className="block w-full text-left py-3 text-gray-300">Referrals</button>
                             <button onClick={() => handleNav('SETTINGS')} className="block w-full text-left py-3 text-gray-300">Settings</button>
                             <button onClick={onLogout} className="block w-full text-left py-3 text-red-400">Log Out</button>
                        </>
                    ) : (
                        <div className="pt-4 flex flex-col gap-3">
                            <button onClick={onOpenAuth} className="w-full bg-gray-800 py-3 rounded-lg text-white font-bold">Log In</button>
                            <button onClick={onOpenAuth} className="w-full bg-cyan-600 py-3 rounded-lg text-white font-bold">Sign Up</button>
                        </div>
                    )}
                 </div>
            )}
        </nav>
    );
};
