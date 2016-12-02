'use strict';

import React from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    View,
    Text,
} from 'react-native';
var Icon = require('react-native-vector-icons/Ionicons');

var NavigationBar = React.createClass({

    propTypes:{
        leftButton: React.PropTypes.func,
        navigator: React.PropTypes.object.isRequired,
        rightButton: React.PropTypes.func,
        title: React.PropTypes.string.isRequired,
    },
    render: function(){
        var leftButton = null;
        var rightButton;
         var nav = this.props.navigator;

        if( typeof this.props.rightButton != 'undefined')
            rightButton = this.props.rightButton()

        if( typeof this.props.leftButton != 'undefined')
            leftButton = this.props.leftButton()
        else{
            leftButton = (
                <TouchableHighlight
                    onPress={this.props.leftButtonHandler || function(){ nav.pop() }}
                    style={styles.defaultBackButton}
                    underlayColor={'white'}
                >
                    <View
                        accessibilityLabel={'Go Back Chevron'}
                        accessible
                        style={styles.defaultBackButton}
                    >
                        <Icon
                            color={'#337ab7'}
                            name={'ios-arrow-back'}
                            size={30}
                            style={styles.backChevron}
                        />
                    </View>
                </TouchableHighlight> 
            )
        }

        return (
            <View>
                <View style={styles.toolbar}>
                    <View style={styles.toolbarButton}>{leftButton}</View>
                    <Text style={styles.toolbarTitle}>{this.props.title}</Text>
                    <View style={styles.toolbarButton}>{rightButton}</View>
                </View>
            </View>)
    }
});

var styles = StyleSheet.create({
    toolbar:{
        paddingTop:30,
        paddingBottom:10,
        flexDirection:'row'
    },
    toolbarButton:{
        width: 50,
    },
    toolbarTitle:{
        color:'black',
        textAlign:'center',
        fontSize: 20,
        flex:1
    },
    backChevron: {
        height:30,
        width: 30,
        paddingLeft: 5,
    },
    defaultBackButton: {
        width: 60,
        flexDirection: 'row',
    },
});

module.exports = NavigationBar;
