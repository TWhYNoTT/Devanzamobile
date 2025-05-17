// src/hooks/useFavorites.ts

import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../services/favorite.service';
import { useAuthContext } from '../contexts/AuthContext';

export const useFavorites = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();

    // Query
    const { data: favorites, isLoading } = useQuery({
        queryKey: ['favorites', user?.userId],
        queryFn: () => user?.userId ? favoriteService.getFavoriteSalons(user.userId) : null,
        enabled: !!user?.userId
    });

    // Mutations
    const addToFavoritesMutation = useMutation({
        mutationFn: (businessId: number) =>
            favoriteService.addSalonToFavorites(businessId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        }
    });

    const removeFromFavoritesMutation = useMutation({
        mutationFn: (businessId: number) =>
            favoriteService.removeSalonFromFavorites(businessId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        }
    });

    // Methods
    const addToFavorites = useCallback(async (businessId: number) => {
        return addToFavoritesMutation.mutateAsync(businessId);
    }, [addToFavoritesMutation]);

    const removeFromFavorites = useCallback(async (businessId: number) => {
        return removeFromFavoritesMutation.mutateAsync(businessId);
    }, [removeFromFavoritesMutation]);

    return {
        favorites: favorites?.favoriteSalons || [],
        totalCount: favorites?.totalCount || 0,
        isLoading: isLoading ||
            addToFavoritesMutation.isPending ||
            removeFromFavoritesMutation.isPending,
        addToFavorites,
        removeFromFavorites
    };
};