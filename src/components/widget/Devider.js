import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import Text from '../components/Text'
import { theme } from '../../core/theme';

class Divider extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static propTypes = {
        dashed: PropTypes.bool,
        color: PropTypes.string,
        borderColor: PropTypes.string,
        orientation: PropTypes.oneOf(['left', 'center', 'right'])
    };

    static defaultProps = {
        dashed: false,
        orientation: 'left',
        borderColor: theme.colors.white
    };

    render() {
        const props = this.props;
        return (
            <View style={styles.container}>
                <View
                    style={[
                        styles.line,
                        { borderColor: props.borderColor },
                        props.dashed && styles.dashed,
                        props.orientation === 'left' ? styles.shortWidth : { flex: 1 }
                    ]}
                />
                <Text bool style={[styles.text, { color: props.color }]}>{props.children}</Text>
                <View
                    style={[
                        styles.line,
                        { borderColor: props.borderColor },
                        props.dashed && styles.dashed,
                        props.orientation === 'right' ? styles.shortWidth : { flex: 1 }
                    ]}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        height: 24,
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 0,
        marginTop: 10,
        marginBottom: 10
    },
    line: {
        height: StyleSheet.hairlineWidth,
        borderBottomWidth: 0.3,
        backgroundColor: 'rgba(0,0,0,0.3)',
        transform: [{ translateY: -1 }]
    },
    shortWidth: {
        width: 10
    },
    dashed: {
        borderStyle: 'dashed'
    },
    text: {
        paddingHorizontal: 10,
        fontSize: 17,
    }
});

export default Divider;
