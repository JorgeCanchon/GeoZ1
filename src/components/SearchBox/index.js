import React, { Component } from 'react';
import { Text, TextInput } from 'react-native';
import styles from './SearchBoxStyles';
import { View, InputGroup, Input } from 'native-base';

export class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textT: props.state.draw.Title,
            textD: props.state.draw.description
        };
    }
    render() {
        let state = this.state;
        return (
            <View style={styles.searchBox}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Nombre geozona</Text>
                    <InputGroup>
                        <TextInput
                            multiline={true}
                            maxLength={50}
                            numberOfLines={1}
                            style={styles.inputSearch}
                            onChangeText={text => { this.setState({ textT: text }); this.props.onEditing(text, 1) }}
                            value={state.textT}
                        />
                    </InputGroup>
                </View>
                <View style={styles.secondInputWrapper}>
                    <Text style={styles.label}>Descripción</Text>
                    <InputGroup>
                        <TextInput
                            multiline={true}
                            minLength={1}
                            maxLength={300}
                            numberOfLines={1}
                            style={styles.inputSearch}
                            onChangeText={text => { this.setState({ textD: text }); this.props.onEditing(text, 2)}}
                            value={state.textD}
                        />
                    </InputGroup>
                </View>
            </View>
        );
    }
}

export default SearchBox;