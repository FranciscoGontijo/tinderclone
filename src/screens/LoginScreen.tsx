import React from 'react';
import { View, Text } from 'react-native';
import useAuth from '../../hooks/useAuth';

const LoginScreen = () => {
  const { user } = useAuth();

  return (
    <View>
        <Text>This is Login Screen</Text>
    </View>
  )
};

export default LoginScreen;

