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

    let messagesCounter: number = 0;

    const { userId } = route.params;

    const roomId: string = [user?._id.toString(), userId].sort().join('-');

    const navigation = useNavigation();
    const controller = new AbortController();

    let updateChatTimeout: NodeJS.Timeout;

    useEffect(() => {
        chatRef.current = chat;
    }, [chat]);


    const updateChatAtDatabase = async (updatedChat: MessageType[]) => {
        try {
            const response = await api.post(`/chatupdate/${userId}`, { chat: updatedChat }, {
                signal: controller.signal,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            console.log(response.data); // Assuming you want to return something from the API call
        } catch (error: any) {
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
        }
    };

    const startDatabaseUpdates = () => {
        //create an if that check if there is new messages
        if (chatRef.current.length > messagesCounter) {
            let newChatArray = chatRef.current;
            updateChatAtDatabase(newChatArray);
            messagesCounter = chatRef.current.length;
        } else {
            console.log('Not new messages, not gonna update');
        }
        updateChatTimeout = setTimeout(() => startDatabaseUpdates(), 20000);
    };

    useEffect(() => {

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
        startDatabaseUpdates();

        const cleanup = async () => {
            await updateChatAtDatabase(chatRef.current);
            controller.abort();
            clearTimeout(updateChatTimeout);
        };

        return () => {
            cleanup();
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
                    //you can update the variable here to create the blocks.
                    // if message is from the same user that last message was. push inside a block
                    //render the block instead of the item.message

                    if (user?._id === item.userId) {
                        return (
                            <View style={styles.chatBubbleRight}>
                                <Text style={styles.chatText}>{item.message}</Text>
                            </View>
                        )
                    } else {
                        return (
                            <View style={styles.chatBubbleLeft}>
                                <Text style={styles.chatText}>{item.message}</Text>
                            </View>
                        )
                    }
                }}
            />}
            <View>

                <TextInput
                    style={styles.textInput}
                    multiline={true}
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
    chatText: {
        fontSize: 16,
    },
    chatBubbleRight: {
        backgroundColor: 'lightblue',
        borderBottomRightRadius: 2,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginBottom: 4,
        marginRight: 14,
        marginLeft: 44,
        alignSelf: 'flex-end',
        padding: 5,

    },
    chatBubbleLeft: {
        backgroundColor: 'lightgray',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 2,
        marginBottom: 4,
        marginLeft: 14,
        marginRight: 44,
        alignSelf: 'flex-start',
        padding: 5,
    },
    textInput: {
        height: 36,
        width: '100%',
        borderWidth: 1,
        borderRadius: 18,
        padding: 10,
        fontSize: 16,
    }
});