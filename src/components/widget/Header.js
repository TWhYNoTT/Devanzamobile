import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { theme } from '../../core/theme';
import Text from '../components/Text'

const Header = ({ children }) => <Text bold style={styles.header}>{children}</Text>;

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    color: theme.colors.blue,
    textAlign:'center',
    fontWeight: 'bold',
    paddingVertical: 24,
  },
});

export default memo(Header);
