'use strict'

var React = require('react-native');
var LocationManager = React.NativeModules.TMLocationManager;
var _ = require('underscore');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TotemConstants = require('../constants/TotemConstants');
var TotemApi = require('../util/TotemApi');

// Stores
var LocationStore = require('../stores/LocationStore');
var UserStore = require('../stores/UserStore');

// Actions
var LocationUpdateAction = require('../actions/LocationUpdateAction');

// Components
var PlaceCreate = require('./PlaceCreate');
var PlaceJoin = require('./PlaceJoin');
var Place = require('./Place');
var AppLoading = require('./AppLoading');
var UserSignInCreate = require('./UserSignInCreate');

var ActionTypes = TotemConstants.ActionTypes;

var {
    StyleSheet,
    NativeAppEventEmitter,
    PixelRatio,
    TouchableOpacity,
    View,
    Text,
    Navigator,
} = React;

var Totem = React.createClass({
    getInitialState: function(){
        return {
            userLoaded: false,
            user: null,
            location: null,
            nearbyPlaces: []
        }
    },
    componentDidMount: function(){
        LocationStore.addListener('change', this.onLocationChange);
        LocationManager.startLocationUpdates({}, function(err, response){
            console.log(`${response}`)
        });

        UserStore.addListener('change', this.onUserChange);
        this.loadUser();

    },
    componentWillUnmount: function() {
        this._listeners && this._listeners.forEach(listener => listener.remove());
    },
    assignDefaultSceneProps: function(){

    },
    appIsLoading: function(){
        return !(this.state.userLoaded && this.state.location)
    },
    renderScene: function(route, nav){

        var Component;
        var routeProps;

        if(this.appIsLoading()){
            Component = AppLoading;
        }
        else if(!this.state.user){
            Component = UserSignInCreate
        }
        else{
        // when new scenes are pushed on, they can pass props to the next scene
            routeProps = route.passProps || {};
            Component = this.lookupSceneByPath(route.path);
        }

        var componentProps = Object.assign({}, routeProps, {
            location: this.state.location,
            navigator: nav,
            nearbyPlaces: this.state.nearbyPlaces
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
    loadUser: function(){
        var self = this;
        UserStore.getAsync().then(function(user){
            self.setState({userLoaded: true, user: user})
        }).catch(function(){
            debugger
        })
    },
    fetchNearbyPlaces: _.throttle(function(){
        if(this.state.location){
            TotemApi.placesNearby(this.state.location.lon, this.state.location.lat)
            .then((nearbyPlacesList) => {
                this.setState({nearbyPlaces: nearbyPlacesList});
            })
            .catch(function(error){
                console.log('connecting to the api failed!', error)
            })
            .done();
        }
    }, 30000),
    onLocationChange: function(){
        var self = this;

        LocationStore.getLatestAsync().then(function(latestLocation){
            self.setState({location: latestLocation});
        }).catch(function(e){
            console.log('TotemApp: caught massive error from location store:', e)
        })

        if(this.state.location){
            this.fetchNearbyPlaces();
        }
    },
    onUserChange: function(){
        this.loadUser();
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

module.exports = Totem;
