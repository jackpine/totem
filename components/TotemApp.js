'use strict'

import React from 'react-native';
var LocationManager = React.NativeModules.TMLocationManager;

var {
    StyleSheet,
    NativeAppEventEmitter,
    PixelRatio,
    TouchableOpacity,
    View,
    Text,
    Navigator,
} = React;

import _ from 'underscore';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import TotemConstants, { ActionTypes } from '../constants/TotemConstants';
import TotemApi from '../util/TotemApi';

import PlaceCreate from './PlaceCreate';
import PlaceJoin from './PlaceJoin';
import Place from './Place';
import AppLoading from './AppLoading';
import UserSignInCreate from './UserSignInCreate';

import { locationUpdate } from '../actions/LocationActionCreators';
import { placesNearbyRequested } from '../actions/PlaceActionCreators';

function mapStateToProps(state) {
    // special case for our Totem container
    // map all the state to this component
    return state
}

function mapDispatchToProps(dispatch){
    return {
        handleLocationUpdate: (action)=>{ dispatch(action) },
        handlePlacesNearbyRequested: (action) => { dispatch(action) }
    }
}

var Totem = React.createClass({
    contextTypes:  {
        store: React.PropTypes.object.isRequired
    },
    getInitialState: function(){
        return {
            userFetched: false,
            user: null,
            location: null,
            nearbyPlaces: []
        }
    },
    componentDidMount: function(){
        this.listenForLocationUpdates();

    },
    componentWillUnmount: function() {
        this._listeners && this._listeners.forEach(listener => listener.remove());
    },
    assignDefaultSceneProps: function(){

    },
    renderScene: function(route, nav){

        var Component;
        var routePassedProps;

        if(!this.props.reduxStoreLoaded || (!this.props.location && this.props.user)){
            Component = AppLoading;
        }
        else if(!this.props.user){
            Component = UserSignInCreate
            // TODO unregister location updates
        }
        else if(this.props.currentVisit){
            Component = Place
        }
        else{
        // when new scenes are pushed on, they can pass props to the next scene
            routePassedProps = route.passProps || {};
            Component = this.lookupSceneByPath(route.path);
        }

        var componentProps = Object.assign({}, routePassedProps, {
            navigator: nav,
        });

        return (
            <View style={styles.navigator}>
                <Component {...componentProps} />
            </View>
        );
    },
    lookupSceneByPath(path){
        var Component;
        switch(path){
            case 'place_create':
                Component = PlaceCreate;
            break;
            case 'place_join':
                Component = PlaceJoin;
            break;
            case 'place':
                Component = Place;
            break;
            default:
                Component = React.createClass({
                render: function(){
                    return <Text>Sorry, there was a routing error with: {route.path}</Text>
                }
            });
        }
        return Component;
    },
    _setNavigatorRef: function(navigator) {

        if (navigator !== this._navigator) {
            this._navigator = navigator;

            if (navigator) {
                var callback = (event) => {
                    console.log(
                        `TabBar: event ${event.type}`,
                        {
                            route: JSON.stringify(event.data.route),
                            target: event.target,
                            type: event.type,
                        }
                    );
                };
                // Observe focus change events from the owner.
                this._listeners = [
                    navigator.navigationContext.addListener('willfocus', callback),
                    navigator.navigationContext.addListener('didfocus', callback),
                ];
            }
        }
    },
    listenForLocationUpdates: function(){
        var self = this;
        LocationManager.startLocationUpdates({}, function(err, response){
            console.log(`${response}`)
        });
        NativeAppEventEmitter.addListener(LocationManager.locationUpdatesEventChannel,
                                          (location)=>{
                                              if(self.props.user){
                                                  self.props.handleLocationUpdate(locationUpdate(location));
                                                  self.props.handlePlacesNearbyRequested(placesNearbyRequested(self.props.location, self.props.user));
                                              }
                                          });

    },
    render: function() {
        return (
            <Navigator
                initialRoute={{
                    path: 'place_join',
                }}
                ref={this._setNavigatorRef}
                renderScene={this.renderScene}
                style={styles.container}
            />
        );
    },

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navigator: {
        flex: 1,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 80,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    messageText: {
        fontSize: 17,
        fontWeight: '500',
        padding: 15,
        marginTop: 50,
        marginLeft: 15,
    },
    button: {
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#CDCDCD',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '500',
    },
    navBar: {
        backgroundColor: 'white',
    },
    navBarText: {
        fontSize: 16,
        marginVertical: 10,
    },
    navBarTitleText: {
        color: 'blue',
        fontWeight: '500',
        marginVertical: 9,
    },
    navBarLeftButton: {
        paddingLeft: 10,
    },
    navBarRightButton: {
        paddingRight: 10,
    },
    navBarButtonText: {
        color: 'blue',
    },
    scene: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#EAEAEA',
    },
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Totem);
