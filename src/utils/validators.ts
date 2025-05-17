// src/utils/validators.ts

export const validators = {
    // Email validation with RFC 5322 standard
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    // Phone number validation (international format)
    // Supports formats: +1234567890, 1234567890
    phone: /^\+?\d{10,15}$/,

    // Helper to detect phone attempt
    phonePattern: /^[0-9+\s-()]+$/,

    // Password validation
    // At least 8 characters
    // At least one uppercase letter
    // At least one lowercase letter
    // At least one number
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
};

export const validateInput = {
    isValidEmail: (email: string): { isValid: boolean; message: string } => {
        const isValid = validators.email.test(email.trim());
        return {
            isValid,
            message: isValid ? '' : 'Please enter a valid email address (e.g., name@example.com)'
        };
    },

    isValidPhone: (phone: string): { isValid: boolean; message: string } => {
        const cleanPhone = phone.replace(/\s/g, '');
        const isValid = validators.phone.test(cleanPhone);
        return {
            isValid,
            message: isValid ? '' : 'Please enter a valid phone number (10-15 digits)'
        };
    },

    isValidEmailOrPhone: (input: string): {
        isValid: boolean;
        type: 'email' | 'phone' | null;
        message: string
    } => {
        const trimmedInput = input.trim();

        // Check if input looks like a phone attempt
        if (validators.phonePattern.test(trimmedInput)) {
            const phoneResult = validateInput.isValidPhone(trimmedInput);
            return {
                isValid: phoneResult.isValid,
                type: 'phone',
                message: phoneResult.message
            };
        }

        // If it has @ or looks like an email attempt
        if (trimmedInput.includes('@')) {
            const emailResult = validateInput.isValidEmail(trimmedInput);
            return {
                isValid: emailResult.isValid,
                type: 'email',
                message: emailResult.message
            };
        }

        // If input exists but type is unclear
        if (trimmedInput.length > 0) {
            return {
                isValid: false,
                type: null,
                message: 'Please enter a valid email address or phone number'
            };
        }

        // Empty input
        return {
            isValid: false,
            type: null,
            message: 'Email or phone number is required'
        };
    },

    isValidPassword: (password: string): {
        isValid: boolean;
        errors: string[]
    } => {
        const errors: string[] = [];

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};
