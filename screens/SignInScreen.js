import React from 'react';
import { View } from 'react-native';
import { Button, CheckBox, Input, Text, ThemeProvider } from 'react-native-elements';

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
            return <Button title="Back to App" onPress={this.handleNavHome.bind(this)} />
        }
        return (
            <View style={{margin: 20}}>
                <Text h4 style={{marginBottom: 20, textAlign: 'center'}}>Sign In</Text>
                <Input 
                    autoCapitalize='none'
                    autoCompleteType='off'
                    autoCorrect={false}
                    autoFocus={true} 
                    placeholder='Username'
                    placeholderTextColor='gray'
                    style={{ marginBottom: 20 }}
                    onChangeText={(val) => this.state.username = val}
                    spellCheck={false}
                    textContentType='emailAddress'
                    />
                <Input 
                    autoCapitalize='none'
                    autoCompleteType='off'
                    autoCorrect={false}
                    placeholder='Password'
                    placeholderTextColor='gray'
                    style={{ marginBottom: 20 }}
                    onChangeText={(val) => this.state.password = val}
                    secureTextEntry={true}
                    spellCheck={false}
                    />
                <Button 
                    title='Sign In' 
                    onPress={this.handleSignIn.bind(this)} 
                    buttonStyle={{marginTop: 30}}/>
            </View>
        )
    }

}

SignInScreen.navigationOptions = {
  title: 'Glass in the Bike Lane',
};