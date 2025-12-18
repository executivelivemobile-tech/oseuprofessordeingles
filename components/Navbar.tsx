
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
    const isAdmin = currentUser?.role === UserRole.ADMIN;

    useEffect(() => {
        dataService.checkConnection().then(setDbConnected);
    }, []);

    const handleNav = (view: ViewState) => {
        onNavigate(view);
        setIsMenuOpen(false);
    };

    return (
        <nav className={`fixed top-0 w-full z-40 backdrop-blur-md border-b transition-colors duration-500 ${
            isAdmin ? 'bg-red-950/20 border-red-500/30' : 'bg-black/80 border-white/10'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer group" onClick={() => handleNav('HOME')}>
                        <div className={`w-8 h-8 mr-2 rounded-lg flex items-center justify-center text-white font-bold font-orbitron group-hover:rotate-12 transition-all duration-300 ${
                            isAdmin ? 'bg-gradient-to-br from-red-600 to-black shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                        }`}>
                            {isAdmin ? 'A' : 'O'}
                        </div>
                        <span className={`text-xl md:text-2xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r ${
                            isAdmin ? 'from-red-400 to-gray-500' : 'from-cyan-400 to-blue-600'
                        }`}>
                            {isAdmin ? 'ADMIN_CENTER' : 'OSEUPROFESSOR'}
                        </span>
                        <div 
                            className={`ml-2 w-2 h-2 rounded-full ${dbConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} 
                        ></div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {!isAdmin && (
                            <>
                                <button onClick={() => handleNav('FIND_TEACHER')} className={`text-xs font-bold tracking-widest uppercase transition-colors ${currentView === 'FIND_TEACHER' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
                                    {language === 'PT' ? 'Mestres' : 'Mentors'}
                                </button>
                                <button onClick={() => handleNav('COURSES')} className={`text-xs font-bold tracking-widest uppercase transition-colors ${currentView === 'COURSES' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
                                    {language === 'PT' ? 'Arsenal' : 'Courses'}
                                </button>
                                <button onClick={() => handleNav('BLOG')} className={`text-xs font-bold tracking-widest uppercase transition-colors ${currentView === 'BLOG' || currentView === 'BLOG_POST' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}>Insights</button>
                            </>
                        )}

                        {isAdmin && (
                            <button onClick={() => handleNav('ADMIN_DASHBOARD')} className="text-xs font-bold tracking-widest uppercase text-red-400 border border-red-900/50 px-3 py-1 rounded-full bg-red-950/30 animate-pulse">
                                System Core
                            </button>
                        )}

                        <div className="h-6 w-px bg-gray-800 mx-2"></div>

                        <button
                            onClick={onToggleLanguage}
                            className={`
                                relative px-4 py-1.5 font-orbitron font-extrabold text-[10px] tracking-widest uppercase transition-all duration-500 rounded-sm overflow-hidden group
                                ${language === 'PT' 
                                    ? 'bg-lime-500 text-black shadow-[0_0_20px_rgba(132,204,22,0.4)]' 
                                    : 'bg-transparent text-lime-500 border border-lime-500/30'
                                }
                            `}
                        >
                            {language === 'PT' ? 'BRAZIL' : 'INTL'}
                        </button>

                        <div className="h-6 w-px bg-gray-800 mx-2"></div>

                        {currentUser ? (
                            <div className="flex items-center gap-4">
                                {!isAdmin && (
                                    <button 
                                        onClick={() => handleNav('MESSAGES')}
                                        className={`relative p-2 rounded-full hover:bg-gray-800 transition-colors ${currentView === 'MESSAGES' ? 'text-cyan-400' : 'text-gray-500'}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        {hasUnread && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
                                    </button>
                                )}

                                <div className="relative group">
                                    <button className="flex items-center gap-3 focus:outline-none">
                                        <div className="text-right hidden lg:block">
                                            <div className="text-xs font-black text-white uppercase tracking-tighter">{currentUser.name}</div>
                                            <div className={`text-[10px] uppercase font-bold ${isAdmin ? 'text-red-500' : 'text-cyan-500'}`}>{currentUser.role}</div>
                                        </div>
                                        <img 
                                            src={currentUser.avatarUrl} 
                                            className={`w-9 h-9 rounded-full border-2 object-cover transition-all ${isAdmin ? 'border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.3)]' : 'border-gray-700 group-hover:border-cyan-500'}`} 
                                        />
                                    </button>

                                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
                                        <div className="py-2">
                                            {currentUser.role === UserRole.STUDENT && (
                                                <button onClick={() => handleNav('STUDENT_DASHBOARD')} className="block w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:bg-gray-800">DASHBOARD</button>
                                            )}
                                            {currentUser.role === UserRole.TEACHER && (
                                                <button onClick={() => handleNav('TEACHER_DASHBOARD')} className="block w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:bg-gray-800">TEACHER PANEL</button>
                                            )}
                                            {isAdmin && (
                                                <button onClick={() => handleNav('ADMIN_DASHBOARD')} className="block w-full text-left px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-900/20 uppercase tracking-widest">Master Terminal</button>
                                            )}
                                            <button onClick={() => handleNav('SETTINGS')} className="block w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:bg-gray-800 uppercase">Profile Settings</button>
                                            <div className="border-t border-gray-800 my-1"></div>
                                            <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-xs font-black text-red-500 hover:bg-red-950/20">ABORT_SESSION</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <button onClick={onOpenAuth} className="text-white hover:text-cyan-400 font-bold text-xs uppercase tracking-widest transition-all">Connect</button>
                                <button onClick={onOpenAuth} className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)]">
                                    Join
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Mobile menu trigger omitted for brevity, same logic applies */}
                </div>
            </div>
        </nav>
    );
};
