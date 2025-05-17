import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Dimensions,
    Animated,
    FlatList,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Image as ExpoImage } from 'expo-image';

import { theme } from '../../../core/theme';
import { Text } from '../../../components/widget';
import { FONT_FAMILY } from '../../../services/config';
import { showDanger, translate } from '../../../utils/utils';
import Notifications from '../bottoms/childs/Notifications';
import SearchView from '../bottoms/pages/browse/search/search';

// Import hooks for real data
import { useCategories } from '../../../hooks/useCategories';
import { useAppointments } from '../../../hooks/useAppointments';
import { useSalons } from '../../../hooks/useSalons';
import { useFavorites } from '../../../hooks/useFavorites';
import { CategoryDto, SalonDto, CustomerUpcomingAppointmentDto } from '../../../types/api.types';

// Replace moderateScale with a simple scaling function
const { width: screenWidth } = Dimensions.get('window');
const scale = (size: number) => (screenWidth / 375) * size;

const HEADER_MAX_HEIGHT = scale(380);
const HEADER_MIN_HEIGHT = scale(160);
const HEADER_SCROLL_DISTANCE = (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT);

interface BrowseProps {
    navigation: any;
}

// Helper functions for date formatting
const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours} ${ampm}`;
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
};

// Type for our formatted salon item
interface FormattedSalon {
    id: number;
    name: string;
    about: string;
    isVerified: boolean;
    serviceType: number;
    location: any;
    categories: any[];
    image: any;
    originalData?: SalonDto; // Store the original data for navigation
}

// Type for our formatted upcoming appointment
interface FormattedAppointment {
    id: number;
    branch: {
        name: string;
        image: any;
    };
    bookingdDate: string;
    status: string;
}

// Type for our formatted category
interface FormattedCategory {
    id: number;
    name: string;
    image: any;
}

export const Browse: React.FC<BrowseProps> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const scrollY = useRef(new Animated.Value(0)).current;

    // Use hooks to fetch real data
    const { categories, isLoading: categoriesLoading } = useCategories();
    const {
        upcomingAppointments,
        isLoading: appointmentsLoading
    } = useAppointments();
    const {
        nearbySalons,
        searchNearby,
        searchWithFilters,
        isLoadingNearby
    } = useSalons();
    const {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isLoading: favoritesLoading
    } = useFavorites();

    // State for UI
    const [notification, setNotification] = useState(false);
    const [unread, setUnread] = useState(3);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState({
        location: 'Dubai, United Arab Emirates',
        geometry: {
            lat: 25.2048,
            lng: 55.2708
        }
    });

    // State for data
    const [formattedSalons, setFormattedSalons] = useState<FormattedSalon[]>([]);
    const [formattedBookings, setFormattedBookings] = useState<FormattedAppointment[]>([]);
    const [formattedCategories, setFormattedCategories] = useState<FormattedCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Navigation functions
    const navigateToCategoryDetails = (item: FormattedCategory) => {
        // Pass categoryId, categoryName, and image separately
        navigation.navigate('categoriesDetails', {
            categoryId: item.id,
            categoryName: item.name,
            image: item.image
        });
    };

    const navigateToCategories = () => {
        navigation.navigate('categories');
    };

    const navigateToViewAll = () => {
        navigation.navigate('viewAll');
    };

    const navigateToBookingDetails = (item: FormattedAppointment) => {
        // Pass only the appointment ID - the BookingDetails screen will fetch the full details
        navigation.navigate('BookingDetails', { appointmentId: item.id });
    };

    const navigateToLocationPicker = () => {
        navigation.navigate('LocationPicker', {
            defaultLocation: selectedLocation,
            onLocationSelected: (locationData: React.SetStateAction<{ location: string; geometry: { lat: number; lng: number; }; }>) => {
                setSelectedLocation(locationData);
            }
        });
    };

    const navigateToBranchDetails = (item: FormattedSalon) => {
        // Pass the complete, original salon object from the API to the next screen
        // This ensures we're passing the full, unmodified data from the API
        navigation.navigate('branchDetails', {
            item: item.originalData
        });
    };

    // Helper functions
    const openSearch = () => {
        setShowSearchModal(true);
    };

    const closeSearch = () => {
        setShowSearchModal(false);
    };

    // Fallback function to fetch all salons without location
    const fetchSalonsWithoutLocation = async () => {
        try {
            // Use an empty filter to get all salons
            const results = await searchWithFilters({});
            if (results && results.salons) {
                formatSalonsData(results.salons);
            }
        } catch (error) {
            console.error('Error fetching salons:', error);
            showDanger('Failed to load salons');
        }
    };

    // Fetch user location and perform initial search
    useEffect(() => {
        const fetchLocationAndSearch = async () => {
            try {
                // First, get all salons using searchWithFilters with no parameters
                // This will be used for both Top spa picks and Best for massages sections
                const results = await searchWithFilters({});
                if (results && results.salons) {
                    formatSalonsData(results.salons);
                }

                // Then try to get location for potential nearby search
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Location permission denied');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                const userLat = location.coords.latitude;
                const userLng = location.coords.longitude;

                // Reverse geocode to get address string
                let addressString = 'Your Location';
                try {
                    const addresses = await Location.reverseGeocodeAsync({ latitude: userLat, longitude: userLng });
                    if (addresses && addresses.length > 0) {
                        const addr = addresses[0];
                        addressString = [addr.city, addr.region, addr.country].filter(Boolean).join(', ');
                    }
                } catch (err) {
                    console.log('Reverse geocoding failed:', err);
                }

                // Update the selected location state with real address
                setSelectedLocation({
                    location: addressString,
                    geometry: {
                        lat: userLat,
                        lng: userLng
                    }
                });

                // We already have all salons, no need to search nearby specifically
                // but could be useful for a different "Nearby" section if needed
                // searchNearby(userLat, userLng);
            } catch (error) {
                console.error('Error getting location:', error);
                // Make sure we still have salon data even if location fails
                fetchSalonsWithoutLocation();
            }
        };

        fetchLocationAndSearch();
    }, []);

    // Format salon data with dummy images but preserve the original data
    const formatSalonsData = (salons: SalonDto[]) => {
        if (!salons) return;

        // Create formatted salon objects while preserving ALL the original API data
        const formatted = salons.map(salon => ({
            id: salon.id,
            name: salon.name,
            about: salon.about || '',
            isVerified: salon.isVerified,
            serviceType: salon.serviceType,
            location: salon.location,
            categories: salon.categories || [],
            image: require('../../../assets/dummy1.png'),
            // Store complete original salon object from API
            originalData: salon
        }));

        setFormattedSalons(formatted);
    };

    // Format category data with dummy images
    useEffect(() => {
        if (categories && categories.length > 0) {
            const dummyImages = [
                require('../../../assets/dummy2.png'),
                require('../../../assets/dummy3.png'),
                require('../../../assets/dummy4.png')
            ];

            const formatted = categories.map((category, index) => ({
                ...category,
                image: dummyImages[index % dummyImages.length]
            }));

            setFormattedCategories(formatted);
        }
    }, [categories]);

    // Format upcoming appointments with dummy images
    useEffect(() => {
        if (upcomingAppointments && upcomingAppointments.appointments) {
            const formatted = upcomingAppointments.appointments.map(appointment => ({
                id: appointment.id,
                branch: {
                    name: appointment.salonName,
                    image: require('../../../assets/dummy2.png')
                },
                bookingdDate: appointment.appointmentDate,
                status: appointment.status.toString()
            }));

            setFormattedBookings(formatted);
        }
    }, [upcomingAppointments]);

    // Update loading state
    useEffect(() => {
        setIsLoading(
            categoriesLoading ||
            appointmentsLoading ||
            isLoadingNearby ||
            favoritesLoading
        );
    }, [categoriesLoading, appointmentsLoading, isLoadingNearby, favoritesLoading]);

    // Handle favorite toggle
    const handleToggleFavorite = async (businessId: number) => {
        try {
            Haptics.selectionAsync();

            // Check if salon is already in favorites
            const isFavorite = favorites.some(fav => fav.businessId === businessId);

            if (isFavorite) {
                await removeFromFavorites(businessId);
            } else {
                await addToFavorites(businessId);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            showDanger('Failed to update favorites');
        }
    };

    // Animations
    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp'
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    const backgroundScale = scrollY.interpolate({
        inputRange: [-100, 0],
        outputRange: [1.5, 1],
        extrapolate: 'clamp'
    });

    const searchTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -HEADER_SCROLL_DISTANCE + scale(250)],
        extrapolate: 'clamp'
    });

    const textColor = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
        outputRange: ['white', theme.colors.black],
        extrapolate: 'clamp'
    });

    const textColor1 = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
        outputRange: ['white', theme.colors.Xblue],
        extrapolate: 'clamp'
    });

    const renderHeader = () => (
        <Animated.View style={[styles.header, { height: headerHeight }]}>
            {/* Background Layer */}
            <Animated.View style={[styles.headerBackgroundContainer, {
                opacity: headerOpacity,
                transform: [{ scale: backgroundScale }]
            }]}>
                <ExpoImage
                    source={require('../../../assets/home-background.png')}
                    style={styles.headerBackground}
                    contentFit="cover"
                />
                <ExpoImage
                    source={require('../../../assets/home-top-back.png')}
                    style={[styles.headerBackground, styles.headerOverlay]}
                    contentFit="cover"
                />
                <ExpoImage
                    source={require('../../../assets/home-bottom-back.png')}
                    style={[styles.headerBackground, styles.headerOverlay]}
                    contentFit="cover"
                />
            </Animated.View>

            <Animated.View style={[
                styles.headerCollapsible,
                { opacity: headerOpacity }
            ]}>
                {/* Header Content */}
                <View style={[styles.headerContent, { paddingTop: insets.top + scale(15) }]}>
                    <ExpoImage
                        source={require('../../../assets/logo-with-name.png')}
                        style={styles.logo}
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

                {/* Title Section */}
                <View style={styles.headerTitleContainer}>
                    <Text bold style={styles.headerTitle}>
                        Discover salons{'\n'}near you
                    </Text>
                </View>
            </Animated.View>

            {/* Search Container with Animation */}
            <Animated.View
                style={[
                    styles.searchContainer,
                    {
                        transform: [{ translateY: searchTranslateY }],
                        zIndex: 1000,
                    }
                ]}
            >
                <View style={styles.locationContainer}>
                    <Animated.Text
                        numberOfLines={1}
                        style={[
                            styles.locationText,
                            { color: textColor }
                        ]}
                    >
                        {selectedLocation.location}
                    </Animated.Text>
                    <TouchableOpacity onPress={navigateToLocationPicker}>
                        <Animated.Text
                            style={[
                                styles.changeText,
                                { color: textColor1 }
                            ]}
                        >
                            Change
                        </Animated.Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={openSearch}
                    activeOpacity={0.7}
                >
                    <ExpoImage
                        source={require('../../../assets/search.png')}
                        style={styles.searchIcon}
                        contentFit="contain"
                    />
                    <Text style={styles.searchText}>Search</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Bottom Curve */}
            <View style={styles.headerCurve} />
        </Animated.View>
    );

    const renderSection = (title: string, data: any[], renderItem: any, onSeeAll?: () => void) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
                {onSeeAll && (
                    <TouchableOpacity onPress={onSeeAll}>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                )}
            </View>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );

    const renderCategory = ({ item }: { item: FormattedCategory }) => (
        <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigateToCategoryDetails(item)}
        >
            <ExpoImage
                source={item.image}
                style={styles.categoryImage}
                contentFit="cover"
            />
            <View style={styles.categoryGradient} />
            <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderSpa = ({ item }: { item: FormattedSalon }) => {
        // Check if this salon is in favorites
        const isFavorite = favorites.some(fav => fav.businessId === item.id);

        return (
            <TouchableOpacity
                style={styles.spaCard}
                onPress={() => {
                    Haptics.selectionAsync();
                    navigateToBranchDetails(item);
                }}
            >
                <View style={styles.spaImageContainer}>
                    <ExpoImage
                        source={item.image}
                        style={styles.spaImage}
                        contentFit="cover"
                    />
                    <Pressable
                        style={({ pressed }) => [
                            styles.likeButton,
                            pressed && { opacity: 0.7 }
                        ]}
                        onPress={() => handleToggleFavorite(item.id)}
                    >
                        <ExpoImage
                            source={require('../../../assets/like.png')}
                            style={{ width: scale(20), height: scale(20) }}
                            contentFit="contain"
                            tintColor={isFavorite ? theme.colors.primary : theme.colors.white}
                        />
                    </Pressable>
                </View>
                <View style={styles.spaInfo}>
                    <Text style={styles.spaTitle}>{item.name}</Text>
                    <View style={styles.spaDetails}>
                        <Text style={styles.spaTypeText}>
                            {item.categories && item.categories.length > 0
                                ? item.categories[0].name
                                : 'Beauty salon'}
                        </Text>
                        <View style={styles.rating}>
                            <ExpoImage
                                source={require('../../../assets/star.png')}
                                style={{ width: scale(15), height: scale(15) }}
                                contentFit="contain"
                            />
                            <Text style={styles.ratingText}>4.5</Text>
                        </View>
                        <Text style={styles.spaGender}>
                            {item.serviceType === 1
                                ? 'Men only'
                                : item.serviceType === 2
                                    ? 'Women only'
                                    : 'Everyone'}
                        </Text>
                    </View>
                    <Text numberOfLines={1} style={{ color: theme.colors.grayText }}>
                        {item.location
                            ? `${item.location.streetAddress}, ${item.location.city}`
                            : 'Location not available'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderBooking = ({ item }: { item: FormattedAppointment }) => {
        const getStatusColor = (status: string) => {
            switch (status) {
                case '1': return theme.colors.pending;
                case '2': return theme.colors.approved;
                case '3': return theme.colors.completed;
                case '4': return theme.colors.canceled;
                case '5': return theme.colors.gray; // NoShow
                default: return theme.colors.gray;
            }
        };

        const getStatusText = (status: string) => {
            switch (status) {
                case '1': return translate('Pending approval');
                case '2': return translate('Approved');
                case '3': return translate('Completed');
                case '4': return translate('Canceled');
                case '5': return translate('No Show');
                default: return '';
            }
        };

        return (
            <TouchableOpacity
                style={styles.bookingCard}
                onPress={() => {
                    Haptics.selectionAsync();
                    navigateToBookingDetails(item);
                }}
            >
                <View style={styles.bookingImage}>
                    <ExpoImage
                        source={item.branch.image}
                        style={{ width: '100%', height: '100%', borderRadius: scale(15) }}
                        contentFit="cover"
                    />
                </View>
                <View style={styles.bookingInfo}>
                    <Text style={styles.bookingTitle}>{item.branch.name}</Text>
                    <View style={styles.bookingDetails}>
                        <View style={styles.bookingTime}>
                            <Text style={styles.bookingTimeLabel}>{translate('Time')}</Text>
                            <Text style={styles.bookingTimeValue}>
                                {formatTime(item.bookingdDate)}
                            </Text>
                        </View>
                        <View style={styles.bookingTime}>
                            <Text style={styles.bookingTimeLabel}>{translate('Date')}</Text>
                            <Text style={styles.bookingTimeValue}>
                                {formatDate(item.bookingdDate)}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.bookingStatus,
                            { backgroundColor: getStatusColor(item.status) }
                        ]}
                    >
                        <Text style={styles.bookingStatusText}>
                            {getStatusText(item.status)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Main Content */}
            <Animated.ScrollView
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: HEADER_MAX_HEIGHT + insets.top }
                ]}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <View style={styles.mainContent}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Text style={styles.loadingText}>Loading...</Text>
                        </View>
                    ) : (
                        <>
                            {formattedBookings.length > 0 &&
                                renderSection('Upcoming', formattedBookings, renderBooking)}

                            {formattedCategories.length > 0 &&
                                renderSection('Categories', formattedCategories, renderCategory, navigateToCategories)}

                            {formattedSalons.length > 0 &&
                                renderSection('Top spa picks', formattedSalons, renderSpa, navigateToViewAll)}

                            {formattedSalons.length > 0 &&
                                renderSection(
                                    'Best for massages',
                                    // Filter for massage category, but use all salons if none match
                                    formattedSalons.filter(salon =>
                                        salon.categories &&
                                        salon.categories.some(cat =>
                                            cat.name && cat.name.toLowerCase().includes('massage')
                                        )
                                    ).length > 0
                                        ? formattedSalons.filter(salon =>
                                            salon.categories &&
                                            salon.categories.some(cat =>
                                                cat.name && cat.name.toLowerCase().includes('massage')
                                            )
                                        )
                                        : formattedSalons.slice(0, 3), // Fallback to first 3 if no massage
                                    renderSpa,
                                    navigateToViewAll
                                )
                            }
                        </>
                    )}
                </View>
            </Animated.ScrollView>

            {renderHeader()}

            {/* Search Modal */}
            {showSearchModal && (
                <SearchView
                    navigation={navigation}
                    hide={() => setShowSearchModal(false)}
                    data={{
                        selectedLocation: selectedLocation
                    }}
                />
            )}

            {/* Notifications Modal */}
            {notification && (
                <Notifications Hide={() => setNotification(false)} />
            )}
        </View>
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
        zIndex: 10
    },
    headerBackgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.white
    },
    headerBackground: {
        width: '100%',
        height: '100%'
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(20)
    },
    logo: {
        width: scale(130),
        height: scale(40)
    },
    headerTitleContainer: {
        paddingHorizontal: scale(20),
        marginTop: scale(30),
    },
    headerTitle: {
        fontSize: scale(36),
        color: 'white',
        marginBottom: scale(15),
        lineHeight: scale(42)
    },
    headerCurve: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: scale(30),
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: scale(30),
        borderTopRightRadius: scale(30)
    },
    notificationButton: {
        padding: scale(5),
        position: 'relative'
    },
    notificationIcon: {
        width: scale(24),
        height: scale(24)
    },
    notificationBadge: {
        position: 'absolute',
        top: scale(5),
        right: scale(5),
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: theme.colors.primary
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(20)
    },
    locationText: {
        flex: 1,
        color: 'white',
        fontSize: scale(14),
        fontFamily: FONT_FAMILY
    },
    changeText: {
        color: 'white',
        fontSize: scale(15),
        marginLeft: scale(10),
        fontFamily: FONT_FAMILY
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: scale(25),
        height: scale(45),
        paddingHorizontal: scale(20),
        marginTop: scale(10),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84
            },
            android: {
                elevation: 5
            }
        })
    },
    searchIcon: {
        width: scale(20),
        height: scale(20),
        marginRight: scale(10)
    },
    searchText: {
        fontSize: scale(16),
        color: theme.colors.gray,
        flex: 1
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: scale(80)
    },
    mainContent: {
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: scale(30),
        borderTopRightRadius: scale(30),
        minHeight: Dimensions.get('window').height
    },
    section: {
        marginBottom: scale(25)
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(20),
        marginBottom: scale(15)
    },
    sectionTitle: {
        fontSize: scale(20),
        fontWeight: 'bold',
        color: theme.colors.black,
        fontFamily: FONT_FAMILY
    },
    seeAllText: {
        fontSize: scale(14),
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY
    },
    listContainer: {
        paddingHorizontal: scale(15)
    },
    categoryCard: {
        width: scale(150),
        height: scale(180),
        marginHorizontal: scale(5),
        borderRadius: scale(20),
        overflow: 'hidden'
    },
    categoryImage: {
        width: '100%',
        height: '100%',
    },
    categoryName: {
        position: 'absolute',
        top: scale(15),
        left: scale(15),
        color: 'white',
        fontSize: scale(20),
        fontWeight: 'bold',
        zIndex: 2,
        fontFamily: FONT_FAMILY
    },
    categoryGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    spaCard: {
        width: Dimensions.get('window').width * 0.7,
        marginHorizontal: scale(5)
    },
    spaImageContainer: {
        height: scale(150),
        borderRadius: scale(15),
        overflow: 'hidden'
    },
    spaImage: {
        width: '100%',
        height: '100%'
    },
    likeButton: {
        position: 'absolute',
        top: scale(10),
        right: scale(10),
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    spaInfo: {
        padding: scale(10)
    },
    spaTitle: {
        fontSize: scale(16),
        fontWeight: 'bold',
        color: theme.colors.black,
        marginBottom: scale(5),
        fontFamily: FONT_FAMILY
    },
    spaDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: scale(10),
        marginBottom: scale(5)
    },
    spaTypeText: {
        fontSize: scale(14),
        color: theme.colors.primary,
        marginRight: scale(5),
        fontFamily: FONT_FAMILY
    },
    spaGender: {
        fontSize: scale(14),
        color: theme.colors.primary,
        backgroundColor: theme.colors.primaryLight,
        paddingHorizontal: scale(8),
        paddingVertical: scale(2),
        borderRadius: scale(10),
        fontFamily: FONT_FAMILY
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingText: {
        fontSize: scale(14),
        color: theme.colors.black,
        marginLeft: scale(5),
        fontFamily: FONT_FAMILY
    },
    bookingCard: {
        flexDirection: 'row',
        borderRadius: scale(15),
        width: Dimensions.get('window').width * 0.8,
        marginHorizontal: scale(5)
    },
    bookingImage: {
        width: scale(80),
        height: scale(80),
        borderRadius: scale(15),
        backgroundColor: theme.colors.grayBackground,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bookingInfo: {
        flex: 1,
        marginLeft: scale(15)
    },
    bookingTitle: {
        fontSize: scale(16),
        fontWeight: 'bold',
        color: theme.colors.Xgray,
        marginBottom: scale(10),
        fontFamily: FONT_FAMILY
    },
    bookingDetails: {
        flexDirection: 'row'
    },
    bookingTime: {
        flex: 1
    },
    bookingTimeLabel: {
        fontSize: scale(12),
        color: theme.colors.Xgray3,
        fontWeight: 'bold',
        marginBottom: scale(5),
        fontFamily: FONT_FAMILY
    },
    bookingTimeValue: {
        fontSize: scale(14),
        color: theme.colors.black,
        fontFamily: FONT_FAMILY
    },
    bookingStatus: {
        alignSelf: 'flex-start',
        paddingHorizontal: scale(15),
        paddingVertical: scale(5),
        borderRadius: scale(15),
        marginTop: scale(10)
    },
    bookingStatusText: {
        fontSize: scale(12),
        color: 'white',
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY
    },
    searchContainer: {
        position: 'absolute',
        bottom: scale(50),
        left: scale(20),
        right: scale(20),
    },
    headerCollapsible: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(50),
        marginTop: scale(100)
    },
    loadingText: {
        marginTop: scale(15),
        fontSize: scale(16),
        color: theme.colors.black,
        fontFamily: FONT_FAMILY
    }
});

export default React.memo(Browse);