import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { Text } from '../../../../../../components/widget';
import { translate } from '../../../../../../utils/utils';
import { FONT_FAMILY } from '../../../../../../services/config';
import { I18nManager } from 'react-native';
import { theme } from '../../../../../../core/theme';
import { moderateScale } from 'react-native-size-matters';

interface FormInputsProps {
    name: string;
    email: string;
    password: string;
    hideShow: boolean;
    onNameChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onTogglePassword: () => void;
    inputRefs: any;
}

export const FormInputs: React.FC<FormInputsProps> = ({
    name,
    email,
    password,
    hideShow,
    onNameChange,
    onEmailChange,
    onPasswordChange,
    onTogglePassword,
    inputRefs
}) => (
    <View>
        <Input
            placeholder={translate('Full Name')}
            value={name}
            onChangeText={onNameChange}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            ref={el => inputRefs.current.name = el}
            returnKeyType="next"
            onSubmitEditing={() => inputRefs.current.email?.focus()}
        />

        <Input
            placeholder={translate('Email')}
            value={email}
            onChangeText={onEmailChange}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            ref={el => inputRefs.current.email = el}
            returnKeyType="next"
            keyboardType="email-address"
            autoCapitalize="none"
            onSubmitEditing={() => inputRefs.current.phone?.focus()}
        />

        <View style={styles.passwordContainer}>
            <Input
                placeholder={translate('Password')}
                value={password}
                onChangeText={onPasswordChange}
                secureTextEntry={!hideShow}
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
                ref={el => inputRefs.current.password = el}
                rightIcon={
                    <TouchableOpacity onPress={onTogglePassword}>
                        <Text style={styles.showHideText}>
                            {translate(hideShow ? 'Hide' : 'Show')}
                        </Text>
                    </TouchableOpacity>
                }
            />
        </View>
    </View>
);

const styles = StyleSheet.create({
    inputContainer: {
        paddingHorizontal: 0,
        marginTop: moderateScale(10),
    },
    input: {
        textAlignVertical: 'center',
        height: moderateScale(45),
        fontFamily: FONT_FAMILY,
        ...I18nManager.isRTL ? { textAlign: 'right' } : {},
    },
    passwordContainer: {
        marginTop: moderateScale(10),
    },
    showHideText: {
        color: theme.colors.primary,
        fontSize: moderateScale(15),
    },
});
