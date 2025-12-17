import { useState, useEffect, useCallback, useImperativeHandle, forwardRef, useRef } from 'react';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';

export interface AudioVisualIntroRef {
  stopAudio: () => void;
}

interface AudioVisualIntroProps {
  onComplete: () => void;
  isActive: boolean;
  onAudioStateChange?: (isPlaying: boolean) => void;
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
  { text: "Enjoy exploring the infinite possibilities of the  Hologram Engine", delay: 33000 },
];

export const AudioVisualIntro = forwardRef<AudioVisualIntroRef, AudioVisualIntroProps>(
  ({ onComplete, isActive, onAudioStateChange }, ref) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(-1);
    const [displayedText, setDisplayedText] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [isTyping, setIsTyping] = useState(false); // State for typing animation
    const [currentStep, setCurrentStep] = useState(0); // State to manage the current step in the intro script
    const introStartTimeRef = useRef(0); // Ref to store the start time of the intro
    const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for the timeout between steps

    const stopAudio = useCallback(() => {
      window.speechSynthesis?.cancel();
      onAudioStateChange?.(false);
    }, [onAudioStateChange]);

    useImperativeHandle(ref, () => ({
      stopAudio,
    }), [stopAudio]);

    const speak = useCallback((text: string, onSpeechEnd?: () => void) => {
      if ('speechSynthesis' in window && !isMuted) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        utterance.onstart = () => onAudioStateChange?.(true);
        utterance.onend = () => {
          onAudioStateChange?.(false);
          onSpeechEnd?.(); // Call the callback when speech ends
        };
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          onAudioStateChange?.(false);
          onSpeechEnd?.(); // Also call onSpeechEnd on error to avoid getting stuck
        };
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
          v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        window.speechSynthesis.speak(utterance);
      } else {
        onSpeechEnd?.(); // If speech synthesis is not available or muted, immediately call onSpeechEnd
      }
    }, [isMuted, onAudioStateChange]);

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

    // Main effect for managing the intro sequence lifecycle
    useEffect(() => {
      if (!isActive) {
        if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
        window.speechSynthesis?.cancel();
        onAudioStateChange?.(false);
        setCurrentTextIndex(-1); // Reset visual index
        setDisplayedText('');
        setIsTyping(false);
        setCurrentStep(0); // Reset internal step counter
        return;
      }

      window.speechSynthesis?.getVoices();
      introStartTimeRef.current = Date.now();
      setCurrentStep(0); // Start from the beginning

      return () => {
        if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
        window.speechSynthesis?.cancel();
        onAudioStateChange?.(false);
      };
    }, [isActive]);

    // Effect to process each step in the intro script
    useEffect(() => {
      if (!isActive || currentStep >= introScript.length) {
        if (currentStep >= introScript.length && isActive) {
          // All steps completed, trigger onComplete after a small buffer
          const finalTimeout = setTimeout(() => {
            onComplete();
          }, 1000);
          return () => clearTimeout(finalTimeout);
        }
        return;
      }

      const item = introScript[currentStep];
      setCurrentTextIndex(currentStep); // Update visual index

      // Type text for the current item
      typeText(item.text);

      // Speak the text for the current item
      speak(item.text, () => {
        // Speech for current item ended. Now, schedule the next item.
        const nextStepIndex = currentStep + 1;
        if (nextStepIndex < introScript.length) {
          const nextItem = introScript[nextStepIndex];
          const timeElapsedSinceIntroStart = Date.now() - introStartTimeRef.current;
          const timeToWaitBeforeNextStep = Math.max(0, nextItem.delay - timeElapsedSinceIntroStart);

          stepTimeoutRef.current = setTimeout(() => {
            setCurrentStep(nextStepIndex); // Advance to the next step
          }, timeToWaitBeforeNextStep);
        } else {
          // Last item finished speaking, let the main effect handle final onComplete
          setCurrentStep(nextStepIndex); // Mark as complete
        }
      });

      return () => {
        // Cleanup for this specific step if component unmounts or isActive changes
        if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
      };
    }, [currentStep, isActive, speak, typeText, onComplete]);

    const handleSkip = () => {
      window.speechSynthesis?.cancel();
      onAudioStateChange?.(false);
      onComplete();
    };

    const toggleMute = () => {
      if (!isMuted) {
        window.speechSynthesis?.cancel();
        onAudioStateChange?.(false);
      }
      setIsMuted(!isMuted);
    };

    if (!isActive) return null;

    return (
      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
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
  }
);

AudioVisualIntro.displayName = 'AudioVisualIntro';
