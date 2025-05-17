
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { theme } from '../../core/theme';

export default class Stars extends Component {
  get stars() {
    const { votes, size, color } = this.props;
    const starsNumber = parseInt(votes);
    const starElements = [];
    for (let i = 0; i < 5; i++) {
      starElements.push(
        <Icon
          key={`star-${i}`}
          name="star"
          size={size}
          style={styles.star}
          color={starsNumber > i ? theme.colors.secondary : theme.colors.gray03}

        />,
      );
    }
    return starElements;
  }

  render() {
    const { votes, size } = this.props;
    return (
      <View style={styles.wrapper}>
        <View style={styles.stars}>
          {this.stars}
          {votes ? (
            <Text style={styles.votesNumber, { fontSize: size, color: theme.colors.secondary }}>
              {/* {' '} {votes} */}
            </Text>
          ) : null}
        </View>
      </View >
    );
  }
}

Stars.propTypes = {
  votes: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginLeft: 0,
    alignItems: 'center',
  },
  star: {
    marginRight: 1,
    transform: [{ rotate: '110deg' }]
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  votesNumber: {
    color: theme.colors.secondary,
    fontWeight: '600',
    marginTop: 1,
    marginLeft: 3,
  },
});