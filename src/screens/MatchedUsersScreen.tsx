import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import api from '../services/api';
import useAuth from '../../hooks/useAuth';

type MatchedUserType = {
    name: string;
    photoUrl: string;
    _id: string,
    lastMessage: {
        message: string,
        sender: string
    }
}


const MatchedUsersScreen: React.FC = () => {
    const [matchedList, setMatchedList] = useState<MatchedUserType[] | null>(null);
    const [loading, setLoading] = useState<Boolean>(true);

    const navigation = useNavigation();
    const controller = new AbortController();
    const { user, logOut, token } = useAuth();

    useEffect(() => {
        const fetchMatchedUsersList = async () => {
            try {
                const response = await api.get('/matchedlist', {
                    signal: controller.signal,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
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

    //Real time update last message


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
                    <TouchableOpacity onPress={() => navigation.navigate('Chat', { userId: item._id })}>
                        <View style={styles.chatContainer}>

                            <Image
                                style={styles.chatImage}
                                source={{ uri: item.photoUrl }}
                            />

                            <View style={styles.chatTextContainer}>

                                <Text style={{ fontWeight: 'bold', marginLeft: 20, fontSize: 20, width: '100%' }}>{item.name}</Text>

                                {item.lastMessage.message === 'No messages yet' ?
                                    <View>
                                        <Text style={{ marginLeft: 40, fontSize: 18, color: "#666", marginTop: 10,}}>Say hello!</Text>
                                    </View>
                                    :
                                    <View style={styles.lastMessageContainer}>
                                        {item.lastMessage.sender !== user?._id ? <Ionicons name="return-down-forward-outline" size={30} color="#666" /> : <Ionicons name="return-up-back-outline" size={30} color="#666" />}
                                        <Text 
                                        style={{ marginLeft: 10, fontSize: 18, color: "#666", maxWidth: 250 }}
                                        ellipsizeMode='tail'
                                        numberOfLines={1}>{item.lastMessage.message}</Text>
                                    </View>
                                }

                            </View>

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
        height: 90,
        display: 'flex',
        flexDirection: 'row',
        marginTop: 15,
    },
    chatImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginLeft: 20
    },
    chatTextContainer: {
        display: 'flex',
        flexDirection: 'column',
        borderBottomWidth: 1.5,
        borderColor: '#666',
        width: '100%',
        overflow: 'hidden',

    },
    lastMessageContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 20,
        paddingTop: 5,
        width: '80%',
    }
});

