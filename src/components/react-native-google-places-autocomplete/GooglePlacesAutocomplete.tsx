import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  PixelRatio,
  Platform,
  Dimensions,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import debounce from 'lodash.debounce';
import qs from 'qs';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../core/theme';

const WINDOW = Dimensions.get('window');

// Types
type Language =
  | 'ar'
  | 'be'
  | 'bg'
  | 'bn'
  | 'ca'
  | 'cs'
  | 'da'
  | 'de'
  | 'el'
  | 'en'
  | 'en-Au'
  | 'en-GB'
  | 'es'
  | 'eu'
  | 'fa'
  | 'fi'
  | 'fil'
  | 'fr'
  | 'gl'
  | 'gu'
  | 'hi'
  | 'hr'
  | 'hu'
  | 'id'
  | 'it'
  | 'iw'
  | 'ja'
  | 'kk'
  | 'kn'
  | 'ko'
  | 'ky'
  | 'lt'
  | 'lv'
  | 'mk'
  | 'ml'
  | 'mr'
  | 'my'
  | 'nl'
  | 'no'
  | 'pa'
  | 'pl'
  | 'pt'
  | 'pt-BR'
  | 'pt-PT'
  | 'ro'
  | 'ru'
  | 'sk'
  | 'sl'
  | 'sq'
  | 'sr'
  | 'sv'
  | 'ta'
  | 'te'
  | 'th'
  | 'tl'
  | 'tr'
  | 'uk'
  | 'uz'
  | 'vi'
  | 'zh-CN'
  | 'zh-TW';

type SearchType =
  | 'accounting'
  | 'airport'
  | 'amusement_park'
  | 'aquarium'
  | 'art_gallery'
  | 'atm'
  | 'bakery'
  | 'bank'
  | 'bar'
  | 'beauty_salon'
  | 'bicycle_store'
  | 'book_store'
  | 'bowling_alley'
  | 'bus_station'
  | 'cafe'
  | 'campground'
  | 'car_dealer'
  | 'car_rental'
  | 'car_repair'
  | 'car_wash'
  | 'casino'
  | 'cemetery'
  | 'church'
  | 'city_hall'
  | 'clothing_store'
  | 'convenience_store'
  | 'courthouse'
  | 'dentist'
  | 'department_store'
  | 'doctor'
  | 'electrician'
  | 'electronics_store'
  | 'embassy'
  | 'fire_station'
  | 'florist'
  | 'funeral_home'
  | 'furniture_store'
  | 'gas_station'
  | 'gym'
  | 'hair_care'
  | 'hardware_store'
  | 'hindu_temple'
  | 'home_goods_store'
  | 'hospital'
  | 'insurance_agency'
  | 'jewelry_store'
  | 'laundry'
  | 'lawyer'
  | 'library'
  | 'liquor_store'
  | 'local_government_office'
  | 'locksmith'
  | 'lodging'
  | 'meal_delivery'
  | 'meal_takeaway'
  | 'mosque'
  | 'movie_rental'
  | 'movie_theater'
  | 'moving_company'
  | 'museum'
  | 'night_club'
  | 'painter'
  | 'park'
  | 'parking'
  | 'pet_store'
  | 'pharmacy'
  | 'physiotherapist'
  | 'plumber'
  | 'police'
  | 'post_office'
  | 'real_estate_agency'
  | 'restaurant'
  | 'roofing_contractor'
  | 'rv_park'
  | 'school'
  | 'shoe_store'
  | 'shopping_mall'
  | 'spa'
  | 'stadium'
  | 'storage'
  | 'store'
  | 'subway_station'
  | 'supermarket'
  | 'synagogue'
  | 'taxi_stand'
  | 'train_station'
  | 'transit_station'
  | 'travel_agency'
  | 'veterinary_care'
  | 'zoo';

type PlaceType =
  | 'administrative_area_level_1'
  | 'administrative_area_level_2'
  | 'administrative_area_level_3'
  | 'administrative_area_level_4'
  | 'administrative_area_level_5'
  | 'colloquial_area'
  | 'country'
  | 'establishment'
  | 'finance'
  | 'floor'
  | 'food'
  | 'general_contractor'
  | 'geocode'
  | 'health'
  | 'intersection'
  | 'locality'
  | 'natural_feature'
  | 'neighborhood'
  | 'place_of_worship'
  | 'political'
  | 'point_of_interest'
  | 'post_box'
  | 'postal_code'
  | 'postal_code_prefix'
  | 'postal_code_suffix'
  | 'postal_town'
  | 'premise'
  | 'room'
  | 'route'
  | 'street_address'
  | 'street_number'
  | 'sublocality'
  | 'sublocality_level_4'
  | 'sublocality_level_5'
  | 'sublocality_level_3'
  | 'sublocality_level_2'
  | 'sublocality_level_1'
  | 'subpremise';

type AutocompleteRequestType =
  | '(regions)'
  | '(cities)'
  | 'geocode'
  | 'address'
  | 'establishment';

interface DescriptionRow {
  description: string;
  id: string;
  matched_substrings: MatchedSubString[];
  place_id: string;
  reference: string;
  structured_formatting: StructuredFormatting;
  terms: Term[];
  types: PlaceType[];
  isCurrentLocation?: boolean;
  isPredefinedPlace?: boolean;
  isLoading?: boolean;
}

interface MatchedSubString {
  length: number;
  offset: number;
}

interface Term {
  offset: number;
  value: string;
}

interface StructuredFormatting {
  main_text: string;
  main_text_matched_substrings?: Object[][];
  secondary_text: string;
  secondary_text_matched_substrings?: Object[][];
  terms?: Term[];
  types?: PlaceType[];
}

interface GooglePlaceData {
  description: string;
  id: string;
  matched_substrings: MatchedSubString[];
  place_id: string;
  reference: string;
  structured_formatting: StructuredFormatting;
}

interface Point {
  lat: number;
  lng: number;
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: PlaceType[];
}

interface Geometry {
  location: Point;
  viewport: {
    northeast: Point;
    southwest: Point;
  };
}

interface GooglePlaceDetail {
  address_components: AddressComponent[];
  adr_address: string;
  formatted_address: string;
  geometry: Geometry;
  icon: string;
  id: string;
  name: string;
  place_id: string;
  reference: string;
  scope: 'GOOGLE';
  types: PlaceType[];
  url: string;
  utc_offset: number;
  vicinity: string;
}

interface Query<T = AutocompleteRequestType> {
  key: string;
  sessiontoken?: string;
  offset?: number;
  location?: string;
  radius?: number;
  language?: Language;
  components?: string;
  rankby?: string;
  type?: T;
  strictbounds?: boolean;
  types?: T;
}

interface Styles {
  container: StyleProp<ViewStyle>;
  description: StyleProp<TextStyle>;
  textInputContainer: StyleProp<ViewStyle>;
  textInput: StyleProp<TextStyle>;
  loader: StyleProp<ViewStyle>;
  listView: StyleProp<ViewStyle>;
  predefinedPlacesDescription: StyleProp<TextStyle>;
  poweredContainer: StyleProp<ViewStyle>;
  powered: StyleProp<ImageStyle>;
  separator: StyleProp<ViewStyle>;
  row: StyleProp<ViewStyle>;
  specialItemRow?: StyleProp<ViewStyle>;
}

interface Place {
  description: string;
  geometry: { location: Point };
}

interface RequestUrl {
  url: string;
  useOnPlatform: 'web' | 'all';
}

interface GooglePlacesAutocompleteProps extends Omit<TextInputProps, 'onFocus' | 'onBlur'> {
  children?: React.ReactNode;
  query: Query;
  minLength?: number;
  listViewDisplayed?: 'auto' | boolean;
  fetchDetails?: boolean;
  renderDescription?: (description: DescriptionRow) => string;
  onPress?: (data: GooglePlaceData, detail: GooglePlaceDetail | null) => void;
  getDefaultValue?: () => string;
  styles?: Partial<Styles>;
  suppressDefaultStyles?: boolean;
  currentLocation?: boolean;
  currentLocationLabel?: string;
  nearbyPlacesAPI?: 'GoogleReverseGeocoding' | 'GooglePlacesSearch' | 'None';
  GoogleReverseGeocodingQuery?: {
    bounds?: number;
    language?: Language;
    region?: string;
    components?: string;
  };
  GooglePlacesSearchQuery?: Partial<Query<SearchType>>;
  GooglePlacesDetailsQuery?: Partial<Query> & { fields?: string };
  filterReverseGeocodingByTypes?: PlaceType[];
  predefinedPlaces?: Place[];
  predefinedPlacesAlwaysVisible?: boolean;
  debounce?: number;
  renderLeftButton?: () => React.ReactElement;
  renderRightButton?: () => React.ReactElement;
  onFail?: (error?: any) => void;
  requestUrl?: RequestUrl;
  textInputProps?: TextInputProps & {
    ref?: React.RefObject<TextInput>;
    onFocus?: () => void;
    onBlur?: () => void;
  };
  enablePoweredByContainer?: boolean;
  listEmptyComponent?: React.ComponentType<{}>;
  listUnderlayColor?: string;
  autoFillOnNotFound?: boolean;
  autoFocus?: boolean;
  disableScroll?: boolean;
  enableHighAccuracyLocation?: boolean;
  isRowScrollable?: boolean;
  keyboardAppearance?: 'default' | 'light' | 'dark';
  keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
  numberOfLines?: number;
  onNotFound?: () => void;
  onSubmitEditing?: () => void;
  onTimeout?: () => void;
  placeholder?: string;
  placeholderTextColor?: string;
  preProcess?: (text: string) => string;
  renderHeaderComponent?: (text: string) => React.ReactElement;
  renderRow?: (data: DescriptionRow) => React.ReactElement | null;
  returnKeyType?: string;
  textInputHide?: boolean;
  timeout?: number;
  underlineColorAndroid?: string;
  onFocusShow?: () => void;
  triggerBlur?: () => void;
  pop?: () => void;
}

interface GooglePlacesAutocompleteState {
  text: string;
  dataSource: DescriptionRow[];
  listViewDisplayed: boolean;
  url: string;
}

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: moderateScale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: 'white',
    elevation: 5,
  },
  textInputContainer: {
    backgroundColor: '#C9C9CE',
    height: 44,
    borderTopColor: '#7e7e7e',
    borderBottomColor: '#b5b5b5',
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    flexDirection: 'row',
    borderRadius: moderateScale(20),
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    height: 28,
    borderRadius: 5,
    paddingLeft: Platform.OS === 'android' ? 0 : 10,
    paddingRight: 10,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 15,
    flex: 1,
  },
  poweredContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  powered: {},
  listView: {
    marginLeft: moderateScale(20),
    marginRight: moderateScale(20),
    paddingTop: moderateScale(20),
  },
  row: {
    padding: 13,
    flexDirection: 'row',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#c8c7cc',
  },
  description: {
    color: theme.colors.blackText,
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export class GooglePlacesAutocomplete extends Component<
  GooglePlacesAutocompleteProps,
  GooglePlacesAutocompleteState
> {
  private _isMounted = false;
  private _results: DescriptionRow[] = [];
  private _requests: XMLHttpRequest[] = [];
  private textInputRef = React.createRef<TextInput>();
  private _request: Function;

  static defaultProps = {
    autoFillOnNotFound: false,
    autoFocus: false,
    currentLocation: false,
    currentLocationLabel: 'Current location',
    debounce: 0,
    editable: true,
    enableHighAccuracyLocation: true,
    enablePoweredByContainer: true,
    fetchDetails: false,
    filterReverseGeocodingByTypes: [],
    getDefaultValue: () => '',
    GooglePlacesDetailsQuery: {},
    GooglePlacesSearchQuery: {
      rankby: 'distance',
      type: 'restaurant',
    },
    GoogleReverseGeocodingQuery: {},
    isRowScrollable: true,
    keyboardAppearance: 'default',
    keyboardShouldPersistTaps: 'always',
    listViewDisplayed: 'auto',
    minLength: 0,
    nearbyPlacesAPI: 'GooglePlacesSearch',
    numberOfLines: 1,
    onFail: () => { },
    onNotFound: () => { },
    onSubmitEditing: () => { },
    onPress: () => { },
    onTimeout: () => console.warn('google places autocomplete: request timeout'),
    placeholder: 'Search',
    placeholderTextColor: '#A8A8A8',
    predefinedPlaces: [],
    predefinedPlacesAlwaysVisible: false,
    query: {
      key: 'missing api key',
      language: 'en',
      types: 'geocode',
    },
    returnKeyType: 'search',
    styles: {},
    suppressDefaultStyles: false,
    textInputHide: false,
    textInputProps: {},
    timeout: 20000,
    underlineColorAndroid: 'transparent',
  };

  constructor(props: GooglePlacesAutocompleteProps) {
    super(props);
    this.state = this.getInitialState();
    this._request = this.props.debounce
      ? debounce(this._requestMethod, this.props.debounce)
      : this._requestMethod;
  }

  getInitialState = (): GooglePlacesAutocompleteState => ({
    text: this.props.getDefaultValue?.() || '',
    dataSource: this.buildRowsFromResults([]),
    listViewDisplayed:
      this.props.listViewDisplayed === 'auto'
        ? false
        : this.props.listViewDisplayed || false,
    url: this.getRequestUrl(this.props.requestUrl),
  });

  getRequestUrl = (requestUrl?: RequestUrl): string => {
    if (requestUrl) {
      if (requestUrl.useOnPlatform === 'all') {
        return requestUrl.url;
      }
      if (requestUrl.useOnPlatform === 'web') {
        return Platform.select({
          web: requestUrl.url,
          default: 'https://maps.googleapis.com/maps/api',
        }) as string;
      }
    }
    return 'https://maps.googleapis.com/maps/api';
  };

  setAddressText = (address: string) => this.setState({ text: address });

  getAddressText = () => this.state.text;

  buildRowsFromResults = (results: DescriptionRow[]): DescriptionRow[] => {
    let res: DescriptionRow[] = [];

    if (
      results.length === 0 ||
      this.props.predefinedPlacesAlwaysVisible === true
    ) {
      res = this.props.predefinedPlaces
        ?.filter((place) => place.description && place.description.length)
        .map((place) => ({
          ...place,
          isPredefinedPlace: true,
          place_id: '',
          id: '',
          matched_substrings: [],
          reference: '',
          structured_formatting: {
            main_text: '',
            secondary_text: '',
          },
          terms: [],
          types: [],
        })) || [];

      if (this.props.currentLocation === true) {
        res.unshift({
          description: this.props.currentLocationLabel || 'Current location',
          isCurrentLocation: true,
          place_id: '',
          id: '',
          matched_substrings: [],
          reference: '',
          structured_formatting: {
            main_text: '',
            secondary_text: '',
          },
          terms: [],
          types: [],
        });
      }
    }

    res = res.map((place) => ({
      ...place,
      isPredefinedPlace: true,
    }));

    return [...res, ...results];
  };

  componentDidMount() {
    this._handleChangeText(this.state.text);
    this._isMounted = true;
  }

  componentDidUpdate(prevProps: GooglePlacesAutocompleteProps) {
    if (prevProps.predefinedPlaces !== this.props.predefinedPlaces) {
      this.setState({ dataSource: this.buildRowsFromResults(this._results) });
    }
  }

  componentWillUnmount() {
    this._abortRequests();
    this._isMounted = false;
  }

  _abortRequests = () => {
    this._requests.forEach((request) => request.abort());
    this._requests = [];
  };

  _requestMethod = (text: string) => {
    this._abortRequests();
    if (text && text.length >= (this.props.minLength || 0)) {
      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout || 20000;
      request.ontimeout = this.props.onTimeout || (() => { });
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }

        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);
          if (typeof responseJSON.predictions !== 'undefined') {
            if (this._isMounted === true) {
              const results =
                this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding'
                  ? this._filterResultsByTypes(
                    responseJSON.predictions,
                    this.props.filterReverseGeocodingByTypes || []
                  )
                  : responseJSON.predictions;

              this._results = results;
              this.setState({
                dataSource: this.buildRowsFromResults(results),
              });
            }
          }
          if (typeof responseJSON.error_message !== 'undefined') {
            if (!this.props.onFail) {
              console.warn(
                'google places autocomplete: ' + responseJSON.error_message
              );
            } else {
              this.props.onFail(responseJSON.error_message);
            }
          }
        }
      };

      const processedText = this.props.preProcess
        ? this.props.preProcess(text)
        : text;

      request.open(
        'GET',
        `${this.state.url}/place/autocomplete/json?&input=` +
        encodeURIComponent(processedText) +
        '&' +
        qs.stringify(this.props.query)
      );

      request.send();
    } else {
      this._results = [];
      this.setState({
        dataSource: this.buildRowsFromResults([]),
      });
    }
  };

  _filterResultsByTypes = (
    unfilteredResults: DescriptionRow[],
    types: PlaceType[]
  ): DescriptionRow[] => {
    if (types.length === 0) return unfilteredResults;

    const results = [];
    for (let i = 0; i < unfilteredResults.length; i++) {
      let found = false;

      for (let j = 0; j < types.length; j++) {
        if (unfilteredResults[i].types.indexOf(types[j]) !== -1) {
          found = true;
          break;
        }
      }

      if (found === true) {
        results.push(unfilteredResults[i]);
      }
    }
    return results;
  };

  _onPress = (rowData: DescriptionRow) => {
    if (
      rowData.isPredefinedPlace !== true &&
      this.props.fetchDetails === true
    ) {
      if (rowData.isLoading === true) {
        return;
      }

      Keyboard.dismiss();
      this._abortRequests();
      this._enableRowLoader(rowData);

      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout || 20000;
      request.ontimeout = this.props.onTimeout || (() => { });
      request.onreadystatechange = () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);

          if (responseJSON.status === 'OK') {
            if (this._isMounted === true) {
              const details = responseJSON.result;
              this._disableRowLoaders();
              this._onBlur();

              this.setState({
                text: this._renderDescription(rowData),
              });

              delete rowData.isLoading;
              this.props.onPress?.(rowData as GooglePlaceData, details);
            }
          } else {
            this._disableRowLoaders();

            if (this.props.autoFillOnNotFound) {
              this.setState({
                text: this._renderDescription(rowData),
              });
              delete rowData.isLoading;
            }

            if (!this.props.onNotFound) {
              console.warn(
                'google places autocomplete: ' + responseJSON.status
              );
            } else {
              this.props.onNotFound();
            }
          }
        } else {
          this._disableRowLoaders();

          if (!this.props.onFail) {
            console.warn(
              'google places autocomplete: request could not be completed or has been aborted'
            );
          } else {
            this.props.onFail(
              'request could not be completed or has been aborted'
            );
          }
        }
      };

      request.open(
        'GET',
        `${this.state.url}/place/details/json?` +
        qs.stringify({
          key: this.props.query.key,
          placeid: rowData.place_id,
          language: this.props.query.language,
          ...this.props.GooglePlacesDetailsQuery,
        })
      );

      request.send();
    } else if (rowData.isCurrentLocation === true) {
      this._enableRowLoader(rowData);
      this.setState({
        text: this._renderDescription(rowData),
      });
      delete rowData.isLoading;
      this.getCurrentLocation();
    } else {
      this.setState({
        text: this._renderDescription(rowData),
      });
      this._onBlur();
      delete rowData.isLoading;
      let predefinedPlace = this._getPredefinedPlace(rowData);
      this.props.onPress?.(predefinedPlace as GooglePlaceData, predefinedPlace as GooglePlaceDetail);
    }
  };

  _enableRowLoader = (rowData: DescriptionRow) => {
    let rows = this.buildRowsFromResults(this._results);
    for (let i = 0; i < rows.length; i++) {
      if (
        rows[i].place_id === rowData.place_id ||
        (rows[i].isCurrentLocation === true &&
          rowData.isCurrentLocation === true)
      ) {
        rows[i].isLoading = true;
        this.setState({
          dataSource: rows,
        });
        break;
      }
    }
  };

  _disableRowLoaders = () => {
    if (this._isMounted === true) {
      for (let i = 0; i < this._results.length; i++) {
        if (this._results[i].isLoading === true) {
          this._results[i].isLoading = false;
        }
      }

      this.setState({
        dataSource: this.buildRowsFromResults(this._results),
      });
    }
  };

  _getPredefinedPlace = (rowData: DescriptionRow): DescriptionRow => {
    if (rowData.isPredefinedPlace !== true) {
      return rowData;
    }

    const predefinedPlace = this.props.predefinedPlaces?.find(
      (place) => place.description === rowData.description
    );

    return predefinedPlace
      ? {
        ...rowData,
        ...predefinedPlace,
      }
      : rowData;
  };

  getCurrentLocation = () => {
    // In Expo, we don't use the navigator API directly
    // This should be handled by the parent component using expo-location
    const currentLocation = {
      description: this.props.currentLocationLabel || 'Current location',
      geometry: {
        location: {
          lat: 0,
          lng: 0,
        },
      },
    };

    this._disableRowLoaders();
    this.props.onPress?.(currentLocation as any, currentLocation as any);
  };

  _onChangeText = (text: string) => {
    this._request(text);

    this.setState({
      text: text,
      listViewDisplayed: this._isMounted || this.props.autoFocus || false,
    });
  };

  _handleChangeText = (text: string) => {
    this._onChangeText(text);

    const onChangeText =
      this.props.textInputProps?.onChangeText;

    if (onChangeText) {
      onChangeText(text);
    }
  };

  _renderDescription = (rowData: DescriptionRow): string => {
    if (this.props.renderDescription) {
      return this.props.renderDescription(rowData);
    }

    return rowData.description || '';
  };

  _renderLeftButton = () => {
    if (this.props.renderLeftButton) {
      return this.props.renderLeftButton();
    }
    return null;
  };

  _renderRightButton = () => {
    if (this.props.renderRightButton) {
      return this.props.renderRightButton();
    }
    return null;
  };

  _renderRow = (rowData: DescriptionRow) => {
    if (this.props.renderRow) {
      return this.props.renderRow(rowData);
    }

    return (
      <ScrollView
        style={{ flex: 1 }}
        scrollEnabled={this.props.isRowScrollable}
        keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}
        >
          <Image
            style={{ width: 20, height: 20 }}
            resizeMode={'contain'}
            source={require('../../assets/pin.png')}
          />
          <TouchableHighlight
            style={{ width: WINDOW.width - 50 }}
            onPress={() => this._onPress(rowData)}
            underlayColor={this.props.listUnderlayColor || 'transparent'}
          >
            <View
              style={[
                this.props.suppressDefaultStyles ? {} : defaultStyles.row,
                this.props.styles?.row,
                rowData.isPredefinedPlace ? this.props.styles?.specialItemRow : {},
              ]}
            >
              {rowData.isLoading && (
                <View
                  style={[
                    this.props.suppressDefaultStyles ? {} : defaultStyles.loader,
                    this.props.styles?.loader,
                  ]}
                >
                  <ActivityIndicator animating={true} size="small" />
                </View>
              )}
              <View>
                <Text
                  style={[
                    this.props.suppressDefaultStyles ? {} : defaultStyles.description,
                    this.props.styles?.description,
                    rowData.isPredefinedPlace
                      ? this.props.styles?.predefinedPlacesDescription
                      : {},
                    { color: theme.colors.blackText, fontWeight: '500' },
                  ]}
                  numberOfLines={this.props.numberOfLines}
                >
                  {this._renderDescription(rowData)}
                </Text>
                {rowData.terms && rowData.terms.length > 0 && (
                  <Text
                    style={[
                      this.props.suppressDefaultStyles ? {} : defaultStyles.description,
                      this.props.styles?.description,
                      rowData.isPredefinedPlace
                        ? this.props.styles?.predefinedPlacesDescription
                        : {},
                      { color: theme.colors.blackText, fontWeight: '100' },
                    ]}
                    numberOfLines={this.props.numberOfLines}
                  >
                    {rowData.terms[rowData.terms.length - 1].value}
                  </Text>
                )}
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  };

  _onFocus = () => {
    this.setState({ listViewDisplayed: true });
  };

  _onBlur = () => {
    this.triggerBlur();
    this.setState({
      listViewDisplayed: false,
    });
  };

  triggerFocus = () => {
    if (this.textInputRef.current) {
      this.textInputRef.current.focus();
    }
  };

  triggerBlur = () => {
    if (this.textInputRef.current) {
      this.textInputRef.current.blur();
    }
  };

  render() {
    const {
      onFocus,
      onBlur,
      clearButtonMode,
      editable,
      returnKeyType,
      keyboardAppearance,
      autoFocus,
      placeholder,
      placeholderTextColor,
      underlineColorAndroid,
      onSubmitEditing,
      ...userProps
    } = this.props.textInputProps || {};

    return (
      <View>
        <View
          style={[
            this.props.suppressDefaultStyles ? {} : defaultStyles.container,
            this.props.styles?.container,
          ]}
          pointerEvents="box-none"
        >
          {!this.props.textInputHide && (
            <View
              style={[
                this.props.suppressDefaultStyles
                  ? {}
                  : defaultStyles.textInputContainer,
                this.props.styles?.textInputContainer,
              ]}
            >
              {this._renderLeftButton()}
              <View style={{ width: '90%' }}>
                {!this.props.editable && (
                  <TouchableOpacity
                    onPress={() => {
                      setTimeout(() => {
                        this._onFocus();
                        this.triggerFocus();
                      }, 1000);
                    }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <Text
                      style={[
                        this.props.suppressDefaultStyles
                          ? { color: this.props.placeholderTextColor }
                          : [
                            defaultStyles.textInput,
                            { color: this.props.placeholderTextColor },
                          ],
                        [
                          this.props.styles?.textInput,
                          { color: this.props.placeholderTextColor },
                        ],
                        {
                          marginTop:
                            Platform.OS === 'android'
                              ? moderateScale(5)
                              : moderateScale(12),
                          color: this.props.placeholderTextColor,
                        },
                      ]}
                    >
                      {this.state.text || this.props.placeholder}
                    </Text>
                  </TouchableOpacity>
                )}

                {this.props.editable && (
                  <TextInput
                    ref={this.textInputRef}
                    editable={this.props.editable}
                    returnKeyType={returnKeyType || this.props.returnKeyType}
                    keyboardAppearance={
                      keyboardAppearance || this.props.keyboardAppearance
                    }
                    autoFocus={autoFocus || this.props.autoFocus}
                    style={[
                      this.props.suppressDefaultStyles
                        ? {}
                        : defaultStyles.textInput,
                      this.props.styles?.textInput,
                    ]}
                    value={this.state.text}
                    placeholder={placeholder || this.props.placeholder}
                    onSubmitEditing={
                      onSubmitEditing || this.props.onSubmitEditing
                    }
                    placeholderTextColor={
                      placeholderTextColor || this.props.placeholderTextColor
                    }
                    onFocus={
                      onFocus
                        ? () => {
                          this._onFocus();
                          onFocus();
                        }
                        : this._onFocus
                    }
                    onBlur={
                      onBlur
                        ? () => {
                          this._onBlur();
                          onBlur();
                        }
                        : this._onBlur
                    }
                    underlineColorAndroid={
                      underlineColorAndroid || this.props.underlineColorAndroid
                    }
                    clearButtonMode={
                      clearButtonMode ? clearButtonMode : 'while-editing'
                    }
                    {...userProps}
                    onChangeText={this._handleChangeText}
                  />
                )}
              </View>
              {this._renderRightButton()}
            </View>
          )}
          {this.props.children}
        </View>
        {this.state.listViewDisplayed &&
          this.state.dataSource.length > 0 && (
            <FlatList
              scrollEnabled={!this.props.disableScroll}
              style={[
                this.props.suppressDefaultStyles ? {} : defaultStyles.listView,
                this.props.styles?.listView,
              ]}
              data={this.state.dataSource}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => this._renderRow(item)}
              ItemSeparatorComponent={() => (
                <View
                  style={[
                    this.props.suppressDefaultStyles
                      ? {}
                      : defaultStyles.separator,
                    this.props.styles?.separator,
                  ]}
                />
              )}
              ListEmptyComponent={
                this.state.text.length > (this.props.minLength || 0) && this.props.listEmptyComponent
                  ? this.props.listEmptyComponent
                  : undefined
              }
              ListHeaderComponent={
                this.props.renderHeaderComponent
                  ? () => this.props.renderHeaderComponent!(this.state.text)
                  : undefined
              }
            />
          )}
      </View>
    );
  }
}

export function create(props: GooglePlacesAutocompleteProps) {
  return <GooglePlacesAutocomplete {...props} />;
}

export default GooglePlacesAutocomplete;