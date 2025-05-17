
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { theme } from '../../core/theme';

export default class SearchBar extends Component {
  render() {
    return (
      <View style={styles.wrapper}>


        <View style={styles.rowShape}>
          <View style={styles.itemStyleLogo}>
            <Image
              style={styles.imageIcon}
              resizeMode="contain"
              source={require('app/assets/logo.png')}
            />
          </View>
          <View style={styles.itemStyleSearch}>
            <View style={styles.searchContainer}>
              <Icon
                name="ios-search"
                size={20}
                color={theme.colors.gray02}
                style={styles.searchIcon}
              />
              <Text style={styles.textInput}>
                Search</Text>
            </View>
          </View>
          <View style={styles.itemStyle}>

          </View>
        </View>



      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(247, 153, 89,0.9)',
    width: '100%',
    height: 80,
    zIndex: 99,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  searchContainer: {
    display: 'flex',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 10, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    borderRadius: 3,
    height: 40,
    // width: 280,
    marginTop: 14,
    marginLeft: 21,
    marginRight: 21,
  },
  searchIcon: {
    position: 'absolute',
    left: 18,
    top: 9,
  },
  textInput: {
    display: 'flex',
    marginTop: 11,
    marginLeft: 44,
    color: theme.colors.gray02,
  },
  imageIcon: {
    width: 80,
    alignItems: 'center',
    marginLeft: 10,
    height: 50,
    marginTop: 14,
  },
  rowShape: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemStyleLogo: {
    flex: 0.2
  },
  itemStyleSearch: {
    flex: 0.8
  },
  itemStyle: {
    flex: 0
  },

});
