'use strict';

import React from 'react';
import NavigationBar from './NavigationBar';

import {
    StyleSheet,
    Text,
    View,
} from 'react-native';


var Place = React.createClass({

    propTypes: {
    },
    renderNavBar: function(){
        return (
            <NavigationBar
                title={'Totem'}
                navigator={this.props.navigator}
            />
        );
    },
    render: function(){
        return (
            <View>
                {this.renderNavBar()}
                <Text>Loading..</Text>
            </View>
        )

    }
});

var styles = StyleSheet.create({
});

module.exports = Place;
