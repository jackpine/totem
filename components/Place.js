'use strict';

var React = require('react-native');
var NavigationBar = require('./NavigationBar');

var {
    StyleSheet,
    Text,
    View,
} = React;


var Place = React.createClass({

    propTypes: {
        name: React.PropTypes.string.isRequired,
    },
    statics: {
        navBar: function(nav){
            var leftButton = function(){};
            var rightButton = function(){};
            return (
                <NavigationBar
                    rightButton={rightButton}
                    title={'Congrats, You are in a Place!'}
                    navigator={nav}
                />
            );
        }
    },
    render: function(){

        return (
            <Text>Hi welcome to {this.props.name}</Text>
        )

    }
});

var styles = StyleSheet.create({


});

module.exports = Place;
