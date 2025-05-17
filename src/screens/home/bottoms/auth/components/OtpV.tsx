import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Platform,
    Animated,
    ActivityIndicator,
} from 'react-native';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import { Text } from '../../../../../components/widget';

const CELL_COUNT = 4;
const SHAKE_DURATION = 100;
const RESEND_COUNTDOWN = 60;

interface OtpScreenProps {
    phoneNumber: string;
    onResendCode: () => void;
    onVerify: (code: string) => Promise<boolean>;
    navigation: any;
}

const Logo = () => (
    <svg width="120" height="120" viewBox="0 0 120 120">
        <path d="M60 0 A60 60 0 0 1 120 60" fill="#FFB6C1" />
        <path d="M60 0 A60 60 0 0 1 0 60" fill="#9370DB" />
        <path d="M0 60 A60 60 0 0 1 120 60" fill="#4169E1" />
    </svg>
);

const OtpScreen: React.FC<OtpScreenProps> = ({
    phoneNumber,
    onResendCode,
    onVerify,
    navigation,
}) => {
    // States
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);

    // Refs
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const countdownTimer = useRef<NodeJS.Timeout | null>(null);

    // Effects
    useEffect(() => {
        return () => {
            if (countdownTimer.current) {
                clearInterval(countdownTimer.current);
            }
        };
    }, []);

    // Animations
    const startShakeAnimation = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: SHAKE_DURATION,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: -10,
                duration: SHAKE_DURATION,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: SHAKE_DURATION,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 0,
                duration: SHAKE_DURATION,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Reset error state after animation
            setTimeout(() => setError(false), 500);
        });
    };

    // Handlers
    const handleVerification = async (code: string) => {
        setLoading(true);
        try {
            const isValid = await onVerify(code);
            if (!isValid) {
                setError(true);
                startShakeAnimation();
                setValue('');
            }
        } catch (err) {
            setError(true);
            startShakeAnimation();
            setValue('');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = () => {
        if (resendDisabled) return;

        onResendCode();
        setResendDisabled(true);
        setCountdown(RESEND_COUNTDOWN);

        countdownTimer.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    if (countdownTimer.current) {
                        clearInterval(countdownTimer.current);
                    }
                    setResendDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={Platform.OS === 'android'}
            />

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <View style={styles.backArrow} />
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Logo />
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        SMS Verification Code{'\n'}Has Been Sent
                    </Text>
                    <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#000" style={styles.loader} />
                ) : (
                    <Animated.View
                        style={[
                            styles.codeFieldRoot,
                            { transform: [{ translateX: shakeAnimation }] },
                        ]}
                    >
                        <CodeField
                            ref={ref}
                            {...props}
                            value={value}
                            onChangeText={(code) => {
                                setValue(code);
                                if (code.length === CELL_COUNT) {
                                    handleVerification(code);
                                }
                            }}
                            cellCount={CELL_COUNT}
                            rootStyle={styles.codeFieldRoot}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            renderCell={({ index, symbol, isFocused }) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.cell,
                                        isFocused && styles.focusCell,
                                        error && styles.errorCell,
                                    ]}
                                    onLayout={getCellOnLayoutHandler(index)}
                                >
                                    <Text style={[styles.cellText, error && styles.errorText]}>
                                        {symbol || (isFocused ? <Cursor /> : null)}
                                    </Text>
                                </View>
                            )}
                        />
                    </Animated.View>
                )}

                <TouchableOpacity
                    style={[styles.resendButton, resendDisabled && styles.resendDisabled]}
                    onPress={handleResendCode}
                    disabled={resendDisabled}
                >
                    <Text style={[styles.resendText, resendDisabled && styles.resendTextDisabled]}>
                        {resendDisabled
                            ? `Re-send code (${countdown}s)`
                            : 'Re-send code'
                        }
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 20,
        zIndex: 1,
    },
    backArrow: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#000',
        borderRightWidth: 0,
        borderTopWidth: 0,
        transform: [{ rotate: '45deg' }],
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: Platform.OS === 'ios' ? 100 : 80,
    },
    logoContainer: {
        marginBottom: 40,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
        color: '#000000',
        lineHeight: 36,
        marginBottom: 20,
    },
    phoneNumber: {
        fontSize: 18,
        color: '#666666',
    },
    codeFieldRoot: {
        marginTop: 20,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    cell: {
        width: 70,
        height: 70,
        lineHeight: 70,
        fontSize: 30,
        borderRadius: 15,
        backgroundColor: '#F3F4F6',
        textAlign: 'center',
        marginHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellText: {
        fontSize: 36,
        color: '#000000',
        fontWeight: '600',
    },
    focusCell: {
        borderColor: '#000',
        backgroundColor: '#F3F4F6',
    },
    errorCell: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF1F0',
    },
    errorText: {
        color: '#FF3B30',
    },
    resendButton: {
        marginTop: 40,
        padding: 10,
    },
    resendDisabled: {
        opacity: 0.5,
    },
    resendText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '500',
    },
    resendTextDisabled: {
        color: '#666666',
    },
    loader: {
        marginTop: 20,
    },
});

export default OtpScreen;