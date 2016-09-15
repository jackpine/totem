'use strict';
import { ActionTypes } from '../constants/TotemConstants';
import { connect } from 'react-redux';

import React from 'react';
import DebugLocation from './DebugLocation';
import PlaceList from './PlaceList';
import NavigationBar from './NavigationBar';
import TotemApi from '../util/TotemApi';
import Icon from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from '../GlobalStyles';

import { userSignOut } from '../actions/UserActionCreators';
import { placeVisitRequested } from '../actions/PlaceActionCreators';

import _ from 'underscore';

import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ListView,
    TouchableHighlight
} from 'react-native';


function mapStateToProps(state) {
    return {
        location: state.location,
        placesNearby: state.placesNearby,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch){
    return {
        handleUserSignOut: (action)=>{ dispatch(action) },
        handlePlaceVisit: (action)=>{ dispatch(action) },
    }
}

var PlaceJoin = React.createClass({
    contextTypes:  {
        store: React.PropTypes.object.isRequired
    },
    getInitialState: function(){
        return {
            filterText: '',
        }
    },
    renderNavBar: function(){
        var self = this;
        var leftButton = function(){
            return (
                <TouchableHighlight 
                    onPress={()=>self.props.handleUserSignOut(userSignOut())}
                >
                    <View>
                        <Text>logout</Text>
                    </View>
                </TouchableHighlight>)
        };
        var rightButton = function(){
            return (
                <TouchableHighlight 
                    onPress={(place)=>self.props.navigator.push({path: 'place_create'})}
                    style={styles.placeCreateButton}
                >
                    <View
                        accessibilityLabel={"Place Create Icon"}
                        accessible
                        style={styles.placeCreateButton}
                    >
                        <Icon
                            color={'#337ab7'}
                            name={'plus-circle'}
                            size={30}
                            style={styles.placeCreateIcon}
                        />
                    </View>
                </TouchableHighlight>)
        };
        return (
            <NavigationBar
                leftButton={leftButton}
                rightButton={rightButton}
                navigator={this.props.navigator}
                title={'Where are you?'}
            />
        );
    },
    handleUserInput: function(filterText: string) {
        this.setState({
            filterText: filterText
        });
    },
    handleRowPress: function(place){
        var navigator = this.props.navigator;
        var action = placeVisitRequested(place.id, this.props.location, this.props.user);
        this.props.handlePlaceVisit(action);
    },
    renderTextInput(searchTextInputStyle: any) {
        return (
            <View style={styles.searchRow}>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="always"
                    onChangeText={this.handleUserInput}
                    placeholder="Search..."
                    style={GlobalStyles.textInput}
                    testID="place_search"
                    value={this.state.searchText}
                />
            </View>
        );
    },
    render: function() {

        var self = this;
        var locationDebugInfo = <DebugLocation location={this.props.location}/>

        return (
            <View style={styles.listWrapper}>
                {this.renderNavBar()}
                {this.renderTextInput()}
                {locationDebugInfo}
                <PlaceList
                    filterText={this.state.filterText}
                    nearbyPlaces= {this.props.nearbyPlaces}
                    onRowPress={(place)=>{ self.handleRowPress(place) }}
                />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
    },
    placeCreateButton: {
      width: 60,
      flexDirection: 'row',
      paddingLeft: 5,
    },
    placeCreateIcon: {
      height: 30,
      width: 30,
    },
    listWrapper: {
      flex: 1
    }
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(PlaceJoin);
