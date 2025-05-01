import { Zones } from '@/components/WarehouseLayout';
import { Product } from '@/store/useInventoryStore';
import axios from 'axios';
import { token } from './product.api';

export interface Location {
    name: string;
    zone?: string;
    aisle: string;
    shelf?: string;
    barcode?: string;
    products?: Product[];
}
const warehouseApi = axios.create({
    baseURL: 'http://localhost:4000/warehouses', // Replace with your actual base URL
    // timeout: 10000, // Optional: Set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Assuming you store the token in localStorage or a secure place
    },
});

export const getZonesStructure = async (warehouseCode: string): Promise<Zones[]> => {
    const response = await warehouseApi.get(`/${warehouseCode}/zones`);
    return response.data;
};


export default warehouseApi;