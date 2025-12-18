
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  isRoot?: boolean; // Imutabilidade para Admin Master
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent';
  // Added missing cefrLevel and googleDocsIntegration
  cefrLevel?: string;
  googleDocsIntegration?: {
    linkedFolderId: string;
    docUrl: string;
    lastSync: string;
  };
  goal?: string;
  onboardingCompleted?: boolean;
  teacherProfileId?: string; 
  timezone?: string;
  notifications?: { email: boolean; sms: boolean; promotions: boolean; };
}

// --- SISTEMA DE TAXAS (FEE ENGINE) ---
export type RuleScope = 'GLOBAL' | 'TEACHER' | 'ITEM';

export interface PercentageRule {
    id: string;
    scope: RuleScope;
    teacherId?: string;
    itemType?: 'LESSON' | 'PACKAGE' | 'COURSE';
    itemId?: string;
    platformFeePercent: number; // Ex: 15
    active: boolean;
    description: string;
    updatedAt: string;
    updatedBy: string;
}

export interface AuditLog {
    id: string;
    adminId: string;
    adminName: string;
    action: string;
    targetId: string;
    changes: { before: any; after: any };
    timestamp: string;
    severity: 'INFO' | 'CRITICAL' | 'SECURITY';
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    type: 'CLASS' | 'COURSE_SALE' | 'PAYOUT' | 'REFUND';
    grossAmount: number;
    platformFee: number; // Valor em R$ calculado pela regra
    platformFeePercent: number; // Porcentagem aplicada
    netAmount: number; // O que sobra para o professor
    status: 'PENDING' | 'AVAILABLE' | 'PAID' | 'PROCESSING' | 'CANCELLED';
    teacherId: string;
}

// Added Review, Message, TimeSlot, CourseModule types
export interface Review { id: string; studentName: string; rating: number; comment: string; date: string; }
export interface Message { id: string; senderId: string; text: string; timestamp: Date; }
export interface TimeSlot { id: string; time: string; available: boolean; }
export interface CourseModule { title: string; duration: string; lessons: string[]; }

// Re-exportando tipos existentes necessários
export interface VocabularyCard { id: string; term: string; definition: string; example: string; origin: any; masteryLevel: number; nextReview: string; }
// Updated Teacher with introVideoUrl
export interface Teacher { id: string; name: string; photoUrl: string; niche: string[]; location: string; accent: any; rating: number; reviewCount: number; hourlyRate: number; bio: string; available: boolean; verified: boolean; reviews?: Review[]; availability?: any; introVideoUrl?: string; }
export interface Course { id: string; title: string; instructorId: string; instructorName: string; thumbnailUrl: string; level: any; price: number; category: string; duration: string; modules: number; description: string; syllabus?: CourseModule[]; features?: string[]; }
export interface Booking { id: string; teacherId: string; teacherName: string; date: Date; timeSlot: string; price: number; status: string; reviewed?: boolean; }
// Added REFERRALS and VERIFY_CERTIFICATE to ViewState
export type ViewState = 'HOME' | 'FIND_TEACHER' | 'COURSES' | 'TEACHER_PROFILE' | 'COURSE_DETAILS' | 'TEACHER_DASHBOARD' | 'STUDENT_DASHBOARD' | 'ONBOARDING' | 'STUDENT_ONBOARDING' | 'COURSE_CLASSROOM' | 'ADMIN_DASHBOARD' | 'TEACHER_COURSE_CREATOR' | 'TERMS' | 'PRIVACY' | 'ABOUT' | 'FAQ' | 'LIVE_CLASSROOM' | 'MESSAGES' | 'SETTINGS' | 'FAVORITES' | 'BLOG' | 'BLOG_POST' | 'ASSESSMENT' | 'SIMULATOR' | 'HOMEWORK_HELPER' | 'VOCABULARY_VAULT' | 'REFERRALS' | 'VERIFY_CERTIFICATE';
export interface AIAction { type: 'NAVIGATE' | 'FILTER_TEACHERS' | 'FILTER_COURSES'; payload: any; }
export interface AppState { currentView: ViewState; language: 'EN' | 'PT'; selectedTeacherId?: string; selectedCourseId?: string; selectedBlogPostId?: string; activeBookingId?: string; favoriteIds: string[]; activeFilters?: any; }
export interface Notification { id: string; type: 'SUCCESS' | 'ERROR' | 'INFO'; message: string; read?: boolean; date?: string; }
export interface Conversation { id: string; partnerId: string; partnerName: string; partnerAvatar: string; lastMessage: string; lastMessageTime: Date; unreadCount: number; messages: Message[]; }
export interface Scenario { id: string; title: string; description: string; difficulty: any; category: any; aiRole: string; userRole: string; objective: string; openingLine: string; imageUrl: string; }
export interface RoadmapNode { id: string; title: string; description: string; status: any; actionType: any; actionLabel: string; }
export interface Dispute { id: string; bookingId: string; reporterId: string; reporterName: string; respondentName: string; reason: any; description: string; status: any; resolution?: any; adminNotes?: string; createdAt: string; }
export interface StudentPersona { role: string; interests: string[]; struggles: string[]; count: number; }
export interface ContentTrend { topic: string; source: string; relevance: string; url?: string; }
// Updated DraftPost with targetAudience
export interface DraftPost extends BlogPost { generatedReason: string; seoKeywords: string[]; targetAudience: string; }
export interface BlogPost { id: string; slug: string; title: string; excerpt: string; content: string; author: string; date: string; category: any; imageUrl: string; readTime: string; status?: any; }
export interface ChatMessage { id: string; role: 'user' | 'model'; text: string; timestamp: Date; }
export interface AssessmentQuestion { id: string; question: string; options: string[]; correctIndex: number; levelWeight: number; }
export interface LessonPlan { id: string; topic: string; level: string; objectives: string[]; theory: string; vocabulary: any[]; exercises: any[]; homework: string; qualityScore: any; generatedAt: string; }
export interface HomeworkCorrection { original: string; corrected: string; score: number; cefrEstimate: string; tone: string; feedback: any[]; }
