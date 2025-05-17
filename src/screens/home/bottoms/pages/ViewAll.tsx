import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { theme } from '../../../../core/theme';
import Header from '../childs/Header';
import { scale } from 'react-native-size-matters';
import { showSuccess, translate } from '../../../../utils/utils';
import { FONT_FAMILY } from '../../../../services/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../../../components/widget';

// Import hooks for real data
import { useSalons } from '../../../../hooks/useSalons';
import { useFavorites } from '../../../../hooks/useFavorites';
import { SalonDto } from '../../../../types/api.types';

// Type definitions
interface NavigationProps {
    navigation: any;
}

// Salon item with favorite functionality
interface FormattedSalon extends SalonDto {
    image: any;
    isLike?: boolean;
    isLoading?: boolean;
}

const ViewAll: React.FC<NavigationProps> = ({ navigation }) => {
    // State
    const [formattedSalons, setFormattedSalons] = useState<FormattedSalon[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Hooks
    const { searchWithFilters } = useSalons();
    const { favorites, addToFavorites, removeFromFavorites, isLoading: favoritesLoading } = useFavorites();

    // Fetch all salons
    const getAllSalons = async () => {
        setIsLoading(true);
        try {
            const results = await searchWithFilters({});

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
            console.error('Error fetching all salons:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch and update when favorites change
    useEffect(() => {
        getAllSalons();
    }, [favorites]);

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
            <View style={styles.listingContainer}>
                <View style={styles.listingCard}>
                    <View style={styles.listingContent}>
                        {/* Wishlist Button */}
                        <View style={styles.wishlistContainer}>
                            <TouchableOpacity
                                style={styles.wishlistButton}
                                onPress={() => handleFavoriteToggle(item, index)}
                            >
                                {item.isLoading ? (
                                    <ActivityIndicator size="small" color={theme.colors.white} />
                                ) : (
                                    <Image
                                        source={require('../../../../assets/like.png')}
                                        style={[
                                            styles.wishlistIcon,
                                            { tintColor: item.isLike ? theme.colors.primary : theme.colors.white }
                                        ]}
                                        contentFit="stretch"
                                    />
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Main Image */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('branchDetails', {
                                item: item.originalData || item
                            })}
                            activeOpacity={0.9}
                        >
                            <Image
                                source={item.image}
                                style={styles.listingImage}
                                contentFit="stretch"
                            />

                            {/* Overlay */}
                            <Image
                                source={require('../../../../assets/item-overlay.png')}
                                style={styles.imageOverlay}
                                contentFit="stretch"
                            />

                            {/* Content */}
                            <View style={styles.listingInfo}>
                                <Text style={styles.listingTitle}>
                                    {item.name || 'Salon Name'}
                                </Text>

                                <View style={styles.categoryRow}>
                                    <Text style={styles.categoryText}>
                                        {item.categories && item.categories.length > 0
                                            ? item.categories[0].name
                                            : 'Beauty salon'}
                                        {'. '}
                                        {item.serviceType === 1
                                            ? 'Men only'
                                            : item.serviceType === 2
                                                ? 'Women only'
                                                : 'Everyone'}
                                    </Text>
                                    <View style={styles.ratingContainer}>
                                        <Image
                                            source={require('../../../../assets/star.png')}
                                            style={styles.starIcon}
                                            contentFit="contain"
                                        />
                                        <Text style={styles.ratingText}>
                                            4.5
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.locationText}>
                                    {item.location
                                        ? `${item.location.streetAddress}, ${item.location.city}`
                                        : 'Location not available'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" backgroundColor="transparent" />

            <Header
                backPress={() => navigation.pop()}
                search={false}
                back={true}
                navigation={navigation}
                Text={translate('')}
            />

            <View style={styles.content}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Loading salons...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={formattedSalons}
                        ListHeaderComponent={
                            <Text style={styles.headerTitle}>
                                {translate('Top spa picks')}
                            </Text>
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.flatListContent}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderSalon}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No salons found</Text>
                            </View>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    content: {
        padding: scale(20),
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
        padding: scale(50),
    },
    emptyText: {
        fontSize: scale(16),
        color: theme.colors.grayText,
        textAlign: 'center',
    },
    headerTitle: {
        color: theme.colors.black,
        fontSize: scale(30),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginHorizontal: scale(10),
        marginBottom: scale(0),
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
    },
    flatListContent: {
        paddingBottom: scale(140),
    },
    listingContainer: {
        width: '100%',
        marginTop: scale(20),
    },
    listingCard: {
        borderColor: theme.colors.primary,
        borderRadius: scale(20),
    },
    listingContent: {
        flexDirection: 'column',
        width: '100%',
        alignSelf: 'center',
    },
    wishlistContainer: {
        position: 'absolute',
        zIndex: 20,
        width: scale(40),
        height: scale(40),
        borderRadius: scale(100),
        top: scale(10),
        right: scale(10),
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    wishlistButton: {
        width: scale(40),
        height: scale(40),
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    wishlistIcon: {
        height: scale(40),
        width: scale(40),
    },
    listingImage: {
        height: scale(200),
        width: '100%',
        borderRadius: scale(20),
    },
    imageOverlay: {
        height: scale(200),
        width: '100%',
        borderRadius: scale(20),
        position: 'absolute',
        zIndex: 10,
    },
    listingInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: scale(15),
        zIndex: 15,
    },
    listingTitle: {
        color: theme.colors.white,
        fontSize: scale(18),
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: scale(5),
        justifyContent: 'space-between',
    },
    categoryText: {
        color: theme.colors.white,
        fontSize: scale(12),
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    starIcon: {
        height: scale(12),
        width: scale(12),
        marginHorizontal: scale(5),
    },
    ratingText: {
        color: theme.colors.white,
        fontSize: scale(12),
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: '500',
        fontFamily: FONT_FAMILY,
    },
    locationText: {
        color: theme.colors.white,
        fontSize: scale(12),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginTop: scale(4),
        fontFamily: FONT_FAMILY,
    },
});

export default React.memo(ViewAll);