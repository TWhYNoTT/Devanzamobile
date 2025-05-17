import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Animated,
    Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image as ExpoImage } from 'expo-image';
import { theme } from '../../../../core/theme';
import { Text } from '../../../../components/widget';
import Header from '../childs/Header';
import { showSuccess, translate } from '../../../../utils/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import hooks for real data
import { useSalons } from '../../../../hooks/useSalons';
import { useFavorites } from '../../../../hooks/useFavorites';
import { SalonDto } from '../../../../types/api.types';

// Simple scaling function
const { width: screenWidth } = Dimensions.get('window');
const scale = (size: number) => (screenWidth / 375) * size;

// Route params interface
interface RouteParams {
    categoryId: number;
    categoryName: string;
    image: any;
}

// Custom ScrollView with animated header
const AnimatedHeader: React.FC<{
    children: React.ReactNode;
    image: any;
    title: string;
    onBackPress: () => void
}> = ({ children, image, title, onBackPress }) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const headerHeight = scale(230);

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -headerHeight / 2],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, headerHeight / 2, headerHeight],
        outputRange: [1, 1, 0],
        extrapolate: 'clamp',
    });

    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="light" />

            {/* Fixed Header */}
            <View style={styles.fixedHeader}>
                <Header
                    backPress={onBackPress}
                    search={false}
                    backPrimary={false}
                    back={true}
                    Text={translate('')}
                    color={'transparent'}
                />
            </View>

            {/* Animated Header Image */}
            <Animated.View
                style={[
                    styles.headerImageContainer,
                    {
                        transform: [{ translateY: headerTranslateY }],
                        opacity: headerOpacity,
                    }
                ]}
            >
                <ExpoImage
                    source={image}
                    style={styles.headerImage}
                    contentFit="cover"
                />
                <ExpoImage
                    source={require('../../../../assets/home-top-back.png')}
                    style={styles.headerOverlay}
                    contentFit="cover"
                />
                <ExpoImage
                    source={require('../../../../assets/home-bottom-back.png')}
                    style={styles.headerOverlay}
                    contentFit="cover"
                />

                <Text bold style={styles.headerTitle}>{title}</Text>
            </Animated.View>

            {/* Scrollable Content */}
            <Animated.ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingTop: headerHeight }}
            >
                <View style={styles.contentContainer}>
                    {children}
                </View>
            </Animated.ScrollView>
        </View>
    );
};

// Salon item with favorite functionality
interface FormattedSalon extends SalonDto {
    image: any;
    isLike?: boolean;
    isLoading?: boolean;
}

const CategoriesDetails: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const params = route.params as RouteParams;

    // State
    const [isLoading, setIsLoading] = useState(true);
    const [formattedSalons, setFormattedSalons] = useState<FormattedSalon[]>([]);

    // Hooks
    const { searchByCategory, isLoadingNearby } = useSalons();
    const { favorites, addToFavorites, removeFromFavorites, isLoading: favoritesLoading } = useFavorites();

    // Fetch salons by category
    const getSalonsByCategory = async () => {
        if (!params?.categoryId) return;

        setIsLoading(true);
        try {
            const results = await searchByCategory(params.categoryId);

            if (results && results.salons) {
                // Format salon data with dummy images
                const formatted = results.salons.map(salon => ({
                    ...salon,
                    image: require('../../../../assets/dummy1.png'),
                    isLike: favorites.some(fav => fav.businessId === salon.id),
                    isLoading: false
                }));

                setFormattedSalons(formatted);
            }
        } catch (error) {
            console.error('Error fetching salons by category:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch and update when favorites change
    useEffect(() => {
        getSalonsByCategory();
    }, [params.categoryId, favorites]);

    // Handle favorite toggle
    const handleFavoriteToggle = async (salon: FormattedSalon, index: number) => {
        const updatedSalons = [...formattedSalons];
        updatedSalons[index].isLoading = true;
        setFormattedSalons(updatedSalons);

        try {
            if (salon.isLike) {
                await removeFromFavorites(salon.id);
            } else {
                await addToFavorites(salon.id);
                showSuccess(salon.name + ' added to your favourite list.');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            // The favorites list should be updated by the hook,
            // which will trigger a re-render with updated isLike status
            const finalSalons = [...formattedSalons];
            finalSalons[index].isLoading = false;
            setFormattedSalons(finalSalons);
        }
    };

    const renderSalon = ({ item, index }: { item: FormattedSalon; index: number }) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('branchDetails', {
                    item: item.originalData || item
                })}
                style={styles.branchCard}
            >
                <View style={styles.branchImageContainer}>
                    <ExpoImage
                        source={item.image}
                        style={styles.branchImage}
                        contentFit="cover"
                    />
                    <TouchableOpacity
                        onPress={() => handleFavoriteToggle(item, index)}
                        style={[
                            styles.likeButton,
                            { backgroundColor: 'rgba(0,0,0,0.3)' }
                        ]}
                    >
                        {item.isLoading ? (
                            <ActivityIndicator size='small' color={theme.colors.white} />
                        ) : (
                            <ExpoImage
                                source={item.isLike ? require('../../../../assets/liked.png') : require('../../../../assets/like.png')}
                                style={styles.likeIcon}
                                contentFit="contain"
                            />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.branchInfo}>
                    <Text style={styles.branchTitle}>{item.name}</Text>

                    <View style={styles.branchDetails}>
                        <Text style={styles.branchType}>
                            {item.categories && item.categories.length > 0
                                ? item.categories[0].name
                                : 'Beauty salon'}
                        </Text>

                        <View style={styles.rating}>
                            <ExpoImage
                                source={require('../../../../assets/star.png')}
                                style={styles.starIcon}
                                contentFit="contain"
                            />
                            <Text style={styles.ratingText}>4.5</Text>
                        </View>

                        <View style={styles.genderTag}>
                            <Text style={styles.genderText}>
                                {item.serviceType === 1
                                    ? 'Men only'
                                    : item.serviceType === 2
                                        ? 'Women only'
                                        : 'Everyone'}
                            </Text>
                        </View>
                    </View>

                    <Text numberOfLines={1} style={styles.locationText}>
                        {item.location
                            ? `${item.location.streetAddress}, ${item.location.city}`
                            : 'Location not available'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyList = () => {
        if (isLoading) return null;

        return (
            <View style={styles.emptyContainer}>
                <ExpoImage
                    source={require('../../../../assets/noappointment.png')}
                    contentFit="contain"
                    style={styles.emptyImage}
                />
                <Text bold style={styles.emptyTitle}>No salons found</Text>
                <Text style={styles.emptySubtitle}>Try adjusting your search criteria</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <AnimatedHeader
                image={params.image}
                title={params.categoryName}
                onBackPress={() => navigation.goBack()}
            >
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Loading salons...</Text>
                    </View>
                )}

                <FlatList
                    data={formattedSalons}
                    extraData={formattedSalons}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderSalon}
                    ListEmptyComponent={renderEmptyList}
                />
            </AnimatedHeader>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // Header styles
    fixedHeader: {
        zIndex: 10,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    headerImageContainer: {
        height: scale(230),
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    headerImage: {
        height: '100%',
        width: '100%',
    },
    headerOverlay: {
        height: '100%',
        width: '100%',
        position: 'absolute',
    },
    headerTitle: {
        color: theme.colors.white,
        fontSize: scale(30),
        textAlign: 'left',
        textTransform: 'capitalize',
        position: 'absolute',
        bottom: scale(50),
        left: scale(20),
    },

    // Content styles
    contentContainer: {
        marginTop: scale(-40),
        backgroundColor: theme.colors.white,
        width: '100%',
        borderTopLeftRadius: scale(30),
        borderTopRightRadius: scale(30),
        paddingHorizontal: scale(10),
        paddingTop: scale(10),
        minHeight: '100%',
    },

    // Loading state
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(50),
    },
    loadingText: {
        marginTop: scale(15),
        fontSize: scale(16),
        color: theme.colors.black,
    },

    // Empty state styles
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(30),
    },
    emptyImage: {
        height: scale(110),
        width: scale(150),
        marginVertical: scale(10),
    },
    emptyTitle: {
        color: theme.colors.black,
        fontSize: scale(25),
        textAlign: 'center',
        marginTop: scale(20),
    },
    emptySubtitle: {
        color: theme.colors.grayText,
        fontSize: scale(15),
        textAlign: 'center',
        marginTop: scale(10),
    },

    // List styles
    listContainer: {
        paddingTop: scale(0),
        paddingBottom: scale(250),
    },

    // Branch card styles
    branchCard: {
        width: '100%',
        marginVertical: scale(10),
    },
    branchImageContainer: {
        height: scale(200),
        borderRadius: scale(20),
        overflow: 'hidden',
    },
    branchImage: {
        width: '100%',
        height: '100%',
    },
    likeButton: {
        position: 'absolute',
        top: scale(10),
        right: scale(10),
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    likeIcon: {
        width: scale(25),
        height: scale(25),
    },
    branchInfo: {
        padding: scale(10),
    },
    branchTitle: {
        fontSize: scale(16),
        fontWeight: 'bold',
        color: theme.colors.black,
        marginBottom: scale(5),
    },
    branchDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        marginBottom: scale(5),
    },
    branchType: {
        fontSize: scale(14),
        color: theme.colors.primary,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        width: scale(15),
        height: scale(15),
    },
    ratingText: {
        fontSize: scale(14),
        color: theme.colors.black,
        marginLeft: scale(5),
    },
    genderTag: {
        backgroundColor: theme.colors.primaryLight,
        paddingHorizontal: scale(10),
        paddingVertical: scale(5),
        borderRadius: scale(15),
    },
    genderText: {
        fontSize: scale(12),
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    locationText: {
        color: theme.colors.grayText,
        fontSize: scale(14),
    },
});

export default React.memo(CategoriesDetails);