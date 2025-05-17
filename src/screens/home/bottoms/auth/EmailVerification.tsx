// src/screens/home/bottoms/auth/EmailVerification.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Text } from '../../../../components/widget';
import { theme } from '../../../../core/theme';
import Header from '../childs/Header';
import OTPInput from '../../../../components/react-native-otp/src/index';

interface EmailVerificationProps { }

const EmailVerification: React.FC<EmailVerificationProps> = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [state, setState] = useState({
    isLoading: false,
    resend: false,
    otp: '',
    disabledResend: false
  });

  const handleOTPChange = async (otp: string) => {
    setState(prev => ({ ...prev, otp }));
    if (otp.length === 4) {
      await verifyEmail(otp);
    }
  };

  const verifyEmail = async (otp: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setState(prev => ({ ...prev, isLoading: true }));

    // Simulate verification success
    setTimeout(() => {
      setState(prev => ({ ...prev, isLoading: false }));
      navigation.reset({
        index: 0,
        routes: [{ name: 'home' }],
      });
    }, 1500);
  };

  const handleResendCode = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setState(prev => ({
      ...prev,
      isLoading: true,
      disabledResend: true
    }));

    // Simulate resend code
    setTimeout(() => {
      setState(prev => ({ ...prev, isLoading: false }));
      // Enable resend after 60 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, disabledResend: false }));
      }, 60000);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <Header
        backPress={() => navigation.goBack()}
        search={false}
        back={true}
        navigation={navigation}
        logo={false}
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          Enter OTP
        </Text>

        <Text style={styles.subtitle}>
          Please check your email for verification code
        </Text>

        {!state.isLoading ? (
          <OTPInput
            value={state.otp}
            onChange={handleOTPChange}
            autoFocusOnLoad
            cellStyle={styles.otpCell}
            tintColor={theme.colors.grayBackgroundOtp}
            // textColor={theme.colors.black}
            offTintColor={theme.colors.grayBackgroundOtp}
            otpLength={4}
          />
        ) : (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={styles.loader}
          />
        )}

        <TouchableOpacity
          style={[
            styles.resendButton,
            (state.isLoading || state.disabledResend) && styles.disabledButton
          ]}
          disabled={state.isLoading || state.disabledResend}
          onPress={handleResendCode}
        >
          <Text style={styles.resendText}>
            Resend Code
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(50),
  },
  title: {
    fontSize: moderateScale(20),
    color: theme.colors.black,
    marginBottom: moderateScale(10),
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: moderateScale(15),
    color: theme.colors.grayText,
    textAlign: 'center',
    marginBottom: moderateScale(30),
  },
  otpCell: {
    borderRadius: moderateScale(10),
    backgroundColor: theme.colors.grayBackgroundOtp,
    color: theme.colors.black,
  },
  loader: {
    marginVertical: moderateScale(20),
  },
  resendButton: {
    backgroundColor: theme.colors.white,
    paddingVertical: moderateScale(15),
    paddingHorizontal: moderateScale(30),
    borderRadius: moderateScale(10),
    marginTop: moderateScale(30),
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  resendText: {
    color: theme.colors.primary,
    fontSize: moderateScale(15),
    fontWeight: 'bold',
  },
});

export default EmailVerification;