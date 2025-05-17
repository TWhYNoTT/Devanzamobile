import React, { Component } from 'react';
import { StyleSheet, StatusBar, View, Image ,TouchableOpacity} from 'react-native'
import { theme } from '../../../../core/theme';
import { Block, Text, } from '../../../../components/widget';
import * as loginActions from '../../../../actions/Actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../childs/Header';
import { moderateScale } from 'react-native-size-matters';
import { translate } from '../../../../utils/utils';
import HTML from 'react-native-render-html';
import Button from 'apsl-react-native-button'
import { FONT_FAMILY } from '../../../../services/config';
import { FlatList } from 'react-native';
import { Dimensions } from 'react-native';




class Filters extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isLoading: false, selected: 1, type: 1, branches: []
        }

    }


    getBanchesByCategory() {
        this.setState({ isLoading: true });
        var params = { lat: this.props.data.selectedLocation.geometry.lat, lng: this.props.data.selectedLocation.geometry.lng, category: this.props.navigation.state.params.item._id };
        Apis.Get('/devura/branchesByCategory?lat=' + params.lat + '&lng=' + params.lng + '&category=' + params.category).then((data) => {
            this.setState({ isLoading: false, branches: data.branches.results });
            console.log(data);
        }).catch((error) => {
            this.setState({ isLoading: false });
            console.log(error);
        })
    }
    componentDidMount() {
        this.getBanchesByCategory()
    }




    render() {
        return (
            <Block>
                <StatusBar backgroundColor="transparent" barStyle="light-content" />
                <View style={{ zIndex: 1 }}>
                    <Header backPress={() => { this.props.navigation.pop() }} r search={false} backPrimary={false} back={true} navigation={this.props.navigation} Text={translate('')} color={'transparent'} />
                </View>
                <View style={{ height: moderateScale(230), width: '100%', marginTop: moderateScale(-100) }}>
                    <Image source={{ uri: BASE_API_URL_IMAEG + this.props.navigation.state.params.item.image }} style={{ height: '100%', width: '100%', }} />
                    <Image source={require('../../../../assets/home-top-back.png')} style={{ height: '100%', width: '100%', position: 'absolute', }} />
                    <Image source={require('../../../../assets/home-bottom-back.png')} style={{ height: '100%', width: '100%', position: 'absolute', }} />

                </View>

                <Text bold style={{
                    color: theme.colors.white,
                    fontSize: moderateScale(30),
                    textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                        moderateScale(10), marginBottom: moderateScale(10), position: 'absolute', marginTop: moderateScale(100), marginHorizontal: moderateScale(20)
                }}>{this.props.navigation.state.params.item.name}</Text>

                <View style={{
                    marginTop: moderateScale(-40), backgroundColor: theme.colors.white, width: '100%', borderTopRightRadius: moderateScale(30),
                    borderTopLeftRadius: moderateScale(30), paddingHorizontal: moderateScale(10), paddingTop: moderateScale(10)
                }}>

                    <FlatList
                        data={this.state.branches}
                        extraData={this.state}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingTop: moderateScale(0), paddingBottom: moderateScale(250) }}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => this.renderListings(item, index)}
                    />


                </View>

            </Block>
        )
    }

    renderListings(listing, key) {
        const {
        } = this.props;

        return (
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('branchDetails', { item: listing }) }} style={{ width: '100%', marginVertical: moderateScale(10) }}>
                <View style={{ borderColor: theme.colors.primary, borderRadius: moderateScale(20), }}>
                    <View style={{ flexDirection: 'column', width: '100%', alignSelf: 'center' }}>
                        <View style={{
                            position: 'absolute', zIndex: 20, width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(100),
                            top: moderateScale(10), right: moderateScale(10), justifyContent: 'center',
                            alignContent: 'center', alignItems: 'center'
                        }}>

                            <TouchableOpacity onPress={() => {
                                if (this.props.data.userInfo && !!!this.props.data.userInfo.email) {
                                    this.props.actions.about.openLoginDialog({ navigate: '' });
                                    return;
                                }

                            }} style={{
                                width: moderateScale(40), height: moderateScale(40), justifyContent: 'center',
                                alignContent: 'center', alignItems: 'center'
                            }}>
                                <Image resizeMode="stretch"
                                    source={require('../../../../assets/like.png')}
                                    style={{ height: moderateScale(40), width: moderateScale(40), tintColor: theme.colors.white }} />
                            </TouchableOpacity>
                        </View>

                        <Image resizeMode="stretch"
                            source={require('../../../../assets/dummy1.png')}
                            style={{ height: moderateScale(200), width: '100%', borderRadius: moderateScale(20), }} />
                        <Image resizeMode="stretch"
                            source={require('../../../../assets/item-overlay.png')}
                            style={{ height: moderateScale(200), width: '100%', borderRadius: moderateScale(20), position: 'absolute', zIndex: 10, }} />

                        <View style={{ paddingHorizontal: moderateScale(5), marginTop: moderateScale(5) }}>

                            <Text style={{
                                color: theme.colors.black,
                                fontSize: moderateScale(15), textAlign: 'left', textTransform: 'capitalize', flex: 1, fontWeight: '800'
                            }}>{listing.name}</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', marginTop: moderateScale(1) }}>
                                <Text style={{
                                    color: theme.colors.primary,
                                    fontSize: moderateScale(12), textAlign: 'left', textTransform: 'capitalize', fontWeight: '800'
                                }}>{'Beauty salon'}</Text>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                    <Image resizeMode={'contain'} source={require('../../../../assets/star.png')} style={{ height: moderateScale(10), width: moderateScale(10), marginHorizontal: moderateScale(5) }} />
                                    <Text style={{
                                        color: theme.colors.black,
                                        fontSize: moderateScale(12), textAlign: 'left', textTransform: 'capitalize', fontWeight: '800'
                                    }}>{!listing.ratings ? translate('no reviews') : listing.ratings}</Text>
                                </View>

                                <View style={{
                                    marginStart: moderateScale(5), backgroundColor: theme.colors.primarylight,
                                    paddingHorizontal: moderateScale(10), paddingVertical: moderateScale(5), borderRadius: moderateScale(20)
                                }}>
                                    <Text style={{
                                        color: theme.colors.primary,
                                        fontSize: moderateScale(12), textAlign: 'left', textTransform: 'capitalize', fontWeight: '800'
                                    }}>{listing.type === 0 ? 'Gender Flaxible' : listing.type === 1 ? 'Men Only' : 'Female Only'}</Text>
                                </View>
                            </View>

                            <Text style={{
                                color: theme.colors.grayText,
                                fontSize: moderateScale(15), textAlign: 'left', textTransform: 'capitalize', marginTop: moderateScale(0), fontWeight: '400'
                            }}>{listing.location}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        );
    }



}

const mapStateToProps = (state) => ({
    data: {
        userInfo: state.login.userInfo
    },
})
const mapDispatchToProps = (dispatch) => ({
    actions: {
        about: bindActionCreators(loginActions, dispatch)
    }
})


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        backgroundColor: '#fff',
    },

});
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Filters))