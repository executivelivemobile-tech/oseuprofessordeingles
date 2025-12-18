
import React, { useState, useEffect } from 'react';
import { Teacher, Dispute, Transaction, PercentageRule, AuditLog, UserRole } from '../types';
import { ContentEngine } from './ContentEngine';
import { AdminDisputeCenter } from './AdminDisputeCenter';
import { SystemConfiguration } from './SystemConfiguration';
import { dataService } from '../services/dataService';
import { pricingService } from '../services/pricingService';

interface AdminDashboardProps {
  teachers: Teacher[];
  onVerifyTeacher: (id: string) => void;
  onDeleteTeacher: (id: string) => void;
  disputes?: Dispute[]; 
  onResolveDispute?: (id: string, res: any) => void; 
  onRefreshData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    teachers, 
    onVerifyTeacher, 
    onDeleteTeacher,
    disputes = [],
    onResolveDispute,
    onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PRICING' | 'FINANCIALS' | 'LOGS' | 'CONTENT' | 'SYSTEM'>('OVERVIEW');
  const [rules, setRules] = useState<PercentageRule[]>(pricingService.getRules());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
      { id: 'l1', adminId: 'm1', adminName: 'Master Admin', action: 'UPDATE_FEE_GLOBAL', targetId: 'GLOBAL', changes: { before: 20, after: 15 }, timestamp: '2023-10-25 10:00', severity: 'CRITICAL' },
      { id: 'l2', adminId: 'm1', adminName: 'Master Admin', action: 'VERIFY_TEACHER', targetId: 't1', changes: { before: false, after: true }, timestamp: '2023-10-25 11:30', severity: 'INFO' },
  ]);

  const [simulatedPrice, setSimulatedPrice] = useState(100);
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '');

  const splitPreview = pricingService.calculateSplit(simulatedPrice, selectedTeacherId);

  const handleSaveRule = (rule: Partial<PercentageRule>) => {
      const saved = pricingService.saveRule('root_master_01', rule);
      setRules(pricingService.getRules());
      
      // Log de Auditoria
      const log: AuditLog = {
          id: `log_${Date.now()}`,
          adminId: 'root_master_01',
          adminName: 'ADMIN MASTER',
          action: 'SAVE_RULE',
          targetId: rule.scope || 'GLOBAL',
          changes: { before: 'N/A', after: saved },
          timestamp: new Date().toLocaleString(),
          severity: 'CRITICAL'
      };
      setAuditLogs(prev => [log, ...prev]);
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-20 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-red-900/30 pb-6">
          <div>
              <h1 className="text-4xl font-bold text-white font-orbitron tracking-tighter flex items-center gap-3">
                  <span className="bg-red-600 px-2 rounded text-black text-2xl">MASTER</span>
                  COMMAND_CENTER
              </h1>
              <p className="text-red-500 font-mono text-[10px] mt-1 animate-pulse uppercase tracking-[0.2em]">Sessão de Superadmin Ativa: Acesso Total</p>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-full pb-2">
              {[
                {id: 'OVERVIEW', label: 'Painel'},
                {id: 'PRICING', label: 'Regras de Taxa'},
                {id: 'FINANCIALS', label: 'Relatórios'},
                {id: 'LOGS', label: 'Auditoria'},
                {id: 'CONTENT', label: 'IA Content'},
                {id: 'SYSTEM', label: 'System'}
              ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${
                        activeTab === tab.id ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'text-gray-400 hover:text-white bg-gray-900/50 border border-gray-800'
                    }`}
                >
                    {tab.label}
                </button>
              ))}
          </div>
      </div>

      {activeTab === 'OVERVIEW' && (
          <div className="animate-fade-in space-y-8">
              {/* KPIs de BI */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Total Movimentado (GMV)</p>
                      <h3 className="text-2xl font-bold text-white font-mono">R$ 142.900</h3>
                      <div className="mt-2 text-green-500 text-[10px] font-bold">↑ 22% este mês</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Receita Plataforma (Net)</p>
                      <h3 className="text-2xl font-bold text-cyan-400 font-mono">R$ 21.435</h3>
                      <div className="text-[10px] text-gray-500">Take Rate Avg: 15%</div>
                  </div>
                  <div className="bg-gray-900 border border-red-900/30 p-6 rounded-2xl bg-gradient-to-br from-red-900/10 to-transparent">
                      <p className="text-red-400 text-[10px] uppercase font-bold tracking-widest mb-1">Payouts Pendentes</p>
                      <h3 className="text-2xl font-bold text-white font-mono">R$ 12.400</h3>
                      <div className="mt-2 animate-pulse text-red-500 text-[10px]">Ação Necessária</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Contas sob Revisão</p>
                      <h3 className="text-2xl font-bold text-yellow-500 font-mono">{teachers.filter(t => !t.verified).length}</h3>
                      <div className="text-[10px] text-gray-500">Compliance Check</div>
                  </div>
              </div>

              {/* Simulador de Split para o Master */}
              <div className="bg-black/50 border border-gray-800 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      Simulador de Split (Validação de Regras)
                  </h3>
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                      <div>
                          <label className="block text-[10px] text-gray-500 font-bold uppercase mb-2">Valor da Venda (R$)</label>
                          <input 
                            type="number" 
                            value={simulatedPrice} 
                            onChange={(e) => setSimulatedPrice(Number(e.target.value))}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none font-mono"
                          />
                      </div>
                      <div>
                          <label className="block text-[10px] text-gray-500 font-bold uppercase mb-2">Selecionar Professor</label>
                          <select 
                            value={selectedTeacherId}
                            onChange={(e) => setSelectedTeacherId(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none"
                          >
                              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                      </div>
                      <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 flex justify-between items-center">
                          <div>
                              <p className="text-[10px] text-gray-500 font-bold uppercase">Resultado do Split</p>
                              <div className="flex gap-4 mt-1">
                                  <div className="text-center">
                                      <p className="text-[9px] text-cyan-500 font-bold">PLATAFORMA ({splitPreview.platformFeePercent}%)</p>
                                      <p className="text-xl font-bold text-white font-mono">R$ {splitPreview.platformFee?.toFixed(2)}</p>
                                  </div>
                                  <div className="w-px h-8 bg-gray-700"></div>
                                  <div className="text-center">
                                      <p className="text-[9px] text-purple-500 font-bold">PROFESSOR</p>
                                      <p className="text-xl font-bold text-white font-mono">R$ {splitPreview.netAmount?.toFixed(2)}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'PRICING' && (
          <div className="animate-fade-in space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Configuração de Taxas e Comissões</h3>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead>
                              <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-800">
                                  <th className="pb-4">Escopo (Prioridade)</th>
                                  <th className="pb-4">Alvo</th>
                                  <th className="pb-4 text-center">Taxa (%)</th>
                                  <th className="pb-4">Descrição</th>
                                  <th className="pb-4">Última Alteração</th>
                                  <th className="pb-4 text-right">Ação</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800/50">
                              {rules.map(rule => (
                                  <tr key={rule.id} className="text-sm">
                                      <td className="py-4">
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                              rule.scope === 'ITEM' ? 'bg-purple-900/30 text-purple-400 border border-purple-800' :
                                              rule.scope === 'TEACHER' ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800' :
                                              'bg-gray-800 text-gray-400'
                                          }`}>
                                              {rule.scope} {rule.scope === 'ITEM' ? '(1)' : rule.scope === 'TEACHER' ? '(2)' : '(3)'}
                                          </span>
                                      </td>
                                      <td className="py-4 text-white font-bold">{rule.teacherId || rule.itemId || 'GLOBAL'}</td>
                                      <td className="py-4 text-center text-green-400 font-mono font-bold text-lg">{rule.platformFeePercent}%</td>
                                      <td className="py-4 text-gray-500 italic">{rule.description}</td>
                                      <td className="py-4 text-[10px] text-gray-500 font-mono">{rule.updatedAt}<br/>por {rule.updatedBy}</td>
                                      <td className="py-4 text-right">
                                          <button onClick={() => alert("Editor de regra aqui...")} className="text-cyan-400 hover:text-white text-xs font-bold">EDITAR</button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  <button 
                    onClick={() => handleSaveRule({ scope: 'TEACHER', teacherId: 't2', platformFeePercent: 20, description: 'Nova regra de teste' })}
                    className="mt-6 bg-cyan-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg"
                  >
                      + Criar Nova Regra
                  </button>
              </div>
          </div>
      )}

      {activeTab === 'LOGS' && (
          <div className="bg-black border border-gray-800 rounded-2xl p-6 font-mono text-xs h-[600px] overflow-y-auto animate-fade-in custom-scrollbar">
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                  <h3 className="text-white font-bold text-sm">SECURITY_AUDIT_LOG_STREAM</h3>
                  <span className="text-red-500 animate-pulse">● LIVE_FEED</span>
              </div>
              <div className="space-y-3">
                  {auditLogs.map(log => (
                      <div key={log.id} className="border-l-2 border-gray-800 pl-4 py-2 hover:bg-white/5 transition-colors">
                          <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-gray-500">{log.timestamp}</span>
                              <span className={`${log.severity === 'CRITICAL' ? 'text-red-500' : 'text-cyan-500'} font-bold`}>[{log.severity}]</span>
                          </div>
                          <p className="text-white">
                              <span className="text-cyan-400">{log.adminName}</span> executou <span className="text-yellow-400">{log.action}</span> em <span className="text-purple-400">{log.targetId}</span>
                          </p>
                          <div className="mt-1 text-gray-500 flex gap-4">
                              <span>PREV: {JSON.stringify(log.changes.before)}</span>
                              <span>NEW: {JSON.stringify(log.changes.after)}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {activeTab === 'CONTENT' && <ContentEngine />}
      {activeTab === 'SYSTEM' && <SystemConfiguration />}
    </div>
  );
};
