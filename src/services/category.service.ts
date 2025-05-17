// src/services/category.service.ts

import { api } from '../api/axios';
import { CategoryListResponse } from '../types/api.types';

/**
 * Category Service
 * Handles all category-related API calls
 */
export class CategoryService {
    private static instance: CategoryService;
    private readonly BASE_PATH = '/Category';

    private constructor() { }

    public static getInstance(): CategoryService {
        if (!CategoryService.instance) {
            CategoryService.instance = new CategoryService();
        }
        return CategoryService.instance;
    }

    /**
     * Get all approved categories
     */
    async getCategories(): Promise<CategoryListResponse> {
        try {
            const response = await api.get<CategoryListResponse>(this.BASE_PATH);
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

export const categoryService = CategoryService.getInstance();