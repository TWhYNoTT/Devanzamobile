import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Animated,
    TouchableOpacity,
    Platform,
    Dimensions,
    FlatList,
    ScrollView,
    StatusBar,
} from 'react-native';
import {
    useNavigation,
    useRoute,
} from '@react-navigation/native';
import { Text } from '../../../components/widget';

import { scale, moderateScale } from 'react-native-size-matters';
import {
    showDanger,
    translate
} from '../../../utils/utils';
import BottomSheet from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import moment from 'moment';
import { theme } from '../../../core/theme';

const Browse = () => {
    const [scrollY] = useState(new Animated.Value(0));
    const [categories, setCategories] = useState([]);
    const [unread, setUnread] = useState(0);
    const [connectionIssue, setConnectionIssue] = useState(false);
    const navigation = useNavigation();
    const bottomSheetRef = useRef(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Location permission not granted.');
                    return;
                }

                const location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;
                loadHome({ lat: latitude, lng: longitude });
            } catch (error) {
                console.error('Error fetching location:', error);
                setConnectionIssue(true);
            }
        };

        initialize();
    }, []);

    const loadHome = async (location) => {
        try {
            console.log('Fetching data for location:', location);
            // Simulated API call
            const response = {
                categories: [
                    { name: 'Salon', image: 'https://via.placeholder.com/150' },
                    { name: 'Spa', image: 'https://via.placeholder.com/150' },
                ],
                unread: 5,
            };
            setCategories(response.categories);
            setUnread(response.unread);
        } catch (error) {
            console.error('Error loading home data:', error);
            setConnectionIssue(true);
        }
    };

    const renderCategory = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('CategoryDetails', { item })}
        >
            <View style={styles.categoryContainer}>
                <Image source={{ uri: item.image }} style={styles.categoryImage} />
                <Text bold style={styles.categoryText}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderBookings = ({ item, index }) => (
        <View key={`booking-${index}`} style={styles.bookingContainer}>
            <Text style={styles.bookingText}>{translate('Booking Placeholder')}</Text>
        </View>
    );

    const renderContent = () => (
        <View style={{ flex: 1 }}>
            <Text>{translate('Search View')}</Text>
        </View>
    );

    const headerHeight = scrollY.interpolate({
        inputRange: [0, moderateScale(200)],
        outputRange: [moderateScale(340), moderateScale(150)],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={Platform.OS === 'android' ? theme.colors.primarydark : 'transparent'}
                barStyle="light-content"
            />
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={["1%", "95%"]}
                borderRadius={moderateScale(20)}
                index={0}
                enablePanDownToClose
            >
                {renderContent()}
            </BottomSheet>
            <Animated.View style={[styles.header, { height: headerHeight }]}>
                <Image
                    source={require('../../../assets/home-background.png')}
                    style={styles.headerBackground}
                />
                <Text bold style={styles.headerTitle}>{translate('Discover salons near you')}</Text>
            </Animated.View>
            <ScrollView
                contentContainerStyle={{ paddingBottom: moderateScale(150) }}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <View style={styles.contentWrapper}>
                    <Text bold style={styles.sectionTitle}>{translate('Categories')}</Text>
                    <FlatList
                        horizontal
                        data={categories}
                        renderItem={renderCategory}
                        keyExtractor={(item, index) => `category-${index}`}
                    />

                    <Text bold style={styles.sectionTitle}>{translate('Bookings')}</Text>
                    <FlatList
                        horizontal
                        data={[{}, {}, {}]} // Replace with actual bookings data
                        renderItem={renderBookings}
                        keyExtractor={(item, index) => `booking-${index}`}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
    },
    headerBackground: {
        height: '100%',
        width: '100%',
    },
    headerTitle: {
        color: theme.colors.white,
        fontSize: moderateScale(35),
        textAlign: 'left',
        marginTop: moderateScale(55),
        paddingHorizontal: moderateScale(20),
    },
    contentWrapper: {
        marginTop: moderateScale(340),
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        paddingHorizontal: moderateScale(10),
    },
    sectionTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: theme.colors.black,
        marginVertical: moderateScale(10),
    },
    categoryContainer: {
        margin: moderateScale(5),
        alignItems: 'center',
    },
    categoryImage: {
        width: moderateScale(130),
        height: moderateScale(180),
        borderRadius: moderateScale(10),
    },
    categoryText: {
        color: theme.colors.black,
        fontSize: moderateScale(14),
        textAlign: 'center',
        marginTop: moderateScale(5),
    },
    bookingContainer: {
        margin: moderateScale(10),
        padding: moderateScale(10),
        backgroundColor: theme.colors.grayBackground,
        borderRadius: moderateScale(10),
    },
    bookingText: {
        color: theme.colors.black,
        fontSize: moderateScale(15),
        textAlign: 'center',
    },
});

export default Browse;
