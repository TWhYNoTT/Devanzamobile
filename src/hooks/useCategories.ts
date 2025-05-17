// src/hooks/useCategories.ts

import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';

export const useCategories = () => {
    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryService.getCategories(),
        staleTime: 1000 * 60 * 60 // 1 hour (categories don't change often)
    });

    return {
        categories: categories?.categories || [],
        totalCount: categories?.totalCount || 0,
        isLoading
    };
};