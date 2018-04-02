import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, Image, View, TouchableOpacity, ListView, Alert } from 'react-native';
import { Container, Icon as IconAwesome, Header, Content, Card, Button, Right, CardItem, Body, Fab, Item, Input, Left, Spinner, List, ListItem, Label, SwipeRow } from 'native-base';
import { copilot, walkthroughable, CopilotStep } from '@okgrow/react-native-copilot';
import Icon from 'react-native-vector-icons/FontAwesome';

const WalkthroughableView = walkthroughable(View);

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class Intro extends Component {
    constructor(props){
        super(props);
        this.props.screenProps.changeRouteNavigation('Intro');
    }
    componentDidMount(){
       setTimeout(_ =>this.props.start(),200);
    }
    render() {
        const props = this.props;
        return (
            <View style={{ flex: 1 }}>
                <CopilotStep 
                text={`Barra de búsqueda \n\nEncuentra coincidencias dentro de los nombres de las geozonas acordes al texto ingresado.\nEn la parte derecha de la caja de texto encontrará un botón el cuál borra el texto actual y muestra toda la información disponible.`}
                order={1} name="stepOne">
                    <WalkthroughableView style={{ flex: 0.115,backgroundColor: '#fff' }}>
                        <Header searchBar rounded style={{ backgroundColor: '#000', width: '100%' }}>
                            <Left>
                                <Button transparent>
                                    <IconAwesome name="menu" />
                                </Button>
                            </Left>
                            <Item>
                                <Input placeholder="Search" />
                                <IconAwesome name="refresh" />
                            </Item>
                        </Header>
                    </WalkthroughableView>
                </CopilotStep>
                <View style={{ flex: 1 }}>
                    <Container>
                        <Content>
                            <CopilotStep 
                            text={`Lista geozonas\n\nCada elemento ofrece la posibilidad de ver, editar y eliminar la geozona correspondiente.\nPresionando el elemento abre una ventana en la cuál visualizará la geozona.\nDeslizando a la derecha podrá ver un botón azul que lo dirigirá a la ventana de edición de esta geozona.\nDeslizando a la izquierda podrá ver un botón rojo que le dará la opción de eliminar la geozona.`}
                            order={2} name="stepTwo">
                                <WalkthroughableView style={{ flex: 0.25 }}>
                                    <List
                                        dataSource={ds.cloneWithRows([{ "id": 1, "nombre": "Casa", "description": "Desc" },])}
                                        renderRow={data =>
                                            <ListItem
                                            onPress={_ => {
                                                props.navigation.navigate('ViewMapTour', {
                                                    Title: data.nombre,
                                                    description: data.description,
                                                    latlng: {
                                                        latitude: 4.7524532252167075,
                                                        longitude: -74.10342556571197,
                                                    },
                                                    radio: 0,
                                                    tipo: 1
                                                })
                                            }}
                                            >
                                                <Body>
                                                    <Text><Label style={{ fontWeight: 'bold' }}>Id:</Label>{data.id} </Text>
                                                    <Text><Label style={{ fontWeight: 'bold' }}>Nombre:</Label>{data.nombre} </Text>
                                                    <Text><Label style={{ fontWeight: 'bold' }}>Descripción:</Label>{data.description} </Text>
                                                </Body>
                                                <Right>
                                                    <Icon name="eye" size={30} />
                                                </Right>
                                            </ListItem>}
                                        renderLeftHiddenRow={data =>
                                            <Button full onPress={_ => props.navigation.navigate('EditMapTour')}>
                                                <Icon active name="edit" size={30} color="#fff" />
                                            </Button>}
                                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                                            <Button full danger
                                                onPress={_ =>
                                                    Alert.alert(
                                                        `Eliminar geozona ${data.id}`,
                                                        '¿Esta seguro de eliminar esta geozona?',
                                                        [
                                                            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                                                            {
                                                                text: 'OK', onPress: () => { }
                                                            },
                                                        ],
                                                        { cancelable: true }
                                                    )
                                                }
                                            >
                                                <Icon name="trash" size={30} color="#fff" />
                                            </Button>}
                                        leftOpenValue={75}
                                        rightOpenValue={-75}
                                    />
                                </WalkthroughableView>
                            </CopilotStep>
                        </Content>
                    </Container>
                </View>
                <View style={{ flex: 0.17, flexDirection: 'row' }}>
                    <View style={{ width: 280, height: 50 }} >
                    </View>
                    <CopilotStep 
                    text={`Botón flotante\n\nAbre la ventana de agregar geozona.`} 
                        order={3} name="stepThree">
                        <WalkthroughableView style={{ flex: 1 }}>
                            <Fab
                                containerStyle={{}}
                                style={{ backgroundColor: '#5067FF' }}
                                position="bottomRight" onPress={() => { props.navigation.navigate('AddMapTour') }}>
                                <Text>+</Text>
                            </Fab>
                        </WalkthroughableView>
                    </CopilotStep>
                </View>
            </View >
        );
    }
}
Intro.propTypes = {
    start: PropTypes.func.isRequired,
};
export default copilot()(Intro);

