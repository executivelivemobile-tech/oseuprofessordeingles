
import { supabase } from './supabaseClient';
import { User, UserRole } from '../types';

const MASTER_CREDENTIALS = {
  email: 'admin@platform.com',
  pass: 'master99'
};

const SESSION_STORAGE_KEY = 'ospi_synthetic_session';

export const authService = {
  // Verifica se existe uma sessão "Master" salva manualmente
  getSyntheticSession(): User | null {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  async signIn(email: string, password: string): Promise<User> {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Prioridade Máxima: BYPASS ADMIN MASTER
    if (cleanEmail === MASTER_CREDENTIALS.email && password === MASTER_CREDENTIALS.pass) {
      const adminUser: User = {
        id: 'root_master_01',
        email: cleanEmail,
        name: 'ADMIN MASTER',
        role: UserRole.SUPERADMIN,
        avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=ef4444&color=fff',
        isRoot: true,
        onboardingCompleted: true
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(adminUser));
      return adminUser;
    }

    // 2. Fluxo Real Supabase
    if (!supabase) throw new Error("Database Link Offline.");

    const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
    if (error) throw error;

    // Buscar Perfil do Banco
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
        // Fallback para usuário sem perfil (previne quebra no primeiro login)
        return {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.full_name || 'New User',
            role: UserRole.STUDENT,
            avatarUrl: `https://ui-avatars.com/api/?name=${data.user.email}`,
            onboardingCompleted: false
        };
    }

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

  async signOut() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    if (supabase) await supabase.auth.signOut();
  },

  async getCurrentUser(): Promise<User | null> {
    // Primeiro checa se há sessão sintética (Admin)
    const synthetic = this.getSyntheticSession();
    if (synthetic) return synthetic;

    // Depois checa Supabase
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    try {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        return profile ? { 
            id: profile.id,
            email: session.user.email!,
            name: profile.full_name,
            role: profile.role,
            avatarUrl: profile.avatar_url,
            onboardingCompleted: profile.onboarding_completed
        } : null;
    } catch {
        return null;
    }
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<void> {
    const synthetic = this.getSyntheticSession();
    if (synthetic && userId === synthetic.id) {
        const newUser = { ...synthetic, ...updates };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
        return;
    }

    if (!supabase) return;
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.full_name = updates.name;
    if (updates.avatarUrl) dbUpdates.avatar_url = updates.avatarUrl;
    if (updates.onboardingCompleted !== undefined) dbUpdates.onboarding_completed = updates.onboardingCompleted;

    const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', userId);
    if (error) throw error;
  },

  // FIX: Added updatePassword method to handle security updates requested by SettingsView
  /**
   * Updates user password for both synthetic admin session and Supabase real users.
   * @param email The user email
   * @param currentPass Current password for validation
   * @param newPass New password to set
   */
  async updatePassword(email: string, currentPass: string, newPass: string): Promise<void> {
    const synthetic = this.getSyntheticSession();
    if (synthetic && email.toLowerCase().trim() === synthetic.email) {
      // Mock validation for Master Account synthetic session
      if (currentPass !== MASTER_CREDENTIALS.pass) {
        throw new Error("Invalid current password.");
      }
      // Since it's a fixed credential in code, we just simulate success
      return;
    }

    if (!supabase) throw new Error("Database Link Offline.");
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) throw error;
  }
};
