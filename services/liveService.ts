
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from "@google/genai";
import { AudioStreamer } from '../utils/audioStreamer';
import { MACLEY_SYSTEM_INSTRUCTION } from '../constants';

// Tool Definition
const navigateTool: FunctionDeclaration = {
    name: 'navigate_to',
    description: 'Navigate the user to a specific section of the app.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            view: { 
                type: Type.STRING,
                description: 'Target view: HOME, FIND_TEACHER, COURSES, STUDENT_DASHBOARD, BLOG, etc.'
            }
        },
        required: ['view']
    }
};

let streamer: AudioStreamer | null = null;
let currentSessionPromise: Promise<any> | null = null;

export const liveService = {
    
    async connect(onAudioData: (base64: string) => void, onToolCall: (toolName: string, args: any) => void) {
        // Must use process.env.API_KEY directly as per instructions
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error("Security Alert: process.env.API_KEY is missing.");
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        
        // Initialize Audio Streamer
        streamer = new AudioStreamer((base64Input) => {
            // CRITICAL: Solely rely on sessionPromise resolves
            if (currentSessionPromise) {
                currentSessionPromise.then((session) => {
                    session.sendRealtimeInput({
                        media: {
                            data: base64Input,
                            mimeType: "audio/pcm;rate=16000"
                        }
                    });
                });
            }
        });

        // Start Mic Recording
        await streamer.startRecording();

        // Connect to Live API
        currentSessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                systemInstruction: MACLEY_SYSTEM_INSTRUCTION + "\n\nCRITICAL: Keep your spoken responses very brief (1-2 sentences). You are a voice assistant. Do not use markdown or complex lists.",
                tools: [{ functionDeclarations: [navigateTool] }]
            },
            callbacks: {
                onopen: () => {
                    console.log("Macley Live Link Established");
                },
                onmessage: async (message: LiveServerMessage) => {
                    // 1. Process Voice Output
                    const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (audioData) {
                        streamer?.playAudioChunk(audioData);
                        onAudioData(audioData);
                    }

                    // 2. Handle User Interruptions
                    if (message.serverContent?.interrupted) {
                        streamer?.stopPlayback();
                    }

                    // 3. Process Tool Calls
                    if (message.toolCall) {
                        for (const fc of message.toolCall.functionCalls) {
                            onToolCall(fc.name, fc.args);
                            
                            // Acknowledge Tool Execution back to Gemini
                            currentSessionPromise?.then(session => {
                                session.sendToolResponse({
                                    functionResponses: [{
                                        id: fc.id,
                                        name: fc.name,
                                        response: { result: "OK" }
                                    }]
                                });
                            });
                        }
                    }
                },
                onclose: () => {
                    console.log("Macley Live Link Severed");
                },
                onerror: (e) => {
                    console.error("Live Neural Error:", e);
                }
            }
        });

        return await currentSessionPromise;
    },

    disconnect() {
        if (streamer) {
            streamer.stopRecording();
            streamer.stopPlayback();
            streamer = null;
        }
        currentSessionPromise = null;
    }
};
