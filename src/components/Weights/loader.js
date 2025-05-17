import React, { Component } from 'react';
import { theme } from '../../core/theme';
import {
    StyleSheet,
    View,
    Modal
} from 'react-native';
//spinner
var Spinner = require('./node_modules/react-native-spinkit');


const Loader = props => {
    const {
        isVisible,
        ...attributes
    } = props;

    return (
        <Modal
            transparent={true}
            animationType={'none'}
            visible={isVisible}
            onRequestClose={() => {  console.log('close modal') }}>
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <Spinner style={styles.spinner} isVisible={isVisible} size={50} type={'Wave'} color={theme.colors.white} />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        // backgroundColor: '#00000040',
        height: 70,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    spinner: {
        marginBottom: 0
    },
});

export default Loader;