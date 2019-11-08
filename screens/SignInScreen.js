import React from 'react';
import { Text, View, TextInput, Button } from 'react-native';

import StateService from '../services/StateService'

export default class SignInScreen extends React.Component {

    initialState = () => {
      return {
        username: '',
        password: '',
        }   
    }

    state = this.initialState();

    resetState = () => this.setState(this.initialState());

    componentDidMount(){
        this.getUsername();
        // this.props.navigation.navigate('Auth');
    }

    async getUsername(){
        let username = await StateService.get('username');
        this.setState({username});
    }

    async handleSignOut(){
        await StateService.clear();
        this.resetState();
        this.props.navigation.navigate('Auth');
    }

    async handleNavHome(){
        this.props.navigation.navigate('App');
    }

    async handleSignIn(){
        let { username, password } = this.state;
        if(username.length == 0 || password.length == 0){
            console.log('missing credentials');
            alert('Username and password are required!')
            return false;
        }
        console.log('handleSignIn: ' + username );
        await StateService.set('username', username);
        this.props.navigation.navigate('App');
    }

    render(){
        if(this.state.username){
            btnText = 'Sign Out ' + this.state.username;
            return (
                <View>
                    <Button title={btnText} onPress={this.handleSignOut.bind(this)} />
                    <Button title="Back to App" onPress={this.handleNavHome.bind(this)} />
                </View>
            )
        }
        return (
            <View>
                <Text>Sign In</Text>
                <TextInput 
                    autoCapitalize='none'
                    autoCompleteType='off'
                    autoCorrect={false}
                    autoFocus={true}
                    placeholder='Username'
                    placeholderTextColor='gray'
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(val) => this.state.username = val}
                    spellCheck={false}
                    textContentType='emailAddress'
                    />
                <TextInput 
                    autoCapitalize='none'
                    autoCompleteType='off'
                    autoCorrect={false}
                    placeholder='Password'
                    placeholderTextColor='gray'
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(val) => this.state.password = val}
                    secureTextEntry={true}
                    spellCheck={false}
                    />
                <Button 
                    title='Sign In' 
                    onPress={this.handleSignIn.bind(this)} />
            </View>
        )
    }

}