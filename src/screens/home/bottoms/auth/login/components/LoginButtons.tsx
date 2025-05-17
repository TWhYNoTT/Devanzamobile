// src/screens/auth/login/components/LoginButtons.tsx
import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { styles } from '../styles';
import { translate } from '../../../../../../utils/utils';

interface LoginButtonsProps {
    isLoading: boolean;
    socialLoading: {
        facebook: boolean;
        google: boolean;
    };
    checkEmail: boolean;
    handleSubmit: () => void;
    navigation: any;
}

export const LoginButtons: React.FC<LoginButtonsProps> = ({
    isLoading,
    socialLoading,
    checkEmail,
    handleSubmit,
    navigation
}) => (
    <View style={styles.buttonsContainer}>
        <Button
            loading={isLoading}
            disabled={isLoading || socialLoading.facebook || socialLoading.google}
            title={translate(!checkEmail ? 'Continue' : 'Sign in')}
            buttonStyle={styles.primaryButton}
            titleStyle={styles.primaryButtonText}
            onPress={handleSubmit}
        />
        <Button
            disabled={isLoading || socialLoading.facebook || socialLoading.google}
            title={translate('Proceed as a guest')}
            type="outline"
            buttonStyle={styles.secondaryButton}
            titleStyle={styles.secondaryButtonText}
            onPress={() => navigation.pop()}
        />
    </View>
);
