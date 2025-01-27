import React from "react";
import { Button } from "@/components/ui/button";
import { PowerIcon } from "lucide-react";

interface ConnectionButtonProps {
  connected: boolean;
  onToggle: () => void;
}

const ConnectionButton = ({ connected, onToggle }: ConnectionButtonProps) => {
  return (
    <Button
      onClick={onToggle}
      className={`w-full ${
        connected ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
      }`}
    >
      <PowerIcon className="mr-2 h-4 w-4" />
      {connected ? "Disconnect" : "Connect"}
    </Button>
  );
};

export default ConnectionButton;