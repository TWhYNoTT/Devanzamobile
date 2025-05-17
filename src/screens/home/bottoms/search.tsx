import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Image,
    I18nManager,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { Text, Input } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, moderateScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';

import FilterView from "./pages/filters/filters";
import Loader from '../../../components/loader';
import { theme } from '../../../core/theme';
import { FONT_FAMILY } from '../../../services/config';
import { translate } from '../../../utils/utils';

// Type definitions
interface Branch {
    id: string;
    name: string;
    type: number;
    location: string;
    ratings?: number;
    [key: string]: any;
}

interface FilterParams {
    categories: string[];
    homeService: boolean;
    ratting: number;
    gender: number;
    min: number;
    max: number;
}

// Dummy data to replace API calls
const DUMMY_BRANCHES: Branch[] = [
    {
        id: '1',
        name: 'Elite Beauty Salon',
        type: 0,
        location: 'Downtown Cairo',
        ratings: 4.5,
    },
    {
        id: '2',
        name: 'Gentleman\'s Cut',
        type: 1,
        location: 'New Cairo',
        ratings: 4.8,
    },
    {
        id: '3',
        name: 'Lady Rose Spa',
        type: 2,
        location: 'Zamalek',
        ratings: 4.2,
    },
    {
        id: '4',
        name: 'Family Hair Studio',
        type: 0,
        location: 'Maadi',
        ratings: 4.0,
    },
];

const Search: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const insets = useSafeAreaInsets();

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [totalResults, setTotalResults] = useState(0);
    const [params, setParams] = useState<FilterParams>({
        categories: [],
        homeService: false,
        ratting: 4,
        gender: 0,
        min: 0,
        max: 1000
    });

    const getBranchesByCategory = (filterParams: FilterParams) => {
        setIsLoading(true);

        // Simulate API call with dummy data
        setTimeout(() => {
            let filteredBranches = [...DUMMY_BRANCHES];

            // Apply filters
            if (filterParams.gender !== 0) {
                filteredBranches = filteredBranches.filter(branch =>
                    filterParams.gender === 3 ? branch.type === 0 : branch.type === filterParams.gender - 1
                );
            }

            if (filterParams.ratting < 5) {
                filteredBranches = filteredBranches.filter(branch =>
                    (branch.ratings || 0) >= filterParams.ratting
                );
            }

            setBranches(filteredBranches);
            setTotalResults(filteredBranches.length);
            setIsLoading(false);
        }, 500);
    };

    useEffect(() => {
        getBranchesByCategory({
            categories: [],
            homeService: false,
            ratting: 4,
            gender: 0,
            min: 0,
            max: 1000
        });
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

    const renderListings = (listing: Branch) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('branchDetails', { item: listing })}
            style={styles.listingContainer}
        >
            <View style={styles.listingCard}>
                <View style={styles.listingImageContainer}>
                    <View style={styles.likeButtonContainer}>
                        <TouchableOpacity style={styles.likeButton}>
                            <Image
                                resizeMode="stretch"
                                source={require('../../../assets/like.png')}
                                style={styles.likeIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <Image
                        resizeMode="stretch"
                        source={require('../../../assets/dummy1.png')}
                        style={styles.listingImage}
                    />
                    <Image
                        resizeMode="stretch"
                        source={require('../../../assets/item-overlay.png')}
                        style={styles.listingOverlay}
                    />

                    <View style={styles.listingInfo}>
                        <Text style={styles.listingName}>{listing.name}</Text>

                        <View style={styles.listingMeta}>
                            <Text style={styles.listingCategory}>Beauty salon</Text>

                            <View style={styles.ratingContainer}>
                                <Image
                                    resizeMode="contain"
                                    source={require('../../../assets/star.png')}
                                    style={styles.starIcon}
                                />
                                <Text style={styles.ratingText}>
                                    {!listing.ratings ? translate('no reviews') : listing.ratings}
                                </Text>
                            </View>

                            <View style={styles.genderTag}>
                                <Text style={styles.genderText}>
                                    {listing.type === 0 ? 'Gender Flexible' :
                                        listing.type === 1 ? 'Men Only' : 'Female Only'}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.locationText}>{listing.location}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <Loader isLoading={isLoading} />

            <View style={[styles.header, { paddingTop: insets.top + moderateScale(20) }]}>
                <View style={styles.searchBar}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <View style={styles.iconButton}>
                            <Image
                                source={require('../../../assets/back.png')}
                                resizeMode="contain"
                                style={[
                                    styles.backIcon,
                                    I18nManager.isRTL && styles.rtlIcon
                                ]}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.searchInputContainer}>
                        <Input
                            containerStyle={styles.inputWrapper}
                            inputContainerStyle={styles.inputContainer}
                            inputStyle={[
                                styles.input,
                                I18nManager.isRTL && styles.rtlInput
                            ]}
                            returnKeyType='search'
                            placeholderTextColor={theme.colors.gray}
                            placeholder={translate('Search')}
                            value={searchText}
                            keyboardType='web-search'
                            onChangeText={setSearchText}
                            onSubmitEditing={() => navigation.navigate('Search')}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowFilterModal(true)}
                    >
                        <View style={styles.iconButton}>
                            <Image
                                source={require('../../../assets/filters.png')}
                                resizeMode="contain"
                                style={[
                                    styles.filterIcon,
                                    I18nManager.isRTL && styles.rtlIcon
                                ]}
                            />
                            {getFiltersCount() > 0 && (
                                <View style={styles.filterBadge}>
                                    <Text style={styles.filterBadgeText}>
                                        {getFiltersCount()}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                {!isLoading && (
                    <View style={styles.resultsCount}>
                        <View style={styles.resultsTag}>
                            <Text style={styles.resultsNumber}>{totalResults} </Text>
                            <Text style={styles.resultsText}>Results found</Text>
                        </View>
                    </View>
                )}

                {!isLoading && (
                    <FlatList
                        data={branches}
                        extraData={branches}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => renderListings(item)}
                    />
                )}
            </View>

            {/* Filter Modal */}
            {showFilterModal && (
                <FilterView
                    hide={() => setShowFilterModal(false)}
                    filters={(filterParams: FilterParams) => {
                        setParams(filterParams);
                        setShowFilterModal(false);
                        setTimeout(() => {
                            getBranchesByCategory(filterParams);
                        }, 200);
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        padding: moderateScale(20),
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(15),
        height: moderateScale(50),
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: moderateScale(15),
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    filterButton: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    iconButton: {
        backgroundColor: theme.colors.primarylight,
        height: moderateScale(25),
        width: moderateScale(25),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(7),
    },
    backIcon: {
        height: moderateScale(15),
        width: moderateScale(15),
    },
    filterIcon: {
        height: moderateScale(15),
        width: moderateScale(15),
    },
    rtlIcon: {
        transform: [{ rotate: '180deg' }],
    },
    searchInputContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    inputWrapper: {
        paddingLeft: moderateScale(10),
        paddingRight: moderateScale(10),
    },
    inputContainer: {
        width: '100%',
        height: moderateScale(45),
        paddingLeft: I18nManager.isRTL ? 0 : moderateScale(10),
        paddingRight: I18nManager.isRTL ? moderateScale(10) : 0,
        borderBottomWidth: 0,
        backgroundColor: theme.colors.white,
    },
    input: {
        textAlignVertical: 'center',
        height: '100%',
        fontFamily: FONT_FAMILY,
    },
    rtlInput: {
        textAlign: 'right',
    },
    filterBadge: {
        width: moderateScale(23),
        height: moderateScale(23),
        backgroundColor: "#391F87",
        borderRadius: moderateScale(7),
        position: 'absolute',
        right: moderateScale(-12),
        top: moderateScale(-12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterBadgeText: {
        color: theme.colors.white,
        fontWeight: '800',
        fontSize: moderateScale(15),
    },
    resultsCount: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: moderateScale(15),
        paddingBottom: moderateScale(10),
    },
    resultsTag: {
        backgroundColor: theme.colors.grayBackground1,
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(10),
        borderRadius: moderateScale(10),
        flexDirection: 'row',
    },
    resultsNumber: {
        color: theme.colors.black,
        fontSize: moderateScale(15),
        fontWeight: '800',
    },
    resultsText: {
        color: theme.colors.blackText,
        fontSize: moderateScale(12),
        fontWeight: '700',
    },
    listContainer: {
        paddingTop: moderateScale(0),
        paddingBottom: moderateScale(250),
    },
    listingContainer: {
        width: '100%',
        marginVertical: moderateScale(10),
    },
    listingCard: {
        borderColor: theme.colors.primary,
        borderRadius: moderateScale(20),
    },
    listingImageContainer: {
        flexDirection: 'column',
        width: '100%',
        alignSelf: 'center',
    },
    likeButtonContainer: {
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
    likeButton: {
        width: moderateScale(40),
        height: moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    likeIcon: {
        height: moderateScale(40),
        width: moderateScale(40),
        tintColor: theme.colors.white,
    },
    listingImage: {
        height: moderateScale(200),
        width: '100%',
        borderRadius: moderateScale(20),
    },
    listingOverlay: {
        height: moderateScale(200),
        width: '100%',
        borderRadius: moderateScale(20),
        position: 'absolute',
        zIndex: 10,
    },
    listingInfo: {
        paddingHorizontal: moderateScale(5),
        marginTop: moderateScale(5),
    },
    listingName: {
        color: theme.colors.black,
        fontSize: moderateScale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        flex: 1,
        fontWeight: '800',
    },
    listingMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: moderateScale(1),
    },
    listingCategory: {
        color: theme.colors.primary,
        fontSize: moderateScale(12),
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: '800',
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    starIcon: {
        height: moderateScale(10),
        width: moderateScale(10),
        marginHorizontal: moderateScale(5),
    },
    ratingText: {
        color: theme.colors.black,
        fontSize: moderateScale(12),
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: '800',
    },
    genderTag: {
        marginStart: moderateScale(5),
        backgroundColor: theme.colors.primarylight,
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(5),
        borderRadius: moderateScale(20),
    },
    genderText: {
        color: theme.colors.primary,
        fontSize: moderateScale(12),
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: '800',
    },
    locationText: {
        color: theme.colors.grayText,
        fontSize: moderateScale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginTop: moderateScale(0),
        fontWeight: '400',
    },
});

export default Search;