import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export const getAreas = () => api.get('/buses/areas');
export const getBusesByArea = (area: string) => api.get(`/buses/area/${area}`);
export const getBusById = (busId: string) => api.get(`/buses/${busId}`);
export const updateBusLocation = (busId: string, stopName: string) =>
  api.post('/location/update', { busId, stopName });

export default api;