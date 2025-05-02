
import { fetchWarehouseLocations } from '@/api/warehouse.api';
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

type SlotOutput = {
  name: string;
  shelf: string;
  totalCapacity: number;
  usedCapacity: number;
  locationCode: string;
};

type ShelfOutput = {
  name: string;
  aisle: string;
  totalCapacity: number;
  usedCapacity: number;
  slots: SlotOutput[];
};

type AisleOutput = {
  name: string;
  zone: string;
  shelfQuantity: number;
  totalCapacity: number;
  usedCapacity: number;
  shelves: ShelfOutput[];
};

export type WarehouseLocations = {
  name: string;
  aisleQuantity: number;
  warehouse: string;
  totalCapacity: number;
  usedCapacity: number;
  aisles: AisleOutput[];
};


export type GlobalStore = {
  currentUser: User;
  warehouseData: WarehouseLocations[] | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: (email: string) => void;
  fetchWarehouseData: (warehouseCode: string) => void;
  
};

export const useGlobalStore = create<GlobalStore>((set) => ({
  currentUser: {
    id: '1',
    name: 'John Doe',
    email: 'admin@example.com',
    role: 'admin',
    warehouse: 'Main Warehouse',
    warehouseCode: 'WH001',
  },
  warehouseData: null,
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
  fetchWarehouseData: async (warehouseCode: string) => {
    set({ isLoading: true });
    // Simulate fetching warehouse data
    const response = await fetchWarehouseLocations(warehouseCode);
     // Assuming the API returns data in this format
    if (response) {
      set(
        {
          warehouseData: response,
          isLoading: false,
          error: null,
        }
      );
    }

  },
}));
