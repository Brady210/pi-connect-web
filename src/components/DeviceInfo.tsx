import React from "react";

interface DeviceInfoProps {
  ipAddress: string;
  hostname: string;
  uptime: string;
}

const DeviceInfo = ({ ipAddress, hostname, uptime }: DeviceInfoProps) => {
  return (
    <div className="bg-secondary/10 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Device Information</h3>
      <div className="space-y-2 font-mono text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">IP Address:</span>
          <span>{ipAddress}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Hostname:</span>
          <span>{hostname}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Uptime:</span>
          <span>{uptime}</span>
        </div>
      </div>
    </div>
  );
};

export default DeviceInfo;