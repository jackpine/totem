'use strict';

import { connect } from 'react-redux';
import { messageComposeInProcess, messageComposeCompleted, messageComposeCanceled } from '../actions/MessageActionCreators';

import React  from 'react';
import NavigationBar from './NavigationBar';
import GlobalStyles from '../GlobalStyles';
import { ActionTypes } from '../constants/TotemConstants';

import {
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
        user: state.user,
        location: state.location,
        currentVisit: state.currentVisit,
        ...message
    }
}

function mapDispatchToProps(dispatch){
    return {
        handleMessageAction: (action)=>{ dispatch(action) },
    }
}

var MessageCompose = React.createClass({
    propTypes: {
        currentVisit: React.PropTypes.object.isRequired,
        message: React.PropTypes.object.isRequired
    },

    renderNavBar: function(){
        var self = this;
        return (
            <NavigationBar
                leftButtonHandler={()=>{self.handleAbortMessage()}}
                title={'Type a message to leave in ' + this.props.currentVisit.place.name}
                navigator={this.props.navigator}
            />
        );
    },

    getDefaultProps: function(){
        return {
            subject: '',
            body: '',
            messageComposeState: null,
            contentHeight: DEFAULT_MESSAGE_HEIGHT, // per global styles
        }
    },
    render: function(){
        var composeView = (
            <View style={styles.messageComposeWrapper}>
                <Text style={styles.label}>
                    Subject:
                </Text>
                <TextInput
                    clearButtonMode="always"
                    onChangeText={this.handleUserSubjectInput}
                    multiline={true}
                    style={GlobalStyles.textInput}
                    testID="message_compose_subject"
                />
                <Text style={styles.label}>
                    Message Body:
                </Text>
                <TextInput
                    clearButtonMode="always"
                    onChangeText={this.handleUserTextInput}
                    multiline={true}
                    style={[GlobalStyles.textInput, { height: this.props.contentHeight }]}
                    testID="message_compose_text"
                    onContentSizeChange={ this.handleSizeChange }
                />
                <View style={ styles.submitButtonWrapper }>
                    <TouchableHighlight onPress={this.handleMessageSubmitTouch}>
                        <Text style={ {fontSize: 18, color: 'gray'}} >Send</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
        if(this.props.messageCreateState == ActionTypes.MESSAGE_CREATE_REQUESTED){
            composeView = (<Text style={ {fontSize: 18, color: 'gray'}}>Posting message!</Text>)
        }else if(this.props.messageCreateState == ActionTypes.MESSAGE_CREATE_SUCCEEDED) {
           composeView = null;
           this.props.handleMessageAction(messageComposeCanceled());
           this.props.navigator.pop();
        }
        return (
            <View >
                {this.renderNavBar()}
                {composeView}
            </View>
        )
    },
    handleAbortMessage: function(){
        this.props.navigator.pop();
        this.props.handleMessageAction(messageComposeCanceled());
    },
    handleUserSubjectInput: function(updatedSubjectText){
        this.props.handleMessageAction(messageComposeInProcess(updatedSubjectText,
                                                                         this.props.body,
                                                                        this.props.contentHeight));
    },
    handleUserTextInput: function(updatedMessageText){

        this.props.handleMessageAction(messageComposeInProcess(this.props.subject,
                                                                         updatedMessageText,
                                                                        this.props.contentHeight));
    },
    handleSizeChange: function(event){
        var height = this.props.contentHeight;
        // the text input initializes with a very small size
        if(event.nativeEvent.contentSize.height > DEFAULT_MESSAGE_HEIGHT){
            height = event.nativeEvent.contentSize.height;
        }

        this.props.handleMessageAction(messageComposeInProcess(this.props.subject,
                                                                         this.props.body,
                                                                        height));
    },
    handleMessageSubmitTouch: function(){
        this.props.handleMessageAction(messageComposeCompleted(this.props.subject,
                                                                         this.props.body,
                                                                         this.props.user,
                                                                         this.props.currentVisit,
                                                                         this.props.location));
    }

});

module.exports = connect(mapStateToProps, mapDispatchToProps)(MessageCompose);

var styles = {
    messageComposeWrapper: {
        flex: 1,
        flexDirection: 'column'
    },
    label: {
        height: 18,
    },
    messageSubjectWrapper: {
    },
    messageBodyWrapper: {
    },
    submitButtonWrapper: { 
        height: 60
    },
}
