import apiClient from './apiClient';

const authService = {
    /**
     * Register a new user
     * @param {Object} data 
     */
    register: (data) => apiClient.post('/auth/register', data),

    /**
     * Login user
     * @param {Object} data 
     */
    login: (data) => apiClient.post('/auth/login', data),

    /**
     * Logout user
     */
    logout: () => apiClient.post('/auth/logout'),

    /**
     * Get current authenticated user details
     */
    getCurrentUser: () => apiClient.get('/auth/me'),

    /**
     * Verify email OTP code after registration
     * Expects { code }  — Protected route (sends JWT via cookie)
     */
    verifyEmailCode: (code) => apiClient.post('/auth/verify-email', { code }),

    /**
     * Verify phone (WhatsApp) OTP code after registration
     * Expects { code }  — Protected route (sends JWT via cookie)
     */
    verifyPhoneCode: (code) => apiClient.post('/auth/verify-phone', { code }),

    /**
     * Request OTP to a specific email address
     * POST /auth/request-otp  { identifier: email }
     */
    requestOtpToEmail: (email) => apiClient.post('/auth/request-otp', { identifier: email }),

    /**
     * Request OTP to a specific phone/WhatsApp number
     * POST /auth/request-otp  { identifier: phoneNo }
     */
    requestOtpToPhone: (phoneNo) => apiClient.post('/auth/request-otp', { identifier: phoneNo }),

    /**
     * Generic requestOtp — used for passwordless login flow
     * POST /auth/request-otp  { identifier: email | phone }
     */
    requestOtp: (identifier) => apiClient.post('/auth/request-otp', { identifier }),

    /**
     * Verify OTP login flow (passwordless)
     * Expects { identifier, otp }
     */
    verifyOtpLogin: (data) => apiClient.post('/auth/verify-otp-login', data),
};

export default authService;
