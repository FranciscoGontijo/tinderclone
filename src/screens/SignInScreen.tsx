import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import useAuth from '../../hooks/useAuth';

import LogInForm from '../components/LogInForm';
import SignUpForm from '../components/SignUpForm';



const SignInScreen: React.FC = () => {
    const [formType, setFormType] = useState<string>('login');
    const { logIn, signUp, setLoading } = useAuth();

    const handleFormChange = () => {
        //change form when press button. if login go to signin if signin go to login
        if (formType === 'login') {
            setFormType('signin')
        } else {
            setFormType('login');
        }
    };

    const handleLogIn = async (email: string, password: string): Promise<void> => {
        setLoading(true);
        await logIn(email, password);
        setLoading(false);
    }

    const handleSignUp = async (name: string, email: string, password: string): Promise<void> => {
        setLoading(true)
        await signUp(name, email, password);
        setLoading(false);
    };

    return (
        <View style={styles.container} >
            {formType === 'login' && <LogInForm
                handleFormChange={handleFormChange}
                handleSubmit={handleLogIn} />}
            {formType === 'signin' && <SignUpForm
                handleFormChange={handleFormChange}
                handleSubmit={handleSignUp} />}
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