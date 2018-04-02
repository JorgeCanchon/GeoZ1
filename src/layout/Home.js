import React, { Component } from 'react';
import { Container, Text, Header, Content, Icon, Card, Button, Right, CardItem, Body, Fab, View, Item, Input, Left, Spinner } from 'native-base';
import { AsyncStorage } from 'react-native'
import SplashScreen from 'react-native-smart-splash-screen';
import ListMap from '../components/ListMap';
import { fetchGetDatos } from '../redux/async/function';

import * as actions from '../redux/actions/index';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import firebase from '../redux/async/config_firebase';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            text: "",
        }
        this.props.screenProps.changeRouteNavigation('Home');
    }
    static navigationOptions = {
        header: null
    }
    listenForItems = (itemsRef) => {
        
        itemsRef.on('value', (snap) => {
            // get children as an array
            this.props.emptyGeozona();
            snap.forEach((child) => {
                this.props.addGeozona(child.val());
            });
        });       
    }
    async componentDidMount() {
        SplashScreen.close({
            animationType: SplashScreen.animationType.scale,
            duration: 850,
            delay: 500,
        });
        /*
        let obj = await fetchGetDatos();
        if (obj.length != 0) {
            obj.map(x => {
                //this.props.addGeozona(x)
               // firebase.database().ref('GeoZ').push(x);
            }
            );
        }*/
        const itemsRef = firebase.database().ref('GeoZ');
        //AsyncStorage.setItem('userData', Math.random());
        this.listenForItems(itemsRef);
        this.setState({
            isLoading: false
        })
    }
    onSearch(search) {
        this.props.searchGeozona(search);
    }
    render() {
        const props = this.props;
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1 }}>
                    <Header searchBar rounded style={{ backgroundColor: '#000' }}>
                        <Left>
                            <Button
                                transparent
                                onPress={() => props.navigation.navigate("DrawerOpen")}>
                                <Icon name="menu" />
                            </Button>
                        </Left>
                        <Item>
                            <Input placeholder="Search" />
                            <Icon name="refresh" onPress={_ => this.onSearch(" ")} />
                        </Item>
                    </Header>
                    <Spinner color='blue' />
                </View>
            )
        }
        return (
            <View style={{ flex: 1 }}>
                <Header searchBar rounded style={{ backgroundColor: '#000' }}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => props.navigation.navigate("DrawerOpen")}>
                            <Icon name="menu" />
                        </Button>
                    </Left>
                    <Item>
                        <Input placeholder="Search" onChangeText={text => { this.onSearch(text); this.setState({ text }); }} value={this.state.text} />
                        <Icon name="refresh" onPress={_ => { this.onSearch(""); this.setState({ text: "" }); }} />
                    </Item>
                </Header>
                <ListMap navigation={props.navigation} />
                <Fab
                    containerStyle={{}}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => { props.navigation.navigate('AddMap') }}>
                    <Text>+</Text>
                </Fab>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({ crud: state.crud });

const matchDispatchToProps = (dispatch) => bindActionCreators({ addGeozona: actions.addGeozona, searchGeozona: actions.searchGeozona, emptyGeozona: actions.emptyGeozona }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(HomeScreen);
