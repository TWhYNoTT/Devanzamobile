// src/screens/Browse/components/LocationPermissionModal.tsx
import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../../../core/theme';
import * as Location from 'expo-location';
import { Button } from 'react-native-paper';

interface LocationPermissionModalProps {
    visible: boolean;
    onAllow: () => void;
    onNotNow: () => void;
    isLoading?: boolean;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
    visible,
    onAllow,
    onNotNow,
    isLoading = false,
}) => {
    const handleAllowLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                onAllow();
            }
        } catch (error) {
            console.error('Error requesting location permission:', error);
        }
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
                        source={require('../../../../../assets/no-location-gps.png')}
                        style={styles.image}
                        contentFit="contain"
                    />

                    <Text style={styles.title}>Let us access your location to</Text>
                    <Text style={styles.subtitle}>To find tutors nearby</Text>

                    <Button
                        mode="contained"
                        onPress={handleAllowLocation}
                        loading={isLoading}
                        disabled={isLoading}
                        style={styles.allowButton}
                        contentStyle={styles.buttonContent}
                    >
                        Allow
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={onNotNow}
                        disabled={isLoading}
                        style={styles.notNowButton}
                        contentStyle={styles.buttonContent}
                    >
                        Not now
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
        height: moderateScale(110),
        width: moderateScale(150),
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
    allowButton: {
        backgroundColor: theme.colors.white,
        width: '70%',
        marginTop: moderateScale(40),
        borderRadius: moderateScale(10),
    },
    notNowButton: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.white,
        width: '70%',
        marginTop: moderateScale(10),
        borderRadius: moderateScale(10),
    },
    buttonContent: {
        height: moderateScale(46),
    },
});

export default LocationPermissionModal;