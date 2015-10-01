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


// SearchBar
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
            dataSource: ds.cloneWithRows(this._filterPlaceRows("", [])),
        }
    },
    componentDidMount: function() {
        this.processUserInput('');
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
        fetch("http://localhost:3000/api/v1/places/nearby")
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this._filterPlaceRows(filterText, responseData["places"])),
            });
        })
        .done();
    },
    render: function() {
        return (
            <View style={globalStyles.navView}>
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
});

module.exports = PlaceCreate;
