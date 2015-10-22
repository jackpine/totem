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
    renderNavBar: function(){
        var leftButton = function(){};
        var rightButton = function(){};
        return (
            <NavigationBar
                rightButton={rightButton}
                title={'Congrats, You are in ' + this.props.name}
                navigator={this.props.navigator}
            />
        );
    },
    render: function(){
        return (
            <View>
                {this.renderNavBar()}
                <Text>Hi welcome to {this.props.name}, there's a lot you can do in this place.</Text>
            </View>
        )

    }
});

var styles = StyleSheet.create({


});

module.exports = Place;
