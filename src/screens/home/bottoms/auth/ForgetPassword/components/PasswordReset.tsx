// PasswordReset.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import { translate } from '../../../../../../utils/utils';
import { styles } from '../styles';
import { Text } from '../../../../../../components/widget';

interface PasswordResetProps {
    password: string;
    confirmPassword: string;
    hideShow: boolean;
    onPasswordChange: (password: string) => void;
    onConfirmPasswordChange: (confirmPassword: string) => void;
    onTogglePassword: () => void;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({
    password,
    confirmPassword,
    hideShow,
    onPasswordChange,
    onConfirmPasswordChange,
    onTogglePassword
}) => (
    <View style={styles.passwordContainer}>
        <Input
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputContainerStyle}
            placeholder={translate('Enter_new_password')}
            value={password}
            onChangeText={onPasswordChange}
            secureTextEntry={!hideShow}
            rightIcon={
                <TouchableOpacity onPress={onTogglePassword}>
                    <Text style={styles.showHideText}>
                        {translate(hideShow ? 'Hide' : 'Show')}
                    </Text>
                </TouchableOpacity>
            }
        />
        <Input
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputContainerStyle}
            placeholder={translate('Confirm_new_password')}
            value={confirmPassword}
            onChangeText={onConfirmPasswordChange}
            secureTextEntry={!hideShow}
        />
    </View>
);
