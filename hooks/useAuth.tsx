import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as auth from '../src/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../src/services/api';

//change AuthContextType with new user type that has all the information about the user and a token

interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    signed: boolean;
    token: string | null;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    signIn(): Promise<void>;
    signOut(): void;
    loading: boolean;
};

const initialContextValue: AuthContextType = {
    signed: false,
    token: null,
    user: null,
    setUser: () => { },
    signIn: async () => { },
    signOut: () => { },
    loading: true,
};

const AuthContext = createContext<AuthContextType>(initialContextValue);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);


    const signIn = async (): Promise<void> => {
        const response = await auth.signIn();
        setUser(response.user);

        api.defaults.headers.Authorization = `Baerer ${response.token}`;

        console.log(response);
        await AsyncStorage.setItem('@CloneTinder:user', JSON.stringify(response.user));
        await AsyncStorage.setItem('@CloneTinder:token', response.token);
    };
    

    const signOut = async (): Promise<void> => {
        await AsyncStorage.clear();
        setUser(null);
    };


    useEffect(() => {
        async function loadStorageData() {
            const storagedUser = await AsyncStorage.getItem('@RNAuth:user');
            const storagedToken = await AsyncStorage.getItem('@RNAuth:token');

            if (storagedUser && storagedToken) {
                setUser(JSON.parse(storagedUser));
                api.defaults.headers.Authorization = `Baerer ${storagedToken}`;
            }
            setLoading(false);
        };

        loadStorageData();
    }, []);


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#666" />
            </View>
        );
    };


    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            token: '',
            signed: Boolean(user),
            signIn,
            signOut,
            loading,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};