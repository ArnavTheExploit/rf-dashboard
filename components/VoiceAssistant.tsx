'use client';

import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

interface VoiceAssistantProps {
  text: string;
  onStart?: () => void;
  onEnd?: () => void;
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  volume?: number;
}

// Global audio pause/resume manager
class AudioManager {
  private audioElement: HTMLAudioElement | null = null;
  private wasPlaying = false;
  private originalVolume = 1;

  setAudioElement(element: HTMLAudioElement | null) {
    this.audioElement = element;
  }

  pause() {
    if (this.audioElement && !this.audioElement.paused) {
      this.wasPlaying = true;
      this.originalVolume = this.audioElement.volume;
      this.audioElement.pause();
    }
  }

  resume() {
    if (this.audioElement && this.wasPlaying) {
      this.audioElement.volume = this.originalVolume;
      this.audioElement.play().catch(() => {
        // Ignore autoplay errors
      });
      this.wasPlaying = false;
    }
  }
}

const audioManager = new AudioManager();

// Initialize audio element reference on mount
// Initialize audio element reference on mount
if (typeof window !== 'undefined') {
  const findAudioElement = () => {
    const audio = document.querySelector('audio[src="/got-theme.mp3"]') as HTMLAudioElement;
    if (audio) {
      audioManager.setAudioElement(audio);
    } else {
      // Retry if not found
      setTimeout(findAudioElement, 500);
    }
  };

  // Start looking for the audio element
  setTimeout(findAudioElement, 100);
}

interface VoiceAssistantContextType {
  speak: (text: string, options?: { rate?: number; pitch?: number; volume?: number }) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextType | null>(null);

export function VoiceAssistantProvider({ children }: { children: React.ReactNode }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;

      // Load voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // Prefer a natural-sounding voice (Google voices are usually best)
        const preferredVoice = availableVoices.find(
          (voice) =>
            (voice.lang.includes('IN') || voice.name.includes('India') || voice.name.includes('Hindi')) ||
            voice.name.includes('Google') ||
            voice.name.includes('Samantha') ||
            voice.name.includes('Karen') ||
            voice.name.includes('Daniel') ||
            (voice.lang.startsWith('en') && voice.localService === false)
        ) || availableVoices.find(voice => voice.lang.startsWith('en')) || availableVoices[0];

        if (preferredVoice) {
          setSelectedVoice(preferredVoice);
        }
      };

      loadVoices();

      // Some browsers load voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      audioManager.resume();
    }
  }, []);

  const speak = useCallback((text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
  }) => {
    if (!isSupported || !synthRef.current || !text.trim()) {
      console.warn('Speech synthesis not supported or no text provided');
      return;
    }

    // Stop any ongoing speech
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    // Pause GOT theme audio
    audioManager.pause();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = options?.rate || 1.0;
    utterance.pitch = options?.pitch || 1.0;
    utterance.volume = options?.volume || 0.9;
    utterance.lang = selectedVoice?.lang || 'en-US';

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      audioManager.resume();
    };

    utterance.onerror = (event) => {
      // Ignore interruption errors which happen when we cancel speech
      if (event.error === 'canceled' || event.error === 'interrupted') {
        setIsSpeaking(false);
        audioManager.resume();
        return;
      }
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      audioManager.resume();
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [isSupported, selectedVoice]);

  // Add keydown listener for 'S' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if 's' or 'S' is pressed and not in an input field
      if (e.key.toLowerCase() === 's' &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)) {
        stop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stop]);

  return (
    <VoiceAssistantContext.Provider value={{
      speak,
      stop,
      isSpeaking,
      isSupported,
      voices,
      selectedVoice,
      setSelectedVoice
    }}>
      {children}
    </VoiceAssistantContext.Provider>
  );
}

export function useVoiceAssistant() {
  const context = useContext(VoiceAssistantContext);
  if (!context) {
    throw new Error('useVoiceAssistant must be used within a VoiceAssistantProvider');
  }
  return context;
}

// Global stop button component that appears when speaking
export function VoiceAssistantStopButton() {
  const { isSpeaking, stop } = useVoiceAssistant();

  if (!isSpeaking) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-[10000]">
      <button
        onClick={stop}
        className="glass-panel-got px-3 py-2 md:px-4 md:py-3 rounded-lg border border-red-500/50 text-red-300 hover:text-red-200 hover:border-red-400/70 font-medium transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center gap-2 animate-pulse text-sm md:text-base"
        title="Stop explanation (Press 'S')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>Stop</span>
      </button>
    </div>
  );
}

// Explain button component
interface ExplainButtonProps {
  onClick: () => void;
  isSpeaking?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ExplainButton({
  onClick,
  isSpeaking: externalIsSpeaking,
  className = '',
  size = 'md'
}: ExplainButtonProps) {
  const { isSpeaking: globalIsSpeaking } = useVoiceAssistant();
  // Use external prop if provided, otherwise use global state
  const isSpeaking = externalIsSpeaking !== undefined ? externalIsSpeaking : globalIsSpeaking;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <button
      onClick={onClick}
      disabled={isSpeaking}
      className={`
        ${sizeClasses[size]}
        glass-panel-got
        border border-cyan-500/30
        text-cyan-300
        hover:text-cyan-200
        hover:border-cyan-400/50
        rounded-lg
        font-medium
        transition-all
        shadow-[0_0_10px_rgba(6,182,212,0.2)]
        hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]
        disabled:opacity-50
        disabled:cursor-not-allowed
        flex items-center gap-2
        ${className}
      `}
      title={isSpeaking ? 'Speaking...' : 'Explain this data'}
    >
      {isSpeaking ? (
        <>
          <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Speaking...</span>
        </>
      ) : (
        <>
          <span>🗣</span>
          <span>Explain</span>
        </>
      )}
    </button>
  );
}

// Helper function to generate intelligent explanations
export function generateExplanation(type: string, data: any): string {
  switch (type) {
    case 'rssi_trend':
      const avgRssi = data.avgRssi || -70;
      let rssiDesc = '';
      if (avgRssi > -50) rssiDesc = 'excellent signal strength, indicating very strong RF coverage';
      else if (avgRssi > -70) rssiDesc = 'good signal strength, showing reliable RF connectivity';
      else if (avgRssi > -85) rssiDesc = 'moderate signal strength, which may experience occasional interference';
      else rssiDesc = 'weak signal strength, suggesting potential connectivity issues';

      return `The current average RSSI, or Received Signal Strength Indicator, is ${avgRssi.toFixed(1)} decibels per milliwatt. This represents ${rssiDesc}. Higher values closer to zero indicate stronger signals, while values below negative 85 decibels may require attention.`;

    case 'noise_floor':
      const noise = data.noiseFloor || -95;
      let noiseDesc = '';
      if (noise < -95) noiseDesc = 'very quiet environment with minimal interference';
      else if (noise < -90) noiseDesc = 'relatively quiet with low background noise';
      else if (noise < -85) noiseDesc = 'moderate noise levels that may affect signal quality';
      else noiseDesc = 'high noise floor indicating significant interference in the area';

      return `The noise floor is currently at ${noise} decibels per milliwatt. This represents ${noiseDesc}. A lower noise floor, meaning more negative values, indicates a cleaner RF environment. High noise floors can degrade signal quality and reduce the effective range of your devices.`;

    case 'snr':
      const snr = data.snr || 20;
      let snrDesc = '';
      if (snr > 40) snrDesc = 'excellent signal-to-noise ratio, providing very reliable communication';
      else if (snr > 25) snrDesc = 'good signal quality with minimal interference';
      else if (snr > 15) snrDesc = 'acceptable signal quality, though some interference may be present';
      else snrDesc = 'poor signal-to-noise ratio, indicating significant interference or weak signals';

      return `The Signal-to-Noise Ratio, or SNR, is ${snr.toFixed(1)} decibels. This represents ${snrDesc}. SNR measures how much stronger your signal is compared to background noise. Higher values mean clearer communication. Values above 25 decibels are generally considered good for reliable RF communication.`;

    case 'heatmap_region':
      const intensity = data.intensity || 0.5;
      const count = data.pointCount || 0;
      let regionDesc = '';
      if (intensity > 0.8) regionDesc = 'a high-intensity zone with very strong RF signals';
      else if (intensity > 0.5) regionDesc = 'a moderate-intensity area with good signal coverage';
      else regionDesc = 'a lower-intensity region that may need additional coverage';

      return `This heatmap region shows ${regionDesc}, based on ${count} data points. The color intensity represents signal strength, with red and yellow areas indicating stronger signals and blue areas showing weaker coverage. This visualization helps identify optimal placement locations for RF devices and areas that may require signal boosters.`;

    case 'graph_trend':
      const trend = data.trend || 'stable';
      const metric = data.metric || 'RSSI';
      let trendDesc = '';
      if (trend === 'increasing') trendDesc = 'showing an improving trend, which suggests signal conditions are getting better';
      else if (trend === 'decreasing') trendDesc = 'showing a declining trend, which may indicate increasing interference or distance from signal sources';
      else trendDesc = 'showing a stable pattern, indicating consistent signal conditions';

      return `The ${metric} graph is ${trendDesc} over time. This trend analysis helps identify patterns in RF performance and can indicate when environmental conditions change or when devices may need repositioning.`;

    case 'device_status':
      const device = data.device || {};
      const status = device.lastSeen ?
        (Date.now() - new Date(device.lastSeen).getTime() < 60000 ? 'active' : 'inactive') :
        'unknown';
      return `Device ${device.device_id || 'unknown'} is currently ${status}. It has recorded ${device.readingCount || 0} readings with an average RSSI of ${device.avgRssi?.toFixed(1) || 'N/A'} decibels per milliwatt. ${device.battery !== undefined ? `Battery level is at ${device.battery} percent.` : ''} The device is located at coordinates ${device.lat?.toFixed(4) || 'N/A'}, ${device.lng?.toFixed(4) || 'N/A'}.`;

    case 'data_point':
      const point = data;
      return `This data point shows an RSSI value of ${point.rssi || 'N/A'} decibels per milliwatt, a noise floor of ${point.noise_floor || 'N/A'} decibels per milliwatt, and a signal-to-noise ratio of ${point.snr?.toFixed(1) || 'N/A'} decibels. Recorded at ${new Date(point.timestamp).toLocaleString()} from device ${point.device_id || 'unknown'}.`;

    default:
      return 'This data represents RF signal measurements from your monitoring system.';
  }
}
