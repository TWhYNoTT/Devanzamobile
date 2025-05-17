import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Block from './Block';
import { theme } from '../../core/theme';



export default class DividerSecond extends Component {
  render() {
    const { color, style, ...props } = this.props;
    const dividerStyles = [
      styles.divider,
      style,
    ];

    return (
      <Block
        color={color || theme.colors.white}
        style={dividerStyles}
        {...props}
      />
    )
  }
}

export const styles = StyleSheet.create({
  divider: {
    height: 0,
    margin: theme.sizes.base * 2,
    borderBottomColor: theme.colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
})
