import { InventoryItem } from '@/store/useInventoryStore';
import axios from 'axios';

export interface AddProduct {
    name: string;
    sku: string;
    description?: string;
    customer?: string;
    category?: string;
    upc?: string;
    ean?: string;
    isbn?: string;
    weight?: number;
    weightUnit?: string;
    length?: number;
    width?: number;
    height?: number;
    dimensionUnit?: string;
    price?: number;
    currency?: string;
    isActive?: boolean;
    additionalInfo?: Record<string, any>;
  }
  export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVsZGFkbiIsInN1YiI6IjY3Y2M1MzJkZDQzYTg4MDk1ZmM5ZjNjOSIsImN1c3RvbWVySWQiOiIxMjMiLCJyb2xlIjoiYWRtaW4iLCJpc0FkbWluIjp0cnVlLCJpc1dhcmVob3VzZSI6ZmFsc2UsImlhdCI6MTc0NjA3OTM1NywiZXhwIjoxNzQ2MDgyOTU3fQ.QUfVdpXrcbdkl4zZT2Sn5_sku1e8AfaSb9dvdwYD8ds'

const productApi = axios.create({
    baseURL: 'http://localhost:4000/products', // Replace with your actual base URL
    // timeout: 10000, // Optional: Set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
});
export const getProducts = async () => {
    const response = await productApi.get('/');
    return response.data;
};

export const addProducts = async (items: AddProduct[]) => {
    console.log('Adding products:', items);
    const response = await productApi.post('/bulk', items);
    return response.data;
};

export default productApi;