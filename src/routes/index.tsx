import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './stack.routes';
import { AuthProvider } from '../../hooks/useAuth';

const Router = () => {

    return (
        <NavigationContainer>
            <AuthProvider >
                <StackNavigator />
            </AuthProvider>
        </NavigationContainer>
    )
};

export default Router;