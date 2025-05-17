// src/screens/auth/Register.tsx
import React, { useState, useRef } from 'react';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    StatusBar,
    I18nManager,
    ActivityIndicator,
    Animated
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Input } from 'react-native-elements';
import { moderateScale } from 'react-native-size-matters';
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';
import emojiFlags from 'emoji-flags';
import * as Notifications from 'expo-notifications';

import { Gender } from '../../../../types/api.types';
import SocialLogin from './components/SocialLogin';
import Header from '../childs/Header'
import { theme } from '../../../../core/theme';
import { FONT_FAMILY } from '../../../../services/config';
import { Text } from '../../../../components/widget';
import { showSuccess, showDanger, showInfo, translate, getCallingCode } from '../../../../utils/utils';

interface OTPInputProps {
    value: string;
    onCodeChanged: (code: string) => void;
    showError: boolean;
    onCodeFilled: (code: string) => void;
}

interface RegisterProps {
    navigation: any;
    selectedLocation: {
        country: string;
    };
}

const SHAKE_DURATION = 100;
const RESEND_COUNTDOWN = 60;

export const Register: React.FC<RegisterProps> = ({ navigation, selectedLocation }) => {
    // Refs
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    const inputRefs = useRef<any>({});

    // State management
    const [isLoading, setIsLoading] = useState(false);
    const [selectCountry, setSelectCountry] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        gender: Gender.Male,
        callingCode: getCallingCode(selectedLocation?.country || 'AE'),
        flag: emojiFlags.countryCode(selectedLocation?.country || 'AE'),
    });
    const [otpView, setOtpView] = useState(false);
    const [sendAgainDisabled, setSendAgainDisabled] = useState(false);
    const [otp, setOtp] = useState('');
    const [showRed, setShowRed] = useState(false);
    const [hideShow, setHideShow] = useState(false);
    const [countryCode, setCountryCode] = useState<CountryCode>(
        selectedLocation?.country as CountryCode || 'AE'
    );

    const OTPInput: React.FC<OTPInputProps> = ({ value, onCodeChanged, showError, onCodeFilled }) => {
        const [props, getCellOnLayoutHandler] = useClearByFocusCell({
            value,
            setValue: onCodeChanged,
        });

        return (
            <CodeField
                {...props}
                value={value}
                onChangeText={(code) => {
                    onCodeChanged(code);
                    if (code.length === 4) {
                        onCodeFilled(code);
                    }
                }}
                cellCount={4}
                keyboardType="number-pad"
                textContentType="oneTimeCode"

                autoFocus={true}
                blurOnSubmit={false}
                renderCell={({ index, symbol, isFocused }) => (
                    <View
                        key={index}
                        onLayout={getCellOnLayoutHandler(index)}
                        style={[
                            styles.otpCell,
                            showError && styles.otpCellError,
                            isFocused && styles.otpCellFocused,
                        ]}
                    >
                        <Text
                            style={[
                                styles.otpText,
                                showError ? styles.otpTextError : {}
                            ]}
                        >
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                    </View>
                )}
            />
        );
    };

    // Animation 

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
            // Reset error state after animation completes
            setTimeout(() => setShowRed(false), 500);
        });
    };

    // Form validation
    const validateForm = () => {
        // if (formData.name === '') {
        //     showDanger(translate('PLEASE ENTER FISRT NAME'));
        //     return false;
        // }
        // if (formData.email === '') {
        //     showDanger(translate('PLEASE ENTER EMAIL'));
        //     return false;
        // }
        // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        //     showDanger(translate('PLEASE ENTER VALID EMAIL'));
        //     return false;
        // }
        // if (formData.phone === '') {
        //     showDanger(translate('PLEASE ENTER PHONE'));
        //     return false;
        // }
        // if (formData.password === '') {
        //     showDanger(translate('PLEASE ENTER PASSWORD'));
        //     return false;
        // }
        return true;
    };

    // Simulated API calls
    const handleSuccess = async () => {
        setIsLoading(false);
        showSuccess('Registration successful');
        navigation.pop(2);
    };

    const handleError = (error: string) => {
        setIsLoading(false);
        showDanger(error);
        if (error === 'Invalid Otp') {
            setShowRed(true);
            startShake();
            setOtp(''); // Clear the input on error
        }
    };

    const handleSubmit = async (otpCode?: string) => {
        if (!validateForm()) return;

        setIsLoading(true);

        if (!otpView) {
            // Simulate OTP send
            setTimeout(() => {
                showInfo('OTP HAS BEEN SENT TO YOUR PROVIDED PHONE NUMBER');
                setIsLoading(false);
                setOtpView(true);
            }, 1000);
            return;
        }

        // Get notifications permission for simulation
        let token = '';
        try {
            const { status } = await Notifications.getPermissionsAsync();
            if (status === 'granted') {
                const expoPushToken = await Notifications.getExpoPushTokenAsync();
                token = expoPushToken.data;
            }
        } catch (error) {
            console.log('Notification permission error:', error);
        }

        // Simulate registration
        setTimeout(() => {
            if (otpCode === '1234') { // Simulate successful OTP
                handleSuccess();
            } else {
                handleError('Invalid Otp');
            }
        }, 1500);
    };

    const renderOtpView = () => (
        <View style={styles.otpContainer}>
            <Image
                source={require('../../../../assets/logo.png')}
                resizeMode="contain"
                style={styles.logo}
            />

            <Text bold style={styles.otpTitle}>
                SMS Verification Code Has Been Sent
            </Text>

            <Text gray2 style={styles.phoneNumber}>
                {`${formData.callingCode}${formData.phone}`}
            </Text>

            <Animated.View style={[
                styles.otpInputWrapper,
                { transform: [{ translateX: shakeAnimation }] }
            ]}>
                {!isLoading ? (
                    <OTPInput
                        value={otp}
                        onCodeChanged={(code: string) => {
                            setOtp(code);
                            setShowRed(false); // Reset error state when typing
                        }}
                        showError={showRed}
                        onCodeFilled={(code: string) => {
                            handleSubmit(code);
                        }}
                    />
                ) : (
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                )}
            </Animated.View>

            <TouchableOpacity
                style={[
                    styles.resendButton,
                    sendAgainDisabled && styles.resendDisabled
                ]}
                onPress={() => {
                    if (!sendAgainDisabled) {
                        setSendAgainDisabled(true);
                        handleSubmit();
                        // Reset after RESEND_COUNTDOWN milliseconds
                        setTimeout(() => setSendAgainDisabled(false), RESEND_COUNTDOWN);
                    }
                }}
                disabled={sendAgainDisabled || isLoading}
            >
                <Text style={[
                    styles.resendText,
                    sendAgainDisabled && styles.resendTextDisabled
                ]}>
                    {translate('Re-send code')}
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderRegistrationForm = () => (
        <View style={styles.formContainer}>
            <Image
                source={require('../../../../assets/logo.png')}
                resizeMode="contain"
                style={styles.logo}
            />

            <Text bold style={styles.title}>
                Hi there! Introduce yourself
            </Text>

            <Input
                placeholder={translate('Full Name')}
                value={formData.name}
                onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
                ref={el => inputRefs.current.name = el}
                returnKeyType="next"
                onSubmitEditing={() => inputRefs.current.email?.focus()}
            />

            <Input
                placeholder={translate('Email')}
                value={formData.email}
                onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
                ref={el => inputRefs.current.email = el}
                returnKeyType="next"
                keyboardType="email-address"
                autoCapitalize="none"
                onSubmitEditing={() => inputRefs.current.phone?.focus()}
            />

            <View style={styles.phoneContainer}>
                <TouchableOpacity
                    style={styles.countryPicker}
                    onPress={() => setSelectCountry(true)}
                >
                    <Text>{formData.flag.emoji}</Text>
                    <Text>{formData.callingCode}</Text>
                    <Image
                        style={styles.dropdownIcon}
                        source={require('../../../../assets/arrow-down-gray.png')}
                    />
                </TouchableOpacity>

                <Input
                    placeholder="000000000"
                    value={formData.phone}
                    onChangeText={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                    containerStyle={styles.phoneInput}
                    inputStyle={styles.inputO}
                    ref={el => inputRefs.current.phone = el}
                    returnKeyType="next"
                    keyboardType="phone-pad"
                    onSubmitEditing={() => inputRefs.current.password?.focus()}
                />
            </View>

            <View style={styles.passwordContainer}>
                <Input
                    placeholder={translate('Password')}
                    value={formData.password}
                    onChangeText={(value) => setFormData(prev => ({ ...prev, password: value }))}
                    secureTextEntry={!hideShow}
                    containerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    ref={el => inputRefs.current.password = el}
                    rightIcon={
                        <TouchableOpacity onPress={() => setHideShow(!hideShow)}>
                            <Text style={styles.showHideText}>
                                {translate(hideShow ? 'Hide' : 'Show')}
                            </Text>
                        </TouchableOpacity>
                    }
                />
            </View>

            <View style={styles.genderContainer}>
                {[Gender.Male, Gender.Female].map((gender) => (
                    <TouchableOpacity
                        key={gender}
                        style={styles.genderOption}
                        onPress={() => setFormData(prev => ({
                            ...prev,
                            gender
                        }))}
                    >
                        <View style={[
                            styles.radio,
                            formData.gender === gender && styles.radioSelected
                        ]} />
                        <Text style={styles.genderText}>
                            {translate(gender === Gender.Male ? 'Male' : 'Female')}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

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
                    {translate('Dont have an account ? ')}
                    < Text bold style={styles.loginLinkBold} >
                        {translate('Sign In')}
                    </Text>
                </Text>
            </TouchableOpacity>
        </View >
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
                {otpView ? renderOtpView() : renderRegistrationForm()}
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
                            callingCode: `+${country.callingCode[0]}`,
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
    otpCell: {
        width: moderateScale(70), // Increased size to match the design
        height: moderateScale(70),
        borderRadius: moderateScale(15),
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        margin: moderateScale(4),
    },
    otpCellError: {
        backgroundColor: '#FFF1F0',
        borderColor: '#FF3B30',
    },
    otpCellFocused: {
        borderColor: theme.colors.primary,
        borderWidth: 2,
    },
    otpText: {
        fontSize: moderateScale(36), // Increased font size to match the design
        fontWeight: '600',
        color: theme.colors.black,
        textAlign: 'center',
    },
    otpTextError: {
        color: '#FF3B30',
    },
    resendTextDisabled: {
        color: theme.colors.grayText,
    },

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
    inputContainer: {
        paddingHorizontal: 0,
        marginTop: moderateScale(10),
    },
    input: {
        textAlignVertical: 'center',
        height: moderateScale(45),
        fontFamily: FONT_FAMILY,
        ...I18nManager.isRTL ? { textAlign: 'right' } : {},
    },
    inputO: {
        marginTop: moderateScale(24),
        textAlignVertical: 'center',
        height: moderateScale(45),
        fontFamily: FONT_FAMILY,
        ...I18nManager.isRTL ? { textAlign: 'right' } : {},
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(10),
        gap: moderateScale(10),
        justifyContent: 'space-between',
    },
    countryPicker: {
        // width: '30%',
        flexDirection: 'row',
        alignItems: 'center',
        height: moderateScale(45),
        borderBottomWidth: 1,
        borderColor: theme.colors.line,
        // paddingHorizontal: moderateScale(15),
    },
    dropdownIcon: {
        height: moderateScale(10),
        width: moderateScale(13),
        marginLeft: moderateScale(5),
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 0,
        width: '70%',
    },
    passwordContainer: {
        marginTop: moderateScale(10),
    },
    showHideText: {
        color: theme.colors.primary,
        fontSize: moderateScale(15),
    },
    genderContainer: {
        flexDirection: 'row',
        marginTop: moderateScale(20),
    },
    genderOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: moderateScale(30),
    },
    radio: {
        width: moderateScale(20),
        height: moderateScale(20),
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: moderateScale(50),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: moderateScale(10),
    },
    radioSelected: {
        backgroundColor: theme.colors.primary,
    },
    genderText: {
        fontSize: moderateScale(15),
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
    // OTP View Styles

    otpInputContainer: {
        marginHorizontal: moderateScale(4),
    },
    otpInputWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: moderateScale(20),
        marginTop: moderateScale(20),
    },
    otpContainer: {

        alignItems: 'center',
        width: '100%',
    },
    otpTitle: {
        color: theme.colors.black,
        fontSize: moderateScale(25),
        textAlign: 'center',
        marginTop: moderateScale(20),
    },
    phoneNumber: {
        color: theme.colors.grayText,
        textAlign: 'center',
        paddingVertical: moderateScale(10),
    },
    otpInput: {
        width: '80%',
        height: moderateScale(50),
    },

    resendButton: {
        backgroundColor: theme.colors.white,
        borderRadius: moderateScale(20),
        padding: moderateScale(10),
        marginTop: moderateScale(20),
    },
    resendDisabled: {
        opacity: 0.5,
    },
    resendText: {
        color: theme.colors.blackText,
        fontSize: moderateScale(15),
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
    },
    socialContainer: {
        marginTop: moderateScale(30),
        width: '100%',
        alignItems: 'center'
    },
    formContainer: {
        width: '90%',
        alignSelf: 'center',
    },
});

export default Register;