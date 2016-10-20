'use strict';

import { connect } from 'react-redux';
import { messageComposeInitiated, messageComposeCompleted, messageComposeCanceled } from '../actions/MessageActionCreators';

import React  from 'react';
import NavigationBar from './NavigationBar';
import GlobalStyles from '../GlobalStyles';

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
        currentVisit: state.currentVisit,
        place: state.currentVisit,
        ...message
    }
}

function mapDispatchToProps(dispatch){
    return {
        handleMessageComposeInitiated: (action)=>{ dispatch(action) },
        handleMessageComposeCompleted: (action)=>{ dispatch(action) },
        handleMessageComposeCancel:    (action)=>{ dispatch(action) },
        handleMessageSizeChange:       (action)=>{ dispatch(action) },
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
        console.log(this.props)
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
            contentHeight: DEFAULT_MESSAGE_HEIGHT, // per global styles
        }
    },
    render: function(){
        return (
            <View >
                {this.renderNavBar()}
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
                    <View style={ { flexDirection: 'column', justifyContent:'center', alignContent: 'center', paddingTop: 15 } }>
                        <TouchableHighlight onPress={this.handleMessageSubmitTouch}>
                            <Text style={ {fontSize: 18, color: 'gray'}} >Send</Text>
                        </TouchableHighlight>
                    </View>
            </View>
        )
    },
    handleAbortMessage: function(){
        this.props.navigator.pop();
        this.props.handleMessageComposeCancel(messageComposeCanceled());
    },
    handleUserSubjectInput: function(updatedSubjectText){
        this.props.handleMessageComposeInitiated(messageComposeInitiated(updatedSubjectText,
                                                                         this.props.text,
                                                                        this.props.contentHeight));
    },
    handleUserTextInput: function(updatedMessageText){
        this.props.handleMessageComposeInitiated(messageComposeInitiated(this.props.subject,
                                                                         updatedMessageText,
                                                                        this.props.contentHeight));
    },
    handleSizeChange: function(event){
        var height = this.props.contentHeight;
        // the text input initializes with a very small size
        if(event.nativeEvent.contentSize.height > DEFAULT_MESSAGE_HEIGHT){
            height = event.nativeEvent.contentSize.height;
        }

        this.props.handleMessageComposeInitiated(messageComposeInitiated(this.props.subject,
                                                                         this.props.text,
                                                                        height));
    },
    handleMessageSubmitTouch: function(){
        this.props.handleMessageComposeCompleted(messageComposeCompleted());
    }

});

module.exports = connect(mapStateToProps, mapDispatchToProps)(MessageCompose);
