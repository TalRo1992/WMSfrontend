
import { create } from 'zustand';

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  barcode?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
};

export type InventoryStore = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  updateStock: (id: string, quantity: number, isIncrement?: boolean) => void;
};

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Normally this would be an API call, but we'll mock for now
      setTimeout(() => {
        set({
          products: [
            {
              id: '1',
              sku: 'ELEC-1001',
              name: 'Wireless Headphones',
              category: 'Electronics',
              quantity: 45,
              location: 'A-101',
              barcode: 'ELEC-1001',
              status: 'In Stock',
            },
            {
              id: '2',
              sku: 'APP-2002',
              name: 'Cotton T-Shirt',
              category: 'Apparel',
              quantity: 120,
              location: 'B-203',
              barcode: 'APP-2002',
              status: 'In Stock',
            },
            {
              id: '3',
              sku: 'HOME-3003',
              name: 'Coffee Maker',
              category: 'Home Goods',
              quantity: 8,
              location: 'C-105',
              barcode: 'HOME-3003',
              status: 'Low Stock',
            },
            {
              id: '4',
              sku: 'TOOL-4004',
              name: 'Power Drill',
              category: 'Tools',
              quantity: 0,
              location: 'D-302',
              barcode: 'TOOL-4004',
              status: 'Out of Stock',
            },
            {
              id: '5',
              sku: 'ELEC-1002',
              name: 'Bluetooth Speaker',
              category: 'Electronics',
              quantity: 32,
              location: 'A-102',
              barcode: 'ELEC-1002',
              status: 'In Stock',
            },
            {
              id: '6',
              sku: 'APP-2003',
              name: 'Denim Jeans',
              category: 'Apparel',
              quantity: 5,
              location: 'B-205',
              barcode: 'APP-2003',
              status: 'Low Stock',
            }
          ],
          isLoading: false,
        });
      }, 800);
    } catch (error) {
      set({ error: 'Failed to fetch products', isLoading: false });
    }
  },
  
  addProduct: (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      barcode: product.barcode || product.sku,
      status: product.quantity > 10 ? 'In Stock' : product.quantity > 0 ? 'Low Stock' : 'Out of Stock'
    } as Product;
    set((state) => ({ products: [...state.products, newProduct] }));
  },
  
  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((product) => 
        product.id === id 
          ? { 
              ...product, 
              ...updates, 
              status: updates.quantity !== undefined 
                ? updates.quantity > 10 
                  ? 'In Stock' as const
                  : updates.quantity > 0 
                    ? 'Low Stock' as const
                    : 'Out of Stock' as const
                : product.status 
            } 
          : product
      ),
    }));
  },
  
  removeProduct: (id) => {
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    }));
  },
  
  updateStock: (id, quantity, isIncrement = false) => {
    set((state) => ({
      products: state.products.map((product) => {
        if (product.id === id) {
          const newQuantity = isIncrement 
            ? product.quantity + quantity 
            : quantity;
          
          return {
            ...product,
            quantity: newQuantity,
            status: newQuantity > 10 
              ? 'In Stock' as const
              : newQuantity > 0 
                ? 'Low Stock' as const
                : 'Out of Stock' as const
          };
        }
        return product;
      }),
    }));
  },
}));
