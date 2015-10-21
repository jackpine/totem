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
    handleRowPress: function(place){
        this.props.navigator.push({path: 'place', passProps:{name: place}});
    },
    renderNavBar: function(){
        var rightButton = function(){

        };
        return (
            <NavigationBar 
                navigator={this.props.navigator}
                rightButton={rightButton}
                title={'Create a New Place'}
            />
        );
    },
    render: function() {

        var locationDebugInfo = <DebugLocation location={this.props.location}/>

        return (
            <View syle={{flex: 1}}>
                {this.renderNavBar()}
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
                    onRowPress={this.handleRowPress}
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
