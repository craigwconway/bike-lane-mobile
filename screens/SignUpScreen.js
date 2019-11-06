import React from 'react';
import { Text, View } from 'react-native';

export default class SignUpScreen extends React.Component {
    password = '';
    state = {
        username: '',
        conf_code: ''
    }

    render(){
        return (
            <View>
                <Text>Sign Up</Text>
            </View>
        )
    }

}