// src/screens/auth/login/components/LoginFooter.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../../../../../../components/widget';
import SocialLogin from '../../components/SocialLogin';
import { styles } from '../styles';
import { translate } from '../../../../../../utils/utils';

interface LoginFooterProps {
    navigation: any;
}

export const LoginFooter: React.FC<LoginFooterProps> = ({ navigation }) => (
    <View style={styles.footerContainer}>
        <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgetPassword')}
        >
            <Text bold style={styles.forgotPasswordText}>
                {translate('Forget Password')}
            </Text>
        </TouchableOpacity>
        <View style={styles.socialContainer}>
            <SocialLogin />
        </View>
        <TouchableOpacity
            style={styles.signupLink}
            onPress={() => navigation.navigate('Register')}
        >
            <Text style={styles.signupText}>
                {translate("Don't have an account ? ")}{' '}
                <Text bold style={styles.signupTextBold}>
                    {translate('Sign up')}
                </Text>
            </Text>
        </TouchableOpacity>
    </View>
);