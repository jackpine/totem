'use strict';

var React = require('react-native');
var globalStyles = require('../globalStyles');

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

    _filterPlaceRows: function(filterText: string, placeList: Array<object>): Array<string> {

        if(!this.dataSource)
          this.dataSource = new ListView.DataSource({
            rowHasChanged: function(r1, r2){
              return r1 !== r2;
            }
          });

        var placesBlob = [];
        placeList.forEach(function(city){
            if(city["name"].toLowerCase().startsWith(filterText.toLowerCase())){
                placesBlob.push(city["name"]);
            }
        });

        this.dataSource = this.dataSource.cloneWithRows(placesBlob);

    },
    render: function() {

        this._filterPlaceRows(this.props.filterText, this.props.nearbyPlaces);

        return (
            <ListView
            style={styles.listView}
            dataSource={this.dataSource}
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
            filterText={ this.state.filterText }
            nearbyPlaces= { this.props.nearbyPlaces }
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
