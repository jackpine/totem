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
    render: function() {

        var locationDebugInfo = <DebugLocation location={this.props.location}/>
        var placeCategoryIdOptions = Object.keys(PLACE_CATEGORIES).map(function(placeCategoryId) {
          return <PickerItemIOS
                    key={placeCategoryId}
                    value={PLACE_CATEGORIES[placeCategoryId]}
                    label={placeCategoryId} />
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
                        selectedValue={this.state.placeCategoryId}
                        onValueChange={(placeCategoryId) => this.setState({placeCategoryId: placeCategoryId}) }>
                        {placeCategoryIdOptions}
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
      return errors.length == 0;
    },
    handleSubmitPress: function(){
      if(this.validate()) {
        console.log('SUBMIT!');
        TotemApi.placeCreate({
          name: this.state.placeName,
          category_id: this.state.placeCategoryId
        }).then(function(json){
          console.log('posted the place', arguments)
        });
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
