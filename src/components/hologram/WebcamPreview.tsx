import { useRef, useEffect } from 'react';

interface WebcamPreviewProps {
  isActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const WebcamPreview = ({ isActive, videoRef }: WebcamPreviewProps) => {
  if (!isActive) return null;

  return (
    <div className="absolute bottom-4 right-4 z-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-32 h-24 rounded-lg object-cover border border-primary/30 box-glow"
          style={{ transform: 'scaleX(-1)' }}
        />
        <div className="absolute inset-0 rounded-lg border border-primary/50 pointer-events-none" />
        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      </div>
    </div>
  );
};
