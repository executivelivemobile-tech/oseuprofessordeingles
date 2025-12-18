
import { PercentageRule, Transaction, RuleScope } from '../types';

// Estado Mock das Regras (Em prod viria do DB)
let activeRules: PercentageRule[] = [
    { id: 'rule_global', scope: 'GLOBAL', platformFeePercent: 15, active: true, description: 'Taxa Padrão da Plataforma', updatedAt: '2023-10-01', updatedBy: 'Sytem' },
    { id: 'rule_t1', scope: 'TEACHER', teacherId: 't1', platformFeePercent: 10, active: true, description: 'Taxa Promocional Sarah Connor', updatedAt: '2023-10-15', updatedBy: 'Master' },
    { id: 'rule_c1', scope: 'ITEM', itemType: 'COURSE', itemId: 'c1', platformFeePercent: 5, active: true, description: 'Taxa Lançamento Curso Dev', updatedAt: '2023-10-20', updatedBy: 'Master' },
];

export const pricingService = {
    getRules() { return activeRules; },

    saveRule(adminId: string, rule: Partial<PercentageRule>) {
        const newRule = {
            ...rule,
            id: rule.id || `rule_${Date.now()}`,
            updatedAt: new Date().toISOString(),
            updatedBy: adminId,
            active: true
        } as PercentageRule;

        activeRules = [newRule, ...activeRules.filter(r => r.id !== newRule.id)];
        return newRule;
    },

    /**
     * CORE LOGIC: Resolve a porcentagem final baseada na cascata de prioridade.
     * ITEM > TEACHER > GLOBAL
     */
    resolveFeePercent(teacherId: string, itemId?: string, itemType?: 'LESSON' | 'PACKAGE' | 'COURSE'): number {
        // 1. Check Item Rule
        if (itemId) {
            const itemRule = activeRules.find(r => r.scope === 'ITEM' && r.itemId === itemId && r.active);
            if (itemRule) return itemRule.platformFeePercent;
        }

        // 2. Check Teacher Rule
        const teacherRule = activeRules.find(r => r.scope === 'TEACHER' && r.teacherId === teacherId && r.active);
        if (teacherRule) return teacherRule.platformFeePercent;

        // 3. Fallback to Global
        const globalRule = activeRules.find(r => r.scope === 'GLOBAL' && r.active);
        return globalRule ? globalRule.platformFeePercent : 15; // Hardcoded safety fallback
    },

    calculateSplit(grossAmount: number, teacherId: string, itemId?: string): Partial<Transaction> {
        const feePercent = this.resolveFeePercent(teacherId, itemId);
        const platformFee = (grossAmount * feePercent) / 100;
        const netAmount = grossAmount - platformFee;

        return {
            grossAmount,
            platformFee,
            platformFeePercent: feePercent,
            netAmount,
            teacherId
        };
    }
};
