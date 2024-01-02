import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import useAuth from '../../hooks/useAuth';

const LoginScreen: React.FC = () => {

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, }}>
      <ImageBackground
        source={{ uri: "http://tinder.com/static/tinder.png" }}
        resizeMode='cover'
        style={{ flex: 1, }}>
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.buttonText}>Sign in & get swiping</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
};

export default LoginScreen;

const styles = StyleSheet.create({
  signInButton: {
    position: 'absolute',
    bottom: 40,
    width: 200,
    backgroundColor: 'white',
    alignSelf: 'center',
    padding: 12,
    borderRadius: 14,
  },
  buttonText: {
    textAlign: 'center',

  }
})