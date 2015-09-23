'use strict';

var React = require('react-native');
var globalStyles = require('./globalStyles');

var {
    StyleSheet,
    Text,
    TextInput,
    View,
    Component
} = React;

class PlaceFinder extends Component {

    render() {
        return (
            <View>
            <Text style={globalStyles.navView}>
            Name the Place You're in
            </Text>
            <Text>Name:</Text>
            <TextInput
            style={styles.placeFinderInput}
            onChangeText={(text) => this.keyboardDidEnterText(text) /*this.setState({text})*/}
            value={this.state && this.state.text}
            defaultValue={""}
            keyboardType={'default'}
            />
            </View>
        );
    }

    keyboardDidEnterText(text: string){
        console.log("Keyboard:"+text);
    }

}

var styles = StyleSheet.create({
    placeFinderInput: {
        margin:65,
        height:40,
        borderColor: 'gray',
        borderWidth: 1,
    }
});

module.exports = PlaceFinder;
