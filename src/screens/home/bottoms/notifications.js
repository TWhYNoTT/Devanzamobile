import React, { Component } from 'react';
import { StyleSheet, StatusBar, View, Modal, ImageBackground, Image } from 'react-native'
import { Block, Text, } from '../../../components/widget';
import * as loginActions from '../../../actions/Actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProductView from './childs/ProductView';
import Header from './childs/Header';
import NotificaitonsListing from '../bottoms/childs/NotificaitonsListing'
import { translate } from '../../../utils/utils';
import { theme } from '../../../core/theme';


class notifications extends Component {

    state = {
        Wishlist: []
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            list: [],
            modalVisible: false,
            selectedProduct: {},
            page: 0,
            lastindex: -1,
            animatingLoadMore: false,
            noMoreMeals: false,
            noMoreProducts: false,
            somethingWentWrong: false,
        }


        this.handleLoadMoreClick = this.handleLoadMoreClick.bind(this);
        this.hideModel = this.hideModel.bind(this);
        this.loadRefresh = this.loadRefresh.bind(this);
    }



    hideModel() {
        this.setState({ modalVisible: !this.state.modalVisible })
    }

    componentDidMount() {
        this.setState({ isLoading: true, animating: true })
        this.loadData();
    }
    loadData() {
        setTimeout(() => {
            this.props.actions.Products.fetchNotifications({ page: 0 }, this.onSuccess, this.onError);
        }, 100);
    }
    loadRefresh() {
        this.loadData();
    }
    handleLoadMoreClick() {
        this.state.page = this.state.page + 1;
        this.state.animatingLoadMore = true
        this.setState({ page: this.state.page, animatingLoadMore: this.state.animatingLoadMore })
        this.props.actions.Products.fetchNotifications({ page: this.state.page }, this.onSuccess, this.onError);

    }
    onSuccess = (data) => {
        // console.log('notifications', data);
        setTimeout(() => {
            this.setState({ isLoading: false })
        }, 500);
        if (data.code === 200) {

            if (this.state.animatingLoadMore) {
                var allnotifications = this.state.list.concat(data.data.notifications);
                var noMoreMeals = false;
                if (data.data.notifications.length < 11 || data.data.notifications.length === 0) {
                    noMoreMeals = true;
                }

                setTimeout(() => {
                    this.setState({ list: allnotifications, somethingWentWrong: false, animating: false, animatingLoadMore: false, noMoreMeals: noMoreMeals })
                }, 1000);

            } else {
                this.setState({ list: data.data.notifications, isLoading: false, animatingLoadMore: false, animating: false, noMoreMeals: false, page: 0, somethingWentWrong: false, })
            }



        } else {
            this.setState({ list: [], isLoading: false, somethingWentWrong: true, })

        }

    }
    onError = (error) => {
        this.setState({ list: [], isLoading: false, somethingWentWrong: true, animating: false, })
    }



    render() {
        return (

            <Block>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Header  backPress={() => { this.props.navigation.pop() }} color={theme.colors.primary} back={true} options={true} optionsclick={() => { this.sort.show() }} navigation={this.props.navigation} Text={translate('Notifications')}  />


                {this.state.Empity && !this.state.isLoading &&
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', alignContent: 'center', alignSelf: 'center', marginTop: moderateScale(60) }}>
                        <Image resizeMode="stretch" source={require('app/assets/noorders.png')} style={{ width: moderateScale(170), height: moderateScale(160), }} />
                        <Text style={{ color: theme.colors.secondary, padding: moderateScale(15), fontSize: moderateScale(20), fontWeight: 'bold' }}>{translate('No notification for you')}</Text>
                    </View>
                }

                {!this.state.Empity &&
                    < NotificaitonsListing
                        meals={this.state.list}
                        handleLoadMoreClick={this.handleLoadMoreClick}
                        animatingLoadMore={this.state.animatingLoadMore}
                        noMoreMeals={this.state.noMoreMeals}
                        handleMealClick={(item) => {

                        }}
                    />
                }

                {this.ratingModel()}
            </Block >
        )
    }


    ratingModel() {
        return (
            <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: "center" }}>
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                    }}>
                    <ProductView cart={true} navigation={this.props.navigation} hideModel={this.hideModel} modalVisible={this.state.modalVisible}
                        GuestCheckoutOptions={() => {

                        }}
                    />

                </Modal>
            </View>
        );
    }


}

const mapStateToProps = (state) => ({
    data: {
        userInfo: state.login.userInfo,
        RefrashApp: state.app.RefrashApp,
    },
})
const mapDispatchToProps = (dispatch) => ({
    actions: {
        Products: bindActionCreators(loginActions, dispatch)
    }
})


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        backgroundColor: '#fff',
    },

});
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(notifications))