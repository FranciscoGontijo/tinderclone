import React, { useState } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface LogInProps {
    handleFormChange: () => void;
    handleSubmit: (email: String, password: String) => void;
}


const LogInForm: React.FC<LogInProps> = (props): JSX.Element => {
    const [userEmail, setUserEmail] = useState<String>('');
    const [password, setPassword] = useState<String>('');
    const [emailAlert, setEmailAlert] = useState<Boolean>(false);
    const [passwordAlert, setPasswordAlert] = useState<Boolean>(false);

    const { handleFormChange, handleSubmit } = props;

    return (
        <View style={styles.container} >
            
            <TextInput
                placeholder="email"
                onChangeText={setUserEmail}
                onFocus={() => setEmailAlert(false)}
            />

            {emailAlert && <Text style={{ color: 'red' }}>Email required</Text>}

            <TextInput
                placeholder="password"
                onChangeText={setPassword}
                onFocus={() => setPasswordAlert(false)}
            />

            {passwordAlert && <Text style={{ color: 'red' }}>Password required</Text>}

            <Button title="Log In" onPress={() => {
                if (!userEmail) {
                    setEmailAlert(true);
                }
                if (!password) {
                    setPasswordAlert(true);
                }
                if (userEmail && password) {
                    handleSubmit(userEmail, password)
                }
            }} />

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