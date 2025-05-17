import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  TextInput,
  Text,
  ActivityIndicator,
  Keyboard,
  Pressable,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { theme } from '../../../../core/theme';
import { translate } from '../../../../utils/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './LocationPickerWithSalonsStyles';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

// Import hooks for real data
import { useSalons } from '../../../../hooks/useSalons';
import { SalonDto } from '../../../../types/api.types';

// Replace moderateScale with a simple scaling function
const { width: screenWidth } = Dimensions.get('window');
const scale = (size: number) => (screenWidth / 375) * size;

interface LocationData {
  location: string;
  geometry: {
    lat: number;
    lng: number;
  };
}

interface SearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface FormattedSalon {
  id: number;
  name: string;
  address: string;
  rating: number;
  priceRange: string;
  workingHours: string;
  phoneNumber: string;
  services: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  image?: any;
  originalData: SalonDto; // Store original API data
}

const LocationPickerWithSalons: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  // Use the salon hook for real data
  const { searchNearby, getSalonDetails, isLoadingNearby, nearbySalons } = useSalons();

  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData>({
    location: '',
    geometry: { lat: 24.4539, lng: 54.3773 }, // Default to Abu Dhabi
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isLocationPermissionGranted, setIsLocationPermissionGranted] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Updated states for salon features with real data
  const [salons, setSalons] = useState<FormattedSalon[]>([]);
  const [selectedSalon, setSelectedSalon] = useState<FormattedSalon | null>(null);
  const [showSalonModal, setShowSalonModal] = useState(false);
  const [isLoadingSalons, setIsLoadingSalons] = useState(false);
  const [radiusKm, setRadiusKm] = useState(100); // 5km default

  // Add a ref to track if a slider change is pending
  const sliderChangePending = useRef(false);

  // Add debounce timer ref for slider
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Add loading timeout safety ref
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track last search params
  const lastSearchParams = useRef<{ lat: number; lng: number; radius: number } | null>(null);

  // Predefined locations for the UAE
  const predefinedLocations: SearchResult[] = [
    { id: '1', name: 'Dubai Mall', address: 'Downtown Dubai, Dubai, UAE', coordinates: { lat: 25.1972, lng: 55.2744 } },
    { id: '2', name: 'Burj Khalifa', address: 'Downtown Dubai, Dubai, UAE', coordinates: { lat: 25.1972, lng: 55.2744 } },
    { id: '3', name: 'Abu Dhabi Mall', address: 'Abu Dhabi, UAE', coordinates: { lat: 24.4951, lng: 54.3833 } },
    { id: '4', name: 'Sheikh Zayed Grand Mosque', address: 'Abu Dhabi, UAE', coordinates: { lat: 24.4128, lng: 54.4747 } },
    { id: '5', name: 'Dubai International Airport', address: 'Dubai, UAE', coordinates: { lat: 25.2532, lng: 55.3657 } },
  ];

  // Default region - don't update this after initial load
  const defaultRegion = {
    latitude: route.params?.defaultLocation?.geometry.lat || 24.4539,
    longitude: route.params?.defaultLocation?.geometry.lng || 54.3773,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Safety mechanism to reset loading state if it takes too long
  useEffect(() => {
    if (isLoadingSalons) {
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      // Set new timeout - reset loading after 10 seconds
      loadingTimeoutRef.current = setTimeout(() => {
        console.log('Loading timeout reached - resetting state');
        setIsLoadingSalons(false);
        sliderChangePending.current = false;
      }, 10000);
    } else if (loadingTimeoutRef.current) {
      // Clear timeout if no longer loading
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoadingSalons]);

  useEffect(() => {
    // Only run once on mount
    if (isInitialLoad) {
      initializeComponent();
      setIsInitialLoad(false);
    }

    // Cleanup all timeouts on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isInitialLoad]);

  const initializeComponent = async () => {
    // Check permissions first
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') {
      setIsLocationPermissionGranted(true);
      await getCurrentLocation();
    } else {
      // Request permission
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      if (newStatus === 'granted') {
        setIsLocationPermissionGranted(true);
        await getCurrentLocation();
      }
    }

    // Initialize with passed location if available
    const paramLocation = route.params?.defaultLocation;
    if (paramLocation) {
      setSelectedLocation(paramLocation);
    }
  };

  const getCurrentLocation = async () => {
    try {
      // Don't request permission here, it's already handled
      if (!isLocationPermissionGranted) {
        console.log('Location permission not granted');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const coords = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };

      const address = await getAddressFromCoords(coords.lat, coords.lng);
      const locationData: LocationData = {
        location: address,
        geometry: coords,
      };

      setCurrentLocation(locationData);
      // Only set as selected location if no location is already selected
      if (!selectedLocation.location) {
        setSelectedLocation(locationData);

        // Fetch salons for the current location
        fetchSalons(coords.lat, coords.lng, radiusKm);
      }

      // Only animate to current location on initial load
      if (isInitialLoad && mapReady) {
        mapRef.current?.animateToRegion({
          latitude: coords.lat,
          longitude: coords.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const getAddressFromCoords = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const result = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (result && result.length > 0) {
        const address = result[0];
        return [
          address.name,
          address.street,
          address.city,
          address.region,
          address.country,
        ]
          .filter(Boolean)
          .join(', ');
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  };

  // Fixed fetchSalons function that properly resets pending flag
  const fetchSalons = async (latitude: number, longitude: number, radius: number = 100) => {
    const last = lastSearchParams.current;
    if (
      last &&
      last.lat === latitude &&
      last.lng === longitude &&
      last.radius === radius
    ) {
      // CRITICAL FIX: Reset both loading state and pending flag when parameters are the same
      console.log('Search params unchanged, resetting state without fetching');
      setIsLoadingSalons(false);
      sliderChangePending.current = false;
      return;
    }

    console.log(`Fetching salons: lat ${latitude}, lng ${longitude}, radius ${radius}km`);
    setIsLoadingSalons(true);
    searchNearby(latitude, longitude, radius);
    lastSearchParams.current = { lat: latitude, lng: longitude, radius };
  };

  // Only update salons when API finishes
  useEffect(() => {
    if (!isLoadingNearby && nearbySalons && Array.isArray(nearbySalons.salons)) {
      (async () => {
        console.log(`Processing ${nearbySalons.salons.length} salon results`);
        const formattedSalons: FormattedSalon[] = [];
        for (const salon of nearbySalons.salons) {
          try {
            const details = await getSalonDetails(salon.id);
            let workingHours = "9:00 AM - 6:00 PM";
            if (details.businessHours && details.businessHours.length > 0) {
              const today = new Date().getDay();
              const todayHours = details.businessHours.find((h: any) => h.dayOfWeek === today);
              if (todayHours && todayHours.isOpen) {
                workingHours = `${todayHours.openTime} - ${todayHours.closeTime}`;
              } else if (todayHours) {
                workingHours = "Closed today";
              }
            }
            const services: string[] = [];
            if (details.services && details.services.length > 0) {
              details.services.forEach((service: any) => {
                services.push(service.name);
              });
            }
            let priceRange = "$$";
            if (details.services && details.services.length > 0) {
              const firstService = details.services[0];
              if (firstService.minPrice === firstService.maxPrice) {
                priceRange = `$`.repeat(Math.min(4, Math.max(1, Math.floor(firstService.minPrice / 50))));
              } else {
                priceRange = `$`.repeat(Math.min(4, Math.max(1, Math.floor(firstService.minPrice / 50)))) +
                  `-$`.repeat(Math.min(4, Math.max(1, Math.floor(firstService.maxPrice / 50))));
              }
            }
            formattedSalons.push({
              id: details.id,
              name: details.name,
              address: details.location ?
                `${details.location.streetAddress}, ${details.location.city}, ${details.location.state}` :
                "Address not available",
              rating: 4.5,
              priceRange: priceRange,
              workingHours: workingHours,
              phoneNumber: "+971 50 123 4567",
              services: services.length > 0 ? services : ["Hair", "Makeup", "Nails"],
              coordinates: {
                lat: details.location?.latitude || 0,
                lng: details.location?.longitude || 0
              },
              image: require('../../../../assets/dummy1.png'),
              originalData: details
            });
          } catch (err) {
            continue;
          }
        }
        setSalons(formattedSalons);
        setIsLoadingSalons(false);
        sliderChangePending.current = false;
        console.log(`Processed ${formattedSalons.length} salons, loading complete`);
      })();
    }
  }, [isLoadingNearby, nearbySalons]);

  // Helper function to calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const handleMapPress = async (event: any) => {
    if (isLoadingSalons) return; // Prevent moving marker while loading

    const { coordinate } = event.nativeEvent;
    const coords = {
      lat: coordinate.latitude,
      lng: coordinate.longitude,
    };

    console.log('Map pressed at:', coords);

    // Dismiss keyboard and suggestions
    Keyboard.dismiss();
    setShowSuggestions(false);

    setIsLoading(true);
    const address = await getAddressFromCoords(coords.lat, coords.lng);
    const locationData: LocationData = {
      location: address,
      geometry: coords,
    };

    setSelectedLocation(locationData);
    setIsLoading(false);

    // Fetch salons for the selected location
    await fetchSalons(coords.lat, coords.lng, radiusKm);
  };

  const searchLocation = async (query: string = searchText) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    setShowSuggestions(true);

    try {
      // First, filter predefined locations
      const filteredPredefined = predefinedLocations.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.address.toLowerCase().includes(query.toLowerCase())
      );

      // Try to geocode the search text
      const geocodeResults = await Location.geocodeAsync(query);

      const searchResults: SearchResult[] = [...filteredPredefined];

      // Add geocoded results
      for (let i = 0; i < geocodeResults.length && i < 5; i++) {
        const result = geocodeResults[i];
        const address = await getAddressFromCoords(result.latitude, result.longitude);

        searchResults.push({
          id: `geo-${i}`,
          name: address.split(',')[0] || query,
          address: address,
          coordinates: {
            lat: result.latitude,
            lng: result.longitude,
          },
        });
      }

      setSearchResults(searchResults.slice(0, 5)); // Limit to 5 results
    } catch (error) {
      console.error('Search error:', error);
      // If geocoding fails, still show predefined results
      const filteredPredefined = predefinedLocations.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.address.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredPredefined);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(text);
    }, 500);
  };

  const selectSearchResult = async (result: SearchResult) => {
    const locationData: LocationData = {
      location: result.address,
      geometry: result.coordinates,
    };

    setSelectedLocation(locationData);
    setSearchText(result.name);
    setShowSuggestions(false);
    setSearchResults([]);
    Keyboard.dismiss();

    // Animate to selected location
    if (mapReady && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: result.coordinates.lat,
        longitude: result.coordinates.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }

    // Fetch salons for the selected location
    await fetchSalons(result.coordinates.lat, result.coordinates.lng, radiusKm);
  };

  const confirmLocation = async () => {
    // If a callback is provided from navigation params, call it with the selected location
    if (route.params?.onLocationSelected) {
      route.params.onLocationSelected(selectedLocation);
    }
    navigation.goBack();
  };

  const goToCurrentLocation = async () => {
    if (currentLocation) {
      const coords = currentLocation.geometry;
      if (mapReady && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: coords.lat,
          longitude: coords.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
      }

      // Fetch salons for the current location
      await fetchSalons(coords.lat, coords.lng, radiusKm);
    } else if (isLocationPermissionGranted) {
      // Only get current location if we don't have it and permissions are granted
      await getCurrentLocation();
    }
  };

  const onMapReady = () => {
    setMapReady(true);
    // Animate to initial location if available
    if (route.params?.defaultLocation) {
      const loc = route.params.defaultLocation.geometry;
      mapRef.current?.animateToRegion({
        latitude: loc.lat,
        longitude: loc.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);

      // Fetch salons for the initial location
      fetchSalons(loc.lat, loc.lng, radiusKm);
    }
  };

  const handleSalonMarkerPress = (salon: FormattedSalon) => {
    setSelectedSalon(salon);
    setShowSalonModal(true);
  };

  const renderSalonModal = () => {
    if (!selectedSalon) return null;

    return (
      <Modal
        visible={showSalonModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSalonModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowSalonModal(false)}
            >
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{selectedSalon.name}</Text>

              <View style={styles.modalInfoRow}>
                <Text style={styles.modalLabel}>Rating:</Text>
                <Text style={styles.modalValue}>⭐ {selectedSalon.rating}</Text>
              </View>

              <View style={styles.modalInfoRow}>
                <Text style={styles.modalLabel}>Price Range:</Text>
                <Text style={styles.modalValue}>{selectedSalon.priceRange}</Text>
              </View>

              <View style={styles.modalInfoRow}>
                <Text style={styles.modalLabel}>Working Hours:</Text>
                <Text style={styles.modalValue}>{selectedSalon.workingHours}</Text>
              </View>

              <View style={styles.modalInfoRow}>
                <Text style={styles.modalLabel}>Phone:</Text>
                <Text style={styles.modalValue}>{selectedSalon.phoneNumber}</Text>
              </View>

              <View style={styles.modalInfoRow}>
                <Text style={styles.modalLabel}>Address:</Text>
                <Text style={styles.modalValue}>{selectedSalon.address}</Text>
              </View>

              <Text style={styles.modalServicesTitle}>Services:</Text>
              {selectedSalon.services.map((service, index) => (
                <Text key={index} style={styles.modalService}>• {service}</Text>
              ))}

              <TouchableOpacity
                style={styles.modalBookButton}
                onPress={() => {
                  setShowSalonModal(false);
                  // Navigate to salon details with real data
                  navigation.navigate('branchDetails', {
                    item: selectedSalon.originalData
                  });
                }}
              >
                <Text style={styles.modalBookButtonText}>Book Appointment</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.secondary} barStyle="light-content" />

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={defaultRegion}
        onMapReady={onMapReady}
        onPress={handleMapPress}
        showsUserLocation={mapReady && isLocationPermissionGranted}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        followsUserLocation={false}
        provider={Platform.OS === 'android' ? 'google' : undefined}
      >
        <Marker
          coordinate={{
            latitude: selectedLocation.geometry.lat,
            longitude: selectedLocation.geometry.lng,
          }}
        />

        {/* Show search radius circle */}
        {selectedLocation.location && (
          <Circle
            center={{
              latitude: selectedLocation.geometry.lat,
              longitude: selectedLocation.geometry.lng,
            }}
            radius={radiusKm * 1000} // Convert km to meters for MapView
            fillColor="rgba(0, 0, 255, 0.1)"
            strokeColor="rgba(0, 0, 255, 0.3)"
            strokeWidth={1}
          />
        )}

        {/* Salon markers - Simple red circle with white border */}
        {salons.map((salon) => {
          console.log(`Rendering salon marker: ${salon.name} at`, salon.coordinates);
          return (
            <Marker
              key={`salon_${salon.id}`}
              coordinate={{
                latitude: salon.coordinates.lat,
                longitude: salon.coordinates.lng,
              }}
              title={salon.name}
              description={salon.address}
              onPress={() => handleSalonMarkerPress(salon)}
            >
              <View style={styles.salonCircle} />
            </Marker>
          );
        })}
      </MapView>

      <View style={[styles.searchContainer, { top: insets.top + 10 }]}>
        <View style={styles.searchBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image
              source={require('../../../../assets/back-black.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={handleSearchTextChange}
            placeholder={translate('Search location')}
            placeholderTextColor={theme.colors.gray04}
            onSubmitEditing={() => searchLocation()}
            returnKeyType="search"
            onFocus={() => {
              if (searchText.trim()) {
                searchLocation(searchText);
              }
            }}
          />

          {isSearching ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : searchText.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
                setShowSuggestions(false);
                setSearchResults([]);
              }}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>×</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {showSuggestions && searchResults.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => selectSearchResult(item)}
                >
                  <View style={styles.suggestionContent}>
                    <Text style={styles.suggestionName}>{item.name}</Text>
                    <Text style={styles.suggestionAddress} numberOfLines={1}>
                      {item.address}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.suggestionSeparator} />}
            />
          </View>
        )}
      </View>

      {/* Merged info and slider UI, with overlay to block slider while loading */}
      <View style={{
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 120,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 16,
        alignItems: 'center',
        elevation: 4,
      }}>
        {/* Location and salon info */}
        <Text style={{ fontWeight: 'bold', marginBottom: 4, textAlign: 'center' }}>
          {selectedLocation.location || translate('Tap on map to select location')}
        </Text>
        {isLoadingSalons ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={{ marginLeft: 8, color: theme.colors.gray04 }}>Finding salons...</Text>
          </View>
        ) : (
          <Text style={{ color: theme.colors.primary, marginBottom: 8 }}>
            {salons.length} salons found in this area
          </Text>
        )}

        {/* Slider */}
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Search Radius: {radiusKm} km</Text>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <MultiSlider
            values={[radiusKm]}
            min={5}
            max={100}
            step={1}
            sliderLength={260}
            selectedStyle={{ backgroundColor: theme.colors.primary }}
            markerStyle={{ backgroundColor: theme.colors.primary, height: 24, width: 24 }}
            onValuesChange={([value]) => {
              if (isLoadingSalons || sliderChangePending.current) return;
              setRadiusKm(value);
            }}
            onValuesChangeStart={() => {
              if (isLoadingSalons) return;
              sliderChangePending.current = true;
              setIsLoadingSalons(true);

              // Clear any existing debounce timer
              if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
              }
            }}
            onValuesChangeFinish={async ([value]) => {
              if (isLoadingSalons && !sliderChangePending.current) return;

              // Update the radius state immediately
              setRadiusKm(value);

              // Clear any existing debounce timer
              if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
              }

              // Set a new debounce timer to avoid too many API calls
              debounceTimerRef.current = setTimeout(async () => {
                if (selectedLocation && selectedLocation.geometry) {
                  await fetchSalons(selectedLocation.geometry.lat, selectedLocation.geometry.lng, value);
                }
              }, 300); // 300ms debounce
            }}
          />
          {/* Overlay to block interaction while loading */}
          {isLoadingSalons && (
            <View
              pointerEvents="auto"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: 'rgba(255,255,255,0.2)',
                zIndex: 10,
              }}
            />
          )}
        </View>
      </View>

      <Pressable
        onPress={goToCurrentLocation}
        style={({ pressed }) => [
          styles.currentLocationButton,
          pressed && { opacity: 0.7 }
        ]}
      >
        <Image
          source={require('../../../../assets/navigate.png')}
          style={styles.navigateIcon}
          resizeMode="contain"
        />
      </Pressable>

      <View style={styles.bottomContainer}>
        <Pressable
          onPress={confirmLocation}
          disabled={isLoading || !selectedLocation.location}
          style={({ pressed }) => [
            styles.confirmButton,
            (isLoading || !selectedLocation.location) && styles.confirmButtonDisabled,
            pressed && { opacity: 0.7 }
          ]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <Text style={styles.confirmButtonText}>{translate('Done')}</Text>
          )}
        </Pressable>
      </View>

      {renderSalonModal()}
    </View>
  );
};

export default LocationPickerWithSalons;