var React = require('react-native');
var LocationManager = React.NativeModules.TMLocationManager;
var PlaceCreate = require('./PlaceCreate');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var TotemConstants = require('../constants/TotemConstants');
var ActionTypes = TotemConstants.ActionTypes;
var LocationUpdateAction = require('../actions/LocationUpdateAction');
var NavigationBar = require('react-native-navbar');

var {
    StyleSheet,
    NativeAppEventEmitter,
    PixelRatio,
    TouchableOpacity,
    View,
    Text,
} = React;


var Totem = React.createClass({
    componentDidMount: function(){
        LocationManager.startLocationUpdates({}, function(err, response){
            console.log(`${response}`)
        })
    },
    renderScene: function(route, nav){

        var Component = route.component;
        var navBar = route.navigationBar;

        if (navBar) {
            navBar = React.addons.cloneWithProps(navBar, {
                navigator: navigator,
                route: route,
                title: route.title
            });
        }

        return (
            <View style={styles.navigator}>
            {navBar}
            <Component navigator={navigator} route={route} />
            </View>
        );

    },
    render: function() {
        console.log('Calling render in top level component')
        return (
            <React.Navigator
            ref={this._setNavigatorRef}
            style={styles.container}
            renderScene={this.renderScene}
            initialRoute={{
                title: 'Place Create',
                component: PlaceCreate,
                navigationBar: <NavigationBar title="Initial View"/>
            }}
            />
        );
    },
    componentWillUnmount: function() {
        this._listeners && this._listeners.forEach(listener => listener.remove());
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
});

var styles = StyleSheet.create({
    container: {
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
