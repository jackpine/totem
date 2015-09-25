'use strict';

var React = require('react-native');
var globalStyles = require('./globalStyles');
var citiesList = require('./citiesList');

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


// SearchBar
var PlacesTable = React.createClass({

    render: function() {
        console.log(this.props.dataSource)
        return (
            <ListView
            style={styles.listView}
            dataSource={this.props.dataSource}
            renderRow={this.renderPlace}
            />
        )
    },
    renderPlace(row) {
        return (
            <Text>{row}</Text>
        )
    }

});

var PlaceFinder = React.createClass({
    getInitialState: function(){
        var ds = new ListView.DataSource({
            rowHasChanged: function(r1, r2){
                console.log(`comparing ${r1} and ${r2}`);
                return r1 !== r2;
            }
        });
        return {
            filterText: "",
            dataSource: ds.cloneWithRows(this._filterPlaceRows("")),
        }
    },
    _filterPlaceRows: function(filterText: string): Array<string> {

        // TODO remove stubbed places
        var placesBlob = [];
        citiesList.forEach(function(city){
            if(city.toLowerCase().startsWith(filterText.toLowerCase())){
                placesBlob.push(city);
            }
        });
        return placesBlob;

    },
    processUserInput: function(filterText: string) {
        console.log(`received new filterText ${filterText}`, this._filterPlaceRows(filterText))
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this._filterPlaceRows(filterText)),
            filterText: filterText
        });
    },
    render: function() {
        console.log(this.state)
        return (
            <View>
            <Text style={globalStyles.navView}>
            Name the Place You're in {this.state.filterText}
            </Text>
            <Text>Name:</Text>
            <TextInput
            style={styles.placeFinderInput}
            onChangeText={ this.processUserInput.bind(this) }
            value={this.state.filterText}
            defaultValue={""}
            keyboardType={'default'}
            />
            <PlacesTable
            dataSource={this.state.dataSource}
            renderRow={this.renderPlace}
            />
            </View>
        );
    },

    keyboardDidEnterText: function(text: string) {
        console.log("Keyboard:"+text);
    }

});

var styles = StyleSheet.create({
    placeFinderInput: {
        height:40,
        borderColor: 'gray',
        borderWidth: 1,
    },
    listView: {
        height: 400,
        backgroundColor: '#F5FCFF',
    },
});

module.exports = PlaceFinder;
