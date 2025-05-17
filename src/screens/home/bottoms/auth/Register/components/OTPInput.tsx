import React from 'react';
import {
    CodeField,
    Cursor,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../../../../components/widget';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../../../../core/theme';

interface OTPInputProps {
    value: string;
    onCodeChanged: (code: string) => void;
    showError: boolean;
    onCodeFilled: (code: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({
    value,
    onCodeChanged,
    showError,
    onCodeFilled
}) => {
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

const styles = StyleSheet.create({
    otpCell: {
        width: moderateScale(70),
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
        fontSize: moderateScale(36),
        fontWeight: '600',
        color: theme.colors.black,
        textAlign: 'center',
    },
    otpTextError: {
        color: '#FF3B30',
    },
});
