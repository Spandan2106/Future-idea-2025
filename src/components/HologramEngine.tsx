import { useState, useCallback, useRef, useEffect } from 'react';
import { HologramScene } from './hologram/HologramScene';
import { HUD } from './hologram/HUD';
import { CommandPanel } from './hologram/CommandPanel';
import { CommandInput } from './hologram/CommandInput';
import { TranscriptDisplay } from './hologram/TranscriptDisplay';
import { MicButton } from './hologram/MicButton';
import { InitOverlay } from './hologram/InitOverlay';
import { WebcamPreview } from './hologram/WebcamPreview';
import { AudioVisualIntro } from './hologram/AudioVisualIntro';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useGestureRecognition } from '@/hooks/useGestureRecognition';
import { ShapeName } from '@/hooks/useParticleGeometry';

const allShapes: ShapeName[] = [
  'sphere', 'cube', 'heart', 'saturn', 'dna', 'pyramid',
  'flower', 'galaxy', 'tree', 'cyclone', 'cycloid', 'blackhole'
];

const allColors = ['neon', 'space', 'red', 'green', 'blue', 'gold', 'violet', 'magenta'];

export const HologramEngine = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [currentShape, setCurrentShape] = useState<ShapeName>('sphere');
  const [colorScheme, setColorScheme] = useState('neon');
  const [isSpinning, setIsSpinning] = useState(true);
  const [rotationAxis, setRotationAxis] = useState<'x' | 'y'>('y');
  const [rotationSpeed, setRotationSpeed] = useState(0.002);
  const [isVortex, setIsVortex] = useState(false);
  const [isAttract, setIsAttract] = useState(false);
  const [isRepel, setIsRepel] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [isCompressed, setIsCompressed] = useState(false);
  const [particleSize, setParticleSize] = useState(3.0);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [cameraDistance, setCameraDistance] = useState(130);
  const [isGestureActive, setIsGestureActive] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusText, setStatusText] = useState('READY');
  const [detectedGesture, setDetectedGesture] = useState<string>('None');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const showcaseIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isShowcase, setIsShowcase] = useState(false);

  const stopAllModes = useCallback(() => {
    setIsVortex(false);
    setIsAttract(false);
    setIsRepel(false);
    if (showcaseIntervalRef.current) {
      clearInterval(showcaseIntervalRef.current);
      showcaseIntervalRef.current = null;
    }
    setIsShowcase(false);
  }, []);

  const processCommand = useCallback((command: string) => {
    const cmd = command.toLowerCase().trim();
    setStatusText('PROCESSING...');

    // Shapes
    if (cmd.includes('dna')) { setCurrentShape('dna'); setIsExploded(false); setIsCompressed(false); }
    else if (cmd.includes('saturn')) { setCurrentShape('saturn'); setIsExploded(false); setIsCompressed(false); }
    else if (cmd.includes('pyramid')) { setCurrentShape('pyramid'); setIsExploded(false); setIsCompressed(false); }
    else if (cmd.includes('heart')) { setCurrentShape('heart'); setIsExploded(false); setIsCompressed(false); }
    else if (cmd.includes('cube') || cmd.includes('box')) { setCurrentShape('cube'); setIsExploded(false); setIsCompressed(false); }
    else if (cmd.includes('sphere') || cmd.includes('ball')) { setCurrentShape('sphere'); setIsExploded(false); setIsCompressed(false); }
    else if (cmd.includes('flower')) { setCurrentShape('flower'); setIsExploded(false); setIsCompressed(false); }
    else if (cmd.includes('galaxy')) { setCurrentShape('galaxy'); setIsExploded(false); setIsCompressed(false); }
    else if (cmd.includes('tree')) { setCurrentShape('tree'); setIsExploded(false); setIsCompressed(false); }
    else if (cmd.includes('cyclone')) { setCurrentShape('cyclone'); setIsExploded(false); setIsCompressed(false); }
    else if (cmd.includes('cycloid')) { setCurrentShape('cycloid'); setIsExploded(false); setIsCompressed(false); }
    else if (cmd.includes('blackhole') || cmd.includes('black hole')) { setCurrentShape('blackhole'); setIsExploded(false); setIsCompressed(false); }
    else if (cmd.includes('random shape')) {
      const randomShape = allShapes[Math.floor(Math.random() * allShapes.length)];
      setCurrentShape(randomShape);
      setIsExploded(false);
      setIsCompressed(false);
    }

    // Physics
    else if (cmd.includes('explode')) { setIsExploded(true); setIsCompressed(false); }
    else if (cmd.includes('assemble') || cmd.includes('reset')) { setIsExploded(false); setIsCompressed(false); stopAllModes(); setIsSpinning(true); }
    else if (cmd.includes('compress')) { setIsCompressed(true); setIsExploded(false); }
    else if (cmd.includes('stop vortex')) { setIsVortex(false); setIsSpinning(true); }
    else if (cmd.includes('vortex')) { stopAllModes(); setIsVortex(true); setIsSpinning(false); }
    else if (cmd.includes('stop attract') || cmd.includes('stop repel')) { setIsAttract(false); setIsRepel(false); setIsSpinning(true); }
    else if (cmd.includes('attract')) { stopAllModes(); setIsAttract(true); setIsSpinning(false); }
    else if (cmd.includes('repel')) { stopAllModes(); setIsRepel(true); setIsSpinning(false); }

    // Modes
    else if (cmd.includes('stop showcase')) { stopAllModes(); setIsExploded(false); setIsCompressed(false); }
    else if (cmd.includes('showcase')) {
      stopAllModes();
      setIsShowcase(true);
      showcaseIntervalRef.current = setInterval(() => {
        const randomShape = allShapes[Math.floor(Math.random() * allShapes.length)];
        const randomColor = allColors[Math.floor(Math.random() * allColors.length)];
        setCurrentShape(randomShape);
        setColorScheme(randomColor);
        setIsOrbiting(Math.random() > 0.5);
      }, 5000);
    }
    else if (cmd.includes('toggle gesture')) { setIsGestureActive(prev => !prev); }

    // Rotation
    else if (cmd.includes('rotate vertical')) { setRotationAxis('x'); }
    else if (cmd.includes('rotate horizontal')) { setRotationAxis('y'); }
    else if (cmd.includes('spin fast')) { setRotationSpeed(0.01); setIsSpinning(true); }
    else if (cmd.includes('spin slow')) { setRotationSpeed(0.001); setIsSpinning(true); }
    else if (cmd.includes('stop')) { setIsSpinning(false); }

    // Camera
    else if (cmd.includes('orbit camera')) { setIsOrbiting(true); }
    else if (cmd.includes('stop orbit')) { setIsOrbiting(false); }
    else if (cmd.includes('zoom in')) { setCameraDistance(prev => Math.max(60, prev - 40)); }
    else if (cmd.includes('zoom out')) { setCameraDistance(prev => Math.min(250, prev + 40)); }
    else if (cmd.includes('reset camera')) { setCameraDistance(130); setIsOrbiting(false); }

    // Particles
    else if (cmd.includes('size small')) { setParticleSize(1.5); }
    else if (cmd.includes('size medium')) { setParticleSize(3.0); }
    else if (cmd.includes('size large')) { setParticleSize(5.0); }

    // Colors
    else if (cmd.includes('space') || cmd.includes('multi')) { setColorScheme('space'); }
    else if (cmd.includes('neon')) { setColorScheme('neon'); }
    else if (cmd.includes('gold')) { setColorScheme('gold'); }
    else if (cmd.includes('red')) { setColorScheme('red'); }
    else if (cmd.includes('green')) { setColorScheme('green'); }
    else if (cmd.includes('blue')) { setColorScheme('blue'); }
    else if (cmd.includes('violet')) { setColorScheme('violet'); }
    else if (cmd.includes('magenta')) { setColorScheme('magenta'); }
    else if (cmd.includes('random color')) {
      const randomColor = allColors[Math.floor(Math.random() * allColors.length)];
      setColorScheme(randomColor);
    }

    setTimeout(() => setStatusText('LISTENING'), 500);
  }, [stopAllModes]);

  const handleTranscript = useCallback((text: string) => {
    setTranscript(text);
    setTimeout(() => setTranscript(''), 3000);
  }, []);

  const handleGesture = useCallback((gesture: string) => {
    setDetectedGesture(gesture);
    if (!isGestureActive) return;

    // Simple mapping from gesture to command
    if (gesture === 'Open_Palm') {
      processCommand('explode');
      setStatusText('GESTURE: EXPLODE');
    } else if (gesture === 'Closed_Fist') {
      processCommand('compress');
      setStatusText('GESTURE: COMPRESS');
    } else if (gesture === 'Pointing_Up') {
      processCommand('random shape');
      setStatusText('GESTURE: RANDOM');
    }
  }, [isGestureActive, processCommand]);

  useGestureRecognition(videoRef, handleGesture, isCameraActive);

  const { isActive: isVoiceActive, startRecognition, toggleRecognition } = useVoiceRecognition({
    onCommand: processCommand,
    onTranscript: handleTranscript,
  });

  const handleStart = () => {
    setIsInitialized(true);
    setShowIntro(true);
    // Automatically start the webcam after initialization
    handleToggleCamera(true);
  };

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    startRecognition();
  }, [startRecognition]);

  const handleToggleCamera = useCallback(async (forceOn = false) => {
    const shouldEnable = forceOn || !isCameraActive;
    console.log('[camera] toggle', { forceOn, isCameraActive, shouldEnable });

    if (!shouldEnable) {
      console.log('[camera] stopping');
      const stream = cameraStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      cameraStreamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setDetectedGesture('None');
      setIsCameraActive(false);
      return;
    }

    try {
      console.log('[camera] requesting getUserMedia');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      console.log('[camera] stream acquired');
      cameraStreamRef.current = stream;
      setDetectedGesture('None');
      setIsCameraActive(true);
    } catch (e) {
      console.error('[camera] getUserMedia failed', e);
      cameraStreamRef.current = null;
      setIsCameraActive(false);
      setStatusText('CAMERA DENIED');
    }
  }, [isCameraActive]);


  useEffect(() => {
    if (!isCameraActive) return;

    const stream = cameraStreamRef.current;
    const video = videoRef.current;

    if (!stream || !video) return;

    if (video.srcObject !== stream) {
      console.log('[camera] attaching stream to video element');
      video.srcObject = stream;
    }

    const p = video.play();
    if (p && typeof (p as Promise<void>).catch === 'function') {
      (p as Promise<void>).catch((err) => console.warn('[camera] video.play blocked', err));
    }
  }, [isCameraActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (showcaseIntervalRef.current) {
        clearInterval(showcaseIntervalRef.current);
      }

      const stream = cameraStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      cameraStreamRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {!isInitialized && <InitOverlay onStart={handleStart} />}
      
      <HologramScene
        currentShape={currentShape}
        colorScheme={colorScheme}
        isSpinning={isSpinning}
        rotationAxis={rotationAxis}
        rotationSpeed={rotationSpeed}
        isVortex={isVortex}
        isAttract={isAttract}
        isRepel={isRepel}
        isExploded={isExploded}
        isCompressed={isCompressed}
        particleSize={particleSize}
        isOrbiting={isOrbiting}
        cameraDistance={cameraDistance}
      />

      {isInitialized && (
        <>
          <AudioVisualIntro isActive={showIntro} onComplete={handleIntroComplete} />
          
          <HUD
            currentShape={currentShape}
            rotationAxis={rotationAxis}
            isOrbiting={isOrbiting}
            isGestureActive={isGestureActive}
            isVoiceActive={isVoiceActive}
            isCameraActive={isCameraActive}
            statusText={statusText}
            onToggleCamera={handleToggleCamera}
          />
          <CommandPanel onCommand={processCommand} />
          <TranscriptDisplay transcript={transcript} />
          <CommandInput onCommand={processCommand} />
          <MicButton isActive={isVoiceActive} onClick={toggleRecognition} />
          <WebcamPreview 
            isActive={isCameraActive} 
            videoRef={videoRef} 
            detectedGesture={detectedGesture}
          />
        </>
      )}
    </div>
  );
};
