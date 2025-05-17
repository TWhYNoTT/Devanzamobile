import React, { Component } from 'react';
import { StyleSheet, StatusBar, View, ScrollView, Dimensions,TouchableOpacity } from 'react-native'
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





class About extends Component {

    state = {
        Wishlist: []
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true, selected: 1, type: 1, data: [{}, {}, {}]
        }

    }




    render() {
        return (
            <Block>
                <StatusBar backgroundColor="transparent" barStyle="light-content" />

                <Header backPress={() => { this.props.navigation.pop() }} r search={false} backPrimary={false} back={true} navigation={this.props.navigation} Text={translate('Terms and conditions')} />


                {/* <Button mode="contained"
                    disabledStyle={{ backgroundColor: theme.colors.disabled }}
                    activityIndicatorColor={theme.colors.white}
                    isLoading={!this.state.isLoading} style={{
                        borderColor: 'transparent', color: theme.colors.white, borderRadius: moderateScale(10),
                        backgroundColor: theme.colors.primary, marginTop: moderateScale(20), width: '80%', alignSelf: 'center', position: 'absolute', bottom: moderateScale(20)
                    }} textStyle={{
                        fontSize: moderateScale(15),
                        color: theme.colors.white,
                        fontFamily: FONT_FAMILY
                    }}
                    onPress={() => this.onPress()}>
                    {translate('Done')}</Button> */}

                <View style={{ width: '100%', height: '90%', flexDirection: 'row', justifyContent: 'center', marginTop: moderateScale(20) }}>
                    <View style={{ width: '95%', height: '100%', flexDirection: 'row', justifyContent: 'center' }}>

                        <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: moderateScale(120) }}>

                            <View style={{ padding: 10, paddingStart: -10 }} >
                                <Text style={{ fontSize: moderateScale(18) }}>
                                    Amet ullamco ullamco fugiat ipsum. Proident irure fugiat eu sunt dolore aute elit eu Lorem excepteur nulla pariatur consequat nisi. Sint ex tempor est non quis dolor Lorem voluptate in aliqua dolore. Anim adipisicing dolore duis mollit.
                                    Amet ullamco ullamco fugiat ipsum. Proident irure fugiat eu sunt dolore aute elit eu Lorem excepteur nulla pariatur consequat nisi. Sint ex tempor est non quis dolor Lorem voluptate in aliqua dolore. Anim adipisicing dolore duis mollit.{'\n'}
                                    {'\n'}
                                    Amet ullamco ullamco fugiat ipsum. Proident irure fugiat eu sunt dolore aute elit eu Lorem excepteur nulla pariatur consequat nisi. Sint ex tempor est non quis dolor Lorem voluptate in aliqua dolore. Anim adipisicing dolore duis mollit.


                                    {'\n'}
                                    {'\n'}
                                    Amet ullamco ullamco fugiat ipsum. Proident irure fugiat eu sunt dolore aute elit eu Lorem excepteur nulla pariatur consequat nisi. Sint ex tempor est non quis dolor Lorem voluptate in aliqua dolore. Anim adipisicing dolore duis mollit.

                                    Amet ullamco ullamco fugiat ipsum. Proident irure fugiat eu sunt dolore aute elit eu Lorem excepteur nulla pariatur consequat nisi. Sint ex tempor est non quis dolor Lorem voluptate in aliqua dolore. Anim adipisicing dolore duis mollit.
                                    Amet ullamco ullamco fugiat ipsum. Proident irure fugiat eu sunt dolore aute elit eu Lorem excepteur nulla pariatur consequat nisi. Sint ex tempor est non quis dolor Lorem voluptate in aliqua dolore. Anim adipisicing dolore duis mollit.{'\n'}
                                    {'\n'}
                                    Amet ullamco ullamco fugiat ipsum. Proident irure fugiat eu sunt dolore aute elit eu Lorem excepteur nulla pariatur consequat nisi. Sint ex tempor est non quis dolor Lorem voluptate in aliqua dolore. Anim adipisicing dolore duis mollit.

                                    {'\n'}
                                    {'\n'}
                                    Amet ullamco ullamco fugiat ipsum. Proident irure fugiat eu sunt dolore aute elit eu Lorem excepteur nulla pariatur consequat nisi. Sint ex tempor est non quis dolor Lorem voluptate in aliqua dolore. Anim adipisicing dolore duis mollit.

                                </Text>
                                {/* <HTML html={this.state.selected === 1 ? this.state.data[0]?.description : this.state.selected === 2 ? this.state.data[1]?.description : this.state.data[2]?.description} style={{ direction: 'rtl', textAlign: 'left' }} imagesMaxWidth={Dimensions.get('window').width} /> */}
                            </View>
                        </ScrollView>
                    </View>
                </View>

            </Block >
        )
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
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(About))