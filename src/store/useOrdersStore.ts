
import { create } from 'zustand';

export type Order = {
  id: string;
  orderNumber: string;
  customer: string;
  date: string;
  status: 'Processing' | 'Picking' | 'Shipping' | 'Delivered' | 'Cancelled';
  items: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  total: number;
};

export type OrdersStore = {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => void;
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  removeOrder: (id: string) => void;
};

export const useOrdersStore = create<OrdersStore>((set) => ({
  orders: [],
  isLoading: false,
  error: null,
  
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      setTimeout(() => {
        set({
          orders: [
            {
              id: '1',
              orderNumber: 'ORD-10023',
              customer: 'Acme Corporation',
              date: '2023-05-15',
              status: 'Delivered',
              items: [
                { productId: '1', productName: 'Wireless Headphones', quantity: 3 },
                { productId: '5', productName: 'Bluetooth Speaker', quantity: 1 }
              ],
              total: 249.95
            },
            {
              id: '2',
              orderNumber: 'ORD-10024',
              customer: 'TechStart Inc',
              date: '2023-05-16',
              status: 'Shipping',
              items: [
                { productId: '4', productName: 'Power Drill', quantity: 2 }
              ],
              total: 129.98
            },
            {
              id: '3',
              orderNumber: 'ORD-10025',
              customer: 'Home Goods Ltd',
              date: '2023-05-16',
              status: 'Processing',
              items: [
                { productId: '3', productName: 'Coffee Maker', quantity: 5 },
                { productId: '6', productName: 'Denim Jeans', quantity: 10 }
              ],
              total: 799.50
            },
            {
              id: '4',
              orderNumber: 'ORD-10026',
              customer: 'Fashion Forward',
              date: '2023-05-17',
              status: 'Picking',
              items: [
                { productId: '2', productName: 'Cotton T-Shirt', quantity: 25 },
                { productId: '6', productName: 'Denim Jeans', quantity: 15 }
              ],
              total: 1175.00
            },
            {
              id: '5',
              orderNumber: 'ORD-10027',
              customer: 'Construx Builders',
              date: '2023-05-18',
              status: 'Processing',
              items: [
                { productId: '4', productName: 'Power Drill', quantity: 8 }
              ],
              total: 519.92
            }
          ],
          isLoading: false,
        });
      }, 800);
    } catch (error) {
      set({ error: 'Failed to fetch orders', isLoading: false });
    }
  },
  
  addOrder: (order) => {
    const newOrder = {
      ...order,
      id: Date.now().toString(),
    };
    set((state) => ({ orders: [...state.orders, newOrder] }));
  },
  
  updateOrderStatus: (id, status) => {
    set((state) => ({
      orders: state.orders.map((order) => 
        order.id === id ? { ...order, status } : order
      ),
    }));
  },
  
  removeOrder: (id) => {
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== id),
    }));
  },
}));
