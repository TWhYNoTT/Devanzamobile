// src/screens/home/bottoms/browse.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Platform,
    Dimensions,
    ScrollView,
    Animated,
} from 'react-native';
import { Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, moderateScale } from 'react-native-size-matters';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import { DateTime } from 'luxon';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView, FlatList } from 'react-native-gesture-handler';
import { Image as ExpoImage } from 'expo-image';
import { useWindowDimensions } from 'react-native';
import Animated2 from 'react-native-reanimated';

import { theme } from '../../../core/theme';
import { Text } from '../../../components/widget';
import { FONT_FAMILY } from '../../../services/config';
import { showDanger, translate } from '../../../utils/utils';
import Notifications from '../bottoms/childs/Notifications';
import SearchView from "../bottoms/pages/browse/search/search";

// Types
interface LocationGeometry {
    lat: number;
    lng: number;
}

interface LocationData {
    geometry: LocationGeometry;
    location: string;
}

interface Category {
    _id: string;
    name: string;
    image: string;
}

interface Branch {
    _id: string;
    name: string;
    location: string;
    type: string;
    rating: number;
}

interface Booking {
    _id: string;
    branch: {
        name: string;
    };
    bookingdDate: string;
    status: '0' | '1' | '2' | '3';
}

interface BrowseProps {
    navigation: any;
}

// Constants
const HEADER_MAX_HEIGHT = moderateScale(340);
const HEADER_MIN_HEIGHT = moderateScale(150);
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const MOCK_BRANCHES: Branch[] = [
    {
        _id: '1',
        name: 'Pastels Salon Ritz Carlton JBR',
        location: 'The Ritz Carlton hotel - Dubai',
        type: 'Beauty salon. Men only',
        rating: 4.1
    },
    {
        _id: '2',
        name: 'Elite Beauty Lounge',
        location: 'Dubai Marina',
        type: 'Spa & Beauty',
        rating: 4.5
    }
];

export const Browse: React.FC<BrowseProps> = ({ navigation }) => {
    const { width: windowWidth } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    // State
    const [selectedLocation, setSelectedLocation] = useState<LocationData>({
        geometry: { lat: 25.2048, lng: 55.2708 },
        location: 'Dubai, United Arab Emirates'
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [notification, setNotification] = useState(false);
    const [unread, setUnread] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
    const [bookings, setBookings] = useState<Booking[]>([]);

    // Refs and Animated Values
    const scrollY = useRef(new Animated.Value(0)).current;
    const searchRef = useRef<BottomSheet>(null);
    const scrollViewRef = useRef<Animated2.ScrollView>(null);

    // Animation interpolations
    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp'
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp'
    });

    useEffect(() => {
        initializeComponent();
    }, []);

    const initializeComponent = async () => {
        setIsLoading(true);
        try {
            await requestLocationPermission();
            await loadMockData();
            await getNotifications();
        } catch (error) {
            console.error('Initialize error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMockData = async () => {
        // Simulate API call
        const mockCategories = [
            { _id: '1', name: 'Hair Salon', image: require('../../../assets/dummy1.png') },
            { _id: '2', name: 'Spa', image: require('../../../assets/dummy1.png') }
        ];
        setCategories(mockCategories);

        const mockBookings = [
            {
                _id: '1',
                branch: { name: 'Luxury Spa' },
                bookingdDate: DateTime.now().plus({ days: 2 }).toISO(),
                status: '1' as const
            }
        ];
        setBookings(mockBookings);
    };

    const requestLocationPermission = async () => {
        try {
            setLocationLoading(true);
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                const addresses = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });

                if (addresses[0]) {
                    const address = addresses[0];
                    setSelectedLocation({
                        geometry: {
                            lat: location.coords.latitude,
                            lng: location.coords.longitude,
                        },
                        location: `${address.city || ''}, ${address.country || ''}`
                    });
                }
            } else {
                setLocationPermissionDenied(true);
            }
        } catch (error) {
            console.error('Location error:', error);
            showDanger(translate('Unable to access location'));
        } finally {
            setLocationLoading(false);
        }
    };

    const getNotifications = async () => {
        // Simulate API call
        setUnread(3);
    };

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
    );

    const handleCategoryPress = useCallback((item: Category) => {
        Haptics.selectionAsync();
        navigation.navigate('categoriesDetails', { item });
    }, [navigation]);

    const handleBranchPress = useCallback((item: Branch) => {
        Haptics.selectionAsync();
        navigation.navigate('branchDetails', { item });
    }, [navigation]);

    const handleLocationChange = useCallback(() => {
        Haptics.selectionAsync();
        navigation.navigate('LocationPicker');
    }, [navigation]);

    const renderHeader = useCallback(() => (
        <Animated.View style={[styles.header, { height: headerHeight }]}>
            <Animated.View style={[styles.headerBackground, { opacity: headerOpacity }]}>
                <ExpoImage
                    source={require('../../../assets/home-background.png')}
                    style={styles.headerBackgroundImage}
                    contentFit="cover"
                />
                <BlurView intensity={20} style={styles.headerOverlay} />
            </Animated.View>

            <View style={[styles.headerContent, { paddingTop: insets.top + moderateScale(10) }]}>
                <ExpoImage
                    source={require('../../../assets/logo-with-name.png')}
                    style={styles.headerLogo}
                    contentFit="contain"
                />
                <TouchableOpacity
                    style={styles.notificationButton}
                    onPress={() => {
                        Haptics.selectionAsync();
                        setNotification(true);
                    }}
                >
                    <ExpoImage
                        source={require('../../../assets/bell.png')}
                        style={styles.notificationIcon}
                        contentFit="contain"
                    />
                    {unread > 0 && <View style={styles.notificationBadge} />}
                </TouchableOpacity>
            </View>

            <View style={styles.headerTitleContainer}>
                <Text bold style={styles.headerTitle}>
                    {translate('Discover salons near you')}
                </Text>

                <View style={styles.locationContainer}>
                    <Text numberOfLines={1} style={styles.locationText}>
                        {selectedLocation.location}
                    </Text>
                    <TouchableOpacity onPress={handleLocationChange}>
                        <Text style={styles.changeLocationText}>
                            {translate('Change')}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => {
                        Haptics.selectionAsync();
                        searchRef.current?.expand();
                    }}
                >
                    <ExpoImage
                        source={require('../../../assets/search.png')}
                        style={styles.searchIcon}
                        contentFit="contain"
                    />
                    <Text style={styles.searchText}>{translate('Search')}</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    ), [headerHeight, headerOpacity, unread, selectedLocation.location, insets.top]);

    const renderCategory = useCallback(({ item }: { item: Category }) => (
        <TouchableOpacity
            onPress={() => handleCategoryPress(item)}
            style={styles.categoryItem}
        >
            <Text bold style={styles.categoryName}>{item.name}</Text>
            <View style={styles.categoryImageContainer}>
                <ExpoImage
                    source={item.image}
                    style={styles.categoryImage}
                    contentFit="cover"
                />
                <BlurView intensity={20} style={styles.categoryOverlay} />
            </View>
        </TouchableOpacity>
    ), [handleCategoryPress]);

    const renderBranch = useCallback(({ item }: { item: Branch }) => (
        <TouchableOpacity
            style={styles.branchItem}
            onPress={() => handleBranchPress(item)}
        >
            <View style={styles.branchImageContainer}>
                <ExpoImage
                    source={require('../../../assets/dummy1.png')}
                    style={styles.branchImage}
                    contentFit="cover"
                />
                <TouchableOpacity
                    style={styles.likeButton}
                    onPress={() => Haptics.selectionAsync()}
                >
                    <ExpoImage
                        source={require('../../../assets/like.png')}
                        style={styles.likeIcon}
                        contentFit="contain"
                        tintColor={theme.colors.white}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.branchInfo}>
                <Text bold style={styles.branchName}>{item.name}</Text>
                <View style={styles.branchDetails}>
                    <Text style={styles.branchType}>{item.type}</Text>
                    <View style={styles.ratingContainer}>
                        <ExpoImage
                            source={require('../../../assets/star.png')}
                            style={styles.starIcon}
                            contentFit="contain"
                        />
                        <Text style={styles.rating}>{item.rating}</Text>
                    </View>
                </View>
                <Text style={styles.branchLocation}>{item.location}</Text>
            </View>
        </TouchableOpacity>
    ), [handleBranchPress]);

    const renderBooking = useCallback(({ item }: { item: Booking }) => (
        <TouchableOpacity
            style={styles.bookingItem}
            onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('BookingDetails', { item });
            }}
        >
            <View style={styles.bookingImageContainer}>
                <ExpoImage
                    source={require('../../../assets/devura.png')}
                    style={styles.bookingImage}
                    contentFit="contain"
                />
            </View>
            <View style={styles.bookingInfo}>
                <Text bold style={styles.bookingName}>{item.branch.name}</Text>
                <View style={styles.bookingDetails}>
                    <View style={styles.bookingTime}>
                        <Text style={styles.bookingLabel}>{translate('Time')}</Text>
                        <Text style={styles.bookingValue}>
                            {DateTime.fromISO(item.bookingdDate).toFormat('hh:mm a')}
                        </Text>
                    </View>
                    <View style={styles.bookingDate}>
                        <Text style={styles.bookingLabel}>{translate('Date')}</Text>
                        <Text style={styles.bookingValue}>
                            {DateTime.fromISO(item.bookingdDate).toFormat('MMM dd')}
                        </Text>
                    </View>
                </View>
                <View style={[
                    styles.bookingStatus,
                    { backgroundColor: getStatusColor(item.status) }
                ]}>
                    <Text style={styles.bookingStatusText}>
                        {getStatusText(item.status)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    ), [navigation]);

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case '0': return theme.colors.pending;
            case '1': return theme.colors.approved;
            case '2': return theme.colors.completed;
            case '3': return theme.colors.canceled;
            default: return theme.colors.gray;
        }
    };

    const getStatusText = (status: Booking['status']) => {
        switch (status) {
            case '0': return translate('Pending approval');
            case '1': return translate('Approved');
            case '2': return translate('Completed');
            case '3': return translate('Canceled');
            default: return '';
        }
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar style="light" />

            {renderHeader()}

            <Animated2.ScrollView
                ref={scrollViewRef}
                scrollEventThrottle={16}
                onScroll={handleScroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mainContent}>
                    {bookings.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>{translate('Upcoming')}
                                </Text>
                            </View>
                            <FlatList
                                horizontal
                                data={bookings}
                                renderItem={renderBooking}
                                keyExtractor={item => item._id}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.bookingList}
                            />
                        </View>
                    )}

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>
                                {translate('Categories')}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.selectionAsync();
                                    navigation.navigate('categories');
                                }}
                            >
                                <Text style={styles.seeAllText}>
                                    {translate('See All')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            horizontal
                            data={categories}
                            renderItem={renderCategory}
                            keyExtractor={item => item._id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoryList}
                        />
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>
                                {translate('Top spa picks')}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.selectionAsync();
                                    navigation.navigate('viewAll');
                                }}
                            >
                                <Text style={styles.seeAllText}>
                                    {translate('See All')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            horizontal
                            data={MOCK_BRANCHES}
                            renderItem={renderBranch}
                            keyExtractor={item => item._id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.branchList}
                        />
                    </View>
                </View>
            </Animated2.ScrollView>

            {/* <BottomSheet
                ref={searchRef}
                snapPoints={["25%", "95%"]}
                enablePanDownToClose
                index={-1}
                onChange={() => { }}
            >
                <SearchView
                    hide={() => searchRef.current?.close()}
                    navigation={navigation}
                />
            </BottomSheet> */}

            {notification && (
                <Notifications Hide={() => setNotification(false)} />
            )}

            {locationPermissionDenied && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={locationPermissionDenied}
                >
                    <BlurView intensity={80} style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <ExpoImage
                                source={require('../../../assets/no-location-gps.png')}
                                style={styles.modalImage}
                                contentFit="contain"
                            />
                            <Text bold style={styles.modalTitle}>
                                {translate('Let us access your location')}
                            </Text>
                            <Text style={styles.modalSubtitle}>
                                {translate('To find salons nearby')}
                            </Text>
                            <Button
                                mode="contained"
                                loading={locationLoading}
                                disabled={locationLoading}
                                onPress={requestLocationPermission}
                                style={styles.modalButton}
                            >
                                {translate('Allow')}
                            </Button>
                            <Button
                                mode="text"
                                onPress={() => setLocationPermissionDenied(false)}
                                style={styles.modalSecondaryButton}
                            >
                                {translate('Not now')}
                            </Button>
                        </View>
                    </BlurView>
                </Modal>
            )}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        backgroundColor: theme.colors.white,
        zIndex: 1
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    headerBackgroundImage: {
        width: '100%',
        height: '100%'
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject
    },
    headerContent: {
        width: '100%',
        paddingHorizontal: moderateScale(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerLogo: {
        height: moderateScale(40),
        width: moderateScale(130)
    },
    notificationButton: {
        padding: moderateScale(5)
    },
    notificationIcon: {
        height: moderateScale(20),
        width: moderateScale(20)
    },
    notificationBadge: {
        position: 'absolute',
        top: moderateScale(5),
        right: moderateScale(5),
        width: moderateScale(10),
        height: moderateScale(10),
        borderRadius: moderateScale(5),
        backgroundColor: theme.colors.primary
    },
    headerTitleContainer: {
        width: '100%',
        paddingHorizontal: moderateScale(20),
        marginTop: moderateScale(35)
    },
    headerTitle: {
        color: theme.colors.white,
        fontSize: moderateScale(35),
        lineHeight: moderateScale(40)
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(10)
    },
    locationText: {
        flex: 1,
        color: theme.colors.white,
        fontSize: moderateScale(14)
    },
    changeLocationText: {
        color: theme.colors.white,
        fontSize: moderateScale(15),
        fontWeight: 'bold',
        marginLeft: moderateScale(20)
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: moderateScale(100),
        height: moderateScale(45),
        paddingHorizontal: moderateScale(25),
        marginTop: moderateScale(20),
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84
            },
            android: {
                elevation: 5
            }
        })
    },
    searchIcon: {
        height: moderateScale(20),
        width: moderateScale(20)
    },
    searchText: {
        flex: 1,
        color: theme.colors.gray,
        marginLeft: moderateScale(10),
        fontSize: moderateScale(15)
    },
    scrollContent: {
        paddingTop: HEADER_MAX_HEIGHT,
        paddingBottom: moderateScale(20)
    },
    mainContent: {
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        paddingTop: moderateScale(20)
    },
    section: {
        marginBottom: moderateScale(25)
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(20),
        marginBottom: moderateScale(15)
    },
    sectionTitle: {
        color: theme.colors.black,
        fontSize: moderateScale(20),
        fontWeight: 'bold'
    },
    seeAllText: {
        color: theme.colors.primary,
        fontSize: moderateScale(12),
        fontWeight: '600'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: theme.colors.white,
        borderRadius: moderateScale(20),
        padding: moderateScale(20),
        width: '80%',
        alignItems: 'center'
    },
    modalImage: {
        width: moderateScale(150),
        height: moderateScale(150),
        marginBottom: moderateScale(20)
    },
    modalTitle: {
        fontSize: moderateScale(20),
        textAlign: 'center',
        marginBottom: moderateScale(10)
    },
    modalSubtitle: {
        fontSize: moderateScale(16),
        textAlign: 'center',
        marginBottom: moderateScale(20),
        color: theme.colors.gray
    },
    modalButton: {
        width: '100%',
        marginBottom: moderateScale(10)
    },
    modalSecondaryButton: {
        width: '100%'
    },
    // ... (previous styles remain the same)

    categoryList: {
        paddingHorizontal: moderateScale(15)
    },
    categoryItem: {
        marginHorizontal: moderateScale(5),
        width: moderateScale(130)
    },
    categoryName: {
        position: 'absolute',
        top: moderateScale(10),
        left: moderateScale(10),
        color: theme.colors.white,
        fontSize: moderateScale(20),
        zIndex: 2,
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold'
    },
    categoryImageContainer: {
        height: moderateScale(180),
        borderRadius: moderateScale(10),
        overflow: 'hidden'
    },
    categoryImage: {
        width: '100%',
        height: '100%'
    },
    categoryOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    branchList: {
        paddingHorizontal: moderateScale(15)
    },
    branchItem: {
        width: Dimensions.get('window').width / 1.4,
        marginHorizontal: moderateScale(5)
    },
    branchImageContainer: {
        height: moderateScale(150),
        borderRadius: moderateScale(20),
        overflow: 'hidden'
    },
    branchImage: {
        width: '100%',
        height: '100%'
    },
    likeButton: {
        position: 'absolute',
        top: moderateScale(10),
        right: moderateScale(10),
        width: moderateScale(40),
        height: moderateScale(40),
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: moderateScale(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
    likeIcon: {
        width: moderateScale(20),
        height: moderateScale(20)
    },
    branchInfo: {
        padding: moderateScale(10)
    },
    branchName: {
        fontSize: moderateScale(15),
        color: theme.colors.black,
        marginBottom: moderateScale(5),
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold'
    },
    branchDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: moderateScale(5)
    },
    branchType: {
        flex: 1,
        fontSize: moderateScale(12),
        color: theme.colors.primary,
        fontWeight: '600',
        fontFamily: FONT_FAMILY
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    starIcon: {
        width: moderateScale(10),
        height: moderateScale(10),
        marginRight: moderateScale(5)
    },
    rating: {
        fontSize: moderateScale(12),
        color: theme.colors.black,
        fontWeight: '500',
        fontFamily: FONT_FAMILY
    },
    branchLocation: {
        fontSize: moderateScale(15),
        color: theme.colors.grayText,
        fontFamily: FONT_FAMILY
    },
    bookingList: {
        paddingHorizontal: moderateScale(15)
    },
    bookingItem: {
        flexDirection: 'row',
        padding: moderateScale(10),
        marginBottom: moderateScale(10),
        backgroundColor: theme.colors.white,
        borderRadius: moderateScale(15),
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2
                },
                shadowOpacity: 0.15,
                shadowRadius: 3.84
            },
            android: {
                elevation: 3
            }
        })
    },
    bookingImageContainer: {
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(15),
        backgroundColor: theme.colors.grayBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: moderateScale(10)
    },
    bookingImage: {
        width: moderateScale(40),
        height: moderateScale(40)
    },
    bookingInfo: {
        flex: 1,
        justifyContent: 'space-between'
    },
    bookingName: {
        fontSize: moderateScale(15),
        color: theme.colors.black,
        marginBottom: moderateScale(5),
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold'
    },
    bookingDetails: {
        flexDirection: 'row',
        marginBottom: moderateScale(10)
    },
    bookingTime: {
        flex: 1
    },
    bookingDate: {
        flex: 1
    },
    bookingLabel: {
        fontSize: moderateScale(12),
        color: theme.colors.grayText,
        marginBottom: moderateScale(2),
        fontFamily: FONT_FAMILY
    },
    bookingValue: {
        fontSize: moderateScale(14),
        color: theme.colors.black,
        fontFamily: FONT_FAMILY,
        fontWeight: '500'
    },
    bookingStatus: {
        alignSelf: 'flex-start',
        paddingHorizontal: moderateScale(15),
        paddingVertical: moderateScale(5),
        borderRadius: moderateScale(15)
    },
    bookingStatusText: {
        color: theme.colors.white,
        fontSize: moderateScale(12),
        fontWeight: '600',
        fontFamily: FONT_FAMILY
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderateScale(20)
    },
    emptyImage: {
        width: moderateScale(200),
        height: moderateScale(200),
        marginBottom: moderateScale(20)
    },
    emptyText: {
        fontSize: moderateScale(16),
        color: theme.colors.grayText,
        textAlign: 'center',
        fontFamily: FONT_FAMILY
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.white
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderateScale(20),
        backgroundColor: theme.colors.white
    },
    errorImage: {
        width: moderateScale(150),
        height: moderateScale(150),
        marginBottom: moderateScale(20)
    },
    errorTitle: {
        fontSize: moderateScale(20),
        color: theme.colors.black,
        marginBottom: moderateScale(10),
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: FONT_FAMILY
    },
    errorText: {
        fontSize: moderateScale(14),
        color: theme.colors.grayText,
        marginBottom: moderateScale(20),
        textAlign: 'center',
        fontFamily: FONT_FAMILY
    },
    retryButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: moderateScale(30),
        paddingVertical: moderateScale(10),
        borderRadius: moderateScale(20)
    },
    retryButtonText: {
        color: theme.colors.white,
        fontSize: moderateScale(14),
        fontWeight: '600',
        fontFamily: FONT_FAMILY
    }
});

export default React.memo(Browse);