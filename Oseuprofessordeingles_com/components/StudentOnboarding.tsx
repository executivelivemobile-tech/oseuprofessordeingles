import React, { useState } from 'react';
import { User } from '../types';

interface StudentOnboardingProps {
  currentUser: User;
  onSubmit: (data: Partial<User>) => void;
}

const LEVELS = [
    { id: 'Beginner', label: 'Beginner (A1-A2)', desc: 'I can understand basic phrases but struggle to speak.' },
    { id: 'Intermediate', label: 'Intermediate (B1-B2)', desc: 'I can communicate but need to improve fluency and grammar.' },
    { id: 'Advanced', label: 'Advanced (C1)', desc: 'I speak well but want to master nuances or specific topics.' },
    { id: 'Fluent', label: 'Fluent (C2)', desc: 'I want to maintain my level or learn native slang.' }
];

const GOALS = [
    { id: 'Career', icon: '💼', label: 'Boost Career', desc: 'Business English, Interviews, Tech' },
    { id: 'Travel', icon: '✈️', label: 'Travel', desc: 'Airports, Hotels, Socializing' },
    { id: 'Exams', icon: '📝', label: 'Exams', desc: 'TOEFL, IELTS, Cambridge' },
    { id: 'Hobby', icon: '🎮', label: 'Culture & Hobby', desc: 'Movies, Games, General Fluency' }
];

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({ currentUser, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
      level: currentUser.level || 'Beginner',
      goal: currentUser.goal || 'Career',
      budgetMax: 100,
      availabilityPrefs: [] as string[]
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleFinish = () => {
      onSubmit({
          ...data,
          onboardingCompleted: true
      } as any);
  };

  const toggleAvailability = (time: string) => {
      setData(prev => {
          const exists = prev.availabilityPrefs.includes(time);
          return {
              ...prev,
              availabilityPrefs: exists 
                ? prev.availabilityPrefs.filter(t => t !== time)
                : [...prev.availabilityPrefs, time]
          };
      });
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 bg-black flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-orbitron tracking-wide">
                    INITIALIZE PROFILE
                </h1>
                <p className="text-cyan-400 text-lg">
                    Calibrating recommendations for {currentUser.name}...
                </p>
            </div>

            {/* Progress */}
            <div className="flex gap-2 mb-8">
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-gray-800'}`}></div>
                ))}
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 backdrop-blur-sm animate-fade-in relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                {step === 1 && (
                    <div className="space-y-6 animate-slide-left">
                        <h2 className="text-2xl font-bold text-white mb-6">Step 1: Proficiency Calibration</h2>
                        <div className="grid gap-4">
                            {LEVELS.map((lvl) => (
                                <button
                                    key={lvl.id}
                                    onClick={() => setData(prev => ({ ...prev, level: lvl.id as any }))}
                                    className={`text-left p-4 rounded-xl border transition-all ${
                                        data.level === lvl.id 
                                        ? 'bg-cyan-900/30 border-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.3)]' 
                                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
                                    }`}
                                >
                                    <h3 className={`font-bold text-lg ${data.level === lvl.id ? 'text-white' : 'text-gray-300'}`}>{lvl.label}</h3>
                                    <p className="text-sm text-gray-400">{lvl.desc}</p>
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end mt-6">
                            <button onClick={handleNext} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg">
                                Confirm Level
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-slide-left">
                        <h2 className="text-2xl font-bold text-white mb-6">Step 2: Mission Objective</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {GOALS.map((goal) => (
                                <button
                                    key={goal.id}
                                    onClick={() => setData(prev => ({ ...prev, goal: goal.id }))}
                                    className={`p-6 rounded-xl border transition-all flex flex-col items-center text-center gap-3 ${
                                        data.goal === goal.id 
                                        ? 'bg-cyan-900/30 border-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.3)] scale-105' 
                                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
                                    }`}
                                >
                                    <span className="text-4xl">{goal.icon}</span>
                                    <div>
                                        <h3 className={`font-bold ${data.goal === goal.id ? 'text-white' : 'text-gray-300'}`}>{goal.label}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{goal.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between mt-8">
                            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white">Back</button>
                            <button onClick={handleNext} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg">
                                Set Objective
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-slide-left">
                        <h2 className="text-2xl font-bold text-white mb-6">Step 3: Resource Allocation</h2>
                        <div className="py-8">
                            <label className="block text-gray-400 mb-4 text-center">Maximum Hourly Rate</label>
                            <div className="text-5xl font-bold text-white text-center mb-8 font-mono">
                                R$ {data.budgetMax}
                            </div>
                            <input 
                                type="range" 
                                min="40" 
                                max="300" 
                                step="10"
                                value={data.budgetMax}
                                onChange={(e) => setData(prev => ({ ...prev, budgetMax: Number(e.target.value) }))}
                                className="w-full accent-cyan-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>R$ 40</span>
                                <span>R$ 300+</span>
                            </div>
                        </div>
                        <div className="flex justify-between mt-8">
                            <button onClick={() => setStep(2)} className="text-gray-500 hover:text-white">Back</button>
                            <button onClick={handleNext} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg">
                                Set Budget
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6 animate-slide-left">
                        <h2 className="text-2xl font-bold text-white mb-6">Step 4: Temporal Sync</h2>
                        <p className="text-gray-400 mb-4">When do you prefer to learn?</p>
                        <div className="grid grid-cols-2 gap-4">
                            {['Morning', 'Afternoon', 'Evening', 'Weekend'].map((time) => (
                                <button
                                    key={time}
                                    onClick={() => toggleAvailability(time)}
                                    className={`p-4 rounded-xl border transition-all ${
                                        data.availabilityPrefs.includes(time)
                                        ? 'bg-cyan-900/30 border-cyan-500 text-white' 
                                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-500'
                                    }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                         <div className="flex justify-between mt-8">
                            <button onClick={() => setStep(3)} className="text-gray-500 hover:text-white">Back</button>
                            <button 
                                onClick={handleFinish}
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(8,145,178,0.5)] w-full md:w-auto"
                            >
                                Launch Dashboard
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    </div>
  );
};