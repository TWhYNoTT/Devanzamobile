// PhoneInput.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import { Image } from 'expo-image';
import { styles } from '../styles';
import { Text } from '../../../../../../components/widget';

interface PhoneInputProps {
    phone: string;
    countryData: {
        flag: { emoji: string };
        callingCode: string;
    };
    onPhoneChange: (phone: string) => void;
    onCountryPress: () => void;
    onSubmit: () => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
    phone,
    countryData,
    onPhoneChange,
    onCountryPress,
    onSubmit
}) => (
    <View style={styles.phoneInputContainer}>
        <TouchableOpacity style={styles.countryPicker} onPress={onCountryPress}>
            <Text>{countryData.flag.emoji}</Text>
            <Text>{countryData.callingCode}</Text>
            <Image
                source={require('../../../../../../assets/arrow-down-gray.png')}
                style={styles.dropdownIcon}
            />
        </TouchableOpacity>
        <Input
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputContainerStyle}
            placeholder="000000000"
            value={phone}
            onChangeText={onPhoneChange}
            keyboardType="phone-pad"
            returnKeyType="done"
            onSubmitEditing={onSubmit}
        />
    </View>
);