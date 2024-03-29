import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useAuth from "../../hooks/useAuth";

import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import LoginScreen from "../screens/LoginScreen";
import SignInScreen from "../screens/SignInScreen";
import MatchedUsersScreen from "../screens/MatchedUsersScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    const { user } = useAuth();

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>

            {user ? (
                <>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Matched" component={MatchedUsersScreen} />
                    <Stack.Screen name="Chat" component={ChatScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                </>
            )}
            
        </Stack.Navigator>
    )
};

export default StackNavigator;