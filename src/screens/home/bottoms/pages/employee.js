import React, { Component } from 'react';
import { StyleSheet, StatusBar, View, Image, RefreshControl, FlatList, TouchableOpacity } from 'react-native'
import { theme } from '../../../../core/theme';
import { Text, } from '../../../../components/widget';
import * as loginActions from '../../../../actions/Actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { moderateScale } from 'react-native-size-matters';
import { showDanger, translate } from '../../../../utils/utils';
import Header from '../childs/Header';
import Loader from '../../../../components/loader';
import { BASE_URL_IMAGE } from '../../../../services/config';
import { Rating } from 'react-native-ratings';






class Employee extends Component {


    ref = [];
    images = [];

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true, optionsforShipmentWithuser: false, selected: 0

        }
    }




    componentDidMount() {
        this.fetchEmployes();
    }

    fetchEmployes() {
        this.props.actions.fetchEmployes({ id: this.props.newBookingData.item.id ? this.props.newBookingData.item.id : this.props.newBookingData.item._id }, ((data) => {
            this.setState({ isLoading: false })
            console.log('this.props.data', data)
        }), ((error) => {
            this.setState({ isLoading: false })
            console.log('this.props.data', error)
        }))

    }







    render() {

        console.log(this.props.employes.data, this.props.newBookingData.item.id ? this.props.newBookingData.item.id : this.props.newBookingData.item._id)

        return (
            <View style={{ backgroundColor: theme.colors.white, flex: 1 }}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Loader isLoading={this.state.isLoading} />
                <Header backPress={() => { this.props.navigation.pop() }} skpe={true} skpeClick={() => {







                    if (!this.props.navigation.getParam('back', false)) {
                        this.props.newBookingData.employee = {};
                        this.props.actions.newBookingData(this.props.newBookingData);
                        this.props.navigation.navigate('OptionsForService');
                    } else {

                        this.props.newBookingData.employee = {};
                        this.props.actions.newBookingData(this.props.newBookingData);
                        this.props.navigation.pop(1)
                    }



                }} Text={translate('Address')} color={'transparent'} back={true} navigation={this.props.navigation} search={false} more={false} />



                <View style={{ alignContent: 'center', width: '100%', padding: moderateScale(25), paddingBottom: moderateScale(0) }}>
                    <Text bold style={{ fontSize: moderateScale(30), marginTop: moderateScale(0) }}>
                        {translate('Select staff')}
                    </Text>
                </View>

                {!this.state.isLoading && this.props.employes && this.props.employes.data && this.props.employes.data.results && this.props.employes.data.results.length !== 0 &&

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        extraData={this.state}
                        contentContainerStyle={{ paddingBottom: moderateScale(100) }}
                        style={{ marginTop: moderateScale(10), }}
                        data={this.props.employes.data?.results} keyExtractor={(item, index) => index.toString()}
                        refreshControl={<RefreshControl
                            colors={[theme.colors.primary, theme.colors.secondary]}
                            tintColor={theme.colors.primary}
                            onRefresh={() => { this.fetchEmployes(); }} />}
                        renderItem={({ item, index }) => this.renderListings(item, index)}
                    />

                }




                {!this.state.isLoading && this.props.employes && this.props.employes.data && this.props.employes.data.results && this.props.employes.data.results.length === 0 &&
                    <View style={{ flex: 1, height: '100%', justifyContent: 'center', paddingBottom: moderateScale(300), padding: moderateScale(40), }}>
                        <Image source={require('app/assets/noappointment.png')} resizeMode="contain" style={{ height: moderateScale(110), width: moderateScale(150), marginVertical: moderateScale(10), alignSelf: 'center' }} />

                        <Text bold style={{
                            color: theme.colors.black,
                            fontSize: moderateScale(25), textAlign: 'center', textTransform: 'capitalize', marginTop: moderateScale(20)
                        }}>{'No employee '}</Text>
                        <Text style={{
                            color: theme.colors.grayText,
                            fontSize: moderateScale(15), textAlign: 'center', textTransform: 'capitalize', marginTop: moderateScale(10)
                        }}>{'To you can skip this part.'}</Text>


                    </View>}
            </View >

        )
    }

    renderListings(listing, key) {
        const {
        } = this.props;

        return (
            <TouchableOpacity style={{
                width: '90%',
                backgroundColor: 'white',
                marginBottom: moderateScale(-10)
            }} onPress={() => {
                if (!this.props.navigation.getParam('back', false)) {
                    this.props.newBookingData.employee = listing;
                    this.props.actions.newBookingData(this.props.newBookingData);
                    this.props.navigation.navigate('OptionsForService')
                } else {

                    this.props.newBookingData.employee = listing;
                    this.props.actions.newBookingData(this.props.newBookingData);
                    this.props.navigation.pop(1)
                }

            }}>

                <View style={{ flex: 1, flexDirection: 'row', padding: moderateScale(20) }}>
                    <View>
                        <View
                            style={{
                                width: moderateScale(65), height: moderateScale(65), borderWidth: moderateScale(0.4), borderRadius: moderateScale(15), backgroundColor: theme.colors.secondary,
                                justifyContent: 'center', alignItems: 'center', alignContent: 'center', alignSelf: 'center',
                            }}
                        >
                            <Image resizeMode='cover'
                                style={{
                                    width: '100%', height: '100%', borderRadius: moderateScale(15),
                                }}
                                source={{ uri: BASE_URL_IMAGE + listing.image?.filename }}
                            />
                        </View>
                    </View>
                    <View style={{
                        flex: 1, paddingHorizontal: moderateScale(20), flexDirection: 'column', justifyContent: 'center',
                        alignItems: 'flex-start', alignContent: 'center', alignSelf: 'center'
                    }}>
                        <Text style={{ flex: 1, fontSize: moderateScale(17), fontWeight: '800' }}>
                            {listing.name}{'\n'}
                            <Text style={{ color: theme.colors.grayText, fontWeight: '500', fontSize: moderateScale(12) }}>
                                {listing.type}
                            </Text>
                        </Text>

                        <View style={{ flexDirection: 'row' }}>
                            <Rating
                                tintColor={theme.colors.white}
                                ratingBackgroundColor={theme.colors.gray}
                                ratingCount={5}
                                ratingColor={theme.colors.primary}
                                type={'custom'}
                                readonly={true}
                                imageSize={Number(Number(moderateScale(16)).toFixed(0))}
                                startingValue={4}
                                style={{ backgroundColor: theme.colors.white, color: theme.colors.white, marginTop: moderateScale(-22) }}
                            />
                            <Text style={{ color: theme.colors.black, fontWeight: '500', marginTop: moderateScale(-22), paddingHorizontal: moderateScale(10) }}>
                                {'4.0'}
                            </Text>
                        </View>

                    </View>
                </View>





            </TouchableOpacity >

        );
    }




}

const mapStateToProps = (state) => {
    return {
        employes: {
            ...state.app.employes
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

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Employee))
