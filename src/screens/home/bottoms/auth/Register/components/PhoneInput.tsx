import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { FONT_FAMILY } from '../../../../../../services/config';
import { I18nManager } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../../../../core/theme';
import { Text } from '../../../../../../components/widget';

interface PhoneInputProps {
    flag: { emoji: string };
    callingCode: string;
    phone: string;
    onPhoneChange: (value: string) => void;
    onCountryPress: () => void;
    inputRef: any;
    onSubmitEditing: () => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
    flag,
    callingCode,
    phone,
    onPhoneChange,
    onCountryPress,
    inputRef,
    onSubmitEditing
}) => (
    <View style={styles.phoneContainer}>
        <TouchableOpacity
            style={styles.countryPicker}
            onPress={onCountryPress}
        >
            <Text>{flag.emoji}</Text>
            <Text>{callingCode}</Text>
            <Image
                style={styles.dropdownIcon}
                source={require('../../../../../../assets/arrow-down-gray.png')}
            />
        </TouchableOpacity>

        <Input
            placeholder="000000000"
            value={phone}
            onChangeText={onPhoneChange}
            containerStyle={styles.phoneInput}
            inputStyle={styles.input}
            ref={inputRef}
            returnKeyType="next"
            keyboardType="phone-pad"
            onSubmitEditing={onSubmitEditing}
        />
    </View>
);

const styles = StyleSheet.create({
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(10),
        gap: moderateScale(10),
        justifyContent: 'space-between',
    },
    countryPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        height: moderateScale(45),
        borderBottomWidth: 1,
        borderColor: theme.colors.line,
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
    input: {
        marginTop: moderateScale(24),
        textAlignVertical: 'center',
        height: moderateScale(45),
        fontFamily: FONT_FAMILY,
        ...I18nManager.isRTL ? { textAlign: 'right' } : {},
    },
});
