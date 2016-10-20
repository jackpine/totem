'use strict';

import { connect } from 'react-redux';
import { placeLeaveCurrentPlace } from '../actions/PlaceActionCreators';
import { Paths } from '../constants/TotemConstants'

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

var Icon = require('react-native-vector-icons/Ionicons');

var DEFAULT_MESSAGE_HEIGHT = 40

function mapStateToProps(state) {
    return {
        currentVisit: state.currentVisit,
    }
}

function mapDispatchToProps(dispatch){
    return {
        handlePlaceLeave:              (action)=>{ dispatch(action) },
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
    render: function(){
        return (
            <View >
                {this.renderNavBar()}
                <ScrollView style={{flex:1}}>
                    <Text>Hi welcome to {this.props.currentVisit.place.name}, there's a lot you can do in this place.</Text>
                </ScrollView>
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
