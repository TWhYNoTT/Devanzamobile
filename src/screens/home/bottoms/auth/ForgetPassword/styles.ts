// styles.ts
import { StyleSheet, TextStyle } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../../../core/theme';
import { FONT_FAMILY } from '../../../../../services/config';
import { I18nManager } from 'react-native';
import { ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
    otpText: {
        fontSize: moderateScale(20),
        color: theme.colors.black,
    } as TextStyle,
    otpTextError: {
        color: theme.colors.red,
    } as TextStyle,
    otpCell: {
        width: moderateScale(45),
        height: moderateScale(45),
        borderWidth: 1,
        borderColor: theme.colors.grayBackgroundOtp,
        borderRadius: moderateScale(5),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        margin: moderateScale(4),
    } as ViewStyle,
    otpCellError: {
        borderColor: theme.colors.red,
    } as ViewStyle,
    otpCellFocused: {
        borderColor: theme.colors.primary,
        borderWidth: 2,
    } as ViewStyle,
    container: {
        flex: 1,

        backgroundColor: 'white',

    },
    content: {
        flex: 1,
        width: '90%',
        alignSelf: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: moderateScale(20),
    },
    contentContainer: {
        padding: moderateScale(15),
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
    phoneText: {
        color: theme.colors.grayText,
        textAlign: 'center',
        paddingVertical: moderateScale(10),
    },
    inputContainer: {
        paddingHorizontal: 0,
        marginTop: moderateScale(10),
    },
    inputContainerO: {
        paddingHorizontal: 0,
        marginTop: moderateScale(10),
        height: moderateScale(45),
    },
    inputContainerStyle: {
        marginTop: moderateScale(16),
        height: moderateScale(45),
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.line,
        ...I18nManager.isRTL ? { textAlign: 'right' } : {},
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(20),

    },
    countryPicker: {
        width: moderateScale(150),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: moderateScale(45),
        borderBottomWidth: 1,
        borderColor: theme.colors.line,
        paddingHorizontal: moderateScale(10),

    },
    dropdownIcon: {
        height: moderateScale(10),
        width: moderateScale(13),
        marginLeft: moderateScale(5),

    },
    otpContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: moderateScale(20),
    },

    passwordContainer: {
        width: '100%',
        marginTop: moderateScale(20),
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
        paddingHorizontal: moderateScale(30),
    },
    primaryButtonText: {
        fontSize: moderateScale(15),
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold',
    },
    resendButton: {
        backgroundColor: theme.colors.white,
        borderRadius: moderateScale(20),
        marginTop: moderateScale(20),
    },
    resendButtonText: {
        color: theme.colors.blackText,
        fontSize: moderateScale(15),
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
    },
    otpWrapper: {
        width: '100%',
        alignItems: 'center',
    } as ViewStyle,
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 999,
    },
});