'use strict';

import { connect } from 'react-redux';
import { placeLeaveCurrentPlace } from '../actions/PlaceActionCreators';

var React = require('react-native');
var NavigationBar = require('./NavigationBar');

var {
    StyleSheet,
    Text,
    View,
} = React;

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
                title={'Congrats, You are in ' + this.props.currentVisit.place.name}
                navigator={this.props.navigator}
            />
        );
    },
    render: function(){
        return (
            <View>
                {this.renderNavBar()}
                <Text>Hi welcome to {this.props.currentVisit.place.name}, there's a lot you can do in this place.</Text>
            </View>
        )

    }
});

var styles = StyleSheet.create({


});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Place);
