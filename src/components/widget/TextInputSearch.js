import React, { memo } from 'react';
import { View, StyleSheet, TextInput as Input } from 'react-native';
import { theme } from '../../core/theme';
import { translate } from '../../utils/utils';
import { PropTypes } from 'prop-types';
import { moderateScale } from 'react-native-size-matters';


const TextInputSearch = ({ onSubmitEditing, ...props }) => (
  <View style={styles.container}>
    <Input
      style={styles.input}
      selectionColor={theme.colors.primary}
      placeholderTextColor={theme.colors.gray04}
      underlineColor="transparent"
      numberOfLines={1}
      onSubmitEditing={() => { onSubmitEditing() }}
      placeholder={translate('searchHint')}
      {...props}
    />
  </View>
);


TextInputSearch.propTypes = {
  onSubmitEditing: PropTypes.func,
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    fontFamily: "Montserrat-Regular", letterSpacing: 0.3,
    fontFamily: "GillSans", letterSpacing: 0.3,
    textAlign: 'center',
    backgroundColor: 'transparent',

  }
});

export default memo(TextInputSearch);
