import React, { Component } from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import { View, Text, Button, Container, Content, Input, Item, Form, Label, Fab, Header, Left, Right, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import AlertInput from 'react-native-alert-input';
import Title from '../components/Title';

import * as actions from '../redux/actions/index';

import Draw from '../components/Draw';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SearchBox } from '../components/SearchBox';

import { fetchPutDatos } from '../redux/async/function';
import firebase from '../redux/async/config_firebase';

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

class EditMap extends Component {
    constructor(props) {
        super(props);
        const { params } = props.navigation.state;
        this.state = {
            region: {
                latitude: params.latlng.latitude,
                longitude: params.latlng.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            active: false,
            draw: {
                id: params.id,
                Title: params.Title,
                description: params.description,
                radio: params.radio,
                latlng: {
                    latitude: params.latlng.latitude,
                    longitude: params.latlng.longitude,
                },
            },
            typeDrawing: params.tipo,
            showModal: false
        };
        this.props.screenProps.changeRouteNavigation('EditMap');
    }
    static navigationOptions = {
        header: null
    }
    validateCampos() {
        let state = this.state;
        let expreg = new RegExp('^[A-Z a-z\sáéíóúñ.,_\]*$');
        let expreg1 = new RegExp('^[A-Z a-z 0-9\sáéíóúñ.,_\]+$');
        if (state.draw.Title == '') {
            alert('El campo nombre es obligatorio');
            return;
        } else if (!expreg.test(state.draw.Title)) {
            alert("El campo nombre debe contener solo letras");
            return;
        } else if (state.draw.description == '') {
            alert('El campo descripcion es obligatorio');
            return;
        } else if (state.draw.latlng.latitude == '' || state.draw.latlng.longitude == '') {
            alert('Agregue una geozona');
            return;
        }
        this.updateMapa().then(response => {
            if (response.res) {
                alert(`Geozona ${state.draw.Title} editada con éxito`);
                this.props.navigation.goBack();
            } else {
                alert(`Error al editar la geozona ${state.draw.Title} \n${response.mensaje}`);
            }
        });
    }
    async updateMapa() {
        let state = this.state;
        let data = {
            IdMapaMovil: state.draw.id,
            Nombre: state.draw.Title,
            Descripcion: state.draw.description,
            Lat: state.draw.latlng.latitude,
            Lng: state.draw.latlng.longitude,
            TipoGeozona: state.typeDrawing,
            Radio: state.draw.radio
        }
        /*let res = await fetchPutDatos(state.draw.id,data);
        if (res) {
            this.props.editGeozona(data);
        }
        return res;*/
        try {
            let obj = {};
            let res = this.checkIfUserExists(state.draw.id);

            if (res) {
                let updates = {};
                updates['GeoZ/' + state.draw.id] = data;
                firebase.database().ref().update(updates);
                obj = { res, mensaje: '' };
            } else {
                obj = { res, mensaje: 'La geozona ha sido eliminada por otro usuario' };
            }
            return obj;
        } catch (e) {
            return false;
        }
    }
    checkIfUserExists(userId) {
        var usersRef = firebase.database().ref('GeoZ');
        var exists;
        usersRef.child(userId).on('value', (snapshot) => {
            exists = (snapshot.val() !== null);
        });
        return exists;
    }
    onPress(data) {
        let latitude = data.nativeEvent.coordinate.latitude;
        let longitude = data.nativeEvent.coordinate.longitude;
        let state = this.state;

        this.setState({
            ...state,
            draw: {
                id: state.draw.id,
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
                id: state.draw.id,
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
            if (!(regex_numeros).exec(_radio)) {
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
                    id: state.draw.id,
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
            showModal: !state.showModal
        });
    }
    onEditing(text, type) {
        let state = this.state;;
        switch (type) {
            case 1:
                this.setState({
                    ...state,
                    draw: {
                        id: state.draw.id,
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
                        id: state.draw.id,
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
    onChangeDrag(latlng) {
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
                    longitude: latlng.longitude,
                }
            }
        });
    }
    render() {
        const props = this.props;
        const state = this.state;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.1 }}>
                    <Header style={{ backgroundColor: "#fff", position: "absolute" }}>
                        <Left>
                            <Icon name="close" size={35} color="#000" onPress={_ => props.navigation.goBack()} style={{ marginLeft: 10 }} />
                        </Left>
                        <Body style={{ alignContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: 18, textAlign: "center" }}>Editar geozona {state.draw.Title}</Text>
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
                    <SearchBox onEditing={this.onEditing.bind(this)} state={state} />
                    <Fab
                        active={state.active}
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
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
});
const mapStateToProps = (state) => ({ crud: state.crud });

const matchDispatchToProps = (dispatch) => bindActionCreators({ editGeozona: actions.editGeozona }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(EditMap);