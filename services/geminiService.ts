
import { GoogleGenAI, Chat, FunctionDeclaration, Type } from "@google/genai";
import { MACLEY_SYSTEM_INSTRUCTION } from '../constants';
import { User, UserRole, LessonPlan, HomeworkCorrection, StudentPersona, ContentTrend, DraftPost, RoadmapNode } from '../types';

let chatSession: Chat | null = null;
let currentLanguage: 'EN' | 'PT' = 'EN';
let userState: 'VISITOR' | 'ACTIVE_STUDENT' = 'VISITOR';
let isLegendModeActive: boolean = false;

const navigateTool: FunctionDeclaration = {
    name: 'navigate_to',
    description: 'Navigate the user to a section.',
    parameters: {
        type: Type.OBJECT,
        properties: { view: { type: Type.STRING, description: 'Target view: HOME, FIND_TEACHER, COURSES, STUDENT_DASHBOARD, etc.' } },
        required: ['view']
    }
};

const getDynamicInstruction = () => {
    let instr = MACLEY_SYSTEM_INSTRUCTION;
    instr += `\n\n=== CURRENT CONTEXT ===\nUSER_STATE: ${userState}`;
    if (isLegendModeActive) instr += `\n[INTERNAL_PROTOCOL: THE_LEGEND_ACTIVE]`;
    instr += `\nSYSTEM_LANGUAGE: ${currentLanguage === 'PT' ? 'PORTUGUÊS' : 'ENGLISH'}`;
    return instr;
};

export const updateUserContext = (user: User | null) => {
    const prevState = userState;
    userState = (user && user.role === UserRole.STUDENT && user.onboardingCompleted) ? 'ACTIVE_STUDENT' : 'VISITOR';
    if (prevState !== userState) chatSession = null; // Force reboot on state change
};

export const setSystemLanguage = (lang: 'EN' | 'PT') => {
    if (currentLanguage !== lang) {
        currentLanguage = lang;
        chatSession = null;
    }
};

export const startChat = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
        systemInstruction: getDynamicInstruction(),
        tools: [{ functionDeclarations: [navigateTool] }],
    }
  });
  return chatSession;
};

export const sendMessageToMacley = async (message: string) => {
  const cleanMsg = message.toLowerCase().trim();
  if (cleanMsg === "eu sou a lenda" || cleanMsg === "i am the legend") {
      isLegendModeActive = true;
      chatSession = null; // Reboot with legend power
  }

  if (!chatSession) await startChat();
  try {
      const result = await chatSession!.sendMessage({ message });
      return { text: result.text, functionCalls: result.functionCalls };
  } catch (e: any) {
      console.error("Neural link failure:", e);
      chatSession = null;
      return { text: currentLanguage === 'PT' ? "Interferência detectada. Reiniciando link..." : "Interference detected. Rebooting link..." };
  }
};

export const sendToolResponse = async (functionResponses: any[]) => {
    if (!chatSession) return null;
    try {
        const result = await chatSession.sendMessage({ 
            message: "Action confirmed." // Standardized sync for tool results
        });
        return { text: result.text };
    } catch (e) {
        chatSession = null;
        return null;
    }
};

// Tooling for Teachers/Admin
export const generateLessonPlan = async (topic: string, level: string, goal: string): Promise<LessonPlan | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Lesson for ${level} on ${topic}, goal: ${goal}. JSON output.`,
            config: { responseMimeType: "application/json" }
        });
        return response.text ? { ...JSON.parse(response.text), id: `lp_${Date.now()}`, generatedAt: new Date().toISOString() } : null;
    } catch (e) { return null; }
};

export const correctStudentWork = async (text: string): Promise<HomeworkCorrection | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Correct text: "${text}". JSON output.`,
            config: { responseMimeType: "application/json" }
        });
        return response.text ? JSON.parse(response.text) : null;
    } catch (e) { return null; }
};

export const researchTrends = async (personas: StudentPersona[]): Promise<ContentTrend[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Trends for: ${JSON.stringify(personas)}. JSON output.`,
            config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" }
        });
        return response.text ? JSON.parse(response.text) : [];
    } catch (e) { return []; }
};

export const generateDraftPost = async (trend: ContentTrend, persona: StudentPersona): Promise<DraftPost | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Blog post: ${trend.topic} for ${persona.role}. JSON.`,
            config: { responseMimeType: "application/json" }
        });
        if (!response.text) return null;
        const data = JSON.parse(response.text);
        return { ...data, id: `dp_${Date.now()}`, slug: 'draft', author: 'Macley AI', date: new Date().toLocaleDateString(), imageUrl: 'https://picsum.photos/seed/ai/800/400', readTime: '4 min', status: 'DRAFT' };
    } catch (e) { return null; }
};

export const generateVocabularyStory = async (words: string[]): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `Story using: ${words.join(', ')}. Use **bold** for vocabulary.` });
        return response.text || "";
    } catch (e) { return ""; }
};

export const generateLearningPath = async (level: string, goal: string): Promise<RoadmapNode[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `4-step roadmap for ${level} goal ${goal}. JSON.`,
            config: { responseMimeType: "application/json" }
        });
        return response.text ? JSON.parse(response.text).map((n: any, i: number) => ({ ...n, id: `n_${i}` })) : [];
    } catch (e) { return []; }
};
