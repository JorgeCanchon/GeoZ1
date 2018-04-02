import React from "react";
import { AppRegistry, Image, StatusBar, BackHandler } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";
import image from '../images/image.jpg';
import { connect } from 'react-redux';
import * as actions from '../redux/actions/index';
import { bindActionCreators } from 'redux';

class SideBar extends React.Component {
    constructor(props){
        super(props);
    }
    onExit(){
        this.props.emptyGeozona();
        BackHandler.exitApp();
    }
    render() {
        return (
            <Container>
                <Content>
                    <Image
                        source={require('../images/image.jpg')}
                        style={{
                            height: 120,
                            width: 'auto',
                            alignSelf: "stretch",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        resizeMode="stretch"
                    >
                    </Image>
                    <List>
                        <ListItem onPress={() => { this.props.navigation.navigate('Intro',{...this.props}) }}>
                            <Text>Ayuda</Text>
                        </ListItem>
                        <ListItem onPress={ _ => this.onExit() } > 
                            <Text>Salir</Text>
                        </ListItem>
                    </List>    
                </Content>
            </Container>
                );
            }
}
const mapStateToProps = (state) => ({ crud: state.crud });

const matchDispatchToProps = (dispatch) => bindActionCreators({ emptyGeozona: actions.emptyGeozona }, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(SideBar);