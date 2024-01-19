import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import useAuth from '../../hooks/useAuth';


const Header: React.FC = () => {

    const { user, logOut } = useAuth();
    const navigation = useNavigation();

    return (
        <View style={styles.header}>

            <TouchableOpacity onPress={logOut} >
                {user && <Image
                    style={styles.profileImage}
                    source={{ uri: user.photoUrl }} />
                }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Home' as never)}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Matched' as never)}>
                <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
            </TouchableOpacity>

        </View>
    )
};

export default Header;

const styles = StyleSheet.create({
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    header: {
        height: 90,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#13101c",
    },
    logoImage: {
        height: 45,
        width: 40,
    }
});