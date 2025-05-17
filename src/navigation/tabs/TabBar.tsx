import React, { useState } from "react";
import {
    View,
    TouchableOpacity,
    Dimensions,
    Animated,
    StyleSheet,
    StatusBar,
    ViewStyle,
    DeviceEventEmitter,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { theme } from "../../core/theme";
import { BottomMenuItem } from "./BottomMenuItem";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

interface TabBarProps extends BottomTabBarProps {
    state: any;
    navigation: any;
}

// Dummy user data for testing
const dummyUserInfo = {
    email: "test@example.com",  // Set to null to test unauthorized state
    name: "Test User"
};

export const TabBar: React.FC<TabBarProps> = ({ state, navigation }) => {
    const [translateValue] = useState(new Animated.Value(0));
    const totalWidth = Dimensions.get("window").width - ((30 / 100) * Dimensions.get("window").width);
    const tabWidth = totalWidth / state.routes.length;

    const handlePress = (route: any, index: number) => {
        const isFocused = state.index === index;

        // Handle status bar style
        if (index === 0) {
            StatusBar.setBarStyle('light-content', true);
        } else {
            StatusBar.setBarStyle('dark-content', true);
        }

        // Check auth for protected routes (tabs 1 and 2)
        if (index === 1 || index === 2) {
            if (!dummyUserInfo.email) {
                // Navigate to login
                navigation.navigate('Login', {
                    returnRoute: route.name
                });
                return;
            }

            // Emit events for specific tabs
            if (index === 1) {
                DeviceEventEmitter.emit('bookingRefreash', { value: 1 });
            } else if (index === 2) {
                DeviceEventEmitter.emit('loadFav', { value: 1 });
            }
        }

        if (!isFocused) {
            // Animate tab indicator
            Animated.spring(translateValue, {
                toValue: index * tabWidth,
                velocity: 10,
                useNativeDriver: true,
            }).start();

            // Navigate to the selected route
            navigation.navigate(route.name);
        }
    };

    return (
        <View style={styles.tabContainer}>
            <View style={styles.tabBar}>
                {state.routes.map((route: any, index: number) => {
                    const isFocused = state.index === index;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            onPress={() => handlePress(route, index)}
                            style={styles.tab}
                        >
                            <BottomMenuItem

                                index={index}
                                isCurrent={isFocused}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        height: moderateScale(70),
        position: "absolute",
        bottom: 0,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    tabBar: {
        flexDirection: "row",
        width: Dimensions.get("window").width - ((30 / 100) * Dimensions.get("window").width),
        marginBottom: moderateScale(20),
        backgroundColor: theme.colors.white,
        borderRadius: moderateScale(100),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    } as ViewStyle,
    tab: {
        flex: 1,
    } as ViewStyle,
    slider: {
        height: 5,
        position: "absolute",
        bottom: moderateScale(7),
        left: moderateScale(30),
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
    } as ViewStyle,
});