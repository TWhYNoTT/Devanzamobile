// src/screens/Browse/components/NoInternetModal.tsx
import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../../../core/theme';
import { Button } from 'react-native-paper';

interface NoInternetModalProps {
    visible: boolean;
    onRetry: () => void;
    isLoading?: boolean;
    userInfo?: {
        gender?: 'male' | 'female';
    };
}

const NoInternetModal: React.FC<NoInternetModalProps> = ({
    visible,
    onRetry,
    isLoading = false,
    userInfo,
}) => {
    const getImageSource = () => {
        if (userInfo?.gender === 'female') {
            return require('../../../../../assets/no-internent-female.png');
        }
        return require('../../../../../assets/no-internent-male.png');
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Image
                        source={getImageSource()}
                        style={styles.image}
                        contentFit="contain"
                    />

                    <Text style={styles.title}>You are offline</Text>
                    <Text style={styles.subtitle}>
                        It seems there is a problem with your connection. Please check your network status
                    </Text>

                    <Button
                        mode="contained"
                        onPress={onRetry}
                        loading={isLoading}
                        disabled={isLoading}
                        style={styles.retryButton}
                        contentStyle={styles.buttonContent}
                    >
                        Retry
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        padding: moderateScale(20),
        alignItems: 'center',
    },
    image: {
        height: moderateScale(200),
        width: moderateScale(200),
        marginVertical: moderateScale(10),
    },
    title: {
        color: theme.colors.white,
        fontSize: moderateScale(25),
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: moderateScale(20),
    },
    subtitle: {
        color: theme.colors.white,
        fontSize: moderateScale(15),
        textAlign: 'center',
        marginTop: moderateScale(10),
    },
    retryButton: {
        backgroundColor: theme.colors.white,
        width: '70%',
        marginTop: moderateScale(40),
        borderRadius: moderateScale(10),
    },
    buttonContent: {
        height: moderateScale(46),
    },
});

export default NoInternetModal;