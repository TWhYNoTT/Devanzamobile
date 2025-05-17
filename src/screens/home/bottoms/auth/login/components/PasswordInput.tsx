// src/screens/auth/login/components/PasswordInput.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import { Text } from '../../../../../../components/widget';
import { styles } from '../styles';
import { translate } from '../../../../../../utils/utils';

interface PasswordInputProps {
    inputRefs: any;
    formData: {
        email: string;
        password: string;
    };
    hideShow: boolean;
    setFormData: (value: any) => void;
    setHideShow: (value: boolean) => void;
    handleSubmit: () => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
    inputRefs,
    formData,
    hideShow,
    setFormData,
    setHideShow,
    handleSubmit
}) => (
    <View style={styles.passwordContainer}>
        <Input
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputContainerStyle}
            ref={el => inputRefs.current.password = el}
            placeholder={translate('Password')}
            value={formData.password}
            onChangeText={(value) => setFormData((prev: any) => ({ ...prev, password: value }))}
            secureTextEntry={!hideShow}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            rightIcon={
                <TouchableOpacity onPress={() => setHideShow(!hideShow)}>
                    <Text style={styles.showHideText}>
                        {translate(hideShow ? 'Hide' : 'Show')}
                    </Text>
                </TouchableOpacity>
            }
        />
    </View>
);
