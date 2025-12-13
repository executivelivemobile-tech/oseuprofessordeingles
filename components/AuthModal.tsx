
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    level: 'Beginner',
    goal: 'Fluency'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
        let user: User;
        
        if (mode === 'REGISTER') {
            user = await authService.signUp(formData.email, formData.password, {
                name: formData.name,
                role: role,
                level: role === UserRole.STUDENT ? formData.level : undefined,
                goal: role === UserRole.STUDENT ? formData.goal : undefined
            });
        } else {
            user = await authService.signIn(formData.email, formData.password);
        }

        onLogin(user);
        onClose();
    } catch (err: any) {
        console.error("Auth Error", err);
        setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-[0_0_50px_rgba(8,145,178,0.2)] overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
              {mode === 'LOGIN' ? 'WELCOME BACK' : 'JOIN THE FUTURE'}
            </h2>
            <p className="text-gray-400 text-sm">
              {mode === 'LOGIN' ? 'Access your dashboard' : 'Create your account today'}
            </p>
          </div>

          {error && (
              <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg mb-4 text-xs text-red-200 text-center">
                  {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'REGISTER' && (
               <>
                {/* Role Toggle */}
                <div className="flex bg-gray-800 p-1 rounded-lg mb-4">
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.STUDENT)}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${role === UserRole.STUDENT ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                  >
                    I am a Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.TEACHER)}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${role === UserRole.TEACHER ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                  >
                    I am a Teacher
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Full Name</label>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
               </>
            )}

            <div>
              <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {/* Student Onboarding Fields */}
            {mode === 'REGISTER' && role === UserRole.STUDENT && (
              <div className="grid grid-cols-2 gap-4 animate-slide-up">
                <div>
                  <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Current Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Primary Goal</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Fluency">General Fluency</option>
                    <option value="Business">Business / Work</option>
                    <option value="Travel">Travel</option>
                    <option value="Exams">Exam Prep</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all mt-6 flex items-center justify-center gap-2 ${
                  mode === 'REGISTER' && role === UserRole.TEACHER 
                  ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/30' 
                  : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/30'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
              ) : (
                  mode === 'LOGIN' ? 'Login' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              {mode === 'LOGIN' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => { setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN'); setError(null); }}
                className="ml-2 text-white font-bold hover:underline"
              >
                {mode === 'LOGIN' ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
          
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-[10px] text-gray-500 text-center">
              <p>Secure connection established via Supabase Auth.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
