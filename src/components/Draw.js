import React, { Component } from 'react';
import { Marker, Polygon, Circle } from 'react-native-maps';
class Draw extends Component {
    render() {
        const props = this.props;
        switch (props.tipo) {
            case 1:
                return (
                    <Marker
                        coordinate={props.latlng}
                        title={props.Title}
                        description={props.description}
                        draggable={props.draggable}
                        onDragEnd={e => props.onChangeDrag(e.nativeEvent.coordinate)}
                    />
                )
            case 2:
                return (
                    <Circle
                        center={props.latlng}
                        radius={props.radio}
                        fillColor="rgba(0,0,255,0.2)"
                        strokeColor="orange"
                        strokeWidth={2}
                        draggable={props.draggable}
                    />
                )
            default:
                return null;
        }
    }
}
export default Draw;