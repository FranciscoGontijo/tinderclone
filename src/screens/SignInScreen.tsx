import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import useAuth from '../../hooks/useAuth';
import * as auth from '../services/auth';



const SignInScreen: React.FC = () => {
    const { user, signed, signIn } = useAuth();

    console.log(signed);
    console.log(user);

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