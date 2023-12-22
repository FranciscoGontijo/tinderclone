import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Text, Button, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { userType } from '../services/auth';

import { dummyData } from '../data/data';

import useAuth from '../../hooks/useAuth';
import Swiper from 'react-native-deck-swiper';

const HomeScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user, signOut, token } = useAuth();
    const controller = new AbortController();

    const [userList, setUserList] = useState<userType[] | null>(null);
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const response = await api.get('/userlist', {
                    signal: controller.signal,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                setUserList(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        setLoading(true);
        fetchUserList();
        console.log(token);
        console.log(userList);

        return () => {
            controller.abort();
        }
    }, []);

    //set loading true until userlist is returned
    //when userlist !== null, render userlist with swiper

    //Change likeUser to create the matching algorithm

    const likeUser = async (cardIndex: number) => {
        if (userList) {
            let { _id, likedList } = userList[cardIndex];

            const response = await api.put(`/likeuser/${_id}`, {}, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            });

            //Open chat with the liked user if your ID is at they liked list
            if (user) {
                const check = likedList.includes(user._id);
                console.log(check);
                navigation.navigate('Chat');
            }

            console.log("Liked " + _id);
        };
    };

    //Need to check what to do with Id
    //Need the Id to create the liked list and the matching algorithm

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

                <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                    <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
                </TouchableOpacity>

            </View>

            <View style={styles.cardsContainer}>
                {userList &&
                    <Swiper
                        containerStyle={{ backgroundColor: 'transparent' }}
                        cards={userList}
                        verticalSwipe={false}
                        onSwipedRight={(card) => likeUser(card)}
                        renderCard={(card) => {
                            return (
                                <View key={card._id} style={styles.card}>
                                    <Image
                                        source={{ uri: card.photoUrl }}
                                        resizeMode="cover"
                                        style={styles.cardImage} />
                                    <Text>{card.name}</Text>
                                </View>
                            )
                        }}
                    />}
            </View>

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
    },
    cardsContainer: {
        flex: 1,
    },
    card: {
        backgroundColor: "lightgray",
        height: '75%',
        borderRadius: 10,
        overflow: 'hidden',

    },
    cardImage: {
        height: '80%',
        width: '100%',
    }
});