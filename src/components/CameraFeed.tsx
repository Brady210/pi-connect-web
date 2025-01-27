import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";

interface CameraFeedProps {
  connected: boolean;
  isArmed: boolean;
}

const CameraFeed = ({ connected, isArmed }: CameraFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previousFrameRef = useRef<ImageData | null>(null);

  const detectMotion = (context: CanvasRenderingContext2D, width: number, height: number) => {
    if (width === 0 || height === 0) return; // Skip if dimensions are not set
    
    const currentFrame = context.getImageData(0, 0, width, height);
    
    if (previousFrameRef.current) {
      let diff = 0;
      const threshold = 30; // Adjust this value to change motion sensitivity
      const minPixelDiff = (width * height) * 0.01; // 1% of pixels need to change
      
      for (let i = 0; i < currentFrame.data.length; i += 4) {
        const rDiff = Math.abs(currentFrame.data[i] - previousFrameRef.current.data[i]);
        const gDiff = Math.abs(currentFrame.data[i + 1] - previousFrameRef.current.data[i + 1]);
        const bDiff = Math.abs(currentFrame.data[i + 2] - previousFrameRef.current.data[i + 2]);
        
        if (rDiff > threshold || gDiff > threshold || bDiff > threshold) {
          diff++;
        }
      }
      
      if (diff > minPixelDiff && isArmed) {
        toast("Motion Detected!", {
          description: new Date().toLocaleTimeString()
        });
      }
    }
    
    previousFrameRef.current = currentFrame;
  };

  useEffect(() => {
    if (connected && videoRef.current && canvasRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            
            // Wait for video to be loaded before starting motion detection
            videoRef.current.onloadedmetadata = () => {
              if (isArmed && canvasRef.current) {
                const context = canvasRef.current.getContext('2d');
                
                const checkMotion = () => {
                  if (context && videoRef.current && canvasRef.current) {
                    // Set canvas dimensions to match video
                    canvasRef.current.width = videoRef.current.videoWidth;
                    canvasRef.current.height = videoRef.current.videoHeight;
                    
                    // Only process if we have valid dimensions
                    if (videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
                      context.drawImage(videoRef.current, 0, 0);
                      detectMotion(context, canvasRef.current.width, canvasRef.current.height);
                    }
                  }
                  if (isArmed) {
                    requestAnimationFrame(checkMotion);
                  }
                };
                
                requestAnimationFrame(checkMotion);
              }
            };
          }
        })
        .catch(err => {
          console.error("Error accessing camera:", err);
          toast("Error accessing camera", {
            description: err.message,
          });
        });

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
        previousFrameRef.current = null;
      };
    }
  }, [connected, isArmed]);

  if (!connected) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Camera Feed</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center bg-secondary/20">
          <p className="text-gray-400">Connect to device to start camera feed</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Camera Feed {isArmed && "(Motion Detection Active)"}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-[300px] object-cover rounded-b-lg"
        />
        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default CameraFeed;