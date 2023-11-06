import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <View>
            <Text>I am Home Screen</Text>
            <Button title="Click here" onPress={() => navigation.navigate('Chat')} />
        </View>
    )
};

export default HomeScreen;