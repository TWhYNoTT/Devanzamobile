import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';
import emojiFlags from 'emoji-flags';
import * as Notifications from 'expo-notifications';
import { moderateScale } from 'react-native-size-matters';
import { useAuth } from '../../../../../hooks/useAuth';
import { theme } from '../../../../../core/theme';
import { FONT_FAMILY } from '../../../../../services/config';
import { ProfileType } from '../../../../../types/auth.types';
import { Gender } from '../../../../../types/api.types';

import { Text } from '../../../../../components/widget';
import { FormInputs } from './components/FormInputs';
import { PhoneInput } from './components/PhoneInput';
import { GenderSelector } from './components/GenderSelector';
import { OTPVerification } from './components/OTPVerification';
import SocialLogin from '../components/SocialLogin';
import Header from '../../childs/Header';
import { showSuccess, showDanger, showInfo, translate, getCallingCode } from '../../../../../utils/utils';

const SHAKE_DURATION = 100;
const RESEND_COUNTDOWN = 60;

export const Register: React.FC<{ navigation: any; selectedLocation: { country: string } }> = ({
    navigation,
    selectedLocation
}) => {
    const { signUp, verifyCode } = useAuth();
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    const inputRefs = useRef<any>({});

    // State management
    const [isLoading, setIsLoading] = useState(false);
    const [selectCountry, setSelectCountry] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        gender: Gender.Male,
        countryCode: getCallingCode(selectedLocation?.country || 'EG'),
        flag: emojiFlags.countryCode(selectedLocation?.country || 'EG'),
    });
    const [otpView, setOtpView] = useState(false);
    const [sendAgainDisabled, setSendAgainDisabled] = useState(false);
    const [otp, setOtp] = useState('');
    const [showRed, setShowRed] = useState(false);
    const [hideShow, setHideShow] = useState(false);
    const [countryCode, setCountryCode] = useState<CountryCode>(
        selectedLocation?.country as CountryCode || 'EG'
    );

    const startShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: SHAKE_DURATION,
                useNativeDriver: true
            }),
            Animated.timing(shakeAnimation, {
                toValue: -10,
                duration: SHAKE_DURATION,
                useNativeDriver: true
            }),
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: SHAKE_DURATION,
                useNativeDriver: true
            }),
            Animated.timing(shakeAnimation, {
                toValue: 0,
                duration: SHAKE_DURATION,
                useNativeDriver: true
            })
        ]).start(() => {
            setTimeout(() => setShowRed(false), 500);
        });
    };

    const validateForm = () => {
        if (!formData.fullName) {
            showDanger(translate('PLEASE ENTER FIRST NAME'));
            return false;
        }
        if (!formData.email) {
            showDanger(translate('PLEASE ENTER EMAIL'));
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            showDanger(translate('PLEASE ENTER VALID EMAIL'));
            return false;
        }
        if (!formData.phoneNumber) {
            showDanger(translate('PLEASE ENTER PHONE'));
            return false;
        }
        if (!formData.password) {
            showDanger(translate('PLEASE ENTER PASSWORD'));
            return false;
        }
        return true;
    };

    const handleSubmit = async (otpCode?: string) => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            if (!otpView) {
                // Register new user - always as Customer
                console.log('Starting registration...');

                const response = await signUp({
                    fullName: formData.fullName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    countryCode: formData.countryCode,
                    gender: formData.gender,
                    password: formData.password,
                    termsAccepted: true,
                    userType: ProfileType.Customer // Always register as Customer
                });

                console.log('Registration response:', response);

                // If we get any response with a userId, consider it successful
                if (response && response.userId) {
                    // Skip OTP - go directly to login
                    showSuccess(translate('Register successfully'));

                    // Navigate to login screen
                    // Try different navigation methods based on your app's navigation structure
                    try {
                        navigation.navigate('Login');
                    } catch (navError) {
                        console.log('Navigate failed, trying replace...');
                        try {
                            navigation.replace('Login');
                        } catch (replaceError) {
                            console.log('Replace failed, trying pop...');
                            navigation.pop();
                        }
                    }
                } else {
                    throw new Error('Registration failed');
                }
            }
            // Commenting out OTP verification part as requested
            /*
            else if (otpCode && userId) {
                // Verify OTP code
                const verifyresponse = await verifyCode({
                    userId,
                    code: otpCode,
                    codeType: 'signup'
                });

                if (verifyresponse && verifyresponse.verified) {
                    showSuccess('Registration successful');
                    
                    // Navigate to login after OTP verification
                    if (navigation.replace) {
                        navigation.replace('Login');
                    } else if (navigation.navigate) {
                        navigation.navigate('Login');
                    } else {
                        navigation.pop(2);
                    }
                } else {
                    throw new Error('Invalid OTP code');
                }
            }
            */
        } catch (error) {
            console.error('Registration error:', error);

            if (error instanceof Error) {
                showDanger(error.message);

                if (otpView) {
                    setShowRed(true);
                    startShake();
                    setOtp('');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getNotificationToken = async (): Promise<string> => {
        try {
            const { status } = await Notifications.getPermissionsAsync();
            if (status === 'granted') {
                const expoPushToken = await Notifications.getExpoPushTokenAsync();
                return expoPushToken.data;
            }
        } catch (error) {
            console.log('Notification permission error:', error);
        }
        return '';
    };

    const renderRegistrationForm = () => (
        <View style={styles.formContainer}>
            <Image
                source={require('../../../../../assets/logo.png')}
                resizeMode="contain"
                style={styles.logo}
            />

            <Text bold style={styles.title}>
                Hi there! Introduce yourself
            </Text>

            <FormInputs
                name={formData.fullName}
                email={formData.email}
                password={formData.password}
                hideShow={hideShow}
                onNameChange={(value) => setFormData(prev => ({ ...prev, fullName: value }))}
                onEmailChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                onPasswordChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                onTogglePassword={() => setHideShow(!hideShow)}
                inputRefs={inputRefs}
            />

            <PhoneInput
                flag={formData.flag}
                callingCode={formData.countryCode}
                phone={formData.phoneNumber}
                onPhoneChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value }))}
                onCountryPress={() => setSelectCountry(true)}
                inputRef={(el: any) => inputRefs.current.phone = el}
                onSubmitEditing={() => inputRefs.current.phone?.focus()}
            />

            <GenderSelector
                selectedGender={formData.gender}
                onGenderSelect={(gender) => setFormData(prev => ({
                    ...prev,
                    gender
                }))}
            />

            <TouchableOpacity
                style={[
                    styles.signupButton,
                    !validateForm() && styles.signupButtonDisabled
                ]}
                onPress={() => handleSubmit()}
                disabled={isLoading || !validateForm()}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.signupButtonText}>
                        {translate('Sign Up')}
                    </Text>
                )}
            </TouchableOpacity>

            <View style={styles.socialContainer}>
                <SocialLogin />
            </View>

            <TouchableOpacity
                style={styles.loginLink}
                onPress={() => navigation.pop()}
            >
                <Text style={styles.loginLinkText}>
                    {translate('Already have an account ? ')}
                    <Text bold style={styles.loginLinkBold}>
                        {translate('Sign In')}
                    </Text>
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header
                backPress={() => otpView ? setOtpView(false) : navigation.pop()}
                Text={translate('')}
                language={true}
                back={true}
                navigation={navigation}
                logo={false}
                color={theme.colors.primary}
            />

            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
            >
                {/* Always show registration form since we're skipping OTP */}
                {renderRegistrationForm()}

                {/* Commented out OTP view as requested */}
                {/*
                {otpView ? (
                    <OTPVerification
                        isLoading={isLoading}
                        otp={otp}
                        showRed={showRed}
                        shakeAnimation={shakeAnimation}
                        onOtpChanged={(code) => {
                            setOtp(code);
                            setShowRed(false);
                        }}
                        onOtpFilled={(code) => handleSubmit(code)}
                        onResendPress={() => {
                            if (!sendAgainDisabled) {
                                setSendAgainDisabled(true);
                                handleSubmit();
                                setTimeout(() => setSendAgainDisabled(false), RESEND_COUNTDOWN * 1000);
                            }
                        }}
                        sendAgainDisabled={sendAgainDisabled}
                        phoneNumber={`${formData.countryCode}${formData.phoneNumber}`}
                    />
                ) : (
                    renderRegistrationForm()
                )}
                */}
            </KeyboardAwareScrollView>

            {selectCountry && (
                <CountryPicker
                    visible={selectCountry}
                    withFilter
                    withFlag
                    withCallingCode
                    withEmoji
                    countryCode={countryCode}
                    onSelect={(country) => {
                        setFormData(prev => ({
                            ...prev,
                            countryCode: `+${country.callingCode[0]}`,
                            flag: emojiFlags.countryCode(country.cca2)
                        }));
                        setCountryCode(country.cca2);
                        setSelectCountry(false);
                    }}
                    onClose={() => setSelectCountry(false)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    scrollView: {
        width: '95%',
        alignSelf: 'center',
    },
    scrollViewContent: {
        paddingBottom: moderateScale(100),
    },
    formContainer: {
        width: '90%',
        alignSelf: 'center',
    },
    logo: {
        height: moderateScale(110),
        width: moderateScale(150),
        alignSelf: 'center',
        marginVertical: moderateScale(10),
    },
    title: {
        color: theme.colors.black,
        fontSize: moderateScale(25),
        textAlign: 'center',
        textTransform: 'capitalize',
        marginVertical: moderateScale(20),
    },
    signupButton: {
        backgroundColor: theme.colors.primary,
        height: moderateScale(45),
        borderRadius: moderateScale(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: moderateScale(30),
    },
    signupButtonDisabled: {
        backgroundColor: theme.colors.disabled,
    },
    signupButtonText: {
        color: theme.colors.white,
        fontSize: moderateScale(15),
        fontFamily: FONT_FAMILY,
    },
    socialContainer: {
        marginTop: moderateScale(30),
        width: '100%',
        alignItems: 'center'
    },
    loginLink: {
        marginTop: moderateScale(20),
        alignItems: 'center',
    },
    loginLinkText: {
        color: theme.colors.black,
        fontSize: moderateScale(15),
        textAlign: 'center',
    },
    loginLinkBold: {
        color: theme.colors.primary,
        fontSize: moderateScale(18),
    },
});

export default Register;