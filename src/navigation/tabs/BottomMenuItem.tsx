import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../core/theme';

// Define types for the component props
interface BottomMenuItemProps {
    isCurrent: boolean;
    index: number;
}

// Define type for tab icons mapping
type TabIconsMap = {
    [key: number]: any; // 'any' used here as require() returns a number
};

// Map of tab icons
const TAB_ICONS: TabIconsMap = {
    0: require('../../assets/tab-home.png'),
    1: require('../../assets/bookings-tab.png'),
    2: require('../../assets/tab-fav.png'),
    3: require('../../assets/tab-more.png'),
};

export const BottomMenuItem: React.FC<BottomMenuItemProps> = ({ isCurrent, index }) => {
    return (
        <View style={styles.container}>
            <Image
                resizeMode="contain"
                source={TAB_ICONS[index]}
                style={[
                    styles.icon,
                    { tintColor: isCurrent ? theme.colors.primary : theme.colors.gray }
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: moderateScale(20),
        height: moderateScale(20),
    },
});