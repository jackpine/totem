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
                rightButton={function(){}}
                leftButton={function(){}}
                title={'Totem'}
                navigator={this.props.navigator}
            />
        );
    },
    render: function(){
        return (
            <View>
                {this.renderNavBar()}
                <Text>Loading..</Text>
            </View>
        )

    }
});

var styles = StyleSheet.create({
});

module.exports = Place;
