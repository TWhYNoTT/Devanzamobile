// src/screens/Browse/components/Header.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../../../core/theme';

interface HeaderProps {
    unreadCount: number;
    onNotificationPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ unreadCount, onNotificationPress }) => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../../../../assets/logo-with-name.png')}
                style={styles.logo}
                contentFit="contain"
            />

            <View style={styles.notificationContainer}>
                <TouchableOpacity onPress={onNotificationPress}>
                    <Image
                        source={require('../../../../../assets/bell.png')}
                        style={styles.notificationIcon}
                        contentFit="contain"
                    />
                    {unreadCount > 0 && (
                        <View style={styles.unreadBadge} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: moderateScale(55),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: moderateScale(20),
    },
    logo: {
        height: moderateScale(40),
        width: moderateScale(130),
    },
    notificationContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    notificationIcon: {
        height: moderateScale(20),
        width: moderateScale(20),
    },
    unreadBadge: {
        width: moderateScale(10),
        height: moderateScale(10),
        backgroundColor: theme.colors.primary,
        position: 'absolute',
        right: 0,
    },
});

export default Header;