'use strict';

import { connect } from 'react-redux';
import React from 'react';
import Button from 'react-native-button';

import DebugLocation from './DebugLocation';
import PlaceList from './PlaceList';
import NavigationBar from './NavigationBar';
import GlobalStyles from '../GlobalStyles';
import TotemApi from '../util/TotemApi';

import {
    StyleSheet,
    Text,
    TextInput,
    PickerIOS,
    View,
    ListView,
    TouchableHighlight,
} from 'react-native';

var PickerItemIOS = PickerIOS.Item

import * as PlaceActionCreators from '../actions/PlaceActionCreators';

var PLACE_CATEGORIES = {
    'continent': 1,
    'country': 2,
    'region': 3,
    'county': 4,
    'locality': 5,
    'neighborhood': 6,
    'user_defined_place': 7,
};

function mapStateToProps(state) {
    return {
        location: state.location,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch){
    return {
        handlePlaceCreate: function(action){
            var action = action
            dispatch(action);
        },
    }
}

var PlaceCreate = React.createClass({
    getInitialState: function() {
        return {
            placeName: '',
            errors: []
        };
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
    handleUserInput: function(newPlaceName){
        this.setState({placeName: newPlaceName});
    },
    validate: function() {
        var errors = [];
        if(this.state.placeName.length < 3) {
            errors.push('Place Name must be at least 3 characters.');
        }
        if(!this.props.location){
            errors.push('Still waiting for a location, just a second.');
        }
        this.setState({errors: errors});
        return errors.length == 0;
    },
    handleSubmitPress: function(){

        if(this.validate()) {
            var action = PlaceActionCreators.placeCreateRequested(this.state.placeName,
                                         PLACE_CATEGORIES['user_defined_place'],
                                         this.props.location,
                                         this.props.user)
            this.props.handlePlaceCreate(action)
        } else {
            console.log('invalid!');
        }
    },
    render: function() {

        var locationDebugInfo = <DebugLocation location={this.props.location}/>

        var errorComponents =this.state.errors.map((error) => (
            <Text style={GlobalStyles.errorText}>{error}</Text>
        ));

        return (
            <View syle={{flex: 1}}>
                {this.renderNavBar()}
                {locationDebugInfo}
                <TextInput
                    accessibilityLabel={'Place Create Input'}
                    accessible
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={this.handleUserInput}
                    placeholder="Place Name"
                    style={GlobalStyles.textInput}
                    testID="place_name"
                    value={this.state.placeName}
                />
                {errorComponents}
                <View
                    accessibilityLabel={'Place Create Submit'}
                    accessible
                >
                    <Button onPress={this.handleSubmitPress}>
                        Establish this Place
                    </Button>
                </View>

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

module.exports = connect(mapStateToProps, mapDispatchToProps)(PlaceCreate);
