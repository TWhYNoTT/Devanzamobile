import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    StatusBar,
    View,
    Animated,
    Platform,
    RefreshControl,
    TouchableOpacity,
    Share,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Text } from '../../../../components/widget';
import Header from '../childs/Header';
import { theme } from '../../../../core/theme';
import { formateDuration, showDanger, translate } from '../../../../utils/utils';
import ServiceDetails from './branchComponents/ServiceDetails';
import moment from 'moment';
import { Rating } from 'react-native-ratings';
import { Image as ExpoImage } from 'expo-image';

// Import hooks for real data
import { useSalons } from '../../../../hooks/useSalons';
import { useFavorites } from '../../../../hooks/useFavorites';
import { SalonDetailsResponse } from '../../../../types/api.types';

const HEADER_MAX_HEIGHT = scale(300);
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? scale(100) : scale(140);
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface Service {
    id: number;
    name: string;
    duration: string;
    price: number;
    selected: boolean;
    SubService: any[];
    SubServiceSelected?: any;
}

const BranchDetails: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    // Retrieve ID directly from route parameters 
    const salonId = route.params?.item?.id;

    // Hooks
    const { getSalonDetails } = useSalons();
    const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

    // Split state into separate variables to reduce re-rendering complexity
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [salon, setSalon] = useState<SalonDetailsResponse | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [showSubService, setShowSubService] = useState(false);
    const [selectedService, setSelectedService] = useState<Service>({} as Service);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
    const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
    const [parentScrollEnabled, setParentScrollEnabled] = useState(true);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);

    const [showAllHours, setShowAllHours] = useState(false);


    const getCurrentDayHours = () => {
        if (!salon.businessHours || salon.businessHours.length === 0) {
            return 'Working hours not available';
        }

        const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
        const todayHours = salon.businessHours.find(h => h.dayOfWeek === today);

        if (!todayHours) {
            return 'Working hours not available';
        }

        if (todayHours.is24Hours) {
            return 'Open 24 Hours';
        }

        return todayHours.openTime && todayHours.closeTime
            ? `${todayHours.openTime} - ${todayHours.closeTime}`
            : 'Working hours not available';
    };

    const getDayName = (dayOfWeek: number): string => {
        const days = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday'
        ];
        return days[dayOfWeek];
    };
    // Create Animated value for scrolling
    const scrollY = useRef(new Animated.Value(Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0)).current;
    const parentScrollViewRef = useRef<ScrollView>(null);

    // Format services from the API to match the expected structure
    const formatServicesData = (salonDetails: SalonDetailsResponse) => {
        if (!salonDetails?.services) return [];

        // Group services by categories
        const categories: { name: string; services: Service[] }[] = [];
        const categoryMap = new Map<string, number>();

        salonDetails.services.forEach(service => {
            if (!service.name) return;

            // Calculate category name from service name (simplified approach)
            // In real app, you might have proper category grouping from API
            const categoryName = service.name.split(' ')[0] || 'General';

            // Format service data
            const formattedService: Service = {
                id: service.id,
                name: service.name,
                duration: service.maxDuration || '01:00', // Default duration
                price: service.maxPrice || 0,
                selected: false,
                SubService: service.pricingOptions.map(option => ({
                    id: option.id,
                    name: option.name,
                    duration: option.duration || '00:30',
                    price: option.price,
                    selected: false
                }))
            };

            // Add to existing category or create new one
            if (categoryMap.has(categoryName)) {
                const index = categoryMap.get(categoryName) as number;
                categories[index].services.push(formattedService);
            } else {
                categoryMap.set(categoryName, categories.length);
                categories.push({
                    name: categoryName,
                    services: [formattedService]
                });
            }
        });

        return categories;
    };

    // Fetch salon details with improved error handling
    const fetchSalonDetails = async () => {
        if (!salonId) {
            Alert.alert('Error', 'Invalid salon ID');
            navigation.goBack();
            return;
        }

        setIsLoading(true);

        try {
            const salonDetails = await getSalonDetails(salonId);

            // Check if this salon is in favorites
            const isFav = favorites.some(fav => fav.businessId === salonId);

            setSalon(salonDetails);
            setIsFavorite(isFav);
            setPageLoaded(true);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching salon details:', error);
            setIsLoading(false);
            Alert.alert('Error', 'Failed to load salon details');
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchSalonDetails();

        // Clean up function to reset state when component unmounts
        return () => {
            setPageLoaded(false);
            setSalon(null);
            setSelectedServices([]);
        };
    }, [salonId, favorites]);

    // Handle favorite toggle with improved error handling
    const handleToggleFavorite = async () => {
        if (!salonId) return;

        try {
            Haptics.selectionAsync();

            if (isFavorite) {
                await removeFromFavorites(salonId);
            } else {
                await addToFavorites(salonId);
            }

            // Update state locally
            setIsFavorite(!isFavorite);

        } catch (error) {
            console.error('Error toggling favorite:', error);
            Alert.alert('Error', 'Failed to update favorites');
        }
    };

    const getTotalPrice = () => {
        // Calculate total price from all selected services
        if (selectedServices.length === 0) return '0.00';

        let price = selectedServices.reduce((total, service) => {
            if (service.SubServiceSelected) {
                return total + service.SubServiceSelected.price;
            }
            return total + service.price;
        }, 0);

        return price.toFixed(2);
    };

    const updateSelectedServicesInState = (updatedService: Service) => {
        // Add or update service in selected services array
        const serviceIndex = selectedServices.findIndex(s => s.id === updatedService.id);

        if (serviceIndex >= 0) {
            // Service exists, update it
            const newServices = [...selectedServices];
            newServices[serviceIndex] = updatedService;
            setSelectedServices(newServices);
        } else {
            // Add new service
            setSelectedServices([...selectedServices, updatedService]);
        }
    };

    const handleServiceToggle = (categoryIndex: number, serviceIndex: number) => {
        if (!salon) return;

        // Format service for ServiceDetails component
        const categories = formatServicesData(salon);
        const service = categories[categoryIndex].services[serviceIndex];

        setSelectedService(service);
        setSelectedServiceIndex(serviceIndex);
        setShowSubService(true);
    };

    // Updated handleBookNow function to navigate with correct data structure
    const handleBookNow = () => {
        if (getTotalPrice() === '0.00' || !salon) {
            Alert.alert('Error', 'Please select at least one service before booking');
            return;
        }

        // Check if services have required pricing options
        for (const service of selectedServices) {
            if (service.SubService.length > 0 && !service.SubServiceSelected) {
                Alert.alert('Error', 'Please select pricing options for all services');
                return;
            }
        }

        // Add home service flag to services
        const enhancedServices = selectedServices.map(service => {
            // Check if service can be provided at home
            // In a real app, you would get this from the API
            // For now, let's assume all services can be provided at home
            return {
                ...service,
                forHome: 1 // 1 = can be provided at home
            };
        });

        // Create the booking data structure
        const newBookingData = {
            selectedServices: enhancedServices,
            item: salon
        };

        // Navigate to OptionsForService with the data
        navigation.navigate('OptionsForService', { newBookingData });
    };

    const renderCategory = (item: { name: string }, index: number) => (
        <TouchableOpacity
            key={index}
            onPress={() => {
                setSelectedCategoryIndex(index);
            }}
            style={[
                styles.categoryButton,
                selectedCategoryIndex === index
                    ? { backgroundColor: theme.colors.primary }
                    : { backgroundColor: theme.colors.primarylight },
            ]}
        >
            <Text
                style={[
                    styles.categoryText,
                    selectedCategoryIndex === index
                        ? { color: theme.colors.white }
                        : { color: theme.colors.primary },
                ]}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    const getHoursMin = (service: Service) => {
        const hours = moment(service.duration, 'HH:mm').toDate().getHours();
        const minutes = moment(service.duration, 'HH:mm').toDate().getMinutes();
        return { hours, minutes };
    };

    const renderService = (service: Service, index: number) => {
        const duration = getHoursMin(service);

        // Check if this service is selected
        const isSelected = selectedServices.some(s => s.id === service.id);
        // If it's already in our selected services array, use that version
        const displayService = isSelected ?
            selectedServices.find(s => s.id === service.id) || service :
            service;

        return (
            <TouchableOpacity
                key={index}
                style={styles.serviceItem}
                onPress={() => handleServiceToggle(selectedCategoryIndex, index)}
            >
                <View style={styles.serviceContent}>
                    <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName}>{displayService.name}</Text>
                        <Text style={styles.serviceDuration}>
                            {formateDuration(duration.hours, duration.minutes)}
                        </Text>
                        <Text style={styles.servicePrice}>
                            {displayService.price}
                            <Text style={styles.priceCurrency}> AED</Text>
                        </Text>
                    </View>

                    <View>
                        <ExpoImage
                            source={{ uri: 'https://source.unsplash.com/100x100/?beauty,service' }}
                            style={styles.serviceImage}
                            contentFit="cover"
                        />
                        {displayService.selected && (
                            <View style={styles.selectedBadge}>
                                <Text style={styles.selectedBadgeText}>1</Text>
                            </View>
                        )}
                    </View>
                </View>

                {displayService.selected && displayService.SubService.length !== 0 && displayService.SubServiceSelected && (
                    <View style={styles.subServiceInfo}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.serviceName}>{displayService.SubServiceSelected.name}</Text>
                            <Text style={styles.serviceDuration}>
                                {formateDuration(
                                    moment(displayService.SubServiceSelected.duration, 'HH:mm').hours(),
                                    moment(displayService.SubServiceSelected.duration, 'HH:mm').minutes()
                                )}
                            </Text>
                        </View>
                        <View style={styles.subServiceActions}>
                            <Text style={styles.servicePrice}>
                                {displayService.SubServiceSelected.price}
                                <Text style={styles.priceCurrency}> AED</Text>
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    // Remove from selected services
                                    const updatedServices = selectedServices.filter(s => s.id !== displayService.id);
                                    setSelectedServices(updatedServices);
                                }}
                                style={styles.closeButton}
                            >
                                <ExpoImage
                                    style={styles.closeIcon}
                                    source={require('../../../../assets/close.png')}
                                    contentFit="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Header
                    backPress={() => navigation.goBack()}
                    Text=""
                    color="transparent"
                    back={true}
                    navigation={navigation}
                    search={false}
                    more={false}
                />
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading salon details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Guard clause for no salon data
    if (!salon) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Header
                    backPress={() => navigation.goBack()}
                    Text=""
                    color="transparent"
                    back={true}
                    navigation={navigation}
                    search={false}
                    more={false}
                />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Salon information not available</Text>
                </View>
            </SafeAreaView>
        );
    }

    const formattedCategories = formatServicesData(salon);

    // Animation calculations
    const calculatedScrollY = Animated.add(
        scrollY,
        Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0
    );

    const headerTranslate = calculatedScrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -HEADER_SCROLL_DISTANCE],
        extrapolate: 'clamp',
    });

    const imageOpacity = calculatedScrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 1, 0],
        extrapolate: 'clamp',
    });

    const blurOpacity = calculatedScrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 1, 1],
        extrapolate: 'clamp',
    });

    const imageTranslate = calculatedScrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 100],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.fill}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" />

            {/* Service Details Modal - Only render when needed */}
            {showSubService && (
                <ServiceDetails
                    subService={showSubService}
                    selectedServiceClick={(selectedSvc: Service) => {
                        // Create a new service object and mark as selected
                        const updatedService = {
                            ...selectedSvc,
                            selected: true
                        };
                        setSelectedService(updatedService);
                        setShowSubService(false);

                        // Update our list of selected services
                        updateSelectedServicesInState(updatedService);
                    }}
                    hide={() => setShowSubService(false)}
                    selectedService={selectedService}
                />
            )}

            {/* Header with background image */}
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.header,
                    { transform: [{ translateY: headerTranslate }] },
                ]}
            >
                {/* Background Image Container */}
                <Animated.View
                    style={[
                        styles.backgroundImageContainer,
                        {
                            opacity: imageOpacity,
                            transform: [{ translateY: imageTranslate }],
                        },
                    ]}
                >
                    {/* Use a better salon background image */}
                    <ExpoImage
                        source={require('../../../../assets/dummy1.png')}
                        style={styles.backgroundImage}
                        contentFit="cover"
                    />
                </Animated.View>

                {/* Blur overlay */}
                <Animated.View style={[styles.blurContainer, { opacity: blurOpacity }]}>
                    <BlurView intensity={30} style={StyleSheet.absoluteFill} />
                </Animated.View>
            </Animated.View>

            {/* Header Bar with navigation controls */}
            {pageLoaded && (
                <View style={styles.bar}>
                    <Header
                        share={true}
                        shareClick={async () => {
                            try {
                                await Share.share({
                                    message: `Check out ${salon.name} - ${salon.about}`,
                                });
                            } catch (error) {
                                console.error(error);
                            }
                        }}
                        backPress={() => navigation.goBack()}
                        search={false}
                        backPrimary={false}
                        back={true}
                        navigation={navigation}
                        Text={translate('')}
                        color="transparent"
                    />
                </View>
            )}

            {/* Main Content Scroll View */}
            <Animated.ScrollView
                ref={parentScrollViewRef}
                style={styles.fill}
                scrollEnabled={parentScrollEnabled}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            fetchSalonDetails().then(() => {
                                setRefreshing(false);
                            });
                        }}
                        progressViewOffset={HEADER_MAX_HEIGHT}
                    />
                }
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                contentInset={{ top: HEADER_MAX_HEIGHT }}
                contentOffset={{ y: -HEADER_MAX_HEIGHT }}
            >
                <View style={styles.contentContainer}>
                    {/* Business Info Section */}
                    <View style={styles.businessInfo}>
                        <View style={styles.logoContainer}>
                            <ExpoImage
                                source={require('../../../../assets/devura.png')}
                                style={styles.logo}
                                contentFit="contain"
                            />
                        </View>
                        <Text bold style={styles.businessName}>
                            {salon.name}
                        </Text>
                    </View>

                    {/* Business Details Section */}
                    <View style={styles.businessDetails}>
                        <Text style={styles.location}>
                            {salon.location
                                ? `${salon.location.streetAddress}, ${salon.location.city}`
                                : 'Location not available'}
                        </Text>

                        <View style={styles.ratingContainer}>
                            <Rating
                                readonly
                                startingValue={4.5} // Default rating
                                imageSize={Number(scale(20).toFixed(0))}
                                style={styles.rating}
                                tintColor={theme.colors.white} // Background color behind the stars
                                ratingColor={theme.colors.primary} // Purple color for filled stars
                                type="custom" // Ensures custom colors are applied
                            />
                            <Text style={styles.ratingValue}>
                                4.5
                            </Text>
                        </View>

                        <View style={styles.tagsContainer}>
                            <Text style={styles.categoryTag}>
                                {salon.categories && salon.categories.length > 0
                                    ? salon.categories[0].name
                                    : 'Beauty salon'}
                            </Text>
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>
                                    {salon.serviceType === 1
                                        ? 'Men only'
                                        : salon.serviceType === 2
                                            ? 'Women only'
                                            : 'Everyone'}
                                </Text>
                            </View>
                        </View>

                        {/* Favorite Button - Heart Icon Only */}
                        <TouchableOpacity
                            style={[
                                styles.favoritesButton,
                                isFavorite ? styles.favoriteActive : null
                            ]}
                            onPress={handleToggleFavorite}
                        >
                            <ExpoImage
                                source={isFavorite
                                    ? require('../../../../assets/liked.png')
                                    : require('../../../../assets/like.png')}
                                style={styles.favoriteIcon}
                                contentFit="contain"
                            />
                            <Text style={[
                                styles.favoritesButtonText,
                                isFavorite ? styles.favoriteActiveText : null
                            ]}>
                                {isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
                            </Text>
                        </TouchableOpacity>

                        {/* Hours Section */}
                        <TouchableOpacity
                            style={styles.hoursContainer}
                            onPress={() => setShowAllHours(!showAllHours)}
                        >
                            <ExpoImage
                                source={require('../../../../assets/clock.png')}
                                style={styles.clockIcon}
                                contentFit="contain"
                            />
                            <Text style={styles.hoursText}>
                                {getCurrentDayHours()}
                            </Text>
                            <ExpoImage
                                source={require('../../../../assets/arrow-down.png')}
                                style={[
                                    styles.arrowIcon,
                                    showAllHours && { transform: [{ rotate: '180deg' }] }
                                ]}
                                contentFit="contain"
                            />
                        </TouchableOpacity>

                        {/* Expanded Hours Section */}
                        {showAllHours && salon.businessHours && salon.businessHours.length > 0 && (
                            <View style={styles.expandedHoursContainer}>
                                {salon.businessHours.map((hours, index) => (
                                    <View key={index} style={styles.dayHoursRow}>
                                        <Text style={styles.dayName}>
                                            {getDayName(hours.dayOfWeek)}
                                        </Text>
                                        <Text style={[
                                            styles.dayHours,
                                            !hours.isOpen && styles.closedDay
                                        ]}>
                                            {!hours.isOpen
                                                ? 'Closed'
                                                : hours.is24Hours
                                                    ? 'Open 24 Hours'
                                                    : hours.openTime && hours.closeTime
                                                        ? `${hours.openTime} - ${hours.closeTime}`
                                                        : 'Hours not set'
                                            }
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Services Section */}
                        <Text style={styles.sectionTitle}>Services</Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoriesList}
                        >
                            {formattedCategories.map((item, index) => (
                                renderCategory(item, index)
                            ))}
                        </ScrollView>

                        {/* Services List */}
                        {formattedCategories.length > 0 &&
                            formattedCategories[selectedCategoryIndex]?.services.map((service, index) => (
                                renderService(service, index)
                            ))}

                        {/* About Section */}
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.aboutText}>
                            {salon.about || 'No description available'}
                        </Text>

                        {/* Map Section - Use location from API */}
                        {pageLoaded && salon.location && (
                            <View style={styles.mapContainer}>
                                <MapView
                                    provider={PROVIDER_GOOGLE}
                                    pitchEnabled={false}
                                    rotateEnabled={false}
                                    zoomEnabled={false}
                                    scrollEnabled={false}
                                    style={styles.map}
                                    initialRegion={{
                                        // Use location from salon data if available, otherwise fallback to default
                                        latitude: salon.location.latitude || 30.0444,
                                        longitude: salon.location.longitude || 31.2357,
                                        latitudeDelta: 0.0122,
                                        longitudeDelta: 0.0121,
                                    }}
                                />
                                {/* Map pin positioned as an overlay */}
                                <View style={[styles.mapMarker, {
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginLeft: -15,
                                    marginTop: -30
                                }]}>
                                    <ExpoImage
                                        source={require('../../../../assets/pin.png')}
                                        style={styles.pinIcon}
                                        contentFit="contain"
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </Animated.ScrollView>

            {/* Bottom Bar for Booking */}
            <View
                style={[
                    styles.bottomBar,
                    getTotalPrice() === '0.00'
                        ? { backgroundColor: theme.colors.disabled }
                        : { backgroundColor: theme.colors.primary },
                ]}
            >
                <Text style={styles.totalPrice}>{getTotalPrice()} AED</Text>
                <TouchableOpacity
                    onPress={handleBookNow}
                    style={styles.bookButton}
                    disabled={getTotalPrice() === '0.00'}
                >
                    <Text style={styles.bookButtonText}>
                        {getTotalPrice() === '0.00' ? 'No Service Selected' : 'Book Now'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    fill: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: scale(15),
        fontSize: scale(16),
        color: theme.colors.black,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(20),
    },
    emptyText: {
        fontSize: scale(16),
        color: theme.colors.grayText,
        textAlign: 'center',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.white,
        overflow: 'hidden',
        height: HEADER_MAX_HEIGHT,
    },
    backgroundImageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.black,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    bar: {
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        zIndex: 999999999,
        paddingBottom: scale(10),
    },
    contentContainer: {
        marginTop: scale(-150),
        paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
        borderTopRightRadius: scale(30),
        borderTopLeftRadius: scale(30),
        backgroundColor: 'white',
    },
    businessInfo: {
        padding: scale(10),
        marginTop: scale(10),
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopRightRadius: scale(30),
        borderTopLeftRadius: scale(30),
    },
    logoContainer: {
        backgroundColor: theme.colors.grayBackground,
        width: scale(80),
        height: scale(80),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(20),
    },
    logo: {
        width: scale(40),
        height: scale(40),
    },
    businessName: {
        color: theme.colors.black,
        fontSize: scale(25),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginHorizontal: scale(20),
        flex: 1,
    },
    businessDetails: {
        padding: scale(20),
        paddingTop: scale(10),
        backgroundColor: 'white',
    },
    location: {
        color: theme.colors.grayText,
        fontSize: scale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginTop: scale(0),
        fontWeight: '400',
    },
    ratingContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scale(5),
    },
    rating: {
        backgroundColor: theme.colors.white,
    },
    ratingValue: {
        color: theme.colors.black,
        fontSize: scale(13),
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: '800',
        marginHorizontal: scale(10),
    },
    tagsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: scale(5),
    },
    categoryTag: {
        color: theme.colors.primary,
        fontSize: scale(12),
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: '800',
    },
    tag: {
        marginStart: scale(5),
        backgroundColor: theme.colors.primarylight,
        paddingHorizontal: scale(10),
        paddingVertical: scale(5),
        borderRadius: scale(20),
    },
    tagText: {
        color: theme.colors.primary,
        fontSize: scale(12),
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: '800',
    },
    favoriteButton: {
        marginTop: scale(10),
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    favoriteIcon: {
        width: scale(24),
        height: scale(24),
    },
    hoursContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: scale(1),
        paddingBottom: scale(15),
        borderBottomColor: theme.colors.line,
        marginTop: scale(10),
    },
    clockIcon: {
        width: scale(20),
        height: scale(20),
    },
    hoursText: {
        color: theme.colors.black,
        fontSize: scale(14),
        textAlign: 'left',
        fontWeight: '600',
        marginHorizontal: scale(10),
        flex: 1,
    },
    arrowIcon: {
        width: scale(15),
        height: scale(15),
    },
    sectionTitle: {
        color: theme.colors.black,
        fontSize: scale(20),
        textAlign: 'left',
        textTransform: 'capitalize',
        flex: 1,
        fontWeight: 'bold',
        marginTop: scale(20),
    },
    categoriesList: {
        marginTop: scale(15),
        marginBottom: scale(15),
    },
    categoryButton: {
        padding: scale(5),
        paddingHorizontal: scale(15),
        borderRadius: scale(17),
        marginEnd: scale(10),
    },
    categoryText: {
        fontSize: scale(15),
        fontWeight: 'bold',
    },
    serviceItem: {
        width: '100%',
        marginVertical: scale(10),
    },
    serviceContent: {
        flexDirection: 'row',
        width: '100%',
        alignSelf: 'center',
    },
    serviceInfo: {
        paddingHorizontal: scale(5),
        marginTop: scale(5),
        flex: 1,
        flexDirection: 'column',
    },
    serviceName: {
        color: theme.colors.black,
        fontSize: scale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: '800',
    },
    serviceDuration: {
        color: theme.colors.grayText,
        fontSize: scale(15),
        textAlign: 'left',
        marginTop: scale(2),
        fontWeight: '400',
    },
    servicePrice: {
        color: theme.colors.black,
        fontSize: scale(15),
        textAlign: 'left',
        marginTop: scale(2),
        fontWeight: '400',
    },
    priceCurrency: {
        color: theme.colors.black,
        fontSize: scale(12),
        textAlign: 'left',
        marginTop: scale(0),
        fontWeight: '400',
    },
    serviceImage: {
        height: scale(70),
        width: scale(70),
        borderRadius: scale(20),
    },
    selectedBadge: {
        width: scale(20),
        height: scale(20),
        backgroundColor: "#391F87",
        borderRadius: scale(7),
        position: 'absolute',
        right: scale(0),
        top: scale(-10),
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    selectedBadgeText: {
        color: theme.colors.white,
        fontWeight: '600',
        fontSize: scale(13),
    },
    subServiceInfo: {
        paddingHorizontal: scale(5),
        marginTop: scale(5),
        flex: 1,
        flexDirection: 'row',
        borderTopWidth: scale(1),
        borderTopColor: theme.colors.line,
        paddingTop: scale(10),
        marginTop: scale(10),
    },
    subServiceActions: {
        flexDirection: 'row',
        marginTop: scale(10),
    },
    closeButton: {
        width: scale(20),
        height: scale(20),
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginHorizontal: scale(10),
    },
    closeIcon: {
        width: scale(15),
        height: scale(15),
    },
    aboutText: {
        color: theme.colors.blackText,
        fontSize: scale(12),
        textAlign: 'left',
        flex: 1,
        color: theme.colors.text,
        marginTop: scale(5),
        fontWeight: '400',
    },
    mapContainer: {
        borderBottomWidth: scale(1),
        marginTop: scale(20),
        marginBottom: scale(5),
        borderBottomColor: theme.colors.line,
        borderRadius: scale(10),
        overflow: 'hidden',
        height: scale(150),
        position: 'relative',
    },
    map: {
        height: scale(150),
        borderRadius: scale(10),
    },
    mapMarker: {
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    pinIcon: {
        width: scale(30),
        height: scale(30),
    },
    branchesButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: scale(1),
        marginBottom: scale(105),
        paddingBottom: scale(10),
        borderBottomColor: theme.colors.line,
        marginTop: scale(10),
    },
    branchesText: {
        color: theme.colors.primary,
        fontSize: scale(15),
        textAlign: 'left',
        fontWeight: 'bold',
        marginHorizontal: scale(10),
        flex: 1,
    },
    branchArrowIcon: {
        width: scale(10),
        height: scale(10),
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: scale(5),
        position: 'absolute',
        bottom: scale(20),
        width: '80%',
        alignSelf: 'center',
        borderRadius: scale(10),
        paddingHorizontal: scale(15),
        paddingVertical: scale(8),
    },
    totalPrice: {
        color: theme.colors.white,
        fontSize: scale(12),
        textAlign: 'left',
        fontWeight: '800',
        flex: 1,
    },
    bookButton: {
        marginStart: scale(5),
        paddingHorizontal: scale(10),
        paddingVertical: scale(5),
        borderRadius: scale(20),
    },
    bookButtonText: {
        color: theme.colors.white,
        fontSize: scale(12),
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: '800',
    },
    blurContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    expandedHoursContainer: {
        backgroundColor: theme.colors.grayBackground,
        padding: scale(15),
        borderRadius: scale(10),
        marginTop: scale(10),
        marginBottom: scale(10),
    },
    dayHoursRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: scale(5),
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.line,
    },
    dayName: {
        color: theme.colors.black,
        fontSize: scale(14),
        fontWeight: '600',
    },
    dayHours: {
        color: theme.colors.black,
        fontSize: scale(14),
    },
    closedDay: {
        color: theme.colors.grayText,
    },
    favoriteButtonWithLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: scale(20),
        paddingHorizontal: scale(15),
        paddingVertical: scale(8),
        marginTop: scale(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        alignSelf: 'flex-start',
    },


    favoritesButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: scale(25),
        paddingHorizontal: scale(15),
        paddingVertical: scale(8),
        marginTop: scale(15),
        marginBottom: scale(5),
    },
    favoriteActive: {
        backgroundColor: theme.colors.primarylight,
    },
    favoritesButtonText: {
        marginLeft: scale(10),
        fontSize: scale(14),
        color: theme.colors.primary,
        fontWeight: '600',
    },
    favoriteActiveText: {
        color: theme.colors.primary,
    },
});

export default BranchDetails;