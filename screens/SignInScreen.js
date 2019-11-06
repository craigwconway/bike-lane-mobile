import React from 'react';
import { Text, View, TextInput, Button, AsyncStorage } from 'react-native';

export default class SignInScreen extends React.Component {
    state = {
        username: '',
        password: '',
    }

    componentDidMount(){
        this.getUsername();
        // this.props.navigation.navigate('Auth');
    }

    async getUsername(){
      AsyncStorage.getItem('username')
        .then(val => this.setState({username: val}))
        .catch(err => alert(err));
    }

    async handleSignOut(){
        await AsyncStorage.clear();
        this.setState({username: ''});
        this.props.navigation.navigate('Auth');
    }

    async handleSignIn(){
        let { username, password } = this.state;
        if(username.length == 0 || password.length == 0){
            console.log('missing credentials');
            alert('Username and password are required!')
            return false;
        }
        console.log('handleSignIn: ' + username + ' ' + password);
        await AsyncStorage.setItem('username', username);
        this.props.navigation.navigate('App');
    }

    render(){
        if(this.state.username){
            btnText = 'Sign Out ' + this.state.username;
            return <Button title={btnText} onPress={this.handleSignOut.bind(this)} />
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