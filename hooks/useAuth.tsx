import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as auth from '../src/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

//build the fucking server

//Change user to token... need to retrive user name and liked list. 
//Create a matched list as well, faster to retrive than to make the hole logic of matching and retriving the chat list



interface userType {
    name: string;
    email: string;
    likedList: string[];
    _id: string;
    photoUrl: string;
}

interface AuthContextType {
    signed: boolean;
    user: userType | null;
    setUser: React.Dispatch<React.SetStateAction<userType | null>>;
    signUp(name: string, email: string, password: string): Promise<void>;
    logIn(email: string, password: string): Promise<void>;
    signOut(): void;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    token: string | null;
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
    token: null
};

const AuthContext = createContext<AuthContextType>(initialContextValue);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<userType | null>(null);
    const [token,setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


    const logIn = async (email: string, password: string): Promise<void> => {
        const response = await auth.logIn(email, password);
        if (response) {
            setToken(response.token);
            setUser(response.user);

            response.user && await AsyncStorage.setItem('@CloneTinder:user', JSON.stringify(response.user));
            response.token && await AsyncStorage.setItem('@CloneTinder:token', response.token);
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
            setLoading,
            token
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