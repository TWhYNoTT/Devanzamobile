import React, { memo } from 'react';
import { TouchableOpacity, Image, StyleSheet, I18nManager } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/Ionicons'
import { theme } from '../../core/theme';

const BackButton = ({ goBack }) => (
  <TouchableOpacity onPress={goBack} style={styles.container}>
    <Icon size={30} name={'ios-arrow-back'} color={theme.colors.white} style={[{ fontSize: 30, color: theme.colors.white }, styles.icons]} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: getStatusBarHeight(),
    left: 10,
    marginLeft: 15,
    ...I18nManager.isRTL ? { transform: [{ rotate: '180deg' }] } : {},
  },
  image: {
    width: 30,
    ...I18nManager.isRTL ? { transform: [{ rotate: '180deg' }] } : {},
    height: 30,
  },
});

export default memo(BackButton);
