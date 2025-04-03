
import { useEffect, useState } from "react";
import { useInventoryStore } from "@/store/useInventoryStore";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

// Enhanced color palette
const COLOR_PALETTE = {
  light: ["#22c55e", "#f97316", "#ef4444", "#8b5cf6", "#3b82f6"],
  dark: ["#4ade80", "#fb923c", "#f87171", "#a78bfa", "#60a5fa"]
};

const RADIAN = Math.PI / 180;

// Custom label renderer for the pie chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, fill }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill={fill}
      textAnchor="middle" 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function InventoryStatusChart() {
  const { products, isLoading } = useInventoryStore();
  const [chartData, setChartData] = useState<Array<{ name: string; value: number }>>([]);
  const { theme } = useTheme();
  const colors = theme === "dark" ? COLOR_PALETTE.dark : COLOR_PALETTE.light;

  useEffect(() => {
    if (products.length > 0) {
      const statusCounts = products.reduce<Record<string, number>>((acc, product) => {
        const status = product.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const data = Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
      }));

      setChartData(data);
    }
  }, [products]);

  if (isLoading) {
    return (
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="card-gradient overflow-hidden">
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#f97316"
                  dataKey="value"
                  paddingAngle={4}
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]} 
                      stroke={theme === "dark" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)"}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} items`, 'Count']}
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)",
                    borderRadius: "8px",
                    border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
                    padding: "12px"
                  }}
                  labelStyle={{
                    fontWeight: "bold",
                    marginBottom: "4px"
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  layout="horizontal"
                  iconSize={10}
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: "20px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-md bg-background/50 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[index % colors.length] }}></div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
