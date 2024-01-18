import React, { useState, useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RouteProp } from '@react-navigation/native';

import { MessageType, fetchChatMessages, updateChatAtDatabase } from '../services/api';
import useAuth from '../../hooks/useAuth';

//import components
import Header from '../components/Header';

type ChatScreenRouteProp = RouteProp<{ Chat: { userId: string } }, 'Chat'>;

type ChatScreenProps = {
    route: ChatScreenRouteProp;
};

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
    const [chat, setChat] = useState<MessageType[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [loading, setLoading] = useState<Boolean>(true);
    //Auth Hook
    const { user, token, socket } = useAuth();

    //Use Ref to update database just when needed
    const chatRef = useRef(chat);
    let messagesCounter: number = 0;

    //UserId is the matched user that 
    const { userId } = route.params;
    const roomId: string = [user?._id.toString(), userId].sort().join('-');

    const controller = new AbortController();

    let updateChatTimeout: NodeJS.Timeout;

    useEffect(() => {
        chatRef.current = chat;
    }, [chat]);

    const startDatabaseUpdates = () => {
        //create an if that check if there is new messages
        if (chatRef.current.length > messagesCounter) {
            let newChatArray = chatRef.current;
            updateChatAtDatabase(userId, controller, token, newChatArray);
            messagesCounter = chatRef.current.length;
        } 
        updateChatTimeout = setTimeout(() => startDatabaseUpdates(), 20000);
    };

    useEffect(() => {

        setLoading(true);

        fetchChatMessages(userId, controller, token, setChat, setLoading);

        //Use socket.io to handle messages
        socket?.emit('openChat', { senderId: user?._id.toString(), recipientId: userId });

        socket?.on('Receive Message', (data: MessageType) => {
            setChat((prevChat) => [...prevChat, data]); // Update chat array with the received message
        });

        //Start timer
        startDatabaseUpdates();

        const cleanup = async () => {
            await updateChatAtDatabase(userId, controller, token, chatRef.current);
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
        <SafeAreaView style={{flex: 1,}}>

            <Header />

            <View style={styles.chatView}>

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

            </View>

            <KeyboardAvoidingView style={styles.textInputContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                <TextInput
                    style={styles.textInput}
                    onChangeText={setNewMessage}
                    value={newMessage}
                    onSubmitEditing={() => sendMessage()}
                    placeholder='Type a message'
                />

            </KeyboardAvoidingView>

            <View style={styles.chatFooter} />

        </SafeAreaView>
    )
};

export default ChatScreen;

const styles = StyleSheet.create({
    chatView: {
        //Need to apply scroll to chat 
        flex: 1,

    },
    chatText: {
        fontSize: 20,
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
    textInputContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderColor: '#666',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        height: 36,
        width: '100%',
        borderWidth: 1,
        borderRadius: 18,
        padding: 10,
        fontSize: 16,
        alignSelf: 'center',
    },
    chatFooter: {
        height: 36,
        width: '100%',
        borderTopWidth: 1,
    }
});