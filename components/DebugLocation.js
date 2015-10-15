var React = require('react-native');

var {
    StyleSheet,
    Text,
} = React;

module.exports = React.createClass({

    render: function() {
      var loc = this.props.location[0];
      return (<Text style={styles.debugInfo}>{`Lat: ${loc.lat.toPrecision(9)} Lng: ${loc.lon.toPrecision(10)} HrzAccurc: ${loc.horizontalAccuracy}`}</Text>)
    }

})

styles = StyleSheet.create({

    debugInfo: {
        fontSize: 8,
        paddingBottom: 4,
        fontFamily: "Courier"
    }

})
