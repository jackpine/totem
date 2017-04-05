'use strict'

import React from 'react';
import ReactNative from 'react-native'
var LocationManager = ReactNative.NativeModules.TMLocationManager;

var {
    StyleSheet,
    NativeAppEventEmitter,
    PixelRatio,
    TouchableOpacity,
    View,
    Text,
    Navigator,
} = ReactNative;

import _ from 'underscore';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import TotemConstants, { ActionTypes, Paths } from '../constants/TotemConstants';
import TotemApi from '../util/TotemApi';

import PlaceCreate from './PlaceCreate';
import PlaceJoin from './PlaceJoin';
import Place from './Place';
import AppLoading from './AppLoading';
import UserSignInCreate from './UserSignInCreate';
import MessageCompose from './MessageCompose';

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

export var Totem = React.createClass({
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
            var currRoutes = nav.getCurrentRoutes();
            if(currRoutes.length > 0 && currRoutes[currRoutes.length - 1].path == 'place_create'){
                // There is a mix of state based routing and path based routing here.
                // `place visit` routing is under the auspices of state-based routing
                // but if we are coming from `place_create`, we don't want to go
                // back to creating a place
                nav.immediatelyResetRouteStack([
                    {path: Paths.PLACE_JOIN},
                    {path: Paths.PLACE_VISIT}
                ])
            }
            Component = this.lookupCurrentVisitPath(route.path)
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

    lookupCurrentVisitPath(path){
        var Component;
        switch(path){
            case Paths.MESSAGE_COMPOSE:
                Component = MessageCompose;
                break;
            default:
                Component = Place
        }
        return Component;
    },

    lookupSceneByPath(path){
        var Component;
        switch(path){
            case Paths.PLACE_CREATE:
                Component = PlaceCreate;
                break;
            case Paths.PLACE_JOIN:
                Component = PlaceJoin;
                break;
            case Paths.PLACE:
                Component = Place;
                break;
            default:
                debugger
                Component = React.createClass({
                render: function(){
                    return <Text>Sorry, there was a routing error with: {path}</Text>
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
                    path: Paths.PLACE_JOIN,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Totem);
