
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
                description: 'Valid views: HOME, FIND_TEACHER, COURSES, STUDENT_DASHBOARD, ONBOARDING, BLOG.',
            }
        },
        required: ['view']
    }
};

const searchTeachersTool: FunctionDeclaration = {
    name: 'search_teachers',
    description: 'Search English teachers.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            niche: { type: Type.STRING },
            max_price: { type: Type.NUMBER }
        }
    }
};

const getFullSystemInstruction = () => {
    let instruction = MACLEY_SYSTEM_INSTRUCTION;
    instruction += currentLanguage === 'PT' 
        ? `\n\n[PORTUGUÊS ATIVO] Responda em Português do Brasil.` 
        : `\n\n[ENGLISH ACTIVE] Reply in English.`;
    instruction += `\n\nCONTEXT: ${currentUserContext}`;
    return instruction;
};

export const setSystemLanguage = (lang: 'EN' | 'PT') => {
    currentLanguage = lang;
    chatSession = null;
};

export const updateUserContext = (user: User | null) => {
    currentUserContext = user ? `USER: ${user.name}, ROLE: ${user.role}, LEVEL: ${user.level}` : "STATE: VISITOR";
    chatSession = null;
};

export const startChat = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
      chatSession = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: getFullSystemInstruction(),
            tools: [{ functionDeclarations: [navigateTool, searchTeachersTool] }],
        }
      });
      return chatSession;
  } catch (error) {
    console.error("Chat init failed", error);
    return null;
  }
};

export const sendMessageToMacley = async (message: string): Promise<{ text?: string, functionCalls?: any[] }> => {
  if (!chatSession) await startChat();
  if (!chatSession) return { text: "Neural link offline." };

  try {
    const result = await chatSession.sendMessage({ message });
    return {
        text: result.text,
        functionCalls: result.functionCalls
    };
  } catch (error) {
    console.error("Neural Error:", error);
    chatSession = null;
    return { text: currentLanguage === 'PT' ? "Houve uma instabilidade neural. Tente novamente." : "Neural instability detected. Please retry." };
  }
};

export const sendToolResponse = async (functionResponses: any[]) => {
    if (!chatSession) return null;
    try {
        const result = await chatSession.sendMessage({ 
            message: functionResponses.map(fr => ({
                functionResponse: { name: fr.name, response: fr.response, id: fr.id }
            }))
        });
        return { text: result.text };
    } catch (e) {
        return { text: "Tool sync error." };
    }
};

// Specialized educational tasks using Pro model for high reasoning
export const generateLessonPlan = async (topic: string, studentLevel: string, studentGoal: string): Promise<LessonPlan | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Create a structured English lesson plan for a ${studentLevel} student. Topic: ${topic}. Goal: ${studentGoal}. Output JSON only.`,
            config: { responseMimeType: 'application/json' }
        });
        return { id: `lp_${Date.now()}`, generatedAt: new Date().toISOString(), ...JSON.parse(response.text || "{}") };
    } catch (e) { return null; }
};

export const correctStudentWork = async (textInput: string): Promise<HomeworkCorrection | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Pedagogically correct this English text: "${textInput}". Output JSON only.`,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) { return null; }
};

export const generateVocabularyStory = async (words: string[]): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({ 
            model: 'gemini-3-flash-preview', 
            contents: `Write a 100-word sci-fi story using these words: ${words.join(', ')}. Bold the words.` 
        });
        return response.text || "Generation failed.";
    } catch (e) { return "System offline."; }
};

export const generateLearningPath = async (level: string, goal: string): Promise<RoadmapNode[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Create a 5-step learning roadmap for a ${level} student with goal ${goal}. Output JSON array only.`,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || "[]");
    } catch (e) { return []; }
};

// --- CONTENT ENGINE ADDITIONS ---

/**
 * researchTrends
 * Fixes Error: Module '"../services/geminiService"' has no exported member 'researchTrends'.
 * Identifies trending topics based on student personas using structured output.
 */
export const researchTrends = async (personas: StudentPersona[]): Promise<ContentTrend[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `As an educational content strategist, research and identify 3 high-value trending topics in tech or business that would engage these student personas: ${JSON.stringify(personas)}.
            Focus on topics that create opportunities for learning advanced English vocabulary.
            Output JSON array only.`,
            config: { 
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            topic: { type: Type.STRING, description: 'The current news topic or global trend' },
                            source: { type: Type.STRING, description: 'Potential news source' },
                            relevance: { type: Type.STRING, description: 'Reasoning for student relevance' }
                        },
                        required: ['topic', 'source', 'relevance']
                    }
                }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (e) {
        console.error("Trend Research failed", e);
        return [];
    }
};

/**
 * generateDraftPost
 * Fixes Error: Module '"../services/geminiService"' has no exported member 'generateDraftPost'.
 * Synthesizes a pedagogical blog post draft for the platform.
 */
export const generateDraftPost = async (trend: ContentTrend, persona: StudentPersona): Promise<DraftPost | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Generate a blog post draft for the English learning platform "O Seu Professor".
            Topic: ${trend.topic}
            Target Student Persona: ${JSON.stringify(persona)}
            
            Requirement:
            - Use professional and educational tone.
            - content: HTML format using <h3> and <p> with Tailwind 'mb-4' and 'font-bold' classes where appropriate.
            - generatedReason: Explanation of why this topic matches the persona struggles.
            - targetAudience: Short description of the segment.
            
            Output JSON only.`,
            config: { 
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        excerpt: { type: Type.STRING },
                        content: { type: Type.STRING },
                        generatedReason: { type: Type.STRING },
                        targetAudience: { type: Type.STRING },
                        seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['title', 'excerpt', 'content', 'generatedReason', 'targetAudience', 'seoKeywords']
                }
            }
        });
        
        const data = JSON.parse(response.text || "{}");
        
        return {
            id: `draft_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            slug: data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            author: 'Macley AI',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            category: 'CAREER',
            imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop',
            readTime: '5 min read',
            status: 'DRAFT',
            targetAudience: data.targetAudience,
            generatedReason: data.generatedReason,
            seoKeywords: data.seoKeywords || []
        };
    } catch (e) {
        console.error("Draft Generation failed", e);
        return null;
    }
};
