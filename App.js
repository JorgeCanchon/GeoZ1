'use strict'
import React, { Component } from 'react';
import { Platform, BackHandler, ToastAndroid } from 'react-native';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-smart-splash-screen';
import {
    StackNavigator, DrawerNavigator
} from 'react-navigation';
import AddMap from './src/layout/AgregarMapa';
import HomeScreen from './src/layout/Home';
import SideBar from './src/components/SideBar';
import ViewMap from './src/layout/ViewMap';
import EditMap from './src/layout/EditMap';
import Intro from './src/layout/Tour/Intro';
import AddMapTour from './src/layout/Tour/AgregarMapaTour';
import EditMapTour from './src/layout/Tour/EditMapTour';
import ViewMapTour from './src/layout/Tour/ViewMapTour';

import allReducers from './src/redux/reducers/index';

const store = createStore(allReducers, applyMiddleware(thunk));
//Funcion Main
const MainStack = StackNavigator(
    {
        Intro: { screen: Intro,
        header: null,
            navigationOptions: ({navigation}) => ({
                header: false
            })
        },
        AddMapTour: { screen: AddMapTour,
            header: null,
            navigationOptions: ({navigation}) => ({
                header: false
              })
        },
        EditMapTour :{ screen: EditMapTour,
            header: null,
            navigationOptions: ({navigation}) => ({
                header: false
              })
        },
        ViewMapTour: { screen: ViewMapTour },
        Home: { screen: HomeScreen },
        ViewMap: { screen: ViewMap },
        AddMap: { screen: AddMap },
        EditMap: { screen: EditMap }
    },
    {
        initialRouteName: 'Home',
    }
);
//Funcion que devuelve un componente React
//Funcion root
const App = DrawerNavigator(
    {
        Main: {
            screen: MainStack,
        }
    },
    {
        contentComponent: props => <SideBar {...props} />
    }
);
export default class GeoZ extends Component {
    constructor(props) {
        super(props);
        this.backButtonListener = null;
        this.currentRouteName = 'Home';
    }
    changeRouteNavigation(route){
        this.currentRouteName = route;
    }
    componentDidMount() {
        if (Platform.OS === 'android') {
            this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', () => {
                if (this.currentRouteName !== 'Home') {
                        if(this.currentRouteName  == 'Tour')this.currentRouteName = 'Intro';else this.currentRouteName = 'Home';
                    return false;
                }
                if (this.lastBackButtonPress + 2000 >= new Date().getTime()) {
                    BackHandler.exitApp();
                    store.dispatch({type:'EMPTY_GEOZONA'}); 
                    return true;
                }
                ToastAndroid.show('¡Presiona nuevamente para salir!', ToastAndroid.SHORT);
                this.lastBackButtonPress = new Date().getTime();
                return true;
            });
        }
    }
    componentWillUnmount() {
        if (Platform.OS === 'android') this.backButtonListener.remove();
    }
    render() {
        return (
            <Provider store={store}>
                <App screenProps={{ changeRouteNavigation:this.changeRouteNavigation.bind(this)}} />
            </Provider>
        );
    }
}
// skip this line if using Create React Native App
//AppRegistry.registerComponent('GeoZ', () => GeoZ);
