import { api } from '../api/client';
import type { Brand, Motorcycle, Review } from '../types';

// --- BRANDS ---
export const getBrands = async () => (await api.get<Brand[]>('/brands')).data;
export const createBrand = async (data: Omit<Brand, 'id'>) => (await api.post('/brands', data)).data;
export const updateBrand = async (id: string, data: Partial<Brand>) => (await api.put(`/brands/${id}`, data)).data;
export const deleteBrand = async (id: string) => (await api.delete(`/brands/${id}`)).data;

// --- MOTORCYCLES ---
export const getMotorcycles = async () => (await api.get<Motorcycle[]>('/motorcycles')).data;
export const createMotorcycle = async (data: Omit<Motorcycle, 'id'>) => (await api.post('/motorcycles', data)).data;
export const updateMotorcycle = async (id: string, data: Partial<Motorcycle>) => (await api.put(`/motorcycles/${id}`, data)).data;
export const deleteMotorcycle = async (id: string) => (await api.delete(`/motorcycles/${id}`)).data;

// --- REVIEWS ---
export const getReviews = async () => (await api.get<Review[]>('/reviews')).data;
export const createReview = async (data: Omit<Review, 'id'>) => (await api.post('/reviews', data)).data;
// Note: Backend belum support delete/update review spesifik di frontend flow ini, tapi kita sediakan service-nya
export const deleteReview = async (id: string) => (await api.delete(`/reviews/${id}`)).data;