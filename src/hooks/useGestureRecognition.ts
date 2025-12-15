import { useEffect, useRef, useState } from 'react';
import {
  HandLandmarker,
  FilesetResolver,
  DrawingUtils
} from '@mediapipe/tasks-vision';

type Gesture = 'Open_Palm' | 'Closed_Fist' | 'Pointing_Up' | 'None';

export const useGestureRecognition = (
  videoRef: React.RefObject<HTMLVideoElement>,
  onGesture: (gesture: Gesture) => void
) => {
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const lastGestureRef = useRef<Gesture>('None');
  const gestureCoolDownRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const createHandLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
        });
        handLandmarkerRef.current = landmarker;
        setIsReady(true);
        console.log('Hand landmarker created successfully.');
      } catch (error) {
        console.error('Error creating hand landmarker:', error);
      }
    };

    createHandLandmarker();
  }, []);

  useEffect(() => {
    if (!isReady || !videoRef.current) return;

    const video = videoRef.current;

    const predictWebcam = () => {
      if (!video.srcObject) return; // Don't predict if the stream is not active
      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        const results = handLandmarkerRef.current?.detectForVideo(video, performance.now());

        if (results && results.landmarks && results.landmarks.length > 0) {
          // For simplicity, we'll only check the first hand
          const landmarks = results.landmarks[0];
          let currentGesture: Gesture = 'None';
          
          // More robust gesture detection logic
          const isIndexUp = landmarks[8].y < landmarks[5].y;
          const areOtherFingersDown = 
            landmarks[12].y > landmarks[9].y &&
            landmarks[16].y > landmarks[13].y &&
            landmarks[20].y > landmarks[17].y;

          if (isIndexUp && areOtherFingersDown) {
            currentGesture = 'Pointing_Up';
          }

          const isFist =
            landmarks[8].y > landmarks[5].y &&
            landmarks[12].y > landmarks[9].y &&
            landmarks[16].y > landmarks[13].y &&
            landmarks[20].y > landmarks[17].y;

          const isOpenPalm =
            landmarks[8].y < landmarks[5].y &&
            landmarks[12].y < landmarks[9].y &&
            landmarks[16].y < landmarks[13].y &&
            landmarks[20].y < landmarks[17].y;

          if (isFist) {
            currentGesture = 'Closed_Fist';
          } else if (isOpenPalm) {
            currentGesture = 'Open_Palm';
          }

          // Debounce gestures to prevent rapid firing
          const now = performance.now();
          if (
            currentGesture !== lastGestureRef.current &&
            now > gestureCoolDownRef.current
          ) {
            onGesture(currentGesture);
            lastGestureRef.current = currentGesture;
            // Set a 500ms cooldown before the next gesture can be triggered
            gestureCoolDownRef.current = now + 500;
          } else if (currentGesture === 'None' && lastGestureRef.current !== 'None') {
            // Allow resetting to 'None' without a cooldown
            onGesture('None');
            lastGestureRef.current = 'None';
          }
        } else {
          if (lastGestureRef.current !== 'None') {
            onGesture('None');
            lastGestureRef.current = 'None';
          }
        }
      }

      requestAnimationFrame(predictWebcam);
    };

    const handlePlaying = () => {
      requestAnimationFrame(predictWebcam);
    };

    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('playing', handlePlaying);
    };
  }, [isReady, videoRef, onGesture]);

  return { isGestureModelReady: isReady };
};
