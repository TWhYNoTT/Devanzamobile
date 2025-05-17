// src/hooks/useAddresses.ts

import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../services/address.service';
import { CreateCustomerAddressRequest, UpdateCustomerAddressRequest } from '../types/api.types';

export const useAddresses = () => {
    const queryClient = useQueryClient();

    // Query
    const { data: addresses, isLoading } = useQuery({
        queryKey: ['addresses'],
        queryFn: () => addressService.getAddresses()
    });

    // Mutations
    const createAddressMutation = useMutation({
        mutationFn: (data: CreateCustomerAddressRequest) =>
            addressService.createAddress(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        }
    });

    const updateAddressMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateCustomerAddressRequest }) =>
            addressService.updateAddress(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        }
    });

    const deleteAddressMutation = useMutation({
        mutationFn: (id: number) => addressService.deleteAddress(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        }
    });

    // Methods
    const createAddress = useCallback(async (data: CreateCustomerAddressRequest) => {
        return createAddressMutation.mutateAsync(data);
    }, [createAddressMutation]);

    const updateAddress = useCallback(async (id: number, data: UpdateCustomerAddressRequest) => {
        return updateAddressMutation.mutateAsync({ id, data });
    }, [updateAddressMutation]);

    const deleteAddress = useCallback(async (id: number) => {
        return deleteAddressMutation.mutateAsync(id);
    }, [deleteAddressMutation]);

    const getAddressById = useCallback(async (id: number) => {
        return addressService.getAddressById(id);
    }, []);

    return {
        addresses: addresses || [],
        isLoading: isLoading ||
            createAddressMutation.isPending ||
            updateAddressMutation.isPending ||
            deleteAddressMutation.isPending,
        createAddress,
        updateAddress,
        deleteAddress,
        getAddressById
    };
};