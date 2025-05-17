import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Modal,
    TouchableOpacity,
    Platform,
    StatusBar,
    Dimensions,
    ScrollView,
    Animated,
    NativeSyntheticEvent,
    NativeScrollEvent
} from 'react-native';
import { Button } from 'react-native-paper';
import { theme } from '../../../core/theme';
import { Text } from '../../../components/widget';
import { scale, moderateScale } from 'react-native-size-matters';
import { FONT_FAMILY } from '../../../services/config';
import { showDanger, translate } from '../../../utils/utils';
import { FlatList } from 'react-native-gesture-handler';
import Notifications from '../bottoms/childs/Notifications';
import { LayoutAnimation } from 'react-native';
import * as Location from 'expo-location';
import BottomSheet from '@gorhom/bottom-sheet';
import { TapGestureHandler } from 'react-native-gesture-handler';
import moment from 'moment';
import SearchView from "../bottoms/pages/browse/search/search";

// Constants
const HEADER_MAX_HEIGHT = moderateScale(340);
const HEADER_MIN_HEIGHT = moderateScale(150);
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

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

// Mock Data
const MOCK_LOCATION: LocationData = {
    geometry: {
        lat: 25.2048,
        lng: 55.2708
    },
    location: 'Dubai, United Arab Emirates'
};

const MOCK_CATEGORIES: Category[] = [
    {
        _id: '1',
        name: 'Hair Salon',
        image: 'hair-salon.jpg'
    },
    {
        _id: '2',
        name: 'Spa',
        image: 'spa.jpg'
    }
];

const MOCK_BOOKINGS: Booking[] = [
    {
        _id: '1',
        branch: { name: 'Luxury Spa Center' },
        bookingdDate: new Date().toISOString(),
        status: '1'
    }
];

const MOCK_BRANCHES: Branch[] = [
    {
        _id: '1',
        name: 'Luxury Spa Center',
        location: 'Dubai Marina',
        type: 'Spa & Wellness',
        rating: 4.8
    },
    {
        _id: '2',
        name: 'Elite Beauty Salon',
        location: 'Downtown Dubai',
        type: 'Beauty Salon',
        rating: 4.5
    }
];

export const Browse: React.FC<BrowseProps> = ({ navigation }) => {
    // Animated Values
    const scrollY = useRef(new Animated.Value(0)).current;
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

    // State
    const [searchText, setSearchText] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [notification, setNotification] = useState(false);
    const [internet, setInternet] = useState(true);
    const [notNowLoading, setNotNowLoading] = useState(false);
    const [unread, setUnread] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [connectionIssue, setConnectionIssue] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<LocationData>(MOCK_LOCATION);

    // Refs
    const searchRef = useRef<BottomSheet>(null);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        initializeComponent();
    }, []);

    const initializeComponent = async () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setIsLoading(true);
        await loadHome(selectedLocation.geometry);
    };

    const loadHome = async (location: LocationGeometry) => {
        if (location.lat !== undefined) {
            setIsLoading(true);
            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                setCategories(MOCK_CATEGORIES);
                setConnectionIssue(false);
                await getNotifications();
            } catch (error) {
                setConnectionIssue(true);
                console.error('Load home error:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const getNotifications = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setUnread(3);
        } catch (error) {
            console.error('Notifications error:', error);
            setIsLoading(false);
        }
    };

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
    );

    const renderHeader = () => (
        <Animated.View style={[styles.header, { height: headerHeight }]} >
            <Animated.View style={[styles.headerBackground, { opacity: headerOpacity }]}>
                <Image
                    source={require('../../../assets/home-background.png')}
                    style={styles.headerBackgroundImage}
                />
                <Image
                    source={require('../../../assets/home-top-back.png')}
                    style={styles.headerTopOverlay}
                />
                <Image
                    source={require('../../../assets/home-bottom-back.png')}
                    style={styles.headerBottomOverlay}
                />
            </Animated.View>

            < View style={styles.headerContent} >
                <Image
                    resizeMode={'contain'}
                    source={require('../../../assets/logo-with-name.png')}
                    style={styles.headerLogo}
                />
                <TouchableOpacity
                    style={styles.notificationButton}
                    onPress={() => setNotification(true)}
                >
                    <Image
                        resizeMode={'contain'}
                        source={require('../../../assets/bell.png')}
                        style={styles.notificationIcon}
                    />
                    {unread > 0 && <View style={styles.notificationBadge} />}
                </TouchableOpacity>
            </View>

            < View style={styles.headerTitleContainer} >
                <Text bold style={styles.headerTitle} >
                    Discover salons near you
                </Text>

                < View style={styles.locationContainer} >
                    <Text numberOfLines={1} style={styles.locationText} >
                        {selectedLocation.location}
                    </Text>
                    < TouchableOpacity
                        onPress={() => navigation.navigate('LocationPicker')}
                    >
                        <Text style={styles.changeLocationText}> Change </Text>
                    </TouchableOpacity>
                </View>

                < TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => searchRef.current?.expand()}
                >
                    <Image
                        resizeMode={'contain'}
                        source={require('../../../assets/search.png')}
                        style={styles.searchIcon}
                    />
                    <Text style={styles.searchText}> Search </Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
    // Render Methods
    const renderCategory = useCallback(({ item, index }: { item: Category; index: number }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('categoriesDetails', { item })}
            style={styles.categoryItem}
        >
            <Text bold style={styles.categoryName} > {item.name} </Text>
            < View style={styles.categoryImageContainer} >
                <Image
                    source={{ uri: item.image }}
                    style={styles.categoryImage}
                    resizeMode="cover"
                />
                <Image
                    source={require('../../../assets/categoryshowdow.png')}
                    style={styles.categoryOverlay}
                />
            </View>
        </TouchableOpacity>
    ), [navigation]);

    const renderBranch = useCallback(({ item }: { item: Branch }) => (
        <TouchableOpacity
            style={styles.branchItem}
            onPress={() => navigation.navigate('branchDetails', { item })}
        >
            <View style={styles.branchImageContainer}>
                <Image
                    source={require('../../../assets/dummy1.png')}
                    style={styles.branchImage}
                />
                <TouchableOpacity style={styles.likeButton}>
                    <Image
                        source={require('../../../assets/like.png')}
                        style={styles.likeIcon}
                    />
                </TouchableOpacity>
            </View>
            < View style={styles.branchInfo} >
                <Text bold style={styles.branchName} > {item.name} </Text>
                < View style={styles.branchDetails} >
                    <Text style={styles.branchType}> {item.type} </Text>
                    < View style={styles.ratingContainer} >
                        <Image
                            source={require('../../../assets/star.png')}
                            style={styles.starIcon}
                        />
                        <Text style={styles.rating}> {item.rating} </Text>
                    </View>
                </View>
                < Text style={styles.branchLocation} > {item.location} </Text>
            </View>
        </TouchableOpacity>
    ), [navigation]);

    // Main Render
    return (
        <View style={styles.container} >
            <StatusBar
                backgroundColor={Platform.OS === 'android' ? theme.colors.primarydark : 'transparent'}
                barStyle="light-content"
            />

            {renderHeader()}

            < ScrollView
                ref={scrollViewRef}
                scrollEventThrottle={16}
                onScroll={handleScroll}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Main Content */}
                < View style={styles.mainContent} >
                    {/* Categories Section */}
                    < View style={styles.section} >
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}> Categories </Text>
                            < TouchableOpacity onPress={() => navigation.navigate('categories')}>
                                <Text style={styles.seeAllText}> See All </Text>
                            </TouchableOpacity>
                        </View>
                        < FlatList
                            horizontal
                            data={categories}
                            renderItem={renderCategory}
                            keyExtractor={item => item._id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoryList}
                        />
                    </View>

                    {/* Top Picks Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}> Top spa picks </Text>
                            < TouchableOpacity onPress={() => navigation.navigate('viewAll')}>
                                <Text style={styles.seeAllText}> See All </Text>
                            </TouchableOpacity>
                        </View>
                        < FlatList
                            horizontal
                            data={MOCK_BRANCHES}
                            renderItem={renderBranch}
                            keyExtractor={item => item._id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.branchList}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Sheet */}
            {/* <BottomSheet
                ref={searchRef}
                snapPoints={["25%", "95%"]}
                enablePanDownToClose
                index={0}
                onChange={() => { }}
            >
                <SearchView
                    hide={() => searchRef.current?.close()}
                    navigation={navigation}
                />
            </BottomSheet> */}

            {/* Notifications Modal */}
            {
                notification && (
                    <Notifications Hide={() => setNotification(false)} />
                )
            }
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
        zIndex: 1
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    // ... continuing styles
    headerBackgroundImage: {
        width: '100%',
        height: '100%'
    },
    headerTopOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    headerBottomOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    headerContent: {
        width: '100%',
        paddingHorizontal: moderateScale(20),
        marginTop: Platform.OS === 'ios' ? moderateScale(55) : moderateScale(25),
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
        top: 0,
        right: 0,
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
        zIndex: 1
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
        width: '100%',
        height: '100%',
        borderRadius: moderateScale(10)
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    likeIcon: {
        width: moderateScale(40),
        height: moderateScale(40),
        tintColor: theme.colors.white
    },
    branchInfo: {
        padding: moderateScale(10)
    },
    branchName: {
        fontSize: moderateScale(15),
        color: theme.colors.black,
        marginBottom: moderateScale(5)
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
        fontWeight: '600'
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
        fontWeight: '500'
    },
    branchLocation: {
        fontSize: moderateScale(15),
        color: theme.colors.grayText
    }
});

export default React.memo(Browse);