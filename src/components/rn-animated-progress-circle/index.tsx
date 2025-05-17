// src/components/rn-animated-progress-circle/index.tsx
import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewStyle, Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

interface ProgressCircleProps {
  value: number | Animated.Value;
  size?: number;
  thickness?: number;
  color?: string;
  unfilledColor?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
  animationMethod?: 'timing' | 'spring' | 'decay' | null;
  animationConfig?: Animated.TimingAnimationConfig;
  shouldAnimateFirstValue?: boolean;
  onChange?: () => void;
  onChangeAnimationEnd?: () => void;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value = 0,
  size = 64,
  thickness = 7,
  color = '#4c90ff',
  unfilledColor = 'transparent',
  style = {},
  children = null,
  animationMethod = null,
  animationConfig = { duration: 200 },
  shouldAnimateFirstValue = false,
  onChange = () => { },
  onChangeAnimationEnd = () => { },
}) => {
  // Scale down the size for web
  const actualSize = Platform.select({
    web: moderateScale(size * 0.7), // 30% smaller on web
    default: size
  });

  const actualThickness = Platform.select({
    web: Math.max(thickness * 0.7, 2), // Proportionally smaller thickness
    default: thickness
  });

  const ANIMATION_TYPES = ['timing', 'spring', 'decay'];
  const animatedValue = useRef(
    (value as any).constructor.name === 'AnimatedValue'
      ? null
      : new Animated.Value(shouldAnimateFirstValue ? 0 : value as number)
  ).current;

  const getAnimationMethod = () => {
    return ANIMATION_TYPES.includes(animationMethod as string)
      ? animationMethod
      : null;
  };

  useEffect(() => {
    if (
      (value as any).constructor.name !== 'AnimatedValue' &&
      shouldAnimateFirstValue &&
      getAnimationMethod()
    ) {
      animateChange(value as number);
    }
  }, []);

  useEffect(() => {
    handleChange(value as number);
  }, [value]);

  const handleChange = (newValue = value) => {
    onChange();
    if ((newValue as any).constructor.name === 'AnimatedValue') {
      return;
    }

    if (getAnimationMethod()) {
      animateChange(newValue as number);
    } else {
      animatedValue?.setValue(newValue as number);
    }
  };

  const animateChange = (toValue: number) =>
    animatedValue &&
    Animated[getAnimationMethod() as 'timing'](animatedValue, {
      ...animationConfig,
      toValue,
      useNativeDriver: Platform.OS !== 'web',
    }).start(onChangeAnimationEnd);

  const fullCircleStyle = {
    width: actualSize,
    height: actualSize,
    borderRadius: actualSize / 2,
  };

  const halfCircleContainerStyle = {
    width: actualSize / 2,
    height: actualSize,
    overflow: 'hidden' as const,
  };

  const renderHalfCircle = ({ isFlipped = false } = {}) => {
    const valueToInterpolate =
      (value as any).constructor.name === 'AnimatedValue'
        ? value
        : animatedValue;

    return (
      <Animated.View
        pointerEvents="none"
        style={[
          {
            ...halfCircleContainerStyle,
            transform: [{ scaleX: isFlipped ? -1 : 1 }],
          },
          style,
        ]}
      >
        <Animated.View
          style={{
            width: actualSize,
            height: actualSize,
            transform: [
              {
                rotate: (valueToInterpolate as Animated.Value).interpolate({
                  inputRange: isFlipped ? [0, 0.5] : [0.5, 1],
                  outputRange: isFlipped
                    ? ['180deg', '0deg']
                    : ['-180deg', '0deg'],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }}
        >
          <View style={halfCircleContainerStyle}>
            <View
              style={{
                ...fullCircleStyle,
                borderWidth: actualThickness,
                borderColor: color,
                ...Platform.select({
                  web: {
                    borderStyle: 'solid',
                  }
                })
              }}
            />
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  // Simpler web fallback for progress circle
  if (Platform.OS === 'web') {
    const progressValue = typeof value === 'number' ? value : 0;
    const rotation = progressValue * 360;

    return (
      <View style={[fullCircleStyle, { position: 'relative' }, style]}>
        <View
          style={{
            ...fullCircleStyle,
            borderWidth: actualThickness,
            borderColor: unfilledColor,
            position: 'absolute',
          }}
        />
        <View
          style={{
            ...fullCircleStyle,
            position: 'absolute',
            transform: `rotate(${rotation}deg)`,
            borderWidth: actualThickness,
            borderColor: 'transparent',
            borderTopColor: color,
            borderRightColor: progressValue > 0.25 ? color : 'transparent',
            borderBottomColor: progressValue > 0.5 ? color : 'transparent',
            borderLeftColor: progressValue > 0.75 ? color : 'transparent',
          } as any}
        />
        <View
          style={{
            ...fullCircleStyle,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {children}
        </View>
      </View>
    );
  }

  return (
    <View style={[fullCircleStyle, { flexDirection: 'row' }, style]}>
      <View
        pointerEvents="box-none"
        style={{
          ...fullCircleStyle,
          borderWidth: actualThickness,
          borderColor: unfilledColor,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </View>
      {renderHalfCircle()}
      {renderHalfCircle({ isFlipped: true })}
    </View>
  );
};

export default ProgressCircle;