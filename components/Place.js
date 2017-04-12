'use strict';

import pluralize from 'pluralize';
import { connect } from 'react-redux';
import { placeLeaveCurrentPlace } from '../actions/PlaceActionCreators';
import { Paths } from '../constants/TotemConstants'

import React  from 'react';
import NavigationBar from './NavigationBar';
import GlobalStyles from '../GlobalStyles';

import MessageCardList from './MessageCardList';

import {
    StyleSheet,
    Text,
    ScrollView,
    TextInput,
    View,
    TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

var DEFAULT_MESSAGE_HEIGHT = 40

function mapStateToProps(state) {
    return {
        currentVisit: state.currentVisit,
        currentVisitMessages: state.currentVisitMessages,
    }
}

function mapDispatchToProps(dispatch){
    return {
        actionDispatch:              (action)=>{ dispatch(action) },
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
                leftButtonHandler={()=>{this.handleLeavePlace()}}
                rightButton = { ()=>{ return self.composeButton()}  }
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
    messageCount: function(){
        if(this.props.currentVisitMessages){
            return this.props.currentVisitMessages.length;
        }
        else{
            return 0;
        }


    },
    handleLeavePlace: function(){
        var nav = this.props.navigator;
        var currRoutes = nav.getCurrentRoutes();
        if(currRoutes.length > 0 && currRoutes[currRoutes.length - 1].path == Paths.PLACE_CREATE){
            // There is a mix of state based routing and path based routing here.
            // `place visit` routing is under the auspices of state-based routing
            // but if we are coming from `place_create`, we don't want to go
            // back to creating a place
            nav.immediatelyResetRouteStack([
                {path: Paths.PLACE_JOIN}
            ])
        }
        // clear out the visit from the state
        this.props.actionDispatch(placeLeaveCurrentPlace())
    },
    render: function(){
        return (
            <View >
                {this.renderNavBar()}
                <ScrollView style={{flex:1}}>
                    <Text>Hi welcome to {this.props.currentVisit.place.name}, { this.messageCount() } {pluralize('message', this.messageCount())} here.</Text>
                </ScrollView>
                <MessageCardList 
                    messages={this.props.currentVisitMessages || [] }
                />
            </View>
        )
    },
    composeButton: function(){
        var self = this;

        return (
            <TouchableHighlight
                onPress={ () => self.props.navigator.push({path: Paths.MESSAGE_COMPOSE }) }
                    underlayColor={'white'}
                >
                    <View
                        accessibilityLabel={'Compose message'}
                        accessible
                    >
                        <Icon
                            color={'#337ab7'}
                            name={'ios-create-outline'}
                            size={30}
                        />
                    </View>
                </TouchableHighlight>
        );

    },

});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Place);
