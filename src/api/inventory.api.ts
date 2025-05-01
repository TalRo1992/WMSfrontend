import { InventoryItem } from '@/store/useInventoryStore';
import axios from 'axios';
import { token } from './product.api';
const inventoryApi = axios.create({
    baseURL: 'http://localhost:4000/inventory', // Replace with your actual base URL
    // timeout: 10000, // Optional: Set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Assuming you store the token in localStorage or a secure place
    },
});
export const getInventoryItems = async () => {
    const response = await inventoryApi.get('/');
    return response.data;
};

export const getInventoryItemById = async (id: string) => {
    const response = await inventoryApi.get(`/${id}`);
    return response.data;
};

export const createInventoryItems = async (items: InventoryItem[]) => {
    const response = await inventoryApi.post('/', items);
    return response.data;
};

export const updateInventoryItem = async (id: string, item: Record<string, any>) => {
    const response = await inventoryApi.put(`/${id}`, item);
    return response.data;
};

export const deleteInventoryItem = async (id: string) => {
    const response = await inventoryApi.delete(`/${id}`);
    return response.data;
};
export default inventoryApi;