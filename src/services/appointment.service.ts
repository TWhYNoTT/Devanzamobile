// src/services/appointment.service.ts

import { api } from '../api/axios';
import { ApiResponse } from '../types/api.types';
import * as AppointmentTypes from '../types/api.types';

/**
 * Appointment Service
 * Handles all appointment-related API calls
 */
export class AppointmentService {
    private static instance: AppointmentService;
    private readonly BASE_PATH = '/customer/appointments';

    private constructor() { }

    public static getInstance(): AppointmentService {
        if (!AppointmentService.instance) {
            AppointmentService.instance = new AppointmentService();
        }
        return AppointmentService.instance;
    }

    /**
     * Book a salon appointment
     */
    async bookSalonAppointment(data: AppointmentTypes.BookSalonAppointmentRequest): Promise<number> {
        try {
            const response = await api.post<number>(`${this.BASE_PATH}/salon`, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Book a home service appointment
     */
    async bookHomeServiceAppointment(data: AppointmentTypes.BookHomeServiceAppointmentRequest): Promise<number> {
        try {
            const response = await api.post<number>(`${this.BASE_PATH}/home-service`, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get customer appointments with filters
     */
    async getAppointments(params?: {
        startDate?: string;
        endDate?: string;
        status?: AppointmentTypes.AppointmentStatus;
        page?: number;
        pageSize?: number;
    }): Promise<AppointmentTypes.CustomerAppointmentListResponse> {
        try {
            const response = await api.get<AppointmentTypes.CustomerAppointmentListResponse>(
                this.BASE_PATH,
                { params }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get appointment details by ID
     */
    async getAppointmentById(id: number): Promise<AppointmentTypes.CustomerAppointmentDetailResponse> {
        try {
            const response = await api.get<AppointmentTypes.CustomerAppointmentDetailResponse>(
                `${this.BASE_PATH}/${id}`
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Cancel an appointment
     */
    async cancelAppointment(id: number): Promise<boolean> {
        try {
            const response = await api.post<boolean>(`${this.BASE_PATH}/${id}/cancel`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get upcoming appointments
     */
    async getUpcomingAppointments(): Promise<{
        appointments: AppointmentTypes.CustomerUpcomingAppointmentDto[];
        totalCount: number;
    }> {
        try {
            const response = await api.get<{
                appointments: AppointmentTypes.CustomerUpcomingAppointmentDto[];
                totalCount: number;
            }>(`${this.BASE_PATH}/upcoming`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get appointment history
     */
    async getAppointmentHistory(): Promise<{
        appointments: AppointmentTypes.CustomerAppointmentHistoryDto[];
        totalCount: number;
    }> {
        try {
            const response = await api.get<{
                appointments: AppointmentTypes.CustomerAppointmentHistoryDto[];
                totalCount: number;
            }>(`${this.BASE_PATH}/history`);
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

export const appointmentService = AppointmentService.getInstance();