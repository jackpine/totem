'use strict';

import { connect } from 'react-redux';
import { messageComposeInProcess, messageComposeCompleted, messageComposeCanceled } from '../actions/MessageActionCreators';
import MessageValidator from '../services/MessageValidator';

import React  from 'react';
import NavigationBar from './NavigationBar';
import GlobalStyles from '../GlobalStyles';
import { ActionTypes } from '../constants/TotemConstants';
import _ from 'underscore';

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
        location: React.PropTypes.object.isRequired,
        user: React.PropTypes.object.isRequired,
        body: React.PropTypes.string.isRequired,
        subject: React.PropTypes.string.isRequired,
        contentHeight: React.PropTypes.number.isRequired,
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
    componentDidUpdate: function(){
        if(this.props.messageCreateState == ActionTypes.MESSAGE_CREATE_SUCCEEDED) {
            this.props.handleMessageAction(messageComposeCanceled());
            this.props.navigator.pop();
        }
    },
    render: function(){
        if(this.props.errors){
            var formattedErrors = _(this.props.errors).map((error) => <Text style={GlobalStyles.errorText}>{error}</Text>);
        }
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
                {formattedErrors}
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
                                                                         this.props.contentHeight,
                                                                         []
                                                              )
                                      );
    },
    handleUserTextInput: function(updatedMessageText){

        this.props.handleMessageAction(messageComposeInProcess(this.props.subject,
                                                                         updatedMessageText,
                                                                         this.props.contentHeight,
                                                                         []
                                                              )
                                      );
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
        var messageValidator = new MessageValidator(this.props.subject, this.props.body);

        if(messageValidator.validate()){
            this.props.handleMessageAction(messageComposeCompleted(this.props.subject,
                                                                             this.props.body,
                                                                             this.props.user,
                                                                             this.props.currentVisit,
                                                                             this.props.location));
        }
        else{
            this.props.handleMessageAction(messageComposeInProcess(this.props.subject,
                                                               this.props.body,
                                                               this.props.contentHeight,
                                                               messageValidator.errors)
                                      );
        }
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
