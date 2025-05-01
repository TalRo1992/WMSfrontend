
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

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  warehouse: string;
  warehouseCode: string;
}
export type GlobalStore = {
  warehouse: string;
  currentUser: User;
  isLoading: boolean;
  error: string | null;
  fetchUser: (email: string) => void;
  
};

export const useGlobalStore = create<GlobalStore>((set) => ({
  warehouse: 'Main Warehouse',
  currentUser: {
    id: '1',
    name: 'John Doe',
    email: 'admin@example.com',
    role: 'admin',
    warehouse: 'Main Warehouse',
    warehouseCode: 'WH001',
  },
  isLoading: false,
  error: null,
  fetchUser: (email:string) => {
    set({ isLoading: true });
    // Simulate fetching user data
    setTimeout(() => {
      set({
        currentUser: {
          id: '2',
          name: 'Jane Smith',
          role: 'user',
          email: email,
          warehouse: 'Secondary Warehouse',
          warehouseCode: 'WH-001',
        },
        isLoading: false,
        error: null,
      });
    }, 1000);
  },
}));
