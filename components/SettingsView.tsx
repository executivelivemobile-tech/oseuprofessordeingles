
import React, { useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

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

  // Password Change States
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
  const [passStatus, setPassStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
      setIsLoading(true);
      setTimeout(() => {
          onUpdateUser({
              name: formData.name,
              avatarUrl: formData.avatarUrl,
              timezone: formData.timezone,
              notifications: formData.notifications
          });
          setIsLoading(false);
          alert('Configurações de perfil atualizadas!');
      }, 1000);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (passData.new !== passData.confirm) {
          setPassStatus('ERROR');
          setErrorMsg("As novas senhas não coincidem.");
          return;
      }

      setPassStatus('LOADING');
      try {
          await authService.updatePassword(currentUser.email, passData.current, passData.new);
          setPassStatus('SUCCESS');
          setPassData({ current: '', new: '', confirm: '' });
          setTimeout(() => setPassStatus('IDLE'), 3000);
      } catch (err: any) {
          setPassStatus('ERROR');
          setErrorMsg(err.message || "Erro ao atualizar senha.");
      }
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
        <h1 className="text-3xl font-bold text-white mb-8 font-orbitron">CONTROL_PANEL</h1>

        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-left p-4 text-xs font-black tracking-widest uppercase flex items-center gap-3 transition-all ${
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
            <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none"></div>
                
                {activeTab === 'PROFILE' && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-bold text-white mb-6">Informações Públicas</h2>
                        
                        <div className="flex items-center gap-6 mb-8 bg-black/20 p-4 rounded-2xl border border-gray-800">
                            <img src={formData.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-cyan-500/30 object-cover shadow-lg" />
                            <div className="flex-1">
                                <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Caminho da Imagem</label>
                                <input 
                                    value={formData.avatarUrl}
                                    onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Nome de Exibição</label>
                                <input 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">E-mail do Sistema (ID)</label>
                                <input 
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-gray-800/50 border border-gray-800 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed font-mono text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Fuso Horário Operacional</label>
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
                        </div>
                    </div>
                )}

                {activeTab === 'SECURITY' && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-bold text-white mb-6">Segurança e Acesso</h2>
                        
                        <form onSubmit={handlePasswordUpdate} className="bg-black/30 p-6 rounded-2xl border border-gray-800 relative">
                            {passStatus === 'SUCCESS' && (
                                <div className="absolute inset-0 bg-green-900/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl animate-fade-in">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <p className="text-white font-bold uppercase tracking-widest text-xs">Senha Re-Criptografada</p>
                                </div>
                            )}

                            <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                                Alterar Chave de Segurança
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Senha Atual</label>
                                    <input 
                                        type="password" 
                                        required
                                        value={passData.current}
                                        onChange={(e) => setPassData({...passData, current: e.target.value})}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none font-mono" 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Nova Senha</label>
                                        <input 
                                            type="password" 
                                            required
                                            value={passData.new}
                                            onChange={(e) => setPassData({...passData, new: e.target.value})}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none font-mono" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Confirmar Nova</label>
                                        <input 
                                            type="password" 
                                            required
                                            value={passData.confirm}
                                            onChange={(e) => setPassData({...passData, confirm: e.target.value})}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none font-mono" 
                                        />
                                    </div>
                                </div>

                                {passStatus === 'ERROR' && (
                                    <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter">Erro: {errorMsg}</p>
                                )}

                                <button 
                                    type="submit"
                                    disabled={passStatus === 'LOADING'}
                                    className="bg-gray-800 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-600 hover:border-cyan-400 transition-all flex items-center gap-2"
                                >
                                    {passStatus === 'LOADING' ? 'Processando...' : 'Atualizar Acesso'}
                                </button>
                            </div>
                        </form>

                        <div className="border-t border-gray-800 pt-6">
                            <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-tighter">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Protocolo de Auto-Destruição
                            </h3>
                            <p className="text-gray-500 text-xs mb-4">A deleção da conta é permanente e todos os certificados, cursos e históricos de aula serão purgados dos nossos servidores.</p>
                            <button className="text-red-500 hover:bg-red-900/20 border border-red-500/50 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                                Encerrar Conta Definitivamente
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'NOTIFICATIONS' && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-bold text-white mb-6">Protocolos de Notificação</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-gray-800 group hover:border-cyan-500/30 transition-all">
                                <div>
                                    <h4 className="text-white font-bold text-sm">Alertas via E-mail</h4>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Booking confirms & Receipts</p>
                                </div>
                                <div 
                                    onClick={() => toggleNotification('email')}
                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.notifications.email ? 'bg-cyan-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.notifications.email ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-gray-800 group hover:border-cyan-500/30 transition-all">
                                <div>
                                    <h4 className="text-white font-bold text-sm">Reminders via SMS</h4>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">1h before target mission</p>
                                </div>
                                <div 
                                    onClick={() => toggleNotification('sms')}
                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.notifications.sms ? 'bg-cyan-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.notifications.sms ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'BILLING' && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-bold text-white mb-6">Canais de Faturamento</h2>
                        
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-900 to-black rounded-2xl border border-gray-800">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-bold text-sm">Mastercard •••• 4242</p>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Expires 12/25</p>
                            </div>
                            <button className="text-red-400 hover:text-red-300 text-[10px] font-black tracking-widest">REMOVE</button>
                        </div>

                        <button className="w-full border border-dashed border-gray-700 hover:border-cyan-500 hover:text-cyan-400 text-gray-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                            + Link New Financial Channel
                        </button>
                    </div>
                )}

                {/* Save Bar */}
                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end gap-4">
                    <button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-10 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-cyan-900/30 transition-all flex items-center gap-2"
                    >
                        {isLoading ? 'SYNCING...' : 'COMMIT_CHANGES'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
