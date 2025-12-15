import { useState } from 'react';
import { Zap } from 'lucide-react';

interface InitOverlayProps {
  onStart: () => void;
}

export const InitOverlay = ({ onStart }: InitOverlayProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="absolute inset-0 z-50 bg-background/98 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative text-center animate-fade-in-up">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-[0.3em] text-primary text-glow mb-4 animate-glitch">
            HOLOGRAM
          </h1>
          <p className="text-lg tracking-[0.2em] text-muted-foreground font-rajdhani">
            PARTICLE ENGINE v2.0
          </p>
        </div>

        {/* Decorative ring */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-rotate-slow" />
          <div className="absolute inset-4 border border-primary/50 rounded-full animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
          <div className="absolute inset-8 border border-primary/70 rounded-full animate-rotate-slow" style={{ animationDuration: '10s' }} />
          
          {/* Center button */}
          <button
            onClick={onStart}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`absolute inset-12 rounded-full border-2 border-primary flex items-center justify-center
                       transition-all duration-500 cursor-pointer
                       ${isHovering 
                         ? 'bg-primary text-primary-foreground box-glow-intense scale-110' 
                         : 'bg-transparent text-primary animate-pulse-glow'
                       }`}
          >
            <Zap size={32} className={`transition-transform duration-300 ${isHovering ? 'scale-125' : ''}`} />
          </button>
        </div>

        {/* Start text */}
        <p className="text-sm tracking-[0.3em] text-primary/80 uppercase animate-pulse">
          Click to Initialize System
        </p>

        {/* Footer */}
        <p className="mt-12 text-xs text-muted-foreground/50 tracking-wider">
          Voice & Gesture Control Enabled
        </p>
      </div>
    </div>
  );
};
