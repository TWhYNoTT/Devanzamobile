import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    Image,
    StyleSheet,
} from 'react-native';

export default class Button extends Component {
    render() {

        var icon = (typeof this.props.icon === "undefined" ? (<View style={{ marginLeft: -10 }}></View>) : (<Image style={[styles.icon, { height: this.props.iconSize, width: this.props.iconSize }]} source={this.props.icon} />));
        var text = (typeof this.props.text === "undefined" ? (<View></View>) : (<Text style={[styles.text, { color: this.props.color }]}>{this.props.text}</Text>));
        var underlay = (typeof this.props.underlayColor === "undefined" ? 'transparent' : this.props.underlayColor);
        var style = (typeof this.props.style === "undefined" ? styles.default : this.props.style);
        // console.log("underlay props");
        // console.log(this.props.icon);
        // console.log(this.props.text);
        // console.log(this.props.style);
        // console.log(this.props.underlay);

        return (
            <TouchableHighlight underlayColor={underlay} onPress={this.props.onPress}>
                <View style={[styles.button, style]}>
                    <Image style={[styles.icon, { height: this.props.iconSize, width: this.props.iconSize }]} source={this.props.icon} />
                    <Text style={[styles.text, { color: this.props.color }]}>{this.props.text}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

export const styles = StyleSheet.create({
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    default: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#272822',
        color: 'white'
    },

    icon: {
        flex: 0.5,
    },

    text: {
        marginLeft: 10,
        flex: 0.5,
    }

})
