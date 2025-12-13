import React, { useState } from 'react';
import { Teacher } from '../types';

interface TeacherOnboardingProps {
  onSubmit: (teacherData: Partial<Teacher>) => void;
  onCancel: () => void;
}

export const TeacherOnboarding: React.FC<TeacherOnboardingProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    bio: '',
    accent: 'International',
    hourlyRate: 60,
    nicheInput: '', // comma separated
    photoUrl: 'https://picsum.photos/seed/new/200/200', // Default mock
    introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    const niches = formData.nicheInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    onSubmit({
      name: formData.name,
      location: formData.location,
      bio: formData.bio,
      accent: formData.accent as any,
      hourlyRate: Number(formData.hourlyRate),
      niche: niches.length > 0 ? niches : ['General English'],
      photoUrl: formData.photoUrl,
      introVideoUrl: formData.introVideoUrl,
    });
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-3xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Join the Elite</h1>
            <p className="text-gray-400">Application Step {step} of 3</p>
          </div>
          <button onClick={onCancel} className="text-gray-500 hover:text-white">Cancel</button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-800 rounded-full mb-8">
          <div 
            className="h-full bg-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          
          {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold text-white mb-4">Personal Profile</h2>
                  
                  <div>
                      <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                      <input 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                        placeholder="e.g. John Wick"
                      />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Location</label>
                        <input 
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                            placeholder="City, Country"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Accent</label>
                        <select 
                            name="accent"
                            value={formData.accent}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                        >
                            <option value="International">International / Neutral</option>
                            <option value="USA">USA</option>
                            <option value="UK">UK</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                        </select>
                    </div>
                  </div>

                  <div>
                      <label className="block text-sm text-gray-400 mb-1">Professional Bio</label>
                      <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                        placeholder="Tell students about your methodology and experience..."
                      />
                  </div>

                  <div className="flex justify-end pt-4">
                      <button 
                        onClick={handleNext}
                        disabled={!formData.name || !formData.bio}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all"
                      >
                          Next Step
                      </button>
                  </div>
              </div>
          )}

          {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold text-white mb-4">Expertise & Rates</h2>

                  <div>
                      <label className="block text-sm text-gray-400 mb-1">Hourly Rate (BRL)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-500">R$</span>
                        <input 
                            type="number"
                            name="hourlyRate"
                            value={formData.hourlyRate}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Platform commission: 20%</p>
                  </div>

                  <div>
                      <label className="block text-sm text-gray-400 mb-1">Specialties / Niches</label>
                      <input 
                        name="nicheInput"
                        value={formData.nicheInput}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                        placeholder="e.g. Business, Travel, IELTS (comma separated)"
                      />
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 text-sm text-gray-300">
                      <h4 className="font-bold text-white mb-2">Availability Expectations</h4>
                      <p>By continuing, you agree to maintain an up-to-date calendar. Cancellations with less than 24h notice affect your ranking.</p>
                  </div>

                  <div className="flex justify-between pt-4">
                      <button onClick={handleBack} className="text-gray-400 hover:text-white font-bold px-4">Back</button>
                      <button 
                        onClick={handleNext}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-bold transition-all"
                      >
                          Next Step
                      </button>
                  </div>
              </div>
          )}

          {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold text-white mb-4">Media & Verification</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                      <div>
                          <label className="block text-sm text-gray-400 mb-1">Profile Photo URL</label>
                          <input 
                            name="photoUrl"
                            value={formData.photoUrl}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none text-xs"
                          />
                          <div className="mt-4 flex justify-center">
                              <img src={formData.photoUrl} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-gray-800" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} />
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm text-gray-400 mb-1">Intro Video URL</label>
                          <input 
                            name="introVideoUrl"
                            value={formData.introVideoUrl}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none text-xs"
                          />
                          <div className="mt-4 bg-black rounded-lg h-32 flex items-center justify-center border border-gray-800">
                              <p className="text-xs text-gray-500">Video Preview Placeholder</p>
                          </div>
                      </div>
                  </div>

                  <div className="border border-dashed border-gray-700 rounded-xl p-6 bg-black/30 text-center">
                      <p className="text-gray-400 text-sm mb-2">Identity Verification</p>
                      <div className="inline-flex items-center gap-2 bg-yellow-900/30 text-yellow-500 px-3 py-1 rounded text-xs border border-yellow-800">
                          Pending Admin Approval
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Your profile will be hidden until an admin verifies your documents.</p>
                  </div>

                  <div className="flex justify-between pt-4">
                      <button onClick={handleBack} className="text-gray-400 hover:text-white font-bold px-4">Back</button>
                      <button 
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                      >
                          Submit Application
                      </button>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};