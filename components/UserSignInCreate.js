'use strict';

var React = require('react-native');
var NavigationBar = require('./NavigationBar');
var TotemApi = require('../util/TotemApi');

var {
    StyleSheet,
    Text,
    View,
    WebView
} = React;

var WEBVIEW_REF = 'webview';
var DEFAULT_URL = 'https://m.facebook.com';


var UserSignInCreate = React.createClass({

    propTypes: {
    },
    render: function(){
        return (
            <View>
                <NavigationBar
                    title={'Welcome to Totem - Create an Account'}
                    navigator={this.props.navigator}
                />
                <Text>Hi! Welcome to totem. The first step is to create an account. This will let you explore places around you.</Text>
                <WebView
                    ref={WEBVIEW_REF}
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    url={TotemApi.userSessionUrl()}
                    javaScriptEnabledAndroid={true}
                    onNavigationStateChange={this.onNavigationStateChange}
                />
            </View>
        )
    },
    onNavigationStateChange: function(navState) {
        console.log(`state change! ${navState}`);
    },

});

var styles = StyleSheet.create({
    webView: {
        backgroundColor: 'tomato',
        height: 350,
    },
});

module.exports = UserSignInCreate;
