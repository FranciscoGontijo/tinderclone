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
    Image
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { MessageType, fetchChatMessages, updateChatAtDatabase } from '../services/api';
import useAuth from '../../hooks/useAuth';

import { useFonts } from 'expo-font';

type ChatScreenRouteProp = RouteProp<{ Chat: { userId: string, userName: string, photoUrl: string } }, 'Chat'>;

type ChatScreenProps = {
    route: ChatScreenRouteProp;
};

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
    const [chat, setChat] = useState<MessageType[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [loading, setLoading] = useState<Boolean>(true);
    //Auth Hook
    const { user, token, socket } = useAuth();

    //Use fonts
    const [fontsLoaded] = useFonts({
        'Montserrat-Medium': require('../../assets/fonts/Montserrat-Medium.ttf'),
        'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf')
    });

    //Use Ref to update database just when needed
    const chatRef = useRef(chat);
    let messagesCounter: number = 0;

    //Flat list ref to auto scroll to the bottom of the screen
    const flatListRef = useRef<FlatList | null>(null);

    //UserId is the matched user that 
    const { userId, userName, photoUrl } = route.params;
    const roomId: string = [user?._id.toString(), userId].sort().join('-');

    const controller = new AbortController();
    const navigation = useNavigation();

    let updateChatTimeout: NodeJS.Timeout;

    useEffect(() => {
        chatRef.current = chat;
        if (flatListRef.current && chat.length > 0) {
            flatListRef.current.scrollToIndex({ index: 0, animated: true });
        }
    }, [chat]);

    const getItemLayout = (data: any, index: number) => ({
        length: 40, // Adjust the value based on the actual height of your item
        offset: 40 * index,
        index,
    });

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
        flatListRef.current?.scrollToEnd({ animated: true });
        //Use socket.io to handle messages
        socket?.emit('openChat', { senderId: user?._id.toString(), recipientId: userId });

        socket?.on('Receive Message', (data: MessageType) => {
            setChat((prevChat) => [...prevChat, data]); // Update chat array with the received message
        });

        //Start timer
        startDatabaseUpdates();

        const cleanup = async () => {
            if (chatRef.current.length > messagesCounter) {
                await updateChatAtDatabase(userId, controller, token, chatRef.current);
            }
            controller.abort();
            clearTimeout(updateChatTimeout);
        };

        return () => {
            cleanup();
        };

    }, []);


    const sendMessage = (): void => {
        if (newMessage.trim() === "") {
            console.log("string is empty");
        } else {
            socket?.emit('sendMessage', { chatRoomId: roomId, message: newMessage, name: user?.name, userId: user?._id });
        }
        setNewMessage('');
    };

    if (loading || !fontsLoaded) {
        return (
            <View style={{ backgroundColor: '#13101c', flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#FF5864" />
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, }}>

            <View style={styles.header}>
                <Ionicons onPress={() => navigation.goBack()} name='chevron-back' size={45} color='#67667b' />
                <Image
                    style={styles.profileImage}
                    source={{ uri: photoUrl }} />

                <Text style={{ fontSize: 28, fontFamily: 'Quicksand-Bold', color: '#67667b' }}>{userName}</Text>
            </View>

            <View style={styles.chatView}>

                {chat && <FlatList
                    contentContainerStyle={{ flexDirection: 'column-reverse' }}
                    ref={flatListRef}
                    data={chat}
                    inverted
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {

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
                    getItemLayout={getItemLayout}
                />}

            </View>

            <KeyboardAvoidingView style={styles.textInputContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                <TextInput
                    style={styles.textInput}
                    onChangeText={setNewMessage}
                    value={newMessage}
                    onSubmitEditing={() => sendMessage()}
                    placeholder='Type a message'
                    placeholderTextColor='#67667b'
                />

                <Ionicons onPress={() => sendMessage()} color='#67667b' name='send' size={30} />
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
};

export default ChatScreen;

const styles = StyleSheet.create({
    chatView: {
        flex: 1,
        backgroundColor: '#13101c',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 10,
        paddingRight: 30,
        paddingLeft: 10,
        backgroundColor: '#13101c',
        borderBottomWidth: 1,
        borderBottomColor: '#67667b',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    chatText: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Montserrat-Medium'
    },
    chatBubbleRight: {
        backgroundColor: '#3aa3f2',
        borderBottomRightRadius: 2,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        marginBottom: 2,
        marginTop: 2,
        marginRight: 14,
        marginLeft: 44,
        alignSelf: 'flex-end',
        padding: 6,
        paddingLeft: 12,
        paddingRight: 8,

    },
    chatBubbleLeft: {
        backgroundColor: '#29282c',
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 2,
        marginBottom: 2,
        marginTop: 2,
        marginLeft: 14,
        marginRight: 44,
        alignSelf: 'flex-start',
        padding: 6,
        paddingRight: 14,
        paddingLeft: 12,
    },
    textInputContainer: {
        padding: 10,
        backgroundColor: '#13101c',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textInput: {
        height: 40,
        width: '90%',
        borderWidth: 1,
        borderColor: '#67667b',
        borderRadius: 18,
        padding: 10,
        fontSize: 20,
        alignSelf: 'center',
        color: '#fff',
        fontFamily: 'Montserrat-Medium'
    }
});