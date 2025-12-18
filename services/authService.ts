import { supabase } from './supabaseClient';
import { User, UserRole } from '../types';
import { getEnv } from '../utils/env';

// Estado persistente para mock
let mockPasswords: Record<string, string> = {
    'admin@platform.com': 'master99',
    'teacher@platform.com': 'teacher123',
    'student@test.com': 'student123'
};

const isDbConnected = () => !!getEnv('SUPABASE_URL') && !!supabase;

export const authService = {
    async signIn(email: string, password: string): Promise<User> {
        const cleanEmail = email.toLowerCase().trim();
        
        // --- BYPASS LOGIC PARA ADMIN MASTER ---
        if (cleanEmail === 'admin@platform.com' && password === 'master99') {
            return {
                id: 'root_master_01',
                email: cleanEmail,
                name: 'ADMIN MASTER',
                role: UserRole.SUPERADMIN,
                avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=ef4444&color=fff',
                isRoot: true,
                onboardingCompleted: true
            };
        }

        // --- BYPASS LOGIC PARA TEACHER MOCK ---
        if (cleanEmail === 'teacher@platform.com' && password === 'teacher123') {
            return {
                id: 't1',
                email: cleanEmail,
                name: 'Sarah Connor',
                role: UserRole.TEACHER,
                avatarUrl: 'https://picsum.photos/seed/sarah/200/200',
                teacherProfileId: 't1',
                onboardingCompleted: true
            };
        }

        if (!isDbConnected()) {
            const storedPassword = mockPasswords[cleanEmail];
            if (storedPassword && storedPassword === password) {
                return {
                    id: `mock_${Date.now()}`,
                    email: cleanEmail,
                    name: 'Beta User',
                    role: UserRole.STUDENT,
                    avatarUrl: 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff',
                    onboardingCompleted: true
                };
            }
            throw new Error("Invalid credentials in Mock Mode.");
        }

        // Lógica Supabase real
        const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) throw error;
        
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        return {
            id: data.user.id,
            email: data.user.email!,
            name: profile.full_name,
            role: profile.role,
            avatarUrl: profile.avatar_url,
            isRoot: profile.is_root,
            onboardingCompleted: profile.onboarding_completed
        };
    },

    async signUp(email: string, password: string, profile: Partial<User>): Promise<User> {
        const cleanEmail = email.toLowerCase().trim();
        if (!isDbConnected()) {
            mockPasswords[cleanEmail] = password;
            return {
                id: `mock_${Date.now()}`,
                email: cleanEmail,
                name: profile.name || 'New User',
                role: profile.role || UserRole.STUDENT,
                avatarUrl: `https://ui-avatars.com/api/?name=${profile.name || 'User'}`,
                onboardingCompleted: false
            } as User;
        }
        
        const { data, error } = await supabase.auth.signUp({ email: cleanEmail, password });
        if (error) throw error;
        const { data: profileData } = await supabase.from('profiles').insert([{ id: data.user!.id, full_name: profile.name, role: profile.role }]).select().single();
        return { ...profileData, email: data.user!.email };
    },

    async signOut() { 
        if (isDbConnected()) await supabase.auth.signOut(); 
    },
    
    async getCurrentUser(): Promise<User | null> {
        if (!isDbConnected()) return null;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        return profile ? { ...profile, email: session.user.email } : null;
    },

    // Added updateProfile to support user updates in App.tsx
    async updateProfile(userId: string, updates: Partial<User>): Promise<void> {
        if (!isDbConnected()) {
            console.log("Mock Profile Update:", userId, updates);
            return;
        }
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.full_name = updates.name;
        if (updates.avatarUrl) dbUpdates.avatar_url = updates.avatarUrl;
        if (updates.onboardingCompleted !== undefined) dbUpdates.onboarding_completed = updates.onboardingCompleted;
        if (updates.level) dbUpdates.level = updates.level;
        if (updates.timezone) dbUpdates.timezone = updates.timezone;
        if (updates.notifications) dbUpdates.notifications = updates.notifications;

        const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', userId);
        if (error) throw error;
    },

    // Added updatePassword to support password changes in SettingsView.tsx
    async updatePassword(email: string, current: string, newPass: string): Promise<void> {
        if (!isDbConnected()) {
            if (mockPasswords[email] === current) {
                mockPasswords[email] = newPass;
                return;
            }
            throw new Error("Current password mismatch in Mock Mode.");
        }
        const { error } = await supabase.auth.updateUser({ password: newPass });
        if (error) throw error;
    }
};