import React, { createContext, useContext, ReactNode, useState } from 'react';
import { View, Text } from 'react-native';

interface AuthContextType {
    user: string | null;
    setUser: React.Dispatch<React.SetStateAction<string | null>>;
}

const initialContextValue: AuthContextType = {
    user: null,
    setUser: () => { },
};
const AuthContext = createContext<AuthContextType>(initialContextValue);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
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