import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Animated } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

interface CustomSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
    value,
    onValueChange,
    disabled = false,
}) => {
    // Animation value for the switch thumb
    const switchAnim = React.useRef(new Animated.Value(value ? 1 : 0)).current;

    React.useEffect(() => {
        Animated.spring(switchAnim, {
            toValue: value ? 1 : 0,
            useNativeDriver: true,
            speed: 20,
            bounciness: 0,
        }).start();
    }, [value, switchAnim]);

    const handlePress = () => {
        if (!disabled) {
            onValueChange(!value);
        }
    };

    const translateX = switchAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [2, moderateScale(18)] // Adjust this based on your switch width
    });

    return (
        <TouchableWithoutFeedback onPress={handlePress} disabled={disabled}>
            <View style={[
                styles.switchContainer,
                {
                    backgroundColor: value ? '#6138E0' : '#E0E0E0',
                    opacity: disabled ? 0.6 : 1,
                }
            ]}>
                <Animated.View
                    style={[
                        styles.switchThumb,
                        {
                            transform: [{ translateX }],
                        }
                    ]}
                />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    switchContainer: {
        width: moderateScale(40),
        height: moderateScale(24),
        borderRadius: moderateScale(12),
        padding: moderateScale(2),
        justifyContent: 'center',
    },
    switchThumb: {
        width: moderateScale(15),
        height: moderateScale(15),
        borderRadius: moderateScale(10),
        backgroundColor: '#FFFFFF',

    },
});