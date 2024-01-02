import React, { useState, useEffect } from 'react';
import { Button, View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import io, { Socket } from 'socket.io-client';
import api from '../services/api';
import useAuth from '../../hooks/useAuth';


type MessageType = {
    user: string,
    message: string
}

type ChatScreenRouteProp = RouteProp<{ Chat: { userId: string } }, 'Chat'>;
type ChatScreenProps = {
    route: ChatScreenRouteProp;
};
//pass likedUserId through props and make a get request to get chat messages

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
    const [chat, setChat] = useState<MessageType[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);


    const { userId } = route.params;

    const { user, signOut, token } = useAuth();
    const navigation = useNavigation();
    const controller = new AbortController();

    useEffect(() => {
        //get messages and update chat array using userId and likedUserId
        const fetchChatMessages = async () => {
            try {
                const response = await api.get(`/chat/${userId}`, {
                    signal: controller.signal,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                console.log(response.data);
                setChat(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchChatMessages();

        const newSocket = io("http://192.168.1.107:8080");
        setSocket(newSocket);

        newSocket.on('receive message', (data: MessageType) => {
            setChat((prevChat) => [...prevChat, data]); // Update chat array with the received message
        });

        return () => {
            if (socket) {
                socket.disconnect(); // Disconnect the socket when the component unmounts
            }
            controller.abort();
            //use axios to update chat array at db when
        };

    }, []);


    const sendMessage = () => {
        socket?.emit("send message", { message: newMessage, user: user?._id });
        socket?.emit("user", user);
        setNewMessage('');
    }


    return (
        <SafeAreaView>
            <View style={styles.header}>

                <TouchableOpacity onPress={signOut} >
                    {user && <Image
                        style={styles.profileImage}
                        source={{ uri: user.photoUrl }} />
                    }
                </TouchableOpacity>

                <TouchableOpacity>
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
            {chat && <FlatList
                data={chat}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.user}</Text>
                        <Text>{item.message}</Text>
                    </View>
                )} />}
            <View>

                <TextInput
                    onChangeText={setNewMessage}
                    value={newMessage}
                    onSubmitEditing={() => sendMessage()}
                />

            </View>
            <Button title={'hi'} onPress={() => console.log(userId)}/>
        </SafeAreaView>
    )
};

export default ChatScreen;

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