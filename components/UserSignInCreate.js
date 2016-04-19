'use strict';
import { ActionTypes } from '../constants/TotemConstants';

var React = require('react-native');
var NavigationBar = require('./NavigationBar');
var TotemApi = require('../util/TotemApi');
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
    contextTypes:  {
        store: React.PropTypes.object.isRequired
    },
    getInitialState: function(){
        return {
          injectedJs: "$.post('/users/sign_out', {'_method':'delete'})"
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
                  style={styles.webView}
                  source={{uri: TotemApi.userSessionUrl()}}
                  javaScriptEnabled={true}
                  decelerationRate="normal"
                  onNavigationStateChange={this.onNavigationStateChange}
                  startInLoadingState={true}
                  scalesPageToFit={true}
                  automaticallyAdjustCbnew
                  ontentInsets={false}
                  scalesPageToFit={false}
                  injectedJavaScript={this.state.injectedJs}
                />
            </View>
        )
    },
    onNavigationStateChange: function(navState) {

        console.log(`navigation state change! `, navState);

        if(new RegExp(/auth_token_pairs\/me/).test(navState.url)){
            var parsedUrl = url.parse(navState.url)
            var b64json = decodeURIComponent(parsedUrl.query.split('=')[1]);
            var buf = new Buffer(b64json, 'base64')
            var parsedUserDoc = JSON.parse(buf.toString('utf8'));
            this.context.store.dispatch({
                type: ActionTypes.USER_SAVE,
                user: parsedUserDoc});
        }
    },

});

var styles = StyleSheet.create({
    webView: {
        backgroundColor: 'white',
        height: 550,
        flex: 1,
        justifyContent: 'center'
    },
});

module.exports = UserSignInCreate;
