import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, ScrollView } from 'react-native';
import { showDanger, showSuccess, translate } from '../../../../../utils/utils';
import { LoginHeader } from './components/LoginHeader';
import { LoginForm } from './components/LoginForm';
import { LoginButtons } from './components/LoginButtons';
import { LoginFooter } from './components/LoginFooter';
import { styles } from './styles';
import { useAuthContext } from '../../../../../contexts/AuthContext';
import { SocialAuthRequest, ProfileType } from '../../../../../types/auth.types';
import { validateInput } from '../../../../../utils/validators';
import { CommonActions } from '@react-navigation/native';

interface LoginProps {
    navigation: any;
    selectedLocation?: {
        country: string;
    };
}

const Login: React.FC<LoginProps> = ({ navigation, selectedLocation }) => {
    const { signIn, socialAuth, isLoading: authLoading } = useAuthContext();
    const inputRefs = useRef<any>({});
    const topAnim = useRef(new Animated.Value(0)).current;
    const centerAnim = useRef(new Animated.Value(0)).current;
    const bottomAnim = useRef(new Animated.Value(0)).current;

    const [isLoading, setIsLoading] = useState(false);
    const [checkEmail, setCheckEmail] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [hideShow, setHideShow] = useState(false);
    const [socialLoading, setSocialLoading] = useState({
        facebook: false,
        google: false
    });

    useEffect(() => {
        startAnimations();
    }, []);

    const startAnimations = () => {
        const animations = [
            Animated.timing(topAnim, {
                toValue: 1,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.sequence([
                Animated.delay(100),
                Animated.timing(centerAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                })
            ]),
            Animated.sequence([
                Animated.delay(500),
                Animated.timing(bottomAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                })
            ])
        ];

        Animated.parallel(animations).start();
    };

    const handleLoginSuccess = () => {
        showSuccess(translate('LOGIN_SUCCESS'));
        // Navigate immediately after successful login
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'home' }],
            })
        );
    };

    const handleLoginError = (error: any) => {
        setIsLoading(false);
        setSocialLoading({ facebook: false, google: false });
        showDanger(error.message || translate('LOGIN_ERROR'));
        // Don't navigate anywhere on error - stay on login page
    };

    const validateForm = (): boolean => {
        const { isValid, type, message } = validateInput.isValidEmailOrPhone(formData.email);
        if (!isValid) {
            showDanger(message);
            return false;
        }

        if (checkEmail) {
            const { isValid: isValidPass, errors } = validateInput.isValidPassword(formData.password);
            if (!isValidPass) {
                showDanger(errors.join('\n'));
                return false;
            }
        }

        return true;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await signIn({
                identifier: formData.email.trim(),
                password: formData.password,
                userType: ProfileType.Customer
            });

            // Only navigate if signIn was successful (no exception thrown)
            handleLoginSuccess();
        } catch (error) {
            handleLoginError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialAuth = async (provider: 'Google' | 'Facebook', token: string) => {
        try {
            setSocialLoading(prev => ({
                ...prev,
                [provider.toLowerCase()]: true
            }));

            const socialAuthData: SocialAuthRequest = {
                provider,
                providerToken: token
            };

            await socialAuth(socialAuthData);

            // Only navigate if socialAuth was successful (no exception thrown)
            handleLoginSuccess();
        } catch (error) {
            handleLoginError(error);
        } finally {
            setSocialLoading({ facebook: false, google: false });
        }
    };

    const handleSubmit = async () => {
        if (!formData.email) {
            const { message } = validateInput.isValidEmailOrPhone('');
            showDanger(message);
            return;
        }

        if (!validateForm()) {
            return;
        }

        if (checkEmail && !formData.password) {
            showDanger(translate('PLEASE_ENTER_PASSWORD'));
            return;
        }

        if (checkEmail) {
            handleLogin();
            return;
        }

        setIsLoading(true);
        try {
            const { type } = validateInput.isValidEmailOrPhone(formData.email);
            setCheckEmail(true);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            showDanger(translate('INVALID_EMAIL_OR_PHONE'));
        }
    };

    // Combine local and auth loading states
    const isLoadingState = isLoading || authLoading;

    return (
        <View style={styles.container}>
            <LoginHeader
                checkEmail={checkEmail}
                navigation={navigation}
                setCheckEmail={setCheckEmail}
            />
            <Animated.View style={{ opacity: topAnim, flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}
                >
                    <LoginForm
                        checkEmail={checkEmail}
                        formData={formData}
                        inputRefs={inputRefs}
                        hideShow={hideShow}
                        setFormData={setFormData}
                        setCheckEmail={setCheckEmail}
                        setHideShow={setHideShow}
                        handleSubmit={handleSubmit}
                    />
                    <LoginButtons
                        isLoading={isLoadingState}
                        socialLoading={socialLoading}
                        checkEmail={checkEmail}
                        handleSubmit={handleSubmit}
                        handleSocialAuth={handleSocialAuth}
                        navigation={navigation}
                    />
                    <LoginFooter navigation={navigation} />
                </ScrollView>
            </Animated.View>
            <View style={styles.bottomBar} />
        </View>
    );
};

export default Login;