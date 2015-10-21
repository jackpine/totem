'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    View,
    Text,
} = React;
var { Icon, } = require('react-native-icons');

var NavigationBar = React.createClass({

    propTypes:{
        leftButton: React.PropTypes.func,
        navigator: React.PropTypes.object.isRequired,
        rightButton: React.PropTypes.func.isRequired,
        title: React.PropTypes.string.isRequired,
    },
    render: function(){
        var leftButton, rightButton;

        if(this.props.leftButton)
            leftButton = this.props.leftButton()
        else{
            var nav = this.props.navigator;
            leftButton = (
                <TouchableHighlight
                    onPress={function(){ nav.pop() }}
                    style={styles.defaultBackButton}
                >
                    <View style={styles.defaultBackButton}>
                        <Icon
                            color={'#337ab7'}
                            name={'ion|chevron-left'}
                            size={30}
                            style={styles.backChevron}
                        />
                    </View>
                </TouchableHighlight> 
            )
        }

        return (
            <View>
                <View style={styles.toolbar}>
                    <View style={styles.toolbarButton}>{leftButton}</View>
                    <Text style={styles.toolbarTitle}>{this.props.title}</Text>
                    <View style={styles.toolbarButton}>{this.props.rightButton()}</View>
                </View>
            </View>)
    }
});

var styles = StyleSheet.create({
    toolbar:{
        paddingTop:30,
        paddingBottom:10,
        flexDirection:'row'
    },
    toolbarButton:{
        width: 50,
    },
    toolbarTitle:{
        color:'black',
        textAlign:'center',
        fontSize: 20,
        flex:1
    },
    backChevron: {
        height:30,
        width: 30,
        paddingLeft: 5,
    },
    defaultBackButton: {
        width: 60,
        flexDirection: 'row',
    },
});

module.exports = NavigationBar;
