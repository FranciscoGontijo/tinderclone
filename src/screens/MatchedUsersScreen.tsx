import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { fetchMatchedUsersList, MatchedUserType } from '../services/api';
import useAuth from '../../hooks/useAuth';

//import components
import Header from '../components/Header';

const MatchedUsersScreen: React.FC = () => {
    const [matchedList, setMatchedList] = useState<MatchedUserType[] | null>(null);
    const [loading, setLoading] = useState<Boolean>(true);

    const navigation = useNavigation();
    const controller = new AbortController();
    const { user, token } = useAuth();

    useEffect(() => {
        
        setLoading(true);
        fetchMatchedUsersList(controller, token, setMatchedList, setLoading);

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

            <Header />

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

