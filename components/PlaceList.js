'use strict';

var React = require('react-native');

var {
    StyleSheet,
    Text,
    TextInput,
    View,
    ListView,
} = React;



var PlaceList = React.createClass({

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

        this._filterPlaceRows(this.props.filterText || "", this.props.nearbyPlaces);

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
var styles = StyleSheet.create({
    listView: {
        paddingTop: 0,
        backgroundColor: '#F5FCFF',
        height: 400,
    },
})

module.exports = PlaceList;
