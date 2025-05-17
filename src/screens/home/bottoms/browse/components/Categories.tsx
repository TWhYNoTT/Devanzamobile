// src/screens/Browse/components/Categories.tsx
import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../../../core/theme';

interface Category {
    id: string;
    name: string;
    image: string;
}

interface CategoriesProps {
    categories: Category[];
    onCategoryPress: (category: Category) => void;
    onSeeAllPress?: () => void;
}

const Categories: React.FC<CategoriesProps> = ({
    categories,
    onCategoryPress,
    onSeeAllPress
}) => {
    const renderCategory = ({ item }: { item: Category }) => (
        <TouchableOpacity
            onPress={() => onCategoryPress(item)}
            style={styles.categoryItem}
        >
            <Text style={styles.categoryName}>{item.name}</Text>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.categoryImage}
                    contentFit="cover"
                />
                <Image
                    source={require('../../../../../assets/categoryshowdow.png')}
                    style={styles.shadowOverlay}
                    contentFit="cover"
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Categories</Text>
                <TouchableOpacity onPress={onSeeAllPress}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={renderCategory}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: moderateScale(10),
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
    categoryItem: {
        marginHorizontal: moderateScale(5),
    },
    categoryName: {
        color: theme.colors.white,
        fontSize: moderateScale(20),
        position: 'absolute',
        zIndex: 1,
        top: moderateScale(10),
        left: moderateScale(20),
        fontWeight: 'bold',
    },
    imageContainer: {
        height: moderateScale(180),
        width: moderateScale(130),
    },
    categoryImage: {
        height: moderateScale(180),
        width: moderateScale(130),
        borderRadius: moderateScale(10),
    },
    shadowOverlay: {
        height: moderateScale(180),
        width: moderateScale(130),
        borderRadius: moderateScale(10),
        position: 'absolute',
    },
});

export default Categories;