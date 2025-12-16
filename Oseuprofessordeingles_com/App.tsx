import React, { useState, useEffect } from 'react';
import { MacleyWidget } from './components/MacleyWidget';
import { BookingModal } from './components/BookingModal';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherOnboarding } from './components/TeacherOnboarding';
import { StudentOnboarding } from './components/StudentOnboarding';
import { CourseClassroom } from './components/CourseClassroom';
import { CourseCreator } from './components/CourseCreator';
import { ReviewModal } from './components/ReviewModal';
import { Marketplace } from './components/Marketplace';
import { CertificateModal } from './components/CertificateModal';
import { TermsPage, PrivacyPage, AboutPage, FAQPage } from './components/StaticPages';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CourseCheckoutModal } from './components/CourseCheckoutModal';
import { HomeView } from './components/HomeView';
import { TeacherProfileView } from './components/TeacherProfileView';
import { CourseDetailsView } from './components/CourseDetailsView';
import { LiveClassroom } from './components/LiveClassroom';
import { InboxView } from './components/InboxView';
import { SettingsView } from './components/SettingsView';
import { FavoritesView } from './components/FavoritesView';
import { ReferralView } from './components/ReferralView';
import { CertificateVerification } from './components/CertificateVerification';
import { BlogList, BlogPostView } from './components/BlogView';
import { AssessmentCenter } from './components/AssessmentCenter';
import { Simulator } from './components/Simulator';
import { HomeworkCorrector } from './components/HomeworkCorrector';
import { VocabularyVault } from './components/VocabularyVault';
import { ToastContainer } from './components/Toast';
import { CookieConsent } from './components/CookieConsent';
import { DisputeModal } from './components/DisputeModal';
import { updateUserContext, setSystemLanguage } from './services/geminiService';
import { authService } from './services/authService';
import { dataService } from './services/dataService';
import { MOCK_BLOG_POSTS } from './constants';
import { AppState, ViewState, UserRole, Teacher, Course, Booking, Review, User, AIAction, Notification, Conversation, Message, VocabularyCard, Dispute } from './types';

export default function App() {
  const [state, setState] = useState<AppState>({
    currentView: 'HOME',
    language: 'EN',
    favoriteIds: [],
    activeFilters: {}
  });

  const [notifications, setNotifications] = useState<Notification[]>([
      { id: 'n1', type: 'INFO', message: 'Welcome to the platform! Complete your profile to get started.', read: false, date: 'Today' },
      { id: 'n2', type: 'SUCCESS', message: 'Your email has been verified.', read: true, date: 'Yesterday' }
  ]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  // Data States
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  // Mock Booking Data
  const [myBookings, setMyBookings] = useState<Booking[]>([
      { id: 'b_past_1', teacherId: 't1', teacherName: 'Sarah Connor', date: new Date('2023-10-01'), timeSlot: '10:00', price: 150, status: 'COMPLETED', reviewed: false },
      { id: 'b_past_2', teacherId: 't2', teacherName: 'James Bond', date: new Date('2023-09-15'), timeSlot: '14:00', price: 180, status: 'COMPLETED', reviewed: true }
  ]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<string, string[]>>({});

  // Vocabulary State
  const [vocabulary, setVocabulary] = useState<VocabularyCard[]>([
      { id: 'v1', term: 'Scalability', definition: 'The capacity to be changed in size or scale.', example: 'We need to ensure the scalability of the backend.', origin: 'MANUAL', masteryLevel: 4, nextReview: new Date().toISOString() },
      { id: 'v2', term: 'Stakeholder', definition: 'A person with an interest or concern in something.', example: 'The stakeholders approved the budget.', origin: 'CLASS', masteryLevel: 2, nextReview: new Date().toISOString() },
      { id: 'v3', term: 'Asynchronous', definition: 'Not existing or happening at the same time.', example: 'We prefer asynchronous communication.', origin: 'HOMEWORK', masteryLevel: 1, nextReview: new Date().toISOString() },
  ]);

  // Dispute State
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeTargetBooking, setDisputeTargetBooking] = useState<Booking | null>(null);

  // UX States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingTeacher, setBookingTeacher] = useState<Teacher | null>(null);

  // Checkout States
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  
  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTargetBookingId, setReviewTargetBookingId] = useState<string | null>(null);

  // Certificate State
  const [certificateData, setCertificateData] = useState<{ studentName: string, courseTitle: string } | null>(null);

  // --- Data Loading Effect ---
  const refreshData = async () => {
      setIsDataLoading(true);
      try {
          const [tData, cData] = await Promise.all([
              dataService.getTeachers(),
              dataService.getCourses()
          ]);
          setTeachers(tData);
          setAllCourses(cData);
          
          if (cData.length > 0 && myCourses.length === 0) {
              setMyCourses([cData[0]]);
          }
      } catch (e) {
          console.error("Data fetch failed", e);
      } finally {
          setIsDataLoading(false);
      }
  };

  useEffect(() => {
      refreshData();
  }, []);

  // --- Auth & Init Effect (AGORA COM REDIRECIONAMENTO AUTOMÁTICO!) ---
  useEffect(() => {
      const checkSession = async () => {
          setIsAuthLoading(true);
          try {
              const user = await authService.getCurrentUser();
              if (user) {
                  setCurrentUser(user);
                  updateUserContext(user);
                  
                  // 🔥 CORREÇÃO CRÍTICA AQUI 🔥
                  // Verifica o role e redireciona automaticamente ao carregar a página
                  const role = String(user.role).toUpperCase();
                  
                  if (role === 'ADMIN') {
                      setState(prev => ({ ...prev, currentView: 'ADMIN_DASHBOARD' }));
                  } else if (role === 'TEACHER') {
                      setState(prev => ({ ...prev, currentView: 'TEACHER_DASHBOARD' }));
                  }
                  // Se for aluno, mantém na HOME ou dashboard, conforme lógica
              }
          } catch (e) {
              console.error("Session check failed", e);
          } finally {
              setIsAuthLoading(false);
          }
      };
      checkSession();
  }, []);

  // --- Notification Helper ---
  const addNotification = (type: 'SUCCESS' | 'ERROR' | 'INFO', message: string) => {
      const id = Date.now().toString();
      setNotifications(prev => [{ id, type, message, read: false, date: 'Just now' }, ...prev]);
  };

  const removeNotification = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const navigate = (view: ViewState, id?: string, type?: 'course' | 'teacher' | 'post') => {
    setState(prev => ({
      ...prev,
      currentView: view,
      selectedTeacherId: type === 'teacher' ? id : undefined,
      selectedCourseId: type === 'course' ? id : undefined,
      selectedBlogPostId: type === 'post' ? id : undefined,
      activeBookingId: undefined, 
      activeFilters: {} 
    }));
    window.scrollTo(0, 0);
  };

  const toggleLanguage = () => {
      const newLang = state.language === 'EN' ? 'PT' : 'EN';
      setState(prev => ({
          ...prev,
          language: newLang
      }));
      setSystemLanguage(newLang);
      addNotification('INFO', newLang === 'PT' ? 'Idioma alterado para Português' : 'Language changed to English');
  };

  // --- Login Handler (CORRIGIDO PARA ACEITAR QUALQUER FORMATO DE ADMIN) ---
  const handleLogin = (user: User) => {
      setCurrentUser(user);
      updateUserContext(user); 
      addNotification('SUCCESS', `Welcome back, ${user.name}!`);
      
      if (conversations.length === 0) {
          setConversations([
              {
                  id: 'c1',
                  partnerId: 't1',
                  partnerName: 'Sarah Connor',
                  partnerAvatar: 'https://picsum.photos/seed/sarah/200/200',
                  lastMessage: 'Looking forward to our class!',
                  lastMessageTime: new Date(Date.now() - 3600000),
                  unreadCount: 1,
                  messages: [
                      { id: 'm1', senderId: 't1', text: 'Hi there! I saw you booked a slot for next Tuesday.', timestamp: new Date(Date.now() - 3600000 * 2) },
                      { id: 'm2', senderId: 't1', text: 'Looking forward to our class!', timestamp: new Date(Date.now() - 3600000) }
                  ]
              }
          ]);
      }

      // 🔥 Lógica de Redirecionamento Robusta 🔥
      const role = String(user.role).toUpperCase();

      if (role === 'TEACHER') {
          navigate('TEACHER_DASHBOARD');
      } else if (role === 'ADMIN') {
          navigate('ADMIN_DASHBOARD');
      } else if (role === 'STUDENT') {
          if (user.onboardingCompleted) {
              navigate('HOME');
          } else {
              navigate('STUDENT_ONBOARDING');
          }
      }
  };

  const handleLogout = async () => {
      await authService.signOut();
      setCurrentUser(null);
      updateUserContext(null); 
      addNotification('INFO', 'Logged out successfully.');
      navigate('HOME');
  };

  const handleUpdateUser = async (data: Partial<User>) => {
      if (!currentUser) return;
      try {
          const updatedUser = { ...currentUser, ...data };
          setCurrentUser(updatedUser);
          updateUserContext(updatedUser);
          addNotification('SUCCESS', 'Profile updated successfully.');
          await authService.updateProfile(currentUser.id, data);
      } catch (e) {
          addNotification('ERROR', 'Failed to save profile changes.');
      }
  };

  const handleStudentOnboardingSubmit = async (data: Partial<User>) => {
      if (!currentUser) return;
      const updatedUser = { ...currentUser, ...data };
      
      setCurrentUser(updatedUser);
      updateUserContext(updatedUser);
      addNotification('SUCCESS', "Profile Initialized. Welcome to the ecosystem.");
      navigate('STUDENT_DASHBOARD');
      
      await authService.updateProfile(currentUser.id, data);
  };

  const handleAssessmentComplete = async (level: string, score: number) => {
      if (!currentUser) return;
      
      const updatedUser: User = { 
          ...currentUser, 
          level: level as any,
          cefrLevel: level === 'Fluent' ? 'C1' : level === 'Advanced' ? 'B2' : level === 'Intermediate' ? 'B1' : 'A2'
      };
      
      setCurrentUser(updatedUser);
      updateUserContext(updatedUser);
      addNotification('SUCCESS', `Level calibrated: ${level}. Recommendations updated.`);
      navigate('STUDENT_DASHBOARD');
      
      await authService.updateProfile(currentUser.id, { level: updatedUser.level });
  };

  const requireAuth = (action: () => void) => {
      if (currentUser) {
          action();
      } else {
          addNotification('INFO', 'Please log in to continue.');
          setIsAuthModalOpen(true);
      }
  };

  const toggleFavorite = (id: string) => {
    setState(prev => {
        const exists = prev.favoriteIds.includes(id);
        const newFavs = exists
            ? prev.favoriteIds.filter(fid => fid !== id)
            : [...prev.favoriteIds, id];
        
        if (!exists) addNotification('SUCCESS', 'Added to favorites');
        return { ...prev, favoriteIds: newFavs };
    });
  };

  const openBooking = (teacher: Teacher) => {
    requireAuth(() => {
        setBookingTeacher(teacher);
        setIsBookingModalOpen(true);
    });
  };

  const handleBookingConfirm = (details: { teacherId: string, date: Date, slot: string }) => {
    const teacher = teachers.find(t => t.id === details.teacherId);
    if (!teacher) return;

    const newBooking: Booking = {
        id: Date.now().toString(),
        teacherId: teacher.id,
        teacherName: teacher.name,
        date: details.date,
        timeSlot: details.slot,
        price: teacher.hourlyRate,
        status: 'CONFIRMED'
    };

    setMyBookings(prev => [...prev, newBooking]);
    setIsBookingModalOpen(false);
    addNotification('SUCCESS', `Booking confirmed with ${teacher.name}!`);
    navigate('STUDENT_DASHBOARD');
  };

  const handleBuyCourse = (course: Course) => {
      requireAuth(() => {
        if (myCourses.some(c => c.id === course.id)) {
            addNotification('INFO', "You already own this course!");
            navigate('COURSE_CLASSROOM', course.id, 'course');
            return;
        }
        
        setCheckoutCourse(course);
        setIsCheckoutModalOpen(true);
      });
  };

  const handleCheckoutConfirm = () => {
      if (checkoutCourse) {
          setMyCourses(prev => [...prev, checkoutCourse]);
          setIsCheckoutModalOpen(false);
          addNotification('SUCCESS', `Successfully enrolled in ${checkoutCourse.title}`);
          navigate('COURSE_CLASSROOM', checkoutCourse.id, 'course');
      }
  };

  const handleTeacherRegistration = (data: Partial<Teacher>) => {
      requireAuth(() => {
          const newTeacher: Teacher = {
              id: `t${Date.now()}`,
              name: data.name || currentUser?.name || 'Unknown',
              photoUrl: data.photoUrl || currentUser?.avatarUrl || 'https://via.placeholder.com/200',
              niche: data.niche || [],
              location: data.location || 'Unknown',
              accent: data.accent || 'International',
              rating: 0,
              reviewCount: 0,
              hourlyRate: data.hourlyRate || 50,
              bio: data.bio || '',
              introVideoUrl: data.introVideoUrl,
              available: true,
              verified: false,
              reviews: []
          };
          
          setTeachers(prev => [newTeacher, ...prev]);
          addNotification('SUCCESS', "Application Submitted! Pending Admin approval.");
          navigate('HOME');
      });
  };

  const handleUpdateAvailability = (newAvailability: Record<string, number[]>) => {
      if (currentUser?.teacherProfileId) {
          const tId = currentUser.teacherProfileId;
          setTeachers(prev => prev.map(t => 
              t.id === tId ? { ...t, availability: newAvailability } : t
          ));
          addNotification('SUCCESS', "Schedule updated.");
      }
  };

  const handleCourseCreation = (newCourse: Course) => {
      setAllCourses(prev => [newCourse, ...prev]);
      addNotification('SUCCESS', "Course Published Successfully!");
      navigate('TEACHER_DASHBOARD');
  };

  const handleCompleteLesson = (bookingId: string) => {
      setMyBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'COMPLETED' } : b));
      addNotification('SUCCESS', "Lesson complete! Time to rate.");
  };

  const handleJoinClass = (bookingId: string) => {
      setState(prev => ({
          ...prev,
          currentView: 'LIVE_CLASSROOM',
          activeBookingId: bookingId
      }));
  };

  const handleEndClass = () => {
     if (state.activeBookingId) {
         const booking = myBookings.find(b => b.id === state.activeBookingId);
         if (booking) {
             setMyBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'COMPLETED' } : b));
             setReviewTargetBookingId(booking.id);
             setIsReviewModalOpen(true);
         }
     }
     navigate('STUDENT_DASHBOARD');
  };

  const openReviewModal = (bookingId: string) => {
      setReviewTargetBookingId(bookingId);
      setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
      const booking = myBookings.find(b => b.id === reviewTargetBookingId);
      if (!booking) return;

      const newReview: Review = {
          id: `r${Date.now()}`,
          studentName: currentUser?.name || "Anonymous Student", 
          rating,
          comment,
          date: new Date().toISOString().split('T')[0]
      };

      setTeachers(prev => prev.map(t => {
          if (t.id === booking.teacherId) {
              const updatedReviews = [newReview, ...(t.reviews || [])];
              const newRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
              return {
                  ...t,
                  reviews: updatedReviews,
                  rating: Number(newRating.toFixed(1)),
                  reviewCount: updatedReviews.length
              };
          }
          return t;
      }));

      setMyBookings(prev => prev.map(b => b.id === reviewTargetBookingId ? { ...b, reviewed: true } : b));
      setIsReviewModalOpen(false);
      addNotification('SUCCESS', "Review submitted. Thank you!");
  };

  const handleCompleteCourse = (courseId: string) => {
      const course = allCourses.find(c => c.id === courseId);
      if (course && currentUser) {
          setCertificateData({
              studentName: currentUser.name,
              courseTitle: course.title
          });
          addNotification('SUCCESS', 'Course Completed! Generating Certificate...');
      }
  };

  const handleLessonCompletion = (courseId: string, lessonId: string) => {
      setCourseProgress(prev => {
          const currentCompleted = prev[courseId] || [];
          if (currentCompleted.includes(lessonId)) return prev;
          
          return {
              ...prev,
              [courseId]: [...currentCompleted, lessonId]
          };
      });
  };

  const handleSendMessage = (conversationId: string, text: string) => {
      if (!currentUser) return;
      
      const newMessage: Message = {
          id: Date.now().toString(),
          senderId: currentUser.id,
          text: text,
          timestamp: new Date()
      };

      setConversations(prev => prev.map(c => {
          if (c.id === conversationId) {
              return {
                  ...c,
                  lastMessage: text,
                  lastMessageTime: new Date(),
                  messages: [...c.messages, newMessage]
              };
          }
          return c;
      }));

      setTimeout(() => {
          setConversations(prev => prev.map(c => {
              if (c.id === conversationId) {
                  return {
                      ...c,
                      lastMessage: 'Got it! Thanks.',
                      lastMessageTime: new Date(),
                      unreadCount: c.unreadCount + 1,
                      messages: [...c.messages, {
                          id: (Date.now() + 1).toString(),
                          senderId: c.partnerId,
                          text: 'Got it! Thanks.',
                          timestamp: new Date()
                      }]
                  };
              }
              return c;
          }));
          addNotification('INFO', 'New message received');
      }, 3000);
  };

  const handleMarkNotificationRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleVerifyTeacher = (id: string) => {
      setTeachers(prev => prev.map(t => t.id === id ? { ...t, verified: true } : t));
      addNotification('SUCCESS', "Teacher verified successfully.");
  };

  const handleDeleteTeacher = (id: string) => {
      setTeachers(prev => prev.filter(t => t.id !== id));
      addNotification('INFO', "Teacher removed.");
  };

  const handleOpenDispute = (booking: Booking) => {
      setDisputeTargetBooking(booking);
      setIsDisputeModalOpen(true);
  };

  const handleSubmitDispute = (reason: string, description: string) => {
      if (!currentUser || !disputeTargetBooking) return;

      const newDispute: Dispute = {
          id: `disp_${Date.now()}`,
          bookingId: disputeTargetBooking.id,
          reporterId: currentUser.id,
          reporterName: currentUser.name,
          respondentName: disputeTargetBooking.teacherName,
          reason: reason as any,
          description,
          status: 'OPEN',
          createdAt: new Date().toLocaleDateString()
      };

      setDisputes(prev => [newDispute, ...prev]);
      
      setMyBookings(prev => prev.map(b => 
          b.id === disputeTargetBooking.id ? { ...b, status: 'DISPUTED' } : b
      ));

      setIsDisputeModalOpen(false);
      addNotification('INFO', "Dispute filed. Admin will review within 24h.");
  };

  const handleResolveDispute = (disputeId: string, resolution: any) => {
      setDisputes(prev => prev.map(d => 
          d.id === disputeId ? { ...d, status: 'RESOLVED', resolution } : d
      ));
      addNotification('SUCCESS', `Case resolved: ${resolution}`);
  };

  const handleSaveToVault = (word: Partial<VocabularyCard>) => {
      const newCard: VocabularyCard = {
          id: `v${Date.now()}`,
          term: word.term || 'New Word',
          definition: word.definition || 'No definition',
          example: word.example || '',
          origin: word.origin || 'MANUAL',
          masteryLevel: 0,
          nextReview: new Date().toISOString()
      };
      setVocabulary(prev => [newCard, ...prev]);
  };

  const handleUpdateVocabularyCard = (id: string, newLevel: number) => {
      setVocabulary(prev => prev.map(v => v.id === id ? { ...v, masteryLevel: newLevel } : v));
  };

  const handleAIAction = (action: AIAction) => {
      console.log("App received AI action:", action);
      
      if (action.type === 'NAVIGATE') {
          const viewTarget = action.payload as ViewState;
          if (viewTarget) {
              navigate(viewTarget);
              addNotification('INFO', `Macley: Navigating to ${viewTarget}`);
          }
      } 
      else if (action.type === 'FILTER_TEACHERS') {
          setState(prev => ({
              ...prev,
              currentView: 'FIND_TEACHER',
              activeFilters: {
                  niche: action.payload.niche,
                  maxPrice: action.payload.max_price
              }
          }));
          addNotification('INFO', `Macley: Applied filters for ${action.payload.niche || 'teachers'}`);
      }
      else if (action.type === 'FILTER_COURSES') {
          setState(prev => ({
              ...prev,
              currentView: 'COURSES',
              activeFilters: {
                  category: action.payload.topic,
                  level: action.payload.level
              }
          }));
          addNotification('INFO', `Macley: Found courses for ${action.payload.topic || 'you'}`);
      }
  };

  if (isAuthLoading) {
      return (
          <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  const renderCurrentView = () => {
    switch (state.currentView) {
        case 'HOME':
            return (
                <HomeView 
                    currentUser={currentUser}
                    courses={allCourses}
                    onNavigateTeacher={(id) => navigate('TEACHER_PROFILE', id, 'teacher')}
                    onNavigateCourse={(id) => navigate('COURSE_DETAILS', id, 'course')}
                    onNavigateAllCourses={() => navigate('COURSES')}
                    onFindTeacher={() => navigate('FIND_TEACHER')}
                    favoriteIds={state.favoriteIds}
                    onToggleFavorite={toggleFavorite}
                    language={state.language}
                />
            );
        case 'FIND_TEACHER':
            return (
                <Marketplace 
                    type="teacher" 
                    items={teachers} 
                    onNavigate={(id) => navigate('TEACHER_PROFILE', id, 'teacher')}
                    favoriteIds={state.favoriteIds}
                    onToggleFavorite={toggleFavorite}
                    initialNiche={state.activeFilters?.niche}
                    initialMaxPrice={state.activeFilters?.maxPrice}
                    language={state.language}
                />
            );
        case 'COURSES':
            return (
                <Marketplace 
                    type="course" 
                    items={allCourses} 
                    onNavigate={(id) => navigate('COURSE_DETAILS', id, 'course')}
                    favoriteIds={state.favoriteIds}
                    onToggleFavorite={toggleFavorite}
                    initialCategory={state.activeFilters?.category}
                    initialLevel={state.activeFilters?.level}
                    language={state.language}
                />
            );
        case 'TEACHER_PROFILE':
            const selectedTeacher = teachers.find(t => t.id === state.selectedTeacherId);
            if (!selectedTeacher) return <div>Not Found</div>;
            return (
                <TeacherProfileView 
                    teacher={selectedTeacher}
                    similarTeachers={teachers.filter(t => t.id !== selectedTeacher.id && t.niche.some(n => selectedTeacher.niche.includes(n)))}
                    onBook={() => openBooking(selectedTeacher)}
                    onNavigateTeacher={(id) => navigate('TEACHER_PROFILE', id, 'teacher')}
                    onBack={() => navigate('FIND_TEACHER')}
                    language={state.language}
                />
            );
        case 'COURSE_DETAILS':
            const selectedCourse = allCourses.find(c => c.id === state.selectedCourseId);
            if (!selectedCourse) return <div>Not Found</div>;
            return (
                <CourseDetailsView 
                    course={selectedCourse}
                    isOwned={myCourses.some(c => c.id === selectedCourse.id)}
                    onBuy={() => handleBuyCourse(selectedCourse)}
                    onResume={() => navigate('COURSE_CLASSROOM', selectedCourse.id, 'course')}
                    onNavigateInstructor={(id) => navigate('TEACHER_PROFILE', id, 'teacher')}
                    language={state.language}
                />
            );
        case 'STUDENT_DASHBOARD':
             return (
                <StudentDashboard 
                    bookings={myBookings} 
                    myCourses={myCourses}
                    courseProgress={courseProgress}
                    onNavigateToCourse={(id) => navigate('COURSE_CLASSROOM', id, 'course')}
                    onCompleteLesson={handleCompleteLesson}
                    onReviewTeacher={openReviewModal}
                    onJoinClass={handleJoinClass}
                    onTakeAssessment={() => navigate('ASSESSMENT')}
                    onOpenSimulator={() => navigate('SIMULATOR')}
                    onOpenHomework={() => navigate('HOMEWORK_HELPER')}
                    onOpenVault={() => navigate('VOCABULARY_VAULT')}
                    onReportIssue={handleOpenDispute}
                    onFindTeacher={() => navigate('FIND_TEACHER')}
                    language={state.language}
                />
            );
        case 'TEACHER_DASHBOARD':
            return (
                <TeacherDashboard 
                    myCourses={allCourses.filter(c => c.instructorId === 't1')}
                    myReviews={teachers.find(t => t.id === 't1')?.reviews || []}
                    onCreateCourse={() => navigate('TEACHER_COURSE_CREATOR')}
                    currentTeacher={currentUser?.role === UserRole.TEACHER && currentUser.teacherProfileId ? teachers.find(t => t.id === currentUser.teacherProfileId) : undefined}
                    onUpdateAvailability={handleUpdateAvailability}
                    language={state.language}
                />
            );
        case 'COURSE_CLASSROOM':
            const activeCourse = allCourses.find(c => c.id === state.selectedCourseId);
            if (!activeCourse) return null;
            
            return (
                <CourseClassroom 
                    course={activeCourse}
                    completedLessonIds={courseProgress[activeCourse.id] || []}
                    onLessonComplete={(lessonId) => handleLessonCompletion(activeCourse.id, lessonId)}
                    onBack={() => navigate('STUDENT_DASHBOARD')}
                    onCompleteCourse={handleCompleteCourse}
                />
            );
        case 'TEACHER_COURSE_CREATOR':
            return (
                <CourseCreator
                    instructorId={currentUser?.teacherProfileId || 't1'}
                    instructorName={currentUser?.name || 'Instructor'}
                    onSubmit={handleCourseCreation}
                    onCancel={() => navigate('TEACHER_DASHBOARD')}
                />
            );
        case 'ADMIN_DASHBOARD':
            return (
                <AdminDashboard 
                    teachers={teachers}
                    onVerifyTeacher={handleVerifyTeacher}
                    onDeleteTeacher={handleDeleteTeacher}
                    disputes={disputes}
                    onResolveDispute={handleResolveDispute}
                    onRefreshData={refreshData}
                />
            );
        case 'ONBOARDING':
            return (
                <TeacherOnboarding 
                    onSubmit={handleTeacherRegistration}
                    onCancel={() => navigate('HOME')}
                />
            );
        case 'STUDENT_ONBOARDING':
            if (!currentUser) return <div>Access Denied</div>;
            return (
                <StudentOnboarding 
                    currentUser={currentUser}
                    onSubmit={handleStudentOnboardingSubmit}
                />
            );
        case 'LIVE_CLASSROOM':
            if (!state.activeBookingId) return <div>No active session</div>;
            const liveBooking = myBookings.find(b => b.id === state.activeBookingId);
            if (!liveBooking) return <div>Booking not found</div>;
            const liveTeacher = teachers.find(t => t.id === liveBooking.teacherId);
            
            return (
                <LiveClassroom 
                    booking={liveBooking}
                    teacher={liveTeacher}
                    onEndCall={handleEndClass}
                />
            );
        case 'MESSAGES':
            if (!currentUser) return <div>Access Denied</div>;
            return (
                <InboxView 
                    currentUser={currentUser}
                    conversations={conversations}
                    notifications={notifications}
                    onSendMessage={handleSendMessage}
                    onMarkNotificationRead={handleMarkNotificationRead}
                />
            );
        case 'SETTINGS':
            if (!currentUser) return <div>Access Denied</div>;
            return (
                <SettingsView 
                    currentUser={currentUser}
                    onUpdateUser={handleUpdateUser}
                />
            );
        case 'FAVORITES':
            return (
                <FavoritesView 
                    favoriteIds={state.favoriteIds}
                    teachers={teachers}
                    courses={allCourses}
                    onNavigateTeacher={(id) => navigate('TEACHER_PROFILE', id, 'teacher')}
                    onNavigateCourse={(id) => navigate('COURSE_DETAILS', id, 'course')}
                    onToggleFavorite={toggleFavorite}
                    onFindMore={() => navigate('FIND_TEACHER')}
                />
            );
        case 'BLOG':
            return <BlogList onNavigatePost={(id) => navigate('BLOG_POST', id, 'post')} />;
        case 'BLOG_POST':
            const post = MOCK_BLOG_POSTS.find(p => p.id === state.selectedBlogPostId);
            if (!post) return <div>Post not found</div>;
            return <BlogPostView post={post} onBack={() => navigate('BLOG')} />;
        case 'ASSESSMENT':
            return (
                <AssessmentCenter 
                    onComplete={handleAssessmentComplete} 
                    onCancel={() => navigate('STUDENT_DASHBOARD')} 
                />
            );
        case 'SIMULATOR':
            return <Simulator onBack={() => navigate('STUDENT_DASHBOARD')} />;
        case 'HOMEWORK_HELPER':
            return (
                <HomeworkCorrector 
                    onBack={() => navigate('STUDENT_DASHBOARD')} 
                    onSaveToVault={handleSaveToVault}
                />
            );
        case 'VOCABULARY_VAULT':
            return (
                <VocabularyVault 
                    vocabulary={vocabulary}
                    onBack={() => navigate('STUDENT_DASHBOARD')}
                    onUpdateCard={handleUpdateVocabularyCard}
                />
            );
        case 'REFERRALS': return <ReferralView />;
        case 'VERIFY_CERTIFICATE': return <CertificateVerification />;
        case 'TERMS': return <TermsPage />;
        case 'PRIVACY': return <PrivacyPage />;
        case 'ABOUT': return <AboutPage />;
        case 'FAQ': return <FAQPage />;
        default:
            return <div>View not found</div>;
    }
  };

  const isFullScreenView = state.currentView === 'LIVE_CLASSROOM' || 
                           state.currentView === 'STUDENT_ONBOARDING' || 
                           state.currentView === 'ASSESSMENT' || 
                           state.currentView === 'SIMULATOR' || 
                           state.currentView === 'HOMEWORK_HELPER' || 
                           state.currentView === 'VOCABULARY_VAULT';

  return (
    <div className="bg-black text-gray-200 font-sans min-h-screen selection:bg-cyan-500 selection:text-white flex flex-col">
      
      <ToastContainer notifications={notifications} onDismiss={removeNotification} />
      
      <CookieConsent />

      {!isFullScreenView && (
          <Navbar 
            currentUser={currentUser}
            currentView={state.currentView}
            onNavigate={navigate}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            hasUnread={conversations.some(c => c.unreadCount > 0) || notifications.some(n => !n.read)}
            language={state.language}
            onToggleLanguage={toggleLanguage}
          />
      )}
      
      <main className="flex-grow">
        {isDataLoading && state.currentView === 'HOME' ? (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                    <p className="text-cyan-400 font-orbitron animate-pulse">Establishing Neural Link...</p>
                </div>
            </div>
        ) : (
            renderCurrentView()
        )}
      </main>

      {!isFullScreenView && <MacleyWidget onAction={handleAIAction} language={state.language} />}
      
      {/* Modals */}
      {isAuthModalOpen && (
          <AuthModal 
            onClose={() => setIsAuthModalOpen(false)}
            onLogin={handleLogin}
          />
      )}

      {isBookingModalOpen && bookingTeacher && (
          <BookingModal 
             teacher={bookingTeacher} 
             onClose={() => setIsBookingModalOpen(false)} 
             onConfirm={handleBookingConfirm}
             language={state.language}
          />
      )}

      {isCheckoutModalOpen && checkoutCourse && (
          <CourseCheckoutModal
             course={checkoutCourse}
             onClose={() => setIsCheckoutModalOpen(false)}
             onConfirm={handleCheckoutConfirm}
             language={state.language}
          />
      )}

      {isReviewModalOpen && reviewTargetBookingId && (
          <ReviewModal
            teacherName={myBookings.find(b => b.id === reviewTargetBookingId)?.teacherName || 'Teacher'}
            onClose={() => setIsReviewModalOpen(false)}
            onSubmit={handleReviewSubmit}
          />
      )}

      {isDisputeModalOpen && disputeTargetBooking && (
          <DisputeModal
              booking={disputeTargetBooking}
              onClose={() => setIsDisputeModalOpen(false)}
              onSubmit={handleSubmitDispute}
          />
      )}

      {certificateData && (
          <CertificateModal
              studentName={certificateData.studentName}
              courseTitle={certificateData.courseTitle}
              date={new Date().toLocaleDateString()}
              onClose={() => setCertificateData(null)}
          />
      )}

      {!isFullScreenView && (
        <Footer onNavigate={navigate} />
      )}
    </div>
  );
}
