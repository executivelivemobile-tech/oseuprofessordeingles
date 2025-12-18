
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'ADMIN'>('LOGIN');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminClicks, setAdminClicks] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    level: 'Beginner',
    goal: 'Fluency'
  });

  const handleLogoClick = () => {
    const newClicks = adminClicks + 1;
    setAdminClicks(newClicks);
    if (newClicks >= 5) {
        setMode('ADMIN');
        setFormData({ ...formData, email: 'admin@platform.com', password: '' });
        setAdminClicks(0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
        const user = await authService.signIn(formData.email, formData.password);
        onLogin(user);
        onClose();
    } catch (err: any) {
        setError(err.message || "Access Denied.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
      <div className={`w-full max-w-md bg-gray-900 border-2 transition-all duration-500 rounded-3xl overflow-hidden relative ${
          mode === 'ADMIN' ? 'border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.3)]' : 'border-gray-800 shadow-2xl'
      }`}>
        
        {/* Admin Scanline Effect */}
        {mode === 'ADMIN' && (
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(220,38,38,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-0"></div>
        )}

        <div className="p-8 relative z-10">
          <div className="text-center mb-8">
            <div 
                onClick={handleLogoClick}
                className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    mode === 'ADMIN' ? 'bg-red-600 rotate-180' : 'bg-cyan-600 hover:scale-110'
                }`}
            >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            
            <h2 className={`text-2xl font-orbitron font-black tracking-tighter ${mode === 'ADMIN' ? 'text-red-500' : 'text-white'}`}>
                {mode === 'ADMIN' ? 'OVERRIDE_TERMINAL' : mode === 'LOGIN' ? 'SECURE_ACCESS' : 'CREATE_IDENTITY'}
            </h2>
            {mode === 'ADMIN' && <p className="text-[10px] text-red-500 font-mono animate-pulse mt-1">WARNING: MASTER PRIVILEGES DETECTED</p>}
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 p-3 rounded-xl mb-6 text-[10px] text-red-400 font-mono text-center">
              SYSTEM_ERROR: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 pl-1">Protocol:Email</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none font-mono text-sm transition-all"
                placeholder="identity@domain.com"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 pl-1">Protocol:Key</label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none font-mono text-sm transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-black text-white text-xs uppercase tracking-[0.2em] shadow-xl transition-all mt-4 flex items-center justify-center gap-3 ${
                  mode === 'ADMIN' ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20'
              }`}
            >
              {isLoading ? 'AUTHENTICATING...' : mode === 'ADMIN' ? 'EXECUTE_BYPASS' : 'START_SESSION'}
            </button>
          </form>

          <div className="mt-8 flex justify-between items-center border-t border-gray-800 pt-6">
            <button 
                onClick={() => setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-tighter"
            >
                {mode === 'LOGIN' ? 'New here? Register' : 'Existing account? Login'}
            </button>
            <button onClick={onClose} className="text-[10px] font-bold text-gray-500 hover:text-red-400 uppercase tracking-tighter">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};
