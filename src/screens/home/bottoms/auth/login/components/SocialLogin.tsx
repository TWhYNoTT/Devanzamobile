// src/screens/auth/login/components/SocialLogin.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { styles } from '../styles';

const SocialLogin: React.FC = () => {
    return (
        <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
                <Image
                    source={require('../../../../../../assets/facebook.png')}
                    style={styles.socialIcon}
                    contentFit="contain"
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
                <Image
                    source={require('../../../../../../assets/google.png')}
                    style={styles.socialIcon}
                    contentFit="contain"
                />
            </TouchableOpacity>
        </View>
    );
};

export default SocialLogin;