// src/screens/auth/login/components/LoginHeader.tsx
import React from 'react';
import { View, StatusBar } from 'react-native';
import Header from '../../../childs/Header';
import { theme } from '../../../../../../core/theme';
import { translate } from '../../../../../../utils/utils';
import { styles } from '../styles';

interface LoginHeaderProps {
    checkEmail: boolean;
    navigation: any;
    setCheckEmail: (value: boolean) => void;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({
    checkEmail,
    navigation,
    setCheckEmail
}) => (
    <View style={styles.headerContainer}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <Header
            backPress={() => checkEmail ? setCheckEmail(false) : navigation.pop()}
            Text={translate('')}
            language={true}
            back={true}
            navigation={navigation}
            logo={false}
            color={theme.colors.primary}
        />
    </View>
);