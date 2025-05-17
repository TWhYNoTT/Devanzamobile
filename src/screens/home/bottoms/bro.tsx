import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Dimensions,
    Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView, FlatList } from 'react-native-gesture-handler';
import { Image as ExpoImage } from 'expo-image';

import { theme } from '../../../core/theme';
import { Text } from '../../../components/widget';
import { FONT_FAMILY } from '../../../services/config';
import { translate } from '../../../utils/utils';
import Notifications from '../bottoms/childs/Notifications';
import SearchView from "../bottoms/pages/browse/search/search";

const HEADER_MAX_HEIGHT = moderateScale(340);
const HEADER_MIN_HEIGHT = moderateScale(150);
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface UpcomingBooking {
    id: string;
    name: string;
    time: string;
    date: string;
    status: string;
    image: any;
}

interface Category {
    id: string;
    name: string;
    image: any;
}

interface Spa {
    id: string;
    name: string;
    type: string;
    gender: string;
    rating: string;
    location: string;
    image: any;
}

const CATEGORIES: Category[] = [
    {
        id: '1',
        name: translate('Facials'),
        image: require('../../../assets/dummy2.png')
    },
    {
        id: '2',
        name: translate('Massage'),
        image: require('../../../assets/dummy4.png')
    },
    {
        id: '3',
        name: translate('Salon'),
        image: require('../../../assets/dummy3.png')
    }
];

const SPAS: Spa[] = [
    {
        id: '1',
        name: 'Pastels Salon Ritz Carlton JBR',
        type: translate('Beauty salon'),
        gender: translate('Men only'),
        rating: '4.1',
        location: 'The Ritz Carlton hotel - Dubai',
        image: require('../../../assets/dummy1.png')
    }
];

const UPCOMING: UpcomingBooking[] = [
    {
        id: '1',
        name: 'Pastels Salon',
        time: '05:51 PM',
        date: 'Dec 18',
        status: translate('Approved'),
        image: require('../../../assets/dummy4.png')
    }
];

interface BrowseProps {
    navigation: any;
}

export const Browse: React.FC<BrowseProps> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const searchRef = useRef<BottomSheet>(null);
    const [notification, setNotification] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;

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
    const renderHeader = () => (
        <Animated.View style={[styles.headerContainer, {
            height: headerHeight,
            opacity: headerOpacity
        }]}>
            <ExpoImage
                source={require('../../../assets/home-background.png')}
                style={styles.headerBackground}
                contentFit="cover"
            />
            <View style={styles.overlay} />

            <View style={[styles.navBar, { marginTop: insets.top }]}>
                <View style={styles.logoContainer}>
                    <ExpoImage
                        source={require('../../../assets/logo-with-name.png')}
                        style={styles.logo}
                        contentFit="contain"
                    />
                </View>
                <TouchableOpacity onPress={() => {
                    Haptics.selectionAsync();
                    setNotification(true);
                }}>
                    <ExpoImage
                        source={require('../../../assets/bell.png')}
                        style={styles.notificationIcon}
                        contentFit="contain"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>
                    {translate('Discover salons')}{'\n'}{translate('near you')}
                </Text>
                <View style={styles.locationRow}>
                    <Text style={styles.locationText}>Dubai, United Arab Emirates</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('LocationPicker')}>
                        <Text style={styles.changeText}>{translate('Change')}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.searchBar}
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
    );

    const renderBooking = ({ item }: { item: UpcomingBooking }) => (
        <TouchableOpacity
            style={styles.bookingCard}
            onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('BookingDetails', { item });
            }}
        >
            <View style={styles.bookingImageContainer}>
                <ExpoImage source={item.image} style={styles.bookingImage} contentFit="cover" />
            </View>
            <View style={styles.bookingContent}>
                <Text style={styles.bookingTitle}>{item.name}</Text>
                <View style={styles.bookingDetails}>
                    <View>
                        <Text style={styles.detailLabel}>{translate('Time')}</Text>
                        <Text style={styles.detailValue}>{item.time}</Text>
                    </View>
                    <View style={{ marginLeft: moderateScale(30) }}>
                        <Text style={styles.detailLabel}>{translate('Date')}</Text>
                        <Text style={styles.detailValue}>{item.date}</Text>
                    </View>
                </View>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderCategory = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('categoriesDetails', { item });
            }}
        >
            <ExpoImage source={item.image} style={styles.categoryImage} contentFit="cover" />
            <View style={styles.categoryOverlay} />
            <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderSpa = ({ item }: { item: Spa }) => (
        <TouchableOpacity
            style={styles.spaCard}
            onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('branchDetails', { item });
            }}
        >
            <View style={styles.spaImageContainer}>
                <ExpoImage source={item.image} style={styles.spaImage} contentFit="cover" />
                <TouchableOpacity
                    style={styles.likeButton}
                    onPress={() => Haptics.selectionAsync()}
                >
                    <ExpoImage
                        source={require('../../../assets/like.png')}
                        style={styles.likeIcon}
                        contentFit="contain"
                        tintColor="white"
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.spaContent}>
                <Text style={styles.spaName}>{item.name}</Text>
                <View style={styles.spaDetails}>
                    <View style={styles.spaTypeContainer}>
                        <Text style={styles.spaType}>{item.type}</Text>
                        <View style={styles.genderPill}>
                            <Text style={styles.genderText}>{item.gender}</Text>
                        </View>
                    </View>
                    <View style={styles.ratingContainer}>
                        <ExpoImage
                            source={require('../../../assets/star.png')}
                            style={styles.starIcon}
                            contentFit="contain"
                        />
                        <Text style={styles.rating}>{item.rating}</Text>
                    </View>
                </View>
                <Text style={styles.location}>{item.location}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderSection = (title: string, data: any[], renderItem: any) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{translate(title)}</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>{translate('See all')}</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );








    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar style="light" />

            <Animated.ScrollView
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingTop: HEADER_MAX_HEIGHT,
                    paddingBottom: moderateScale(20)
                }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mainContent}>
                    {UPCOMING.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{translate('Upcoming')}</Text>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={UPCOMING}
                                renderItem={renderBooking}
                                contentContainerStyle={styles.listContent}
                            />
                        </View>
                    )}

                    {renderSection('Categories', CATEGORIES, renderCategory)}
                    {renderSection('Top spa picks', SPAS, renderSpa)}
                    {renderSection('Best for massages', SPAS, renderSpa)}
                </View>
            </Animated.ScrollView>

            {renderHeader()}

            {/* <BottomSheet
                ref={searchRef}
                snapPoints={["25%", "90%"]}
                enablePanDownToClose
                index={-1}
            >
                <SearchView
                    hide={() => searchRef.current?.close()}
                    navigation={navigation}
                />
            </BottomSheet> */}

            {notification && (
                <Notifications Hide={() => setNotification(false)} />
            )}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white
    },
    headerContainer: {
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
        width: '100%',
        height: '100%'
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(10)
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    logo: {
        width: moderateScale(130),
        height: moderateScale(40)
    },
    notificationIcon: {
        width: moderateScale(24),
        height: moderateScale(24),
        tintColor: 'white'
    },
    headerContent: {
        paddingHorizontal: moderateScale(20),
        marginTop: moderateScale(20)
    },
    headerTitle: {
        color: 'white',
        fontSize: moderateScale(36),
        fontWeight: 'bold',
        lineHeight: moderateScale(44),
        marginBottom: moderateScale(15)
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: moderateScale(20)
    },
    locationText: {
        color: 'white',
        fontSize: moderateScale(16),
        flex: 1
    },
    changeText: {
        color: 'white',
        fontSize: moderateScale(16),
        fontWeight: '600'
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: moderateScale(30),
        height: moderateScale(50),
        paddingHorizontal: moderateScale(20),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4
            },
            android: {
                elevation: 4
            }
        })
    },
    searchIcon: {
        width: moderateScale(20),
        height: moderateScale(20),
        marginRight: moderateScale(10)
    },
    searchText: {
        color: theme.colors.gray,
        fontSize: moderateScale(16)
    },
    mainContent: {
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        paddingTop: moderateScale(20),
        minHeight: Dimensions.get('window').height - HEADER_MIN_HEIGHT
    },
    section: {
        marginBottom: moderateScale(30)
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(20),
        marginBottom: moderateScale(15)
    },
    sectionTitle: {
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        color: theme.colors.black,
        fontFamily: FONT_FAMILY
    },
    seeAll: {
        color: theme.colors.primary,
        fontSize: moderateScale(14),
        fontWeight: '600',
        fontFamily: FONT_FAMILY
    },
    listContent: {
        paddingHorizontal: moderateScale(15)
    },



    bookingCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: moderateScale(20),
        padding: moderateScale(15),
        marginHorizontal: moderateScale(5),
        width: moderateScale(300),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4
            },
            android: {
                elevation: 3
            }
        })
    },
    bookingImageContainer: {
        width: moderateScale(70),
        height: moderateScale(70),
        borderRadius: moderateScale(15),
        overflow: 'hidden'
    },
    bookingImage: {
        width: '100%',
        height: '100%'
    },
    bookingContent: {
        flex: 1,
        marginLeft: moderateScale(15)
    },
    bookingTitle: {
        fontSize: moderateScale(18),
        fontWeight: '600',
        marginBottom: moderateScale(10),
        fontFamily: FONT_FAMILY
    },
    bookingDetails: {
        flexDirection: 'row',
        marginBottom: moderateScale(10)
    },
    detailLabel: {
        color: theme.colors.gray,
        fontSize: moderateScale(14),
        marginBottom: moderateScale(4),
        fontFamily: FONT_FAMILY
    },
    detailValue: {
        fontSize: moderateScale(15),
        fontWeight: '500',
        fontFamily: FONT_FAMILY
    },
    statusContainer: {
        backgroundColor: theme.colors.success,
        alignSelf: 'flex-start',
        paddingHorizontal: moderateScale(15),
        paddingVertical: moderateScale(5),
        borderRadius: moderateScale(20)
    },
    statusText: {
        color: 'white',
        fontSize: moderateScale(12),
        fontWeight: '600',
        fontFamily: FONT_FAMILY
    },
    // Category Card Styles
    categoryCard: {
        width: moderateScale(160),
        height: moderateScale(180),
        marginHorizontal: moderateScale(5),
        borderRadius: moderateScale(20),
        overflow: 'hidden'
    },
    categoryImage: {
        width: '100%',
        height: '100%'
    },
    categoryOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    categoryName: {
        position: 'absolute',
        top: moderateScale(15),
        left: moderateScale(15),
        color: 'white',
        fontSize: moderateScale(24),
        fontWeight: '600',
        fontFamily: FONT_FAMILY,
        zIndex: 1
    },
    // Spa Card Styles
    spaCard: {
        width: moderateScale(300),
        marginHorizontal: moderateScale(5)
    },
    spaImageContainer: {
        height: moderateScale(180),
        borderRadius: moderateScale(20),
        overflow: 'hidden'
    },
    spaImage: {
        width: '100%',
        height: '100%'
    },
    likeButton: {
        position: 'absolute',
        top: moderateScale(15),
        right: moderateScale(15),
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(18),
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    likeIcon: {
        width: moderateScale(20),
        height: moderateScale(20)
    },
    spaContent: {
        padding: moderateScale(10)
    },
    spaName: {
        fontSize: moderateScale(18),
        fontWeight: '600',
        marginBottom: moderateScale(8),
        fontFamily: FONT_FAMILY
    },
    spaDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: moderateScale(5)
    },
    spaTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    spaType: {
        color: theme.colors.primary,
        fontSize: moderateScale(14),
        marginRight: moderateScale(8),
        fontFamily: FONT_FAMILY
    },
    genderPill: {
        backgroundColor: theme.colors.primaryLight,
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(15)
    },
    genderText: {
        color: theme.colors.primary,
        fontSize: moderateScale(12),
        fontWeight: '500',
        fontFamily: FONT_FAMILY
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    starIcon: {
        width: moderateScale(16),
        height: moderateScale(16),
        marginRight: moderateScale(4)
    },
    rating: {
        fontSize: moderateScale(14),
        fontWeight: '500',
        fontFamily: FONT_FAMILY
    },
    location: {
        color: theme.colors.gray,
        fontSize: moderateScale(14),
        fontFamily: FONT_FAMILY
    }
});

export default React.memo(Browse);