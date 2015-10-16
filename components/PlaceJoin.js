'use strict';

var React = require('react-native');
var DebugLocation = require('./DebugLocation');
var PlaceTable = require('./PlaceTable');

var {
    StyleSheet,
    Text,
    TextInput,
    View,
    ListView,
} = React;


var PlaceCreate = React.createClass({
    render: function() {

        var locationDebugInfo = <DebugLocation location={this.props.location}/>

        return (
          <View>
            <Text>Join one of the following places</Text>
            <PlaceTable
            nearbyPlaces= { this.props.nearbyPlaces }
            />
            </View>
        );
    },
});

module.exports = PlaceCreate;

