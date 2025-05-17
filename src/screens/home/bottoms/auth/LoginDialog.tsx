// src/screens/home/bottoms/auth/LoginDialog.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Animated,
    ScrollView,
    I18nManager,
    ActivityIndicator
} from 'react-native';
import { Input } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { moderateScale } from 'react-native-size-matters';
import * as Haptics from 'expo-haptics';
import { Text } from '../../../../components/widget';
import { theme } from '../../../../core/theme';
import Header from '../childs/Header';
import SocialLogin from './components/SocialLogin';
import { FONT_FAMILY } from '../../../../services/config';

interface LoginDialogProps {
    navigation: any;
    hide: () => void;
    LoginPageParams?: {
        navigate?: string;
    };
}

const LoginDialog: React.FC<LoginDialogProps> = ({
    navigation,
    hide,
    LoginPageParams
}) => {
    const [state, setState] = useState({
        isLoading: false,
        checkEmail: false,
        email: '',
        password: '',
        HideShow: false,
        facebookLoading: false,
        googleLoading: false
    });

    const topAnim = useRef(new Animated.Value(0)).current;
    const centerAnim = useRef(new Animated.Value(0)).current;
    const bottomAnim = useRef(new Animated.Value(0)).current;
    const inputRefs = useRef<{ [key: string]: any }>({});

    useEffect(() => {
        runEntryAnimations();
    }, []);

    const runEntryAnimations = () => {
        Animated.sequence([
            Animated.timing(topAnim, {
                toValue: 1,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(centerAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
                delay: 100
            }),
            Animated.timing(bottomAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
                delay: 500
            })
        ]).start();
    };

    const resetPage = () => {
        setState({
            isLoading: false,
            checkEmail: false,
            email: '',
            password: '',
            HideShow: false,
            facebookLoading: false,
            googleLoading: false
        });
    };

    const handleEmailSubmit = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setState(prev => ({ ...prev, checkEmail: true }));
        setTimeout(() => {
            inputRefs.current.password?.focus();
        }, 100);
    };

    const handleLogin = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Simulate successful login
        setState(prev => ({ ...prev, isLoading: false }));
        resetPage();
        hide();
        setTimeout(() => {
            navigation.navigate(LoginPageParams?.navigate || 'Home');
        }, 500);
    };

    const handlePress = () => {
        if (state.checkEmail) {
            handleLogin();
            return;
        }
        handleEmailSubmit();
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor="transparent" translucent />
            <Header
                dialog={true}
                backPress={() => {
                    if (state.checkEmail) {
                        setState(prev => ({
                            ...prev,
                            checkEmail: false,
                            password: ''
                        }));
                    } else {
                        resetPage();
                        hide();
                    }
                }}
                Text=""
                language={true}
                back={true}
                navigation={navigation}
                logo={false}
            />

            <Animated.View style={{ flex: 1, opacity: topAnim }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Animated.View style={[styles.formContainer, { opacity: centerAnim }]}>
                        <Image
                            source={require('../../../../assets/logo.png')}
                            contentFit="contain"
                            style={styles.logo}
                        />

                        <Text bold style={styles.title}>
                            {state.checkEmail ? 'Welcome back!' : 'Welcome to Devanza'}
                        </Text>

                        <Text style={styles.subtitle}>
                            {state.checkEmail ? state.email : 'Discover salons with various personal care treatments'}
                        </Text>

                        {!state.checkEmail ? (
                            <Input
                                ref={ref => inputRefs.current.email = ref}
                                containerStyle={styles.inputContainer}
                                inputContainerStyle={[
                                    styles.input,
                                    I18nManager.isRTL && styles.inputRTL
                                ]}
                                placeholder="Email"
                                value={state.email}
                                onChangeText={email => setState(prev => ({ ...prev, email }))}
                                keyboardType="email-address"
                                returnKeyType="next"
                                onSubmitEditing={handlePress}
                            />
                        ) : (
                            <View style={styles.passwordContainer}>
                                <Input
                                    ref={ref => inputRefs.current.password = ref}
                                    containerStyle={styles.inputContainer}
                                    inputContainerStyle={[
                                        styles.input,
                                        I18nManager.isRTL && styles.inputRTL
                                    ]}
                                    placeholder="Password"
                                    value={state.password}
                                    onChangeText={password => setState(prev => ({ ...prev, password }))}
                                    secureTextEntry={!state.HideShow}
                                    returnKeyType="done"
                                    onSubmitEditing={handlePress}
                                />
                                <TouchableOpacity
                                    style={styles.showHideButton}
                                    onPress={() => setState(prev => ({
                                        ...prev,
                                        HideShow: !prev.HideShow
                                    }))}
                                >
                                    <Text style={styles.showHideText}>
                                        {state.HideShow ? 'Hide' : 'Show'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                (state.facebookLoading || state.googleLoading ||
                                    (!state.checkEmail ? !state.email : !state.password)) &&
                                styles.disabledButton
                            ]}
                            disabled={state.facebookLoading || state.googleLoading ||
                                (!state.checkEmail ? !state.email : !state.password)}
                            onPress={handlePress}
                        >
                            <Text style={styles.submitButtonText}>
                                {!state.checkEmail ? 'Continue' : 'Sign in'}
                            </Text>
                            {state.isLoading && (
                                <ActivityIndicator color={theme.colors.white} />
                            )}
                        </TouchableOpacity>

                        {state.checkEmail && (
                            <TouchableOpacity
                                style={styles.forgotPasswordButton}
                                onPress={() => {
                                    resetPage();
                                    hide();
                                    setTimeout(() => {
                                        navigation.navigate('ForgetPassword');
                                    }, 200);
                                }}
                            >
                                <Text bold style={styles.forgotPasswordText}>
                                    Forget Password
                                </Text>
                            </TouchableOpacity>
                        )}

                        <View style={styles.socialContainer}>
                            <SocialLogin />
                        </View>

                        <TouchableOpacity
                            style={styles.signUpContainer}
                            onPress={() => {
                                resetPage();
                                hide();
                                setTimeout(() => {
                                    navigation.navigate('Register');
                                }, 200);
                            }}
                        >
                            <Text style={styles.signUpText}>
                                Don't have an account?{' '}
                                <Text bold style={styles.signUpLink}>
                                    Sign up
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </Animated.View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        padding: moderateScale(10),
    },
    formContainer: {
        width: '90%',
        alignItems: 'center',
    },
    logo: {
        height: moderateScale(110),
        width: moderateScale(150),
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
    input: {
        height: moderateScale(45),
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.line,
        backgroundColor: theme.colors.white,
        paddingLeft: moderateScale(5),
    },
    inputRTL: {
        paddingRight: moderateScale(10),
        textAlign: 'right',
    },
    submitButton: {
        width: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: moderateScale(10),
        marginTop: moderateScale(20),
        padding: moderateScale(15),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    disabledButton: {
        backgroundColor: theme.colors.disabled,
    },
    submitButtonText: {
        color: theme.colors.white,
        fontSize: moderateScale(15),
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold',
        marginRight: moderateScale(10),
    },
    forgotPasswordButton: {

        marginTop: moderateScale(10),
        marginHorizontal: moderateScale(5),
        ...I18nManager.isRTL ? {
            alignSelf: 'flex-end'
        } : {
            alignSelf: 'flex-start'
        },
    },
    forgotPasswordText: {
        color: theme.colors.primary,
        fontSize: moderateScale(15),
    },
    socialContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: moderateScale(30),
        marginBottom: moderateScale(0),
    },
    signUpContainer: {
        width: '100%',
        marginTop: moderateScale(40),
        alignItems: 'center',
    },
    signUpText: {
        color: theme.colors.black,
        fontSize: moderateScale(15),
        textAlign: 'center',
    },
    signUpLink: {
        color: theme.colors.primary,
        fontSize: moderateScale(18),
    },
    passwordContainer: {
        width: '100%',
        position: 'relative',
    },
    showHideButton: {
        position: 'absolute',
        right: 0,
        top: moderateScale(10),
    },
    showHideText: {
        color: theme.colors.primary,
        fontSize: moderateScale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: 'bold',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    overlayLine: {
        backgroundColor: theme.colors.primary,
        height: 5,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        zIndex: 2,
    },
    separatorContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: moderateScale(20),
        marginBottom: moderateScale(10),
    },
    separatorLine: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: theme.colors.secondary,
        marginHorizontal: moderateScale(10),
    },
    separatorText: {
        color: theme.colors.secondary,
        marginHorizontal: moderateScale(20),
        fontSize: moderateScale(20),
    },
});

// Add input interface for type checking
interface State {
    isLoading: boolean;
    checkEmail: boolean;
    email: string;
    password: string;
    HideShow: boolean;
    facebookLoading: boolean;
    googleLoading: boolean;
}

interface InputRefs {
    email: any;
    password: any;
}

export default LoginDialog;