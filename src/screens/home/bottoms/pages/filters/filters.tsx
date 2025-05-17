import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    FlatList,
    StyleSheet,
    ListRenderItem,
    ViewToken
} from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import { Text, Button } from 'react-native-paper';
import { I18nManager } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Rating } from 'react-native-elements';
import { Switch } from 'react-native-paper';
import { translate } from '../../../../../utils/utils';
import { FONT_FAMILY } from '../../../../../services/config';
import { theme } from '../../../../../core/theme';

// Type definitions
interface Category {
    id: string;
    _id?: string;
    name_en: string;
    selected?: boolean;
}

interface FilterParams {
    categories: string[];
    homeService: boolean;
    ratting: number;
    gender: number;
    min: number;
    max: number;
}

interface FilterViewProps {
    hide: () => void;
    filters: (params: FilterParams) => void;
}

interface SectionData {
    key: string;
    component: JSX.Element;
}

// Dummy categories data
const DUMMY_CATEGORIES: Category[] = [
    { id: '1', name_en: 'Hair Styling', selected: false },
    { id: '2', name_en: 'Nail Care', selected: false },
    { id: '3', name_en: 'Spa Services', selected: false },
    { id: '4', name_en: 'Makeup', selected: false },
    { id: '5', name_en: 'Massage', selected: false },
];

const FilterView: React.FC<FilterViewProps> = ({ hide, filters }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(-1);
    const [selectedGender, setSelectedGender] = useState(0);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(1000);
    const [settings, setSettings] = useState(false);
    const [params, setParams] = useState<FilterParams>({
        categories: [],
        homeService: false,
        ratting: 5,
        gender: 0,
        min: 0,
        max: 1000
    });

    useEffect(() => {
        // Simulate API call with dummy data
        setIsLoading(true);
        setTimeout(() => {
            setCategories(DUMMY_CATEGORIES);
            setIsLoading(false);
        }, 500);
    }, []);

    const getFiltersCount = (): number => {
        let count = 0;
        if (params.categories.length !== 0) count++;
        if (params.homeService) count++;
        if (params.ratting !== 5) count++;
        if (params.gender !== 0) count++;
        if (params.min !== 0 || params.max !== 1000) count++;
        return count;
    };

    const ratingCompleted = (rating: number) => {
        setParams({ ...params, ratting: rating });
    };

    const handleCategorySelect = (index: number) => {
        const updatedCategories = [...categories];
        updatedCategories[index].selected = !updatedCategories[index].selected;

        setCategories(updatedCategories);

        const selectedCategoryIds: string[] = [];
        let lastSelectedIndex = -1;

        updatedCategories.forEach((category, idx) => {
            if (category.selected) {
                selectedCategoryIds.push(category.id || category._id || '');
                lastSelectedIndex = idx;
            }
        });

        setSelectedCategory(lastSelectedIndex);
        setParams({ ...params, categories: selectedCategoryIds });
    };

    const handleSelectAll = () => {
        const updatedCategories = categories.map(cat => ({ ...cat, selected: false }));
        setCategories(updatedCategories);
        setSelectedCategory(-1);
        setParams({ ...params, categories: [] });
    };

    const handleReset = () => {
        setParams({
            categories: [],
            homeService: false,
            ratting: 5,
            gender: 0,
            min: 0,
            max: 1000
        });
        setMin(0);
        setMax(1000);
        setSelectedGender(0);
        setSettings(false);
        const resetCategories = categories.map(cat => ({ ...cat, selected: false }));
        setCategories(resetCategories);
        setSelectedCategory(-1);
    };

    const handleSliderValuesChange = (values: number[]) => {
        setMin(values[0]);
        setMax(values[1]);
        setParams({ ...params, min: values[0], max: values[1] });
    };

    const getSections = (): SectionData[] => {
        const sections: SectionData[] = [];

        // Price Range Section
        sections.push({
            key: 'price',
            component: (
                <>
                    <Text style={styles.sectionTitle}>Price range</Text>
                    <View style={styles.priceContainer}>
                        <Image
                            source={require('../../../../../assets/graph.png')}
                            resizeMode="stretch"
                            style={styles.graphImage}
                        />
                        <View style={styles.sliderContainer}>
                            <MultiSlider
                                values={[min, max]}
                                onValuesChange={handleSliderValuesChange}
                                min={0}
                                max={1000}
                                step={10}
                                selectedStyle={styles.selectedSlider}
                                unselectedStyle={styles.unselectedSlider}
                                markerStyle={styles.markerStyle}
                                pressedMarkerStyle={styles.pressedMarkerStyle}
                            />
                        </View>
                    </View>

                    <View style={styles.priceLabels}>
                        <View style={styles.priceLabel}>
                            <Text style={styles.priceLabelText}>{min} AED</Text>
                        </View>
                        <View style={styles.spacer} />
                        <View style={styles.priceLabel}>
                            <Text style={styles.priceLabelText}>{max} AED</Text>
                        </View>
                    </View>
                </>
            ),
        });

        // Rating Section
        sections.push({
            key: 'rating',
            component: (
                <>
                    <Text style={styles.sectionTitle}>Rating</Text>
                    <View style={styles.ratingContainer}>
                        <Rating
                            type='custom'
                            showRating={false}
                            imageSize={moderateScale(20)}
                            onFinishRating={ratingCompleted}
                            style={styles.starContainer}
                            ratingColor={theme.colors.primary}
                            ratingBackgroundColor={theme.colors.gray}
                            tintColor={theme.colors.white}
                            startingValue={5}
                        />
                    </View>
                </>
            ),
        });

        // Discount Type Section
        sections.push({
            key: 'discount',
            component: (
                <>
                    <Text style={styles.sectionTitle}>Discount type</Text>
                    <View style={styles.discountContainer}>
                        <TouchableOpacity style={styles.discountTag}>
                            <Text style={styles.discountText}>{translate('50% Off')}</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ),
        });

        // Gender Section
        sections.push({
            key: 'gender',
            component: (
                <>
                    <Text style={styles.sectionTitle}>Gender</Text>
                    <View style={styles.genderContainer}>
                        {['All', 'Men', 'Women', 'Kids'].map((gender, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setSelectedGender(index);
                                    setParams({ ...params, gender: index });
                                }}
                                style={[
                                    styles.genderTag,
                                    selectedGender === index && styles.selectedGenderTag
                                ]}
                            >
                                <Text style={[
                                    styles.genderText,
                                    selectedGender === index && styles.selectedGenderText
                                ]}>{translate(gender)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            ),
        });

        // Home Service Section
        sections.push({
            key: 'homeService',
            component: (
                <>
                    <Text style={styles.sectionTitle}>Home service</Text>
                    <View style={styles.homeServiceContainer}>
                        <Switch
                            value={settings}
                            onValueChange={(val) => {
                                setSettings(val);
                                setParams({ ...params, homeService: val });
                            }}
                            color={theme.colors.primary}
                        />
                        <Text style={styles.homeServiceText}>{translate('Available')}</Text>
                    </View>
                </>
            ),
        });

        // Categories Section
        sections.push({
            key: 'categories',
            component: (
                <>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <View>
                        <TouchableOpacity onPress={handleSelectAll} style={styles.categoryItem}>
                            <Text style={styles.categoryText}>{translate('All')}</Text>
                            <View style={[
                                styles.checkbox,
                                selectedCategory === -1 && styles.checkedBox
                            ]}>
                                {selectedCategory === -1 && (
                                    <Image
                                        source={require('../../../../../assets/check.png')}
                                        style={styles.checkIcon}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>

                        {categories.map((item, index) => (
                            <TouchableOpacity
                                key={`category-${index}`}
                                onPress={() => handleCategorySelect(index)}
                                style={styles.categoryItem}
                            >
                                <Text style={styles.categoryText}>{item.name_en}</Text>
                                <View style={[
                                    styles.checkbox,
                                    item.selected && styles.checkedBox
                                ]}>
                                    {item.selected && (
                                        <Image
                                            source={require('../../../../../assets/check.png')}
                                            style={styles.checkIcon}
                                        />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            ),
        });

        return sections;
    };

    const renderSection: ListRenderItem<SectionData> = ({ item }) => (
        <View style={styles.sectionContainer}>
            {item.component}
        </View>
    );

    const ListHeader = () => (
        <>
            <TouchableOpacity onPress={hide} style={styles.handleBar}>
                <Image
                    source={require('../../../../../assets/Rectangle.png')}
                    resizeMode="contain"
                    style={[
                        styles.handleBarImage,
                        I18nManager.isRTL && styles.rtlImage
                    ]}
                />
            </TouchableOpacity>

            <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={hide}>
                    <Image
                        source={require('../../../../../assets/close-theme.png')}
                        resizeMode="contain"
                        style={[
                            styles.closeIcon,
                            I18nManager.isRTL && styles.rtlImage
                        ]}
                    />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Filter</Text>
                </View>

                <View style={styles.placeholder} />
            </View>
        </>
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <FlatList
                    data={getSections()}
                    keyExtractor={(item) => item.key}
                    renderItem={renderSection}
                    ListHeaderComponent={ListHeader}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                />

                <View style={styles.footer}>
                    <View style={styles.applyButtonContainer}>
                        <Button
                            mode="contained"
                            onPress={() => filters(params)}
                            style={styles.applyButton}
                            labelStyle={styles.buttonLabel}
                        >
                            {translate('Apply')}
                        </Button>
                        {getFiltersCount() > 0 && (
                            <View style={styles.filterCountBadge}>
                                <Text style={styles.filterCountText}>{getFiltersCount()}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.buttonSpacer} />

                    <Button
                        mode="contained"
                        onPress={handleReset}
                        disabled={getFiltersCount() === 0}
                        style={[
                            styles.resetButton,
                            getFiltersCount() === 0 && styles.disabledResetButton
                        ]}
                        labelStyle={[
                            styles.buttonLabel,
                            getFiltersCount() === 0 && styles.disabledButtonLabel
                        ]}
                    >
                        {translate('Reset')}
                    </Button>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: theme.colors.black + '70',
    },
    content: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: moderateScale(10),
    },
    handleBar: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    handleBarImage: {
        height: scale(25),
        width: scale(45),
        marginHorizontal: moderateScale(10),
    },
    rtlImage: {
        transform: [{ rotate: '180deg' }],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(10),
        height: moderateScale(45),
    },
    closeButton: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 0.6,
    },
    closeIcon: {
        height: scale(25),
        width: scale(25),
        marginHorizontal: moderateScale(10),
    },
    titleContainer: {
        flex: 2.8,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    title: {
        fontSize: moderateScale(20),
        fontWeight: '900',
    },
    placeholder: {
        flex: 0.6,
    },
    scrollContent: {
        paddingBottom: moderateScale(130),
    },
    sectionContainer: {
        paddingHorizontal: moderateScale(20),
        marginTop: moderateScale(20),
    },
    sectionTitle: {
        fontSize: moderateScale(17),
        fontWeight: '600',
        color: theme.colors.lightGrayText,
    },
    priceContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    graphImage: {
        height: scale(80),
        width: '100%',
        marginHorizontal: moderateScale(10),
    },
    sliderContainer: {
        position: 'absolute',
        width: '100%',
        bottom: moderateScale(-57),
    },
    selectedSlider: {
        backgroundColor: theme.colors.primary,
        height: moderateScale(3),
    },
    unselectedSlider: {
        backgroundColor: theme.colors.grayBackgroundSlots,
        height: moderateScale(3),
    },
    markerStyle: {
        backgroundColor: theme.colors.primary,
        width: moderateScale(20),
        height: moderateScale(20),
    },
    pressedMarkerStyle: {
        width: moderateScale(25),
        height: moderateScale(25),
    },
    priceLabels: {
        width: '100%',
        flexDirection: 'row',
        marginTop: moderateScale(30),
    },
    priceLabel: {
        borderBottomWidth: moderateScale(1),
        borderBottomColor: theme.colors.line,
        paddingBottom: moderateScale(10),
        flex: 1,
    },
    priceLabelText: {
        fontSize: moderateScale(15),
        fontWeight: '500',
    },
    spacer: {
        width: moderateScale(50),
    },
    ratingContainer: {
        width: moderateScale(120),
        marginTop: moderateScale(10),
    },
    starContainer: {
        backgroundColor: theme.colors.white,
        justifyContent: 'flex-start',
    },
    discountContainer: {
        marginTop: moderateScale(20),
    },
    discountTag: {
        padding: moderateScale(5),
        paddingHorizontal: moderateScale(15),
        borderRadius: moderateScale(10),
        backgroundColor: theme.colors.primary,
        marginEnd: moderateScale(10),
        alignSelf: 'flex-start',
    },
    discountText: {
        fontSize: moderateScale(15),
        color: theme.colors.white,
        fontWeight: 'bold',
    },
    genderContainer: {
        flexDirection: 'row',
        marginTop: moderateScale(10),
        marginBottom: moderateScale(10),
    },
    genderTag: {
        padding: moderateScale(5),
        paddingHorizontal: moderateScale(15),
        borderRadius: moderateScale(10),
        marginEnd: moderateScale(10),
        backgroundColor: theme.colors.primarylight,
    },
    selectedGenderTag: {
        backgroundColor: theme.colors.primary,
    },
    genderText: {
        fontSize: moderateScale(15),
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    selectedGenderText: {
        color: theme.colors.white,
    },
    homeServiceContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        borderBottomColor: theme.colors.line,
        borderBottomWidth: moderateScale(1),
        paddingVertical: moderateScale(13),
    },
    homeServiceText: {
        fontSize: moderateScale(17),
        flex: 1,
        marginHorizontal: moderateScale(10),
        color: theme.colors.text,
    },
    categoryList: {
        width: '100%',
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginTop: moderateScale(13),
    },
    categoryText: {
        fontSize: moderateScale(17),
        flex: 1,
        color: theme.colors.text,
    },
    checkbox: {
        width: moderateScale(25),
        height: moderateScale(25),
        backgroundColor: theme.colors.white,
        borderRadius: moderateScale(7),
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderWidth: moderateScale(1),
        borderColor: theme.colors.line,
    },
    checkedBox: {
        backgroundColor: theme.colors.primary,
        borderWidth: 0,
    },
    checkIcon: {
        width: moderateScale(15),
        height: moderateScale(15),
        resizeMode: 'contain',
    },
    footer: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: moderateScale(0),
        width: '100%',
        paddingBottom: moderateScale(20),
        flexDirection: 'row',
        alignSelf: 'center',
        paddingHorizontal: '10%',
    },
    applyButtonContainer: {
        flex: 1,
        width: '80%',
    },
    applyButton: {
        marginTop: moderateScale(35),
        borderRadius: moderateScale(10),
        height: moderateScale(45),
        backgroundColor: theme.colors.primary,
        alignSelf: 'center',
        marginBottom: moderateScale(20),
    },
    resetButton: {
        marginTop: moderateScale(35),
        borderRadius: moderateScale(10),
        height: moderateScale(45),
        width: '80%',
        backgroundColor: theme.colors.primary,
        alignSelf: 'center',
        marginBottom: moderateScale(20),
        flex: 0.5,
    },
    disabledResetButton: {
        backgroundColor: theme.colors.primarylight,
    },
    buttonLabel: {
        fontSize: moderateScale(16),
        color: theme.colors.white,
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold',
    },
    disabledButtonLabel: {
        color: theme.colors.primary,
    },
    filterCountBadge: {
        width: moderateScale(23),
        height: moderateScale(23),
        backgroundColor: '#391F87',
        borderRadius: moderateScale(7),
        position: 'absolute',
        right: moderateScale(0),
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginTop: moderateScale(46),
        marginEnd: moderateScale(12),
    },
    filterCountText: {
        color: theme.colors.white,
        fontWeight: '800',
        fontSize: moderateScale(15),
    },
    buttonSpacer: {
        width: moderateScale(10),
    },
});

export default FilterView;