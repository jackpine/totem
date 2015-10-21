'use strict';

var React = require('react-native');
var DebugLocation = require('./DebugLocation');
var PlaceList = require('./PlaceList');
var NavigationBar = require('./NavigationBar');

var {
    StyleSheet,
    Text,
    TextInput,
    View,
    ListView,
} = React;

var PlaceCreate = React.createClass({
    statics:{
        navBar: function(nav){
            var rightButton = function(){

            };
            return (
                <NavigationBar 
                    navigator={nav}
                    rightButton={rightButton}
                    title={'Create a New Place'}
                />
            );
        },
    },
    getInitialState: function(){
        return {
            filterText: '',
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
            <View syle={{flex: 1}}>
                {locationDebugInfo}
                <Text>Name the Place You're in {this.state.filterText}
                </Text>
                <Text>Name:</Text>
                <TextInput
                    defaultValue={''}
                    keyboardType={'default'}
                    onChangeText={this.processUserInput}
                    style={styles.placeFinderInput}
                    value={this.state.filterText}
                />
                <PlaceList
                    filterText={this.state.filterText}
                    nearbyPlaces={this.props.nearbyPlaces}
                />
            </View>
        );
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
