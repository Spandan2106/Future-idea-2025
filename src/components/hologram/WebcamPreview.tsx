import { Camera, Hand } from 'lucide-react';

interface WebcamPreviewProps {
  isActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  detectedGesture?: string;
}

export const WebcamPreview = ({ isActive, videoRef, detectedGesture }: WebcamPreviewProps) => {
  if (!isActive) return null;

  return (
    <div className="absolute top-4 right-4 z-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="glass-panel p-2 rounded-xl border border-primary/40">
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <Camera className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-orbitron text-primary/80 tracking-wider">GESTURE CAM</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[8px] text-red-400 font-orbitron">LIVE</span>
            </div>
          </div>
          
          {/* Video container */}
          <div className="relative rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-48 h-36 object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            
            {/* Scan overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border-2 border-primary/30 rounded-lg" />
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
              
              {/* Scanning line effect */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
            </div>
          </div>
          
          {/* Gesture status */}
          <div className="mt-2 px-1">
            <div className="flex items-center gap-2 bg-card/50 rounded px-2 py-1">
              <Hand className="w-3 h-3 text-primary/60" />
              <span className="text-[10px] font-orbitron text-muted-foreground tracking-wider">
                {detectedGesture && detectedGesture !== 'None' 
                  ? `DETECTED: ${detectedGesture.replace('_', ' ').toUpperCase()}`
                  : 'AWAITING GESTURE...'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
