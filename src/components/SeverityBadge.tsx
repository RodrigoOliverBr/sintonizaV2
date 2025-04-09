
import React from "react";
import { AlertTriangle, Flame, AlertCircle } from "lucide-react";
import { SeverityLevel } from "@/types/form";
import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: SeverityLevel;
}

const SeverityBadge = ({ severity }: SeverityBadgeProps) => {
  const getSeverityDetails = () => {
    switch (severity) {
      case "LEVEMENTE PREJUDICIAL":
        return {
          icon: <AlertCircle size={14} />,
          className: "severity-light",
          label: "Levemente Prejudicial"
        };
      case "PREJUDICIAL":
        return {
          icon: <AlertTriangle size={14} />,
          className: "severity-medium",
          label: "Prejudicial"
        };
      case "EXTREMAMENTE PREJUDICIAL":
        return {
          icon: <Flame size={14} />,
          className: "severity-high",
          label: "Extremamente Prejudicial"
        };
      default:
        return {
          icon: <AlertCircle size={14} />,
          className: "severity-light",
          label: severity
        };
    }
  };

  const { icon, className, label } = getSeverityDetails();

  return (
    <div className={cn("severity-indicator", className)}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default SeverityBadge;
