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

// Mock Data
const CATEGORIES = [
    {
        id: '1',
        name: 'Facials',
        image: require('../../../assets/dummy2.png')
    },
    {
        id: '2',
        name: 'Massage',
        image: require('../../../assets/dummy4.png')
    },
    {
        id: '3',
        name: 'Salon',
        image: require('../../../assets/dummy3.png')
    }
];

const SPAS = [
    {
        id: '1',
        name: 'Pastels Salon Ritz Carlton JBR',
        type: 'Beauty salon',
        gender: 'Men only',
        rating: '4.1',
        location: 'The Ritz Carlton hotel - Dubai',
        image: require('../../../assets/dummy1.png')
    }
];

const UPCOMING = [
    {
        id: '1',
        name: 'Pastels Salon',
        time: '05:51 PM',
        date: 'Dec 18',
        status: 'Approved',
        image: require('../../../assets/dummy4.png')
    }
];

export const Browse = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const searchRef = useRef(null);
    const [notification, setNotification] = useState(false);

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <ExpoImage
                source={require('../../../assets/home-background.png')}
                style={styles.headerBackground}
                contentFit="cover"
            />
            <View style={styles.overlay} />

            {/* Logo and Notification */}
            <View style={[styles.navBar, { marginTop: insets.top }]}>
                <View style={styles.logoContainer}>
                    <ExpoImage
                        source={require('../../../assets/logo.png')}
                        style={styles.logo}
                        contentFit="contain"
                    />
                    <Text style={styles.logoText}>Devanza</Text>
                </View>
                <TouchableOpacity onPress={() => setNotification(true)}>
                    <ExpoImage
                        source={require('../../../assets/bell.png')}
                        style={styles.notificationIcon}
                        contentFit="contain"
                    />
                </TouchableOpacity>
            </View>

            {/* Title and Location */}
            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>
                    Discover salons{'\n'}near you
                </Text>
                <View style={styles.locationRow}>
                    <Text style={styles.locationText}>Dubai, United Arab Emirates</Text>
                    <TouchableOpacity>
                        <Text style={styles.changeText}>Change</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <TouchableOpacity
                    style={styles.searchBar}
                    onPress={() => searchRef.current?.expand()}
                >
                    <ExpoImage
                        source={require('../../../assets/search.png')}
                        style={styles.searchIcon}
                        contentFit="contain"
                    />
                    <Text style={styles.searchText}>Search</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderBooking = ({ item }) => (
        <TouchableOpacity style={styles.bookingCard}>
            <View style={styles.bookingImageContainer}>
                <ExpoImage source={item.image} style={styles.bookingImage} contentFit="cover" />
            </View>
            <View style={styles.bookingContent}>
                <Text style={styles.bookingTitle}>{item.name}</Text>
                <View style={styles.bookingDetails}>
                    <View>
                        <Text style={styles.detailLabel}>Time</Text>
                        <Text style={styles.detailValue}>{item.time}</Text>
                    </View>
                    <View style={{ marginLeft: moderateScale(30) }}>
                        <Text style={styles.detailLabel}>Date</Text>
                        <Text style={styles.detailValue}>{item.date}</Text>
                    </View>
                </View>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderCategory = ({ item }) => (
        <TouchableOpacity style={styles.categoryCard}>
            <ExpoImage source={item.image} style={styles.categoryImage} contentFit="cover" />
            <View style={styles.categoryOverlay} />
            <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderSpa = ({ item }) => (
        <TouchableOpacity style={styles.spaCard}>
            <View style={styles.spaImageContainer}>
                <ExpoImage source={item.image} style={styles.spaImage} contentFit="cover" />
                <TouchableOpacity style={styles.likeButton}>
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

    const renderSection = (title, data, renderItem) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See all</Text>
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

            {renderHeader()}

            <View style={styles.content}>
                {UPCOMING.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Upcoming</Text>
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
        backgroundColor: theme.colors.white,
    },
    // Header Styles
    headerContainer: {
        height: moderateScale(340),
        width: '100%',
        overflow: 'hidden'
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
        width: moderateScale(32),
        height: moderateScale(32)
    },
    logoText: {
        color: 'white',
        fontSize: moderateScale(20),
        fontWeight: '600',
        marginLeft: moderateScale(8)
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
    // Content Styles
    content: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: moderateScale(-30),
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        paddingTop: moderateScale(20)
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
        color: theme.colors.black
    },
    seeAll: {
        color: theme.colors.primary,
        fontSize: moderateScale(14),
        fontWeight: '600'
    },
    listContent: {
        paddingHorizontal: moderateScale(15)
    },
    // Upcoming Booking Card
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
        marginBottom: moderateScale(10)
    },
    bookingDetails: {
        flexDirection: 'row',
        marginBottom: moderateScale(10)
    },
    detailLabel: {
        color: theme.colors.gray,
        fontSize: moderateScale(14),
        marginBottom: moderateScale(4)
    },
    detailValue: {
        fontSize: moderateScale(15),
        fontWeight: '500'
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
        fontWeight: '600'
    },
    // Category Card
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
        fontWeight: '600'
    },
    // Spa Card
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
        marginBottom: moderateScale(8)
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
        marginRight: moderateScale(8)
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
        fontWeight: '500'
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
        fontWeight: '500'
    },
    location: {
        color: theme.colors.gray,
        fontSize: moderateScale(14)
    }
});

export default React.memo(Browse);