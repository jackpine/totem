'use strict';

var React = require('react-native');
var NavigationBar = require('./NavigationBar');
var TotemApi = require('../util/TotemApi');
var UserActions = require('../actions/UserActions');
var url = require('url');
var Buffer = require('buffer').Buffer;

var {
    StyleSheet,
    Text,
    View,
    WebView
} = React;

var WEBVIEW_REF = 'webview';


var UserSignInCreate = React.createClass({

    getInitialState: function(){
        return {
        }
    },
    componentDidMount: function(){
        console.log('mounted@')
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

        console.log(`state change! `, navState);

        if(new RegExp(/auth_token_pairs\/me/).test(navState.url)){
            var parsedUrl = url.parse(navState.url)
            var b64json = decodeURIComponent(parsedUrl.query.split('=')[1]);
            var buf = new Buffer(b64json, 'base64')
            var parsedUserDoc = JSON.parse(buf.toString('utf8'));
            UserActions.save(parsedUserDoc)
        }
    },

});

var styles = StyleSheet.create({
    webView: {
        backgroundColor: 'tomato',
        height: 350,
    },
});

module.exports = UserSignInCreate;
