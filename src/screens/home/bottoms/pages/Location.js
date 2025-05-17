/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import {
  View,
  StyleSheet, StatusBar, TouchableOpacity, Image, Dimensions
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loginActions from '../../../../actions/Actions';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';

import { theme } from '../../../../core/theme';
import { showDanger, translate } from '../../../../utils/utils';
import Header from '../childs/Header'
import { moderateScale } from 'react-native-size-matters';
import { Text } from '../../../../components/widget';





class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      currentArea: '',
      favouriteListings: [],
      lat: 0,
      lng: 0,
      Operations: true,
      initial: true,
      showMap: false
    };



  }


  componentDidMount() {
   

  }




  OnLocationSelected = (details) => {
    if (details) {
      console.log('details'.details);
      this.props.actions.locations.setdefaultLocation({ location: details.formatted_address, geometry: { lat: details.geometry.location.lat, lng: details.geometry.location.lng } });
      this._gotoCurrentLocation();
    }
  }

  componentWillReceiveProps(nextProps) {


  }


  animate() {
    if (this.map)
      this.map.animateToRegion({
        latitude: this.state.lat,
        longitude: this.state.lng,
        latitudeDelta: 0.01122,
        longitudeDelta: 0.01121,
      });
  }

  _gotoCurrentLocation() {
    this.map.animateToRegion({
      latitude: this.props.data.selectedLocation.geometry.lat,
      longitude: this.props.data.selectedLocation.geometry.lng,
      latitudeDelta: 0.01122,
      longitudeDelta: 0.01121,
    });
  }

  render() {

    let initallocation = ''

    if (initallocation === translate('locationsError')) {
      initallocation = '';
    }


    return (

      < View style={styles.wrapper} >
        <StatusBar backgroundColor={theme.colors.secondary} barStyle="light-content" />
        <Header backPress={() => { this.props.navigation.pop() }} Text={translate('TRACK ON MAP')} color={'transparent'} back={true} navigation={this.props.navigation} search={false} more={true} />

        <View style={{ backgroundColor: theme.colors.white, marginTop: moderateScale(10) }}>

        </View>



        {this.state.showMap &&
          <MapView
            ref={ref => { this.map = ref; }}
            style={[styles.mapStyle, { justifyContent: 'center', alignContent: 'center', alignItems: 'center', paddingBottom: 50, zIndex: -1 }]}
            initialRegion={{
              latitude: this.state.lat,
              longitude: this.state.lng,
              latitudeDelta: 0.00122,
              longitudeDelta: 0.00121,
            }}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onRegionChangeComplete={event => {

            }}
            provider={PROVIDER_GOOGLE}>
            <Marker
              coordinate={{
                latitude: this.state.lat,
                longitude: this.state.lng
              }}
              title={translate('Parecel Location')}>
              {/* <Image source={require('../../../../assets/pin.png')} style={{ width: 40, height: 40 }} /> */}
            </Marker>
          </MapView>

        }

        {!this.state.showMap &&
          <View
            style={[styles.mapStyle, { justifyContent: 'center', alignContent: 'center', alignItems: 'center', paddingBottom: 50, zIndex: -1 }]}>
          </View>

        }


        <View resizeMode="stretch" style={[
          {
            marginHorizontal: moderateScale(10), flexDirection: 'column',
            justifyContent: 'center', alignContent: 'center', alignItems: 'center',
            marginVertical: moderateScale(40), position: 'absolute', bottom: 0, alignSelf: 'center',
            paddingHorizontal: moderateScale(20), paddingVertical: moderateScale(0), width: '90%',
          },]}>
          <TouchableOpacity style={styles.layoutselect} onPress={() => {


            this.map.animateToRegion({
              latitude: this.props.data.selectedLocation.geometry.lat,
              longitude: this.props.data.selectedLocation.geometry.lng,
              latitudeDelta: 0.00122,
              longitudeDelta: 0.00121,
            });
          }}>

            <View style={{
              flexDirection: 'row', width: '100%', marginTop: moderateScale(15),
              backgroundColor: theme.colors.white, padding: moderateScale(10), paddingEnd: moderateScale(5),
              justifyContent: 'center', alignSelf: 'center', alignItems: 'center'
            }}>
              <Text numberOfLines={1} style={{
                color: theme.colors.primary, fontSize: moderateScale(17), paddingHorizontal: moderateScale(10)
              }}>
                {translate('TRACKING ID')}
              </Text>

              <Text numberOfLines={1} style={{
                backgroundColor: theme.colors.primary, fontSize: moderateScale(15), width: moderateScale(1)
              }} />
              <Text numberOfLines={1} style={{
                color: theme.colors.gray04, fontSize: moderateScale(15), paddingHorizontal: moderateScale(10), flex: 1
              }}>
                {this.props.navigation.state.params.shipment.tag}
              </Text>
            </View>
          </TouchableOpacity>

        </View>


      </View >
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors.white,
    justifyContent: 'center'

  },
  locatoncontainer: {
    height: '100%', width: '100%', alignContent: 'center',
    position: 'absolute',
    alignItems: 'center', alignSelf: 'center', justifyContent: 'center',
    flexDirection: 'row', backgroundColor: 'transparent', zIndex: 1
  },
  mainContainer: {
    width: '100%',
    position: 'absolute',
    height: '100%'
  },
  categories: {
    marginBottom: 20,
  },
  layoutselect: {

  },
  title: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'center',
    padding: 5,
    textAlignVertical: 'center'
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: '100%'
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    flex: 1

  },
});


const mapStateToProps = (state) => ({
  data: {
    selectedLocation: state.login.selectedLocation,
    selectedRequest: state.app.selectedRequest,
  },
})
const mapDispatchToProps = (dispatch) => ({
  actions: {
    locations: bindActionCreators(loginActions, dispatch)
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Location))

