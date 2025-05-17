// src/services/index.ts

/**
 * API Services for Devanza Mobile App
 * Singleton services handling backend communication
 */

/**
 * authService - Authentication API
 * 
 * Methods:
 * - signUp(data) - Create account
 *   Expects: { email, password, confirmPassword, phoneNumber, fullName, userType }
 *   Returns: { userId, verificationToken }
 *   Errors: 400 (invalid), 409 (exists), 422 (validation)
 * 
 * - signIn(data) - Login
 *   Expects: { identifier, password }
 *   Returns: { success, data: { userId, accessToken, refreshToken, tokenType, expiresIn } }
 *   Errors: 401 (invalid), 403 (unverified), 429 (rate limit)
 * 
 * - socialAuth(data) - Social login
 *   Expects: { provider, providerId, email?, fullName?, profilePictureUrl? }
 *   Returns: Same as signIn
 * 
 * - verifyCode(data) - Verify account
 *   Expects: { userId, code }
 *   Returns: boolean
 * 
 * - requestPasswordReset(data) - Reset request
 *   Expects: { email }
 *   Errors: 404 (not found)
 * 
 * - getCurrentUser() - Get profile
 *   Returns: { success, data: UserProfile }
 * 
 * - logout() - Clear session
 */
export * from './auth.services';

/**
 * appointmentService - Appointment management
 * 
 * Methods:
 * - bookSalonAppointment(data) - Book salon
 *   Expects: { businessId, serviceId, pricingOptionId, appointmentDate, notes? }
 *   Returns: appointmentId
 *   Errors: 409 (unavailable), 404 (not found)
 * 
 * - bookHomeServiceAppointment(data) - Book home service
 *   Expects: { ...salonData, customerAddressId }
 *   Returns: appointmentId
 *   Errors: 403 (outside area), 409 (unavailable)
 * 
 * - getAppointments(params?) - List appointments
 *   Expects: { startDate?, endDate?, status?, page?, pageSize? }
 *   Returns: { appointments[], totalCount, page, pageSize, totalPages }
 * 
 * - getAppointmentById(id) - Get details
 *   Returns: CustomerAppointmentDetailResponse
 * 
 * - cancelAppointment(id) - Cancel
 *   Returns: boolean
 *   Errors: 403 (too late), 400 (already cancelled)
 * 
 * - getUpcomingAppointments() - Future appointments
 * - getAppointmentHistory() - Past appointments
 */
export * from './appointment.service';

/**
 * salonService - Salon discovery
 * 
 * Methods:
 * - getNearbySalons(query) - Location search
 *   Expects: { latitude, longitude, radiusInKm? }
 *   Returns: SalonListResponse
 * 
 * - getSalonById(id) - Salon details
 *   Returns: SalonDetailsResponse
 * 
 * - getSalonsByCategory(params) - Category filter
 *   Expects: { categoryId, page?, pageSize? }
 *   Returns: SalonListResponse
 * 
 * - searchSalons(params) - Advanced search
 *   Expects: { categoryIds?, serviceIds?, serviceType?, minPrice?, maxPrice?, hasHomeService?, page? }
 *   Returns: SalonListResponse
 */
export * from './salon.service';

/**
 * categoryService - Service categories
 * 
 * Methods:
 * - getCategories() - Get all categories
 *   Returns: { categories[], totalCount }
 *   Note: Cached for 1 hour
 */
export * from './category.service';

/**
 * addressService - Address management
 * 
 * Methods:
 * - getAddresses() - List addresses
 *   Returns: CustomerAddressDto[]
 * 
 * - getAddressById(id) - Get specific
 *   Returns: CustomerAddressDto
 * 
 * - createAddress(data) - Add address
 *   Expects: { fullName, phoneNumber, buildingNumber, floor, streetAddress, city, zipCode, directions, isDefault }
 *   Returns: CustomerAddressDto
 * 
 * - updateAddress(id, data) - Update
 *   Returns: CustomerAddressDto
 * 
 * - deleteAddress(id) - Remove
 *   Errors: 409 (in use)
 */
export * from './address.service';

/**
 * favoriteService - Favorite salons
 * 
 * Methods:
 * - addSalonToFavorites(businessId) - Add favorite
 *   Returns: boolean
 *   Errors: 409 (already favorited)
 * 
 * - getFavoriteSalons(userProfileId) - Get favorites
 *   Returns: { favoriteSalons[], totalCount }
 * 
 * - removeSalonFromFavorites(businessId) - Remove
 *   Returns: boolean
 */
export * from './favorite.service';