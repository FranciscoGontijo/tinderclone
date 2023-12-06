import React, { useState } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface SignInPropsType {
    handleFormChange: () => void;
    handleSubmit: (name: String, email: String, password: String) => void;
}

const SignInForm: React.FC<SignInPropsType> = (props): JSX.Element => {
    const [userName, setUserName] = useState<String>('')
    const [userEmail, setUserEmail] = useState<String>('');
    const [password, setPassword] = useState<String>('');

    const { handleFormChange, handleSubmit } = props;

    //alert about input field emptyness

    return (
        <View style={styles.container} >
            <TextInput
                placeholder='name'
                onChangeText={setUserName}
            />
            <TextInput
                placeholder="email"
                onChangeText={setUserEmail}
            />
            <TextInput
                placeholder="password"
                onChangeText={setPassword}></TextInput>
            <Button title="Sign In" onPress={() => handleSubmit(userName, userEmail, password)} />
            <TouchableOpacity
                onPress={handleFormChange}>
                <Text>Back to Log in</Text>
            </TouchableOpacity>
        </View>
    )
};

export default SignInForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});