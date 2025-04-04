
// Voice recognition service using Web Speech API

// Add type declarations for the Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  grammars: SpeechGrammarList;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
  prototype: SpeechRecognition;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechGrammarList {
  length: number;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
  addFromURI(src: string, weight: number): void;
  addFromString(string: string, weight: number): void;
}

interface SpeechGrammar {
  src: string;
  weight: number;
}

// Extend Window interface to include Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
    webkitAudioContext?: typeof AudioContext;
  }
}

interface VoiceRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

type CommandCallback = (command: string) => void;

class VoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isSupported = false;
  private isListening = false;
  private commandCallback: CommandCallback | null = null;
  private volumeCallback: ((volume: number) => void) | null = null;
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private animationFrameId: number | null = null;
  private stream: MediaStream | null = null;

  constructor() {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.isSupported = true;
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.lang = 'en-US';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      if (this.commandCallback) {
        this.commandCallback(transcript);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      // Stop audio processing when recognition ends
      this.stopAudioProcessing();
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      this.isListening = false;
      this.stopAudioProcessing();
    };
  }

  public configure(options: VoiceRecognitionOptions = {}) {
    if (!this.recognition) return;

    if (options.language) {
      this.recognition.lang = options.language;
    }
    if (options.continuous !== undefined) {
      this.recognition.continuous = options.continuous;
    }
    if (options.interimResults !== undefined) {
      this.recognition.interimResults = options.interimResults;
    }
  }

  public async start(commandCallback: CommandCallback, volumeCallback?: (volume: number) => void) {
    if (!this.isSupported || this.isListening) return;

    this.commandCallback = commandCallback;
    
    if (volumeCallback) {
      this.volumeCallback = volumeCallback;
      await this.startAudioProcessing();
    }

    try {
      this.recognition?.start();
      this.isListening = true;
    } catch (error) {
      console.error('Failed to start speech recognition', error);
    }
  }

  public stop() {
    if (!this.isListening) return;

    try {
      this.recognition?.stop();
      this.stopAudioProcessing();
      this.isListening = false;
    } catch (error) {
      console.error('Failed to stop speech recognition', error);
    }
  }

  private async startAudioProcessing() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.stream = stream;
      
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyzer = this.audioContext.createAnalyser();
      this.analyzer.fftSize = 256;
      
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyzer);
      
      const bufferLength = this.analyzer.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      this.processAudio();
    } catch (error) {
      console.error('Failed to access microphone', error);
    }
  }

  private processAudio = () => {
    if (!this.analyzer || !this.dataArray || !this.volumeCallback) return;

    this.analyzer.getByteFrequencyData(this.dataArray);
    
    // Calculate volume level from frequency data
    const average = this.dataArray.reduce((acc, val) => acc + val, 0) / this.dataArray.length;
    const volume = average / 255; // Normalize between 0 and 1
    
    this.volumeCallback(volume);
    
    this.animationFrameId = requestAnimationFrame(this.processAudio);
  };

  private stopAudioProcessing() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }
    
    this.analyzer = null;
    this.dataArray = null;
    this.volumeCallback = null;
  }

  public isAvailable() {
    return this.isSupported;
  }

  public checkPermission() {
    return navigator.permissions.query({ name: 'microphone' as PermissionName });
  }
}

// Export as singleton
export const voiceRecognition = new VoiceRecognitionService();
