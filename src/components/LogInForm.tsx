import React, { useState } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface LogInProps {
    handleFormChange: () => void;
    handleSubmit: (email: String, password: String) => void;
}


const LogInForm: React.FC<LogInProps> = (props): JSX.Element => {
    const [userEmail, setUserEmail] = useState<String>('');
    const [password, setPassword] = useState<String>('');

    const { handleFormChange, handleSubmit } = props;

    return (
        <View style={styles.container} >
            <TextInput
                placeholder="email"
                onChangeText={setUserEmail}
            ></TextInput>
            <TextInput 
                placeholder="password"
                onChangeText={setPassword}></TextInput>
            <Button title="Log In" onPress={() => handleSubmit(userEmail, password)} />
            <TouchableOpacity
                onPress={handleFormChange}>
                <Text>Dont't have account? Sign In</Text>
            </TouchableOpacity>
        </View>
    )
};

export default LogInForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});