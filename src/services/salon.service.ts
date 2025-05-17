// src/services/salon.service.ts

import { api } from '../api/axios';
import * as SalonTypes from '../types/api.types';

/**
 * Salon Service
 * Handles all salon search and details API calls
 */
export class SalonService {
    private static instance: SalonService;
    private readonly BASE_PATH = '/SalonSearch';

    private constructor() { }

    public static getInstance(): SalonService {
        if (!SalonService.instance) {
            SalonService.instance = new SalonService();
        }
        return SalonService.instance;
    }

    /**
     * Get nearby salons
     */
    async getNearbySalons(query: SalonTypes.GetSalonsByLocationQuery): Promise<SalonTypes.SalonListResponse> {
        try {
            const response = await api.get<SalonTypes.SalonListResponse>(
                `${this.BASE_PATH}/nearby`,
                { params: query }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get salon by ID
     */
    async getSalonById(id: number): Promise<SalonTypes.SalonDetailsResponse> {
        try {
            const response = await api.get<SalonTypes.SalonDetailsResponse>(
                `${this.BASE_PATH}/${id}`
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get salons by category
     */
    async getSalonsByCategory(params: {
        categoryId: number;
        page?: number;
        pageSize?: number;
    }): Promise<SalonTypes.SalonListResponse> {
        try {
            const response = await api.get<SalonTypes.SalonListResponse>(
                `${this.BASE_PATH}/by-category`,
                { params }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Search salons with filters
     */
    async searchSalons(params: {
        categoryIds?: number[];
        serviceIds?: number[];
        serviceType?: SalonTypes.ServiceType;
        minPrice?: number;
        maxPrice?: number;
        hasHomeService?: boolean;
        page?: number;
        pageSize?: number;
    }): Promise<SalonTypes.SalonListResponse> {
        try {
            const response = await api.get<SalonTypes.SalonListResponse>(
                `${this.BASE_PATH}/search`,
                { params }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private handleError(error: unknown): never {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred');
    }
}

export const salonService = SalonService.getInstance();