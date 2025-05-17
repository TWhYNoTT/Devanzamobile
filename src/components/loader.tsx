import React from 'react';
import {
    StyleSheet,
    View,
    Modal,
    ActivityIndicator,
    Platform
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../core/theme';

interface LoaderProps {
    isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
    return (
        <Modal
            transparent={true}
            animationType={'none'}
            visible={isLoading}
            onRequestClose={() => { console.log('close modal') }}>
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator
                        size={Platform.OS === 'ios' ? 'large' : moderateScale(30)}
                        color={theme.colors.primary}
                        style={styles.spinner}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000030'
    },
    activityIndicatorWrapper: {
        backgroundColor: 'white',
        height: moderateScale(70),
        width: moderateScale(100),
        borderRadius: moderateScale(10),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    spinner: {
        marginBottom: 0
    },
});

export default Loader;