import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { fetchUserList, likeUser } from '../services/api';
import { UserType } from '../services/auth';

import useAuth from '../../hooks/useAuth';
import Swiper from 'react-native-deck-swiper';
import { useFonts } from 'expo-font';

//import components
import Header from '../components/Header';

const HomeScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user, token } = useAuth();
    const controller = new AbortController();

    const [userList, setUserList] = useState<UserType[] | null>(null);
    const [loading, setLoading] = useState<Boolean>(true);

    //Use fonts
    const [fontsLoaded] = useFonts({
        'Montserrat-Medium': require('../../assets/fonts/Montserrat-Medium.ttf'),
        'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf')
    });

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

    if (loading || !fontsLoaded) {
        return (
            <View style={{ backgroundColor: '#13101c', flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#FF5864" />
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
                                    <LinearGradient
                                    style={styles.linearGradient}
                                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,.8)']}>
                                        <Text style={styles.cardText}>{card.name}, {card.age}</Text>
                                    </LinearGradient>
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
    cardsContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: '#13101c',
        padding: 0
    },
    card: {
        backgroundColor: "#FF5864",
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative'

    },
    cardImage: {
        height: '100%',
        width: 'auto'
    },
    linearGradient: {
        height: '20%',
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    cardText: {
        fontFamily: 'Quicksand-Bold',
        fontSize: 30,
        marginLeft: 30,
        marginTop: 10,
        color: '#fff',
    }
});