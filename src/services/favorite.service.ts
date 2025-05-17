// src/services/favorite.service.ts

import { api } from '../api/axios';
import { FavoriteSalonListResponse } from '../types/api.types';

/**
 * Favorite Service
 * Handles all favorite salon-related API calls
 */
export class FavoriteService {
    private static instance: FavoriteService;
    private readonly BASE_PATH = '/FavoriteSalons';

    private constructor() { }

    public static getInstance(): FavoriteService {
        if (!FavoriteService.instance) {
            FavoriteService.instance = new FavoriteService();
        }
        return FavoriteService.instance;
    }

    /**
     * Add salon to favorites
     */
    async addSalonToFavorites(businessId: number): Promise<boolean> {
        try {
            // Backend will get userProfileId from the authenticated user
            const response = await api.post<boolean>(this.BASE_PATH, {
                businessId: businessId
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get user's favorite salons
     */
    async getFavoriteSalons(userProfileId: number): Promise<FavoriteSalonListResponse> {
        try {
            const response = await api.get<FavoriteSalonListResponse>(`${this.BASE_PATH}/${userProfileId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Remove salon from favorites (if endpoint exists)
     */
    async removeSalonFromFavorites(businessId: number): Promise<boolean> {
        try {
            const response = await api.delete<boolean>(`${this.BASE_PATH}/${businessId}`);
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

export const favoriteService = FavoriteService.getInstance();