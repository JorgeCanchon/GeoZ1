import React, { Component } from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import { View, Text, Button, Container, Content, Input, Item, Form, Label, Fab, Header, Left, Right, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import AlertInput from 'react-native-alert-input';
import Title from '../components/Title';

import * as actions from '../redux/actions/index';

import Draw from '../components/Draw';
import { SearchBox } from '../components/SearchBox';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchPostDatos } from '../redux/async/function';
import firebase from '../redux/async/config_firebase';
class AddMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 4.7524532252167075,
                longitude: -74.10342556571197,
                latitudeDelta: 1,
                longitudeDelta: 1,
            },
            active: false,
            draw: {
                Title: '',
                description: '',
                radio: 0,
                latlng: {
                    latitude: 0,
                    longitude: 0,
                },
            },
            typeDrawing: 0,
            showModal: false
        };
        this.props.screenProps.changeRouteNavigation('AddMap');
    }
    static navigationOptions = {
        header: null
    }
    validateCampos(){
        let state = this.state;
        let expreg = new RegExp('^[A-Z a-z\sáéíóúñ.,_\]*$');
        let expreg1 = new RegExp('^[A-Z a-z 0-9\sáéíóúñ.,_\]+$');
        if(state.draw.Title == ''){
            alert('El campo nombre es obligatorio');
            return;
        }else if(!expreg.test(state.draw.Title)){
            alert("El campo nombre debe contener solo letras");
            return;
        }else if(state.draw.description == ''){
            alert('El campo descripcion es obligatorio');
            return;
        }else if(state.draw.latlng.latitude == '' || state.draw.latlng.longitude == ''){
            alert('Agregue una geozona');
            return;
        }
        this.addMapa().then(res => {
            if (res) {
                alert("Geozona agregada con éxito");
                this.props.navigation.goBack();
            } else {
                alert("Error al agregar la geozona");
            }
        });
    }
    async addMapa() {
        let state = this.state;  
        let data = {
            Nombre: state.draw.Title,
            Descripcion: state.draw.description,
            Lat: state.draw.latlng.latitude,
            Lng: state.draw.latlng.longitude,
            TipoGeozona: state.typeDrawing,
            Radio: state.draw.radio
        }
        /*
        implementando web api
        let res = await fetchPostDatos(data);
        if(res){
            data = {
                ...data,
                IdMapaMovil: res,
            }
            this.props.addGeozona(data);
        }
        return res;*/
        try{
            let id = firebase.database().ref().child('GeoZ').push().key;
            data = {
                ...data,
                IdMapaMovil: id,
                FechaCreacion: this.formatted_date()
            };
            //firebase.database().ref('GeoZ').push(data);
            let updates = {};
            updates['GeoZ/' + id] = data;
            firebase.database().ref().update(updates);
            return true;
        }catch(e){
            return false;
        }
    }
    formatted_date()
    {
    var result="";
    var d = new Date();
    result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() + 
                " "+ d.getHours()+":"+d.getMinutes()+":"+
                d.getSeconds()+" "+d.getMilliseconds();
    return result;
    }
    onPress(data) {
        let latitude = data.nativeEvent.coordinate.latitude;
        let longitude = data.nativeEvent.coordinate.longitude;
        let state = this.state;

        this.setState({
            ...state,
            draw: {
                Title: state.draw.Title,
                description: state.draw.description,
                radio: state.draw.radio,
                latlng: {
                    latitude: latitude,
                    longitude: longitude,
                }
            },
            typeDrawing: this.state.typeDrawing
        });
    }
    onPressMarker() {
        let state = this.state;
        this.setState({
            ...state,
            draw: {
                Title: state.draw.Title,
                description: state.draw.description,
                radio: 0,
                latlng: {
                    latitude: state.draw.latlng.latitude,
                    longitude: state.draw.latlng.longitude,
                },
            },
            typeDrawing: 1,
            active: !state.active,

        })
    }
    onPressCircle() {
        let state = this.state;
        this.setState({
            ...state,
            active: !state.active,
            showModal: !state.showModal
        });
    }
    renderDraw() {
        let state = this.state;
        return <Draw
            Title={state.draw.Title}
            description={state.draw.description}
            latlng={state.draw.latlng}
            radio={state.draw.radio}
            tipo={state.typeDrawing}

            onChangeDrag={this.onChangeDrag.bind(this)}  

            draggable={true}
        />
    }
    onRegionChangeComplete(data) {
        let state = this.state;
        this.setState({
            ...state,
            region: {
                latitude: data.latitude,
                longitude: data.longitude,
                latitudeDelta: data.latitudeDelta,
                longitudeDelta: data.longitudeDelta,
            }
        });
    }
    onChangeRadius(_radio) {
        try {
            let regex_numeros = /^[0-9]+$/;
            if(!(regex_numeros).exec(_radio)){
                alert("¡VALOR NO NÚMERICO!");
                return;
            }
            let radio = parseInt(_radio);
            if (radio <= 0 || radio > 2000) {
                alert("¡VALOR NO VALIDO!");
                return;
            }
            let state = this.state;
            this.setState({
                ...state,
                draw: {
                    Title: state.draw.Title,
                    description: state.draw.description,
                    radio: radio,
                    latlng: {
                        latitude: state.draw.latlng.latitude,
                        longitude: state.draw.latlng.longitude,
                    }
                },
                typeDrawing: 2,
                showModal: !state.showModal
            });
        } catch (e) {
            alert("Error: ", e.message);
        }
    }
    onShowModal() {
        let state = this.state;
        this.setState({
            ...state,
            showModal: !state.showModal
        });
    }
    onEditing(text, type) {
        let state = this.state;
        switch (type) {
            case 1:
                this.setState({
                    ...state,
                    draw: {
                        Title: text,
                        description: state.draw.description,
                        radio: state.draw.radio,
                        latlng: {
                            latitude: state.draw.latlng.latitude,
                            longitude: state.draw.latlng.longitude,
                        }
                    }
                });
                break;
            case 2:
                this.setState({
                    ...state,
                    draw: {
                        Title: state.draw.Title,
                        description: text,
                        radio: state.draw.radio,
                        latlng: {
                            latitude: state.draw.latlng.latitude,
                            longitude: state.draw.latlng.longitude,
                        }
                    }
                });
                break;
        }
    }
    onChangeDrag(latlng){
        let state = this.state;
        this.setState({
            ...state,
            draw: {
                id: state.draw.id,
                Title: state.draw.Title,
                description: state.draw.description,
                radio: state.draw.radio,
                latlng: {
                    latitude: latlng.latitude,
                    longitude:  latlng.longitude,
                }
            }
        });
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.1 }}>
                    <Header style={{ backgroundColor: "#fff", position: "absolute" }}>
                        <Left>
                            <Icon name="close" size={35} color="#000" onPress={_ => this.props.navigation.goBack()} style={{ marginLeft: 10 }} />
                        </Left>
                        <Body style={{ alignContent:"center", alignItems:"center" }}>
                            <Text style={{ fontSize: 18,textAlign:"center"}}>Agregar geozona</Text>
                        </Body>
                        <Right>
                            <Icon
                                name="send"
                                size={28}
                                color="#000"
                                onPress={() => {
                                    this.validateCampos();
                                }}
                            />
                        </Right>
                    </Header>
                </View>
                <View style={{ flex: 1 }}>
                    <AlertInput
                        show={this.state.showModal}
                        title="Ingrese radio"
                        placeholder="mayor a 1m y menor que 2000m"
                        onCancel={_ => this.onShowModal()}
                        onSubmit={text => { this.onChangeRadius(text) }}
                    />
                    <MapView
                        style={styles.map}
                        region={this.state.region}
                        onPress={this.onPress.bind(this)}
                        onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
                        provider={PROVIDER_GOOGLE}
                    >
                        {this.renderDraw()}
                    </MapView>
                    <SearchBox onEditing={this.onEditing.bind(this)} state={this.state} />
                    <Fab
                        active={this.state.active}
                        direction="up"
                        containerStyle={{}}
                        style={{ backgroundColor: '#5067FF' }}
                        position="bottomRight"
                        onPress={_ => this.setState({ active: !this.state.active })}>
                        <Icon name="pencil" />
                        <Button style={{ backgroundColor: '#fff' }} onPress={_ => this.onPressCircle()}>
                            <Icon name="circle-thin" size={30} color="#000" />
                        </Button>
                        <Button style={{ backgroundColor: '#fff' }} onPress={_ => this.onPressMarker()}>
                            <Icon name="map-marker" size={30} color="#000" />
                        </Button>
                    </Fab>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
});

const mapStateToProps = (state) => ({ crud: state.crud });

const matchDispatchToProps = (dispatch) => bindActionCreators({ addGeozona: actions.addGeozona }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(AddMap);