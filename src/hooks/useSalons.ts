// src/hooks/useSalons.ts

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { salonService } from '../services/salon.service';
import * as SalonTypes from '../types/api.types';

export const useSalons = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number, radius: number } | null>(null);

    // Queries
    const { data: nearbySalons, isLoading: isLoadingNearby } = useQuery({
        queryKey: ['nearbySalons', location],
        queryFn: () => location ? salonService.getNearbySalons({
            latitude: location.latitude,
            longitude: location.longitude,
            radiusInKm: location.radius
        }) : null,
        enabled: !!location
    });

    // Methods
    const searchNearby = useCallback((latitude: number, longitude: number, radius: number) => {
        setLocation({ latitude, longitude, radius });
    }, []);

    const getSalonDetails = useCallback(async (id: number) => {
        return salonService.getSalonById(id);
    }, []);

    const searchByCategory = useCallback(async (categoryId: number, page: number = 1) => {
        return salonService.getSalonsByCategory({
            categoryId,
            page,
            pageSize: 10
        });
    }, []);

    const searchWithFilters = useCallback(async (filters: {
        categoryIds?: number[];
        serviceIds?: number[];
        serviceType?: SalonTypes.ServiceType;
        minPrice?: number;
        maxPrice?: number;
        hasHomeService?: boolean;
        page?: number;
    }) => {
        return salonService.searchSalons({
            ...filters,
            pageSize: 10
        });
    }, []);

    return {
        nearbySalons,
        isLoadingNearby,
        searchNearby,
        getSalonDetails,
        searchByCategory,
        searchWithFilters
    };
};