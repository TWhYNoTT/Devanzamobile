import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Image, TouchableOpacity, RefreshControl, Modal } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import { Text } from '../../../../../../components/widget';
import { theme } from '../../../../../../core/theme';
import { I18nManager } from 'react-native';
import { Input } from 'react-native-elements';
import { FONT_FAMILY } from '../../../../../../services/config';
import { translate } from '../../../../../../utils/utils';
import { getRecentList, setRecentList } from '../../../../../../utils/storage';

// Types
interface Branch {
    _id: string;
    name: string;
    location: string;
}

interface SearchViewProps {
    hide: () => void;
    navigation: any;
    data: {
        selectedLocation: {
            location: string;
            geometry: {
                lat: number;
                lng: number;
            };
        };
    };
}

// Dummy data generator function
const generateDummyBranches = (searchText: string): Branch[] => {
    const allBranches = [
        { _id: '1', name: 'Premium Salon & Spa', location: 'Downtown Cairo' },
        { _id: '2', name: 'Beauty Center', location: 'Zamalek' },
        { _id: '3', name: 'Elite Hair Studio', location: 'Heliopolis' },
        { _id: '4', name: 'Glamour Palace', location: 'Nasr City' },
        { _id: '5', name: 'Style Hub', location: 'Maadi' },
        { _id: '6', name: 'Luxury Lounge', location: 'October City' },
        { _id: '7', name: 'Modern Cuts', location: 'New Cairo' },
    ];

    if (!searchText) {
        // Return first 5 as suggested salons when no search text
        return allBranches.slice(0, 5);
    }

    // Filter based on search text
    return allBranches.filter(branch =>
        branch.name.toLowerCase().includes(searchText.toLowerCase()) ||
        branch.location.toLowerCase().includes(searchText.toLowerCase())
    );
};

const SearchView: React.FC<SearchViewProps> = ({ hide, navigation, data }) => {
    const [searchText, setSearchText] = useState('');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [recentBranches, setRecentBranchesState] = useState<Branch[]>([]);
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        // Initial search
        search('');

        // Load recent branches
        loadRecentBranches();
    }, []);

    const loadRecentBranches = async () => {
        try {
            const recent = await getRecentList();
            setRecentBranchesState(recent || []);
        } catch (error) {
            console.log('Error loading recent branches:', error);
        }
    };

    const search = (text: string) => {
        setIsLoading(true);

        // Simulate API call with timeout
        setTimeout(() => {
            const results = generateDummyBranches(text);
            setBranches(results);
            setTotalResults(results.length);
            setIsLoading(false);
        }, 500); // Simulate network delay
    };

    const handleSearchTextChange = (value: string) => {
        setSearchText(value);
        search(value);
    };

    const handleBranchPress = async (listing: Branch) => {
        hide();
        navigation.navigate('branchDetails', { item: listing });

        // Update recent branches
        const isAlreadyRecent = recentBranches.some(branch => branch._id === listing._id);

        if (!isAlreadyRecent) {
            const updatedRecent = [...recentBranches, listing];
            setRecentBranchesState(updatedRecent);
            await setRecentList(updatedRecent);
        }
    };

    const handleRemoveRecent = async (index: number) => {
        const updatedRecent = [...recentBranches];
        updatedRecent.splice(index, 1);
        setRecentBranchesState(updatedRecent);
        await setRecentList(updatedRecent);
    };

    const renderSearch = (item: Branch, index: number) => {
        return (
            <View key={`listing-suggestions-${index}`} style={{ width: '100%', marginBottom: moderateScale(10) }}>
                <TouchableOpacity
                    onPress={() => handleBranchPress(item)}
                    style={{ borderColor: theme.colors.primary, borderRadius: moderateScale(20) }}>
                    <View style={{ flexDirection: 'row', width: '100%', alignSelf: 'center' }}>
                        <Image
                            resizeMode="stretch"
                            source={require('../../../../../../assets/dummy1.png')}
                            style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(10) }}
                        />
                        <Image
                            resizeMode="stretch"
                            source={require('../../../../../../assets/item-overlay.png')}
                            style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(10), position: 'absolute', zIndex: 10 }}
                        />
                        <View style={{ paddingHorizontal: moderateScale(10), height: moderateScale(50), flexDirection: 'column', marginTop: moderateScale(5) }}>
                            <Text style={{
                                color: theme.colors.black,
                                fontSize: moderateScale(15),
                                textAlign: 'left',
                                textTransform: 'capitalize',
                                fontWeight: 'bold',
                            }}>
                                {item.name}
                            </Text>
                            <Text style={{
                                color: theme.colors.grayText,
                                fontSize: moderateScale(15),
                                textAlign: 'left',
                                textTransform: 'capitalize',
                            }}>
                                {item.location}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const renderSearchRecent = (item: Branch, index: number) => {
        return (
            <View key={`listing-recent-${index}`} style={{ width: '100%', marginBottom: moderateScale(10) }}>
                <View style={{ borderColor: theme.colors.primary, borderRadius: moderateScale(20) }}>
                    <View style={{ flexDirection: 'row', width: '100%', alignSelf: 'center' }}>
                        <TouchableOpacity
                            style={{ flex: 1, flexDirection: 'row' }}
                            onPress={() => handleBranchPress(item)}>
                            <Image
                                resizeMode="stretch"
                                source={require('../../../../../../assets/dummy1.png')}
                                style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(10) }}
                            />
                            <Image
                                resizeMode="stretch"
                                source={require('../../../../../../assets/item-overlay.png')}
                                style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(10), position: 'absolute', zIndex: 10 }}
                            />
                            <View style={{ paddingHorizontal: moderateScale(10), height: moderateScale(50), flexDirection: 'column', marginTop: moderateScale(5), flex: 1 }}>
                                <Text numberOfLines={1} style={{
                                    color: theme.colors.black,
                                    fontSize: moderateScale(15),
                                    textAlign: 'left',
                                    textTransform: 'capitalize',
                                    fontWeight: 'bold',
                                }}>
                                    {item.name}
                                </Text>
                                <Text numberOfLines={2} style={{
                                    color: theme.colors.grayText,
                                    fontSize: moderateScale(15),
                                    textAlign: 'left',
                                    textTransform: 'capitalize',
                                }}>
                                    {item.location}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleRemoveRecent(index)}
                            style={{ height: moderateScale(50), width: moderateScale(50), justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Image
                                resizeMode="stretch"
                                source={require('../../../../../../assets/close.png')}
                                style={{ height: moderateScale(12), width: moderateScale(12), borderRadius: moderateScale(10) }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={hide}
        >
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'flex-end',
                    backgroundColor: `${theme.colors.black}70`
                }}
            >
                <View style={{
                    width: '100%',
                    height: '90%',
                    backgroundColor: theme.colors.white,
                    borderTopRightRadius: moderateScale(30),
                    borderTopLeftRadius: moderateScale(30)
                }}>
                    {/* Handle Bar */}
                    <TouchableOpacity
                        onPress={hide}
                        style={{
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                            paddingVertical: moderateScale(10)
                        }}
                    >
                        <Image
                            source={require('../../../../../../assets/Rectangle.png')}
                            resizeMode="contain"
                            style={{
                                height: scale(25),
                                width: scale(45),
                                marginHorizontal: moderateScale(10),
                                ...(I18nManager.isRTL ? { transform: [{ rotate: '180deg' }] } : {})
                            }}
                        />
                    </TouchableOpacity>

                    {/* Search Header */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: moderateScale(10),
                        height: moderateScale(45)
                    }}>
                        {/* Back Button */}
                        <TouchableOpacity
                            style={{
                                padding: moderateScale(10),
                                marginBottom: moderateScale(20),
                            }}
                            onPress={hide}
                        >
                            <Image
                                source={require('../../../../../../assets/back-with-overview.png')}
                                resizeMode="contain"
                                style={{
                                    height: scale(25),
                                    width: scale(25),
                                    ...(I18nManager.isRTL ? { transform: [{ rotate: '180deg' }] } : {})
                                }}
                            />
                        </TouchableOpacity>

                        {/* Search Input */}
                        <View style={{ flex: 1 }}>
                            <Input
                                containerStyle={{ paddingLeft: 0, paddingRight: 0, marginBottom: 0 }}
                                inputContainerStyle={{
                                    borderBottomWidth: 0,
                                    backgroundColor: theme.colors.white
                                }}
                                returnKeyType='search'
                                placeholderTextColor={theme.colors.gray}
                                inputStyle={{
                                    fontFamily: FONT_FAMILY,
                                    fontSize: moderateScale(16)
                                }}
                                onSubmitEditing={() => {
                                    hide();
                                    navigation.navigate('Search', { searchText });
                                }}
                                placeholder={translate('Search')}
                                value={searchText}
                                keyboardType={'web-search'}
                                onChangeText={handleSearchTextChange}
                            />
                        </View>

                        {/* Clear Search Button */}
                        {searchText !== '' && (
                            <TouchableOpacity
                                style={{
                                    padding: moderateScale(10),
                                    marginBottom: moderateScale(20),
                                }}
                                onPress={() => {
                                    setSearchText('');
                                    search('');
                                }}
                            >
                                <Image
                                    source={require('../../../../../../assets/close-circle.png')}
                                    resizeMode="contain"
                                    style={{
                                        height: scale(15),
                                        width: scale(15),
                                        ...(I18nManager.isRTL ? { transform: [{ rotate: '180deg' }] } : {})
                                    }}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Results Container */}
                    <View style={{
                        flex: 1,
                        padding: moderateScale(10)
                    }}>
                        {searchText === '' ? (
                            // Content when search input is empty
                            <FlatList
                                data={branches}
                                refreshControl={
                                    <RefreshControl
                                        tintColor={theme.colors.primary}
                                        refreshing={isLoading}
                                    />
                                }
                                ListHeaderComponent={
                                    <Text style={{
                                        color: theme.colors.grayText,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left',
                                        textTransform: 'capitalize',
                                        fontWeight: 'bold',
                                        marginVertical: moderateScale(10)
                                    }}>
                                        {branches.length !== 0 ? 'Suggested salons' : ''}
                                    </Text>
                                }
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                ListFooterComponent={
                                    <View>
                                        {recentBranches.length !== 0 && (
                                            <FlatList
                                                data={recentBranches}
                                                ListHeaderComponent={
                                                    <Text style={{
                                                        color: theme.colors.grayText,
                                                        fontSize: moderateScale(15),
                                                        textAlign: 'left',
                                                        textTransform: 'capitalize',
                                                        fontWeight: 'bold',
                                                        marginVertical: moderateScale(10)
                                                    }}>
                                                        {'Recent searches'}
                                                    </Text>
                                                }
                                                showsVerticalScrollIndicator={false}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({ item, index }) => renderSearchRecent(item, index)}
                                            />
                                        )}
                                    </View>
                                }
                                renderItem={({ item, index }) => renderSearch(item, index)}
                            />
                        ) : (
                            // Search results when there's a search query
                            <FlatList
                                data={branches}
                                refreshControl={
                                    <RefreshControl
                                        tintColor={theme.colors.primary}
                                        refreshing={isLoading}
                                    />
                                }
                                ListEmptyComponent={
                                    <View style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        paddingTop: moderateScale(50)
                                    }}>
                                        <Image
                                            source={require('../../../../../../assets/no-search-items.png')}
                                            resizeMode="contain"
                                            style={{
                                                height: moderateScale(110),
                                                width: moderateScale(150),
                                                marginVertical: moderateScale(10)
                                            }}
                                        />
                                        <Text bold style={{
                                            color: theme.colors.black,
                                            fontSize: moderateScale(25),
                                            textAlign: 'center',
                                            marginTop: moderateScale(20)
                                        }}>
                                            {'No results found'}
                                        </Text>
                                        <Text style={{
                                            color: theme.colors.grayText,
                                            fontSize: moderateScale(15),
                                            textAlign: 'center',
                                            marginTop: moderateScale(10)
                                        }}>
                                            {'It seems we can\'t find any results based on your search.'}
                                        </Text>
                                    </View>
                                }
                                contentContainerStyle={{
                                    flexGrow: 1
                                }}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => renderSearch(item, index)}
                            />
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default SearchView;