import React, { Component } from 'react';
import { StyleSheet, StatusBar, View, Image, RefreshControl, FlatList, TouchableOpacity } from 'react-native'
import { theme } from '../../../../core/theme';
import { Text, } from '../../../../components/widget';
import * as loginActions from '../../../../actions/Actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { moderateScale } from 'react-native-size-matters';
import { translate } from '../../../../utils/utils';
import Header from '../childs/Header';
import Loader from '../../../../components/loader';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'






class yourParcel extends Component {





    ref = [];
    images = [];

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true, optionsforShipmentWithuser: false, selected: 0

        }
    }




    componentDidMount() {
        this.laodAddress();
    }

    laodAddress() {
        this.props.actions.fetchUserAddresses({}, ((data) => {
            this.setState({ isLoading: false })
            console.log(data)
        }), ((error) => {
            this.setState({ isLoading: false })
            console.log(error)
        }))

    }




    render() {



        return (
            <View style={{ backgroundColor: theme.colors.white, flex: 1 }}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Loader isLoading={this.state.isLoading} />
                <Header backPress={() => { this.props.navigation.pop() }} add={true} addClick={() => { this.props.navigation.navigate('LocationPicker', { address: true }) }} Text={translate('Address')} color={'transparent'} back={true} navigation={this.props.navigation} search={false} more={false} />

                {!this.state.isLoading && this.props.addresses && this.props.addresses.data && this.props.addresses.data.results && this.props.addresses.data.results.length !== 0 &&

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        extraData={this.state}
                        contentContainerStyle={{ paddingBottom: moderateScale(100) }}
                        style={{ marginTop: moderateScale(20), }}
                        data={this.props.addresses.data?.results} keyExtractor={(item, index) => index.toString()}
                        refreshControl={<RefreshControl
                            colors={[theme.colors.primary, theme.colors.secondary]}
                            tintColor={theme.colors.primary}
                            onRefresh={() => { this.laodAddress(); }} />}
                        renderItem={({ item, index }) => this.renderListings(item, index)}
                    />

                }




                {this.props.addresses && this.props.addresses.data && this.props.addresses.data.results && this.props.addresses.data.results.length === 0 &&
                    <View style={{ flex: 1, height: '100%', justifyContent: 'center', paddingBottom: moderateScale(300), padding: moderateScale(40), }}>
                        <Image source={require('app/assets/noappointment.png')} resizeMode="contain" style={{ height: moderateScale(110), width: moderateScale(150), marginVertical: moderateScale(10), alignSelf: 'center' }} />

                        <Text bold style={{
                            color: theme.colors.black,
                            fontSize: moderateScale(25), textAlign: 'center', textTransform: 'capitalize', marginTop: moderateScale(20)
                        }}>{'No address '}</Text>
                        <Text style={{
                            color: theme.colors.grayText,
                            fontSize: moderateScale(15), textAlign: 'center', textTransform: 'capitalize', marginTop: moderateScale(10)
                        }}>{'To Create new address click on + button on top.'}</Text>


                    </View>
                }
            </View >

        )
    }

    renderListings(listing, key) {
        const {
        } = this.props;

        return (
            <View style={{
                width: '90%',
                borderRadius: moderateScale(20),
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.20,
                shadowRadius: 1.41,
                elevation: 2,
                alignSelf: 'center',
                elevation: 5,
                backgroundColor: 'white', marginBottom: moderateScale(20)
            }} onPress={() => {
                // if (this.props.navigation.getParam('fromSelection', null)) {
                //     if (!this.props.navigation.getParam('back', false)) {
                //         this.props.newBookingData.address = listing;
                //         this.props.actions.newBookingData(this.props.newBookingData);
                //         this.props.navigation.navigate('OptionSelectDate')
                //     } else {
                //         this.props.newBookingData.address = listing;
                //         this.props.actions.newBookingData(this.props.newBookingData);
                //         this.props.navigation.pop(2)
                //     }
                // }

            }}>
                <View style={{
                    flexDirection: 'row', paddingBottom: moderateScale(0), width: '100%', borderTopRightRadius: moderateScale(20),
                    borderTopLeftRadius: moderateScale(20),
                }}>

                    <View style={{
                        flexDirection: 'column', width: '100%', borderTopRightRadius: moderateScale(20),
                        borderTopLeftRadius: moderateScale(20), zIndex: 10,
                    }}>
                        <View style={{
                            height: moderateScale(160),
                            borderTopRightRadius: moderateScale(20),
                            borderTopLeftRadius: moderateScale(20),
                            width: '100%', zIndex: 0, overflow: 'hidden'
                        }}>




                            {!false &&
                                <MapView
                                    pitchEnabled={false}
                                    zoomTapEnabled={false}
                                    rotateEnabled={false}
                                    zoomEnabled={false}
                                    scrollEnabled={false}
                                    provider={PROVIDER_GOOGLE}
                                    style={{
                                        height: '100%',
                                        borderRadius: moderateScale(20),
                                        borderBottomLeftRadius: moderateScale(0),
                                        borderBottomRightRadius: moderateScale(0),
                                        width: '100%'
                                    }}
                                    initialRegion={{
                                        latitude: parseFloat(listing.lat),
                                        longitude: parseFloat(listing.lng),
                                        latitudeDelta: 0.0082,
                                        longitudeDelta: 0.0081,
                                    }}
                                >
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image resizeMode={'contain'} source={require('../../../../assets/pin.png')} style={{ width: moderateScale(30), height: moderateScale(30), }} />
                                    </View>

                                </MapView>
                            }


                        </View>
                        <View style={{
                            flexDirection: 'row', paddingBottom: moderateScale(20), marginTop: moderateScale(10), flex: 1
                        }}>

                            <View style={{ flex: 1 }}>

                                <View style={{
                                    flexDirection: 'column', marginTop: moderateScale(7)
                                }}>
                                    <Text style={{
                                        color: theme.colors.blackText,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(20), fontWeight: '800'
                                    }}>{listing.name}</Text>
                                    <Text style={{
                                        color: theme.colors.blackText,
                                        fontSize: moderateScale(15), marginTop: moderateScale(5),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(20),
                                    }}>{listing.street + ' , ' + listing.building + ' ,' + listing.city}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{
                                            color: theme.colors.blackText,
                                            fontSize: moderateScale(15),
                                            textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                                moderateScale(20), flex: 1
                                        }}>{listing.phone}</Text>

                                        {listing.primary === 1 &&
                                            <Text style={{
                                                color: theme.colors.primary,
                                                fontSize: moderateScale(15),
                                                textAlign: 'left', textTransform: 'capitalize', fontWeight: '800',
                                            }}>{'Primary'}</Text>
                                        }
                                    </View>

                                </View>
                            </View>

                            {!this.props.navigation.getParam('fromSelection', null) &&
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('addAddress', { selectedAddress: listing }) }} style={{
                                    flexDirection: 'row', justifyContent: 'center',
                                    alignContent: 'center', alignItems: 'center', height: '100%', marginEnd: moderateScale(20)
                                }}>
                                    <Text style={{
                                        color: theme.colors.primary,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', fontWeight: '800',
                                    }}>{'Edit'}</Text>
                                </TouchableOpacity>
                            }


                            {this.props.navigation.getParam('fromSelection', null) &&
                                <TouchableOpacity onPress={() => {




                                    if (this.props.navigation.getParam('fromSelection', null)) {
                                        if (!this.props.navigation.getParam('back', false)) {
                                            this.props.newBookingData.address = listing;
                                            this.props.actions.newBookingData(this.props.newBookingData);
                                            this.props.navigation.navigate('OptionSelectDate')
                                        } else {
                                            this.props.newBookingData.address = listing;
                                            this.props.actions.newBookingData(this.props.newBookingData);
                                            this.props.navigation.pop(2)
                                        }
                                    }



                                }} style={{
                                    flexDirection: 'row', justifyContent: 'center',
                                    alignContent: 'center', alignItems: 'center', height: '100%', marginEnd: moderateScale(20)
                                }}>
                                    <Text style={{
                                        color: theme.colors.primary,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', fontWeight: '800',
                                    }}>{'Select'}</Text>

                                </TouchableOpacity>
                            }



                        </View>


                    </View>



                </View>

            </View>

        );
    }




}

const mapStateToProps = (state) => {
    return {
        addresses: {
            ...state.app.addresses
        },
        userInfo: state.login.userInfo,
        newBookingData: state.app.newBookingData,
    };
};
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(loginActions, dispatch)
})


const styles = StyleSheet.create({
    container_scrolling: {
        flex: 1,

    },
    wrapper: {
        flex: 1,
    },
    heading: {
        fontSize: moderateScale(16), color: theme.colors.gray04,
        fontWeight: '500', textAlign: 'center', marginHorizontal: moderateScale(20)
    },
    button: {
        color: theme.colors.white, padding: 10, fontWeight: '700', fontSize: moderateScale(15), textAlign: 'center',
        borderRadius: moderateScale(10),
    }

});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(yourParcel))
