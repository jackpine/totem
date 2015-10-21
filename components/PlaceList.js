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

        if(!this.dataSource)
            this.dataSource = new ListView.DataSource({
                rowHasChanged: function(r1, r2){
                    return r1 !== r2;
                },
                sectionHeaderHasChanged: function(s1, s2){
                    return s1 !== s2;
                }

            });

            var placesBlob = [];
            placeList.forEach(function(city){
                if(city['name'].toLowerCase().startsWith(filterText.toLowerCase())){
                    placesBlob.push(city['name']);
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
    renderRow: function(example: any, i: number){
        return (
            <View key={i}>
                <TouchableHighlight onPress={() => this.onPressRow(example)}>
                    <View style={styles.row}>
                        <Text style={styles.rowTitleText}>
                            {example}
                        </Text>
                        <Text style={styles.rowDetailText}>
                            {example}
                        </Text>
                    </View>
                </TouchableHighlight>
                <View style={styles.separator} />
            </View>)
    },
    onPressRow: function(row){
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
        fontSize: 15,
        color: '#888888',
        lineHeight: 20,
    },
});

module.exports = PlaceList;
