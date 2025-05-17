// src\actions\Actions.js
import {
    LOGIN, SOCIAL, SET_USER_INFO, FETCH_USER_INFO, RESETPASSWORD, SELECTED_LOCATION, CONTACTUS, HOME,
    REGISTER, UPLOAD_PROFILE, NEWBOOKINGDATA, GET_USER_EMPLOYEES,
    UPDATE_PROFILE, SEND_EMAIL_FORGET, CHANGE_CONNECTION_STATUS, REFREASH_ADDRESS, OFFERS,
    EMAIL_VERIFICATION, RESEND_CODE, FCM, FETCH_ABOUT, BOOKINGS_REFRESH, LOGINDIALOG,
    REFREASH_APP, SENDOTPBYEMAIL, GET_USER_ADDRESSES, ADD_USER_ADDRESS, UPDATE_USER_ADDRESS, DELETE_USER_ADDRESS, CITIES, OTP, GET_USER_SHIPMENTSES, UPDATE_FCM
} from './types';



export const connectionState = ({ status }) => {
    return { type: CHANGE_CONNECTION_STATUS, isConnected: status };
};

export const login = (params, onSuccess, onError) => ({
    type: LOGIN,
    params,
    onSuccess,
    onError
})

export const social = (params, onSuccess, onError) => ({
    type: SOCIAL,
    params,
    onSuccess,
    onError
})
export const register = (params, onSuccess, onError) => ({
    type: REGISTER,
    params,
    onSuccess,
    onError
})
export const otp = (params, onSuccess, onError) => ({
    type: OTP,
    params,
    onSuccess,
    onError
})
export const verifyEmail = (params, onSuccess, onError) => ({
    type: EMAIL_VERIFICATION,
    params,
    onSuccess,
    onError
})

export const resetPassword = (params, onSuccess, onError) => ({
    type: RESETPASSWORD,
    params,
    onSuccess,
    onError
})

export const sendEmail = (params, onSuccess, onError) => ({
    type: SEND_EMAIL_FORGET,
    params,
    onSuccess,
    onError
})
export const sentOtpByEmail = (params, onSuccess, onError) => ({
    type: SENDOTPBYEMAIL,
    params,
    onSuccess,
    onError
})
export const resendCode = (onSuccess, onError) => ({
    type: RESEND_CODE,
    onSuccess,
    onError
})
export const setUserInfo = (data) => ({
    type: SET_USER_INFO,
    data,
})


export const home = (params, onSuccess, onError) => ({
    type: HOME,
    params,
    onSuccess,
    onError
})


export const refreashApp = (data) => ({
    type: REFREASH_APP,
    data,
})


export const refreashAddress = (data) => ({
    type: REFREASH_ADDRESS,
    data,
})



export const setdefaultLocation = (data) => ({
    type: SELECTED_LOCATION,
    data,
})

export const fetchUserInfo = (onSuccess, onError) => ({
    type: FETCH_USER_INFO,
    onSuccess,
    onError
})



export const fetchAbout = (params, onSuccess, onError) => ({
    type: FETCH_ABOUT,
    onSuccess,
    params,
    onError
})




export const updateProfile = (params, onSuccess, onError) => ({
    type: UPDATE_PROFILE,
    params,
    onSuccess,
    onError
})

export const updateFcm = (params, onSuccess, onError) => ({
    type: UPDATE_FCM,
    params,
    onSuccess,
    onError
})



export const contatcus = (params, onSuccess, onError) => ({
    type: CONTACTUS,
    params,
    onSuccess,
    onError
})



export const uploadProfile = (params, onSuccess, onError) => ({
    type: UPLOAD_PROFILE,
    params,
    onSuccess,
    onError
})


export const categories = (params, onSuccess, onError) => ({
    type: CATEGORIES,
    params,
    onSuccess,
    onError
})



export const cities = (onSuccess, onError) => ({
    type: CITIES,
    onSuccess,
    onError
})



export const contactus = (params, onSuccess, onError) => ({
    type: CONTACTUS,
    params,
    onSuccess,
    onError
})



export const fetchUserAddresses = (params, onSuccess, onError) => ({
    type: GET_USER_ADDRESSES,
    params,
    onSuccess,
    onError
})


export const fetchEmployes = (params, onSuccess, onError) => ({
    type: GET_USER_EMPLOYEES,
    params,
    onSuccess,
    onError
})

export const fetchUserShipments = (params, onSuccess, onError) => ({
    type: GET_USER_SHIPMENTSES,
    params,
    onSuccess,
    onError
})


export const AddUserAddress = (params, onSuccess, onError) => ({
    type: ADD_USER_ADDRESS,
    params,
    onSuccess,
    onError
})

export const UpdateUserAddress = (params, onSuccess, onError) => ({
    type: UPDATE_USER_ADDRESS,
    params,
    onSuccess,
    onError
})
export const deleteAddress = (params, onSuccess, onError) => ({
    type: DELETE_USER_ADDRESS,
    params,
    onSuccess,
    onError
})

export const featuredOffers = (params, onSuccess, onError) => ({
    type: OFFERS,
    params,
    onSuccess,
    onError
})

export const setFcm = (data) => ({
    type: FCM,
    data,
})



export const newBookingData = (data) => ({
    type: NEWBOOKINGDATA,
    data,
})

export const refreashBookings = (params, onSuccess, onError) => ({
    type: BOOKINGS_REFRESH,
    params,
    onSuccess,
    onError
})


export const refreashTimeBookings = (params) => ({
    type: BOOKINGS_REFRESH_TIME,
    params
})




export const openLoginDialog = (params) => ({
    type: LOGINDIALOG,
    params,
})






