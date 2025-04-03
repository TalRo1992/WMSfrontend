
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import React from "react";

type StatsCardProps = {
  title: string;
  value: string | number;
  change?: number;
  timeframe?: string;
  className?: string;
  loading?: boolean;
  icon?: React.ReactNode;
};

export function StatsCard({ 
  title, 
  value, 
  change, 
  timeframe, 
  className,
  loading = false,
  icon
}: StatsCardProps) {
  return (
    <div className={cn("stat-card group", className)}>
      {loading ? (
        <div className="space-y-2">
          <div className="h-5 w-1/2 rounded bg-muted animate-pulse"></div>
          <div className="h-8 w-2/3 rounded bg-muted animate-pulse"></div>
          <div className="h-5 w-1/3 rounded bg-muted animate-pulse"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {icon && <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">{icon}</div>}
          </div>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold">{value}</p>
          </div>
          {typeof change === 'number' && (
            <div className="mt-2">
              <div
                className={cn(
                  "flex items-center text-xs font-medium",
                  change > 0 ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {change > 0 ? (
                  <ArrowUpIcon className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                )}
                <span>{Math.abs(change)}%</span>
                {timeframe && (
                  <span className="text-muted-foreground ml-1">
                    {timeframe}
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
