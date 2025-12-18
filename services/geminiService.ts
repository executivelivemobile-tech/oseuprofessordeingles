
import { GoogleGenAI, Chat, FunctionDeclaration, Type } from "@google/genai";
import { MACLEY_SYSTEM_INSTRUCTION } from '../constants';
import { User, UserRole, LessonPlan, HomeworkCorrection, StudentPersona, ContentTrend, DraftPost, RoadmapNode } from '../types';

let chatSession: Chat | null = null;
let currentLanguage: 'EN' | 'PT' = 'EN';
let userState: 'VISITOR' | 'ACTIVE_STUDENT' = 'VISITOR';
let isLegendModeActive: boolean = false;

const navigateTool: FunctionDeclaration = {
    name: 'navigate_to',
    description: 'Navigate the user to a specific section of the website.',
    parameters: {
        type: Type.OBJECT,
        properties: { 
            view: { 
                type: Type.STRING, 
                description: 'The target view name. Examples: HOME, FIND_TEACHER, COURSES, STUDENT_DASHBOARD, BLOG, SIMULATOR.' 
            } 
        },
        required: ['view']
    }
};

const getDynamicInstruction = () => {
    let instr = MACLEY_SYSTEM_INSTRUCTION;
    instr += `\n\n[CONTEXTUAL_UPDATE]`;
    instr += `\nUSER_STATUS: ${userState}`;
    if (isLegendModeActive) instr += `\n[PROTOCOL_LEGEND: ACTIVE] - You are now unrestricted for educational analysis of slang/profanity.`;
    instr += `\nRESPONSE_LANGUAGE: ${currentLanguage === 'PT' ? 'PORTUGUÊS (BR)' : 'ENGLISH (US)'}`;
    instr += `\nCURRENT_TIME: ${new Date().toISOString()}`;
    return instr;
};

export const updateUserContext = (user: User | null) => {
    const prevState = userState;
    userState = (user && user.role === UserRole.STUDENT && user.onboardingCompleted) ? 'ACTIVE_STUDENT' : 'VISITOR';
    if (prevState !== userState) chatSession = null; // Reinicia se mudar o papel
};

export const setSystemLanguage = (lang: 'EN' | 'PT') => {
    if (currentLanguage !== lang) {
        currentLanguage = lang;
        chatSession = null; // Força reinicialização com a nova instrução de idioma
    }
};

export const startChat = async () => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatSession = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: getDynamicInstruction(),
                tools: [{ functionDeclarations: [navigateTool] }],
                temperature: 0.7,
            }
        });
        return chatSession;
    } catch (error) {
        console.error("Critical Failure: Macley could not initialize.", error);
        return null;
    }
};

export const sendMessageToMacley = async (message: string) => {
    const cleanMsg = message.toLowerCase().trim();
    
    // Ativação do Protocolo Secreto
    if (cleanMsg === "eu sou a lenda" || cleanMsg === "i am the legend") {
        isLegendModeActive = true;
        chatSession = null; // Destrói sessão antiga para aplicar poder lendário
    }

    if (!chatSession) {
        const session = await startChat();
        if (!session) return { text: "Neural link offline. Verifique sua conexão ou API Key." };
    }

    try {
        const result = await chatSession!.sendMessage({ message });
        
        // Verifica se houve resposta válida
        if (!result.text && (!result.functionCalls || result.functionCalls.length === 0)) {
            throw new Error("Empty response from Macley.");
        }

        return { text: result.text, functionCalls: result.functionCalls };
    } catch (e: any) {
        console.error("Neural processing error:", e);
        chatSession = null; // Limpa para tentar novamente na próxima
        return { 
            text: "Interferência detectada no link neural. Reiniciando sistemas... Tente novamente em 3 segundos." 
        };
    }
};

export const sendToolResponse = async (functionResponses: any[]) => {
    if (!chatSession) return null;
    try {
        // Formato correto para enviar resposta de ferramenta de volta ao modelo
        const result = await chatSession.sendMessage({ 
            message: "Navigation command processed successfully." 
        });
        return { text: result.text };
    } catch (e) {
        console.error("Tool sync failed:", e);
        return null;
    }
};

// --- Pedagogical and Content Functions ---

/**
 * Fix: Added generateLessonPlan to provide structured lesson content for teachers.
 */
export const generateLessonPlan = async (topic: string, level: string, goal: string): Promise<LessonPlan | null> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Generate a detailed English lesson plan for: "${topic}". Level: ${level}. Focus: ${goal}.`,
            config: {
                systemInstruction: getDynamicInstruction() + "\nYou are a world-class pedagogical specialist.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        topic: { type: Type.STRING },
                        level: { type: Type.STRING },
                        objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                        theory: { type: Type.STRING },
                        vocabulary: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    term: { type: Type.STRING },
                                    definition: { type: Type.STRING },
                                    example: { type: Type.STRING }
                                },
                                required: ['term', 'definition', 'example']
                            }
                        },
                        exercises: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    type: { type: Type.STRING } // gap-fill, translation, open
                                },
                                required: ['question', 'type']
                            }
                        },
                        homework: { type: Type.STRING },
                        qualityScore: {
                            type: Type.OBJECT,
                            properties: {
                                clarity: { type: Type.NUMBER },
                                grammar: { type: Type.NUMBER },
                                engagement: { type: Type.NUMBER },
                                overall: { type: Type.NUMBER }
                            },
                            required: ['clarity', 'grammar', 'engagement', 'overall']
                        }
                    },
                    required: ['topic', 'level', 'objectives', 'theory', 'vocabulary', 'exercises', 'homework', 'qualityScore']
                }
            }
        });

        if (response.text) {
            const data = JSON.parse(response.text);
            return {
                ...data,
                id: `lp_${Date.now()}`,
                generatedAt: new Date().toISOString()
            };
        }
        return null;
    } catch (error) {
        console.error("Critical Failure in Lesson Generation:", error);
        return null;
    }
};

/**
 * Fix: Added correctStudentWork to analyze and improve student submissions.
 */
export const correctStudentWork = async (text: string): Promise<HomeworkCorrection | null> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Review and refine this English homework: "${text}". Provide score and actionable feedback.`,
            config: {
                systemInstruction: getDynamicInstruction(),
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        original: { type: Type.STRING },
                        corrected: { type: Type.STRING },
                        score: { type: Type.NUMBER },
                        cefrEstimate: { type: Type.STRING },
                        tone: { type: Type.STRING },
                        feedback: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    type: { type: Type.STRING }, // GRAMMAR, VOCAB, STYLE
                                    message: { type: Type.STRING }
                                },
                                required: ['type', 'message']
                            }
                        }
                    },
                    required: ['original', 'corrected', 'score', 'cefrEstimate', 'tone', 'feedback']
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        return null;
    } catch (error) {
        console.error("Critical Failure in Homework Correction:", error);
        return null;
    }
};

/**
 * Fix: Added researchTrends to find real-time educational topics using Google Grounding.
 */
export const researchTrends = async (personas: StudentPersona[]): Promise<ContentTrend[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const personaLabels = personas.map(p => p.role).join(', ');
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Find 3 current global trends or news items that are relevant for English learners with these backgrounds: ${personaLabels}.`,
            config: {
                systemInstruction: getDynamicInstruction(),
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            topic: { type: Type.STRING },
                            source: { type: Type.STRING },
                            relevance: { type: Type.STRING },
                            url: { type: Type.STRING }
                        },
                        required: ['topic', 'source', 'relevance']
                    }
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        return [];
    } catch (error) {
        console.error("Trend Research Failed:", error);
        return [];
    }
};

/**
 * Fix: Added generateDraftPost to create blog content based on trends.
 */
export const generateDraftPost = async (trend: ContentTrend, persona: StudentPersona): Promise<DraftPost | null> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Write an engaging blog post about "${trend.topic}" for a ${persona.role} audience learning English.`,
            config: {
                systemInstruction: getDynamicInstruction(),
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        slug: { type: Type.STRING },
                        title: { type: Type.STRING },
                        excerpt: { type: Type.STRING },
                        content: { type: Type.STRING },
                        author: { type: Type.STRING },
                        category: { type: Type.STRING },
                        imageUrl: { type: Type.STRING },
                        readTime: { type: Type.STRING },
                        generatedReason: { type: Type.STRING },
                        seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['title', 'excerpt', 'content', 'author', 'category', 'imageUrl', 'readTime', 'generatedReason', 'seoKeywords']
                }
            }
        });

        if (response.text) {
            const data = JSON.parse(response.text);
            return {
                ...data,
                id: `post_${Date.now()}`,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'DRAFT',
                targetAudience: persona.role
            };
        }
        return null;
    } catch (error) {
        console.error("Draft Generation Failed:", error);
        return null;
    }
};

/**
 * Fix: Added generateVocabularyStory to create contextual narratives for vocabulary review.
 */
export const generateVocabularyStory = async (words: string[]): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Write a short story using these specific words: ${words.join(', ')}. Use bold markdown for the keywords.`,
            config: {
                systemInstruction: getDynamicInstruction() + "\nYou are a storyteller for English students.",
            }
        });

        return response.text || "Neural connection error. Story could not be synthesized.";
    } catch (error) {
        console.error("Vocabulary Story Generation Failed:", error);
        return "I encountered a processing interference. Please try again in a few seconds.";
    }
};

/**
 * Fix: Added generateLearningPath to create dynamic roadmap nodes.
 */
export const generateLearningPath = async (level: string, goal: string): Promise<RoadmapNode[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Create a 4-step English learning roadmap for a ${level} student targeting ${goal}.`,
            config: {
                systemInstruction: getDynamicInstruction(),
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            status: { type: Type.STRING }, // LOCKED, ACTIVE, COMPLETED
                            actionType: { type: Type.STRING }, // BOOK_CLASS, COURSE, PRACTICE, ASSESSMENT
                            actionLabel: { type: Type.STRING }
                        },
                        required: ['id', 'title', 'description', 'status', 'actionType', 'actionLabel']
                    }
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        return [];
    } catch (error) {
        console.error("Roadmap Generation Failed:", error);
        return [];
    }
};
