// src/screens/auth/login/styles.ts
import { StyleSheet, Dimensions, I18nManager } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../../../core/theme';
import { FONT_FAMILY } from '../../../../../services/config';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    // Main Container Styles
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    scrollView: {
        width: '95%',
        alignSelf: 'center',
    },
    scrollViewContent: {
        paddingBottom: moderateScale(100),
    },
    bottomBar: {
        backgroundColor: theme.colors.primary,
        height: 5,
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },

    // Header Styles
    headerContainer: {
        width: '100%',
        backgroundColor: 'transparent',
        zIndex: 1,
    },

    // Form Container Styles
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
        fontFamily: FONT_FAMILY,
    },
    subtitle: {
        color: theme.colors.grayText,
        fontSize: moderateScale(15),
        textAlign: 'center',
        marginTop: moderateScale(10),
        fontFamily: FONT_FAMILY,
    },

    // Input Styles
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
        fontFamily: FONT_FAMILY,
    },

    // Button Styles
    buttonsContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: moderateScale(20),
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
        color: theme.colors.white,
    },
    secondaryButton: {
        borderColor: theme.colors.primary,
        borderRadius: moderateScale(10),
        height: moderateScale(45),
        marginTop: moderateScale(10),
        borderWidth: moderateScale(1),
        backgroundColor: theme.colors.white,
    },
    secondaryButtonText: {
        color: theme.colors.primary,
        fontSize: moderateScale(15),
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold',
    },

    // Footer Styles
    footerContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: moderateScale(20),
    },
    forgotPassword: {
        alignSelf: 'flex-start',
        marginTop: moderateScale(10),
        marginHorizontal: moderateScale(5),
    },
    forgotPasswordText: {
        color: theme.colors.primary,
        fontFamily: FONT_FAMILY,
    },
    socialContainer: {
        marginTop: moderateScale(30),
        width: '100%',
        alignItems: 'center',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: moderateScale(10),
    },
    socialButton: {
        width: moderateScale(45),
        height: moderateScale(45),
        borderRadius: moderateScale(22.5),

        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: moderateScale(10),
        shadowColor: theme.colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    socialIcon: {
        width: moderateScale(25),
        height: moderateScale(25),
    },
    signupLink: {
        marginTop: moderateScale(40),
        marginBottom: moderateScale(20),
    },
    signupText: {
        color: theme.colors.black,
        fontSize: moderateScale(15),
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
    },
    signupTextBold: {
        color: theme.colors.primary,
        fontSize: moderateScale(18),
        fontFamily: FONT_FAMILY,
    },

    // Animation Styles
    animatedContainer: {
        flex: 1,
        opacity: 0,
    },
});