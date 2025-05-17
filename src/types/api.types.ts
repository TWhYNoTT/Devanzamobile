// src/types/api.types.ts

// Appointment Types
export interface BookSalonAppointmentRequest {
    businessId: number;
    serviceId: number;
    pricingOptionId: number;
    appointmentDate: string; // ISO string
    notes?: string;
}

export interface BookHomeServiceAppointmentRequest {
    businessId: number;
    serviceId: number;
    pricingOptionId: number;
    appointmentDate: string;
    customerAddressId: number;
    notes?: string;
}

export interface CustomerAppointmentDto {
    id: number;
    salonName: string;
    serviceName: string;
    appointmentDate: string;
    duration: string; // TimeSpan as string
    price: number;
    status: AppointmentStatus;
    statusString: string;
    paymentStatus: PaymentStatus;
    paymentStatusString: string;
    isHomeService: boolean;
}

export interface CustomerAppointmentDetailResponse {
    id: number;
    salonName: string;
    appointmentDate: string;
    duration: string;
    serviceName: string;
    price: number;
    currency: string;
    isHomeService: boolean;
    homeServiceAddress?: CustomerAddressDto;
    status: AppointmentStatus;
    statusString: string;
    paymentStatus: PaymentStatus;
    paymentStatusString: string;
}

export interface CustomerAppointmentListResponse {
    appointments: CustomerAppointmentDto[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Additional Appointment Types
export interface CustomerUpcomingAppointmentDto {
    id: number;
    salonName: string;
    appointmentDate: string;
    appointmentTime: string;
    status: AppointmentStatus;
    statusString: string;
}

export interface CustomerAppointmentHistoryDto {
    id: number;
    salonName: string;
    appointmentDate: string;
    appointmentTime: string;
    status: AppointmentStatus;
    statusString: string;
}

// Salon Search Types
export interface GetSalonsByLocationQuery {
    latitude: number;
    longitude: number;
    radiusInKm?: number;
}

export interface SalonDto {
    id: number;
    name: string;
    about: string;
    isVerified: boolean;
    serviceType: ServiceType;
    location: LocationDto;
    categories: CategoryDto[];
}

export interface SalonListResponse {
    salons: SalonDto[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface SalonDetailsResponse {
    id: number;
    name: string;
    about: string;
    isVerified: boolean;
    serviceType: ServiceType;
    location: LocationDto;
    businessHours: BusinessHoursDto[];
    categories: CategoryDto[];
    services: ServiceDto[];
}

export interface LocationDto {
    city: string;
    state: string;
    streetAddress: string;
    zipCode: string;
    hasHomeService: boolean;
    latitude?: number;
    longitude?: number;
}

export interface ServiceDto {
    id: number;
    name: string;
    description: string;
    minPrice: number;
    maxPrice: number;
    minDuration: string;
    maxDuration: string;
    hasHomeService: boolean;
    pricingOptions: PricingOptionDto[];
}

export interface PricingOptionDto {
    id: number;
    name: string;
    price: number;
    currency: string;
    duration: string;
}

export interface BusinessHoursDto {
    dayOfWeek: number; // DayOfWeek enum from backend
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    is24Hours: boolean;
}

// Category Types
export interface CategoryListResponse {
    categories: CategoryDto[];
    totalCount: number;
}

export interface CategoryDto {
    id: number;
    name: string;
    imageUrl?: string;
    isActive: boolean;
    approvalStatus: ApprovalStatus;
}

// Address Types
export interface CustomerAddressDto {
    id: number;
    fullName: string;
    phoneNumber: string;
    buildingNumber: string;
    floor: string;
    streetAddress: string;
    city: string;
    zipCode: string;
    directions: string;
    isDefault: boolean;
}

export interface CreateCustomerAddressRequest {
    fullName: string;
    phoneNumber: string;
    buildingNumber: string;
    floor: string;
    streetAddress: string;
    city: string;
    zipCode: string;
    directions: string;
    isDefault: boolean;
}

export interface UpdateCustomerAddressRequest {
    fullName: string;
    phoneNumber: string;
    buildingNumber: string;
    floor: string;
    streetAddress: string;
    city: string;
    zipCode: string;
    directions: string;
    isDefault: boolean;
}

// Favorites Types
export interface FavoriteSalonDto {
    id: number;
    businessId: number;
    name: string;
    location?: LocationDto;
    serviceType?: string;
}

export interface FavoriteSalonListResponse {
    favoriteSalons: FavoriteSalonDto[];
    totalCount: number;
}

// Enums
export enum AppointmentStatus {
    Pending = 1,
    Approved = 2,
    Completed = 3,
    Cancelled = 4,
    NoShow = 5
}

export enum PaymentStatus {
    Paid = 1,
    Unpaid = 2,
    Upcoming = 3,
    Draft = 4,
    Late = 5
}

export enum ServiceType {
    MenOnly = 1,
    WomenOnly = 2,
    Everyone = 3
}

export enum BusinessType {
    Men = 1,
    Women = 2,
    Both = 3
}

export enum ApprovalStatus {
    Pending = 1,
    Approved = 2,
    Rejected = 3
}

export enum ProfileType {
    Customer = 1,
    SalonOwner = 2,
    SalonStaff = 3
}

export enum Gender {
    Male = 1,
    Female = 2
}

// Generic API Response
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
}

// API Error
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public code?: string,
        public errors?: Record<string, string[]>
    ) {
        super(message);
        this.name = 'ApiError';
    }
}