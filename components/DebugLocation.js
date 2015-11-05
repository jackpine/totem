'use strict';

var React = require('react-native');

var {
    StyleSheet,
    Text,
} = React;

module.exports = React.createClass({

    render: function() {
        var loc;
        if(this.props.location)
            loc = this.props.location[0];
        else{
            loc = {lat: 0, lon: 0};
        }

        return (<Text style={styles.debugInfo}>{`Lat: ${loc.lat.toPrecision(9)} Lng: ${loc.lon.toPrecision(10)} HrzAccurc: ${loc.horizontalAccuracy}`}</Text>)
    }

})

var styles = StyleSheet.create({

    debugInfo: {
        fontSize: 8,
        paddingBottom: 4,
        fontFamily: 'Courier'
    }

})
