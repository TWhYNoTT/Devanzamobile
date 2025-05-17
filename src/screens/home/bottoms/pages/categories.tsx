import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    StatusBar,
    View,
    TouchableOpacity,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../../../core/theme';
import Header from '../childs/Header';
import { scale } from 'react-native-size-matters';
import { translate } from '../../../../utils/utils';
import { FONT_FAMILY } from '../../../../services/config';
import { Image as ExpoImage } from 'expo-image';
import { Text } from '../../../../components/widget';

// Import hooks and types
import { useCategories } from '../../../../hooks/useCategories';
import { CategoryDto } from '../../../../types/api.types';

const Categories = () => {
    const navigation = useNavigation<any>();
    const [isLoading, setIsLoading] = useState(true);

    // Use the categories hook
    const { categories, isLoading: categoriesLoading } = useCategories();

    // Format categories with images
    const [formattedCategories, setFormattedCategories] = useState<any[]>([]);

    useEffect(() => {
        // Update loading state
        setIsLoading(categoriesLoading);

        // Format categories with dummy images once loaded
        if (categories && categories.length > 0) {
            const dummyImages = [
                require('../../../../assets/dummy2.png'),
                require('../../../../assets/dummy3.png'),
                require('../../../../assets/dummy4.png')
            ];

            const formatted = categories.map((category, index) => ({
                ...category,
                image: dummyImages[index % dummyImages.length]
            }));

            setFormattedCategories(formatted);
        }
    }, [categories, categoriesLoading]);

    const renderCategory = ({ item }: { item: any }) => {
        return (
            <View style={styles.categoryItem}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('categoriesDetails', {
                            categoryId: item.id,
                            categoryName: item.name,
                            image: item.image
                        });
                    }}
                >
                    <View style={styles.categoryContent}>
                        <Text
                            style={styles.categoryTitle}
                            allowFontScaling={false}
                        >
                            {item.name}
                        </Text>
                        <View style={styles.imageContainer}>
                            <ExpoImage
                                source={item.image}
                                style={styles.categoryImage}
                                contentFit="cover"
                            />
                            <ExpoImage
                                source={require('../../../../assets/categoryshowdow.png')}
                                style={[styles.categoryImage, styles.shadowOverlay]}
                                contentFit="cover"
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const ListHeader = () => (
        <Text
            style={styles.headerTitle}
            allowFontScaling={false}
        >
            {translate('Categories')}
        </Text>
    );

    // Render loading state
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Header
                    backPress={() => navigation.goBack()}
                    search={false}
                    back={true}
                    navigation={navigation}
                    Text={translate('')}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>Loading categories...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" />
            <Header
                backPress={() => navigation.goBack()}
                search={false}
                back={true}
                navigation={navigation}
                Text={translate('')}
            />
            <View style={styles.contentContainer}>
                <FlatList
                    data={formattedCategories}
                    numColumns={2}
                    ListHeaderComponent={ListHeader}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContentContainer}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCategory}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No categories found</Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(20),
    },
    loadingText: {
        marginTop: scale(15),
        fontSize: scale(16),
        color: theme.colors.black,
    },
    contentContainer: {
        padding: scale(10),
    },
    listContentContainer: {
        paddingBottom: scale(140),
    },
    headerTitle: {
        color: theme.colors.black,
        fontSize: scale(30),
        fontWeight: 'bold',
        textAlign: 'left',
        textTransform: 'capitalize',
        marginHorizontal: scale(10),
        marginBottom: scale(10),
        fontFamily: FONT_FAMILY,
    },
    categoryItem: {
        marginBottom: scale(20),
        flex: 1 / 2,
    },
    categoryContent: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    categoryTitle: {
        color: theme.colors.white,
        fontSize: scale(20),
        fontWeight: 'bold',
        textAlign: 'left',
        textTransform: 'capitalize',
        position: 'absolute',
        zIndex: 1,
        top: scale(10),
        left: scale(20),
        width: '100%',
        fontFamily: FONT_FAMILY,
    },
    imageContainer: {
        height: scale(220),
        flex: 1,
        marginHorizontal: scale(5),
    },
    categoryImage: {
        height: scale(220),
        width: '100%',
        borderRadius: scale(10),
    },
    shadowOverlay: {
        position: 'absolute',
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
});

export default Categories;