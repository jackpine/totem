'use strict';

import { connect } from 'react-redux';
import { messageComposeInitiated, messageComposeCompleted, messageComposeCanceled } from '../actions/MessageActionCreators';

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
    contextTypes:  {
        currentVisit: React.PropTypes.object.isRequired,
        message: React.PropTypes.object.isRequired
    },

    propTypes: {
        currentVisit: React.PropTypes.object.isRequired,
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
            <View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text>
                        Subject:
                    </Text>
                    <TextInput
                        clearButtonMode="always"
                        onChangeText={this.handleUserSubjectInput}
                        multiline={true}
                        style={[GlobalStyles.textInput, { flex: 1}]}
                        testID="message_compose_subject"
                        onContentSizeChange={ this.handleSizeChange }
                    />
                </View>
                <View>
                </View>
                    <TextInput
                        clearButtonMode="always"
                        onChangeText={this.handleUserTextInput}
                        multiline={true}
                        style={[GlobalStyles.textInput, { flex: 1, height: this.props.contentHeight }]}
                        testID="message_compose_text"
                        onContentSizeChange={ this.handleSizeChange }
                    />
                    <View style={ { flexDirection: 'column', justifyContent:'center', paddingTop: 15 } }>
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
        this.props.handleMessageAction(messageComposeInitiated(updatedSubjectText,
                                                                         this.props.body,
                                                                        this.props.contentHeight));
    },
    handleUserTextInput: function(updatedMessageText){
        this.props.handleMessageAction(messageComposeInitiated(this.props.subject,
                                                                         updatedMessageText,
                                                                        this.props.contentHeight));
    },
    handleSizeChange: function(event){
        var height = this.props.contentHeight;
        // the text input initializes with a very small size
        if(event.nativeEvent.contentSize.height > DEFAULT_MESSAGE_HEIGHT){
            height = event.nativeEvent.contentSize.height;
        }

        this.props.handleMessageAction(messageComposeInitiated(this.props.subject,
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
