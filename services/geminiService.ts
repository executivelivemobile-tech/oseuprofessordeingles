
import { GoogleGenAI, Chat, FunctionDeclaration, Type } from "@google/genai";
import { MACLEY_SYSTEM_INSTRUCTION } from '../constants';
import { User, LessonPlan, HomeworkCorrection, StudentPersona, ContentTrend, DraftPost, RoadmapNode, UserRole } from '../types';

let chatSession: Chat | null = null;
let currentUserContext: string = "STATE: VISITOR (No user logged in)";
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

// Generates the full system prompt including dynamic user data and language preference
const getFullSystemInstruction = () => {
    let instruction = MACLEY_SYSTEM_INSTRUCTION;
    
    if (currentLanguage === 'PT') {
        instruction += `\n\n[SYSTEM OVERRIDE] O usuário está navegando em PORTUGUÊS. Responda sempre em Português do Brasil de forma concisa.`;
    } else {
        instruction += `\n\n[SYSTEM OVERRIDE] User is in ENGLISH mode. Reply in English.`;
    }

    instruction += `\n\n=== CURRENT USER CONTEXT ===\n${currentUserContext}\n=======================`;
    return instruction;
};

export const setSystemLanguage = (lang: 'EN' | 'PT') => {
    if (currentLanguage !== lang) {
        currentLanguage = lang;
        chatSession = null; // Reset to apply new instruction
    }
};

export const updateUserContext = (user: User | null) => {
    if (!user) {
        currentUserContext = "STATE: VISITOR (Anonymous/Not Logged In)";
    } else {
        const isStudent = user.role === UserRole.STUDENT;
        const isActive = isStudent && user.onboardingCompleted; 
        const stateLabel = isActive ? "ACTIVE_STUDENT" : "VISITOR";

        currentUserContext = `
USER_ID: ${user.id}
NAME: ${user.name}
ROLE: ${user.role}
STATE: ${stateLabel}
LEVEL: ${user.level || 'Unknown'}
GOAL: ${user.goal || 'Unknown'}
        `.trim();
    }
    chatSession = null;
};

export const startChat = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
      chatSession = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: getFullSystemInstruction(),
            temperature: 0.7,
            tools: [{ functionDeclarations: [navigateTool, searchTeachersTool, searchCoursesTool] }],
        }
      });
      return chatSession;
  } catch (error) {
    console.error("Failed to start Macley session", error);
    return null;
  }
};

export const sendMessageToMacley = async (message: string): Promise<{ text?: string, functionCalls?: any[] }> => {
  if (!chatSession) {
    await startChat();
  }

  if (!chatSession) {
      return { text: "Macley is currently offline. Please refresh." };
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return {
        text: result.text,
        functionCalls: result.functionCalls
    };
  } catch (error: any) {
    console.error("Macley Neural Error:", error);
    chatSession = null; // Clear corrupted session
    return { 
        text: currentLanguage === 'PT' 
            ? "Tive um soluço neural ao processar isso. Pode repetir a pergunta?" 
            : "I had a neural hiccup processing that. Could you repeat your question?" 
    };
  }
};

export const sendToolResponse = async (functionResponses: any[]) => {
    if (!chatSession) return null;
    try {
        const result = await chatSession.sendMessage({ 
            message: functionResponses.map(fr => ({
                functionResponse: {
                    name: fr.name,
                    response: fr.response,
                    id: fr.id
                }
            }))
        });
        return { text: result.text };
    } catch (e) {
        console.error("Tool response error", e);
        return { text: "Error syncing AI tools." };
    }
};

// --- Specialized AI Features (Stateless) ---

export const generateLessonPlan = async (topic: string, studentLevel: string, studentGoal: string): Promise<LessonPlan | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Create a structured English lesson plan for a ${studentLevel} student interested in ${studentGoal}. Topic: ${topic}. Output raw JSON only.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Pro for complex educational structuring
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return { id: `lp_${Date.now()}`, generatedAt: new Date().toISOString(), ...JSON.parse(response.text || "{}") };
    } catch (error) {
        console.error("Lesson creation failed", error);
        return null;
    }
};

export const correctStudentWork = async (textInput: string): Promise<HomeworkCorrection | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analyze and correct this student text. Be pedagogical. Text: "${textInput}". Output raw JSON only.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Correction failed", error);
        return null;
    }
};

export const researchTrends = async (personas: StudentPersona[]): Promise<ContentTrend[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Research 3 tech/business trends for these student profiles: ${JSON.stringify(personas)}. Output raw JSON array.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { tools: [{ googleSearch: {} }], responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || "[]");
    } catch (error) {
        return [];
    }
};

export const generateDraftPost = async (trend: ContentTrend, persona: StudentPersona): Promise<DraftPost | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Write a blog post about ${trend.topic} for a ${persona.role}. Output raw JSON only.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const data = JSON.parse(response.text || "{}");
        return { id: `draft_${Date.now()}`, author: 'Macley (AI)', date: new Date().toLocaleDateString(), imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop', status: 'DRAFT', targetAudience: persona.role, ...data };
    } catch (error) {
        return null;
    }
};

export const generateVocabularyStory = async (words: string[]): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Create a short sci-fi story using these words: ${words.join(', ')}. Bold the words.`;
    try {
        const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
        return response.text || "Story generation error.";
    } catch (error) {
        return "System offline.";
    }
};

export const generateLearningPath = async (level: string, goal: string): Promise<RoadmapNode[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Create a 5-step learning roadmap for a ${level} student focused on ${goal}. Output raw JSON array only.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || "[]");
    } catch (error) {
        return [];
    }
};