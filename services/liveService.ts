
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
        // Use process.env.API_KEY directly as required by specialized instructions
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error("Critical Error: process.env.API_KEY is not defined in this environment.");
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        
        // Initialize Audio Streamer with the callback to send data to Gemini
        streamer = new AudioStreamer((base64Input) => {
            if (currentSessionPromise) {
                currentSessionPromise.then((session) => {
                    // Send realtime input only after session is resolved
                    session.sendRealtimeInput({
                        media: {
                            data: base64Input,
                            mimeType: "audio/pcm;rate=16000"
                        }
                    });
                }).catch(err => console.error("Realtime input failed", err));
            }
        });

        // Initiate connection promise FIRST
        currentSessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                systemInstruction: MACLEY_SYSTEM_INSTRUCTION + "\n\nVOICE MODE RULES: You are speaking via audio. Keep responses under 20 words. No lists, no markdown. Be extremely conversational and helpful.",
                tools: [{ functionDeclarations: [navigateTool] }]
            },
            callbacks: {
                onopen: () => {
                    console.log("Neural Link Active");
                },
                onmessage: async (message: LiveServerMessage) => {
                    // 1. Process Model Voice
                    const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (audioData) {
                        streamer?.playAudioChunk(audioData);
                        onAudioData(audioData);
                    }

                    // 2. Handle Interruption (User started speaking)
                    if (message.serverContent?.interrupted) {
                        streamer?.stopPlayback();
                    }

                    // 3. Tool Calls
                    if (message.toolCall) {
                        for (const fc of message.toolCall.functionCalls) {
                            onToolCall(fc.name, fc.args);
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
                onclose: () => console.log("Neural Link Terminated"),
                onerror: (e) => console.error("Neural Link Error", e)
            }
        });

        // Start recording only AFTER the promise is initialized to avoid null reference
        await streamer.startRecording();

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
