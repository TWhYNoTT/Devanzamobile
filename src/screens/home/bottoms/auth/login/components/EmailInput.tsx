// src/screens/auth/login/components/EmailInput.tsx
import React from 'react';
import { Input } from 'react-native-elements';
import { styles } from '../styles';
import { translate } from '../../../../../../utils/utils';

interface EmailInputProps {
    inputRefs: any;
    formData: {
        email: string;
        password: string;
    };
    setFormData: (value: any) => void;
    setCheckEmail: (value: boolean) => void;
}

export const EmailInput: React.FC<EmailInputProps> = ({
    inputRefs,
    formData,
    setFormData,
    setCheckEmail,
}) => (
    <Input
        containerStyle={styles.inputContainer}
        inputContainerStyle={styles.inputContainerStyle}
        ref={el => inputRefs.current.email = el}
        returnKeyType="next"
        placeholder={translate('Email')}
        value={formData.email}
        keyboardType="email-address"
        textContentType="emailAddress"
        onChangeText={(value) => setFormData((prev: any) => ({ ...prev, email: value }))}
        onSubmitEditing={() => {
            setCheckEmail(true);
            setTimeout(() => {
                inputRefs.current.password?.focus();
            }, 400);
        }}
    />
);