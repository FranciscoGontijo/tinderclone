import React from 'react';
import { SafeAreaView, Text, Button, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';

import useAuth from '../../hooks/useAuth';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { setUser } = useAuth();

    const logout = () => {
        setUser(null);
    }

    return (
        <SafeAreaView>
            <View style={styles.header}>

                <TouchableOpacity onPress={logout} >
                    <Image
                        style={styles.profileImage}
                        source={require('../../assets/profile.jpg')} />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                    <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
                </TouchableOpacity>

            </View>

            <Text>I am Home Screen</Text>

            <Button title="Logout" onPress={logout} />
            
        </SafeAreaView>
    )
};

export default HomeScreen;

const styles = StyleSheet.create({
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    header: {
        height: 70,
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    logoImage: {
        height: 45,
        width: 40,
    }
});