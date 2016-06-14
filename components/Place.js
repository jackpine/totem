'use strict';

import { connect } from 'react-redux';
import { placeLeaveCurrentPlace } from '../actions/PlaceActionCreators';

import React from 'react';
import NavigationBar from './NavigationBar';

import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

function mapStateToProps(state) {
    return {
        currentVisit: state.currentVisit,
    }
}

function mapDispatchToProps(dispatch){
    return {
        handlePlaceLeave: (action)=>{ dispatch(action) },
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
                title={'Congrats, You are in ' + this.props.currentVisit.name}
                navigator={this.props.navigator}
            />
        );
    },
    render: function(){
        return (
            <View>
                {this.renderNavBar()}
                <Text>Hi welcome to {this.props.currentVisit.name}, there's a lot you can do in this place.</Text>
            </View>
        )

    }
});

var styles = StyleSheet.create({


});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Place);
