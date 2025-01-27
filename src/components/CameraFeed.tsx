import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CameraFeedProps {
  connected: boolean;
}

const CameraFeed = ({ connected }: CameraFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (connected && videoRef.current) {
      // In a real implementation, this would connect to the Raspberry Pi camera stream
      // For now, we'll just show the local camera as a placeholder
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Error accessing camera:", err);
        });

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [connected]);

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
        <CardTitle>Camera Feed</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-[300px] object-cover rounded-b-lg"
        />
      </CardContent>
    </Card>
  );
};

export default CameraFeed;