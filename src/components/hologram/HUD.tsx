import { useState } from 'react';
import { ChevronDown, ChevronUp, Hand, Volume2, VolumeX, Mic, Camera, CameraOff, Square } from 'lucide-react';
import { ShapeName } from '@/hooks/useParticleGeometry';

interface HUDProps {
  currentShape: ShapeName;
  rotationAxis: 'x' | 'y';
  isOrbiting: boolean;
  isGestureActive: boolean;
  isVoiceActive: boolean;
  isCameraActive: boolean;
  isAudioPlaying: boolean;
  statusText: string;
  onToggleCamera: () => void;
  onStopAudio: () => void;
}

const shapeDisplayNames: Record<ShapeName, string> = {
  sphere: 'SPHERE',
  cube: 'CUBE',
  heart: 'HEART',
  saturn: 'SATURN',
  dna: 'DNA HELIX',
  pyramid: 'PYRAMID',
  flower: 'FLOWER',
  galaxy: 'GALAXY',
  tree: 'TREE',
  cyclone: 'CYCLONE',
  cycloid: 'CYCLOID',
  blackhole: 'BLACK HOLE',
};

export const HUD = ({
  currentShape,
  rotationAxis,
  isOrbiting,
  isGestureActive,
  isVoiceActive,
  isCameraActive,
  isAudioPlaying,
  statusText,
  onToggleCamera,
  onStopAudio,
}: HUDProps) => {
  const [isGestureDropdownOpen, setIsGestureDropdownOpen] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-20 animate-fade-in-up">
      <div className="hud-panel min-w-[280px]">
        {/* Title */}
        <h1 className="text-xl font-bold tracking-[0.2em] text-primary text-glow mb-4 uppercase">
          Hologram Engine
        </h1>

        {/* Status Lines */}
        <div className="space-y-2 font-rajdhani text-sm">
          <StatusLine label="SHAPE" value={shapeDisplayNames[currentShape]} />
          <StatusLine label="AXIS" value={rotationAxis === 'y' ? 'HORIZONTAL (Y)' : 'VERTICAL (X)'} />
          <StatusLine label="CAMERA" value={isOrbiting ? 'ORBITING' : 'STATIC'} />
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">GESTURE:</span>
            <span className={`flex items-center gap-1 ${isGestureActive ? 'text-primary' : 'text-muted-foreground'}`}>
              <Hand size={12} />
              {isGestureActive ? 'ACTIVE' : 'DISABLED'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">WEBCAM:</span>
            <button
              onClick={() => onToggleCamera()}
              className={`px-2 py-0.5 text-xs border rounded transition-colors flex items-center gap-1 ${
                isCameraActive 
                  ? 'border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400' 
                  : 'border-primary/50 bg-primary/10 hover:bg-primary/20'
              }`}
            >
              {isCameraActive ? <CameraOff size={12} /> : <Camera size={12} />}
              {isCameraActive ? 'STOP ⏹️' : 'START'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">AUDIO:</span>
            <button
              onClick={onStopAudio}
              disabled={!isAudioPlaying}
              className={`px-2 py-0.5 text-xs border rounded transition-colors flex items-center gap-1 ${
                isAudioPlaying 
                  ? 'border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400' 
                  : 'border-muted/30 bg-muted/10 text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isAudioPlaying ? <VolumeX size={12} /> : <Volume2 size={12} />}
              {isAudioPlaying ? 'STOP ⏹️' : 'IDLE'}
            </button>
          </div>

          <StatusLine label="STATUS" value={statusText} highlight />
        </div>

        {/* Gesture Dropdown */}
        <div className="mt-4 pt-3 border-t border-primary/20">
          <button
            onClick={() => setIsGestureDropdownOpen(!isGestureDropdownOpen)}
            className="flex items-center justify-between w-full text-sm font-semibold tracking-wider hover:text-primary transition-colors"
          >
            <span>GESTURE COMMANDS</span>
            {isGestureDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {isGestureDropdownOpen && (
            <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground font-rajdhani animate-fade-in-up">
              <GestureItem icon="🖐️" text="Open Hand: Explode" />
              <GestureItem icon="✊" text="Closed Fist: Compress" />
              <GestureItem icon="✋" text="Neutral Hand: Assemble" />
              <GestureItem icon="→" text="Swipe Left/Right: Rotate" />
              <GestureItem icon="↔️" text="Two Hands: Camera Zoom" />
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusLine = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}:</span>
    <span className={highlight ? 'text-primary text-glow-sm' : 'text-foreground'}>{value}</span>
  </div>
);

const GestureItem = ({ icon, text }: { icon: string; text: string }) => (
  <li className="flex items-center gap-2">
    <span className="w-6 text-center">{icon}</span>
    <span>{text}</span>
  </li>
);
