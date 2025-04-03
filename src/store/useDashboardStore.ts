
import { create } from 'zustand';

export type DashboardMetric = {
  label: string;
  value: number;
  change: number;
  timeframe: string;
};

export type ActivityLog = {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
};

export type DashboardStore = {
  metrics: {
    totalInventoryItems: DashboardMetric;
    ordersProcessing: DashboardMetric;
    avgOrderFulfillment: DashboardMetric;
    itemsPicked: DashboardMetric;
  };
  topProducts: { name: string; quantity: number }[];
  activityLogs: ActivityLog[];
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => void;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  metrics: {
    totalInventoryItems: { label: 'Total Inventory Items', value: 0, change: 0, timeframe: 'vs last month' },
    ordersProcessing: { label: 'Orders Processing', value: 0, change: 0, timeframe: 'vs last week' },
    avgOrderFulfillment: { label: 'Avg Order Fulfillment Time', value: 0, change: 0, timeframe: 'vs last month' },
    itemsPicked: { label: 'Items Picked Today', value: 0, change: 0, timeframe: 'vs yesterday' },
  },
  topProducts: [],
  activityLogs: [],
  isLoading: false,
  error: null,
  
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      setTimeout(() => {
        set({
          metrics: {
            totalInventoryItems: { label: 'Total Inventory Items', value: 5843, change: 7.2, timeframe: 'vs last month' },
            ordersProcessing: { label: 'Orders Processing', value: 42, change: 12.5, timeframe: 'vs last week' },
            avgOrderFulfillment: { label: 'Avg Order Fulfillment Time', value: 1.8, change: -15.3, timeframe: 'vs last month' },
            itemsPicked: { label: 'Items Picked Today', value: 357, change: 22.4, timeframe: 'vs yesterday' },
          },
          topProducts: [
            { name: 'Wireless Headphones', quantity: 45 },
            { name: 'Cotton T-Shirt', quantity: 120 },
            { name: 'Bluetooth Speaker', quantity: 32 },
            { name: 'Coffee Maker', quantity: 8 },
            { name: 'Denim Jeans', quantity: 5 }
          ],
          activityLogs: [
            { id: '1', action: 'Order Shipped', user: 'John Smith', timestamp: '10:23 AM', details: 'Order #ORD-10024 shipped to TechStart Inc.' },
            { id: '2', action: 'Inventory Updated', user: 'Emma Johnson', timestamp: '9:45 AM', details: 'Added 25 units of Bluetooth Speaker to inventory.' },
            { id: '3', action: 'Order Created', user: 'Michael Brown', timestamp: '9:12 AM', details: 'New order #ORD-10028 from Global Services.' },
            { id: '4', action: 'Product Location Changed', user: 'Sarah Wilson', timestamp: '8:50 AM', details: 'Moved Power Drill from D-302 to D-405.' },
            { id: '5', action: 'Order Cancelled', user: 'James Lee', timestamp: 'Yesterday', details: 'Order #ORD-10022 cancelled by customer.' },
          ],
          isLoading: false,
        });
      }, 800);
    } catch (error) {
      set({ error: 'Failed to fetch dashboard data', isLoading: false });
    }
  },
}));
