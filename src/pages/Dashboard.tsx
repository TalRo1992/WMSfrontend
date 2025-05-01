
import { useEffect } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useOrdersStore } from "@/store/useOrdersStore";
import { StatsCard } from "@/components/StatsCard";
import { RecentActivity } from "@/components/RecentActivity";
import { InventoryStatusChart } from "@/components/InventoryStatusChart";
import { TopProductsChart } from "@/components/TopProductsChart";
import { OrdersTable } from "@/components/OrdersTable";
import { Box, LayoutGrid, Package2, Clock } from "lucide-react";

export default function Dashboard() {
  const { metrics, isLoading: isDashboardLoading, fetchDashboardData } = useDashboardStore();
  const { fetchInventoryItems: fetchProducts } = useInventoryStore();
  const { fetchOrders } = useOrdersStore();

  useEffect(() => {
    fetchDashboardData();
    fetchProducts();
    fetchOrders();
  }, [fetchDashboardData, fetchProducts, fetchOrders]);

  return (
    <div className="content-area">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your warehouse management dashboard
        </p>
      </div>

      <div className="mt-6 dashboard-stat-grid">
        <StatsCard
          title={metrics.totalInventoryItems.label}
          value={metrics.totalInventoryItems.value.toLocaleString()}
          change={metrics.totalInventoryItems.change}
          timeframe={metrics.totalInventoryItems.timeframe}
          loading={isDashboardLoading}
          icon={<Box className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title={metrics.ordersProcessing.label}
          value={metrics.ordersProcessing.value}
          change={metrics.ordersProcessing.change}
          timeframe={metrics.ordersProcessing.timeframe}
          loading={isDashboardLoading}
          icon={<Package2 className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title={metrics.avgOrderFulfillment.label}
          value={`${metrics.avgOrderFulfillment.value} days`}
          change={metrics.avgOrderFulfillment.change}
          timeframe={metrics.avgOrderFulfillment.timeframe}
          loading={isDashboardLoading}
          icon={<Clock className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title={metrics.itemsPicked.label}
          value={metrics.itemsPicked.value.toLocaleString()}
          change={metrics.itemsPicked.change}
          timeframe={metrics.itemsPicked.timeframe}
          loading={isDashboardLoading}
          icon={<LayoutGrid className="h-5 w-5 text-primary" />}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProductsChart />
        <InventoryStatusChart />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <OrdersTable />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
