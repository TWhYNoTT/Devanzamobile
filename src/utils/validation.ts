// src/utils/validation.ts

import { ValidationRules } from '../types/auth.types';

export class ValidationError extends Error {
    constructor(public field: string, message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export const validateAuth = {
    /**
     * Validates a password against the required criteria
     */
    password(password: string): void {
        if (password.length < ValidationRules.PASSWORD_MIN_LENGTH) {
            throw new ValidationError(
                'password',
                `Password must be at least ${ValidationRules.PASSWORD_MIN_LENGTH} characters long`
            );
        }
        if (!ValidationRules.PASSWORD_REGEX.test(password)) {
            throw new ValidationError(
                'password',
                'Password must contain at least one letter and one number'
            );
        }
    },

    /**
     * Validates an email address
     */
    email(email: string): void {
        if (!ValidationRules.EMAIL_REGEX.test(email)) {
            throw new ValidationError('email', 'Please enter a valid email address');
        }
    },

    /**
     * Validates a phone number
     */
    phone(phone: string): void {
        if (!ValidationRules.PHONE_REGEX.test(phone)) {
            throw new ValidationError('phone', 'Please enter a valid 10-digit phone number');
        }
    },

    /**
     * Validates full name
     */
    fullName(name: string): void {
        if (!name.trim()) {
            throw new ValidationError('fullName', 'Full name is required');
        }
        if (name.trim().length < 2) {
            throw new ValidationError('fullName', 'Full name must be at least 2 characters long');
        }
    },

    /**
     * Validates country code
     */
    countryCode(code: string): void {
        if (!code.startsWith('+')) {
            throw new ValidationError('countryCode', 'Country code must start with +');
        }
    },

    /**
     * Validates gender
     */
    gender(gender: string): void {
        const validGenders = ['Male', 'Female', 'Other'];
        if (!validGenders.includes(gender)) {
            throw new ValidationError('gender', 'Please select a valid gender');
        }
    },

    /**
     * Validates terms acceptance
     */
    termsAccepted(accepted: boolean): void {
        if (!accepted) {
            throw new ValidationError('termsAccepted', 'You must accept the terms and conditions');
        }
    },

    /**
     * Validates verification code
     */
    verificationCode(code: string): void {
        if (!/^\d{6}$/.test(code)) {
            throw new ValidationError('code', 'Please enter a valid 6-digit verification code');
        }
    },

    /**
     * Validates provider for social auth
     */
    socialProvider(provider: string): void {
        const validProviders = ['Google', 'Facebook', 'Apple'];
        if (!validProviders.includes(provider)) {
            throw new ValidationError('provider', 'Invalid social provider');
        }
    },

    /**
     * Validates complete sign up request
     */
    signUpRequest(data: any): void {
        this.fullName(data.fullName);
        this.email(data.email);
        this.phone(data.phoneNumber);
        this.countryCode(data.countryCode);
        this.gender(data.gender);
        this.password(data.password);
        this.termsAccepted(data.termsAccepted);
    },

    /**
     * Validates sign in request
     */
    signInRequest(data: any): void {
        if (!data.emailOrPhone) {
            throw new ValidationError('emailOrPhone', 'Email or phone number is required');
        }
        this.password(data.password);
    },

    /**
     * Validates password reset request
     */
    passwordResetRequest(data: any): void {
        if (!data.emailOrPhone) {
            throw new ValidationError('emailOrPhone', 'Email or phone number is required');
        }
        if (!['email', 'phone'].includes(data.resetMethod)) {
            throw new ValidationError('resetMethod', 'Invalid reset method');
        }
    }
};