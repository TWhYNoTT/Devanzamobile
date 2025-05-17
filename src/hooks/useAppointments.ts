// src/hooks/useAppointments.ts

import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointment.service';
import * as AppointmentTypes from '../types/api.types';

export const useAppointments = () => {
    const queryClient = useQueryClient();

    // Queries
    const { data: appointments, isLoading: isLoadingAppointments } = useQuery({
        queryKey: ['appointments'],
        queryFn: () => appointmentService.getAppointments()
    });

    const { data: upcomingAppointments, isLoading: isLoadingUpcoming } = useQuery({
        queryKey: ['upcomingAppointments'],
        queryFn: () => appointmentService.getUpcomingAppointments()
    });

    const { data: appointmentHistory, isLoading: isLoadingHistory } = useQuery({
        queryKey: ['appointmentHistory'],
        queryFn: () => appointmentService.getAppointmentHistory()
    });

    // Mutations
    const bookSalonAppointmentMutation = useMutation({
        mutationFn: (data: AppointmentTypes.BookSalonAppointmentRequest) =>
            appointmentService.bookSalonAppointment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['upcomingAppointments'] });
        }
    });

    const bookHomeServiceAppointmentMutation = useMutation({
        mutationFn: (data: AppointmentTypes.BookHomeServiceAppointmentRequest) =>
            appointmentService.bookHomeServiceAppointment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['upcomingAppointments'] });
        }
    });

    const cancelAppointmentMutation = useMutation({
        mutationFn: (id: number) => appointmentService.cancelAppointment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['upcomingAppointments'] });
            queryClient.invalidateQueries({ queryKey: ['appointmentHistory'] });
        }
    });

    // Methods
    const bookSalonAppointment = useCallback(async (data: AppointmentTypes.BookSalonAppointmentRequest) => {
        return bookSalonAppointmentMutation.mutateAsync(data);
    }, [bookSalonAppointmentMutation]);

    const bookHomeServiceAppointment = useCallback(async (data: AppointmentTypes.BookHomeServiceAppointmentRequest) => {
        return bookHomeServiceAppointmentMutation.mutateAsync(data);
    }, [bookHomeServiceAppointmentMutation]);

    const cancelAppointment = useCallback(async (id: number) => {
        return cancelAppointmentMutation.mutateAsync(id);
    }, [cancelAppointmentMutation]);

    const getAppointmentDetails = useCallback(async (id: number) => {
        return appointmentService.getAppointmentById(id);
    }, []);

    return {
        appointments,
        upcomingAppointments,
        appointmentHistory,
        isLoading: isLoadingAppointments || isLoadingUpcoming || isLoadingHistory ||
            bookSalonAppointmentMutation.isPending ||
            bookHomeServiceAppointmentMutation.isPending ||
            cancelAppointmentMutation.isPending,
        bookSalonAppointment,
        bookHomeServiceAppointment,
        cancelAppointment,
        getAppointmentDetails
    };
};