'use strict';

var React = require('react-native');
var globalStyles = require('../globalStyles');
var LocationStore = require('../stores/LocationStore');
var TotemApi = require("../util/TotemApi")

var {
    StyleSheet,
    Text,
    TextInput,
    View,
    ListView,
    Component,
    TouchableHighlight,
    Image
} = React;


var PlaceTable = React.createClass({

    render: function() {
        return (
            <ListView
            style={styles.listView}
            dataSource={this.props.dataSource}
            renderRow={this.renderPlace}
            automaticallyAdjustContentInsets={false}
            />
        )
    },
    renderPlace(row) {
        return (
            <Text>{row}</Text>
        )
    }

});

var PlaceCreate = React.createClass({
    getInitialState: function(){
        var ds = new ListView.DataSource({
            rowHasChanged: function(r1, r2){
                return r1 !== r2;
            }
        });
        return {
            filterText: "",
            location: LocationStore.getLatest(),
            dataSource: ds.cloneWithRows(this._filterPlaceRows("", [])),
        }
    },
    componentDidMount: function() {
        this.processUserInput('');
        LocationStore.on('change:currentLocation', this._onLocationChange);
    },
    _filterPlaceRows: function(filterText: string, responseData: Array<object>): Array<string> {

        var placesBlob = [];
        responseData.forEach(function(city){
            if(city["name"].toLowerCase().startsWith(filterText.toLowerCase())){
                placesBlob.push(city["name"]);
            }
        });
        return placesBlob;

    },
    processUserInput: function(filterText: string) {

        this.setState({
            filterText: filterText
        });
    },
    render: function() {
        var locationDebugInfo;
        if(this.state.location){
            var loc = this.state.location[0];
            locationDebugInfo = <Text>{`Lat: ${loc.lat.toPrecision(9)} Lng: ${loc.lon.toPrecision(10)} HrzAccurc: ${loc.horizontalAccuracy}`}</Text>
        }
        return (
            <View>
            <Text style={styles.debugInfo}>
            {locationDebugInfo}
            </Text>
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
            dataSource={this.state.dataSource}
            />
            </View>
        );
    },

    keyboardDidEnterText: function(text: string) {
        console.log("Keyboard:"+text);
    },

    _onLocationChange: function(){
        this.setState({location: LocationStore.getLatest()});
        if(this.state.location){
            console.log(this.state.location[0].lat, this.state.location[0].lon)
            TotemApi.placesNearby(this.state.location[0].lon, this.state.location[0].lat)
            .then((responseData) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this._filterPlaceRows(this.state.filterText, responseData["places"])),
                });
            })
            .done();
        }

    }

});

var styles = StyleSheet.create({
    placeFinderInput: {
        height:40,
        borderColor: 'gray',
        borderWidth: 1,
    },
    listView: {
        paddingTop: 0,
        backgroundColor: '#F5FCFF',
        height: 400,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    debugInfo: {
        fontSize: 8,
        paddingBottom: 4,
        fontFamily: "Courier"
    }
});

module.exports = PlaceCreate;
