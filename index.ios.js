import React, { Component, AppRegistry } from 'react-native';
import Totem from './components/TotemApp';
import { Provider } from 'react-redux';
import loadStore from './store/loadStore';

var store = loadStore();

class AppWrapper extends Component {
    render(){
        return (
            <Provider store={store}>
                <Totem />
            </Provider>
        );
    }
}

React.AppRegistry.registerComponent('Totem', () => (
    AppWrapper
));
