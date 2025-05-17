// src/screens/Browse/components/SearchBar.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../../../core/theme';

interface SearchBarProps {
    onPress: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
        >
            <Image
                source={require('../../../../../assets/search.png')}
                style={styles.searchIcon}
                contentFit="contain"
            />
            <Text style={styles.placeholder}>Search</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: moderateScale(100),
        backgroundColor: theme.colors.white,
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        height: moderateScale(45),
        alignItems: 'center',
        paddingHorizontal: moderateScale(25),
        marginTop: moderateScale(20),
        marginHorizontal: moderateScale(10),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    searchIcon: {
        height: moderateScale(20),
        width: moderateScale(20),
        marginStart: moderateScale(10),
    },
    placeholder: {
        width: '100%',
        color: theme.colors.gray,
        marginStart: moderateScale(10),
        fontSize: moderateScale(15),
    },
});

export default SearchBar;