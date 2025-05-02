import { Zones } from '@/components/WarehouseLayout';
import { Product } from '@/store/useInventoryStore';
import axios from 'axios';
import { token } from './product.api';
import { WarehouseLocations } from '@/store/useGlobalStore';
import { toast } from 'sonner';

export interface Location {
    name: string;
    zone?: string;
    aisle: string;
    shelf?: string;
    barcode?: string;
    products?: Product[];
}

export type ZoneStructureDto = {
    name: string;
    aisleQuantity: number;
    shelvesPerAisle: number;
    slotsPerShelf: number;
  };

const warehouseApi = axios.create({
    baseURL: 'http://localhost:4000/warehouses', // Replace with your actual base URL
    // timeout: 10000, // Optional: Set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Assuming you store the token in localStorage or a secure place
    },
});

export const fetchWarehouseLocations = async (warehouseCode: string): Promise<WarehouseLocations[]> => {
    try {
        const response = await warehouseApi.get(`/${warehouseCode}/zones`);
        return response.data;
    } catch (error) {
        console.error('Error fetching warehouse locations:', error);
        toast.error('Error fetching warehouse locations', {
            style: { background: '#f44336', color: '#fff' },
            duration: 3000,
        });
    }
};

export const createWarehouseStructure = async (warehouseCode: string, zones: any) => {
    try {
        const response = await warehouseApi.post(`/${warehouseCode}/structure`, zones);
        
        toast.success('Warehouse structure created successfully', {
            style: { background: '#4CAF50', color: '#fff' },
            duration: 3000,
        });
        return response.data;
    } catch (error) {
        toast.error('Error on creation warehouse locations', {
            style: { background: '#f44336', color: '#fff' },
            duration: 3000,
        });
    }
};


export default warehouseApi;