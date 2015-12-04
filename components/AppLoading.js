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
    },
    renderNavBar: function(){
        return (
            <NavigationBar
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
