import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    StatusBar,
    Animated,
    ScrollView,
    Dimensions,
    I18nManager
} from 'react-native';
import { Button } from 'react-native-elements';
import { Input } from 'react-native-elements';
import { Image } from 'expo-image';
import { Text } from '../../../../components/widget';
import { theme } from '../../../../core/theme';
import { showDanger, showInfo, showSuccess, translate } from '../../../../utils/utils';
import Header from '../childs/Header';
import { moderateScale } from 'react-native-size-matters';
import { FONT_FAMILY } from '../../../../services/config';
import SocialLogin from './components/SocialLogin';


interface LoginProps {
    navigation: any;
    selectedLocation?: {
        country: string;
    };
}

const Login: React.FC<LoginProps> = ({ navigation, selectedLocation }) => {
    // Refs
    const inputRefs = useRef<any>({});

    // Animations
    const topAnim = useRef(new Animated.Value(0)).current;
    const centerAnim = useRef(new Animated.Value(0)).current;
    const bottomAnim = useRef(new Animated.Value(0)).current;

    // State
    const [isLoading, setIsLoading] = useState(false);
    const [checkEmail, setCheckEmail] = useState(false);
    const [formData, setFormData] = useState({
        email: 'Abdo@mostafa.com',
        password: '123456',
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

    const handleLoginSuccess = async (data: any) => {
        setIsLoading(false);
        setSocialLoading({ facebook: false, google: false });

        // Show success message before navigation
        showSuccess(translate('LOGIN_SUCCESS'));

        // Reset navigation stack and navigate to Home
        navigation.reset({
            index: 0,
            routes: [{ name: 'home' }],
        });
    };


    const handleLoginError = (error: any) => {
        setIsLoading(false);
        showDanger(error.message || translate('LOGIN_ERROR'));
    };

    const handleLogin = async () => {
        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (formData.email && formData.password) {
                handleLoginSuccess({
                    success: true,
                    user: {
                        email: formData.email
                    }
                });
            } else {
                throw new Error(translate('INVALID_CREDENTIALS'));
            }
        } catch (error) {
            handleLoginError(error);
        }
    };

    const handleSubmit = async () => {
        if (!formData.email) {
            showDanger(translate('PLEASE_ENTER_EMAIL'));
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
            // Simulate email check
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCheckEmail(true);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            showDanger(translate('INVALID_EMAIL'));
        }
    };

    const renderLoginForm = () => (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
        >
            <View style={styles.formContainer}>
                <Image
                    source={require('../../../../assets/logo.png')}
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
                    <Input
                        containerStyle={styles.inputContainer}
                        inputContainerStyle={styles.inputContainerStyle}
                        ref={el => inputRefs.current.email = el}
                        returnKeyType="next"
                        placeholder={translate('Email')}
                        value={formData.email}
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
                        onSubmitEditing={() => {
                            setCheckEmail(true);
                            setTimeout(() => {
                                inputRefs.current.password?.focus();
                            }, 400);
                        }}
                    />
                ) : (
                    <View style={styles.passwordContainer}>
                        <Input
                            containerStyle={styles.inputContainer}
                            inputContainerStyle={styles.inputContainerStyle}
                            ref={el => inputRefs.current.password = el}
                            placeholder={translate('Password')}
                            value={formData.password}
                            onChangeText={(value) => setFormData(prev => ({ ...prev, password: value }))}
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
                )}

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
                        < Text bold style={styles.signupTextBold} >
                            {translate('Sign up')}
                        </Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView >
    );

    return (
        <View style={styles.container}>
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

            <Animated.View style={{ opacity: topAnim, flex: 1 }}>
                {renderLoginForm()}
            </Animated.View>

            <View style={styles.bottomBar} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        width: '95%',
        alignSelf: 'center',
    },
    scrollViewContent: {
        paddingBottom: moderateScale(100),
    },
    formContainer: {
        width: '90%',
        alignSelf: 'center',
        paddingTop: moderateScale(40),
    },
    logo: {
        height: moderateScale(110),
        width: moderateScale(150),
        alignSelf: 'center',
        marginVertical: moderateScale(10),
    },
    title: {
        color: theme.colors.black,
        fontSize: moderateScale(25),
        textAlign: 'center',
        marginTop: moderateScale(20),
    },
    subtitle: {
        color: theme.colors.grayText,
        fontSize: moderateScale(15),
        textAlign: 'center',
        marginTop: moderateScale(10),
    },
    inputContainer: {
        paddingHorizontal: 0,
        marginTop: moderateScale(20),
    },
    inputContainerStyle: {
        width: '100%',
        height: moderateScale(45),
        paddingLeft: moderateScale(5),
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.line,
        backgroundColor: theme.colors.white,
        ...I18nManager.isRTL ? { textAlign: 'right' } : {},
    },
    passwordContainer: {
        width: '100%',
        marginTop: moderateScale(10),
    },
    showHideText: {
        color: theme.colors.primary,
        fontSize: moderateScale(15),
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: moderateScale(10),
        height: moderateScale(45),
        marginTop: moderateScale(20),
    },
    primaryButtonText: {
        fontSize: moderateScale(15),
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold',
    },
    secondaryButton: {
        borderColor: theme.colors.primary,
        borderRadius: moderateScale(10),
        height: moderateScale(45),
        marginTop: moderateScale(10),
        borderWidth: moderateScale(1),
    },
    secondaryButtonText: {
        color: theme.colors.primary,
        fontSize: moderateScale(15),
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold',
    },
    forgotPassword: {
        alignSelf: 'flex-start',
        marginTop: moderateScale(10),
        marginHorizontal: moderateScale(5),
    },
    forgotPasswordText: {
        color: theme.colors.primary,
    },
    socialContainer: {
        marginTop: moderateScale(30),
        width: '100%',
        alignItems: 'center',
    },
    signupLink: {
        marginTop: moderateScale(40),
    },
    signupText: {
        color: theme.colors.black,
        fontSize: moderateScale(15),
        textAlign: 'center',
    },
    signupTextBold: {
        color: theme.colors.primary,
        fontSize: moderateScale(18),
    },
    bottomBar: {
        backgroundColor: theme.colors.primary,
        height: 5,
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
});

export default Login;