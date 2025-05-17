import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    I18nManager
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { moderateScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { translate } from '../../../../utils/utils';
import Header from '../childs/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppointments } from '../../../../hooks/useAppointments';
import { triggerHapticFeedback } from '../../../../utils/platform';

// Define theme interface
interface ThemeColors {
    primary: string;
    white: string;
    black: string;
    blackText: string;
    grayText: string;
    grayBackgroundSlots: string;
    disabled: string;
}

// Define theme object (ideally would come from a theme provider)
const theme = {
    colors: {
        primary: '#007BFF',
        white: '#FFFFFF',
        black: '#000000',
        blackText: '#333333',
        grayText: '#888888',
        grayBackgroundSlots: '#F0F0F0',
        disabled: '#CCCCCC',
    },
    sizes: {
        base: 16,
    },
};

// Type definitions
interface TimeSlot {
    num: number;
    time: string;
}

interface BookingSlot {
    formated: string;
    slot: number;
}

interface BookingData {
    bookingDate: Date;
    bookingSlot?: BookingSlot;
    selectedServices?: any[];
    option?: number;
    item?: any;
}

interface OptionSelectDateProps {
    navigation: any;
    route: any;
}

interface MarkedDates {
    [date: string]: {
        selected?: boolean;
        marked?: boolean;
        dotColor?: string;
        selectedColor?: string;
        disableTouchEvent?: boolean;
    };
}

const OptionSelectDate: React.FC = () => {
    // Hooks
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { bookSalonAppointment, bookHomeServiceAppointment, isLoading: isBookingLoading } = useAppointments();

    // States
    const [dateSelected, setDateSelected] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(new Date().getTime() + 86400000)); // +1 day
    const [slotArray, setSlotArray] = useState<number[]>([]);
    const [selected, setSelected] = useState<number | null>(null);
    const [slotSelected, setSlotSelected] = useState<boolean>(false);
    const [bookingData, setBookingData] = useState<BookingData>({
        bookingDate: new Date(),
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Get booking data from navigation
    useEffect(() => {
        if (route.params?.newBookingData) {
            setBookingData({
                ...bookingData,
                ...route.params.newBookingData
            });
        }
    }, [route.params]);

    // Format date for calendar
    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    // Component did mount effect
    useEffect(() => {
        if (!bookingData.bookingDate) {
            manageSlots(new Date());
            setBookingData({
                ...bookingData,
                bookingDate: new Date(),
            });
        } else {
            manageSlots(new Date(bookingData.bookingDate));
        }
    }, []);

    // Utility functions
    const daysInMonth = (month: number): moment.Moment[] => {
        const count = moment().month(month).daysInMonth();
        const days: moment.Moment[] = [];
        for (let i = 1; i < count + 1; i++) {
            if (moment().month(month).date(i).isAfter() || moment().month(month).date(i).isSame())
                days.push(moment().month(month).date(i));
        }
        return days;
    };

    const isToday = (date: Date, now: Date): boolean => {
        const yearDate = date.getFullYear();
        const monthDate = date.getMonth();
        const dayDate = date.getDate();
        const yearNow = now.getFullYear();
        const monthNow = now.getMonth();
        const dayNow = now.getDate();

        return yearDate === yearNow && monthDate === monthNow && dayDate === dayNow;
    };

    const getTime = (num: number): TimeSlot => {
        const tempHour = String(Math.trunc(num / 60));
        const hour = tempHour.length === 1 ? "0" + tempHour : tempHour;
        const min = num % 60 === 0 ? "00" : String(num % 60);
        return { num, time: hour + ":" + min };
    };

    const tConv24 = (time: string): string => {
        const timeParts = time.split(":");
        let ampm = 'AM';
        let hour = parseInt(timeParts[0]);

        if (hour >= 12) {
            ampm = 'PM';
        }

        hour = hour > 12 ? hour - 12 : hour;
        return `${hour}:${timeParts[1]} ${ampm}`;
    };

    const getTimeSlots = (
        blockTimes: number[][],
        showTimeAsString: boolean,
        interval: string,
        includeStartBlockedTime?: boolean,
        includeEndBlockedTime?: boolean
    ): any => {
        let times = 1, sums = 60;
        includeStartBlockedTime = includeStartBlockedTime === true;
        includeEndBlockedTime = includeEndBlockedTime === true;

        switch (interval) {
            case "tenth":
                times = 6;
                sums = 10;
                break;
            case "quarter":
                times = 4;
                sums = 15;
                break;
            case "half":
                times = 2;
                sums = 30;
                break;
            case "one":
                times = 1;
                sums = 60;
                break;
            case "two":
                times = 1 / 2;
                sums = 120;
                break;
            case "three":
                times = 1 / 3;
                sums = 180;
                break;
            case "four":
                times = 1 / 4;
                sums = 240;
                break;
            default:
                times = 1;
                sums = 60;
                break;
        }

        let start = 0;
        let dateTimes = Array(Math.round(24 * times))
            .fill(0)
            .map(() => {
                start = start + sums;
                return start;
            });

        blockTimes = Array.isArray(blockTimes) && blockTimes.length > 0 ? blockTimes : [];

        if (blockTimes.length > 0) {
            dateTimes = blockTimes.reduce((acc, x) => {
                return acc
                    .filter(y => includeStartBlockedTime ? y <= x[0] : y < x[0])
                    .concat(
                        acc.filter(y => includeEndBlockedTime ? y >= x[1] : y > x[1])
                    );
            }, dateTimes);
        }

        if (showTimeAsString === true) {
            return dateTimes
                .map(num => {
                    const tempHour = String(Math.trunc(num / 60));
                    const hour = tempHour.length === 1 ? "0" + tempHour : tempHour;
                    const min = num % 60 === 0 ? "00" : String(num % 60);
                    return { num: num, time: hour + ":" + min };
                })
                .reduce((accc: Record<string, string>, element) => {
                    accc["" + element.num] = element.time;
                    return accc;
                }, {});
        }

        return dateTimes;
    };

    const manageSlots = useCallback((date: Date) => {
        const businessHours = getBusinessHoursForDay(date);

        // If business is closed that day, show no slots
        if (!businessHours || !businessHours.isOpen) {
            setSlotArray([]);
            return;
        }

        // If business is open 24 hours
        if (businessHours.is24Hours) {
            let tempArray = getTimeSlots([[0, 0]], false, "one");

            // If today, filter out past hours
            if (isToday(date, new Date())) {
                tempArray = tempArray.filter(slot => {
                    const hours = Number(getTime(slot).time.split(':')[0]);
                    return hours > new Date().getHours();
                });
            }

            setSlotArray(tempArray);
            return;
        }

        // If business has specific hours
        if (businessHours.openTime && businessHours.closeTime) {
            // Convert open/close times to minutes since midnight
            const openMinutes = timeStringToMinutes(businessHours.openTime);
            const closeMinutes = timeStringToMinutes(businessHours.closeTime);

            // Block times before opening and after closing
            const blockedTimes = [
                [0, openMinutes],
                [closeMinutes, 24 * 60]
            ];

            let tempArray = getTimeSlots(blockedTimes, false, "one");

            // If today, also filter out past hours
            if (isToday(date, new Date())) {
                const currentHourInMinutes = new Date().getHours() * 60 + new Date().getMinutes();
                tempArray = tempArray.filter(slot => slot > currentHourInMinutes);
            }

            setSlotArray(tempArray);
        } else {
            // Fallback if we don't have proper business hours
            setSlotArray([]);
        }
    }, [bookingData]);

    // Helper function to convert time string (e.g. "9:30 AM") to minutes since midnight
    const timeStringToMinutes = (timeString: string) => {
        // You'll need to implement this based on your time string format
        // Example implementation:
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    };


    const getBusinessHoursForDay = (date: Date) => {
        if (!bookingData.item || !bookingData.item.businessHours) {
            return null;
        }

        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        return bookingData.item.businessHours.find(h => h.dayOfWeek === dayOfWeek);
    };
    // Navigate to Bookings and clear the navigation stack
    const navigateToBookings = async () => {
        await triggerHapticFeedback();

        // Navigate to root stack and reset history
        navigation.reset({
            index: 0,
            routes: [{ name: 'home' }],
        });

        // Then navigate to the Bookings tab
        setTimeout(() => {
            navigation.navigate('Bookings');
        }, 100);
    };

    // Handle booking appointment
    const handleBookAppointment = async () => {
        if (!slotSelected || !bookingData.bookingSlot) {
            Alert.alert('Error', 'Please select a time slot');
            return;
        }

        try {
            setIsLoading(true);

            // Format date and time for API
            const selectedDateTime = new Date(bookingData.bookingDate);
            const timeSlot = bookingData.bookingSlot.slot;
            const hours = Math.floor(timeSlot / 60);
            const minutes = timeSlot % 60;

            selectedDateTime.setHours(hours, minutes, 0, 0);
            const appointmentDate = selectedDateTime.toISOString();

            // Get selected service info from booking data
            const selectedService = bookingData.selectedServices && bookingData.selectedServices.length > 0
                ? bookingData.selectedServices[0]
                : null;

            if (!selectedService || !bookingData.item) {
                Alert.alert('Error', 'Service information is missing');
                setIsLoading(false);
                return;
            }

            const serviceId = selectedService.id;
            const pricingOptionId = selectedService.SubServiceSelected
                ? selectedService.SubServiceSelected.id
                : null;

            if (!pricingOptionId) {
                Alert.alert('Error', 'Please select a service option');
                setIsLoading(false);
                return;
            }

            const businessId = bookingData.item.id;

            // Determine if it's a home service or salon appointment
            const isHomeService = bookingData.option === 1;

            let result;
            if (isHomeService) {
                // Book home service appointment
                result = await bookHomeServiceAppointment({
                    businessId,
                    serviceId,
                    pricingOptionId,
                    appointmentDate,
                    customerAddressId: 1, // Use default address ID 1 as specified
                    notes: "Booked through mobile app"
                });
            } else {
                // Book salon appointment
                result = await bookSalonAppointment({
                    businessId,
                    serviceId,
                    pricingOptionId,
                    appointmentDate,
                    notes: "Booked through mobile app"
                });
            }

            setIsLoading(false);

            if (result) {
                // Show success message
                Alert.alert(
                    'Success',
                    'Your appointment has been successfully booked!',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigateToBookings()
                        }
                    ]
                );
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Booking error:', error);
            Alert.alert('Error', 'Failed to book appointment. Please try again.');
        }
    };

    // Render time slot item
    const renderTimeSlot = (item: number, index: number) => {
        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    setBookingData({
                        ...bookingData,
                        bookingSlot: {
                            formated: tConv24(getTime(item).time),
                            slot: item
                        }
                    });
                    setSelected(index);
                    setSlotSelected(true);
                }}
                style={[
                    styles.slotButton,
                    {
                        backgroundColor: selected === index
                            ? theme.colors.primary
                            : theme.colors.grayBackgroundSlots,
                    }
                ]}
            >
                <Text
                    style={[
                        styles.slotButtonText,
                        {
                            color: selected === index
                                ? theme.colors.white
                                : theme.colors.black,
                        }
                    ]}
                >
                    {tConv24(getTime(item).time)}
                </Text>
            </TouchableOpacity>
        );
    };

    // Prepare the marked dates for calendar
    const markedDates: MarkedDates = {
        [formatDate(selectedDate)]: {
            selected: true,
            disableTouchEvent: false,
            selectedColor: theme.colors.primary,
        },
        [formatDate(new Date())]: {
            selected: formatDate(selectedDate) === formatDate(new Date()),
            disableTouchEvent: false,
            selectedColor: formatDate(selectedDate) === formatDate(new Date()) ? theme.colors.primary : undefined,
            marked: formatDate(selectedDate) !== formatDate(new Date()),
            dotColor: theme.colors.primary
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.white }]}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" />

            <Header
                backPress={() => navigation.pop()}
                Text={translate('')}
                color={'transparent'}
                back={true}
                navigation={navigation}
                search={false}
            />

            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                    {translate('Book appointment')}
                </Text>
            </View>

            <View style={styles.calendarContainer}>
                <Calendar
                    onDayPress={(day: { timestamp: number }) => {
                        const newSelectedDate = new Date(day.timestamp);
                        setSlotArray([]);
                        setDateSelected(true);
                        setSelectedDate(newSelectedDate);
                        setBookingData({
                            ...bookingData,
                            bookingDate: newSelectedDate
                        });
                        manageSlots(newSelectedDate);
                    }}
                    minDate={formatDate(new Date())}
                    markedDates={markedDates}
                    enableSwipeMonths={true}
                    theme={{
                        calendarBackground: theme.colors.white,
                        textSectionTitleColor: theme.colors.grayText,
                        selectedDayBackgroundColor: theme.colors.primary,
                        selectedDayTextColor: theme.colors.white,
                        todayTextColor: theme.colors.black,
                        dayTextColor: theme.colors.blackText,
                        textDisabledColor: '#d9e1e8',
                        dotColor: theme.colors.primary,
                        selectedDotColor: theme.colors.white,
                        arrowColor: theme.colors.primary,
                        monthTextColor: theme.colors.blackText,
                        textDayFontSize: moderateScale(14),
                        textMonthFontSize: moderateScale(25),
                        textDayHeaderFontSize: moderateScale(13),
                    }}
                />
            </View>

            {dateSelected && (
                <View style={styles.slotsOverlay}>
                    <TouchableOpacity
                        onPress={() => setDateSelected(false)}
                        style={[styles.overlayTouchable, { backgroundColor: `${theme.colors.black}20` }]}
                    />

                    <View style={styles.slotsContainer}>
                        <Text style={styles.slotsTitle}>
                            {'Available slots'}
                        </Text>

                        <View style={styles.slotsListContainer}>
                            {slotArray.length !== 0 ? (
                                <FlatList
                                    numColumns={3}
                                    showsHorizontalScrollIndicator={false}
                                    data={slotArray}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={({ item, index }) => renderTimeSlot(item, index)}
                                />
                            ) : (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color={theme.colors.primary} />
                                </View>
                            )}
                        </View>

                        <Button
                            mode="contained"
                            disabled={!slotSelected || isLoading}
                            style={[
                                styles.nextButton,
                                {
                                    backgroundColor: slotSelected && !isLoading
                                        ? theme.colors.primary
                                        : theme.colors.disabled
                                }
                            ]}
                            contentStyle={{ height: moderateScale(45) }}
                            labelStyle={styles.nextButtonLabel}
                            loading={isLoading}
                            onPress={handleBookAppointment}
                        >
                            {isLoading ? 'Booking...' : 'Book Appointment'}
                        </Button>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    titleContainer: {
        alignContent: 'center',
        width: '100%',
        padding: moderateScale(25),
        paddingBottom: moderateScale(0)
    },
    titleText: {
        fontSize: moderateScale(30),
        marginTop: moderateScale(0),
        fontWeight: 'bold',
        color: theme.colors.blackText,
    },
    calendarContainer: {
        paddingHorizontal: moderateScale(25),
        marginTop: moderateScale(15)
    },
    slotsOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    overlayTouchable: {
        flex: 1,
    },
    slotsContainer: {
        bottom: moderateScale(0),
        position: 'absolute',
        backgroundColor: theme.colors.white,
        width: '100%',
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 1.0,
        shadowColor: '#E5E5E5',
        elevation: 4,
        paddingHorizontal: moderateScale(20),
        borderTopLeftRadius: moderateScale(20),
        borderTopRightRadius: moderateScale(20)
    },
    slotsTitle: {
        color: theme.colors.black,
        fontSize: moderateScale(20),
        textAlign: 'left',
        textTransform: 'capitalize',
        flex: 1,
        fontWeight: 'bold',
        marginTop: moderateScale(20)
    },
    slotsListContainer: {
        flexDirection: 'row',
        marginTop: moderateScale(15)
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    slotButton: {
        padding: moderateScale(5),
        paddingHorizontal: moderateScale(15),
        borderRadius: moderateScale(17),
        marginEnd: moderateScale(10),
        marginTop: moderateScale(5)
    },
    slotButtonText: {
        fontSize: moderateScale(15),
        fontWeight: '800',
    },
    nextButton: {
        marginTop: moderateScale(35),
        borderRadius: moderateScale(10),
        width: '90%',
        alignSelf: 'center',
        marginBottom: moderateScale(40)
    },
    nextButtonLabel: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: theme.colors.white,
    }
});

export default OptionSelectDate;