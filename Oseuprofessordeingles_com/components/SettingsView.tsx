import React, { useState } from 'react';
import { User } from '../types';

interface SettingsViewProps {
  currentUser: User;
  onUpdateUser: (data: Partial<User>) => void;
}

const TABS = [
    { id: 'PROFILE', label: 'Profile Settings', icon: '👤' },
    { id: 'SECURITY', label: 'Login & Security', icon: '🔒' },
    { id: 'NOTIFICATIONS', label: 'Notifications', icon: '🔔' },
    { id: 'BILLING', label: 'Billing Methods', icon: '💳' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('PROFILE');
  const [formData, setFormData] = useState({
      name: currentUser.name,
      email: currentUser.email,
      avatarUrl: currentUser.avatarUrl,
      timezone: currentUser.timezone || 'GMT-03:00 (Brasilia)',
      notifications: currentUser.notifications || { email: true, sms: false, promotions: true }
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
          onUpdateUser({
              name: formData.name,
              avatarUrl: formData.avatarUrl,
              timezone: formData.timezone,
              notifications: formData.notifications
          });
          setIsLoading(false);
          // Assuming App.tsx handles the toast, but we can't trigger it directly here without context.
          // In a real app we'd use a context or callback prop for toast.
          alert('Settings saved successfully!');
      }, 1000);
  };

  const toggleNotification = (key: keyof typeof formData.notifications) => {
      setFormData(prev => ({
          ...prev,
          notifications: {
              ...prev.notifications,
              [key]: !prev.notifications[key]
          }
      }));
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-5xl mx-auto pb-20 animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-left p-4 text-sm font-bold flex items-center gap-3 transition-colors ${
                                activeTab === tab.id 
                                ? 'bg-cyan-900/20 text-cyan-400 border-l-4 border-cyan-400' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white border-l-4 border-transparent'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-8">
                
                {activeTab === 'PROFILE' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white mb-6">Public Profile</h2>
                        
                        <div className="flex items-center gap-6 mb-8">
                            <img src={formData.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-gray-700 object-cover" />
                            <div className="flex-1">
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Avatar URL</label>
                                <input 
                                    value={formData.avatarUrl}
                                    onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Display Name</label>
                                <input 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Email (Read Only)</label>
                                <input 
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Timezone</label>
                            <select 
                                value={formData.timezone}
                                onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                            >
                                <option value="GMT-03:00 (Brasilia)">GMT-03:00 Brasilia Time</option>
                                <option value="GMT-04:00 (Manaus)">GMT-04:00 Amazon Time</option>
                                <option value="GMT-05:00 (New York)">GMT-05:00 Eastern Time (US)</option>
                                <option value="GMT+00:00 (London)">GMT+00:00 London</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">All class times will be displayed in this timezone.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'SECURITY' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
                        
                        <div className="bg-black/30 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-white font-bold mb-4">Change Password</h3>
                            <div className="space-y-4">
                                <input type="password" placeholder="Current Password" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm" />
                                <input type="password" placeholder="New Password" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm" />
                                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-xs font-bold border border-gray-600">Update Password</button>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 pt-6">
                            <h3 className="text-red-500 font-bold mb-2">Danger Zone</h3>
                            <p className="text-gray-500 text-sm mb-4">Permanently delete your account and all associated data.</p>
                            <button className="text-red-500 hover:text-red-400 border border-red-500/50 hover:border-red-500 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                                Delete Account
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'NOTIFICATIONS' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-gray-700">
                                <div>
                                    <h4 className="text-white font-bold text-sm">Email Notifications</h4>
                                    <p className="text-xs text-gray-500">Receive booking confirmations and receipts.</p>
                                </div>
                                <div 
                                    onClick={() => toggleNotification('email')}
                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.notifications.email ? 'bg-cyan-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.notifications.email ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-gray-700">
                                <div>
                                    <h4 className="text-white font-bold text-sm">SMS Reminders</h4>
                                    <p className="text-xs text-gray-500">Get text alerts 1 hour before class.</p>
                                </div>
                                <div 
                                    onClick={() => toggleNotification('sms')}
                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.notifications.sms ? 'bg-cyan-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.notifications.sms ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-gray-700">
                                <div>
                                    <h4 className="text-white font-bold text-sm">Marketing & Promos</h4>
                                    <p className="text-xs text-gray-500">Receive news about new courses and discounts.</p>
                                </div>
                                <div 
                                    onClick={() => toggleNotification('promotions')}
                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.notifications.promotions ? 'bg-cyan-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.notifications.promotions ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'BILLING' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white mb-6">Payment Methods</h2>
                        
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                            <div className="bg-white/10 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-bold text-sm">Mastercard ending in 4242</p>
                                <p className="text-xs text-gray-500">Expires 12/25</p>
                            </div>
                            <button className="text-red-400 hover:text-white text-xs font-bold">Remove</button>
                        </div>

                        <button className="w-full border border-dashed border-gray-700 hover:border-cyan-500 hover:text-cyan-400 text-gray-500 py-4 rounded-xl text-sm font-bold transition-all">
                            + Add New Card
                        </button>

                        <div className="mt-8">
                            <h3 className="text-white font-bold text-sm mb-4">Billing History</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-400 border-b border-gray-800 pb-2">
                                    <span>Oct 24, 2023</span>
                                    <span>Course Purchase: Tech English</span>
                                    <span className="text-white">R$ 497,00</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 border-b border-gray-800 pb-2">
                                    <span>Oct 20, 2023</span>
                                    <span>Lesson: Sarah Connor</span>
                                    <span className="text-white">R$ 150,00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Bar */}
                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-cyan-900/20 transition-all flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};