import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { handleFormChange, handleSubmit } = props;

    const togglePasswordView = () => {
        setShowPassword(!showPassword);
    }

    return (
        <View style={styles.container} >

            <View style={styles.inputContainer}>

                <Text style={{ fontSize: 23 }}>Your Name</Text>

                <View style={styles.iconContainer}>

                    <Ionicons style={{ marginRight: 4 }} name='person' size={20} />

                    <TextInput
                        style={styles.textInput}
                        placeholder='Your name'
                        onChangeText={setUserName}
                        onFocus={() => setUserNameAlert(false)}
                    />

                </View>

                {userNameAlert && <Text style={{ color: 'red' }}>Name required</Text>}

            </View>

            <View style={styles.inputContainer}>

                <Text style={{ fontSize: 23 }}>Email Address</Text>

                <View style={styles.iconContainer}>

                    <Ionicons style={{ marginRight: 4 }} name='mail-outline' size={20} />

                    <TextInput
                        style={styles.textInput}
                        placeholder="youremail@email.com"
                        onChangeText={setUserEmail}
                        onFocus={() => setEmailAlert(false)}
                    />

                </View>

                {emailAlert && <Text style={{ color: 'red' }}>Email required</Text>}

            </View>

            <View style={styles.inputContainer}>

                <Text style={{ fontSize: 23 }}>Password</Text>

                <View style={styles.passwordContainer}>

                    <View style={styles.iconContainer}>
                        <Ionicons style={{ marginRight: 4 }} name='lock-closed-outline' size={20} />

                        <TextInput
                            style={styles.textInput}
                            secureTextEntry={!showPassword}
                            placeholder="password"
                            onChangeText={setPassword}
                            onFocus={() => setPasswordAlert(false)}
                        />
                    </View>

                    {showPassword ?
                        <Ionicons onPress={togglePasswordView} name='eye' size={20} />
                        :
                        <Ionicons onPress={togglePasswordView} name='eye-off' size={20} />}

                </View>

                {passwordAlert && <Text style={{ color: 'red' }}>Password required</Text>}

            </View>

            <Pressable style={styles.signInButton} onPress={() => {
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
            }} >
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Sign In</Text>
            </Pressable>

            <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={handleFormChange}>
                <Text style={{ fontSize: 18 }}>Back to Log in</Text>
            </TouchableOpacity>

        </View>
    )
};

export default SignUpForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink'
    },
    inputContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        marginBottom: 30,
        width: '80%',
        borderRadius: 20,
        padding: 20,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between'
    },
    textInput: {
        fontSize: 20,
    },
    signInButton: {
        height: 50,
        width: '80%',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#FF5864",
        color: 'white'

    }
});