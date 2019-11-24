
import { AsyncStorage } from "react-native";

export default class StateService {

    USER_KEY = 'user';
    
    static get = async key => await AsyncStorage.getItem(key)

    static set = async (key, value) => await AsyncStorage.setItem(key, value)

    static del = async key => await AsyncStorage.removeItem(key)

    static clear = async () => await AsyncStorage.clear()

    static login = async (user) => await this.set(USER_KEY, user)
    
    static user = async () => await this.get(USER_KEY)
    
    static logout = async () => await this.del(USER_KEY)

}