
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from "@google/genai";
import { AudioStreamer } from '../utils/audioStreamer';
import { MACLEY_SYSTEM_INSTRUCTION } from '../constants';

const navigateTool: FunctionDeclaration = {
    name: 'navigate_to',
    description: 'Navigate the user to a section.',
    parameters: {
        type: Type.OBJECT,
        properties: { view: { type: Type.STRING } },
        required: ['view']
    }
};

let streamer: AudioStreamer | null = null;
let currentSessionPromise: Promise<any> | null = null;

export const liveService = {
    async connect(onAudioData: (base64: string) => void, onToolCall: (toolName: string, args: any) => void) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        streamer = new AudioStreamer((base64Input) => {
            if (currentSessionPromise) {
                currentSessionPromise.then((session) => {
                    session.sendRealtimeInput({
                        media: { data: base64Input, mimeType: "audio/pcm;rate=16000" }
                    });
                }).catch(err => console.error("Mic stream error", err));
            }
        });

        currentSessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                systemInstruction: MACLEY_SYSTEM_INSTRUCTION + "\n\nVOICE_MODE: No Markdown. Be concise.",
                tools: [{ functionDeclarations: [navigateTool] }]
            },
            callbacks: {
                onopen: () => console.log("Voice Sync Active"),
                onmessage: async (message: LiveServerMessage) => {
                    const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (audio) {
                        streamer?.playAudioChunk(audio);
                        onAudioData(audio);
                    }
                    if (message.serverContent?.interrupted) streamer?.stopPlayback();
                    if (message.toolCall) {
                        for (const fc of message.toolCall.functionCalls) {
                            onToolCall(fc.name, fc.args);
                            currentSessionPromise?.then(session => {
                                session.sendToolResponse({
                                    functionResponses: { id: fc.id, name: fc.name, response: { result: "OK" } }
                                });
                            });
                        }
                    }
                },
                onclose: () => console.log("Voice Link Down"),
                onerror: (e) => console.error("Neural Error", e)
            }
        });

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
