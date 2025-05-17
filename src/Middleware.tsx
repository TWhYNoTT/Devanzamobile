// src/Middleware.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  interpolate,
  useSharedValue
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import AppNavigation from './navigation/AppNavigation';
import LoginDialog from './screens/home/bottoms/auth/LoginDialog';
import { theme } from './core/theme';
import { LoginPageParams, UserInfo } from './types';

interface Props {
  loginPageCounter: number;
  LoginPageParams: LoginPageParams;
  userInfo?: UserInfo | null;
}

const AppMiddleware: React.FC<Props> = ({
  loginPageCounter,
  LoginPageParams,
  userInfo
}) => {
  const navigation = useNavigation();
  const [isReady, setIsReady] = useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    if (loginPageCounter > 0 && bottomSheetRef.current) {
      bottomSheetRef.current.present();
    }
  }, [loginPageCounter]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animationProgress.value,
      [0, 1],
      [0, 0.5]
    ),
    backgroundColor: theme.colors.black,
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  }));

  const handleTapStateChange = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    animationProgress.value = index === -1 ? 0 : 1;
  }, [animationProgress]);

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <AppNavigation />

        <TapGestureHandler onHandlerStateChange={handleTapStateChange}>
          <Animated.View
            style={[overlayStyle, { display: animationProgress.value > 0 ? 'flex' : 'none' }]}
          />
        </TapGestureHandler>

        {isReady && (
          <BottomSheetModal
            ref={bottomSheetRef}
            snapPoints={['95%']}
            index={-1}
            enablePanDownToClose
            enableDismissOnClose
            onChange={handleSheetChanges}
            handleStyle={styles.bottomSheetHandle}
            handleIndicatorStyle={styles.bottomSheetIndicator}
            backgroundStyle={styles.bottomSheetBackground}
          >
            <LoginDialog
              LoginPageParams={LoginPageParams}
              navigation={navigation}
              hide={() => bottomSheetRef.current?.dismiss()}
            />
          </BottomSheetModal>
        )}
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheetHandle: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
  },
  bottomSheetIndicator: {
    backgroundColor: theme.colors.grey,
    width: moderateScale(40),
  },
  bottomSheetBackground: {
    backgroundColor: theme.colors.white,
  },
});

export default AppMiddleware;