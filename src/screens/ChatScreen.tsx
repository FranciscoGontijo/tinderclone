import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import api from '../services/api';
import useAuth from '../../hooks/useAuth';


type MessageType = {
    name: string,
    message: string,
    userId: string
}

type ChatScreenRouteProp = RouteProp<{ Chat: { userId: string } }, 'Chat'>;

type ChatScreenProps = {
    route: ChatScreenRouteProp;
};

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
    const [chat, setChat] = useState<MessageType[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [loading, setLoading] = useState<Boolean>(true);

    const { user, logOut, token, socket } = useAuth();

    const chatRef = useRef(chat);

    const { userId } = route.params;

    const roomId = [user?._id.toString(), userId].sort().join('-');

    const navigation = useNavigation();
    const controller = new AbortController();

    let updateChatTimeout: NodeJS.Timeout;

    useEffect(() => {
        chatRef.current = chat;
    }, [chat]);

    const updateChatAtDatabase = async (updatedChat: MessageType[]) => {
        try {
            console.log('Trying to update:');
            console.log(updatedChat);
            const response = await api.post(`/chatupdate/${userId}`, { chat: updatedChat }, {
                signal: controller.signal,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            console.log(response.data); // Assuming you want to return something from the API call
        } catch (error) {
            if (error.name === 'AbortError') {
                // Handle the cancellation error if needed
                console.log('Request canceled:', error.message);
            } else if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                // Handle network errors or failed fetch request
                console.log('Network error:', error.message);
            } else {
                // Handle other API errors
                console.log('API error:', error.message);
            }
            // Prevent unhandled promise rejections by catching and handling the error
            // You can choose to handle it here or rethrow it to be caught elsewhere
        }
    };

    const updateChatMessages = () => {
        
        const performUpdate = () => {
            let newChatArray = chatRef.current;
            updateChatAtDatabase(newChatArray); // Pass the updated chat array
            updateChatTimeout = setTimeout(() => performUpdate(), 20000);
        };

        performUpdate();
    };

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
                console.log('Fetching chat' + response.data);
                setChat(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                throw error;
            }
        };
        setLoading(true);
        fetchChatMessages();

        //Use socket.io to handle messages
        socket?.emit('openChat', { senderId: user?._id.toString(), recipientId: userId });

        socket?.on('Receive Message', (data: MessageType) => {
            setChat((prevChat) => [...prevChat, data]); // Update chat array with the received message
        });

        //Start timer
        updateChatMessages();

        return () => {
            controller.abort();
            clearTimeout(updateChatTimeout); // Clear the timeout when the component unmounts
        };

    }, []);


    const sendMessage = (): void => {
        socket?.emit('sendMessage', { chatRoomId: roomId, message: newMessage, name: user?.name, userId: user?._id });
        setNewMessage('');
    };

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
            {chat && <FlatList
                data={chat}
                renderItem={({ item }) => {
                    if (user?._id === item.userId) {
                        return (
                            <View>
                                <Text style={{ alignSelf: 'flex-end' }}>{item.name}</Text>
                                <Text style={{ alignSelf: 'flex-end' }}>{item.message}</Text>
                            </View>
                        )
                    } else {
                        return (
                            <View>
                                <Text style={{ alignSelf: 'flex-start' }}>{item.name}</Text>
                                <Text style={{ alignSelf: 'flex-start' }}>{item.message}</Text>
                            </View>
                        )
                    }
                }}
            />}
            <View>

                <TextInput
                    style={styles.textInput}
                    onChangeText={setNewMessage}
                    value={newMessage}
                    onSubmitEditing={() => sendMessage()}
                    placeholder='Send Message'
                />

            </View>
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
    },
    textInput: {
        height: 30,
        width: '100%',
        borderWidth: 1,
        borderRadius: 15,
        paddingLeft: 10,
    }
});