import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    StatusBar,
    View,
    FlatList,
    I18nManager,
    TouchableOpacity,
    DeviceEventEmitter,
    ActivityIndicator,
    Platform,
    AppState
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { moderateScale } from 'react-native-size-matters';
import { useFocusEffect } from '@react-navigation/native';

import { Block, Text } from '../../../components/widget';
import { theme } from '../../../core/theme';
import { showDanger, showSuccess, translate } from '../../../utils/utils';
import Loader from '../../../components/loader';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../../../hooks/useFavorites';
import { LocationDto } from '../../../types/api.types';

// Types
interface Branch {
    _id?: string;
    id?: string;
    name: string;
    location: string;
    type: 0 | 1 | 2; // 0: Gender Flexible, 1: Men Only, 2: Female Only
    ratings?: number;
    isLike: boolean;
    isLoading?: boolean;
    businessId?: number;
}

interface FavoritesProps {
    navigation: any;
    userInfo?: {
        email?: string;
    };
    openLoginDialog?: (params: { navigate: string }) => void;
}

const FavoritesScreen: React.FC<FavoritesProps> = ({
    navigation,
    userInfo = {},
    openLoginDialog = () => { }
}) => {
    const { favorites, totalCount, isLoading: favoritesLoading, addToFavorites, removeFromFavorites } = useFavorites();
    const [appState, setAppState] = useState(AppState.currentState);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadFavorites = useCallback(() => {
        try {
            setIsLoading(true);
            // Map favorites data to the Branch interface format
            const mappedBranches = favorites.map(favorite => {
                // Format location string from LocationDto
                let locationString = '';
                if (favorite.location) {
                    const loc = favorite.location;
                    locationString = [loc.streetAddress, loc.city, loc.state].filter(Boolean).join(', ');
                }

                // Convert serviceType to type (0, 1, 2)
                let salonType = 0; // Default to "Gender Flexible"
                if (favorite.serviceType === "MenOnly") {
                    salonType = 1;
                } else if (favorite.serviceType === "WomenOnly") {
                    salonType = 2;
                }

                return {
                    id: favorite.id?.toString() || '',
                    businessId: favorite.businessId,
                    name: favorite.name || '',
                    location: locationString,
                    type: salonType as 0 | 1 | 2,
                    ratings: 0, // Default rating if not available
                    isLike: true
                };
            });

            setBranches(mappedBranches);
        } catch (error) {
            console.error('Error mapping favorites:', error);
            showDanger(translate('Error loading favorites'));
        } finally {
            setIsLoading(false);
        }
    }, [favorites]);

    // Use useFocusEffect to reload data when tab becomes active
    useFocusEffect(
        useCallback(() => {
            loadFavorites();

            // Listen for app state changes to refresh when app comes to foreground
            const subscription = AppState.addEventListener('change', nextAppState => {
                if (appState.match(/inactive|background/) && nextAppState === 'active') {
                    loadFavorites();
                }
                setAppState(nextAppState);
            });

            // Listen for explicit refresh requests
            const eventListener = DeviceEventEmitter.addListener('loadFav', loadFavorites);

            return () => {
                subscription.remove();
                eventListener.remove();
            };
        }, [loadFavorites, appState])
    );

    const handleFavoriteToggle = async (branch: Branch, index: number) => {
        if (!userInfo?.email) {
            openLoginDialog({ navigate: '' });
            return;
        }

        try {
            const updatedBranches = [...branches];
            updatedBranches[index] = { ...branch, isLoading: true };
            setBranches(updatedBranches);

            // Use real API service based on the current isLike state
            const businessId = branch.businessId || Number(branch._id || branch.id || '');

            if (branch.isLike) {
                await removeFromFavorites(businessId);
            } else {
                await addToFavorites(businessId);
            }

            updatedBranches[index] = {
                ...branch,
                isLoading: false,
                isLike: !branch.isLike
            };
            setBranches(updatedBranches);

            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
            );
        } catch (error) {
            showDanger(translate('Failed to update favorite'));
            const updatedBranches = [...branches];
            updatedBranches[index] = { ...branch, isLoading: false };
            setBranches(updatedBranches);
        }
    };

    const renderBranch = ({ item, index }: { item: Branch; index: number }) => (
        <TouchableOpacity
            onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('branchDetails', { item });
            }}
            style={styles.branchContainer}
        >
            <View style={styles.branchCard}>
                <View style={styles.favoriteButton}>
                    <TouchableOpacity
                        onPress={() => handleFavoriteToggle(item, index)}
                        style={styles.favoriteIconContainer}
                    >
                        {item.isLoading ? (
                            <ActivityIndicator size='small' color={theme.colors.primarydark} />
                        ) : (
                            <ExpoImage
                                source={item.isLike ?
                                    require('../../../assets/liked.png') :
                                    require('../../../assets/like.png')
                                }
                                style={styles.favoriteIcon}
                                contentFit="contain"
                            />
                        )}
                    </TouchableOpacity>
                </View>

                <ExpoImage
                    source={require('../../../assets/dummy1.png')}
                    style={styles.branchImage}
                    contentFit="cover"
                />
                <ExpoImage
                    source={require('../../../assets/item-overlay.png')}
                    style={styles.overlay}
                    contentFit="cover"
                />

                <View style={styles.branchDetails}>
                    <Text style={styles.branchName}>{item.name}</Text>

                    <View style={styles.detailsRow}>
                        <Text style={styles.salonType}>
                            {translate('Beauty salon')}
                        </Text>

                        <View style={styles.ratingContainer}>
                            <ExpoImage
                                source={require('../../../assets/star.png')}
                                style={styles.starIcon}
                                contentFit="contain"
                            />
                            <Text style={styles.ratingText}>
                                {!item.ratings ?
                                    translate('no reviews') :
                                    item.ratings.toString()
                                }
                            </Text>
                        </View>

                        <View style={styles.typeTag}>
                            <Text style={styles.typeText}>
                                {item.type === 0 ?
                                    translate('Everyone') :
                                    item.type === 1 ?
                                        translate('Men Only') :
                                        translate('Women Only')
                                }
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.location}>{item.location}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <ExpoImage
                source={require('../../../assets/no-fav.png')}
                style={styles.emptyStateImage}
                contentFit="contain"
            />
            <Text bold style={styles.emptyStateTitle}>
                {translate('Nothing added.')}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
                {translate('Add Salons to your list')}
            </Text>
        </View>
    );

    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaView style={styles.container}>
                <Block>
                    <StatusBar backgroundColor="transparent" barStyle="light-content" />

                    <View style={styles.headerContainer}>
                        <Loader isLoading={isLoading || favoritesLoading} />
                    </View>

                    <View style={styles.contentContainer}>
                        {branches.length === 0 && !isLoading && !favoritesLoading ? (
                            renderEmptyState()
                        ) : (
                            <FlatList
                                data={branches}
                                ListHeaderComponent={
                                    <Text bold style={styles.listHeader}>
                                        {translate('Saved for later')}
                                    </Text>
                                }
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.listContainer}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderBranch}
                            />
                        )}
                    </View>
                </Block>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.white,
        flex: 1,
    },
    headerContainer: {
        width: '100%',

        padding: moderateScale(25),
        paddingBottom: moderateScale(0),
    },
    contentContainer: {
        backgroundColor: theme.colors.white,
        width: '100%',
        borderTopRightRadius: moderateScale(30),
        borderTopLeftRadius: moderateScale(30),
        paddingHorizontal: moderateScale(15),
        paddingTop: moderateScale(0)
    },
    listHeader: {
        fontSize: moderateScale(30),
        marginTop: moderateScale(20),
        paddingBottom: moderateScale(5)
    },
    listContainer: {
        paddingTop: moderateScale(0),
        paddingBottom: moderateScale(250)
    },
    branchContainer: {
        width: '100%',
        marginVertical: moderateScale(10)
    },
    branchCard: {
        borderColor: theme.colors.primary,
        borderRadius: moderateScale(20)
    },
    favoriteButton: {
        position: 'absolute',
        zIndex: 20,
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(100),
        top: moderateScale(10),
        right: moderateScale(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    favoriteIconContainer: {
        width: moderateScale(40),
        height: moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center'
    },
    favoriteIcon: {
        height: moderateScale(40),
        width: moderateScale(40)
    },
    branchImage: {
        height: moderateScale(200),
        width: '100%',
        borderRadius: moderateScale(20)
    },
    overlay: {
        height: moderateScale(200),
        width: '100%',
        borderRadius: moderateScale(20),
        position: 'absolute',
        zIndex: 10
    },
    branchDetails: {
        paddingHorizontal: moderateScale(5),
        marginTop: moderateScale(5)
    },
    branchName: {
        color: theme.colors.black,
        fontSize: moderateScale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        flex: 1,
        fontWeight: '800'
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(1)
    },
    salonType: {
        color: theme.colors.primary,
        fontSize: moderateScale(12),
        textTransform: 'capitalize',
        fontWeight: '800'
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: moderateScale(5)
    },
    starIcon: {
        height: moderateScale(10),
        width: moderateScale(10),
        marginHorizontal: moderateScale(5)
    },
    ratingText: {
        color: theme.colors.black,
        fontSize: moderateScale(12),
        textTransform: 'capitalize',
        fontWeight: '800'
    },
    typeTag: {
        marginStart: moderateScale(5),
        backgroundColor: theme.colors.primarylight,
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(5),
        borderRadius: moderateScale(20)
    },
    typeText: {
        color: theme.colors.primary,
        fontSize: moderateScale(12),
        textTransform: 'capitalize',
        fontWeight: '800'
    },
    location: {
        color: theme.colors.grayText,
        fontSize: moderateScale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginTop: moderateScale(0),
        fontWeight: '400'
    },
    emptyStateContainer: {
        justifyContent: 'center',
        padding: moderateScale(30)
    },
    emptyStateImage: {
        height: moderateScale(110),
        width: moderateScale(150),
        marginVertical: moderateScale(10),
        alignSelf: 'center'
    },
    emptyStateTitle: {
        color: theme.colors.black,
        fontSize: moderateScale(25),
        textAlign: 'center',
        textTransform: 'capitalize',
        marginTop: moderateScale(20)
    },
    emptyStateSubtitle: {
        color: theme.colors.grayText,
        fontSize: moderateScale(15),
        textAlign: 'center',
        textTransform: 'capitalize',
        marginTop: moderateScale(10)
    }
});

export default FavoritesScreen;
