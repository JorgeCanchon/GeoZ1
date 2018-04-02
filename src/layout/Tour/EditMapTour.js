import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, Image, View, TouchableOpacity, ListView, Alert, Dimensions } from 'react-native';
import { Container, Icon as IconAwesome, Header, Content, Card, Button, Right, CardItem, Body, Fab, Item, Input, Left, Spinner, List, ListItem, Label, SwipeRow } from 'native-base';
import { copilot, walkthroughable, CopilotStep } from '@okgrow/react-native-copilot';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Draw from '../../components/Draw';
import SearchBox from '../../components/SearchBox/index';
import AlertInput from 'react-native-alert-input';

const WalkthroughableView = walkthroughable(View);
const WalkthroughableSearchBox = walkthroughable(SearchBox);

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

class EditMapTour extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 4.7524532252167075,
                longitude: -74.10342556571197,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            active: false,
            draw: {
                id: 1,
                Title: 'Casa',
                description: 'Desc',
                radio: 0,
                latlng: {
                    latitude: 4.7524532252167075,
                    longitude: -74.10342556571197,
                },
            },
            typeDrawing: 1,
            showModal: false
        };
        this.props.screenProps.changeRouteNavigation('Tour');
    }
    componentDidMount() {
        setTimeout(_ => this.props.start(), 200);
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
        this.updateMapa().then(res => {
            if (res) {
                alert("Geozona 1 editada con éxito");
                this.props.navigation.goBack();
            } else {
                alert("Error al editar la geozona 1");
            }
        });
    }
    async  updateMapa() {
        return true;
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
    render() {
        const props = this.props;
        return (
            <View style={{ flex: 1 }}>
                <CopilotStep
                    text={`Encabezado \n\nEn la parte izquierda encontrará un botón el cuál cierra la ventana actual, en el otro extremo esta el botón de envío de la geozona.`}
                    order={1} name="openApp">
                    <WalkthroughableView style={{ flex: 0.15 }}>
                        <Header style={{ backgroundColor: "#fff", position: "absolute" }}>
                            <Left>
                                <Icon name="close" size={35} color="#000" onPress={_ => this.props.navigation.goBack()} style={{ marginLeft: 10 }} />
                            </Left>
                            <Body style={{ alignContent: "center", alignItems: "center" }}>
                                <Text style={{ fontSize: 17, textAlign: "center" }}>Editar geozona 1 </Text>
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
                    </WalkthroughableView>
                </CopilotStep>
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <Container>
                        <Content>
                            <CopilotStep
                                text={`Formulario \n\nEn la primera parte encuentra dos campos de texto, el primero nombre de geozona, \neste campo no admite números, ni caracteres especiales y solo 50 caracteres, `}
                                order={2} name="stepTwo">
                                <WalkthroughableView style={{ width: '100%', height: 350 }}>
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
                                    <View style={{flex:1}}>
                                        <CopilotStep
                                            text={`Formulario \n\nel segundo campo descripción admite caracteres alfanumericos y solo 300 caracteres. `}
                                            order={3} name="stepThree">
                                            <WalkthroughableSearchBox onEditing={this.onEditing.bind(this)} state={this.state} />
                                        </CopilotStep>
                                    </View>
                                </WalkthroughableView>
                            </CopilotStep>
                        </Content>
                    </Container>
                </View>
                <View style={{ flex: 0.49, flexDirection: 'row' }}>
                    <View style={{ width: 270, height: 'auto', backgroundColor: '#fff' }} >
                    </View>
                    <CopilotStep
                        text={`Formulario \n\nEn la segunda parte puede seleccionar un tipo de geozona, después de haberlo seleccionado debe tocar el punto en el mapa donde quiere que se represente.`}
                        order={4} name="stepFour">
                        <WalkthroughableView style={{ flex: 1, backgroundColor: '#fff' }}>
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
                        </WalkthroughableView>
                    </CopilotStep>
                </View>
            </View >
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

EditMapTour.propTypes = {
    start: PropTypes.func.isRequired,
};
export default copilot()(EditMapTour);