import React, { createContext, useContext, ReactNode, useState } from 'react';
import * as auth from '../src/services/auth';

//change AuthContextType with new user type that has all the information about the user and a token

interface AuthContextType {
    signed: boolean;
    token: string | null;
    user: object | null;
    setUser: React.Dispatch<React.SetStateAction<object | null>>;
    signIn(): Promise<void>;
};

const initialContextValue: AuthContextType = {
    signed: false,
    token: null,
    user: null,
    setUser: () => { },
    signIn: async () => { },
};

const AuthContext = createContext<AuthContextType>(initialContextValue);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<object | null>(null);

    const signIn = async (): Promise<void> => {
        const response = await auth.signIn();
        setUser(response.user);
        console.log(response);
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            token: '',
            signed: Boolean(user),
            signIn
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