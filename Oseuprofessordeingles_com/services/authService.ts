
import { supabase } from './supabaseClient';
import { User, UserRole } from '../types';
import { getEnv } from '../utils/env';

// Helper to check if DB is active
const isDbConnected = () => {
    const url = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
    return !!url && !!supabase;
};

// Map Supabase user to our App User type
const mapUser = (sbUser: any, profile: any): User => {
    return {
        id: sbUser.id,
        email: sbUser.email || '',
        name: profile?.full_name || sbUser.email?.split('@')[0] || 'User',
        role: profile?.role?.toLowerCase() || UserRole.STUDENT,
        avatarUrl: profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || 'User'}&background=0D8ABC&color=fff`,
        level: profile?.level,
        goal: profile?.goal,
        onboardingCompleted: !!profile?.onboarding_completed,
        teacherProfileId: profile?.teacher_id, 
        notifications: profile?.notifications || { email: true, sms: false, promotions: true }
    };
};

export const authService = {
    async signUp(email: string, password: string, data: { name: string, role: UserRole, level?: string, goal?: string }) {
        if (!isDbConnected()) {
            console.log("Mock SignUp:", email);
            return new Promise<User>((resolve) => {
                setTimeout(() => {
                    resolve({
                        id: `mock_${Date.now()}`,
                        email,
                        name: data.name,
                        role: data.role,
                        avatarUrl: `https://ui-avatars.com/api/?name=${data.name}&background=0D8ABC&color=fff`,
                        level: data.level as any,
                        goal: data.goal,
                        onboardingCompleted: data.role === UserRole.TEACHER // Auto complete for mock teachers
                    });
                }, 1000);
            });
        }

        // Real Implementation
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("No user created");

        // Create Profile
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([
                {
                    id: authData.user.id,
                    full_name: data.name,
                    role: data.role,
                    level: data.level,
                    goal: data.goal,
                    avatar_url: `https://ui-avatars.com/api/?name=${data.name}&background=0D8ABC&color=fff`,
                    onboarding_completed: data.role === UserRole.STUDENT ? false : true
                }
            ]);

        if (profileError) {
            console.error("Profile creation failed", profileError);
        }

        return mapUser(authData.user, { ...data, full_name: data.name });
    },

    async signIn(email: string, password: string) {
        if (!isDbConnected()) {
            // Mock Fallback
            return new Promise<User>((resolve) => {
                setTimeout(() => {
                    resolve({
                        id: 'mock_u1',
                        email,
                        name: 'Demo User (Mock)',
                        role: UserRole.STUDENT,
                        avatarUrl: 'https://via.placeholder.com/150',
                        onboardingCompleted: true
                    });
                }, 1000);
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        if (!data.user) throw new Error("Login failed");

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        return mapUser(data.user, profile);
    },

    async signOut() {
        if (isDbConnected()) {
            await supabase.auth.signOut();
        }
    },

    async getCurrentUser(): Promise<User | null> {
        if (!isDbConnected()) return null;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return null;

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            return mapUser(session.user, profile);
        } catch (e) {
            console.error("Error fetching current user", e);
            return null;
        }
    },

    async updateProfile(userId: string, updates: Partial<User>) {
        if (!isDbConnected()) return;

        const dbUpdates = {
            full_name: updates.name,
            level: updates.level,
            goal: updates.goal,
            onboarding_completed: updates.onboardingCompleted,
            avatar_url: updates.avatarUrl,
        };

        const { error } = await supabase
            .from('profiles')
            .update(dbUpdates)
            .eq('id', userId);

        if (error) throw error;
    }
};
