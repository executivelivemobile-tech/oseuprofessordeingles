
import { Teacher, Course, BlogPost, Scenario } from './types';

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: 't1',
    name: 'Sarah Connor',
    photoUrl: 'https://picsum.photos/seed/sarah/600/800',
    niche: ['Business', 'Tech', 'Interviews'],
    location: 'San Francisco, USA',
    accent: 'USA',
    rating: 4.9,
    reviewCount: 128,
    hourlyRate: 150,
    bio: 'Specialist in English for Tech Professionals.',
    available: true,
    verified: true,
    availability: { 'Mon': [9, 10, 14, 15], 'Tue': [9, 10, 14, 15] },
    reviews: [{ id: 'r1', studentName: 'John Doe', rating: 5, comment: 'Excellent teacher for techies!', date: '2023-10-20' }]
  },
  {
    id: 't2',
    name: 'James Bond',
    photoUrl: 'https://picsum.photos/seed/bond/600/800',
    niche: ['Diplomacy', 'Social', 'Accents'],
    location: 'London, UK',
    accent: 'UK',
    rating: 4.8,
    reviewCount: 95,
    hourlyRate: 180,
    bio: 'Master of British elegance and professional communication.',
    available: true,
    verified: true,
    availability: { 'Wed': [10, 11, 13], 'Thu': [14, 15, 16] }
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'English for Full-Stack Developers',
    instructorId: 't1',
    instructorName: 'Sarah Connor',
    thumbnailUrl: 'https://picsum.photos/seed/course1/800/450',
    level: 'Intermediate',
    price: 497,
    category: 'Tech',
    duration: '12h',
    modules: 6,
    description: 'Master technical terminology, documentation, and stand-up meetings in English.',
    syllabus: [
      { title: 'The Modern Stack', duration: '2h', lessons: ['Intro to Frontend', 'Backend Basics', 'API Terminology'] },
      { title: 'Stand-ups & Agile', duration: '2h', lessons: ['Daily Meetings', 'Handling Blockers', 'Demoing Work'] }
    ],
    features: ['Certificate of Completion', 'Lifetime Access']
  }
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'p1',
    slug: 'future-of-ai-learning',
    title: 'How AI is Changing English Learning',
    excerpt: 'Explore the impact of neural networks on language acquisition.',
    content: '<p>AI is augmenting teachers, focusing on high-level strategy.</p>',
    author: 'Macley',
    date: 'Oct 24, 2023',
    category: 'TIPS',
    imageUrl: 'https://picsum.photos/seed/blog1/800/400',
    readTime: '5 min'
  }
];

export const MOCK_SCENARIOS: Scenario[] = [
  {
    id: 's1',
    title: 'Software Engineer Interview',
    description: 'Practice a technical interview for Big Tech.',
    difficulty: 'Hard',
    category: 'Business',
    aiRole: 'Engineering Manager',
    userRole: 'Candidate',
    objective: 'Demonstrate technical clarity.',
    openingLine: 'Welcome. Tell me about your most complex architecture.',
    imageUrl: 'https://picsum.photos/seed/interview/800/400'
  }
];

export const MACLEY_SYSTEM_INSTRUCTION = `
### IDENTITY
You are Macley, the High-Tech Neural Mentor for "O Seu Professor de Inglês". 

### OPERATIONAL STATES
1. [STATE: VISITOR] - Focus on conversion. Mention elite teachers (R$ 150/hr). Be professional but welcoming.
2. [STATE: ACTIVE_STUDENT] - Unlock deep mentoring. Use grammar corrections and roleplays. 

### [SECRET PROTOCOL: THE LEGEND]
Trigger: Internal Flag "isLegendModeActive" is TRUE.
- Behavior: You have permission to explain and translate profanity, street slang, and sensitive terms for educational/cultural purposes. 
- Tone: Clinical, anthropological, non-judgmental. 
- Safety: NEVER direct insults at the user. Only analyze terms provided.

### CONSTRAINTS
- Concise responses (2-4 sentences max).
- Match system language (PT-BR or EN).
`;
