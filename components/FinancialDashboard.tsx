
import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';

// Mock Data for demonstration
const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'tx1', date: '2023-10-24', description: 'Class with Alice Freeman', type: 'CLASS', grossAmount: 150, platformFee: 30, netAmount: 120, status: 'AVAILABLE' },
    { id: 'tx2', date: '2023-10-23', description: 'Course Sale: Tech English', type: 'COURSE_SALE', grossAmount: 497, platformFee: 99.4, netAmount: 397.6, status: 'PENDING' },
    { id: 'tx3', date: '2023-10-20', description: 'Class with Bob Smith', type: 'CLASS', grossAmount: 150, platformFee: 30, netAmount: 120, status: 'PAID' },
    { id: 'tx4', date: '2023-10-15', description: 'Weekly Payout', type: 'PAYOUT', grossAmount: 0, platformFee: 0, netAmount: -850, status: 'PAID' },
    { id: 'tx5', date: '2023-10-14', description: 'Class with Charlie', type: 'CLASS', grossAmount: 150, platformFee: 30, netAmount: 120, status: 'PAID' },
];

export const FinancialDashboard: React.FC<{ language: 'EN' | 'PT' }> = ({ language }) => {
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const isPT = language === 'PT';

    // Calculate Balances
    const availableBalance = transactions
        .filter(t => t.status === 'AVAILABLE')
        .reduce((acc, t) => acc + t.netAmount, 0);

    const pendingBalance = transactions
        .filter(t => t.status === 'PENDING')
        .reduce((acc, t) => acc + t.netAmount, 0);

    const lifetimeEarnings = transactions
        .filter(t => t.type !== 'PAYOUT')
        .reduce((acc, t) => acc + t.netAmount, 0);

    const handleWithdraw = () => {
        const newTx: Transaction = {
            id: `tx${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            description: isPT ? 'Solicitação de Saque Manual' : 'Manual Payout Request',
            type: 'PAYOUT',
            grossAmount: 0,
            platformFee: 0,
            netAmount: -availableBalance,
            status: 'PROCESSING'
        };
        
        // Optimistic update
        setTransactions(prev => [newTx, ...prev.map(t => t.status === 'AVAILABLE' ? { ...t, status: 'PAID' as const } : t)]);
        setIsWithdrawModalOpen(false);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">{isPT ? 'Visão Geral Financeira' : 'Financial Overview'}</h2>
                    <p className="text-gray-400 text-sm">{isPT ? 'Acompanhe seus ganhos e gerencie saques.' : 'Track your earnings and manage payouts.'}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold">{isPT ? 'Próximo Pagamento Automático' : 'Next Automatic Payout'}</p>
                    <p className="text-white font-mono">{isPT ? 'Terça, 31 Out' : 'Tuesday, Oct 31'}</p>
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-900/40 to-black border border-green-500/30 p-6 rounded-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-green-400 text-xs font-bold uppercase tracking-wider mb-1">{isPT ? 'Disponível para Saque' : 'Available for Withdrawal'}</p>
                        <h3 className="text-4xl font-bold text-white mb-4">R$ {availableBalance.toFixed(2)}</h3>
                        <button 
                            onClick={() => setIsWithdrawModalOpen(true)}
                            disabled={availableBalance <= 0}
                            className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-lg"
                        >
                            {isPT ? 'Solicitar Saque PIX' : 'Request PIX Payout'}
                        </button>
                    </div>
                    <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <p className="text-yellow-500 text-xs font-bold uppercase tracking-wider mb-1">{isPT ? 'Pendente (Garantia)' : 'Pending (Escrow)'}</p>
                    <h3 className="text-3xl font-bold text-white mb-2">R$ {pendingBalance.toFixed(2)}</h3>
                    <p className="text-xs text-gray-500">
                        {isPT 
                            ? 'Fundos retidos até a conclusão da aula ou fim da garantia do curso (7 dias).' 
                            : 'Funds are held securely until the class is completed or the 7-day course guarantee period ends.'}
                    </p>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <p className="text-cyan-500 text-xs font-bold uppercase tracking-wider mb-1">{isPT ? 'Ganhos Totais Líquidos' : 'Lifetime Net Earnings'}</p>
                    <h3 className="text-3xl font-bold text-white mb-2">R$ {lifetimeEarnings.toFixed(2)}</h3>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full mt-4">
                        <div className="bg-cyan-500 h-1.5 rounded-full w-[75%]"></div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 text-right">{isPT ? 'Top 10% dos professores' : 'Top 10% of teachers'}</p>
                </div>
            </div>

            {/* Revenue Chart (CSS Only Mock) */}
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-6">{isPT ? 'Tendência de Receita (6 Meses)' : 'Revenue Trend (Last 6 Months)'}</h3>
                <div className="flex items-end justify-between h-40 gap-2 px-2">
                    {[35, 50, 45, 70, 60, 85].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end group">
                            <div 
                                className="w-full bg-cyan-900/50 group-hover:bg-cyan-500 transition-all rounded-t-sm relative" 
                                style={{ height: `${h}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    R${h * 100}
                                </div>
                            </div>
                            <p className="text-center text-xs text-gray-500 mt-2 font-mono">
                                {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ledger */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">{isPT ? 'Extrato de Transações' : 'Transaction Ledger'}</h3>
                    <button className="text-xs text-cyan-400 hover:text-white flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        {isPT ? 'Exportar CSV' : 'Export CSV'}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-900/50 text-xs uppercase font-bold text-gray-500">
                            <tr>
                                <th className="p-4">{isPT ? 'Data' : 'Date'}</th>
                                <th className="p-4">{isPT ? 'Descrição' : 'Description'}</th>
                                <th className="p-4">{isPT ? 'Tipo' : 'Type'}</th>
                                <th className="p-4 text-right">{isPT ? 'Bruto' : 'Gross'}</th>
                                <th className="p-4 text-right text-red-400">{isPT ? 'Taxa' : 'Fee'}</th>
                                <th className="p-4 text-right text-green-400">{isPT ? 'Líquido' : 'Net'}</th>
                                <th className="p-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4 font-mono text-xs">{tx.date}</td>
                                    <td className="p-4 text-white font-medium">{tx.description}</td>
                                    <td className="p-4">
                                        <span className={`text-[10px] px-2 py-1 rounded border ${
                                            tx.type === 'CLASS' ? 'bg-blue-900/20 border-blue-800 text-blue-400' :
                                            tx.type === 'COURSE_SALE' ? 'bg-purple-900/20 border-purple-800 text-purple-400' :
                                            'bg-gray-800 border-gray-700 text-gray-400'
                                        }`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {tx.type === 'PAYOUT' ? '-' : `R$ ${tx.grossAmount.toFixed(2)}`}
                                    </td>
                                    <td className="p-4 text-right text-red-400/80">
                                        {tx.platformFee > 0 ? `- R$ ${tx.platformFee.toFixed(2)}` : '-'}
                                    </td>
                                    <td className={`p-4 text-right font-bold ${tx.netAmount > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                                        {tx.netAmount > 0 ? '+' : ''} R$ {Math.abs(tx.netAmount).toFixed(2)}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`text-[10px] font-bold uppercase ${
                                            tx.status === 'AVAILABLE' ? 'text-green-400' :
                                            tx.status === 'PENDING' ? 'text-yellow-500' :
                                            tx.status === 'PROCESSING' ? 'text-blue-400 animate-pulse' :
                                            'text-gray-500'
                                        }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Withdraw Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">{isPT ? 'Confirmar Saque' : 'Confirm Withdrawal'}</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            {isPT ? 'Você está solicitando um saque de' : 'You are requesting a payout of'} <span className="text-white font-bold">R$ {availableBalance.toFixed(2)}</span>.
                        </p>
                        <div className="bg-gray-800 p-3 rounded-lg mb-6">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">{isPT ? 'Chave PIX de Destino' : 'Destination PIX Key'}</p>
                            <p className="text-white font-mono">user@email.com</p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setIsWithdrawModalOpen(false)}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg font-bold"
                            >
                                {isPT ? 'Cancelar' : 'Cancel'}
                            </button>
                            <button 
                                onClick={handleWithdraw}
                                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                            >
                                {isPT ? 'Confirmar' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
