import React, { useState } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../../hooks/useAuth';
import * as auth from '../services/auth';

import LogInForm from '../components/LogInForm';
import SignInForm from '../components/SignInForm';



const SignInScreen: React.FC = () => {

    const [formType, setFormType] = useState<String>('login');

    const { user, signed, logIn } = useAuth();

    const handleFormChange = () => {
        //change form when press button. if login go to signin if signin go to login
        if (formType === 'login') {
            setFormType('signin')
        } else {
            setFormType('login');
        }
        console.log(formType);
    };

    // console.log(signed);
    // console.log(user);
    const handleLogIn = (email: String, password: String): void => {
        // try to log in
        logIn(email, password);
        console.log(email);
        console.log(password);
    }

    const handleSignIn = (name: String, email: String, password: String): void => {

        // try to sign in
    };

    return (
        <View style={styles.container} >
            {formType === 'login' && <LogInForm
                handleFormChange={handleFormChange}
                handleSubmit={handleLogIn} />}
            {formType === 'signin' && <SignInForm
                handleFormChange={handleFormChange}
                handleSubmit={handleSignIn} />}
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