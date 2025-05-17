// src/components/react-native-otp/src/index.tsx
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, TextInput, Text, Pressable } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../core/theme';
import { FONT_FAMILY } from '../../../services/config';
import type { OTPInputProps, OTPInputRef } from './types';

const OTPInput = forwardRef<OTPInputRef, OTPInputProps>((props, ref) => {
  const {
    onChange = () => null,
    otpLength = 6,
    tintColor = '#FB6C6A',
    offTintColor = '#BBBCBE',
    containerStyle = {},
    cellStyle = {},
    value,
    defaultValue,
    editable = true,
    autoFocusOnLoad = true,
    ...otherProps
  } = props;

  const [internalVal, setInternalVal] = useState<string>(value || defaultValue || '');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocusOnLoad) {
      focus();
    }
  }, []);

  useEffect(() => {
    if (value !== undefined && value !== internalVal) {
      setInternalVal(value);
    }
  }, [value]);

  const handleChangeText = (val: string) => {
    onChange(val);
    setInternalVal(val);
  };

  const focus = () => {
    if (editable) {
      inputRef.current?.focus();
    }
  };

  const blur = () => {
    inputRef.current?.blur();
  };

  const clear = () => {
    setInternalVal('');
  };

  const isFocused = () => {
    return inputRef.current?.isFocused() || false;
  };

  useImperativeHandle(ref, () => ({
    focus,
    blur,
    clear,
    isFocused
  }));

  return (
    <View>
      <TextInput
        ref={inputRef}
        onChangeText={handleChangeText}
        style={styles.hiddenInput}
        value={internalVal}
        maxLength={otpLength}
        returnKeyType="done"
        keyboardType="numeric"
        editable={editable}
        {...otherProps}
      />
      <View style={[styles.container, containerStyle]}>
        {Array(otpLength)
          .fill(0)
          .map((_, index) => (
            <Pressable
              key={index}
              onPress={focus}
              style={styles.cellContainer}
            >
              <Text
                style={[
                  styles.cell,
                  cellStyle,
                  {
                    borderColor:
                      internalVal && index === internalVal.length
                        ? tintColor
                        : offTintColor,
                    backgroundColor: theme.colors.grayBackgroundOtp,
                  }
                ]}
              >
                {internalVal && internalVal.length > index
                  ? internalVal[index]
                  : " "}
              </Text>
            </Pressable>
          ))}
      </View>
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    width: 0,
    height: 0,
    position: 'absolute',
  },
  cellContainer: {
    borderRadius: moderateScale(15),
    backgroundColor: theme.colors.grayBackgroundOtp,
    marginHorizontal: moderateScale(5),
  },
  cell: {
    paddingVertical: moderateScale(11),
    width: moderateScale(40),
    margin: moderateScale(5),
    textAlign: 'center',
    fontSize: moderateScale(16),
    color: '#000',
    borderWidth: 1.5,
    borderRadius: moderateScale(10),
    fontFamily: FONT_FAMILY,
    fontWeight: 'bold',
  }
});

export default OTPInput;