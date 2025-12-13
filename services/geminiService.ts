
import { GoogleGenAI, ChatSession, FunctionDeclaration, Type, GenerateContentResponse } from "@google/genai";
import { MACLEY_SYSTEM_INSTRUCTION } from '../constants';
import { User, LessonPlan, HomeworkCorrection, StudentPersona, ContentTrend, DraftPost, RoadmapNode } from '../types';
import { getEnv } from '../utils/env';

let chatSession: ChatSession | null = null;
let genAI: GoogleGenAI | null = null;
let currentUserContext: string = "";
let currentLanguage: 'EN' | 'PT' = 'EN';

// Tool Definitions
const navigateTool: FunctionDeclaration = {
    name: 'navigate_to',
    description: 'Navigate the user to a specific section of the app.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            view: {
                type: Type.STRING,
                description: 'The view ID to navigate to. Valid values: HOME, FIND_TEACHER, COURSES, STUDENT_DASHBOARD, ONBOARDING, ABOUT, FAQ, BLOG.',
            }
        },
        required: ['view']
    }
};

const searchTeachersTool: FunctionDeclaration = {
    name: 'search_teachers',
    description: 'Filter and search for English teachers in the marketplace.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            niche: {
                type: Type.STRING,
                description: 'Specialty like Business, Travel, Tech, Exam Prep.',
            },
            max_price: {
                type: Type.NUMBER,
                description: 'Maximum hourly rate in BRL.',
            }
        }
    }
};

const searchCoursesTool: FunctionDeclaration = {
    name: 'search_courses',
    description: 'Filter and search for recorded English courses.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            topic: {
                type: Type.STRING,
                description: 'Topic or category of the course (e.g. Business, Tech).',
            },
            level: {
                type: Type.STRING,
                description: 'Difficulty level (Beginner, Intermediate, Advanced).',
            }
        }
    }
};

const initializeGemini = () => {
  const apiKey = getEnv('API_KEY') || getEnv('VITE_API_KEY');
  if (!apiKey) {
    console.warn("API_KEY not found. Macley disabled.");
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

// Generates the full system prompt including dynamic user data and language preference
const getFullSystemInstruction = () => {
    let instruction = MACLEY_SYSTEM_INSTRUCTION;
    
    // Language enforcement
    if (currentLanguage === 'PT') {
        instruction += `\n\nIMPORTANT: The user has selected PORTUGUESE (PT-BR) as their interface language. You must reply in PORTUGUESE unless explicitly asked to teach English concepts in English.`;
    } else {
        instruction += `\n\nIMPORTANT: The user has selected ENGLISH. Reply in English.`;
    }

    if (currentUserContext) {
        instruction += `\n\nCURRENT USER CONTEXT:\n${currentUserContext}\nUse this information to personalize your greeting and recommendations.`;
    }
    return instruction;
};

export const setSystemLanguage = (lang: 'EN' | 'PT') => {
    if (currentLanguage !== lang) {
        currentLanguage = lang;
        // Reset session to apply new system instruction
        chatSession = null;
    }
};

export const updateUserContext = (user: User | null) => {
    if (!user) {
        currentUserContext = "";
    } else {
        currentUserContext = `Name: ${user.name}
Role: ${user.role}
Level: ${user.level || 'Unknown'}
Goal: ${user.goal || 'Unknown'}
Max Budget: ${user.budgetMax ? 'R$ ' + user.budgetMax : 'Unknown'}
Availability: ${user.availabilityPrefs?.join(', ') || 'Flexible'}`;
    }
    // Force restart of chat to apply new context
    chatSession = null;
};

export const startChat = async () => {
  const ai = initializeGemini();
  if (!ai) return null;

  try {
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: getFullSystemInstruction(),
            temperature: 0.7,
            tools: [{ functionDeclarations: [navigateTool, searchTeachersTool, searchCoursesTool] }],
        }
      });
      chatSession = chat;
      return chat;
  } catch (error) {
    console.error("Failed to start chat session", error);
    return null;
  }
};

export const sendMessageToMacley = async (message: string): Promise<{ text?: string, functionCalls?: any[] }> => {
  if (!chatSession) {
    await startChat();
  }

  if (!chatSession) {
      return { text: "System Error: Neural Link Disconnected (Check API Key)." };
  }

  try {
    const result = await chatSession.sendMessage({ message });
    
    // Extract function calls if any
    const calls = result.functionCalls;
    
    return {
        text: result.text,
        functionCalls: calls
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    // If error, try restarting once (often handles expired sessions or context issues)
    chatSession = null;
    return { text: "Re-calibrating neural network... Please try again." };
  }
};

// Helper to send tool output back to model (for multi-turn if needed)
export const sendToolResponse = async (functionResponses: any[]) => {
    if (!chatSession) return null;
    try {
        const result = await chatSession.sendToolResponse({ functionResponses });
        return { text: result.text };
    } catch (e) {
        console.error("Tool response error", e);
        return { text: "Error processing tool response." };
    }
};

// --- Lesson Plan Generator ---
export const generateLessonPlan = async (topic: string, studentLevel: string, studentGoal: string): Promise<LessonPlan | null> => {
    const ai = initializeGemini();
    if (!ai) return null;

    const prompt = `
        You are an expert English Curriculum Developer.
        Create a structured lesson plan for a student.
        
        Student Level: ${studentLevel}
        Student Goal: ${studentGoal}
        Lesson Topic: ${topic}
        Language: ${currentLanguage === 'PT' ? 'Portuguese (for explanations) and English (for content)' : 'English'}

        Output strict JSON with this schema:
        {
            "topic": "Title of the lesson",
            "level": "CEFR Level",
            "objectives": ["obj1", "obj2"],
            "theory": "Markdown string of the grammar/concept explanation with examples",
            "vocabulary": [{"term": "word", "definition": "def", "example": "sentence"}],
            "exercises": [{"question": "text", "type": "gap-fill", "answer": "text"}],
            "homework": "Brief assignment description",
            "qualityScore": {
                "clarity": number (0-100),
                "grammar": number (0-100),
                "engagement": number (0-100),
                "overall": number (0-100)
            }
        }
        Do not include markdown code block markers (like \`\`\`json). Just the raw JSON string.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.7
            }
        });

        const text = response.text || "{}";
        const lessonData = JSON.parse(text);
        
        return {
            id: `lp_${Date.now()}`,
            generatedAt: new Date().toISOString(),
            ...lessonData
        };

    } catch (error) {
        console.error("Lesson generation failed", error);
        return null;
    }
};

// --- Homework Corrector ---
export const correctStudentWork = async (textInput: string): Promise<HomeworkCorrection | null> => {
    const ai = initializeGemini();
    if (!ai) return null;

    const prompt = `
        You are an expert English Language Teacher.
        Analyze and correct the following student text.
        
        Student Text: "${textInput}"
        Output Language: ${currentLanguage === 'PT' ? 'Portuguese' : 'English'} (Explain the feedback in this language)

        Your task:
        1. Correct grammar, spelling, and awkward phrasing.
        2. Estimate the CEFR level of the writing (A1-C2).
        3. Score the writing from 0-100 based on clarity and accuracy.
        4. Detect the tone (Formal, Casual, Aggressive, etc.).
        5. Provide specific feedback points.

        Output strict JSON with this schema:
        {
            "original": "The original text string",
            "corrected": "The fully corrected text string",
            "score": number,
            "cefrEstimate": "String (e.g. B1)",
            "tone": "String",
            "feedback": [
                { "type": "GRAMMAR" | "VOCAB" | "STYLE", "message": "Explanation of the error and correction" }
            ]
        }
        Do not include markdown code block markers. Just the raw JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.3 // Lower temperature for more analytical/corrective task
            }
        });

        const text = response.text || "{}";
        return JSON.parse(text);

    } catch (error) {
        console.error("Homework correction failed", error);
        return null;
    }
};

// --- CONTENT ENGINE: Trend Research ---
export const researchTrends = async (personas: StudentPersona[]): Promise<ContentTrend[]> => {
    const ai = initializeGemini();
    if (!ai) return [];

    const personaDescriptions = personas.map(p => `${p.role} interested in ${p.interests.join(', ')}`).join('; ');

    const prompt = `
        You are a Trend Analyst for an English Learning Platform.
        Our students fit these profiles: ${personaDescriptions}.
        
        Using Google Search, find 3-4 specific, CURRENT trending news topics or discussions from the last week that would be relevant to these professionals.
        Focus on Tech, Business, and Career Development news.
        
        Return a JSON array of objects:
        [
            { "topic": "Headline", "source": "Source Name", "relevance": "Why this matters to our students" }
        ]
        Do not include markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }], // ENABLE GOOGLE SEARCH GROUNDING
                responseMimeType: 'application/json'
            }
        });

        const text = response.text || "[]";
        return JSON.parse(text);
    } catch (error) {
        console.error("Trend research failed", error);
        // Fallback for demo if search fails or API key issue
        return [
            { topic: "The Rise of AI Agents in Software Development", source: "TechCrunch", relevance: "Relevant to Tech Leads managing AI tools." },
            { topic: "New Remote Work Legislation in Brazil", source: "G1", relevance: "Critical for Digital Nomads and HR personas." },
            { topic: "English as the Lingua Franca of Crypto", source: "CoinDesk", relevance: "High interest for investors and tech roles." }
        ];
    }
};

// --- CONTENT ENGINE: Draft Generator ---
export const generateDraftPost = async (trend: ContentTrend, persona: StudentPersona): Promise<DraftPost | null> => {
    const ai = initializeGemini();
    if (!ai) return null;

    const prompt = `
        You are a Senior Content Editor.
        Write a blog post for an English learning platform.
        Target Language for Explanation: ${currentLanguage === 'PT' ? 'Portuguese' : 'English'}
        
        Target Audience: ${persona.role} who struggles with ${persona.struggles.join(', ')}.
        Topic: ${trend.topic} (Source: ${trend.source}).
        Context: ${trend.relevance}

        The post should:
        1. Explain the news briefly in English.
        2. Highlight 5 key vocabulary words from the news.
        3. Provide a practical exercise related to their struggle (e.g., how to discuss this news in a meeting).
        4. Be engaging, modern, and helpful.

        Output JSON:
        {
            "title": "Catchy Title",
            "slug": "kebab-case-slug",
            "excerpt": "Short summary",
            "content": "HTML content (paragraphs, h3, ul)",
            "category": "CAREER" | "TIPS" | "CULTURE",
            "readTime": "X min read",
            "seoKeywords": ["tag1", "tag2"],
            "generatedReason": "Explanation of why this fits the persona"
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const text = response.text || "{}";
        const data = JSON.parse(text);
        
        return {
            id: `draft_${Date.now()}`,
            author: 'Macley (AI Editor)',
            date: new Date().toLocaleDateString(),
            imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop', // Default AI tech image
            status: 'DRAFT',
            targetAudience: persona.role,
            ...data
        };
    } catch (error) {
        console.error("Draft generation failed", error);
        return null;
    }
};

// --- VOCABULARY VAULT: Story Generator ---
export const generateVocabularyStory = async (words: string[]): Promise<string> => {
    const ai = initializeGemini();
    if (!ai) return "Story generation unavailable.";

    const prompt = `
        Create a short, creative, and engaging story (max 150 words) that uses ALL of the following words correctly in context.
        Language of Story: English.
        
        Words: ${words.join(', ')}
        
        Format: Return only the story text. Bold the target words using **word** syntax.
        Tone: Cyberpunk / Sci-Fi / Modern Tech.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "Could not generate story.";
    } catch (error) {
        console.error("Story generation failed", error);
        return "System offline. Unable to generate narrative.";
    }
};

// --- ROADMAP GENERATOR ---
export const generateLearningPath = async (level: string, goal: string): Promise<RoadmapNode[]> => {
    const ai = initializeGemini();
    if (!ai) return [];

    const prompt = `
        Create a personalized 5-step learning roadmap for an English student.
        Level: ${level}
        Goal: ${goal}
        UI Language: ${currentLanguage === 'PT' ? 'Portuguese' : 'English'}

        Each step should represent a clear milestone (e.g., "Master Past Tense", "Mock Interview", "Read first article").
        The first step should be ACTIVE, the rest LOCKED. 
        If the student is Advanced, make the tasks harder.

        Output strict JSON array:
        [
            { 
                "id": "1", 
                "title": "Short Title", 
                "description": "Brief description of what to do", 
                "status": "ACTIVE" | "LOCKED", 
                "actionType": "BOOK_CLASS" | "COURSE" | "PRACTICE" | "ASSESSMENT",
                "actionLabel": "Button Label"
            }
        ]
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text || "[]";
        return JSON.parse(text);
    } catch (error) {
        console.error("Roadmap generation failed", error);
        // Fallback roadmap
        return [
            { id: '1', title: 'Initial Assessment', description: 'Calibrate your exact CEFR level.', status: 'ACTIVE', actionType: 'ASSESSMENT', actionLabel: 'Start Test' },
            { id: '2', title: 'Core Vocabulary', description: 'Learn 50 essential words for your goal.', status: 'LOCKED', actionType: 'PRACTICE', actionLabel: 'Open Vault' },
            { id: '3', title: 'First Conversation', description: 'Book a 1:1 session with a teacher.', status: 'LOCKED', actionType: 'BOOK_CLASS', actionLabel: 'Find Teacher' }
        ];
    }
};
