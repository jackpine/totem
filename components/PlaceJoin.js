'use strict';
import { ActionTypes } from '../constants/TotemConstants';
import bindActions from "../actions";
import { connect } from 'react-redux';

var React = require('react-native');
var DebugLocation = require('./DebugLocation');
var PlaceList = require('./PlaceList');
var NavigationBar = require('./NavigationBar');
var TotemApi = require('../util/TotemApi');
var Icon = require('react-native-vector-icons/FontAwesome');
var GlobalStyles = require('../GlobalStyles');

var _ = require('underscore');

var {
    StyleSheet,
    Text,
    TextInput,
    View,
    ListView,
    TouchableHighlight
} = React;


function mapStateToProps(state) {
    return {
        location: state.location,
        placesNearby: state.placesNearby
    }
}

function mapDispatchToProps(dispatch){
    var actions = bindActions(dispatch);
    return {
        handleSignOut: function(){
            dispatch(actions.userSignOut());
        },
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
                    onPress={()=>self.props.handleSignOut()}
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

        TotemApi.visitCreate(place.id, this.props.location.lon, this.props.location.lat)
        .then(function(visit_json){
                navigator.push({path: 'place', passProps:place});
            });
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

        var locationDebugInfo = <DebugLocation location={this.props.location}/>

        return (
            <View style={styles.listWrapper}>
                {this.renderNavBar()}
                {this.renderTextInput()}
                {locationDebugInfo}
                <PlaceList
                    filterText={this.state.filterText}
                    nearbyPlaces= {this.props.nearbyPlaces}
                    onRowPress={this.handleRowPress}
                />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    searchTextInput: {
        backgroundColor: 'white',
        borderColor: '#cccccc',
        borderRadius: 3,
        borderWidth: 1,
        paddingLeft: 8,
        margin: 8,
        height:40,
    },
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
