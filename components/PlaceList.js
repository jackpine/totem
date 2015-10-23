'use strict';

var React = require('react-native');

var {
    StyleSheet,
    Text,
    TextInput,
    View,
    ListView,
    PixelRatio,
    TouchableHighlight,
} = React;

var PlaceList = React.createClass({

    propTypes: {
        onRowPress: React.PropTypes.func.isRequired,
    },
    _filterPlaceRows: function(filterText: string, placeList: Array<object>): Array<string> {

        if(!this.dataSource){
            this.dataSource = new ListView.DataSource({
                rowHasChanged: function(place1, place2){
                    return (place1['id'] !== place2['id'] ||
                            place1['distance'] !== place2['distance'] ||
                           place1['relevance'] !== place2['relevance']) ;
                },
                sectionHeaderHasChanged: function(s1, s2){
                    return s1 !== s2;
                }

            });
        }

        var placesBlob = [];
        placeList.forEach(function(place){
            if(place['name'].toLowerCase().startsWith(filterText.toLowerCase())){
                placesBlob.push(place);
            }
        });

        this.dataSource = this.dataSource.cloneWithRowsAndSections({'places':placesBlob});

    },
    _renderSectionHeader(data: any, section: string) {
        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderTitle}>
                    {section.toUpperCase()}
                </Text>
            </View>
            );
    },
    renderRow: function(place: any, i: number){
        return (
            <View key={i}>
                <TouchableHighlight onPress={() => this.onRowPress(place)}>
                    <View style={styles.row}>
                        <Text style={styles.rowTitleText}>
                            {place.name}
                        </Text>
                        <Text style={styles.rowDetailText}>
                            {
                            `dist: ${place.distance.toFixed(2)} rel: ${place.relevance.toFixed(4)}\ncategory: ${place.category}`
                            }
                        </Text>
                    </View>
                </TouchableHighlight>
                <View style={styles.separator} />
            </View>)
    },
    onRowPress: function(row){
        this.props.onRowPress(row);
    },
    render: function() {

        this._filterPlaceRows(this.props.filterText || '', this.props.nearbyPlaces);

        var topView = this.props.renderAdditionalView &&
            this.props.renderAdditionalView(this.renderRow, this.renderTextInput);


        return (
            <View style={styles.listContainer}>
                {topView}
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.dataSource}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps={true}
                    renderRow={this.renderRow}
                    renderSectionHeader={this._renderSectionHeader}
                    style={styles.list}
                />
            </View>)
    },


});

var styles = StyleSheet.create({
    listContainer: {
        flex: 1,
    },
    list: {
        backgroundColor: '#eeeeee',
    },
    sectionHeader: {
        padding: 5,
    },
    sectionHeaderTitle: {
        fontWeight: '500',
        fontSize: 11,
    },
    row: {
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    separator: {
        height: 1 / PixelRatio.get(),
        backgroundColor: '#bbbbbb',
        marginLeft: 15,
    },
    rowTitleText: {
        fontSize: 17,
        fontWeight: '500',
    },
    rowDetailText: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Courier',
        color: '#888888',
        lineHeight: 20,
    },
});

module.exports = PlaceList;
