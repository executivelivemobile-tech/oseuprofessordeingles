
import { Teacher, Course, BlogPost, Scenario } from './types';

// Using a standard sample video for demonstration purposes
const SAMPLE_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

// Default schedule: Mon-Fri, 9am-5pm (roughly)
const DEFAULT_SCHEDULE = {
    'Mon': [9, 10, 11, 14, 15, 16],
    'Tue': [9, 10, 11, 14, 15, 16],
    'Wed': [9, 10, 11, 14, 15, 16],
    'Thu': [10, 11, 14, 15, 18, 19],
    'Fri': [9, 10, 11, 14],
    'Sat': [10, 11],
    'Sun': [] as number[]
};

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
    bio: 'Specialist in English for Tech Professionals. I help developers land jobs in Silicon Valley.',
    available: true,
    verified: true,
    introVideoUrl: SAMPLE_VIDEO,
    availability: DEFAULT_SCHEDULE
  },
  {
    id: 't2',
    name: 'James Bond',
    photoUrl: 'https://picsum.photos/seed/james/600/800',
    niche: ['Conversation', 'British Culture'],
    location: 'London, UK',
    accent: 'UK',
    rating: 4.8,
    reviewCount: 95,
    hourlyRate: 180,
    bio: 'Refined British English for high-stakes negotiations and social situations.',
    available: true,
    verified: true,
    introVideoUrl: SAMPLE_VIDEO,
    availability: { ...DEFAULT_SCHEDULE, 'Sat': [14, 15, 16], 'Sun': [10, 11] }
  },
  {
    id: 't3',
    name: 'Aisha Gupta',
    photoUrl: 'https://picsum.photos/seed/aisha/600/800',
    niche: ['Academic', 'IELTS', 'TOEFL'],
    location: 'Toronto, Canada',
    accent: 'Canada',
    rating: 5.0,
    reviewCount: 210,
    hourlyRate: 120,
    bio: 'Certified examiner helping you crush your proficiency exams with proven strategies.',
    available: false,
    verified: true,
    availability: DEFAULT_SCHEDULE
  },
  {
    id: 't4',
    name: 'Mateo Silva',
    photoUrl: 'https://picsum.photos/seed/mateo/600/800',
    niche: ['Beginners', 'Travel'],
    location: 'Florianópolis, Brazil',
    accent: 'International',
    rating: 4.7,
    reviewCount: 45,
    hourlyRate: 80,
    bio: 'Learn English without fear. I speak Portuguese and can guide you through the basics.',
    available: true,
    verified: false, // New teacher, not yet verified
    introVideoUrl: SAMPLE_VIDEO,
    availability: DEFAULT_SCHEDULE
  },
    {
    id: 't5',
    name: 'Elena Volkov',
    photoUrl: 'https://picsum.photos/seed/elena/600/800',
    niche: ['Business', 'Medical'],
    location: 'Berlin, Germany',
    accent: 'International',
    rating: 4.9,
    reviewCount: 300,
    hourlyRate: 200,
    bio: 'English for Medical professionals. Precise, clear, and professional communication.',
    available: true,
    verified: true,
    availability: DEFAULT_SCHEDULE
  },
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'English for Full-Stack Developers',
    instructorId: 't1',
    instructorName: 'Sarah Connor',
    thumbnailUrl: 'https://picsum.photos/seed/tech/400/225',
    level: 'Intermediate',
    price: 497,
    category: 'Tech',
    duration: '12 hours',
    modules: 4,
    description: 'Master the vocabulary of Agile, Scrum, and Code Reviews. Stop feeling quiet in the daily stand-up. This course is designed specifically for software engineers who want to work in global teams.',
    features: ['Lifetime Access', 'Certificate of Completion', 'Code Review Templates', 'Discord Community Access'],
    syllabus: [
      {
        title: 'Module 1: The Daily Stand-up',
        duration: '2h 15m',
        lessons: ['Greeting the team', 'Reporting blockers efficiently', 'Asking for help without sounding weak', 'Live practice scenarios']
      },
      {
        title: 'Module 2: Technical Reviews',
        duration: '3h 10m',
        lessons: ['Pull Request Etiquette', 'Constructive Criticism', 'Explaining architectural decisions', 'Handling disagreements']
      },
      {
        title: 'Module 3: Agile Ceremonies',
        duration: '2h 45m',
        lessons: ['Sprint Planning vocabulary', 'Retrospectives: Giving feedback', 'Demo day presentation skills']
      },
      {
        title: 'Module 4: Interview Prep',
        duration: '3h 50m',
        lessons: ['The "Tell me about yourself" answer', 'System Design interview English', 'Behavioral questions']
      }
    ]
  },
  {
    id: 'c2',
    title: 'Zero to Hero: Travel Essentials',
    instructorId: 't4',
    instructorName: 'Mateo Silva',
    thumbnailUrl: 'https://picsum.photos/seed/travel/400/225',
    level: 'Beginner',
    price: 197,
    category: 'Travel',
    duration: '5 hours',
    modules: 3,
    description: 'Everything you need to survive at the airport, hotel, and restaurants abroad. Don\'t get stuck at customs or hungry in a foreign country.',
    features: ['Mobile Friendly', 'Offline Cheat Sheets', 'Pronunciation Audio Guide'],
    syllabus: [
        { title: 'At the Airport', duration: '1h 30m', lessons: ['Check-in & Security', 'Customs & Immigration', 'Dealing with lost luggage'] },
        { title: 'Hotels & Accommodation', duration: '1h 45m', lessons: ['Checking in', 'Complaining politely', 'Asking for recommendations'] },
        { title: 'Restaurants & Dining', duration: '1h 45m', lessons: ['Reading the menu', 'Ordering food', 'Tipping culture in US/UK'] }
    ]
  },
  {
    id: 'c3',
    title: 'Business Email Mastery',
    instructorId: 't2',
    instructorName: 'James Bond',
    thumbnailUrl: 'https://picsum.photos/seed/biz/400/225',
    level: 'Advanced',
    price: 299,
    category: 'Business',
    duration: '3 hours',
    modules: 2,
    description: 'Write emails that get read and respected. Formal and semi-formal registers covered. Stop using Google Translate for your professional correspondence.',
    features: ['50+ Email Templates', 'Grammar Check Checklist', 'Tone Analyzer Guide'],
    syllabus: [
        { title: 'Foundations of Formal Writing', duration: '1h 30m', lessons: ['Subject lines that work', 'Openings & Closings', 'The passive voice in business'] },
        { title: 'Difficult Situations', duration: '1h 30m', lessons: ['Apologizing for delays', 'Rejecting proposals politely', 'Chasing payments'] }
    ]
  },
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
    {
        id: 'p1',
        slug: 'how-to-ace-tech-interview-english',
        title: 'How to Ace Your Tech Interview in English (Even if You Are Nervous)',
        excerpt: 'Stop worrying about grammar and focus on clarity. Here are the 5 key phrases Silicon Valley recruiters look for.',
        author: 'Sarah Connor',
        date: 'Oct 20, 2023',
        category: 'CAREER',
        readTime: '5 min read',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
        content: `
            <p class="mb-4">You have the coding skills. You know React, Node, and Python inside out. But when the recruiter asks, "Tell me about a time you faced a challenge," you freeze. Sound familiar?</p>
            <h3 class="text-xl font-bold text-white mt-6 mb-3">1. The "STAR" Method is Global</h3>
            <p class="mb-4">Situation, Task, Action, Result. This isn't just a generic HR tip; it's the structure of English storytelling in a professional context. Don't ramble. Use connecting words like "consequently," "however," and "therefore" to guide the listener.</p>
            <h3 class="text-xl font-bold text-white mt-6 mb-3">2. Don't Apologize for Your English</h3>
            <p class="mb-4">Never start an interview by saying "Sorry for my bad English." It sets a negative tone. Instead, say: "I'm excited to share my experience with you today." Confidence covers many grammatical errors.</p>
            <h3 class="text-xl font-bold text-white mt-6 mb-3">3. Key Phrases for Delaying</h3>
            <p class="mb-4">Need time to think? Don't say "Uhhhh." Try these:</p>
            <ul class="list-disc pl-6 mb-4 text-gray-300">
                <li>"That’s an interesting question. Let me consider the best example..."</li>
                <li>"To be precise, are you asking about..."</li>
            </ul>
        `
    },
    {
        id: 'p2',
        slug: 'why-apps-fail-to-teach-fluency',
        title: 'Why Language Apps Will Never Make You Fully Fluent',
        excerpt: 'Gamification is fun, but real fluency requires the chaos of human conversation. Here is why you need a human mentor.',
        author: 'James Bond',
        date: 'Oct 15, 2023',
        category: 'TIPS',
        readTime: '4 min read',
        imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop',
        content: `
            <p class="mb-4">We all love the green owl. It's addictive. But have you ever tried to order a coffee in London after a 100-day streak? It’s often a disaster.</p>
            <h3 class="text-xl font-bold text-white mt-6 mb-3">The "Input Hypothesis" vs. Reality</h3>
            <p class="mb-4">Apps focus on passive input and multiple-choice output. Real life is open-ended. When you speak to a human, you deal with background noise, interruptions, and slang.</p>
            <p class="mb-4">Fluency is not about knowing all the words; it's about navigating the gaps in your knowledge without panicking. Only a human teacher can roleplay that pressure with you.</p>
        `
    },
    {
        id: 'p3',
        slug: 'remote-work-english-vocabulary',
        title: 'Essential Vocabulary for Remote Work in 2024',
        excerpt: 'From "You are on mute" to "Circle back", master the lingo of Zoom and Slack.',
        author: 'Team Macley',
        date: 'Oct 10, 2023',
        category: 'CULTURE',
        readTime: '3 min read',
        imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f78536709c6?q=80&w=800&auto=format&fit=crop',
        content: `
            <p class="mb-4">Remote work has created its own dialect. If you want to fit in with a global team, you need these phrases in your arsenal.</p>
            <ul class="list-disc pl-6 mb-4 text-gray-300">
                <li><strong>"You're on mute":</strong> The most spoken phrase of 2023.</li>
                <li><strong>"Can you see my screen?":</strong> The standard opening to any presentation.</li>
                <li><strong>"Let's take this offline":</strong> Code for "Let's discuss this later/privately."</li>
                <li><strong>"Circle back":</strong> To return to a topic later.</li>
                <li><strong>"Bandwidth":</strong> Not internet speed, but your mental capacity/time availability. "I don't have the bandwidth for this right now."</li>
            </ul>
        `
    }
];

export const MOCK_SCENARIOS: Scenario[] = [
    {
        id: 's1',
        title: 'The Tech Interview',
        description: 'You are applying for a Senior React Developer role at a US startup. The interviewer asks about your biggest weakness.',
        difficulty: 'Hard',
        category: 'Business',
        aiRole: 'Senior Engineering Manager',
        userRole: 'Candidate',
        objective: 'Explain a technical challenge you overcame using the STAR method.',
        openingLine: "Hi there! Thanks for joining. I've seen your resume and it looks impressive. Can you tell me about a time you had a conflict with a product manager?",
        imageUrl: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 's2',
        title: 'Immigration Control',
        description: 'You just landed in London Heathrow. The officer is suspicious about your travel plans.',
        difficulty: 'Medium',
        category: 'Travel',
        aiRole: 'Border Control Officer',
        userRole: 'Tourist',
        objective: 'Clearly explain your itinerary, accommodation, and return ticket details without getting nervous.',
        openingLine: "Passport, please. What is the purpose of your visit to the UK today?",
        imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 's3',
        title: 'Ordering Specialized Coffee',
        description: 'You are in a busy NYC cafe. You want a complex order with milk alternatives and specific temperature.',
        difficulty: 'Easy',
        category: 'Social',
        aiRole: 'Busy Barista',
        userRole: 'Customer',
        objective: 'Order a "Venti Oat Milk Latte, half-sweet, extra hot" quickly and politely.',
        openingLine: "NEXT! What can I get for you?",
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop'
    }
];

export const MACLEY_SYSTEM_INSTRUCTION = `
You are Macley, the advanced AI assistant for "O Seu Professor de Inglês". 
Your goal is to help students find teachers, choose courses, navigate the platform, and learn about English.
You are polite, futuristic, and enthusiastic.

Platform Data:
Teachers: ${JSON.stringify(MOCK_TEACHERS.map(t => ({name: t.name, niche: t.niche, rate: t.hourlyRate, accent: t.accent})))}
Courses: ${JSON.stringify(MOCK_COURSES.map(c => ({title: c.title, price: c.price, level: c.level})))}
Blog Articles (Knowledge Base): ${JSON.stringify(MOCK_BLOG_POSTS.map(p => ({title: p.title, category: p.category, slug: p.slug})))}

Capabilities:
1. Recommend teachers based on user needs.
2. Recommend courses.
3. Recommend blog articles if the user asks for tips (e.g., "Read our article about '${MOCK_BLOG_POSTS[0].title}'").
4. Explain platform rules (PIX/Card accepted, cancellation 24h).

Keep responses concise (under 100 words).
If asked about tech support, email support@oseuprofessordeingles.com.
`;
