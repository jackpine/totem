'use strict';

var React = require('react-native');
var Button = require('react-native-button');
var DebugLocation = require('./DebugLocation');
var PlaceList = require('./PlaceList');
var NavigationBar = require('./NavigationBar');
var GlobalStyles = require('../GlobalStyles');
var TotemApi = require('../util/TotemApi');

var {
    StyleSheet,
    Text,
    TextInput,
    PickerIOS,
    View,
    ListView,
    TouchableHighlight,
} = React;

var PickerItemIOS = PickerIOS.Item

var PLACE_CATEGORIES = {
    'continent': 1,
    'country': 2,
    'region': 3,
    'county': 4,
    'locality': 5,
    'neighborhood': 6,
};

var PlaceCreate = React.createClass({
    getInitialState: function() {
        return {
            placeName: '',
            placeCategoryId: 3,
            errors: []
        };
    },
    renderNavBar: function(){
        var rightButton = function(){

        };
        return (
            <NavigationBar 
                navigator={this.props.navigator}
                rightButton={rightButton}
                title={'Create a New Place'}
            />
        );
    },
    handleUserInput: function(newPlaceName){
        this.setState({placeName: newPlaceName});
        console.log(this.state.placeName);
    },
    validate: function() {
        var errors = [];
        if(this.state.placeName.length < 3) {
            errors.push('Place Name must be at least 3 characters.');
        }
        if(!this.props.location){
            errors.push('Still waiting for a location, just a second.');
        }
        this.setState({errors: errors});
        return errors.length == 0;
    },
    handleSubmitPress: function(){

        if(this.validate()) {
            console.log('Submitting a place');
            var navigator = this.props.navigator;
            TotemApi.placeCreate({
                name: this.state.placeName,
                category_id: this.state.placeCategoryId,
                location: this.props.location
            }).then(function(place_json){
                navigator.replace({path: 'place', passProps:place_json});
            });
        } else {
            console.log('invalid!');
        }
    },
    render: function() {

        var locationDebugInfo = <DebugLocation location={this.props.location}/>

        var errorComponents =this.state.errors.map((error) => (
            <Text style={{padding: 12, color: 'white', backgroundColor: 'tomato'}}>{error}</Text>
        ));

        return (
            <View syle={{flex: 1}}>
                {this.renderNavBar()}
                {locationDebugInfo}
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={this.handleUserInput}
                    placeholder="Place Name"
                    style={GlobalStyles.textInput}
                    testID="place_name"
                    value={this.state.placeName}
                />
                {errorComponents}
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <PickerIOS
                        onValueChange={(placeCategoryId) => this.setState({placeCategoryId: placeCategoryId}) }
                        selectedValue={this.state.placeCategoryId}
                        style={{flex: 1, alignSelf: 'center'}}
                        >
                        {Object.keys(PLACE_CATEGORIES).map(function(placeCategoryId) {
                            return (
                                <PickerItemIOS
                                    key={placeCategoryId}
                                    label={placeCategoryId} 
                                    value={PLACE_CATEGORIES[placeCategoryId]}
                                />)
                        })}
                    </PickerIOS>
                </View>

                <Button onPress={this.handleSubmitPress}>
                    Establish this Place
                </Button>

            </View>
        );
    },
});

var styles = StyleSheet.create({
    placeFinderInput: {
        height:40,
        borderColor: 'gray',
        borderWidth: 1,
    },
});

module.exports = PlaceCreate;
