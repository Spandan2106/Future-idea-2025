import { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';

interface AudioVisualIntroProps {
  onComplete: () => void;
  isActive: boolean;
}

const introScript = [
  { text: "Welcome to Eon Spark Hologram Engine", delay: 0 },
  { text: "Created by an innovative developer passionate about pushing the boundaries of web technology", delay: 3500 },
  { text: "This project is a futuristic 3D particle visualization system", delay: 7000 },
  { text: "Built using cutting-edge technologies including React, Three.js, and React Three Fiber", delay: 11000 },
  { text: "Featuring real-time particle morphing with twelve unique 3D shapes", delay: 15500 },
  { text: "You can control the hologram using voice commands, gestures, or the command panel", delay: 19500 },
  { text: "Try saying commands like DNA, Galaxy, or Explode to transform the visualization", delay: 24000 },
  { text: "Use hand gestures with your camera - open palm to explode, closed fist to compress", delay: 28500 },
  { text: "Enjoy exploring the infinite possibilities of the Eon Spark Hologram Engine", delay: 33000 },
];

export const AudioVisualIntro = ({ onComplete, isActive }: AudioVisualIntroProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(-1);
  const [displayedText, setDisplayedText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Try to get a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  }, [isMuted]);

  const typeText = useCallback((text: string) => {
    setIsTyping(true);
    setDisplayedText('');
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Load voices
    window.speechSynthesis?.getVoices();

    const timeouts: NodeJS.Timeout[] = [];

    introScript.forEach((item, index) => {
      const timeout = setTimeout(() => {
        setCurrentTextIndex(index);
        typeText(item.text);
        speak(item.text);
      }, item.delay);
      timeouts.push(timeout);
    });

    // Auto complete after all scripts
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 38000);
    timeouts.push(completeTimeout);

    return () => {
      timeouts.forEach(clearTimeout);
      window.speechSynthesis?.cancel();
    };
  }, [isActive, speak, typeText, onComplete]);

  const handleSkip = () => {
    window.speechSynthesis?.cancel();
    onComplete();
  };

  const toggleMute = () => {
    if (!isMuted) {
      window.speechSynthesis?.cancel();
    }
    setIsMuted(!isMuted);
  };

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
      {/* Central text display */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8">
        <div className="glass-panel p-8 rounded-2xl border border-primary/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="text-primary/60 text-xs font-orbitron tracking-[0.3em] uppercase">
              System Narrator
            </span>
          </div>
          <p className="text-foreground text-xl md:text-2xl font-rajdhani leading-relaxed min-h-[80px]">
            {displayedText}
            {isTyping && <span className="animate-pulse text-primary">|</span>}
          </p>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-1">
              {introScript.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx <= currentTextIndex ? 'bg-primary' : 'bg-muted/30'
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground/50 text-xs font-orbitron">
              {currentTextIndex + 1} / {introScript.length}
            </span>
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="absolute bottom-8 right-8 flex gap-3 pointer-events-auto">
        <button
          onClick={toggleMute}
          className="glass-panel p-3 rounded-lg border border-primary/30 hover:border-primary/60 
                     transition-all duration-300 hover:box-glow group"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          ) : (
            <Volume2 className="w-5 h-5 text-primary animate-pulse" />
          )}
        </button>
        <button
          onClick={handleSkip}
          className="glass-panel px-4 py-3 rounded-lg border border-primary/30 hover:border-primary/60 
                     transition-all duration-300 hover:box-glow group flex items-center gap-2"
        >
          <span className="text-xs font-orbitron tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
            SKIP INTRO
          </span>
          <SkipForward className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      </div>
    </div>
  );
};
