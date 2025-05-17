import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Animated,
    View,
    I18nManager,
    ActivityIndicator,
    ViewStyle,
    TextStyle
} from 'react-native';
import { Button } from 'react-native-elements';
import { Input } from 'react-native-elements';
import { Image } from 'expo-image';
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import emojiFlags from 'emoji-flags';

import { Text } from '../../../../components/widget';
import { theme } from '../../../../core/theme';
import { moderateScale } from 'react-native-size-matters';
import Header from '../childs/Header';
import { FONT_FAMILY } from '../../../../services/config';
import { getCallingCode, showDanger, showInfo, showSuccess, translate } from '../../../../utils/utils';


interface ForgetPasswordProps {
    navigation: any;
    selectedLocation: {
        country: string;
    };
}


const ForgetPassword: React.FC<ForgetPasswordProps> = ({ navigation, selectedLocation }) => {
    // Refs
    const inputRefs = useRef<any>({});
    const shakeAnimation = useRef(new Animated.Value(0)).current;

    // State
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        phone: '509763143',
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
        callingCode: getCallingCode(selectedLocation?.country || 'AE'),
        flag: emojiFlags.countryCode(selectedLocation?.country || 'AE'),
        cca2: selectedLocation?.country || 'AE' as CountryCode
    });
    const [countryCode, setCountryCode] = useState<CountryCode>(
        selectedLocation?.country as CountryCode || 'AE'
    );
    const [user, setUser] = useState<any>({});

    // OTP Input setup
    const ref = useBlurOnFulfill({ value: formData.otp, cellCount: 4 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: formData.otp,
        setValue: (otp) => setFormData(prev => ({ ...prev, otp })),
    });

    const handleResendOTP = async () => {
        setViewState(prev => ({ ...prev, sendAgainDisabled: true }));
        setIsLoading(true);

        try {
            // Simulated OTP resend
            await new Promise(resolve => setTimeout(resolve, 1500));
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

    const startShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
        ]).start();
    };

    const handleSendOTP = async () => {
        if (formData.phone.length < 6) {
            showDanger(translate('PLEASE_ENTER_VALID_PHONE_NUMBER'));
            return;
        }

        setIsLoading(true);
        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            showInfo(translate('OTP_SENT'));
            setViewState(prev => ({ ...prev, otpView: true }));
            setIsLoading(false);
        } catch (error: any) {
            showDanger(error.message);
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (otp: string) => {
        setIsLoading(true);
        try {
            // Simulated verify API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            if (otp === '1234') { // Demo verification
                setViewState(prev => ({ ...prev, passwordView: true }));
                setUser({ name: 'User' }); // Demo user data
            } else {
                throw new Error('Invalid OTP');
            }
            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            if (error.message === 'Invalid OTP') {
                setViewState(prev => ({ ...prev, showRed: true }));
                startShake();
                setTimeout(() => {
                    setViewState(prev => ({ ...prev, showRed: false }));
                }, 500);
            }
            showDanger(error.message);
        }
    };

    const handleResetPassword = async () => {
        if (formData.password !== formData.confirmPassword) {
            showDanger(translate('PASSWORDS_DO_NOT_MATCH'));
            return;
        }

        setIsLoading(true);
        try {
            // Simulated password reset API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            showSuccess(translate('PASSWORD_RESET_SUCCESS'));
            navigation.pop();
        } catch (error: any) {
            showDanger(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderPhoneInput = () => (
        <View style={styles.phoneInputContainer}>
            <TouchableOpacity
                style={styles.countryPicker}
                onPress={() => setViewState(prev => ({ ...prev, selectCountry: true }))}
            >
                <Text>{countryData.flag.emoji}</Text>
                <Text>{countryData.callingCode}</Text>
                <Image
                    source={require('../../../../assets/arrow-down-gray.png')}
                    style={styles.dropdownIcon}
                />
            </TouchableOpacity>
            <Input
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.inputContainerStyle}
                placeholder="000000000"
                value={formData.phone}
                onChangeText={(phone) => setFormData(prev => ({ ...prev, phone }))}
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={handleSendOTP}
            />
        </View>
    );

    const renderOTPInput = () => (
        <View style={styles.otpWrapper}>
            <Animated.View style={[styles.otpContainer, { transform: [{ translateX: shakeAnimation }] }]}>
                <CodeField
                    ref={ref}
                    {...props}
                    value={formData.otp}
                    onChangeText={(otp) => {
                        setFormData(prev => ({ ...prev, otp }));
                        if (otp.length === 4) {
                            handleVerifyOTP(otp);
                        }
                    }}
                    cellCount={4}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({ index, symbol, isFocused }) => (
                        <View
                            key={index}
                            onLayout={getCellOnLayoutHandler(index)}
                            style={[
                                styles.otpCell,
                                viewState.showRed ? styles.otpCellError : undefined,
                                isFocused ? styles.otpCellFocused : undefined
                            ]}
                        >
                            <Text style={[
                                styles.otpText,
                                viewState.showRed ? styles.otpTextError : {}
                            ]}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        </View>
                    )}
                />
            </Animated.View>

            {!isLoading && (
                <Button
                    title={translate('Re_send_code')}
                    type="clear"
                    buttonStyle={styles.resendButton}
                    titleStyle={styles.resendButtonText}
                    disabled={viewState.sendAgainDisabled}
                    disabledStyle={styles.disabledButton}
                    onPress={handleResendOTP}
                />
            )}
        </View>
    );

    const renderPasswordReset = () => (
        <View style={styles.passwordContainer}>
            <Input
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.inputContainerStyle}
                placeholder={translate('Enter_new_password')}
                value={formData.password}
                onChangeText={(password) => setFormData(prev => ({ ...prev, password }))}
                secureTextEntry={!viewState.hideShow}
                rightIcon={
                    <TouchableOpacity
                        onPress={() => setViewState(prev => ({ ...prev, hideShow: !prev.hideShow }))}
                    >
                        <Text style={styles.showHideText}>
                            {translate(viewState.hideShow ? 'Hide' : 'Show')}
                        </Text>
                    </TouchableOpacity>
                }
            />
            <Input
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.inputContainerStyle}
                placeholder={translate('Confirm_new_password')}
                value={formData.confirmPassword}
                onChangeText={(confirmPassword) => setFormData(prev => ({ ...prev, confirmPassword }))}
                secureTextEntry={!viewState.hideShow}
            />
        </View>
    );

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
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                )}

                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}
                >
                    <View style={styles.contentContainer}>
                        <Image
                            source={require('../../../../assets/logo.png')}
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
                                {renderPhoneInput()}
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
                                {renderOTPInput()}
                            </>
                        )}

                        {viewState.passwordView && (
                            <>
                                <Text bold style={styles.title}>
                                    {translate('Choose_new_password')}
                                </Text>
                                {renderPasswordReset()}
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

const styles = StyleSheet.create({
    otpText: {
        fontSize: moderateScale(20),
        color: theme.colors.black,
    } as TextStyle,
    otpTextError: {
        color: theme.colors.red,
    } as TextStyle,
    otpCell: {
        width: moderateScale(45),
        height: moderateScale(45),
        borderWidth: 1,
        borderColor: theme.colors.grayBackgroundOtp,
        borderRadius: moderateScale(5),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        margin: moderateScale(4),
    } as ViewStyle,
    otpCellError: {
        borderColor: theme.colors.red,
    } as ViewStyle,
    otpCellFocused: {
        borderColor: theme.colors.primary,
        borderWidth: 2,
    } as ViewStyle,
    container: {
        flex: 1,

        backgroundColor: 'white',

    },
    content: {
        flex: 1,
        width: '90%',
        alignSelf: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: moderateScale(20),
    },
    contentContainer: {
        padding: moderateScale(15),
        alignItems: 'center',
    },
    logo: {
        height: moderateScale(110),
        width: moderateScale(150),
        marginVertical: moderateScale(10),
    },
    title: {
        color: theme.colors.black,
        fontSize: moderateScale(25),
        textAlign: 'center',
        marginTop: moderateScale(20),
    },
    subtitle: {
        color: theme.colors.grayText,
        fontSize: moderateScale(15),
        textAlign: 'center',
        marginTop: moderateScale(10),
    },
    phoneText: {
        color: theme.colors.grayText,
        textAlign: 'center',
        paddingVertical: moderateScale(10),
    },
    inputContainer: {
        paddingHorizontal: 0,
        marginTop: moderateScale(10),
    },
    inputContainerO: {
        paddingHorizontal: 0,
        marginTop: moderateScale(10),
        height: moderateScale(45),
    },
    inputContainerStyle: {
        marginTop: moderateScale(16),
        height: moderateScale(45),
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.line,
        ...I18nManager.isRTL ? { textAlign: 'right' } : {},
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(20),

    },
    countryPicker: {
        width: moderateScale(150),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: moderateScale(45),
        borderBottomWidth: 1,
        borderColor: theme.colors.line,
        paddingHorizontal: moderateScale(10),

    },
    dropdownIcon: {
        height: moderateScale(10),
        width: moderateScale(13),
        marginLeft: moderateScale(5),

    },
    otpContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: moderateScale(20),
    },

    passwordContainer: {
        width: '100%',
        marginTop: moderateScale(20),
    },
    showHideText: {
        color: theme.colors.primary,
        fontSize: moderateScale(15),
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: moderateScale(10),
        height: moderateScale(45),
        marginTop: moderateScale(20),
        paddingHorizontal: moderateScale(30),
    },
    primaryButtonText: {
        fontSize: moderateScale(15),
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold',
    },
    resendButton: {
        backgroundColor: theme.colors.white,
        borderRadius: moderateScale(20),
        marginTop: moderateScale(20),
    },
    resendButtonText: {
        color: theme.colors.blackText,
        fontSize: moderateScale(15),
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
    },
    otpWrapper: {
        width: '100%',
        alignItems: 'center',
    } as ViewStyle,
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 999,
    },
});

export default ForgetPassword;