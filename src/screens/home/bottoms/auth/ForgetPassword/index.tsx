import React, { useState, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Button } from 'react-native-elements';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';
import emojiFlags from 'emoji-flags';
import { PhoneInput } from './components/PhoneInput';
import { OTPInput } from './components/OTPInput';
import { PasswordReset } from './components/PasswordReset';
import { useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { LoadingOverlay } from './components/LoadingOverlay';
import Header from '../../childs/Header';
import { Text } from '../../../../../components/widget';
import { getCallingCode, showDanger, showInfo, showSuccess, translate } from '../../../../../utils/utils';
import { styles } from './styles';
import { useAuth } from '../../../../../hooks/useAuth';
import { validateInput } from '../../../../../utils/validators';
import { ResetMethod } from '../../../../../types/auth.types';

interface ForgetPasswordProps {
    navigation: any;
    selectedLocation: {
        country: string;
    };
}

const ForgetPassword: React.FC<ForgetPasswordProps> = ({ navigation, selectedLocation }) => {
    const { requestPasswordReset, resetPassword, isLoading: authLoading } = useAuth();

    // Refs
    const inputRefs = useRef<any>({});
    const shakeAnimation = useRef(new Animated.Value(0)).current;

    // State
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        confirmPassword: '',
        otp: '',
    });

    const [viewState, setViewState] = useState({
        otpView: false,
        passwordView: false,
        selectCountry: false,
        hideShow: false,
        showRed: false,
        sendAgainDisabled: false
    });

    const [countryData, setCountryData] = useState({
        callingCode: getCallingCode(selectedLocation?.country || 'EG'),
        flag: emojiFlags.countryCode(selectedLocation?.country || 'EG'),
        cca2: selectedLocation?.country || 'EG' as CountryCode
    });

    const [countryCode, setCountryCode] = useState<CountryCode>(
        selectedLocation?.country as CountryCode || 'EG'
    );
    const [user, setUser] = useState<any>({});

    // OTP Input setup
    const ref = useBlurOnFulfill({ value: formData.otp, cellCount: 4 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: formData.otp,
        setValue: (otp) => setFormData(prev => ({ ...prev, otp })),
    });

    const validatePhone = (): boolean => {
        const { isValid, message } = validateInput.isValidPhone(formData.phone);
        if (!isValid) {
            showDanger(message);
            return false;
        }
        return true;
    };

    const validatePasswords = (): boolean => {
        const { isValid: isValidPass, errors: passErrors } = validateInput.isValidPassword(formData.password);
        if (!isValidPass) {
            showDanger(passErrors.join('\n'));
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            showDanger(translate('PASSWORDS_DO_NOT_MATCH'));
            return false;
        }

        return true;
    };

    const startShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
        ]).start();
    };

    const handleResendOTP = async () => {
        if (!validatePhone()) return;

        setViewState(prev => ({ ...prev, sendAgainDisabled: true }));
        setIsLoading(true);

        try {
            await requestPasswordReset({
                emailOrPhone: `${formData.phone}`,
                resetMethod: ResetMethod.PHONE
            });
            showInfo(translate('OTP_SENT'));

            // Disable resend button for 60 seconds
            setTimeout(() => {
                setViewState(prev => ({ ...prev, sendAgainDisabled: false }));
            }, 60000);
        } catch (error: any) {
            showDanger(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOTP = async () => {
        if (!validatePhone()) return;

        setIsLoading(true);
        try {
            await requestPasswordReset({
                emailOrPhone: `${formData.phone}`,
                resetMethod: ResetMethod.PHONE
            });
            showInfo(translate('OTP_SENT'));
            setViewState(prev => ({ ...prev, otpView: true }));
        } catch (error: any) {
            showDanger(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (otp: string) => {
        if (!otp || otp.length !== 4) {
            showDanger(translate('INVALID_OTP'));
            return;
        }

        setIsLoading(true);
        try {
            // We'll move to password reset screen directly as verification
            // will happen during the actual password reset
            setViewState(prev => ({ ...prev, passwordView: true }));
            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            setViewState(prev => ({ ...prev, showRed: true }));
            startShake();
            setTimeout(() => {
                setViewState(prev => ({ ...prev, showRed: false }));
            }, 500);
            showDanger(error.message);
        }
    };

    const handleResetPassword = async () => {
        if (!validatePasswords()) return;

        setIsLoading(true);
        try {
            await resetPassword({
                emailOrPhone: `${formData.phone}`,
                code: formData.otp,
                newPassword: formData.password
            });
            showSuccess(translate('PASSWORD_RESET_SUCCESS'));
            navigation.pop();
        } catch (error: any) {
            showDanger(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Combine loading states
    const isLoadingState = isLoading || authLoading;

    return (
        <View style={styles.container}>
            <Header
                backPress={() => {
                    if (viewState.passwordView) {
                        setViewState(prev => ({ ...prev, passwordView: false, otpView: true }));
                    } else if (viewState.otpView) {
                        setViewState(prev => ({ ...prev, otpView: false }));
                    } else {
                        navigation.pop();
                    }
                }}
                back={true}
                navigation={navigation}
                logo={false}
            />
            <View style={styles.content}>
                <LoadingOverlay isVisible={isLoadingState} />

                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}
                >
                    <View style={styles.contentContainer}>
                        <Image
                            source={require('../../../../../assets/logo.png')}
                            style={styles.logo}
                            contentFit="contain"
                        />

                        {!viewState.otpView && !viewState.passwordView && (
                            <>
                                <Text bold style={styles.title}>
                                    {translate("It's_ok_we_all_forget")}
                                </Text>
                                <Text style={styles.subtitle}>
                                    {translate('Enter_phone_to_reset')}
                                </Text>
                                <PhoneInput
                                    phone={formData.phone}
                                    countryData={countryData}
                                    onPhoneChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                                    onCountryPress={() => setViewState(prev => ({ ...prev, selectCountry: true }))}
                                    onSubmit={handleSendOTP}
                                />
                            </>
                        )}

                        {viewState.otpView && !viewState.passwordView && (
                            <>
                                <Text bold style={styles.title}>
                                    {translate('SMS_VERIFICATION_SENT')}
                                </Text>
                                <Text style={styles.phoneText}>
                                    {`${countryData.callingCode}${formData.phone}`}
                                </Text>
                                <OTPInput
                                    otp={formData.otp}
                                    setOtp={(otp) => setFormData(prev => ({ ...prev, otp }))}
                                    isLoading={isLoading}
                                    showRed={viewState.showRed}
                                    sendAgainDisabled={viewState.sendAgainDisabled}
                                    shakeAnimation={shakeAnimation}
                                    onResendOTP={handleResendOTP}
                                    onVerifyOTP={handleVerifyOTP}
                                />
                            </>
                        )}

                        {viewState.passwordView && (
                            <>
                                <Text bold style={styles.title}>
                                    {translate('Choose_new_password')}
                                </Text>
                                <PasswordReset
                                    password={formData.password}
                                    confirmPassword={formData.confirmPassword}
                                    hideShow={viewState.hideShow}
                                    onPasswordChange={(password) => setFormData(prev => ({ ...prev, password }))}
                                    onConfirmPasswordChange={(confirmPassword) => setFormData(prev => ({ ...prev, confirmPassword }))}
                                    onTogglePassword={() => setViewState(prev => ({ ...prev, hideShow: !prev.hideShow }))}
                                />
                            </>
                        )}

                        <Button
                            loading={isLoading}
                            disabled={isLoading}
                            title={translate(viewState.passwordView ? 'Reset_password' : 'Send_SMS')}
                            buttonStyle={styles.primaryButton}
                            titleStyle={styles.primaryButtonText}
                            onPress={viewState.passwordView ? handleResetPassword : handleSendOTP}
                        />
                    </View>
                </KeyboardAwareScrollView>

                {viewState.selectCountry && (
                    <CountryPicker
                        visible={viewState.selectCountry}
                        withFilter
                        withFlag
                        withCallingCode
                        withEmoji
                        countryCode={countryCode}
                        onSelect={(country) => {
                            setCountryData({
                                cca2: country.cca2 as CountryCode,
                                callingCode: `+${country.callingCode[0]}`,
                                flag: emojiFlags.countryCode(country.cca2)
                            });
                            setViewState(prev => ({ ...prev, selectCountry: false }));
                        }}
                        onClose={() => setViewState(prev => ({ ...prev, selectCountry: false }))}
                    />
                )}
            </View>
        </View>
    );
};

export default ForgetPassword;