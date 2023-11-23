import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import useAuth from '../../hooks/useAuth';
import * as auth from '../services/auth';



const SignInScreen: React.FC = () => {
    const { user, setUser, signed, token, signIn } = useAuth();

    console.log(signed);

    const handleSignIn = () => {
        signIn();

    };

    return (
        <View style={styles.container}>
            <Button title="Sign In" onPress={handleSignIn} />
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