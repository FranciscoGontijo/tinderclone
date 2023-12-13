import React, { useState } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet } from 'react-native';


interface SignUpPropsType {
    handleFormChange: () => void;
    handleSubmit: (name: string, email: string, password: string) => void;
}

const SignUpForm: React.FC<SignUpPropsType> = (props): JSX.Element => {
    const [userName, setUserName] = useState<string>('')
    const [userEmail, setUserEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [userNameAlert, setUserNameAlert] = useState<Boolean>(false);
    const [emailAlert, setEmailAlert] = useState<Boolean>(false);
    const [passwordAlert, setPasswordAlert] = useState<Boolean>(false);

    const { handleFormChange, handleSubmit } = props;

    //alert about input field emptyness

    return (
        <View style={styles.container} >

            <TextInput
                placeholder='name'
                onChangeText={setUserName}
                onFocus={() => setUserNameAlert(false)}
            />

            {userNameAlert && <Text style={{ color: 'red' }}>Name required</Text>}

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

            <Button title="Sign In" onPress={() => {
                if (!userName) {
                    setUserNameAlert(true)
                }
                if (!userEmail) {
                    setEmailAlert(true);
                }
                if (!password) {
                    setPasswordAlert(true);
                }
                if (userName && userEmail && password) {
                    handleSubmit(userName, userEmail, password)
                }
            }} />

            <TouchableOpacity
                onPress={handleFormChange}>
                <Text>Back to Log in</Text>
            </TouchableOpacity>

        </View>
    )
};

export default SignUpForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});