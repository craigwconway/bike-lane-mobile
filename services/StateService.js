
import { AsyncStorage } from "react-native";

export default class StateService {
    
    static get = async key => await AsyncStorage.getItem(key)

    static set = async (key, value) => await AsyncStorage.setItem(key, value)

    static del = async key => await AsyncStorage.removeItem(key)

    static clear = async () => await AsyncStorage.clear()
}