// src/screens/Browse/components/UpcomingBookings.tsx
import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../../../core/theme';
import { DateTime } from 'luxon';

interface Booking {
    id: string;
    branch: {
        name: string;
        image: string;
    };
    bookingdDate: string;
    status: '0' | '1' | '2' | '3'; // 0: Pending, 1: Approved, 2: Completed, 3: Canceled
}

interface UpcomingBookingsProps {
    bookings: Booking[];
    onBookingPress: (booking: Booking) => void;
}

const getStatusColor = (status: Booking['status']) => {
    switch (status) {
        case '0': return theme.colors.pending;
        case '1': return theme.colors.approved;
        case '2': return theme.colors.completed;
        case '3': return theme.colors.canceled;
        default: return theme.colors.pending;
    }
};

const getStatusText = (status: Booking['status']) => {
    switch (status) {
        case '0': return 'Pending approval';
        case '1': return 'Approved';
        case '2': return 'Completed';
        case '3': return 'Canceled';
        default: return 'Pending approval';
    }
};

const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({ bookings, onBookingPress }) => {
    if (!bookings || bookings.length === 0) return null;

    const renderBooking = ({ item }: { item: Booking }) => (
        <TouchableOpacity
            style={styles.bookingItem}
            onPress={() => onBookingPress(item)}
        >
            <View style={styles.iconContainer}>
                <Image
                    source={require('../../../../../assets/devura.png')}
                    style={styles.branchIcon}
                    contentFit="contain"
                />
            </View>

            <View style={styles.bookingInfo}>
                <Text style={styles.branchName}>{item.branch.name}</Text>

                <View style={styles.timeRow}>
                    <Text style={styles.label}>Time</Text>
                    <Text style={styles.label}>Date</Text>
                </View>

                <View style={styles.valueRow}>
                    <Text style={styles.value}>
                        {DateTime.fromJSDate(new Date(item.bookingdDate)).toFormat('hh:mm a')}
                    </Text>
                    <Text style={styles.value}>
                        {DateTime.fromJSDate(new Date(item.bookingdDate)).toFormat('MMM dd')}
                    </Text>
                </View>

                <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>
                        {getStatusText(item.status)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Upcoming</Text>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={bookings}
                keyExtractor={(item) => item.id}
                renderItem={renderBooking}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: moderateScale(10),
    },
    title: {
        fontSize: moderateScale(20),
        color: theme.colors.black,
        fontWeight: 'bold',
        paddingHorizontal: moderateScale(20),
    },
    listContent: {
        paddingHorizontal: moderateScale(10),
    },
    bookingItem: {
        flexDirection: 'row',
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(10),
    },
    iconContainer: {
        backgroundColor: theme.colors.grayBackground,
        width: moderateScale(80),
        height: moderateScale(80),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(20),
    },
    branchIcon: {
        width: moderateScale(40),
        height: moderateScale(40),
    },
    bookingInfo: {
        marginLeft: moderateScale(10),
        flex: 1,
    },
    branchName: {
        fontSize: moderateScale(15),
        color: theme.colors.black,
        fontWeight: '800',
    },
    timeRow: {
        flexDirection: 'row',
        marginTop: moderateScale(7),
        justifyContent: 'space-between',
        paddingRight: moderateScale(20),
    },
    valueRow: {
        flexDirection: 'row',
        marginTop: moderateScale(7),
        justifyContent: 'space-between',
        paddingRight: moderateScale(20),
    },
    label: {
        fontSize: moderateScale(15),
        color: theme.colors.black,
        fontWeight: '800',
        flex: 1,
    },
    value: {
        fontSize: moderateScale(15),
        color: theme.colors.black,
        flex: 1,
    },
    statusContainer: {
        paddingVertical: moderateScale(5),
        paddingHorizontal: moderateScale(15),
        borderRadius: moderateScale(10),
        marginTop: moderateScale(10),
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: moderateScale(14),
        color: theme.colors.white,
        fontWeight: 'bold',
    },
});

export default UpcomingBookings;