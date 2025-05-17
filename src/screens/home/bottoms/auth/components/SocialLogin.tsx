// src/screens/auth/login/components/SocialLogin.tsx
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { moderateScale } from 'react-native-size-matters';
import * as Haptics from 'expo-haptics';
import { theme } from '../../../../../core/theme';

const SocialLogin: React.FC = () => {
    const [loading, setLoading] = useState({
        facebook: false,
        google: false,
        apple: false
    });

    const handleSocialLogin = async (platform: keyof typeof loading) => {
        setLoading(prev => ({ ...prev, [platform]: true }));
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Simulate auth delay
        setTimeout(() => {
            setLoading(prev => ({ ...prev, [platform]: false }));
        }, 1000);
    };

    const SocialButton = ({
        platform,
        icon
    }: {
        platform: keyof typeof loading,
        icon: any
    }) => (
        <TouchableOpacity
            disabled={Object.values(loading).some(Boolean)}
            style={[
                styles.socialButton,
                { opacity: loading[platform] ? 0.5 : 1 }
            ]}
            onPress={() => handleSocialLogin(platform)}
        >
            <Image
                source={icon}
                contentFit="contain"
                style={[
                    styles.socialIcon,
                    { tintColor: theme.colors.primary }
                ]}
            />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <SocialButton
                platform="facebook"
                icon={require('../../../../../assets/facebook.png')}
            />
            <SocialButton
                platform="google"
                icon={require('../../../../../assets/google.png')}
            />
            <SocialButton
                platform="apple"
                icon={require('../../../../../assets/apple1.png')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: moderateScale(0)
    },
    socialButton: {
        borderWidth: moderateScale(0.5),
        borderColor: theme.colors.white,
        width: moderateScale(50),
        height: moderateScale(50),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(100),
        marginHorizontal: moderateScale(10),
        backgroundColor: theme.colors.primarylight
    },
    socialIcon: {
        height: moderateScale(20),
        width: moderateScale(20)
    }
});

export default SocialLogin;