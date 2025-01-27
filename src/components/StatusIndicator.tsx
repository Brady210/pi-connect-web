import React from "react";

interface StatusIndicatorProps {
  connected: boolean;
}

const StatusIndicator = ({ connected }: StatusIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-3 w-3 rounded-full ${
          connected
            ? "bg-green-500 animate-pulse"
            : "bg-red-500"
        }`}
      />
      <span className="text-sm font-mono">
        {connected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
};

export default StatusIndicator;