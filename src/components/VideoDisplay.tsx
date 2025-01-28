import React, { useRef, useEffect } from 'react';

interface VideoDisplayProps {
  onVideoLoad: (video: HTMLVideoElement) => void;
}

const VideoDisplay = ({ onVideoLoad }: VideoDisplayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            onVideoLoad(videoRef.current);
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
  }, [onVideoLoad]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-full h-[300px] object-cover rounded-b-lg"
    />
  );
};

export default VideoDisplay;