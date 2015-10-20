'use strict';

var React = require('react-native');
var DebugLocation = require('./DebugLocation');
var PlaceList = require('./PlaceList');

var {
    StyleSheet,
    Text,
    TextInput,
    View,
    ListView,
} = React;

var PlaceCreate = React.createClass({
    getInitialState: function(){
        return {
            filterText: "",
        }
    },
    processUserInput: function(filterText: string) {
        this.setState({
            filterText: filterText
        });
    },
    render: function() {

        var locationDebugInfo = <DebugLocation location={this.props.location}/>

        return (
            <View>
            {locationDebugInfo}
            <Text>
            Name the Place You're in {this.state.filterText}
            </Text>
            <Text>Name:</Text>
            <TextInput
            style={styles.placeFinderInput}
            onChangeText={ this.processUserInput }
            value={this.state.filterText}
            defaultValue={""}
            keyboardType={'default'}
            />
            <PlaceList
            filterText={ this.state.filterText }
            nearbyPlaces={ this.props.nearbyPlaces }
            />
            </View>
        );
    },

    keyboardDidEnterText: function(text: string) {
        console.log("Keyboard:"+text);
    },

});

var styles = StyleSheet.create({
    placeFinderInput: {
        height:40,
        borderColor: 'gray',
        borderWidth: 1,
    },
});

module.exports = PlaceCreate;
