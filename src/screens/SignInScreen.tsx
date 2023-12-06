import React, { useState } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../../hooks/useAuth';
import * as auth from '../services/auth';

import LogInForm from '../components/LogInForm';
import SignInForm from '../components/SignInForm';



const SignInScreen: React.FC = () => {

    const [formType, setFormType] = useState<String>('login');

    const { user, signed, signIn } = useAuth();
    
    const handleFormChange = () => {
      
    }

    // console.log(signed);
    // console.log(user);
    const handleLogIn = (email: String, password: String): void => {
        // try to log in
        console.log(email);
        console.log(password);

    }

    const handleSignIn = (name: String, email: String, password: String): void => {

        // try to sign in
        signIn();
    };

    return (
        <View style={styles.container} >
            <LogInForm
            handleFormChange={handleFormChange}
            handleSubmit={handleLogIn} />
            <SignInForm
            handleFormChange={handleFormChange}
            handleSubmit={handleSignIn} />
        </View>
    )
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});