import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, SafeAreaView, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import api from '../services/api';
import useAuth from '../../hooks/useAuth';

type MatchedUserType = {
    name: string;
    photoUrl: string;
    _id: string
}

const MatchedUsersScreen: React.FC = () => {
    const [matchedList, setMatchedList] = useState<MatchedUserType[] | null>(null);
    const [loading, setLoading] = useState<Boolean>(true);

    const navigation = useNavigation();
    const controller = new AbortController();
    const { user, logOut, token } = useAuth();


    //import matched list and display as a flat list with last message displayed underneath the user name
    useEffect(() => {
        const fetchMatchedUsersList = async () => {
            try {
                const response = await api.get('/matchedlist', {
                    signal: controller.signal,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                console.log(response.data);
                setMatchedList(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        setLoading(true);
        fetchMatchedUsersList();

        return () => {
            controller.abort();
        }
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#666" />
            </View>
        );
    };

    return (
        <SafeAreaView>
            <View style={styles.header}>

                <TouchableOpacity onPress={logOut} >
                    {user && <Image
                        style={styles.profileImage}
                        source={{ uri: user.photoUrl }} />
                    }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Matched')}>
                    <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
                </TouchableOpacity>

            </View>

            {matchedList && <FlatList
                data={matchedList}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Chat', { userId: item._id})}>
                        <View style={styles.chatContainer}>
                            <Image
                                style={styles.chatImage}
                                source={{ uri: item.photoUrl }} />
                            <Text>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                )} />}

        </SafeAreaView>
    )
};

export default MatchedUsersScreen;


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
    },
    chatContainer: {
        height: 60,
        border: '1px solid black',
        display: 'flex',
        flexDirection: 'row',
        marginTop: 30,
    },
    chatImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginLeft: 20
    }
});
