import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    Platform,
} from 'react-native';
import { Text } from './widget';
import { scale, moderateScale } from 'react-native-size-matters';
import { theme } from '../core/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AnimatedHeaderProps {
    scrollY: Animated.Value;
    title: string;
    location: string;
    onLocationPress: () => void;
    onSearchPress: () => void;
    onNotificationPress: () => void;
    unreadCount: number;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
    scrollY,
    title,
    location,
    onLocationPress,
    onSearchPress,
    onNotificationPress,
    unreadCount,
}) => {
    const insets = useSafeAreaInsets();

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [moderateScale(340), moderateScale(110)],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100, 200],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp',
    });

    const compactHeaderOpacity = scrollY.interpolate({
        inputRange: [0, 100, 200],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp',
    });

    const titleTranslateY = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0, -50],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View style={[styles.header, { height: headerHeight }]}>
            {/* Background Images */}
            <View style={styles.backgroundContainer}>
                <Image
                    source={require('../assets/home-background.png')}
                    style={styles.backgroundImage}
                />
                <Image
                    source={require('../assets/home-top-back.png')}
                    style={[styles.backgroundImage, styles.overlayImage]}
                />
                <Image
                    source={require('../assets/home-bottom-back.png')}
                    style={[styles.backgroundImage, styles.overlayImage]}
                />
            </View>

            {/* Expanded Header */}
            <Animated.View
                style={[
                    styles.expandedHeader,
                    {
                        opacity: headerOpacity,
                        transform: [{ translateY: titleTranslateY }],
                        paddingTop: insets.top + moderateScale(10),
                    }
                ]}
            >
                <View style={styles.topBar}>
                    <Image
                        resizeMode={'contain'}
                        source={require('../assets/logo-with-name.png')}
                        style={styles.logo}
                    />

                    <TouchableOpacity onPress={onNotificationPress}>
                        <Image
                            resizeMode={'contain'}
                            source={require('../assets/bell.png')}
                            style={styles.bellIcon}
                        />
                        {unreadCount > 0 && <View style={styles.unreadDot} />}
                    </TouchableOpacity>
                </View>

                <View style={styles.titleContainer}>
                    <Text bold style={styles.title}>{title}</Text>

                    <View style={styles.locationContainer}>
                        <Text numberOfLines={1} style={styles.location}>
                            {location}
                        </Text>
                        <TouchableOpacity onPress={onLocationPress}>
                            <Text style={styles.changeButton}>{'Change'}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={onSearchPress} style={styles.searchButton}>
                        <Image
                            resizeMode={'contain'}
                            source={require('../assets/search.png')}
                            style={styles.searchIcon}
                        />
                        <Text style={styles.searchText}>Search</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Compact Header */}
            <Animated.View
                style={[
                    styles.compactHeader,
                    {
                        opacity: compactHeaderOpacity,
                        paddingTop: insets.top + moderateScale(10),
                    }
                ]}
            >
                <View style={styles.compactContent}>
                    <View style={styles.compactLocationContainer}>
                        <Text style={styles.compactLocation}>{location}</Text>
                        <TouchableOpacity onPress={onLocationPress}>
                            <Text style={styles.compactChangeButton}>{'Change'}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={onSearchPress} style={styles.compactSearchButton}>
                        <Image
                            resizeMode={'contain'}
                            source={require('../assets/search.png')}
                            style={styles.searchIcon}
                        />
                        <Text style={styles.searchText}>Search</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Bottom Curved Section */}
            <View style={styles.bottomCurve} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        overflow: 'hidden',
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    backgroundImage: {
        width: '100%',
        height: moderateScale(400),
    },
    overlayImage: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    expandedHeader: {
        flex: 1,
        paddingHorizontal: moderateScale(20),
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: moderateScale(35),
    },
    logo: {
        height: moderateScale(40),
        width: moderateScale(130),
    },
    bellIcon: {
        height: moderateScale(20),
        width: moderateScale(20),
    },
    unreadDot: {
        width: moderateScale(10),
        height: moderateScale(10),
        backgroundColor: theme.colors.primary,
        position: 'absolute',
        right: 0,
        top: 0,
        borderRadius: moderateScale(5),
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        color: theme.colors.white,
        fontSize: moderateScale(35),
        lineHeight: moderateScale(40),
        marginBottom: Platform.OS === 'android' ? moderateScale(5) : 0,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(10),
    },
    location: {
        color: theme.colors.white,
        fontSize: moderateScale(14),
        flex: 1,
        textTransform: 'capitalize',
    },
    changeButton: {
        color: theme.colors.white,
        fontSize: moderateScale(15),
        textTransform: 'capitalize',
        fontWeight: 'bold',
        marginLeft: moderateScale(20),
    },
    searchButton: {
        borderRadius: moderateScale(100),
        backgroundColor: theme.colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        height: moderateScale(45),
        paddingHorizontal: moderateScale(25),
        marginTop: moderateScale(20),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    searchIcon: {
        height: moderateScale(20),
        width: moderateScale(20),
        marginRight: moderateScale(10),
    },
    searchText: {
        color: theme.colors.gray,
        fontSize: moderateScale(15),
    },
    compactHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.white,
        paddingHorizontal: moderateScale(20),
    },
    compactContent: {
        paddingTop: moderateScale(10),
        paddingBottom: moderateScale(20),
    },
    compactLocationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(10),
    },
    compactLocation: {
        color: theme.colors.black,
        fontSize: moderateScale(14),
        flex: 1,
        textTransform: 'capitalize',
    },
    compactChangeButton: {
        color: theme.colors.primary,
        fontSize: moderateScale(15),
        textTransform: 'capitalize',
        fontWeight: 'bold',
    },
    compactSearchButton: {
        borderRadius: moderateScale(100),
        backgroundColor: theme.colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        height: moderateScale(45),
        paddingHorizontal: moderateScale(25),
        marginTop: moderateScale(15),
        marginHorizontal: moderateScale(10),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    bottomCurve: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: moderateScale(60),
        backgroundColor: theme.colors.white,
        borderTopRightRadius: moderateScale(30),
        borderTopLeftRadius: moderateScale(30),
    },
});

export default AnimatedHeader;