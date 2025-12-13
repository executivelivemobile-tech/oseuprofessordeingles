
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface VocabularyCard {
    id: string;
    term: string;
    definition: string;
    example: string;
    origin: 'HOMEWORK' | 'SIMULATOR' | 'CLASS' | 'MANUAL';
    masteryLevel: number; // 0-5 (0 = New, 5 = Mastered)
    nextReview: string; // ISO Date string
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  // Student specific
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent';
  cefrLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  goal?: string;
  onboardingCompleted?: boolean;
  budgetMax?: number;
  availabilityPrefs?: string[]; // e.g. ['Morning', 'Evening']
  // Teacher specific link
  teacherProfileId?: string; 
  // Settings
  timezone?: string;
  notifications?: {
      email: boolean;
      sms: boolean;
      promotions: boolean;
  };
  // Google Integration
  googleDocsIntegration?: {
      linkedFolderId: string;
      docUrl: string;
      lastSync: string;
  };
  // Learning Data
  vocabulary?: VocabularyCard[];
}

export interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Teacher {
  id: string;
  name: string;
  photoUrl: string;
  niche: string[];
  location: string;
  accent: 'USA' | 'UK' | 'Canada' | 'Australia' | 'International';
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  bio: string;
  introVideoUrl?: string;
  available: boolean;
  verified: boolean;
  reviews?: Review[];
  // Key: 'Mon', 'Tue', etc. Value: Array of hours [9, 10, 14]
  availability?: Record<string, number[]>; 
}

export interface CourseModule {
  title: string;
  duration: string;
  lessons: string[];
}

export interface Course {
  id: string;
  title: string;
  instructorId: string;
  instructorName: string;
  thumbnailUrl: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  category: string;
  duration: string;
  modules: number;
  description: string;
  syllabus?: CourseModule[];
  features?: string[];
}

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    category: 'TIPS' | 'PLATFORM' | 'CAREER' | 'CULTURE';
    imageUrl: string;
    readTime: string;
    status?: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED';
    targetAudience?: string; // AI metadata
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface TimeSlot {
    id: string;
    time: string;
    available: boolean;
}

export interface Booking {
    id: string;
    teacherId: string;
    teacherName: string;
    date: Date;
    timeSlot: string;
    price: number;
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED' | 'DISPUTED';
    reviewed?: boolean;
}

export type ViewState = 'HOME' | 'FIND_TEACHER' | 'COURSES' | 'TEACHER_PROFILE' | 'COURSE_DETAILS' | 'TEACHER_DASHBOARD' | 'STUDENT_DASHBOARD' | 'ONBOARDING' | 'STUDENT_ONBOARDING' | 'COURSE_CLASSROOM' | 'ADMIN_DASHBOARD' | 'TEACHER_COURSE_CREATOR' | 'TERMS' | 'PRIVACY' | 'ABOUT' | 'FAQ' | 'LIVE_CLASSROOM' | 'MESSAGES' | 'SETTINGS' | 'FAVORITES' | 'REFERRALS' | 'VERIFY_CERTIFICATE' | 'BLOG' | 'BLOG_POST' | 'ASSESSMENT' | 'SIMULATOR' | 'HOMEWORK_HELPER' | 'VOCABULARY_VAULT';

export interface AIAction {
    type: 'NAVIGATE' | 'FILTER_TEACHERS' | 'FILTER_COURSES';
    payload: any;
}

export interface AppState {
  currentView: ViewState;
  language: 'EN' | 'PT';
  selectedTeacherId?: string;
  selectedCourseId?: string;
  selectedBlogPostId?: string;
  activeBookingId?: string;
  favoriteIds: string[];
  // AI Driven Filters
  activeFilters?: {
      searchQuery?: string;
      niche?: string;
      level?: string;
      category?: string;
      maxPrice?: number;
  };
}

export interface Notification {
    id: string;
    type: 'SUCCESS' | 'ERROR' | 'INFO';
    message: string;
    read?: boolean;
    date?: string;
}

// New Messaging Types
export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
}

export interface Conversation {
    id: string;
    partnerId: string;
    partnerName: string;
    partnerAvatar: string;
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
    messages: Message[];
}

// Financial Types
export interface Transaction {
    id: string;
    date: string;
    description: string;
    type: 'CLASS' | 'COURSE_SALE' | 'PAYOUT' | 'REFUND';
    grossAmount: number;
    platformFee: number; // The commission amount
    netAmount: number;
    status: 'PENDING' | 'AVAILABLE' | 'PAID' | 'PROCESSING' | 'CANCELLED';
}

// Assessment Types
export interface AssessmentQuestion {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    levelWeight: number; // 1 = Beginner, 2 = Intermediate, 3 = Advanced
}

// Simulator Types
export interface Scenario {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: 'Travel' | 'Business' | 'Social';
    aiRole: string;
    userRole: string;
    objective: string;
    openingLine: string;
    imageUrl: string;
}

// --- Smart Docs Types ---
export interface LessonPlan {
    id: string;
    topic: string;
    level: string;
    objectives: string[];
    theory: string; // Markdown or HTML
    vocabulary: Array<{ term: string; definition: string; example: string }>;
    exercises: Array<{ question: string; type: 'gap-fill' | 'translation' | 'open'; answer?: string }>;
    homework: string;
    qualityScore: {
        clarity: number;
        grammar: number;
        engagement: number;
        overall: number;
    };
    generatedAt: string;
}

export interface HomeworkCorrection {
    original: string;
    corrected: string;
    score: number; // 0-100
    cefrEstimate: string;
    tone: string; // Formal, Casual, etc.
    feedback: Array<{ type: 'GRAMMAR' | 'VOCAB' | 'STYLE'; message: string; }>;
}

// --- Content Engine Types ---
export interface StudentPersona {
    role: string; // e.g., "Software Engineer"
    interests: string[]; // e.g., "Gaming", "Crypto"
    struggles: string[]; // e.g., "Present Perfect", "Small Talk"
    count: number; // How many students fit this persona
}

export interface ContentTrend {
    topic: string;
    source: string;
    relevance: string; // Why it matters to our students
    url?: string;
}

export interface DraftPost extends BlogPost {
    generatedReason: string; // "Because 40% of students are Devs and React 19 just launched"
    seoKeywords: string[];
}

// --- Roadmap Types ---
export interface RoadmapNode {
    id: string;
    title: string;
    description: string;
    status: 'LOCKED' | 'ACTIVE' | 'COMPLETED';
    actionType: 'BOOK_CLASS' | 'COURSE' | 'PRACTICE' | 'ASSESSMENT';
    actionLabel: string;
}

// --- Dispute Types ---
export interface Dispute {
    id: string;
    bookingId: string;
    reporterId: string;
    reporterName: string;
    respondentName: string; // The teacher or student being reported
    reason: 'NO_SHOW' | 'TECH_ISSUE' | 'QUALITY' | 'HARASSMENT' | 'OTHER';
    description: string;
    status: 'OPEN' | 'RESOLVED' | 'REJECTED';
    resolution?: 'REFUND_STUDENT' | 'PAY_TEACHER' | 'SPLIT' | 'DISMISSED';
    adminNotes?: string;
    createdAt: string;
}
