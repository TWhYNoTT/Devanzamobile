import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    DeviceEventEmitter,
    Platform,
    RefreshControl,
    Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Image as ExpoImage } from 'expo-image';
import { Button } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import moment from "moment";
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

// Retain existing utilities and components
import { Text } from '../../../components/widget';
import { theme } from '../../../core/theme';
import { showDanger, translate } from '../../../utils/utils';
import { FONT_FAMILY } from '../../../services/config';
import Loader from '../../../components/loader';

// Import the useAppointments hook
import { useAppointments } from '../../../hooks/useAppointments';
import {
    CustomerAppointmentDto,
    AppointmentStatus
} from '../../../types/api.types';

interface AppointmentsProps {
    navigation: any;
}

const AppointmentsScreen: React.FC<AppointmentsProps> = ({ navigation }) => {
    // States for UI
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selected, setSelected] = useState(0); // 0 = Upcoming, 1 = History
    const [isLoadingTab, setIsLoadingTab] = useState(false); // Track tab switching loading state

    // Get query client for manual invalidation
    const queryClient = useQueryClient();

    // Use the useAppointments hook to fetch real data
    const {
        appointments,
        isLoading,
        cancelAppointment
    } = useAppointments();

    // Function to manually refetch data
    const refetchData = useCallback(() => {
        // Set loading state
        setIsLoadingTab(true);

        // Invalidate and refetch appointments
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        queryClient.invalidateQueries({ queryKey: ['upcomingAppointments'] });
        queryClient.invalidateQueries({ queryKey: ['appointmentHistory'] });

        // Reset loading state after a delay to ensure loader is visible
        setTimeout(() => {
            setIsLoadingTab(false);
        }, 1000);
    }, [queryClient]);

    // Refetch when screen comes into focus (tab navigation)
    useFocusEffect(
        useCallback(() => {
            refetchData();
            return () => { };
        }, [refetchData])
    );

    // Listen for booking refresh events
    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener(
            'bookingRefreash',
            refetchData
        );
        return () => subscription.remove();
    }, [refetchData]);

    // Filter appointments into upcoming and past
    const upcomingAppointments = React.useMemo(() => {
        if (!appointments || !appointments.appointments) return [];

        const now = new Date();

        // Filter for upcoming: appointments that are Pending/Approved AND in the future
        const upcoming = appointments.appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.appointmentDate);

            return (appointment.status === AppointmentStatus.Pending ||
                appointment.status === AppointmentStatus.Approved) &&
                appointmentDate >= now;
        });

        // Sort by date (earliest first)
        return upcoming.sort((a, b) =>
            new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
        );
    }, [appointments]);

    const pastAppointments = React.useMemo(() => {
        if (!appointments || !appointments.appointments) return [];

        const now = new Date();

        // History includes:
        // 1. All completed/cancelled/no-show appointments
        // 2. Any pending/approved appointments that are in the past
        const history = appointments.appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.appointmentDate);

            // Include in history if:
            // - It's completed/cancelled/no-show OR
            // - It's pending/approved but the date is in the past
            return (appointment.status === AppointmentStatus.Completed ||
                appointment.status === AppointmentStatus.Cancelled ||
                appointment.status === AppointmentStatus.NoShow) ||
                ((appointment.status === AppointmentStatus.Pending ||
                    appointment.status === AppointmentStatus.Approved) &&
                    appointmentDate < now);
        });

        // Sort by date (newest first)
        return history.sort((a, b) =>
            new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
        );
    }, [appointments]);

    // Function to handle refresh when pulling down
    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        // Explicitly refetch data
        refetchData();
        // Reset refreshing state after a short delay
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    }, [refetchData]);

    // Get status color based on appointment status
    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.Pending: return theme.colors.pending;
            case AppointmentStatus.Approved: return theme.colors.approved;
            case AppointmentStatus.Completed: return theme.colors.completed;
            case AppointmentStatus.Cancelled: return theme.colors.canceled;
            case AppointmentStatus.NoShow: return theme.colors.canceled;
            default: return theme.colors.pending;
        }
    };

    // Format status text based on appointment status
    const getStatusText = (statusString: string) => {
        return statusString || translate('Unknown');
    };

    // Handle appointment cancellation
    const handleCancelAppointment = (appointmentId: number) => {
        Alert.alert(
            translate('Cancel Appointment'),
            translate('Are you sure you want to cancel this appointment?'),
            [
                { text: translate('No'), style: 'cancel' },
                {
                    text: translate('Yes'),
                    onPress: async () => {
                        try {
                            await cancelAppointment(appointmentId);
                            showDanger(translate('Appointment cancelled successfully'));
                            // Manually refetch data after cancellation
                            refetchData();
                        } catch (error) {
                            console.error('Error cancelling appointment:', error);
                            showDanger(translate('Failed to cancel appointment'));
                        }
                    }
                }
            ]
        );
    };

    // Render appointment item
    const renderAppointment = ({ item }: { item: CustomerAppointmentDto }) => {
        // Check if the appointment date is in the past
        const appointmentDate = new Date(item.appointmentDate);
        const now = new Date();
        const isPastDate = appointmentDate < now;

        return (
            <TouchableOpacity
                style={styles.listingContainer}
                onPress={() => {
                    Haptics.selectionAsync();
                    navigation.navigate('BookingDetails', { appointmentId: item.id });
                }}
            >
                <View style={styles.listingRow}>
                    <View style={styles.imageContainer}>
                        <ExpoImage
                            source={require('../../../assets/devura.png')}
                            style={styles.brandImage}
                            contentFit="contain"
                            transition={200}
                        />
                    </View>

                    <View style={styles.detailsContainer}>
                        <Text style={styles.salonName}>{item.salonName}</Text>

                        <View style={styles.timeRow}>
                            <Text style={styles.timeLabel}>{translate('Service')}</Text>
                            <Text style={styles.timeLabel}>{translate('Date')}</Text>
                        </View>

                        <View style={styles.timeRow}>
                            <Text style={styles.timeValue} numberOfLines={1} ellipsizeMode="tail">
                                {item.serviceName}
                            </Text>
                            <Text style={[
                                styles.timeValue,
                                isPastDate && selected === 0 ? styles.pastDate : null
                            ]}>
                                {moment(item.appointmentDate).format('MMMM DD')}
                            </Text>
                        </View>

                        <View style={styles.timeRow}>
                            <Text style={styles.timeLabel}>{translate('Price')}</Text>
                            <Text style={styles.timeLabel}>{translate('Duration')}</Text>
                        </View>

                        <View style={styles.timeRow}>
                            <Text style={styles.timeValue}>
                                {item.price} AED
                            </Text>
                            <Text style={styles.timeValue}>
                                {item.duration}
                            </Text>
                        </View>

                        <View style={styles.statusContainer}>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(item.status) }
                            ]}>
                                <Text style={styles.statusText}>
                                    {getStatusText(item.statusString)}
                                </Text>
                            </View>

                            {(item.status === AppointmentStatus.Pending ||
                                item.status === AppointmentStatus.Approved) &&
                                !isPastDate && (
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => handleCancelAppointment(item.id)}
                                    >
                                        <Text style={styles.cancelText}>{translate('Cancel')}</Text>
                                    </TouchableOpacity>
                                )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // Render the empty state when no appointments are found
    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <ExpoImage
                source={require('../../../assets/noappointment.png')}
                style={styles.emptyStateImage}
                contentFit="contain"
                transition={300}
            />
            <Text style={[styles.emptyStateTitle, { fontWeight: 'bold' }]}>
                {translate('No appointments')}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
                {translate('Start discovering Salons to book')}.
            </Text>
            <Button
                mode="contained"
                onPress={() => {
                    Haptics.selectionAsync();
                    navigation.navigate('Browse');
                }}
                style={styles.searchButton}
                labelStyle={styles.searchButtonText}
            >
                {translate('Search')}
            </Button>
        </View>
    );

    // Determine if we have upcoming and history data to show
    const hasUpcoming = upcomingAppointments && upcomingAppointments.length > 0;
    const hasHistory = pastAppointments && pastAppointments.length > 0;

    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaView style={styles.container}>
                <StatusBar style="dark" />

                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { fontWeight: 'bold' }]}>
                        {translate('Appointments')}
                    </Text>
                </View>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            if (selected === 0) return; // Already on this tab
                            Haptics.selectionAsync();
                            setSelected(0);
                            // Set loading when switching tabs
                            setIsLoadingTab(true);
                            setTimeout(() => setIsLoadingTab(false), 1000);
                        }}
                        style={[styles.tab, selected === 0 && styles.selectedTab]}
                    >
                        <Text style={[styles.tabText, selected === 0 ? styles.selectedTabText : {}]}>
                            {translate('Upcoming')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            if (selected === 1) return; // Already on this tab
                            Haptics.selectionAsync();
                            setSelected(1);
                            // Set loading when switching tabs
                            setIsLoadingTab(true);
                            setTimeout(() => setIsLoadingTab(false), 1000);
                        }}
                        style={[styles.tab, selected === 1 && styles.selectedTab]}
                    >
                        <Text style={[styles.tabText, selected === 1 ? styles.selectedTabText : {}]}>
                            {translate('History')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Show loader if any loading state is active */}
                {(isLoading || isLoadingTab) && <Loader isLoading={true} />}

                {selected === 0 ? (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[
                            styles.listContainer,
                            !hasUpcoming && !isLoading && !isLoadingTab && { flex: 1, justifyContent: 'center' }
                        ]}
                        data={upcomingAppointments}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderAppointment}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={handleRefresh}
                                colors={[theme.colors.primary]}
                            />
                        }
                        ListEmptyComponent={!isLoading && !isLoadingTab ? renderEmptyState : null}
                    />
                ) : (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[
                            styles.listContainer,
                            !hasHistory && !isLoading && !isLoadingTab && { flex: 1, justifyContent: 'center' }
                        ]}
                        data={pastAppointments}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderAppointment}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={handleRefresh}
                                colors={[theme.colors.primary]}
                            />
                        }
                        ListEmptyComponent={!isLoading && !isLoadingTab ? renderEmptyState : null}
                    />
                )}
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.white,
        flex: 1,
    },
    header: {
        width: '100%',
        padding: moderateScale(25),
        paddingBottom: moderateScale(0),
    },
    headerTitle: {
        fontSize: moderateScale(30),
        marginTop: moderateScale(20),
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: moderateScale(20),
        marginTop: moderateScale(20),
        marginBottom: moderateScale(10),
    },
    tab: {
        padding: moderateScale(5),
        paddingHorizontal: moderateScale(15),
        borderRadius: moderateScale(10),
        marginEnd: moderateScale(10),
        backgroundColor: theme.colors.primarylight,
    },
    selectedTab: {
        backgroundColor: theme.colors.primary,
    },
    tabText: {
        fontSize: moderateScale(15),
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    selectedTabText: {
        color: theme.colors.white,
    },
    listContainer: {
        paddingBottom: moderateScale(100),
    },
    listingContainer: {
        width: '100%',
        marginVertical: moderateScale(10),
        paddingHorizontal: moderateScale(20),
    },
    listingRow: {
        flexDirection: 'row',
        paddingBottom: moderateScale(20),
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.line,
    },
    imageContainer: {
        backgroundColor: theme.colors.grayBackground,
        width: moderateScale(80),
        height: moderateScale(80),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(20),
    },
    brandImage: {
        width: moderateScale(40),
        height: moderateScale(40),
    },
    detailsContainer: {
        flexDirection: 'column',
        flex: 1,
        marginLeft: moderateScale(10),
    },
    salonName: {
        color: theme.colors.black,
        fontSize: moderateScale(15),
        fontWeight: '800',
        textTransform: 'capitalize',
    },
    timeRow: {
        flexDirection: 'row',
        marginTop: moderateScale(7),
        justifyContent: 'space-between',
    },
    timeLabel: {
        flex: 1,
        color: theme.colors.black,
        fontSize: moderateScale(15),
        fontWeight: '800',
    },
    timeValue: {
        flex: 1,
        color: theme.colors.black,
        fontSize: moderateScale(15),
        fontWeight: '400',
    },
    pastDate: {
        color: theme.colors.canceled,
    },
    statusContainer: {
        flexDirection: 'row',
        marginTop: moderateScale(10),
        alignItems: 'center',
    },
    statusBadge: {
        paddingVertical: moderateScale(5),
        paddingHorizontal: moderateScale(15),
        borderRadius: moderateScale(10),
        alignItems: 'center',
    },
    statusText: {
        fontSize: moderateScale(14),
        color: theme.colors.white,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginLeft: moderateScale(10),
        paddingVertical: moderateScale(5),
        paddingHorizontal: moderateScale(15),
    },
    cancelText: {
        color: theme.colors.canceled,
        fontSize: moderateScale(14),
        fontWeight: 'bold',
    },
    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: moderateScale(30),
    },
    emptyStateImage: {
        height: moderateScale(110),
        width: moderateScale(150),
        marginVertical: moderateScale(10),
    },
    emptyStateTitle: {
        color: theme.colors.black,
        fontSize: moderateScale(25),
        textAlign: 'center',
        marginTop: moderateScale(20),
    },
    emptyStateSubtitle: {
        color: theme.colors.grayText,
        fontSize: moderateScale(15),
        textAlign: 'center',
        marginTop: moderateScale(10),
    },
    searchButton: {
        marginTop: moderateScale(20),
        width: '60%',
        borderRadius: moderateScale(10),
        backgroundColor: theme.colors.primary,
    },
    searchButtonText: {
        fontSize: moderateScale(15),
        color: theme.colors.white,
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold',
    }
});

export default AppointmentsScreen;