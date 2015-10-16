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
        var locationDebugInfo;
        if(this.props.location){
            var loc = this.props.location[0];
            locationDebugInfo = <DebugLocation location={this.props.location}/>
        }

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
            <PlaceTable
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
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});

module.exports = PlaceCreate;
