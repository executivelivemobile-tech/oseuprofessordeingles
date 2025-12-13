
import React, { useState } from 'react';
import { Teacher, Dispute } from '../types';
import { ContentEngine } from './ContentEngine';
import { AdminDisputeCenter } from './AdminDisputeCenter';
import { SystemConfiguration } from './SystemConfiguration';
import { dataService } from '../services/dataService';

interface AdminDashboardProps {
  teachers: Teacher[];
  onVerifyTeacher: (id: string) => void;
  onDeleteTeacher: (id: string) => void;
  disputes?: Dispute[]; 
  onResolveDispute?: (id: string, res: any) => void; 
  onRefreshData?: () => void; // New prop to trigger App refresh
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    teachers, 
    onVerifyTeacher, 
    onDeleteTeacher,
    disputes = [],
    onResolveDispute,
    onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CONTENT_ENGINE' | 'DISPUTES' | 'SYSTEM' | 'DATABASE'>('OVERVIEW');
  const [isSeeding, setIsSeeding] = useState(false);
  
  const pendingTeachers = teachers.filter(t => !t.verified);
  const activeTeachers = teachers.filter(t => t.verified);
  const openDisputeCount = disputes.filter(d => d.status === 'OPEN').length;

  const handleSeedDatabase = async () => {
      if (!confirm("Isso enviará os dados de teste (MOCK) para o banco de dados Supabase real. Continuar?")) return;
      
      setIsSeeding(true);
      try {
          const res = await dataService.seedDatabase();
          if (res.success) {
              alert("Banco de Dados Sincronizado com Sucesso! (Teachers & Courses tables populated)");
              if (onRefreshData) onRefreshData(); // Reload app data
          } else {
              alert("Erro ao sincronizar. Verifique se você criou as tabelas no Supabase SQL Editor.");
          }
      } catch (e) {
          alert("Erro de conexão. Verifique o console.");
          console.error(e);
      } finally {
          setIsSeeding(false);
      }
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <h1 className="text-4xl font-bold text-white">Admin Control Tower</h1>
          <div className="flex gap-2 mt-4 md:mt-0 overflow-x-auto pb-2 md:pb-0">
              <button 
                onClick={() => setActiveTab('OVERVIEW')}
                className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap ${activeTab === 'OVERVIEW' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                  Overview
              </button>
              <button 
                onClick={() => setActiveTab('DISPUTES')}
                className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === 'DISPUTES' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                  Disputes 
                  {openDisputeCount > 0 && <span className="bg-white text-red-600 text-[10px] px-1.5 rounded font-bold">{openDisputeCount}</span>}
              </button>
              <button 
                onClick={() => setActiveTab('CONTENT_ENGINE')}
                className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === 'CONTENT_ENGINE' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                  Content Engine <span className="bg-purple-600 text-[10px] px-1.5 rounded text-white">AI</span>
              </button>
              <button 
                onClick={() => setActiveTab('DATABASE')}
                className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === 'DATABASE' ? 'bg-green-700 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                  Database
              </button>
              <button 
                onClick={() => setActiveTab('SYSTEM')}
                className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === 'SYSTEM' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                  System
              </button>
          </div>
      </div>

      {activeTab === 'SYSTEM' && <SystemConfiguration />}

      {activeTab === 'CONTENT_ENGINE' && <ContentEngine />}

      {activeTab === 'DISPUTES' && (
          <AdminDisputeCenter 
            disputes={disputes} 
            onResolve={onResolveDispute || (() => {})} 
          />
      )}

      {activeTab === 'DATABASE' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-4">Database Operations</h2>
              <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-black/30 p-6 rounded-xl border border-gray-700">
                      <h3 className="text-lg font-bold text-white mb-2">Initial Setup (Seeding)</h3>
                      <p className="text-gray-400 text-sm mb-6">
                          Populate the remote Supabase database with the local Mock Data. 
                          <br/>
                          <span className="text-yellow-500">⚠️ Only use this if the remote tables are empty.</span>
                      </p>
                      <button 
                        onClick={handleSeedDatabase}
                        disabled={isSeeding}
                        className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2"
                      >
                          {isSeeding ? 'Syncing...' : 'Inject Mock Data to DB'}
                          {!isSeeding && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4-4m4 4V4" /></svg>}
                      </button>
                  </div>
                  <div className="bg-black/30 p-6 rounded-xl border border-gray-700 opacity-50">
                      <h3 className="text-lg font-bold text-white mb-2">Reset Tables</h3>
                      <p className="text-gray-400 text-sm mb-6">Wipe all data from Teachers and Courses tables. Irreversible.</p>
                      <button disabled className="w-full bg-red-900/50 text-gray-400 font-bold py-3 rounded-lg cursor-not-allowed">
                          Locked (Safety)
                      </button>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'OVERVIEW' && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <p className="text-gray-500 text-xs uppercase">Total Revenue (Month)</p>
                    <h3 className="text-2xl font-bold text-white">R$ 45.230,00</h3>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <p className="text-gray-500 text-xs uppercase">Platform Net (20%)</p>
                    <h3 className="text-2xl font-bold text-green-400">R$ 9.046,00</h3>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <p className="text-gray-500 text-xs uppercase">Active Teachers</p>
                    <h3 className="text-2xl font-bold text-blue-400">{activeTeachers.length}</h3>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <p className="text-gray-500 text-xs uppercase">Pending Applications</p>
                    <h3 className="text-2xl font-bold text-yellow-400">{pendingTeachers.length}</h3>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Pending Applications */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                        Pending Verifications
                    </h3>
                    
                    {pendingTeachers.length === 0 ? (
                        <p className="text-gray-500 italic">No pending applications.</p>
                    ) : (
                        <div className="space-y-4">
                            {pendingTeachers.map(teacher => (
                                <div key={teacher.id} className="bg-black/40 border border-gray-700 p-4 rounded-xl">
                                    <div className="flex items-center gap-4 mb-3">
                                        <img src={teacher.photoUrl} className="w-12 h-12 rounded-full" alt={teacher.name} />
                                        <div>
                                            <h4 className="font-bold text-white">{teacher.name}</h4>
                                            <p className="text-xs text-gray-400">{teacher.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mb-3">
                                        {teacher.niche.map(n => (
                                            <span key={n} className="text-[10px] bg-gray-800 px-2 py-1 rounded text-gray-300">{n}</span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button 
                                            onClick={() => onVerifyTeacher(teacher.id)}
                                            className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                                        >
                                            Approve & Verify
                                        </button>
                                        <button 
                                            onClick={() => onDeleteTeacher(teacher.id)}
                                            className="flex-1 bg-red-900/50 hover:bg-red-900 text-red-300 text-xs font-bold py-2 rounded-lg transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Payouts Logic (Mock) */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Recent Payouts (PIX)</h3>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex justify-between items-center text-sm border-b border-gray-800 pb-2">
                                <span className="text-gray-400">Teacher ID #T{100+i}</span>
                                <span className="text-white font-mono">R$ {Math.floor(Math.random() * 500) + 100},00</span>
                                <span className="text-green-500 text-xs font-bold border border-green-900 bg-green-900/30 px-2 py-0.5 rounded">PAID</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </>
      )}
    </div>
  );
};
