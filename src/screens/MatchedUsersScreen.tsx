import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

import useAuth from '../../hooks/useAuth';

type MatchedUserType = {
    name: string;
    photoUrl: string;
}

const MatchedUsersScreen = () => {
    const [matchedList, setMatchedList] = useState<MatchedUserType[] | null>(null);
    const [loading, setLoading] = useState<Boolean>(true);

    const navigation = useNavigation();
    const controller = new AbortController();
    const { user, signOut, token } = useAuth();


    //import matched list and display as a flat list with last message displayed underneath the user name
    useEffect(() => {
        const fetchMatchedUsersList = async () => {
            try {
                const response = await api.get('/matchedlist', {
                    signal: controller.signal,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                setMatchedList(response.data);
                setLoading(false);
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        //setLoading(true);
        fetchMatchedUsersList();

        return () => {
            controller.abort();
        }
    }, []);

    return (
        <View>
            {matchedList && <FlatList
                data={matchedList}
                renderItem={({ item }) => (
                    <Text>{item.name}</Text>
                )} />}
            <Text>Matched Screen</Text>
            <Button title="Back Home" onPress={() => navigation.navigate('Home')} />
        </View>
    )
};

export default MatchedUsersScreen
