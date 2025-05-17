// src/screens/Browse/components/BestForMassages.tsx
import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../../../core/theme';

interface MassageSalon {
    id: string;
    name: string;
    image: string;
    type: string;
    rating: number;
    location: string;
    isFavorite?: boolean;
}

interface BestForMassagesProps {
    salons: MassageSalon[];
    onSalonPress: (salon: MassageSalon) => void;
    onFavoritePress: (salon: MassageSalon) => void;
    onSeeAllPress?: () => void;
}

const BestForMassages: React.FC<BestForMassagesProps> = ({
    salons,
    onSalonPress,
    onFavoritePress,
    onSeeAllPress,
}) => {
    const renderMassageSalon = ({ item }: { item: MassageSalon }) => (
        <View style={styles.salonItem}>
            <TouchableOpacity onPress={() => onSalonPress(item)}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => onFavoritePress(item)}
                    >
                        <Image
                            source={require('../../../../../assets/like.png')}
                            style={[styles.favoriteIcon, item.isFavorite && styles.favoritedIcon]}
                            contentFit="contain"
                        />
                    </TouchableOpacity>

                    <Image
                        source={item.image}
                        style={styles.salonImage}
                        contentFit="cover"
                    />
                    <Image
                        source={require('../../../../../assets/item-overlay.png')}
                        style={styles.imageOverlay}
                        contentFit="cover"
                    />
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.salonName}>{item.name}</Text>

                    <View style={styles.detailsRow}>
                        <Text style={styles.salonType}>{item.type}</Text>
                        <View style={styles.ratingContainer}>
                            <Image
                                source={require('../../../../../assets/star.png')}
                                style={styles.starIcon}
                                contentFit="contain"
                            />
                            <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
                        </View>
                    </View>

                    <Text style={styles.location}>{item.location}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Best for massages</Text>
                <TouchableOpacity onPress={onSeeAllPress}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={salons}
                keyExtractor={(item) => item.id}
                renderItem={renderMassageSalon}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    // Styles are identical to TopPicks component for consistency
    container: {
        marginVertical: moderateScale(25),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(20),
        marginBottom: moderateScale(10),
    },
    title: {
        fontSize: moderateScale(20),
        color: theme.colors.black,
        fontWeight: 'bold',
    },
    seeAll: {
        fontSize: moderateScale(12),
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    listContent: {
        paddingHorizontal: moderateScale(10),
    },
    salonItem: {
        width: Dimensions.get('window').width / 1.4,
        marginEnd: moderateScale(10),
    },
    imageContainer: {
        position: 'relative',
    },
    salonImage: {
        height: moderateScale(150),
        borderRadius: moderateScale(20),
    },
    imageOverlay: {
        height: moderateScale(150),
        width: '100%',
        borderRadius: moderateScale(20),
        position: 'absolute',
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
        alignItems: 'center',
    },
    favoriteIcon: {
        height: moderateScale(40),
        width: moderateScale(40),
        tintColor: theme.colors.white,
    },
    favoritedIcon: {
        tintColor: theme.colors.primary,
    },
    infoContainer: {
        paddingHorizontal: moderateScale(5),
        marginTop: moderateScale(5),
    },
    salonName: {
        fontSize: moderateScale(15),
        color: theme.colors.black,
        fontWeight: 'bold',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(1),
    },
    salonType: {
        fontSize: moderateScale(12),
        color: theme.colors.primary,
        fontWeight: 'bold',
        flex: 1,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        height: moderateScale(10),
        width: moderateScale(10),
        marginHorizontal: moderateScale(5),
    },
    rating: {
        fontSize: moderateScale(12),
        color: theme.colors.black,
        fontWeight: '500',
    },
    location: {
        fontSize: moderateScale(15),
        color: theme.colors.grayText,
        marginTop: moderateScale(4),
    },
});

export default BestForMassages;