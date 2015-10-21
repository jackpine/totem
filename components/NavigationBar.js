var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    View,
    Text,
} = React;
var { Icon, } = require('react-native-icons');

var NavigationBar = React.createClass({

    render: function(){
        var leftButton, rightButton;

        if(this.props.leftButton)
            leftButton = this.props.leftButton()
        else{
            var nav = this.props.navigator;
            leftButton = (
                <TouchableHighlight style={styles.defaultBackButton} onPress={function(){ nav.pop() }}>
                    <View style={styles.defaultBackButton}>
                        <Icon
                            name='ion|chevron-left'
                            size={30}
                            color='#337ab7'
                            style={styles.backChevron} />
                    </View>
                </TouchableHighlight> 
            )
        }

        return (
            <View>
                <View style={styles.toolbar}>
                    <View style={styles.toolbarButton}>{leftButton}</View>
                    <Text style={styles.toolbarTitle}>Join a Place</Text>
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
        color:'#fff',
        textAlign:'center'
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
    flexDirection: "row",
    },
});

module.exports = NavigationBar;
