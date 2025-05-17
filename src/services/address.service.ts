// src/services/address.service.ts

import { api } from '../api/axios';
import { CustomerAddressDto, CreateCustomerAddressRequest, UpdateCustomerAddressRequest } from '../types/api.types';

/**
 * Address Service
 * Handles all customer address-related API calls
 */
export class AddressService {
    private static instance: AddressService;
    private readonly BASE_PATH = '/customer/addresses';

    private constructor() { }

    public static getInstance(): AddressService {
        if (!AddressService.instance) {
            AddressService.instance = new AddressService();
        }
        return AddressService.instance;
    }

    /**
     * Get all customer addresses
     */
    async getAddresses(): Promise<CustomerAddressDto[]> {
        try {
            const response = await api.get<CustomerAddressDto[]>(this.BASE_PATH);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get address by ID
     */
    async getAddressById(id: number): Promise<CustomerAddressDto> {
        try {
            const response = await api.get<CustomerAddressDto>(`${this.BASE_PATH}/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Create new address
     */
    async createAddress(data: CreateCustomerAddressRequest): Promise<CustomerAddressDto> {
        try {
            const response = await api.post<CustomerAddressDto>(this.BASE_PATH, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Update address
     */
    async updateAddress(id: number, data: UpdateCustomerAddressRequest): Promise<CustomerAddressDto> {
        try {
            const response = await api.put<CustomerAddressDto>(`${this.BASE_PATH}/${id}`, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Delete address
     */
    async deleteAddress(id: number): Promise<void> {
        try {
            await api.delete(`${this.BASE_PATH}/${id}`);
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

export const addressService = AddressService.getInstance();