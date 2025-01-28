import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VideoDisplay from './VideoDisplay';
import MotionDetector from './MotionDetector';

interface CameraFeedProps {
  connected: boolean;
  isArmed: boolean;
}

const CameraFeed = ({ connected, isArmed }: CameraFeedProps) => {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

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
        <VideoDisplay onVideoLoad={setVideoElement} />
        <MotionDetector video={videoElement} isArmed={isArmed} />
      </CardContent>
    </Card>
  );
};

export default CameraFeed;