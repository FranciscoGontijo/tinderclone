import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Text, Button, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
import api from '../services/api';
import { userType } from '../services/auth';

import { dummyData } from '../data/data';

import useAuth from '../../hooks/useAuth';
import Swiper from 'react-native-deck-swiper';

const HomeScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user, signOut } = useAuth();
    const controller = new AbortController();

    const [userList, setUserList] = useState<userType[] | null>(null);
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const response = await api.get('/userlist', {
                    signal: controller.signal
                });
                setUserList(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        setLoading(true);
        fetchUserList();

        return () => {
            controller.abort();
        }
    }, []);

    const likeUser = (cardIndex: number) => {
        let { id } = dummyData[cardIndex]
        console.log("Liked " + id)
    }

    return (
        <SafeAreaView>
            <View style={styles.header}>

                <TouchableOpacity onPress={signOut} >
                    <Image
                        style={styles.profileImage}
                        source={require('../../assets/profile.jpg')} />
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

            <View>
                <Text>{user?.name}</Text>
            </View>

            <View style={styles.cardsContainer}>
                <Swiper
                    containerStyle={{ backgroundColor: 'transparent' }}
                    cards={dummyData}
                    verticalSwipe={false}
                    onSwipedRight={(card) => likeUser(card)}
                    renderCard={(card) => {
                        return (
                            <View key={card.id} style={styles.card}>
                                <Image
                                    source={{ uri: card.photoURL }}
                                    resizeMode="cover"
                                    style={styles.cardImage} />
                                <Text>{card.firstName}</Text>
                            </View>
                        )
                    }}
                />
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