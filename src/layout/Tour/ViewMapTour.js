import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';

import { Text, View } from 'native-base';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import Title from '../../components/Title';
import Draw from '../../components/Draw';

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height ;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA ;

class ViewMapTour extends Component {
    constructor(props){
        super(props);
        this.props.screenProps.changeRouteNavigation('Tour');
    }
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerTitle:
                <View style={{ flex: 2 }}>
                    <Title title={params.Title} icon="area-chart" iconSize={28} iconColor="#000" />
                </View>
        };
    };
    render() {
        const props = this.props;
        const { params } = props.navigation.state;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.container}>
                    <MapView
                        style={styles.map}
                        region={{
                            latitude: params.latlng.latitude,
                            longitude: params.latlng.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}
                        minZoomLevel={10}
                    >
                        <Draw 
                            latlng={params.latlng}
                            Title={params.Title}
                            description={`Latitud: ${params.latlng.latitude}  Longitud: ${params.latlng.longitude}`} 
                            radio={params.radio}
                            tipo={params.tipo}
                            draggable={false}
                        />
                    </MapView>
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

export default ViewMapTour;
