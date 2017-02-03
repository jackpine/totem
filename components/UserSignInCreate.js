'use strict';
import { ActionTypes } from '../constants/TotemConstants';

import React from 'react';
import NavigationBar from './NavigationBar';
import TotemApi from '../util/TotemApi';
import url from 'url';
import { Buffer } from 'buffer';

import {
    StyleSheet,
    Text,
    View,
    WebView
} from 'react-native';

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
            <View style={styles.container}>
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
    container: {
        flex: 1
    },
    webView: {
        backgroundColor: 'white',
        height: 550,
        flex: 1,
        justifyContent: 'center'
    },
});

module.exports = UserSignInCreate;
