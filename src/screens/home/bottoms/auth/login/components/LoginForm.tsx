// src/screens/auth/login/components/LoginForm.tsx
import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '../../../../../../components/widget';
import { EmailInput } from './EmailInput';
import { PasswordInput } from './PasswordInput';
import { styles } from '../styles';
import { translate } from '../../../../../../utils/utils';

interface LoginFormProps {
    checkEmail: boolean;
    formData: {
        email: string;
        password: string;
    };
    inputRefs: any;
    hideShow: boolean;
    setFormData: (value: any) => void;
    setCheckEmail: (value: boolean) => void;
    setHideShow: (value: boolean) => void;
    handleSubmit: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    checkEmail,
    formData,
    inputRefs,
    hideShow,
    setFormData,
    setCheckEmail,
    setHideShow,
    handleSubmit
}) => (
    <View style={styles.formContainer}>
        <Image
            source={require('../../../../../../assets/logo.png')}
            style={styles.logo}
            contentFit="contain"
        />
        <Text bold style={styles.title}>
            {checkEmail ? translate('WELCOME_BACK') : translate('WELCOME_TO_APP')}
        </Text>
        <Text style={styles.subtitle}>
            {checkEmail ? formData.email : translate('APP_DESCRIPTION')}
        </Text>
        {!checkEmail ? (
            <EmailInput
                inputRefs={inputRefs}
                formData={formData}
                setFormData={setFormData}
                setCheckEmail={setCheckEmail}
            />
        ) : (
            <PasswordInput
                inputRefs={inputRefs}
                formData={formData}
                hideShow={hideShow}
                setFormData={setFormData}
                setHideShow={setHideShow}
                handleSubmit={handleSubmit}
            />
        )}
    </View>
);