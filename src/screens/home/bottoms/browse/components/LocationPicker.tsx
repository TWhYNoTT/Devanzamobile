// src/screens/Browse/components/LocationPicker.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../../../core/theme';
import * as Location from 'expo-location';

interface LocationPickerProps {
    location: {
        location: string;
        geometry: {
            lat: number;
            lng: number;
        };
    };
    onLocationChange: (location: any) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
    location,
    onLocationChange
}) => {
    const handleLocationChange = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            const geocode = await Location.reverseGeocodeAsync({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });

            if (geocode[0]) {
                onLocationChange({
                    location: `${geocode[0].city}, ${geocode[0].country}`,
                    geometry: {
                        lat: currentLocation.coords.latitude,
                        lng: currentLocation.coords.longitude,
                    },
                });
            }
        } catch (error) {
            console.error('Error getting location:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text
                numberOfLines={1}
                style={styles.locationText}
            >
                {location.location}
            </Text>

            <TouchableOpacity onPress={handleLocationChange}>
                <Text style={styles.changeButton}>
                    Change
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: moderateScale(0),
    },
    locationText: {
        color: theme.colors.white,
        fontSize: moderateScale(14),
        textAlign: 'left',
        textTransform: 'capitalize',
        flex: 1,
    },
    changeButton: {
        color: theme.colors.white,
        fontSize: moderateScale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: 'bold',
        marginStart: moderateScale(20),
    },
});

export default LocationPicker;