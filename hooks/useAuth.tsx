import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as auth from '../src/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../src/services/api';

//change AuthContextType with new user type that has all the information about the user and a token

//use axios to make auth with the new server

//build the fucking server


interface userType {
    name: string;
    email: string;
    likedList: string[];
}

interface AuthContextType {
    signed: boolean;
    user: userType | null;
    setUser: React.Dispatch<React.SetStateAction<userType | null>>;
    signUp(name: string, email: string, password: string): Promise<void>;
    logIn(email: String, password: String): Promise<void>;
    signOut(): void;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

//great chance that logIn initial value will be wrong

const initialContextValue: AuthContextType = {
    signed: false,
    user: null,
    setUser: () => { },
    signUp: async (name: string, email: string, password: string) => { },
    logIn: async (email: string, password: string) => { },
    signOut: () => { },
    loading: true,
    setLoading: () => { },
};

const AuthContext = createContext<AuthContextType>(initialContextValue);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<userType | null>(null);
    const [loading, setLoading] = useState(true);


    const logIn = async (email: string, password: string): Promise<void> => {
        const response = await auth.logIn(email, password);
        if (response) {
            setUser(response);

            console.log(response);
            await AsyncStorage.setItem('@CloneTinder:user', JSON.stringify(response));

        } else {
            console.log('Not working');
        }
    };

    const signUp = async (name: string, email: string, password: string): Promise<void> => {
        const response: userType | null = await auth.signUp(name, email, password);
        if (response) {
            setUser(response);
            await AsyncStorage.setItem('@CloneTinder:user', JSON.stringify(response));
        } else {
            console.log('Not working');
        }
    };


    const signOut = async (): Promise<void> => {
        await AsyncStorage.clear();
        setUser(null);
    };


    useEffect(() => {
        async function loadStorageData() {
            const storagedUser = await AsyncStorage.getItem('@RNAuth:user');

            if (storagedUser) {
                setUser(JSON.parse(storagedUser));
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
            signed: Boolean(user),
            signUp,
            logIn,
            signOut,
            loading,
            setLoading
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