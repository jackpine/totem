'use strict';

import { connect } from 'react-redux';
import { placeLeaveCurrentPlace } from '../actions/PlaceActionCreators';
import { initiateMessageCompose, messageComposeCompleted } from '../actions/MessageActionCreators';

import React  from 'react';
import NavigationBar from './NavigationBar';
import GlobalStyles from '../GlobalStyles';

import {
    StyleSheet,
    Text,
    ScrollView,
    TextInput,
    View,
    TouchableHighlight,
} from 'react-native';

var DEFAULT_MESSAGE_HEIGHT = 40

function mapStateToProps(state) {
    var message = state.message;
    return {
        currentVisit: state.currentVisit,
        ...message,

    }
}

function mapDispatchToProps(dispatch){
    return {
        handlePlaceLeave:              (action)=>{ dispatch(action) },
        handleMessageComposeInitiated: (action)=>{ dispatch(action) },
        handleMessageComposeCompleted: (action)=>{ dispatch(action) },
        handleMessageSizeChange:       (action)=>{ dispatch(action) },
    }
}

var Place = React.createClass({
    contextTypes:  {
        store: React.PropTypes.object.isRequired
    },

    propTypes: {
        currentVisit: React.PropTypes.object.isRequired,
    },
    renderNavBar: function(){
        var self = this;
        return (
            <NavigationBar
                leftButtonHandler={()=>{self.props.handlePlaceLeave(placeLeaveCurrentPlace())}}
                title={'Congrats, You are in ' + this.props.currentVisit.place.name}
                navigator={this.props.navigator}
            />
        );
    },
    getDefaultProps: function(){
        return {
            text: '',
            contentHeight: DEFAULT_MESSAGE_HEIGHT, // per global styles
        }
    },
    render: function(){
        return (
            <View >
                {this.renderNavBar()}
                <View style={[{flex: 1, flexDirection: 'row', height: this.props.contentHeight, marginBottom: 20, padding: 10}, {} ]}>
                    <TextInput
                        clearButtonMode="always"
                        onChangeText={this.handleUserInput}
                        multiline={true}
                        style={[GlobalStyles.textInput, { flex: 1, height: this.props.contentHeight }]}
                        testID="message_compose"
                        onContentSizeChange={ this.handleSizeChange }
                    />
                    <View style={ { flexDirection: 'column', justifyContent:'center', alignContent: 'center', paddingTop: 15 } }>
                        <TouchableHighlight onPress={this.handleMessageSendPush}>
                            <Text style={ {fontSize: 18, color: 'gray'}} >Send</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <ScrollView style={{flex:1}}>
                    <Text>Hi welcome to {this.props.currentVisit.place.name}, there's a lot you can do in this place.</Text>
                </ScrollView>
            </View>
        )
    },
    handleUserInput: function(updatedMessageText){
        this.props.handleMessageComposeInitiated(initiateMessageCompose(updatedMessageText,
                                                                        this.props.contentHeight));
    },
    handleSizeChange: function(event){
        var height = this.props.contentHeight;
        // the text input initializes with a very small size
        if(event.nativeEvent.contentSize.height > DEFAULT_MESSAGE_HEIGHT){
            height = event.nativeEvent.contentSize.height;
        }

        this.props.handleMessageComposeInitiated(initiateMessageCompose(this.props.text,
                                                                        height));
    },
    handleMessageSendPush: function(){
        this.props.handleMessageComposeCompleted(messageComposeCompleted());
    }

});

var placeStyles = StyleSheet.create({

});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Place);
