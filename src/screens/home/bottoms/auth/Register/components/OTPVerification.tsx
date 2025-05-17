import React from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator, Animated, StyleSheet } from 'react-native';
import { Text } from '../../../../../../components/widget';
import { translate } from '../../../../../../utils/utils';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../../../../core/theme';
import { FONT_FAMILY } from '../../../../../../services/config';
import { OTPInput } from './OTPInput';

interface OTPVerificationProps {
    isLoading: boolean;
    otp: string;
    showRed: boolean;
    shakeAnimation: Animated.Value;
    onOtpChanged: (code: string) => void;
    onOtpFilled: (code: string) => void;
    onResendPress: () => void;
    sendAgainDisabled: boolean;
    phoneNumber: string;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
    isLoading,
    otp,
    showRed,
    shakeAnimation,
    onOtpChanged,
    onOtpFilled,
    onResendPress,
    sendAgainDisabled,
    phoneNumber
}) => (
    <View style={styles.otpContainer}>
        <Image
            source={require('../../../../../../assets/logo.png')}
            resizeMode="contain"
            style={styles.logo}
        />

        <Text bold style={styles.otpTitle}>
            SMS Verification Code Has Been Sent
        </Text>

        <Text gray2 style={styles.phoneNumber}>
            {phoneNumber}
        </Text>

        <Animated.View style={[
            styles.otpInputWrapper,
            { transform: [{ translateX: shakeAnimation }] }
        ]}>
            {!isLoading ? (
                <OTPInput
                    value={otp}
                    onCodeChanged={onOtpChanged}
                    showError={showRed}
                    onCodeFilled={onOtpFilled}
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
            onPress={onResendPress}
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

const styles = StyleSheet.create({
    otpContainer: {
        alignItems: 'center',
        width: '100%',
    },
    logo: {
        height: moderateScale(110),
        width: moderateScale(150),
        alignSelf: 'center',
        marginVertical: moderateScale(10),
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
    otpInputWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: moderateScale(20),
        marginTop: moderateScale(20),
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
    resendTextDisabled: {
        color: theme.colors.grayText,
    },
});
