import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import { moderateScale, scale } from 'react-native-size-matters';
import { Rating } from 'react-native-ratings';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../../../../core/theme';
import Loader from '../../../../components/loader';
import { Text } from '../../../../components/widget';
import { showDanger, translate } from '../../../../utils/utils';

interface Branch {
  _id: string;
  name: string;
  location: string;
  lat: string;
  lng: string;
  ratings: number;
  ratingsSum?: number;
  description?: string;
  appObj?: {
    branches: Branch[];
  };
}

interface MarkerData {
  latitude: number;
  longitude: number;
}

const BranchesSelectionPage: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(1);
  const [bottomHide, setBottomHide] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch>(() => {
    const item = route.params?.item;
    if (item && item.lat && item.lng) {
      return item;
    }
    // Check if there are branches in appObj
    if (item?.appObj?.branches && item.appObj.branches.length > 0) {
      return item.appObj.branches[0];
    }
    // Provide default values if item is missing or incomplete
    return {
      _id: '1',
      name: 'Default Branch',
      location: 'Cairo, Egypt',
      lat: '30.0444',
      lng: '31.2357',
      ratings: 4.5,
      ratingsSum: 450,
      description: 'Beauty salon branch',
      appObj: {
        branches: [],
      },
    };
  });
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    // Initialize markers from branches
    const item = route.params?.item;
    if (item?.appObj?.branches && Array.isArray(item.appObj.branches)) {
      const newMarkers: MarkerData[] = item.appObj.branches.map((branch: Branch) => ({
        latitude: Number(branch.lat) || 30.0444,
        longitude: Number(branch.lng) || 31.2357,
      }));
      setMarkers(newMarkers);
    } else {
      // Set default marker if no branches
      setMarkers([{
        latitude: 30.0444,
        longitude: 31.2357,
      }]);
    }
  }, [route.params?.item]);

  // Dummy data for branch details (simulating API call)
  const getDummyBranchData = (branchId: string): Branch => {
    const baseBranch = {
      _id: branchId,
      name: `Beauty Salon - Branch ${branchId.slice(-3)}`,
      location: `Location ${branchId.slice(-3)}, Cairo, Egypt`,
      lat: (30.0444 + Math.random() * 0.1).toString(),
      lng: (31.2357 + Math.random() * 0.1).toString(),
      ratings: 4 + Math.random(),
      ratingsSum: 450,
      description: 'Premium beauty salon branch',
      appObj: route.params?.item?.appObj,
    };
    return baseBranch;
  };

  const handleBranchChange = (branchId: string) => {
    Alert.alert(
      translate('Confirmation'),
      translate('Are you sure you want to change the selected branch? This may remove your selected services!'),
      [
        {
          text: translate('Cancel'),
          style: 'cancel',
        },
        {
          text: translate('Change'),
          onPress: () => {
            setIsLoading(true);

            // Simulate API call with dummy data
            setTimeout(() => {
              const newBranchData = getDummyBranchData(branchId);
              setIsLoading(false);

              // In a real app, this would update global state
              // For now, just navigate back with the new data
              navigation.navigate('branchDetails', { item: newBranchData });
            }, 1000);
          },
        },
      ]
    );
  };

  const animateToLocation = (lat: number, lng: number) => {
    if (!isNaN(lat) && !isNaN(lng)) {
      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.15122,
        longitudeDelta: 0.15121,
      });
    }
  };

  const renderContent = () => (
    <View style={styles.bottomSheetContent}>
      <TouchableOpacity
        onPress={() => {
          bottomSheetRef.current?.snapToIndex(0);
          setBottomHide(true);
        }}
        style={styles.bottomSheetHandle}
      >
        <View style={styles.handleBar} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (route.params?.item?._id !== selectedBranch._id) {
            handleBranchChange(selectedBranch._id);
          }
        }}
        style={styles.branchContent}
      >
        <Text style={styles.branchLocation}>{selectedBranch?.location || 'Unknown Location'}</Text>
        <Text bold style={styles.branchName}>{selectedBranch?.name || 'Unknown Branch'}</Text>

        <View style={styles.ratingContainer}>
          <Rating
            readonly
            startingValue={selectedBranch?.ratings || 4.5}
            imageSize={Number(moderateScale(20).toFixed(0))}
            style={styles.rating}
          />
          <Text style={styles.ratingValue}>
            {Number(selectedBranch?.ratings || 4.5).toFixed(1)}
          </Text>
        </View>

        <View style={styles.tagsContainer}>
          <Text style={styles.categoryTag}>Beauty salon</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Female Only</Text>
          </View>
        </View>

        <View style={styles.hoursContainer}>
          <Image
            resizeMode="contain"
            source={require('../../../../assets/clock.png')}
            style={styles.clockIcon}
          />
          <Text style={styles.hoursText}>8:00AM - 12:00PM</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderBranchListItem = (branch: Branch, index: number) => (
    <TouchableOpacity
      key={`branch-selection-${index}`}
      onPress={() => handleBranchChange(branch._id)}
      style={styles.listItem}
    >
      <Text style={styles.listItemLocation}>{branch.location}</Text>
      <Text bold style={styles.listItemName}>{branch.name}</Text>

      <View style={styles.listItemRating}>
        <Rating
          readonly
          startingValue={branch.ratings || 4.5}
          imageSize={Number(moderateScale(20).toFixed(0))}
          style={styles.rating}
        />
        <Text style={styles.ratingValue}>
          {Number(branch.ratings || 4.5).toFixed(1)}
        </Text>
      </View>

      <View style={styles.tagsContainer}>
        <Text style={styles.categoryTag}>Beauty salon</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Female Only</Text>
        </View>
      </View>

      <View style={styles.listItemHours}>
        <Image
          resizeMode="contain"
          source={require('../../../../assets/clock.png')}
          style={styles.clockIcon}
        />
        <Text style={styles.hoursText}>8:00AM - 12:00PM</Text>
      </View>
    </TouchableOpacity>
  );

  const item = route.params?.item;

  return (
    <View style={styles.wrapper}>
      <StatusBar backgroundColor={theme.colors.secondary} barStyle="dark-content" />
      <Loader isLoading={isLoading} />

      <MapView
        ref={mapRef}
        style={[
          styles.mapStyle,
          {
            height: bottomHide
              ? Dimensions.get('window').height
              : Dimensions.get('window').height - moderateScale(200),
          },
        ]}
        initialRegion={{
          latitude: Number(selectedBranch?.lat) || 30.0444,
          longitude: Number(selectedBranch?.lng) || 31.2357,
          latitudeDelta: 0.15122,
          longitudeDelta: 0.15121,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onRegionChange={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }}
        onRegionChangeComplete={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          bottomSheetRef.current?.snapToIndex(1);
        }}
        provider={PROVIDER_GOOGLE}
      >
        {item?.appObj?.branches && item.appObj.branches.length > 0 ? (
          item.appObj.branches.map((branch: Branch, index: number) => (
            <Marker
              key={`marker-${index}`}
              coordinate={{
                latitude: Number(branch.lat) || 30.0444,
                longitude: Number(branch.lng) || 31.2357,
              }}
              onPress={() => {
                const lat = Number(branch.lat);
                const lng = Number(branch.lng);
                if (!isNaN(lat) && !isNaN(lng)) {
                  animateToLocation(lat, lng);
                }
                bottomSheetRef.current?.snapToIndex(1);
                setSelectedBranch(branch);
              }}
            >
              <Image
                source={
                  item._id === branch._id
                    ? require('../../../../assets/selected.png')
                    : require('../../../../assets/unselected.png')
                }
                style={styles.markerImage}
              />
            </Marker>
          ))
        ) : (
          <Marker
            coordinate={{
              latitude: 30.0444,
              longitude: 31.2357,
            }}
          >
            <Image
              source={require('../../../../assets/selected.png')}
              style={styles.markerImage}
            />
          </Marker>
        )}
      </MapView>

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={['1%', moderateScale(250)]}
        renderContent={renderContent}
        enablePanDownToClose={false}
      >
        {renderContent()}
      </BottomSheet>

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require('../../../../assets/back-with-overview.png')}
                resizeMode="contain"
                style={styles.backIcon}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.tabContainer,
              selectedTab === 2 ? styles.tabContainerList : styles.tabContainerMap,
            ]}
          >
            <View style={styles.tabButton}>
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setSelectedTab(1);
                  setBottomHide(false);
                  bottomSheetRef.current?.snapToIndex(1);
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: selectedTab === 1 ? theme.colors.primary : theme.colors.secondary },
                  ]}
                >
                  Map
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tabDivider} />

            <View style={styles.tabButton}>
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setSelectedTab(2);
                  setBottomHide(false);
                  bottomSheetRef.current?.snapToIndex(0);
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: selectedTab === 2 ? theme.colors.primary : theme.colors.secondary },
                  ]}
                >
                  List
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rightContainer} />
        </View>

        {selectedTab === 2 && (
          <View style={styles.listContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {item?.appObj?.branches && item.appObj.branches.length > 0 ? (
                item.appObj.branches.map((branch: Branch, index: number) =>
                  renderBranchListItem(branch, index)
                )
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No branches available</Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors.white,
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  markerImage: {
    height: moderateScale(50),
    width: moderateScale(50),
  },
  bottomSheetContent: {
    backgroundColor: theme.colors.white,
    width: '100%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  bottomSheetHandle: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  handleBar: {
    width: moderateScale(45),
    height: moderateScale(5),
    backgroundColor: theme.colors.gray,
    borderRadius: moderateScale(2.5),
    marginVertical: moderateScale(10),
  },
  branchContent: {
    flexDirection: 'column',
    marginTop: moderateScale(10),
    width: '90%',
    alignSelf: 'center',
  },
  branchLocation: {
    color: theme.colors.primary,
    fontSize: moderateScale(14),
    textTransform: 'capitalize',
  },
  branchName: {
    color: theme.colors.secondary,
    fontSize: moderateScale(17),
    marginTop: moderateScale(10),
    textTransform: 'capitalize',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(10),
  },
  rating: {
    backgroundColor: theme.colors.white,
  },
  ratingValue: {
    color: theme.colors.black,
    fontSize: moderateScale(13),
    textAlign: 'left',
    textTransform: 'capitalize',
    fontWeight: '800',
    marginHorizontal: moderateScale(10),
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: moderateScale(15),
  },
  categoryTag: {
    color: theme.colors.primary,
    fontSize: moderateScale(12),
    textAlign: 'left',
    textTransform: 'capitalize',
    fontWeight: '800',
  },
  tag: {
    marginStart: moderateScale(5),
    backgroundColor: theme.colors.primarylight,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(20),
  },
  tagText: {
    color: theme.colors.primary,
    fontSize: moderateScale(12),
    textAlign: 'left',
    textTransform: 'capitalize',
    fontWeight: '800',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: moderateScale(15),
    marginTop: moderateScale(5),
  },
  clockIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
  },
  hoursText: {
    color: theme.colors.black,
    fontSize: moderateScale(14),
    textAlign: 'left',
    fontWeight: '600',
    marginHorizontal: moderateScale(10),
    flex: 1,
  },
  header: {
    backgroundColor: 'transparent',
    position: 'absolute',
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    paddingVertical: moderateScale(5),
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(10),
    width: '100%',
    zIndex: 1,
  },
  backButtonContainer: {
    flex: 1.8,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 0.6,
  },
  backIcon: {
    height: scale(25),
    width: scale(25),
    marginHorizontal: moderateScale(10),
  },
  tabContainer: {
    flex: 2.8,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: moderateScale(50),
    height: moderateScale(40),
  },
  tabContainerMap: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  tabContainerList: {
    borderWidth: moderateScale(1),
    borderColor: theme.colors.line,
  },
  tabButton: {
    flex: 1,
  },
  tabText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    width: '100%',
    textAlign: 'center',
  },
  tabDivider: {
    width: moderateScale(1),
    height: moderateScale(20),
    backgroundColor: theme.colors.line,
  },
  rightContainer: {
    flex: 1.8,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  listContainer: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    backgroundColor: theme.colors.white,
    position: 'absolute',
    paddingTop: moderateScale(100),
  },
  listItem: {
    flexDirection: 'column',
    borderBottomColor: theme.colors.line,
    marginTop: moderateScale(10),
    width: '90%',
    alignSelf: 'center',
  },
  listItemLocation: {
    color: theme.colors.primary,
    fontSize: moderateScale(14),
    textTransform: 'capitalize',
  },
  listItemName: {
    color: theme.colors.secondary,
    fontSize: moderateScale(17),
    marginTop: moderateScale(10),
    textTransform: 'capitalize',
  },
  listItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(5),
  },
  listItemHours: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: moderateScale(1),
    paddingBottom: moderateScale(15),
    borderBottomColor: theme.colors.line,
    marginTop: moderateScale(10),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: moderateScale(50),
  },
  emptyText: {
    fontSize: moderateScale(16),
    color: theme.colors.grayText,
  },
});

export default BranchesSelectionPage;