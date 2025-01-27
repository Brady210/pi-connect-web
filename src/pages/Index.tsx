import React, { useState, useEffect } from "react";
import StatusIndicator from "@/components/StatusIndicator";
import DeviceInfo from "@/components/DeviceInfo";
import ConnectionButton from "@/components/ConnectionButton";
import CameraFeed from "@/components/CameraFeed";
import { Shield, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const [connected, setConnected] = useState(false);
  const [isArmed, setIsArmed] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    ipAddress: "192.168.1.100",
    hostname: "raspberrypi",
    uptime: "0:00:00",
  });

  const handleConnection = () => {
    setConnected(!connected);
    toast(connected ? "Disconnected from device" : "Connected to device");
  };

  const handleArmToggle = () => {
    setIsArmed(!isArmed);
    toast(
      isArmed 
        ? "System Disarmed - Motion detection stopped" 
        : "System Armed - Motion detection active"
    );
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connected) {
      let seconds = 0;
      interval = setInterval(() => {
        seconds++;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        setDeviceInfo(prev => ({
          ...prev,
          uptime: `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [connected]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-secondary/90 text-white">
      <div className="container max-w-2xl mx-auto py-8">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Raspberry Pi Control Panel</h1>
            <p className="text-gray-400">Monitor and control your device</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <StatusIndicator connected={connected} />
              <span className="font-mono text-sm text-gray-400">
                {new Date().toLocaleTimeString()}
              </span>
            </div>

            <DeviceInfo {...deviceInfo} />

            <div className="flex gap-4 pt-4">
              <ConnectionButton connected={connected} onToggle={handleConnection} />
              <Button
                variant={isArmed ? "destructive" : "default"}
                onClick={handleArmToggle}
                disabled={!connected}
              >
                {isArmed ? (
                  <>
                    <ShieldOff className="mr-2 h-4 w-4" />
                    Disarm System
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Arm System
                  </>
                )}
              </Button>
            </div>
          </div>

          <CameraFeed connected={connected} />
        </div>
      </div>
    </div>
  );
};

export default Index;