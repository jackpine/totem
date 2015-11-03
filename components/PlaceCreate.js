'use strict';

var React = require('react-native');
var Button = require('react-native-button');
var DebugLocation = require('./DebugLocation');
var PlaceList = require('./PlaceList');
var NavigationBar = require('./NavigationBar');
var GlobalStyles = require('../GlobalStyles.js');

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

var PLACE_TYPES = {
    "continent": 1,
    "country": 2,
    "region": 3,
    "county": 4,
    "locality": 5,
    "neighborhood": 6,
};

var PlaceCreate = React.createClass({
    getInitialState: function() {
      return {
        placeName: "",
        placeType: 3,
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
    render: function() {

        var locationDebugInfo = <DebugLocation location={this.props.location}/>
        var placeTypeOptions = Object.keys(PLACE_TYPES).map(function(placeType) {
          return <PickerItemIOS
                    key={placeType}
                    value={PLACE_TYPES[placeType]}
                    label={placeType} />
        });

        var errorComponents =this.state.errors.map((error) => (
          <Text style={{padding: 12, color: 'white', backgroundColor: "tomato"}}>{error}</Text>
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
                <View style={{flexDirection: "row"}}>
                    <PickerIOS
                        style={{flex: 1, textAlign: "center"}}
                        selectedValue={this.state.placeType}
                        onValueChange={(placeType) => this.setState({placeType: placeType}) }>
                        {placeTypeOptions}
                    </PickerIOS>
                </View>

                <Button onPress={this.handleSubmitPress}>
                    Create Place
                </Button>

            </View>
        );
    },
    handleUserInput: function(newPlaceName){
      this.setState({placeName: newPlaceName});
      console.log(this.state.placeName);
    },
    validate: function() {
      var errors = [];
      if(this.state.placeName.length < 3) {
        errors.push("Place Name must be at least 3 characters.");
      }
      this.setState({errors: errors});
    },
    handleSubmitPress: function(){
      if(this.validate()) {
        console.log('SUBMIT!');
      } else {
        console.log('invalid!');
      }
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
