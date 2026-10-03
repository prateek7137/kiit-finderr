import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'LOST' | 'FOUND_PENDING' | 'FOUND_CONFIRMED';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge = ({ status, size = 'md', className }: StatusBadgeProps) => {
  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'LOST':
        return {
          label: 'LOST',
          icon: AlertCircle,
          className: "bg-red-50 text-red-700 border border-red-200 shadow-sm",
          pulseColor: "bg-red-400"
        };
      case 'FOUND_PENDING':
        return {
          label: 'FOUND PENDING',
          icon: Clock,
          className: "bg-amber-50 text-amber-800 border border-amber-300 shadow-sm",
          pulseColor: "bg-amber-400"
        };
      case 'FOUND_CONFIRMED':
        return {
          label: 'FOUND CONFIRMED',
          icon: CheckCheck,
          className: "bg-primary text-primary-foreground border border-primary shadow-sm",
          pulseColor: "bg-primary"
        };
      default:
        return {
          label: 'UNKNOWN',
          icon: AlertCircle,
          className: "bg-muted text-muted-foreground border border-border",
          pulseColor: "bg-muted-foreground"
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="relative inline-flex">
      <Badge
        className={cn(
          "font-bold uppercase tracking-wide whitespace-nowrap hover:bg-inherit",
          sizeClasses[size],
          config.className,
          className
        )}
      >
        <Icon className={cn(iconSizes[size], "mr-1.5 shrink-0")} />
        {config.label}
      </Badge>

      {/* Animated pulse dot for pending status */}
      {status === 'FOUND_PENDING' && (
        <div className="absolute -top-1 -right-1">
          <div className={cn("w-2 h-2 rounded-full animate-ping", config.pulseColor)}></div>
          <div className={cn("absolute top-0 w-2 h-2 rounded-full", config.pulseColor)}></div>
        </div>
      )}
    </div>
  );
};
