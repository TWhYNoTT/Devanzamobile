// OTPInput.tsx
import React from 'react';
import { View, Animated } from 'react-native';
import { Button } from 'react-native-elements';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { translate } from '../../../../../../utils/utils';
import { styles } from '../styles';
import { Text } from '../../../../../../components/widget';

interface OTPInputProps {
    otp: string;
    setOtp: (otp: string) => void;
    isLoading: boolean;
    showRed: boolean;
    sendAgainDisabled: boolean;
    shakeAnimation: Animated.Value;
    onResendOTP: () => void;
    onVerifyOTP: (otp: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({
    otp,
    setOtp,
    isLoading,
    showRed,
    sendAgainDisabled,
    shakeAnimation,
    onResendOTP,
    onVerifyOTP
}) => {
    const ref = useBlurOnFulfill({ value: otp, cellCount: 4 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: otp,
        setValue: setOtp,
    });

    return (
        <View style={styles.otpWrapper}>
            <Animated.View style={[styles.otpContainer, { transform: [{ translateX: shakeAnimation }] }]}>
                <CodeField
                    ref={ref}
                    {...props}
                    value={otp}
                    onChangeText={(newOtp) => {
                        setOtp(newOtp);
                        if (newOtp.length === 4) {
                            onVerifyOTP(newOtp);
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
                                showRed ? styles.otpCellError : undefined,
                                isFocused ? styles.otpCellFocused : undefined
                            ]}
                        >
                            <Text style={[
                                styles.otpText,
                                showRed ? styles.otpTextError : {}
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
                    disabled={sendAgainDisabled}
                    disabledStyle={styles.disabledButton}
                    onPress={onResendOTP}
                />
            )}
        </View>
    );
};