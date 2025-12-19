
import React, { useState, useEffect } from 'react';
import { MacleyWidget } from './components/MacleyWidget';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentOnboarding } from './components/StudentOnboarding';
import { ToastContainer } from './components/Toast';
import { authService } from './services/authService';
import { supabase } from './services/supabaseClient';
import { updateUserContext } from './services/geminiService';
import { User, ViewState, UserRole } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // --- BRAIN OF AUTHENTICATION ---
  useEffect(() => {
    const initializeAuth = async () => {
      setIsAuthLoading(true);
      
      // 1. Tentar recuperar usuário (Synthetic ou Real)
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        updateUserContext(user);
        // Redirecionamento inteligente pós-refresh
        if (user.role === UserRole.SUPERADMIN) setCurrentView('ADMIN_DASHBOARD');
      }

      // 2. Ouvinte Real-time para mudanças (Supabase Only)
      const { data: { subscription } } = supabase 
        ? supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              const user = await authService.getCurrentUser();
              setCurrentUser(user);
              if (user) updateUserContext(user);
            }
            if (event === 'SIGNED_OUT') {
              setCurrentUser(null);
              setCurrentView('HOME');
            }
          })
        : { data: { subscription: null } };

      setIsAuthLoading(false);
      return () => subscription?.unsubscribe();
    };

    initializeAuth();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    updateUserContext(user);
    if (user.role === UserRole.SUPERADMIN) setCurrentView('ADMIN_DASHBOARD');
    else if (user.role === UserRole.TEACHER) setCurrentView('TEACHER_DASHBOARD');
    else if (!user.onboardingCompleted) setCurrentView('STUDENT_ONBOARDING');
    else setCurrentView('STUDENT_DASHBOARD');
    
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    await authService.signOut();
    setCurrentUser(null);
    setCurrentView('HOME');
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-cyan-500 font-orbitron text-xs animate-pulse tracking-widest">VERIFYING_CREDENTIALS</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-gray-200 min-h-screen flex flex-col font-sans">
      <ToastContainer notifications={notifications} onDismiss={(id) => setNotifications(n => n.filter(x => x.id !== id))} />
      
      <Navbar 
        currentUser={currentUser} 
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        language="PT"
        onToggleLanguage={() => {}}
      />

      <main className="flex-grow">
        {currentView === 'HOME' && <HomeView currentUser={currentUser} courses={[]} onNavigateTeacher={() => {}} onNavigateCourse={() => {}} onNavigateAllCourses={() => setCurrentView('COURSES')} onFindTeacher={() => setCurrentView('FIND_TEACHER')} favoriteIds={[]} onToggleFavorite={() => {}} language="PT" />}
        {currentView === 'ADMIN_DASHBOARD' && currentUser?.role === UserRole.SUPERADMIN && <AdminDashboard teachers={[]} onVerifyTeacher={() => {}} onDeleteTeacher={() => {}} />}
        {currentView === 'STUDENT_ONBOARDING' && <StudentOnboarding currentUser={currentUser!} onSubmit={async (data) => {
            await authService.updateProfile(currentUser!.id, data);
            setCurrentUser({ ...currentUser!, ...data });
            setCurrentView('STUDENT_DASHBOARD');
        }} />}
        {/* Adicione outras visões conforme necessário seguindo o padrão de proteção */}
      </main>

      <MacleyWidget isActiveStudent={!!currentUser} language="PT" />
      
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} />}
      
      <Footer onNavigate={(v) => setCurrentView(v)} />
    </div>
  );
}
