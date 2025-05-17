// src/screens/Browse/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Animated,
    ScrollView,
    Dimensions
} from 'react-native';
import { Image } from 'expo-image';
import { moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { theme } from '../../../../core/theme';

// Components
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import LocationPicker from './components/LocationPicker';
import UpcomingBookings from './components/UpcomingBookings';
import Categories from './components/Categories';
import TopPicks from './components/TopPicks';
import BestForMassages from './components/BestForMassages';
import NotificationModal from './components/NotificationModal';
import LocationPermissionModal from './components/LocationPermissionModal';
import NoInternetModal from './components/NoInternetModal';

const MAX_HEADER_HEIGHT = moderateScale(340);
const MIN_HEADER_HEIGHT = moderateScale(150);

const Browse: React.FC = () => {
    const navigation = useNavigation();
    const scrollY = useRef(new Animated.Value(0)).current;
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    // States
    const [searchVisible, setSearchVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [locationPermissionVisible, setLocationPermissionVisible] = useState(false);
    const [noInternetVisible, setNoInternetVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [connectionIssue, setConnectionIssue] = useState(false);
    const [categories, setCategories] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState({
        location: 'Dubai, United Arab Emirates',
        geometry: { lat: 25.2048, lng: 55.2708 }
    });

    // Animation interpolations
    const headerHeight = scrollY.interpolate({
        inputRange: [0, MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT],
        outputRange: [MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT],
        extrapolate: 'clamp'
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    // Render header background
    const renderHeaderBackground = () => (
        <View style={styles.headerBackground}>
            <Image
                source={require('../../../../assets/home-background.png')}
                style={styles.backgroundImage}
            />
            <Image
                source={require('../../../../assets/home-top-back.png')}
                style={[styles.backgroundImage, styles.overlayImage]}
            />
            <Image
                source={require('../../../../assets/home-bottom-back.png')}
                style={[styles.backgroundImage, styles.overlayImage]}
            />
        </View>
    );

    // Mock data
    const mockBookings = [
        {
            id: '1',
            branch: {
                name: 'Spa Center 1',
                image: require('../../../../assets/devura.png')
            },
            bookingdDate: new Date().toISOString(),
            status: '1'
        }
    ];

    const mockSalons = [
        {
            id: '1',
            name: 'Pastels Salon Ritz Carlton JBR',
            type: 'Beauty salon. Men only',
            rating: 4.1,
            location: 'The Ritz Carlton hotel - Dubai'
        }
    ];

    useEffect(() => {
        const initializeApp = async () => {
            await checkLocationPermission();
            await loadInitialData();
            setupDeepLinking();
        };

        initializeApp();
    }, []);

    // Deep linking setup
    const setupDeepLinking = () => {
        Linking.addEventListener('url', (event) => {
            if (event.url) {
                const id = event.url.split('/')[3];
                navigation.navigate('branchDetails', { item: { _id: id } });
            }
        });
    };

    // Location handling
    const checkLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocationPermissionVisible(true);
        } else {
            await getCurrentLocation();
        }
    };

    const getCurrentLocation = async () => {
        try {
            setLocationLoading(true);
            const location = await Location.getCurrentPositionAsync({});
            const address = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            if (address[0]) {
                setSelectedLocation({
                    location: `${address[0].city}, ${address[0].country}`,
                    geometry: {
                        lat: location.coords.latitude,
                        lng: location.coords.longitude
                    }
                });
            }
        } catch (error) {
            console.error('Error getting location:', error);
        } finally {
            setLocationLoading(false);
        }
    };

    // Load initial data
    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            setCategories([
                { id: '1', name: 'Hair', image: require('../../../../assets/category1.png') },
                { id: '2', name: 'Massage', image: require('../../../../assets/category2.png') }
            ]);
            setUnreadCount(3);
        } catch (error) {
            setConnectionIssue(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <BottomSheetModalProvider>
                <StatusBar style="light" />

                <Animated.View style={[styles.header, { height: headerHeight }]}>
                    {renderHeaderBackground()}
                    <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
                        <Header
                            unreadCount={unreadCount}
                            onNotificationPress={() => setNotificationVisible(true)}
                        />

                        <LocationPicker
                            location={selectedLocation}
                            onLocationChange={() => navigation.navigate('LocationPicker')}
                        />

                        <SearchBar
                            onPress={() => bottomSheetRef.current?.present()}
                        />
                    </Animated.View>
                </Animated.View>

                <Animated.ScrollView
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
                    )}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.content}>
                        {mockBookings.length > 0 && (
                            <UpcomingBookings
                                bookings={mockBookings}
                                onBookingPress={(booking) =>
                                    navigation.navigate('BookingDetails', { booking })
                                }
                            />
                        )}

                        <Categories
                            categories={categories}
                            onCategoryPress={(category) =>
                                navigation.navigate('categoriesDetails', { category })
                            }
                            onSeeAllPress={() => navigation.navigate('categories')}
                        />

                        <TopPicks
                            salons={mockSalons}
                            onSalonPress={(salon) =>
                                navigation.navigate('branchDetails', { item: salon })
                            }
                            onFavoritePress={() => { }}
                            onSeeAllPress={() => navigation.navigate('viewAll')}
                        />

                        <BestForMassages
                            salons={mockSalons}
                            onSalonPress={(salon) =>
                                navigation.navigate('branchDetails', { item: salon })
                            }
                            onFavoritePress={() => { }}
                            onSeeAllPress={() => navigation.navigate('viewAll')}
                        />
                    </View>
                </Animated.ScrollView>

                {/* Modals */}
                <NotificationModal
                    visible={notificationVisible}
                    onClose={() => setNotificationVisible(false)}
                />

                <LocationPermissionModal
                    visible={locationPermissionVisible}
                    onAllow={getCurrentLocation}
                    onNotNow={() => setLocationPermissionVisible(false)}
                    isLoading={locationLoading}
                />

                <NoInternetModal
                    visible={noInternetVisible}
                    onRetry={loadInitialData}
                    isLoading={isLoading}
                    userInfo={{ gender: 'male' }}
                />

                <BottomSheetModal
                    ref={bottomSheetRef}
                    snapPoints={['95%']}
                    index={0}
                >
                    <View style={styles.searchContent}>
                        {/* Search content here */}
                    </View>
                </BottomSheetModal>

            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
        marginTop: Platform.OS === 'android' ? moderateScale(-30) : 0
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        zIndex: 1
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    backgroundImage: {
        width: '100%',
        height: '100%'
    },
    overlayImage: {
        position: 'absolute'
    },
    headerContent: {
        flex: 1
    },
    content: {
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        paddingHorizontal: moderateScale(10),
        marginTop: MAX_HEADER_HEIGHT
    },
    scrollContent: {
        paddingBottom: moderateScale(150)
    },
    searchContent: {
        flex: 1,
        padding: moderateScale(20)
    }
});

export default Browse;