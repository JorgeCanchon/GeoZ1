import React, { Component } from 'react';
import { View, Right, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
class Title extends Component {
    render(){
        const props = this.props;
        return(
            <Right>
                <Text style={{fontSize:20,top:10}}>{props.title}
                &nbsp;
                    <Icon name={props.icon} size={props.iconSize} color={props.iconColor} />
                </Text>
            </Right>
        )
    }
}
export default Title;