import React from 'react';
import { Text, View } from 'react-native';

export default class SignOutScreen extends React.Component {
    password = '';
    state = {
        username: '',
        auth_id: '',
        refresh_id: ''
    }

    render(){
        return (
            <View>
                <Text>Sign Out</Text>
            </View>
        )
    }

}