
import { useDashboardStore } from "@/store/useDashboardStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentActivity() {
  const { activityLogs, isLoading } = useDashboardStore();

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-3 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {activityLogs.map((log) => (
            <div key={log.id} className="flex items-start space-x-3">
              <div className="relative mt-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                </div>
                <div className="absolute top-8 bottom-0 left-1/2 -ml-px border-l-2 border-dashed border-muted"></div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{log.action}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {log.user} - {log.timestamp}
                </div>
                <div className="mt-2 text-xs">{log.details}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
