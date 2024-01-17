import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchUserList, likeUser } from '../services/api';
import { UserType } from '../services/auth';

import useAuth from '../../hooks/useAuth';
import Swiper from 'react-native-deck-swiper';

//import components
import Header from '../components/Header';

const HomeScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user, logOut, token } = useAuth();
    const controller = new AbortController();

    const [userList, setUserList] = useState<UserType[] | null>(null);
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {

        setLoading(true);
        fetchUserList(controller, token, setUserList, setLoading);

        return () => {
            controller.abort();
        }
    }, []);

    const handleLike = async (cardIndex: number) => {
        if (userList) {
            let { _id, likedList } = userList[cardIndex];

            await likeUser(token, _id)

            if (user) {
                const check = likedList.includes(user._id);
                if (check) navigation.navigate('Matched' as never);
            }
            console.log("Liked " + _id);
        };
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

            <Header />

            <View style={styles.cardsContainer}>
                {userList &&
                    <Swiper
                        containerStyle={{ backgroundColor: 'transparent' }}
                        cards={userList}
                        verticalSwipe={false}
                        onSwipedRight={(card) => handleLike(card)}
                        renderCard={(card) => {
                            return (
                                <View key={card._id} style={styles.card}>
                                    <Image
                                        source={{ uri: card.photoUrl }}
                                        resizeMode="cover"
                                        style={styles.cardImage} />
                                    <Text style={styles.cardText}>{card.name}</Text>
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
    },
    cardText: {
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 30,
        marginTop: 10,
    }
});