
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/components/ThemeProvider";

export function TopProductsChart() {
  const { topProducts, isLoading } = useDashboardStore();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Determine bar color based on theme
  const barColor = theme === "dark" ? "hsl(var(--primary))" : "hsl(var(--primary))";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts} layout="vertical">
              <XAxis type="number" hide />
              <Tooltip
                formatter={(value) => [`${value} units`, 'Quantity']}
                labelFormatter={(index) => `${topProducts[index]?.name || ''}`}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                contentStyle={{
                  backgroundColor: theme === "dark" ? "hsl(var(--card))" : "white",
                  borderColor: theme === "dark" ? "hsl(var(--border))" : "#ccc",
                  color: theme === "dark" ? "hsl(var(--foreground))" : "black",
                }}
              />
              <Bar
                dataKey="quantity"
                fill={barColor}
                radius={[4, 4, 4, 4]}
                label={{ 
                  position: 'right', 
                  formatter: (value: number) => `${value}`,
                  fill: theme === "dark" ? "hsl(var(--foreground))" : "hsl(var(--foreground))" 
                }}
                name="Quantity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
