
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
  const lastEmailSentRef = useRef<number>(0);

  useEffect(() => {
    if (!video || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sendEmailNotification = async () => {
      // Prevent sending emails too frequently (limit to one every 30 seconds)
      const now = Date.now();
      if (now - lastEmailSentRef.current < 30000) return;
      
      lastEmailSentRef.current = now;
      
      try {
        // Using a simple email sending service with no-cors mode to handle CORS issues
        const response = await fetch('https://formsubmit.co/brady.harmon.11@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'no-cors',
          body: JSON.stringify({
            subject: 'Motion Detected Alert',
            message: `Motion was detected on your camera at ${new Date().toLocaleString()}`,
            _captcha: 'false'
          }),
        });
        
        console.log('Email notification sent');
      } catch (error) {
        console.error('Failed to send email notification:', error);
      }
    };

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
          sendEmailNotification();
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
