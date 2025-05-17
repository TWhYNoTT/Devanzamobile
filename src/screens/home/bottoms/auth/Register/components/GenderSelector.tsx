import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { translate } from '../../../../../../utils/utils';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../../../../core/theme';
import { Text } from '../../../../../../components/widget';
import { Gender } from '../../../../../../types/api.types';

interface GenderSelectorProps {
    selectedGender: Gender;
    onGenderSelect: (gender: Gender) => void;
}

export const GenderSelector: React.FC<GenderSelectorProps> = ({
    selectedGender,
    onGenderSelect
}) => (
    <View style={styles.genderContainer}>
        <TouchableOpacity
            style={styles.genderOption}
            onPress={() => onGenderSelect(Gender.Male)}
        >
            <View style={[
                styles.radio,
                selectedGender === Gender.Male && styles.radioSelected
            ]} />
            <Text style={styles.genderText}>
                {translate('Male')}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.genderOption}
            onPress={() => onGenderSelect(Gender.Female)}
        >
            <View style={[
                styles.radio,
                selectedGender === Gender.Female && styles.radioSelected
            ]} />
            <Text style={styles.genderText}>
                {translate('Female')}
            </Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
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
});