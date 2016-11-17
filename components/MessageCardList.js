'use strict';

import React from 'react';
import { connect } from 'react-redux';

import { ActionTypes } from '../constants/TotemConstants';

import {
    StyleSheet,
    Text,
    View,
    ListView,
    PixelRatio,
    TouchableHighlight
} from 'react-native';

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch){
    return {
    }
}

var MessageCardList = React.createClass({
    propTypes: {
        messages: React.PropTypes.array.isRequired,
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
    getDefaultProps: function(){
       return { messages: [] };
    },
    componentWillMount: function(){

    },
    renderRow: function(message: any, i: number){
        return (
            <View key={i}>
                <TouchableHighlight onPress={() => this.onRowPress(message)}>
                    <View style={styles.row}>
                        <Text style={styles.rowTitleText}>
                            {message.subject}
                        </Text>
                        <Text style={styles.rowDetailText}>
                            {message.body}
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>)
    },
    setupDataSource: function(){

        if(this.dataSource){
            return;
        }

        this.dataSource = new ListView.DataSource({
            rowHasChanged: function(message1, message2){
                return (message1['id'] !== message2['id']) ;
            },
            sectionHeaderHasChanged: function(s1, s2){
                return s1 !== s2;
            }
        });
    },
    updateDataSource: function(){
        var messages = this.props.messages || [];
        this.dataSource = this.dataSource.cloneWithRowsAndSections({'messages': messages});
    },
    render: function(){

        this.setupDataSource();
        this.updateDataSource();

        var listView =  (<Text>Nothing</Text>);
        console.log(this.dataSource.getRowCount())
        if(this.dataSource.getRowCount() > 0){
            listView =  (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.dataSource}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps={true}
                    renderRow={this.renderRow}
                    style={styles.seperator}
                />);
        }

        return (<View>{listView}</View>)
    },
    onRowPress: function(message){
    }

});

var styles = StyleSheet.create({
    listContainer: {
        flex: 1,
    },
    list: {
        backgroundColor: '#eeeeee',
    },
    sectionHeader: {
    },
    sectionHeaderTitle: {
        fontWeight: '500',
        fontSize: 11,
        padding: 5,
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
    noResults: {
        padding: 20,
    },
});


module.exports = connect(mapStateToProps, mapDispatchToProps)(MessageCardList);
