import React, { useRef, useEffect } from 'react';
import { detectMotion } from '@/utils/motionDetection';
import { toast } from "sonner";

interface MotionDetectorProps {
  video: HTMLVideoElement | null;
  isArmed: boolean;
}

const MotionDetector = ({ video, isArmed }: MotionDetectorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevFrameRef = useRef<ImageData | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!video || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const checkMotion = () => {
      if (!video || !ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      ctx.drawImage(video, 0, 0);
      
      const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      if (prevFrameRef.current) {
        const motionDetected = detectMotion(prevFrameRef.current, currentFrame);
        if (motionDetected && isArmed) {
          toast("Motion detected!");
        }
      }
      
      prevFrameRef.current = currentFrame;
      animationFrameRef.current = requestAnimationFrame(checkMotion);
    };

    video.addEventListener('play', () => {
      animationFrameRef.current = requestAnimationFrame(checkMotion);
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [video, isArmed]);

  return <canvas ref={canvasRef} className="hidden" />;
};

export default MotionDetector;