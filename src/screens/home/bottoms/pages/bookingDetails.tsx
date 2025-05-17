import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    I18nManager,
    StatusBar,
    ScrollView,
    Platform,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import MapView, { Marker } from 'react-native-maps';
import { DateTime } from 'luxon';
import { Button } from 'react-native-paper';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Image as ExpoImage } from 'expo-image';

// Import theme and utilities
import { theme } from '../../../../core/theme';
import { translate } from '../../../../utils/utils';
import { FONT_FAMILY } from '../../../../services/config';
import Header from '../childs/Header';
import { Text } from '../../../../components/widget';

// Import hooks and types
import { useAppointments } from '../../../../hooks/useAppointments';
import { CustomerAppointmentDetailResponse, AppointmentStatus, PaymentStatus } from '../../../../types/api.types';

// Type definitions
interface Props {
    navigation: NavigationProp<any>;
    route: RouteProp<{ params: { appointmentId: number } }, 'params'>;
}

const BookingDetails: React.FC<Props> = ({ navigation, route }) => {
    // Get appointment ID from route params
    const appointmentId = route.params?.appointmentId;

    // Use the appointments hook
    const { getAppointmentDetails, cancelAppointment, isLoading: hookLoading } = useAppointments();

    // Local state
    const [appointment, setAppointment] = useState<CustomerAppointmentDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);

    // Fetch appointment details
    const loadAppointment = useCallback(async () => {
        if (!appointmentId) {
            navigation.goBack();
            return;
        }

        setIsLoading(true);
        try {
            const details = await getAppointmentDetails(appointmentId);
            setAppointment(details);
        } catch (error) {
            console.error('Error fetching appointment:', error);
            Alert.alert(
                translate('Error'),
                translate('Failed to load appointment details')
            );
        } finally {
            setIsLoading(false);
        }
    }, [appointmentId, getAppointmentDetails]);

    // Load data on component mount
    useEffect(() => {
        loadAppointment();
    }, [loadAppointment]);

    // Handle cancellation
    const handleCancelReservation = () => {
        Alert.alert(
            translate('Do you want to cancel your reservation?'),
            translate('Your reservation deposit will be lost'),
            [
                {
                    text: translate('Cancel'),
                    style: 'cancel',
                },
                {
                    text: translate('Cancel reservation'),
                    style: 'destructive',
                    onPress: async () => {
                        setIsCancelling(true);
                        try {
                            await cancelAppointment(appointmentId);
                            loadAppointment(); // Reload to update status
                        } catch (error) {
                            console.error('Error cancelling appointment:', error);
                            Alert.alert(
                                translate('Error'),
                                translate('Failed to cancel appointment')
                            );
                        } finally {
                            setIsCancelling(false);
                        }
                    },
                },
            ],
        );
    };

    // Get status text
    const getStatusText = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.Pending: return translate('Pending approval');
            case AppointmentStatus.Approved: return translate('Approved');
            case AppointmentStatus.Completed: return translate('Completed');
            case AppointmentStatus.Cancelled: return translate('Canceled');
            case AppointmentStatus.NoShow: return translate('No Show');
            default: return '';
        }
    };

    // Get status color
    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.Pending: return theme.colors.pending;
            case AppointmentStatus.Approved: return theme.colors.approved;
            case AppointmentStatus.Completed: return theme.colors.completed;
            case AppointmentStatus.Cancelled: return theme.colors.canceled;
            case AppointmentStatus.NoShow: return theme.colors.gray;
            default: return theme.colors.gray;
        }
    };

    // Format date and time
    const formatTime = (dateString: string) => {
        return DateTime.fromISO(dateString).toFormat('hh:mm a');
    };

    const formatDate = (dateString: string) => {
        return DateTime.fromISO(dateString).toFormat('MMM dd');
    };

    // Render loading state
    if (isLoading || !appointment) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Header
                    backPress={() => navigation.goBack()}
                    Text={translate('Appointment Details')}
                    color="transparent"
                    back={true}
                    navigation={navigation}
                    search={false}
                    more={false}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>Loading appointment details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Determine if it's a home service
    const isHomeService = appointment.isHomeService;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" />

            <Header
                backPress={() => navigation.goBack()}
                Text={translate(isHomeService ? 'Home service' : 'Walk-in service')}
                color="transparent"
                back={true}
                navigation={navigation}
                search={false}
                more={false}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Salon Info */}
                <View style={styles.branchContainer}>
                    <View style={styles.branchLogo}>
                        <ExpoImage
                            source={require('../../../../assets/devura.png')}
                            style={styles.branchLogoImage}
                            contentFit="contain"
                        />
                    </View>

                    <View style={styles.branchInfo}>
                        <Text style={styles.branchName}>{appointment.salonName}</Text>

                        <View style={styles.statusBadgeRow}>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                                <Text style={styles.statusBadgeText}>
                                    {getStatusText(appointment.status)}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }} />
                        </View>
                    </View>
                </View>

                {/* Map (for home service) */}
                {isHomeService && appointment.homeServiceAddress && (
                    <View style={styles.mapContainer}>
                        <View style={styles.mapWrapper}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: 30.0444, // Default to Cairo if no coordinates
                                    longitude: 31.2357,
                                    latitudeDelta: 0.0122,
                                    longitudeDelta: 0.0121,
                                }}
                                scrollEnabled={false}
                                zoomEnabled={false}
                                rotateEnabled={false}
                                pitchEnabled={false}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: 30.0444,
                                        longitude: 31.2357,
                                    }}
                                >
                                    <ExpoImage
                                        source={require('../../../../assets/pin.png')}
                                        style={styles.markerIcon}
                                        contentFit="contain"
                                    />
                                </Marker>
                            </MapView>
                        </View>
                    </View>
                )}

                {/* Address (for home service) */}
                {isHomeService && appointment.homeServiceAddress && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{translate('Address')}</Text>
                        <View style={styles.addressContent}>
                            <Text style={styles.addressName}>{appointment.homeServiceAddress.fullName}</Text>
                            <Text style={styles.addressText}>
                                {`${appointment.homeServiceAddress.streetAddress}, ${appointment.homeServiceAddress.buildingNumber}, ${appointment.homeServiceAddress.city}`}
                            </Text>
                            <Text style={styles.addressText}>{appointment.homeServiceAddress.phoneNumber}</Text>
                        </View>
                    </View>
                )}

                {/* Schedule */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{translate('Schedule')}</Text>
                    <View style={styles.scheduleContent}>
                        <View style={styles.scheduleRow}>
                            <Text style={styles.scheduleLabel}>{translate('Time')}</Text>
                            <Text style={styles.scheduleLabel}>{translate('Date')}</Text>
                        </View>
                        <View style={styles.scheduleRow}>
                            <Text style={styles.scheduleValue}>
                                {formatTime(appointment.appointmentDate)}
                            </Text>
                            <Text style={styles.scheduleValue}>
                                {formatDate(appointment.appointmentDate)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Payment Type */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{translate('Payment type')}</Text>
                    <Text style={styles.paymentMethod}>
                        {appointment.paymentStatus === PaymentStatus.Paid
                            ? 'Paid'
                            : appointment.paymentStatus === PaymentStatus.Unpaid
                                ? 'Unpaid'
                                : 'Upcoming payment'}
                    </Text>
                </View>

                {/* Service */}
                <View style={styles.servicesSection}>
                    <View style={styles.serviceRow}>
                        <Text style={styles.serviceName}>{appointment.serviceName}</Text>
                        <Text style={styles.servicePrice}>
                            {appointment.price}
                            <Text style={styles.currency}> {appointment.currency}</Text>
                        </Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>{translate('Total')}</Text>
                        <Text style={styles.totalPrice}>
                            {appointment.price}
                            <Text style={styles.totalCurrency}> {appointment.currency}</Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Actions */}
            {(appointment.status === AppointmentStatus.Pending ||
                appointment.status === AppointmentStatus.Approved) && (
                    <View style={styles.bottomActions}>
                        <Button
                            mode="outlined"
                            onPress={handleCancelReservation}
                            style={styles.cancelButton}
                            labelStyle={styles.cancelButtonText}
                            loading={isCancelling}
                            disabled={isCancelling}
                        >
                            {translate('Cancel Reservation')}
                        </Button>
                    </View>
                )}

            {appointment.status === AppointmentStatus.Completed && (
                <Button
                    mode="contained"
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        navigation.navigate('Ratings', { appointmentId: appointment.id });
                    }}
                    style={styles.rateButton}
                    labelStyle={styles.rateButtonText}
                >
                    {translate('Rate us')}
                </Button>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: theme.colors.black,
    },
    scrollView: {
        paddingHorizontal: scale(25),
        marginTop: scale(30),
    },
    scrollContent: {
        paddingBottom: scale(100),
    },

    // Branch styles
    branchContainer: {
        flexDirection: 'row',
        paddingBottom: scale(0),
    },
    branchLogo: {
        backgroundColor: theme.colors.grayBackground,
        width: scale(80),
        height: scale(80),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(20),
    },
    branchLogoImage: {
        width: scale(40),
        height: scale(40),
    },
    branchInfo: {
        flexDirection: 'column',
        marginHorizontal: scale(5),
    },
    branchName: {
        color: theme.colors.black,
        fontSize: scale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginHorizontal: scale(10),
        fontWeight: '800',
    },
    statusBadgeRow: {
        flexDirection: 'row',
    },
    statusBadge: {
        padding: scale(5),
        paddingHorizontal: scale(15),
        borderRadius: scale(10),
        marginEnd: scale(10),
        marginTop: scale(10),
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginHorizontal: scale(10),
    },
    statusBadgeText: {
        fontSize: scale(14),
        color: theme.colors.white,
        fontWeight: 'bold',
    },

    // Map styles
    mapContainer: {
        flexDirection: 'column',
        width: '100%',
        borderTopRightRadius: scale(20),
        borderTopLeftRadius: scale(20),
        zIndex: 10,
        marginTop: scale(20),
    },
    mapWrapper: {
        height: scale(160),
        borderRadius: scale(15),
        width: '100%',
        zIndex: 0,
        overflow: 'hidden',
    },
    map: {
        height: scale(160),
        borderRadius: scale(15),
        width: '100%',
    },
    markerIcon: {
        width: scale(30),
        height: scale(30),
    },

    // Section styles
    section: {
        flexDirection: 'row',
        borderBottomColor: theme.colors.line,
        borderBottomWidth: scale(1),
        paddingBottom: scale(20),
        marginTop: scale(20),
    },
    sectionTitle: {
        color: theme.colors.black,
        fontSize: scale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginHorizontal: scale(10),
        fontWeight: '900',
        flex: 1,
    },

    // Address styles
    addressContent: {
        flexDirection: 'column',
        marginTop: scale(7),
    },
    addressName: {
        color: theme.colors.blackText,
        fontSize: scale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginHorizontal: scale(10),
        fontWeight: '800',
    },
    addressText: {
        color: theme.colors.blackText,
        fontSize: scale(15),
        marginTop: scale(5),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginHorizontal: scale(10),
    },

    // Schedule styles
    scheduleContent: {
        flex: 1,
    },
    scheduleRow: {
        flexDirection: 'row',
        marginTop: scale(7),
    },
    scheduleLabel: {
        color: theme.colors.black,
        fontSize: scale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginHorizontal: scale(10),
        fontWeight: '800',
        flex: 1,
    },
    scheduleValue: {
        color: theme.colors.black,
        fontSize: scale(15),
        textAlign: 'left',
        marginHorizontal: scale(10),
        fontWeight: '400',
        flex: 1,
    },

    // Payment styles
    paymentMethod: {
        color: theme.colors.blackText,
        fontSize: scale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginHorizontal: scale(10),
    },

    // Services styles
    servicesSection: {
        flexDirection: 'column',
        paddingBottom: scale(20),
        marginTop: scale(20),
        borderBottomColor: theme.colors.line,
        borderBottomWidth: scale(1),
    },
    serviceRow: {
        flexDirection: 'row',
        marginTop: scale(8),
    },
    serviceName: {
        color: theme.colors.black,
        fontSize: scale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginHorizontal: scale(10),
        fontWeight: '500',
        flex: 1,
    },
    servicePrice: {
        color: theme.colors.black,
        fontSize: scale(15),
        textAlign: 'left',
        marginHorizontal: scale(10),
        fontWeight: '400',
    },
    currency: {
        color: theme.colors.black,
        fontSize: scale(12),
        textAlign: 'left',
        marginHorizontal: scale(10),
    },
    totalRow: {
        flexDirection: 'row',
        marginTop: scale(20),
    },
    totalLabel: {
        color: theme.colors.black,
        fontSize: scale(17),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginHorizontal: scale(10),
        fontWeight: '900',
        flex: 1,
    },
    totalPrice: {
        color: theme.colors.black,
        fontSize: scale(15),
        textAlign: 'left',
        marginHorizontal: scale(10),
        fontWeight: '900',
    },
    totalCurrency: {
        color: theme.colors.black,
        fontSize: scale(17),
        textAlign: 'left',
        marginHorizontal: scale(10),
    },

    // Bottom actions
    bottomActions: {
        backgroundColor: theme.colors.white,
        position: 'absolute',
        width: '90%',
        bottom: 0,
        borderTopColor: theme.colors.line,
        borderTopWidth: scale(1),
        alignSelf: 'center',
    },
    cancelButton: {
        borderColor: theme.colors.primary,
        marginTop: scale(5),
        borderRadius: scale(10),
        borderWidth: scale(0),
        height: scale(45),
        width: '80%',
        backgroundColor: theme.colors.white,
        alignSelf: 'center',
        marginBottom: scale(20),
    },
    cancelButtonText: {
        fontSize: scale(16),
        color: theme.colors.red,
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold',
    },
    rateButton: {
        borderColor: 'transparent',
        borderRadius: scale(10),
        backgroundColor: theme.colors.primary,
        marginTop: scale(20),
        width: '80%',
        alignSelf: 'center',
        bottom: scale(10),
    },
    rateButtonText: {
        fontSize: scale(15),
        color: theme.colors.white,
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold',
    },
});

export default BookingDetails;