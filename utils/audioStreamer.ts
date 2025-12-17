
/**
 * AudioStreamer
 * Manages raw PCM streaming. 
 * Gemini Live requires audio/pcm;rate=16000 for input and provides 24000 for output.
 */

export class AudioStreamer {
  public isRecording: boolean = false;
  
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private inputSource: MediaStreamAudioSourceNode | null = null;
  
  private nextStartTime: number = 0;
  private activeSources: Set<AudioBufferSourceNode> = new Set();
  private onDataAvailable: (base64: string) => void;

  constructor(onData: (base64: string) => void) {
    this.onDataAvailable = onData;
  }

  async initialize() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000
      });
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async startRecording() {
    await this.initialize();
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
          audio: { channelCount: 1, sampleRate: 16000 } 
      });

      this.inputSource = this.audioContext!.createMediaStreamSource(this.mediaStream);
      this.scriptProcessor = this.audioContext!.createScriptProcessor(4096, 1, 1);
      
      this.scriptProcessor.onaudioprocess = (e) => {
        if (!this.isRecording) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = this.encodePCM(inputData);
        this.onDataAvailable(pcm16);
      };

      this.inputSource.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.audioContext!.destination);
      this.isRecording = true;
    } catch (error) {
      console.error("Mic access denied:", error);
      throw error;
    }
  }

  stopRecording() {
    this.isRecording = false;
    this.mediaStream?.getTracks().forEach(t => t.stop());
    this.inputSource?.disconnect();
    this.scriptProcessor?.disconnect();
  }

  async playAudioChunk(base64: string) {
    if (!this.audioContext) return;

    try {
      const bytes = this.decodeBase64(base64);
      const audioBuffer = this.decodePCM(bytes);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      const currentTime = this.audioContext.currentTime;
      this.nextStartTime = Math.max(this.nextStartTime, currentTime);
      
      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;
      
      this.activeSources.add(source);
      source.onended = () => this.activeSources.delete(source);
    } catch (e) {
      console.error("Playback Error:", e);
    }
  }

  stopPlayback() {
    this.activeSources.forEach(s => { try { s.stop(); } catch(e){} });
    this.activeSources.clear();
    this.nextStartTime = 0;
  }

  // --- Manual Base64 Helpers (Instruction Requirement) ---

  private encodePCM(float32: Float32Array): string {
    const l = float32.length;
    const buf = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      buf[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    // Uint8 view of the Int16 buffer
    const uint8 = new Uint8Array(buf.buffer);
    let binary = '';
    for (let i = 0; i < uint8.length; i++) {
        binary += String.fromCharCode(uint8[i]);
    }
    return btoa(binary);
  }

  private decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private decodePCM(data: Uint8Array): AudioBuffer {
    const int16 = new Int16Array(data.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }
    const buffer = this.audioContext!.createBuffer(1, float32.length, 24000);
    buffer.copyToChannel(float32, 0);
    return buffer;
  }
}