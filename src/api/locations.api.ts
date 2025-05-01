import { Product } from '@/store/useInventoryStore';
import axios from 'axios';

export interface Location {
    name: string;
    zone?: string;
    aisle: string;
    shelf?: string;
    barcode?: string;
    products?: Product[];
}
const locationsApi = axios.create({
    baseURL: 'http://localhost:4000/locations', // Replace with your actual base URL
    // timeout: 10000, // Optional: Set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getLocations = async (): Promise<Location[]> => {
    const response = await locationsApi.get('/');
    return response.data;
};

export const getLocationById = async (id: string) => {
    const response = await locationsApi.get(`/${id}`);
    return response.data;
};

export const createLocation = async (location: Location) => {
    const response = await locationsApi.post('/', location);
    return response.data;
}

export default locationsApi;