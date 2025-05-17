// src/hooks/index.ts

/**
 * Custom React Hooks for Devanza Mobile App
 * Manages state and API interactions for various features
 */

/**
 * useAuth Hook - Authentication state and operations
 * 
 * Returns:
 * - user: UserProfile | null - Current user or null
 * - isAuthenticated: boolean - Login status
 * - isLoading: boolean - Operation in progress
 * - isInitialized: boolean - Auth state initialized
 * 
 * Methods:
 * - signUp(data) - Register new user
 *   Expects: { email, password, confirmPassword, phoneNumber, fullName, userType }
 *   Returns: { userId, verificationToken }
 * 
 * - signIn(data) - Login user
 *   Expects: { identifier, password }
 *   Effects: Stores tokens, updates user state
 * 
 * - socialAuth(data) - Social login
 *   Expects: { provider, providerId, email?, fullName? }
 * 
 * - verifyCode(data) - Verify email/phone
 *   Expects: { userId, code }
 *   Returns: boolean
 * 
 * - requestPasswordReset(data) - Request reset
 *   Expects: { email }
 * 
 * - resetPassword(data) - Reset password
 *   Expects: { token, newPassword, confirmNewPassword }
 * 
 * - logout() - Clear auth state
 */
export * from './useAuth';

/**
 * useAppointments Hook - Appointment management
 * 
 * Returns:
 * - appointments: CustomerAppointmentListResponse | undefined
 * - upcomingAppointments: { appointments[], totalCount }
 * - appointmentHistory: { appointments[], totalCount }
 * - isLoading: boolean
 * 
 * Methods:
 * - bookSalonAppointment(data) - Book salon service
 *   Expects: { businessId, serviceId, pricingOptionId, appointmentDate, notes? }
 *   Returns: appointmentId
 * 
 * - bookHomeServiceAppointment(data) - Book home service
 *   Expects: { ...salonData, customerAddressId }
 *   Returns: appointmentId
 * 
 * - cancelAppointment(id) - Cancel appointment
 *   Returns: boolean
 * 
 * - getAppointmentDetails(id) - Get full details
 *   Returns: CustomerAppointmentDetailResponse
 */
export * from './useAppointments';

/**
 * useSalons Hook - Salon search and discovery
 * 
 * Returns:
 * - nearbySalons: SalonListResponse | null
 * - isLoadingNearby: boolean
 * 
 * Methods:
 * - searchNearby(latitude, longitude) - Find nearby salons
 *   Default radius: 10km
 * 
 * - getSalonDetails(id) - Get salon info
 *   Returns: SalonDetailsResponse
 * 
 * - searchByCategory(categoryId, page?) - Filter by category
 *   Returns: SalonListResponse
 * 
 * - searchWithFilters(filters) - Advanced search
 *   Expects: { categoryIds?, serviceIds?, serviceType?, minPrice?, maxPrice?, hasHomeService?, page? }
 *   Returns: SalonListResponse
 */
export * from './useSalons';

/**
 * useCategories Hook - Service categories
 * 
 * Returns:
 * - categories: CategoryDto[] - Available categories
 * - totalCount: number
 * - isLoading: boolean
 * 
 * Note: Results cached for 1 hour
 */
export * from './useCategories';

/**
 * useAddresses Hook - Customer addresses
 * 
 * Returns:
 * - addresses: CustomerAddressDto[]
 * - isLoading: boolean
 * 
 * Methods:
 * - createAddress(data) - Add new address
 *   Expects: { fullName, phoneNumber, buildingNumber, floor, streetAddress, city, zipCode, directions, isDefault }
 *   Returns: CustomerAddressDto
 * 
 * - updateAddress(id, data) - Update address
 *   Returns: CustomerAddressDto
 * 
 * - deleteAddress(id) - Remove address
 *   Throws: Error if address in use
 * 
 * - getAddressById(id) - Get specific address
 *   Returns: CustomerAddressDto
 */
export * from './useAddresses';

/**
 * useFavorites Hook - Favorite salons
 * 
 * Returns:
 * - favorites: FavoriteSalonDto[]
 * - totalCount: number
 * - isLoading: boolean
 * 
 * Methods:
 * - addToFavorites(businessId) - Add salon
 *   Returns: boolean
 * 
 * - removeFromFavorites(businessId) - Remove salon
 *   Returns: boolean
 */
export * from './useFavorites';