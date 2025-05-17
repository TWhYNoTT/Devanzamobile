import React, { memo } from 'react';
import { TouchableOpacity, Image, StyleSheet, I18nManager } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const BackButton = ({ goBack }) => (
  <TouchableOpacity onPress={goBack} style={styles.container}>
    <Image style={styles.image} source={require('app/assets/arrow_back.png')} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: getStatusBarHeight(),
    left: 10,
    marginLeft: 15
  },
  image: {
    width: 24,
    ...I18nManager.isRTL ? { transform: [{ rotate: '180deg' }] } : {},
    height: 24,
  },
});

export default memo(BackButton);
