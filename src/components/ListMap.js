import React, { Component } from 'react';
import { ListView, Alert, View } from 'react-native';
import { Container, Header, Content, Button, List, ListItem, Text, Body, Right, Label } from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

import * as actions from '../redux/actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchDeleteDatos } from '../redux/async/function';
import firebase from '../redux/async/config_firebase';
class ListMap extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            basic: true,
            listViewData: this.props.crud
        };
    }
    async deleteRow(secId, rowId, rowMap, id, nombre) {
        try {
            Alert.alert(
                `Eliminar geozona ${nombre}`,
                '¿Esta seguro de eliminar esta geozona?',
                [
                    { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                    {
                        text: 'OK', onPress: () => {
                            /*let response = fetchDeleteDatos(id);
                            if (response) {
                                rowMap[`${secId}${rowId}`].props.closeRow();
                                const newData = [...this.state.listViewData];
                                newData.splice(rowId, 1);
                                this.props.removeGeozona(id);
                            } else {
                                alert("Ocurrio un problema");
                            }*/
                            try {
                                let updates = {};
                                updates['GeoZ/' + id] = null;
                                firebase.database().ref().update(updates);
                            } catch (e) {
                                alert("Ocurrio un problema");
                            }
                        }
                    },
                ],
                { cancelable: true }
            )
        } catch (e) {
            alert(e);
        }
    }
    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        const props = this.props;
        if (props.crud.filter(x => x.view).length == 0) {
            return (
                <Container>
                    <Content>
                        <List>
                            <ListItem>
                                <Text>
                                    No hay datos Disponibles
                                </Text>
                            </ListItem>
                        </List>
                    </Content>
                </Container>
            );
        }
        return (
            <Container>
                <Content>
                    <List
                        dataSource={this.ds.cloneWithRows(props.crud.filter(x => x.view))}
                        renderRow={data =>
                            <ListItem onPress={_ => {
                                props.navigation.navigate('ViewMap', {
                                    Title: data.nombre,
                                    description: data.description,
                                    latlng: {
                                        latitude: data.lat,
                                        longitude: data.lng,
                                    },
                                    radio: data.radio,
                                    tipo: data.tipo
                                })
                            }}>
                                <Body>
                                    <Text ><Label style={{ fontWeight: 'bold' }}>Id:</Label>{data.id} </Text>
                                    <Text ><Label style={{ fontWeight: 'bold' }}>Nombre:</Label>{data.nombre} </Text>
                                    <Text><Label style={{ fontWeight: 'bold' }}>Descripción:</Label>{data.description} </Text>
                                </Body>
                                <Right>
                                    <Icon name="eye" size={30} />
                                </Right>
                            </ListItem>}
                        renderLeftHiddenRow={data =>
                            <Button full onPress={_ => {
                                props.navigation.navigate('EditMap', {
                                    id: data.id,
                                    Title: data.nombre,
                                    description: data.description,
                                    latlng: {
                                        latitude: data.lat,
                                        longitude: data.lng,
                                    },
                                    radio: data.radio,
                                    tipo: data.tipo
                                })
                            }
                            }
                            >
                                <Icon active name="edit" size={30} color="#fff" />
                            </Button>}
                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                            <Button full danger onPress={_ => this.deleteRow(secId, rowId, rowMap, data.id, data.nombre)}>
                                <Icon name="trash" size={30} color="#fff" />
                            </Button>}
                        leftOpenValue={75}
                        rightOpenValue={-75}
                    />
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({ crud: state.crud });

const matchDispatchToProps = (dispatch) => bindActionCreators({ removeGeozona: actions.removeGeozona }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(ListMap);
