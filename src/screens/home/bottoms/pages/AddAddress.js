import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, StatusBar, I18nManager, Image } from 'react-native'
import { theme } from '../../../../core/theme';
import { Block, Text } from '../../../../components/widget';
import * as loginActions from '../../../../actions/Actions';
import * as Apis from '../../../../services/Apis';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showDanger, showSuccess, translate } from '../../../../utils/utils';
import { moderateScale } from 'react-native-size-matters';
import Button from 'apsl-react-native-button'
import { Input } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Header from '../childs/Header'
import { FONT_FAMILY } from '../../../../services/config';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { Switch } from 'react-native-switch';
import Geocoder from 'react-native-geocoder';
import { Platform } from 'react-native';



class AddAddress extends Component {


    constructor(props) {
        super(props);

        this.state = {
            isLoading: false, selectedAddress: {}, loadAreas: false, list: [],
            address: { area: '', street: '', building: '', floor: '', apartment: '', landline: '', additional: '' }, options:
                [], areas: [], optionsType: [{ label: 'House', value: 'House' }, { label: 'Appartment', value: 'Appartment' },
                { label: 'Office', value: 'Office' }], selectedCity: '', selectedType: 1,



            building: '', floor: '', street: '', city: '', zipcode: '', name: '', phone: '', primary: false

        }

        this.inputRefs = {
            selectedCity: null, area: null, street: null, building: null, floor: null, apparetment: null, mobilenumber: null, extrainfo: null, type: null
        };
    }


    componentDidMount() {


        const selectedAddress = this.props.navigation.getParam('selectedAddress', null);
        console.log('location', this.props.navigation.getParam('location', null));
        if (selectedAddress) {
            this.setState({
                building: selectedAddress.building, floor: selectedAddress.floor, street: selectedAddress.street, city: selectedAddress.city,
                zipcode: selectedAddress.zipcode, name: selectedAddress.name, phone: selectedAddress.phone,
                selectedAddress: selectedAddress, primary: selectedAddress.primary === 1 ? true : false
            });
        } else {

            Geocoder.fallbackToGoogle('AIzaSyAl_KkpIB-kNu2GIhc4Kxejd0DDESQWMRM');
            Geocoder.geocodePosition({
                lat: this.props.navigation.getParam('location', null).geometry.lat,
                lng: this.props.navigation.getParam('location', null).geometry.lng,
            }).then(res => {
                console.log(res[0]);
                this.setState({ street: res[0].streetName + (res[0].subLocality ? ' , ' + res[0].subLocality : ''), city: res[0].locality })
            }).catch(err => {
                console.log(err)
            });
        }


    }


    AddAddress() {



        if (!this.state.building || this.state.building === '') {
            showDanger(translate('please enter building'));; this.inputRefs.building.shake(); return;
        }
        if (!this.state.floor || this.state.floor === '') {
            showDanger(translate('please enter floor')); this.inputRefs.floor.shake(); return;
        }


        if (!this.state.street || this.state.street === '') {
            showDanger(translate('please enter street')); this.inputRefs.street.shake(); return;
        }

        if (!this.state.city || this.state.city === '') {
            showDanger(translate('please enter city')); this.inputRefs.city.shake(); return;
        }

        if (!this.state.zipcode || this.state.zipcode === '') {
            showDanger(translate('please enter zipcode')); this.inputRefs.zipcode.shake(); return;
        }


        if (!this.state.name || this.state.name === '') {
            showDanger(translate('please enter name')); this.inputRefs.name.shake(); return;
        }


        if (!this.state.phone || this.state.phone === '') {
            showDanger(translate('please enter phone')); this.inputRefs.phone.shake(); return;
        }

        if (!this.state.more || this.state.more === '') {
            this.state.more = '';
        }


        var address = {
            building: this.state.building, floor: this.state.floor, street: this.state.street, city: this.state.city,
            zipcode: this.state.zipcode, name: this.state.name, phone: this.state.phone
        }

        this.state.address = address;
        this.state.address.lat = this.props.navigation.getParam('location', null).geometry.lat + "";
        this.state.address.lng = this.props.navigation.getParam('location', null).geometry.lng + "";
        this.state.address.locationString = this.props.navigation.getParam('location', null).location;
        this.state.address.primary = this.state.primary ? 1 : 0;

        this.setState({ isLoading: true })
        Apis.Post('address', this.state.address).then((data) => {
            console.log(data);
            showSuccess('Address created successfully');
            this.setState({ isLoading: false })
            this.props.actions.AddressBook.fetchUserAddresses({}, ((data) => { }), ((error) => { }))
            this.props.navigation.pop(2);
        }).catch((error) => {
            console.log(error);
            this.setState({ isLoading: false })
        })

    }
    UpdateAddress() {
        this.setState({ isLoading: true })

        var address = {
            building: this.state.building, floor: this.state.floor, street: this.state.street, city: this.state.city,
            zipcode: this.state.zipcode, name: this.state.name, phone: this.state.phone
        }

        this.state.address = address;
        this.state.address.lat = this.state.selectedAddress.lat + "";
        this.state.address.id = this.state.selectedAddress.id;
        this.state.address.lng = this.state.selectedAddress.lng + "";
        this.state.address.locationString = this.state.selectedAddress.locationString;
        this.state.address.primary = this.state.primary ? 1 : 0;


        this.props.actions.AddressBook.UpdateUserAddress(this.state.address, ((onSuccess) => {
            this.setState({ isLoading: false })
            this.props.actions.AddressBook.fetchUserAddresses({}, ((data) => { }), ((error) => { }))
            this.props.navigation.pop();
        }), ((onError) => {
            this.setState({ isLoading: false })
        }));


    }



    render() {





        const placeholder = {
            label: translate('SELECT CITY'),
            value: null,
            color: theme.colors.primary,
        };

        const { selectedAddress } = this.state;

        return (
            <Block color={theme.colors.white}>
                <StatusBar backgroundColor="transparent" barStyle="light-content" />

                <Header backPress={() => { this.props.navigation.pop() }} Text={translate('Add new address')} color={'transparent'} back={true} navigation={this.props.navigation} search={false} more={true} />

                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollview}
                    enableOnAndroid={true}
                    extraScrollHeight={90}
                    enableOnAndroid={true} extraHeight={130} extraScrollHeight={130}
                    enableAutomaticScroll={(Platform.OS === 'ios')}
                    contentInsetAdjustmentBehavior="automatic">


                    <View style={{
                        paddingVertical: moderateScale(10), paddingHorizontal: moderateScale(20),
                        justifyContent: 'center', alignContent: 'center', flexDirection: 'column', alignItems: 'center', paddingBottom: moderateScale(300)
                    }}>



                        <View style={{
                            width: '100%', height: moderateScale(130), marginBottom: moderateScale(50),
                        }}>
                            {this.props.navigation.state.params.mapImage &&
                                <Image resizeMode="stretch"
                                    resizeMode={'cover'}
                                    source={{ uri: this.props.navigation.state.params.mapImage }}
                                    style={{ width: '100%', height: moderateScale(170), borderRadius: moderateScale(20) }} />
                            }

                            {!this.props.navigation.state.params.mapImage && selectedAddress.lat &&

                                <View style={{ borderRadius: moderateScale(20), backgroundColor: 'white' }}>
                                    <MapView
                                        pitchEnabled={false} rotateEnabled={false} zoomEnabled={false} scrollEnabled={false}
                                        style={{
                                            width: '100%', height: moderateScale(170), borderRadius: moderateScale(20), justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue'
                                        }}
                                        initialRegion={{
                                            latitude: Number(selectedAddress.lat),
                                            longitude: Number(selectedAddress.lng),
                                            latitudeDelta: 0.0122,
                                            longitudeDelta: 0.0121,
                                        }}
                                        provider={PROVIDER_GOOGLE}>

                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image resizeMode={'contain'} source={require('../../../../assets/pin.png')} style={{ width: moderateScale(30), height: moderateScale(30) }} />
                                        </View>
                                    </MapView>
                                </View>
                            }

                        </View>




                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Input
                                labelStyle={{ color: theme.colors.secondary }}
                                containerStyle={{ paddingLeft: 0, paddingRight: 0, marginTop: moderateScale(10), flex: 1 }}
                                inputContainerStyle={{
                                    flex: 1, height: moderateScale(45),
                                    ...I18nManager.isRTL ? { paddingRight: moderateScale(10) } : { paddingLeft: moderateScale(5) },
                                    borderBottomWidth: 1, borderBottomColor: theme.colors.line, backgroundColor: theme.colors.white, paddingBottom: moderateScale(5)
                                }}
                                placeholderTextColor={theme.colors.gray}
                                inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                                returnKeyType="next"
                                ref={(input) => { if (input) { this.inputRefs.building = input; } }}
                                onSubmitEditing={() => { this.inputRefs.floor.focus() }}
                                placeholderTextColor={theme.colors.gray02}
                                placeholder={translate('Building#')}
                                value={this.state.building}
                                onChangeText={(value) => this.setState({ building: value })}
                            />
                            <View style={{ width: moderateScale(20) }} />
                            <Input
                                labelStyle={{ color: theme.colors.secondary }}
                                containerStyle={{ paddingLeft: 0, paddingRight: 0, marginTop: moderateScale(10), flex: 1 }}
                                inputContainerStyle={{
                                    flex: 1, height: moderateScale(45),
                                    ...I18nManager.isRTL ? { paddingRight: moderateScale(10) } : { paddingLeft: moderateScale(5) }, borderBottomWidth: 1,
                                    borderBottomColor: theme.colors.line, backgroundColor: theme.colors.white, paddingBottom: moderateScale(5)
                                }}
                                placeholderTextColor={theme.colors.gray}
                                inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                                returnKeyType="next"
                                ref={(input) => { if (input) { this.inputRefs.floor = input; } }}
                                onSubmitEditing={() => { this.inputRefs.street.focus() }}
                                placeholderTextColor={theme.colors.gray02}
                                placeholder={translate('Floor')}
                                value={this.state.floor}
                                onChangeText={(value) => this.setState({ floor: value })}

                            />
                        </View>


                        <Input
                            labelStyle={{ color: theme.colors.secondary }}
                            containerStyle={{ paddingLeft: 0, paddingRight: 0, marginTop: moderateScale(10), flex: 1 }}
                            inputContainerStyle={{
                                flex: 1, height: moderateScale(45),
                                ...I18nManager.isRTL ? { paddingRight: moderateScale(10) } : { paddingLeft: moderateScale(5) }, borderBottomWidth: 1,
                                borderBottomColor: theme.colors.line, backgroundColor: theme.colors.white, paddingBottom: moderateScale(5)
                            }}
                            placeholderTextColor={theme.colors.gray}
                            inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                            returnKeyType="next"
                            ref={(input) => { if (input) { this.inputRefs.street = input; } }}
                            onSubmitEditing={() => { this.inputRefs.city.focus() }}
                            placeholderTextColor={theme.colors.gray02}
                            placeholder={translate('Street address')}
                            value={this.state.street}
                            onChangeText={(value) => this.setState({ street: value })}

                        />





                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Input
                                labelStyle={{ color: theme.colors.secondary }}
                                containerStyle={{ paddingLeft: 0, paddingRight: 0, marginTop: moderateScale(10), flex: 1 }}
                                inputContainerStyle={{
                                    flex: 1, height: moderateScale(45),
                                    ...I18nManager.isRTL ? { paddingRight: moderateScale(10) } : { paddingLeft: moderateScale(5) },
                                    borderBottomWidth: 1, borderBottomColor: theme.colors.line, backgroundColor: theme.colors.white, paddingBottom: moderateScale(5)
                                }}
                                placeholderTextColor={theme.colors.gray}
                                inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                                returnKeyType="next"
                                ref={(input) => { if (input) { this.inputRefs.city = input; } }}
                                onSubmitEditing={() => { this.inputRefs.zipcode.focus() }}
                                placeholderTextColor={theme.colors.gray02}
                                placeholder={translate('City')}
                                value={this.state.city}
                                onChangeText={(value) => this.setState({ city: value })}

                            />
                            <View style={{ width: moderateScale(20) }} />
                            <Input
                                labelStyle={{ color: theme.colors.secondary }}
                                containerStyle={{ paddingLeft: 0, paddingRight: 0, marginTop: moderateScale(10), flex: 1 }}
                                inputContainerStyle={{
                                    flex: 1, height: moderateScale(45),
                                    ...I18nManager.isRTL ? { paddingRight: moderateScale(10) } : { paddingLeft: moderateScale(5) }, borderBottomWidth: 1,
                                    borderBottomColor: theme.colors.line, backgroundColor: theme.colors.white, paddingBottom: moderateScale(5)
                                }}
                                placeholderTextColor={theme.colors.gray}
                                inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                                returnKeyType="next"
                                ref={(input) => { if (input) { this.inputRefs.zipcode = input; } }}
                                onSubmitEditing={() => { this.inputRefs.name.focus() }}
                                placeholderTextColor={theme.colors.gray02}
                                placeholder={translate('Zip code')}
                                value={this.state.zipcode}
                                onChangeText={(value) => this.setState({ zipcode: value })}

                            />
                        </View>


                        <View style={{
                            flexDirection: 'row', justifyContent: 'center', alignContent: 'center',
                            alignItems: 'center', paddingVertical: moderateScale(13), marginTop: moderateScale(10)
                        }}>
                            <Switch
                                value={this.state.primary}
                                onValueChange={(val) => { this.setState({ primary: !this.state.primary }) }}
                                disabled={false}
                                activeText={''}
                                inActiveText={''}
                                circleSize={moderateScale(22)}
                                backgroundActive={theme.colors.primary}
                                backgroundInactive={theme.colors.secondary}
                                circleActiveColor={'#8191AB'}
                                circleInActiveColor={'#8191AB'}
                                changeValueImmediately={true}
                                changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                                innerCircleStyle={{
                                    alignItems: "center", justifyContent:
                                        "center", backgroundColor: theme.colors.white, height: moderateScale(17), width: moderateScale(17)
                                }} // style for inner animated circle for what you (may) be rendering inside the circle
                                outerCircleStyle={{}} // style for outer animated circle
                                renderActiveText={false}
                                renderInActiveText={false}
                                switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                                switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                                switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                                switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                            />
                            <Text style={{ fontSize: moderateScale(17), flex: 1, marginHorizontal: moderateScale(10), color: theme.colors.text, }}>
                                {translate('Primary')}
                            </Text>

                        </View>


                        <Input
                            labelStyle={{ color: theme.colors.secondary }}
                            containerStyle={{ paddingLeft: 0, paddingRight: 0, marginTop: moderateScale(10), flex: 1 }}
                            inputContainerStyle={{
                                flex: 1, height: moderateScale(45),
                                ...I18nManager.isRTL ? { paddingRight: moderateScale(10) } : { paddingLeft: moderateScale(5) }, borderBottomWidth: 1,
                                borderBottomColor: theme.colors.line, backgroundColor: theme.colors.white, paddingBottom: moderateScale(5)
                            }}
                            placeholderTextColor={theme.colors.gray}
                            inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                            returnKeyType="next"
                            ref={(input) => { if (input) { this.inputRefs.name = input; } }}
                            onSubmitEditing={() => { this.inputRefs.phone.focus() }}
                            placeholderTextColor={theme.colors.gray02}
                            placeholder={translate('Full name')}
                            value={this.state.name}
                            onChangeText={(value) => this.setState({ name: value })}

                        />


                        <Input
                            labelStyle={{ color: theme.colors.secondary }}
                            containerStyle={{ paddingLeft: 0, paddingRight: 0, marginTop: moderateScale(10), flex: 1 }}
                            inputContainerStyle={{
                                flex: 1, height: moderateScale(45),
                                ...I18nManager.isRTL ? { paddingRight: moderateScale(10) } : { paddingLeft: moderateScale(5) }, borderBottomWidth: 1,
                                borderBottomColor: theme.colors.line, backgroundColor: theme.colors.white, paddingBottom: moderateScale(5)
                            }}
                            placeholderTextColor={theme.colors.gray}
                            inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                            returnKeyType="next"
                            ref={(input) => { if (input) { this.inputRefs.phone = input; } }}
                            onSubmitEditing={() => { this.inputRefs.more.focus() }}
                            placeholderTextColor={theme.colors.gray02}
                            placeholder={translate('Phone number')}
                            value={this.state.phone}
                            onChangeText={(value) => this.setState({ phone: value })}

                        />



                        <Text style={{
                            color: theme.colors.black,
                            fontSize: moderateScale(15),
                            textAlign: 'left', textTransform: 'capitalize', flex: 1,
                            fontWeight: 'bold', marginTop: moderateScale(10), width: '100%', paddingStart: moderateScale(5)
                        }}>{'Directions'}</Text>



                        <Input
                            labelStyle={{ color: theme.colors.secondary }}
                            containerStyle={{ paddingLeft: 0, paddingRight: 0, marginTop: moderateScale(0), flex: 1 }}
                            inputContainerStyle={{
                                flex: 1, height: moderateScale(105),
                                ...I18nManager.isRTL ? { paddingRight: moderateScale(10) } : { paddingLeft: moderateScale(5) }, borderBottomWidth: 1,
                                borderBottomColor: theme.colors.line, backgroundColor: theme.colors.white, paddingBottom: moderateScale(5)
                            }}
                            placeholderTextColor={theme.colors.gray}
                            inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                            returnKeyType="next"
                            multiline={true}
                            ref={(input) => { if (input) { this.inputRefs.more = input; } }}
                            placeholderTextColor={theme.colors.gray02}
                            placeholder={translate('How to reach your home landmarks ect...')}
                            value={this.state.more}
                            onChangeText={(value) => this.setState({ more: value })}

                        />








                        <View>

                        </View>
                    </View>
                </KeyboardAwareScrollView>



                <View style={{
                    backgroundColor: 'white', position: 'absolute', bottom: moderateScale(0), width: '100%',
                    paddingBottom: moderateScale(20), paddingTop: moderateScale(15),
                }}>

                    {this.state.selectedAddress.id &&
                        <Button isLoading={this.state.deleteLoading}
                            disabledStyle={{ backgroundColor: theme.colors.white }}
                            style={{
                                borderColor: theme.colors.primary, marginTop: moderateScale(0),
                                borderRadius: moderateScale(10), borderWidth: moderateScale(0), height: moderateScale(45), width: '80%',
                                backgroundColor: theme.colors.white, alignSelf: 'center', marginBottom: moderateScale(0),
                            }} textStyle={{ fontSize: moderateScale(16), color: theme.colors.red, fontFamily: FONT_FAMILY, fontWeight: 'bold', textAlign: 'left' }}
                            onPress={() => {


                                this.setState({ deleteLoading: true });
                                Apis.Deleteaddress(this.state.selectedAddress.id).then((data) => {
                                    this.props.actions.AddressBook.fetchUserAddresses({}, ((data) => { }), ((error) => { }))
                                    this.props.navigation.pop()
                                    this.setState({ deleteLoading: false });
                                }).catch((error) => {
                                    this.setState({ deleteLoading: false });
                                    showDanger(translate('TRY AGAIN'));
                                });


                            }}>{translate('Delete Address')}</Button>
                    }



                    <Button isLoading={this.state.isLoading}
                        isDisabled={!!this.state.deleteLoading}
                        disabledStyle={{ backgroundColor: theme.colors.disabled }}
                        style={{
                            borderColor: theme.colors.primary,
                            borderRadius: moderateScale(10), borderWidth: moderateScale(0), height: moderateScale(45), width: '80%',
                            backgroundColor: theme.colors.primary, alignSelf: 'center', marginBottom: moderateScale(20), marginTop: moderateScale(10),
                        }} textStyle={{ fontSize: moderateScale(16), color: theme.colors.white, fontFamily: FONT_FAMILY, fontWeight: 'bold' }}
                        onPress={() => {


                            if (this.state.selectedAddress.id) {
                                this.UpdateAddress()
                            } else {
                                this.AddAddress()
                            }


                        }}>{translate(this.state.selectedAddress.id ? 'Save' : 'Add')}</Button>
                </View>


                <View style={{ height: 0 }}>
                    <RNPickerSelect
                        placeholder={placeholder}
                        items={this.state.options}
                        onValueChange={value => {
                            this.state.address.city = value;
                            this.setState({ address: this.state.address })
                            for (let k in this.state.options) {
                                if (this.state.options[k].value === value) {
                                    this.state.selectedCity = this.state.options[k].label;
                                    // this.loadAreas(this.state.options[k].value);
                                }
                            }
                        }}
                        onDonePress={value => {
                        }}
                        useNativeAndroidPickerStyle={false}
                        ref={el => {
                            this.inputRefs.selectedCity = el;
                        }}
                    />



                </View>

            </Block >
        )


    }

}

const mapStateToProps = (state) => ({
    data: {
        userInfo: state.login.userInfo,
        selectedLocation: state.login.selectedLocation,
    },
})


const mapDispatchToProps = (dispatch) => ({
    actions: {
        AddressBook: bindActionCreators(loginActions, dispatch)
    }
})


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },

    headerText: {
        fontSize: 25,
        alignSelf: 'center',
    },
    scrollview: {
        marginHorizontal: moderateScale(10),
        marginTop: moderateScale(5),
        marginBottom: 1000,


    },
    back: {
        alignSelf: 'flex-end',
        height: 50,
        width: 50,
        borderRadius: 20,
        marginRight: 10,
    },

    header: {
        marginTop: 100,
        marginBottom: 30,
        color: 'white',
        alignItems: 'center',
        paddingHorizontal: theme.sizes.base * 2,
    },
    avatar: {
        height: 120,
        width: 120
    },
    inputs: {
        marginTop: theme.sizes.base * 0,
        paddingHorizontal: theme.sizes.base * 2,
    },
    inputRow: {
        alignItems: 'flex-end'
    },
    sliders: {
        marginTop: theme.sizes.base * 0.7,
        paddingHorizontal: theme.sizes.base * 2,
    },
    thumb: {
        width: theme.sizes.base,
        height: theme.sizes.base,
        borderRadius: theme.sizes.base,
        borderColor: 'white',
        borderWidth: 3,
        backgroundColor: theme.colors.secondary,
    },
    groupHeader: {
        height: 40,
        backgroundColor: theme.colors.secondary,
        flexDirection: 'row',
        alignItems: 'center'
    },

    toggles: {
        marginTop: 10,
        paddingHorizontal: theme.sizes.base * 1
    },
    iconCounter: {
        height: 120,
        width: 120,
    },
    iconCounterDummy: {
        height: 130,
        width: 130,
    },
    iconCounterText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 10,
        marginBottom: 10,
        textAlign: "center"
    },
    containerReviews: {
        marginTop: 0.5,
        borderBottomColor: '#ededed',
        borderBottomWidth: 1,
        backgroundColor: 'white'
    },
    subtitle: {
        color: theme.colors.secondary,
        fontSize: 15,
        paddingStart: 10,
        paddingEnd: 10,
    },
    titleContainer: {
        justifyContent: 'center',
        flex: 1
    },
    info: {
        width: '100%',
        minHeight: 70,
        paddingStart: 10,
        paddingEnd: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 5, borderColor: theme.colors.white, borderWidth: 1, paddingStart: 10, color: theme.colors.white,
        borderRadius: 5,
    },
    checkout: {
        width: '100%',
        color: theme.colors.secondary,
        fontSize: 16,
        marginTop: 2,
        borderWidth: 0,
        paddingEnd: 6,
        paddingStart: 6,
        paddingTop: 3,
        borderColor: theme.colors.secondary,
        paddingBottom: 3,
        fontWeight: '400',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    mainselections: {
        flexDirection: 'row', marginTop: moderateScale(20), marginHorizontal: moderateScale(10)
    },
    selections: {
        backgroundColor: theme.colors.secondary, height: moderateScale(38), flex: 1, marginHorizontal: moderateScale(2),
        alignItems: 'center', alignContent: "center", flexDirection: 'row', alignSelf: 'center', textAlign: 'center', borderRadius: moderateScale(20)
    },
    selectionstext: {
        color: theme.colors.primary, width: '100%', textAlign: 'center', fontSize: moderateScale(15), fontWeight: '900',
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AddAddress))