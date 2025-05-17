import React, { Component } from 'react';
import { StyleSheet, View, I18nManager, StatusBar, Image, ScrollView } from 'react-native'
import { theme } from '../../../../core/theme';
import { Text } from '../../../../components/widget';
import * as loginActions from '../../../../actions/Actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showDanger, showSuccess, translate } from '../../../../utils/utils';
import { moderateScale } from 'react-native-size-matters';
import Header from '../childs/Header';
import { BASE_URL_IMAGE, FONT_FAMILY } from '../../../../services/config';
import Button from 'apsl-react-native-button'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import Loader from '../../../../components/loader';
import moment from 'moment'
import { Platform } from 'react-native';
import { Popup } from '../../../../components/popup-ui'
import * as Apis from '../../../../services/Apis';
import { Rating } from 'react-native-ratings';
import TextInput from '../../../../components/Weights/TextInput';
import { LayoutAnimation } from 'react-native';
import { DeviceEventEmitter } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';







class Rattings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notifications: true, DateSelected: false,
            item: this.props.navigation.getParam('item', null),
            isLoading: false, selectedRatting: 1, ratings: [], rating: 5, message: ''
        }


    }

    componentDidMount() {


    }




    Submit() {
        this.setState({ isLoading: true })
        console.log({ ratings: this.state.ratings })
        Apis.Post('ratings', {
            ratings: this.state.ratings
        }).then((data) => {
            DeviceEventEmitter.emit('ratingsDone', {});
            showSuccess('Ratings created submited!');
            this.props.navigation.pop();
        }).catch((error) => {
            console.log(error);
            this.setState({ isLoading: false })
        })
    }

    render() {


        var item = this.state.item;
        console.log(item)

        return (
            <View style={styles.container} >
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />

                <Header backPress={() => { this.props.navigation.pop() }} color={'transparent'} back={true} navigation={this.props.navigation} search={false} more={false} />
                <Loader isLoading={this.state.isLoading} />


                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollview}
                    enableOnAndroid={true}
                    extraScrollHeight={90}
                    enableOnAndroid={true} extraHeight={30} extraScrollHeight={30}
                    enableAutomaticScroll={(Platform.OS === 'ios')}
                    contentInsetAdjustmentBehavior="automatic">
                    <View showsVerticalScrollIndicator={false} style={{ paddingHorizontal: moderateScale(25), marginTop: moderateScale(10) }} contentContainerStyle={{ paddingBottom: moderateScale(100) }}>

                        {this.state.selectedRatting === 1 &&

                            <View style={{ flexDirection: 'column', paddingBottom: moderateScale(0), justifyContent: 'center', alignContent: 'center', alignItems: 'center', width: '90%', alignSelf: 'center', ...this.state.selectedRatting === 1 ? {} : { height: '0%', width: '0%' } }}>

                                <View style={{ flexDirection: 'column', marginHorizontal: moderateScale(5), marginTop: moderateScale(50) }}>
                                    <Text style={{
                                        color: theme.colors.black,
                                        fontSize: moderateScale(20),
                                        textAlign: 'center', textTransform: 'capitalize', marginHorizontal: moderateScale(10), fontWeight: '800',
                                    }}>{'How would you rate your expereince with ' + item.branch.name + '?'}</Text>

                                </View>
                                <View style={{
                                    backgroundColor: theme.colors.grayBackground, width: moderateScale(80),
                                    height: moderateScale(80), justifyContent: 'center', alignItems: 'center', borderRadius: moderateScale(20),
                                    marginTop: moderateScale(30)
                                }}>
                                    <Image resizeMode={'contain'} source={require('../../../../assets/devura.png')} style={{ width: moderateScale(40), height: moderateScale(40) }} />
                                </View>


                                <Rating
                                    tintColor={theme.colors.white}
                                    ratingBackgroundColor={theme.colors.gray}
                                    ratingCount={5}
                                    onFinishRating={(rating) => {
                                        this.setState({ rating: rating })
                                    }}
                                    ratingColor={theme.colors.primary}
                                    type={'custom'}
                                    imageSize={Number(Number(moderateScale(40)).toFixed(0))}
                                    startingValue={this.state.rating}
                                    style={{ backgroundColor: theme.colors.white, color: theme.colors.white, marginTop: moderateScale(30) }}
                                />


                                <TextInput
                                    style={{
                                        borderRadius: 5, borderColor: theme.colors.gray05, backgroundColor: theme.colors.white, borderRadius: moderateScale(10),
                                        borderWidth: 0, height: moderateScale(140), paddingStart: 10, ...I18nManager.isRTL ? { paddingEnd: 10, textAlign: 'right' } : {},
                                        fontFamily: FONT_FAMILY, paddingTop: moderateScale(10), paddingHorizontal: moderateScale(10), marginTop: moderateScale(30)
                                    }}
                                    value={this.state.message}
                                    onChangeText={text => this.setState({ message: text })}
                                    multiline={true}
                                    placeholder={translate('Write your feedback here…')}
                                    blurOnSubmit={true}
                                    underlineColorAndroid='transparent'
                                    autoCapitalize="sentences"
                                />





                            </View>


                        }

                        {this.state.selectedRatting === 2 &&
                            <View style={{ flexDirection: 'column', paddingBottom: moderateScale(0), justifyContent: 'center', alignContent: 'center', alignItems: 'center', width: '90%', alignSelf: 'center', ...this.state.selectedRatting === 2 ? {} : { width: '0%', height: '0%' } }}>

                                <View style={{ flexDirection: 'column', marginHorizontal: moderateScale(5), marginTop: moderateScale(50) }}>
                                    <Text style={{
                                        color: theme.colors.black,
                                        fontSize: moderateScale(20),
                                        textAlign: 'center', textTransform: 'capitalize', marginHorizontal: moderateScale(10), fontWeight: '800',
                                    }}>{'How would your expereince with Yasmin Ali?'}</Text>

                                </View>
                                <View style={{
                                    backgroundColor: theme.colors.grayBackground, width: moderateScale(80),
                                    height: moderateScale(80), justifyContent: 'center', alignItems: 'center', borderRadius: moderateScale(20),
                                    marginTop: moderateScale(30)
                                }}>
                                    <Image resizeMode={'contain'} source={{ uri: BASE_URL_IMAGE + item.bookingFor.image }} style={{ width: moderateScale(40), height: moderateScale(40) }} />


                                </View>

                                <Text style={{
                                    color: theme.colors.black,
                                    fontSize: moderateScale(20),
                                    textAlign: 'center', textTransform: 'capitalize', marginHorizontal: moderateScale(10), fontWeight: '800', marginTop: moderateScale(10)
                                }}>{item.bookingFor.name}</Text>
                                <Text style={{
                                    color: theme.colors.grayText,
                                    fontSize: moderateScale(15),
                                    textAlign: 'center', textTransform: 'capitalize', marginHorizontal: moderateScale(10), fontWeight: '800',
                                }}>{item.bookingFor.type}</Text>


                                <Rating
                                    tintColor={theme.colors.white}
                                    ratingBackgroundColor={theme.colors.gray}
                                    ratingCount={5}
                                    ratingColor={theme.colors.primary}
                                    type={'custom'}
                                    imageSize={Number(Number(moderateScale(40)).toFixed(0))}
                                    startingValue={4}
                                    style={{ backgroundColor: theme.colors.white, color: theme.colors.white, marginTop: moderateScale(30) }}
                                />


                                <TextInput
                                    style={{
                                        borderRadius: 5, borderColor: theme.colors.gray05, backgroundColor: theme.colors.white, borderRadius: moderateScale(10),
                                        borderWidth: 0, height: moderateScale(140), paddingStart: 10, ...I18nManager.isRTL ? { paddingEnd: 10, textAlign: 'right' } : {},
                                        fontFamily: FONT_FAMILY, paddingTop: moderateScale(10), paddingHorizontal: moderateScale(10), marginTop: moderateScale(30)
                                    }}
                                    value={this.state.message}
                                    onChangeText={text => this.setState({ message: text })}
                                    multiline={true}
                                    placeholder={translate('Write your feedback here…')}
                                    blurOnSubmit={true}
                                    underlineColorAndroid='transparent'
                                    autoCapitalize="sentences"
                                />





                            </View>


                        }

                    </View>


                </KeyboardAwareScrollView>


                <Button mode="contained"
                    activityIndicatorColor={theme.colors.white}
                    style={{
                        borderColor: 'transparent', color: theme.colors.white, borderRadius: moderateScale(10),
                        backgroundColor: theme.colors.primary, marginTop: moderateScale(30), width: '80%', alignSelf: 'center', marginBottom: moderateScale(20),

                    }} textStyle={{
                        fontSize: moderateScale(15),
                        color: theme.colors.white,
                        fontFamily: FONT_FAMILY, fontWeight: 'bold'
                    }}
                    onPress={() => {



                        if (this.state.selectedRatting === 1 && this.state.ratings.length === 0) {
                            this.state.ratings.push({
                                text: this.state.message,
                                rating: this.state.rating,
                                branch: item.branch._id,
                                user: this.props.data.userInfo._id ? this.props.data.userInfo._id : this.props.data.userInfo.id,
                                booking: item._id ? item._id : item.id,
                            })
                        }

                        if (this.state.selectedRatting === 2 && this.state.ratings.length === 1) {
                            this.state.ratings.push({
                                text: this.state.message,
                                rating: this.state.rating,
                                employee: item.bookingFor._id ? item.bookingFor._id : item.bookingFor.id,
                                booking: item._id ? item._id : item.id,
                                user: this.props.data.userInfo._id ? this.props.data.userInfo._id : this.props.data.userInfo.id
                            })
                        }



                        if (item.bookingFor && item.bookingFor.name && this.state.selectedRatting === 1) {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            if (this.state.selectedRatting === 1) {
                                this.setState({ selectedRatting: 2, message: '', rating: 5 })
                            }
                        } else {
                            this.setState({ ratings: this.state.ratings }, () => {
                                this.Submit();
                            })

                        }




                    }}>
                    {translate('Submit')}</Button>


            </View >
        )
    }



}

const mapStateToProps = (state) => ({
    data: {
        userInfo: state.login.userInfo
    },
})


const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(loginActions, dispatch)
})


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.white,

    },

    headerText: {
        fontSize: 25,
        alignSelf: 'center',
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
    groupTitle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    groupTitleText: {
        flex: 0.9,
        paddingHorizontal: 10,
        fontSize: 17,
        fontWeight: '500',
        color: theme.colors.white
    },
    groupTitleArrow: {
        width: 12,
        tintColor: theme.colors.white,
        height: 12,
        flex: 0.1,
        marginRight: 5
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
    heading: {
        fontSize: moderateScale(25),
        color: theme.colors.primary,
        width: '100%', alignSelf: 'center', marginVertical: moderateScale(20), marginTop: moderateScale(20), ...I18nManager.isRTL ? { textAlign: 'left' } : {},
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rattings))