'use strict';

var React = require('react-native');

var {
    StyleSheet,
    Text,
} = React;

module.exports = React.createClass({

    render: function() {
        var loc;
        if(this.props.location){
            loc = Object.assign({}, this.props.location[0])
            loc.lat = this.props.location[0].lat.toPrecision(9);
            loc.lon = this.props.location[0].lon.toPrecision(9);
        }
        else
            loc = {lat: 'missing', lon: 'missing'}

        return (<Text style={styles.debugInfo}>{`Lat: ${loc.lat} Lng: ${loc.lon} HrzAccurc: ${loc.horizontalAccuracy}`}</Text>)
    }

})

var styles = StyleSheet.create({

    debugInfo: {
        fontSize: 8,
        paddingBottom: 4,
        fontFamily: 'Courier'
    }

})
